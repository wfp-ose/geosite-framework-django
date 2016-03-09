var geosite = {};


geosite.assert_float = function(x, fallback)
{
  if(x === undefined || x === "")
  {
    return fallback;
  }
  else if(angular.isNumber(x))
  {
    return x;
  }
  else
  {
    return parseFloat(x);
  }
};

geosite.assert_array_length = function(x, length, fallback)
{
  if(x === undefined || x === "")
  {
    return fallback;
  }
  else if(angular.isString(x))
  {
    x = x.split(",");
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
  else if(angular.isArray(x))
  {
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
};

geosite.intend = function(name, data, scope)
{
    scope.$emit(name, data);
};

geosite.init_intents = function(element, scope)
{
  element.on('click', '.geosite-intent', function(event) {
    event.preventDefault();  // For anchor tags
    var that = $(this);
    if(that.hasClass('geosite-toggle'))
    {
      if(that.hasClass('geosite-off'))
      {
        that.removeClass('geosite-off');
        geosite.intend(that.data('intent-names')[0], that.data('intent-data'), scope);
      }
      else
      {
        that.addClass('geosite-off');
        geosite.intend(that.data('intent-names')[1], that.data('intent-data'), scope);
      }
    }
    else if(that.hasClass('geosite-radio'))
    {
      var siblings = that.parents('.geosite-radio-group:first').find(".geosite-radio").not(that);
      if(!(that.hasClass('geosite-on')))
      {
        that.addClass('geosite-on');
        if(that.data("intent-class-on"))
        {
          that.addClass(that.data("intent-class-on"));
          siblings.removeClass(that.data("intent-class-on"));
        }
        siblings.removeClass('geosite-on');
        if(that.data("intent-class-off"))
        {
          that.removeClass(that.data("intent-class-off"));
          siblings.addClass(that.data("intent-class-off"));
        }
        geosite.intend(that.data('intent-name'), that.data('intent-data'), scope);
      }
    }
    else
    {
      geosite.intend(that.data('intent-name'), that.data('intent-data'), scope);
    }
  });
};


geosite.controller_base = function($scope, $element) {

  this.intend = geosite.intend;

  geosite.init_intents($($element), $scope);

};

geosite.init_controller_base = function(app)
{
  app.controller("GeositeControllerBase", geosite.controller_base);
};

geosite.init_controller = function(that, app, controller)
{
  var controllerName = that.data('controllerName');
  var controllerType = that.data('controllerType');

  app.controller(controllerName, controller || geosite.controller_base);
};

geosite.init_controllers = function(that, app, controllers)
{
  for(var i = 0; i < controllers.length; i++)
  {
    var c = controllers[i];
    $(c.selector, that).each(function(){
        try
        {
          geosite.init_controller($(this), app, c.controller);
        }
        catch(err)
        {
          console.log("Could not load Geosite Controller \""+c.selector+"\"", err);
        }
    });
  }
};

/**
 * init_state will overwrite the default state from the server with params in the url.
 * @param {Object} state - Initial state from server
 */
geosite.init_state = function(state, stateschema)
{
  var newState = $.extend({}, state);

  // Update View
  var lat = getHashValueAsFloat(["latitude", "lat", "y"]) || state["lat"] || 0.0;
  var lon = getHashValueAsFloat(["longitude", "lon", "long", "lng", "x"]) || state["lon"] || 0.0;
  var z = getHashValueAsInteger(["zoom", "z"]) || state["z"] || 3;
  var delta = {'lat': lat, 'lon': lon, 'z': z};
  newState["view"] = newState["view"] != undefined ? $.extend(newState["view"], delta) : delta;

  // Update Filters
  if(newState["filters"] != undefined)
  {
    $.each(newState["filters"], function(layer_id, layer_filters){
      $.each(layer_filters, function(filter_id, filer_value){
        var type = stateschema["filters"][layer_id][filter_id].toLowerCase();
        var value = getHashValue(layer_id+":"+filter_id, type);
        if(value != undefined && value != "")
        {
          newState["filters"][layer_id][filter_id] = value;
        }
      });
    });
  }

  return newState;
};

/**
 * Initializes a filter slider's label
 * @constructor
 * @param {Object} that - DOM element for slider
 * @param {string} type - Either ordinal or continuous
 * @param {Object} range - Either true, "min", or "max".
 * @param {Object} value - If range is true, then integer array, else integer.
 */
geosite.ui_init_slider_label = function(that, type, range, value)
{
  if(type=="ordinal")
  {
    var h = that.data('label-template').replace(
      new RegExp('{{(\\s*)value(\\s*)}}', 'gi'),
      value);
    that.data('label').html(h);
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(s?).0(\\s*)}}', 'gi'), value[0])
        .replace(new RegExp('{{(\\s*)value(s?).1(\\s*)}}', 'gi'), value[1]);
      that.data('label').html(h);
    }
    else if(range=="min" || range=="max")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), value);
      that.data('label').html(h);
    }
  }
};

/**
 * Initializes a filter slider's label
 * @constructor
 * @param {Object} that - DOM element for slider
 * @param {string} type - Either ordinal or continuous
 * @param {Object} range - Either true, "min", or "max".
 * @param {Object} value - If range is true, then integer array, else integer.
 */
geosite.ui_init_slider_slider = function($scope, that, type, range, value, minValue, maxValue, step)
{
  if(type=="ordinal")
  {
    that.slider({
      range: (range.toLowerCase() == "true") ? true : range,
      value: value,
      min: 0,
      max: maxValue,
      step: 1,
      slide: function(event, ui) {
          geosite.ui_update_slider_label.apply(this, [event, ui]);
          var output = that.data('output');
          var newValue = that.data('options')[ui.value];
          var filter = {};
          filter[output] = newValue;
          geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
      }
    });
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      that.slider({
        range: true,
        values: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geosite.ui_update_slider_label.apply(this, [event, ui]);
            var output = that.data('output');
            var newValue = ui.values;
            var filter = {};
            filter[output] = newValue;
            geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
    else if(range=="min" || range=="max")
    {
      that.slider({
        range: range,
        value: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geosite.ui_update_slider_label.apply(this, [event, ui]);
            var output = that.data('output');
            var newValue = ui.value / 100.0;
            var filter = {};
            filter[output] = newValue;
            geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
  }
};


/**
 * Updates a filter slider's label
 * @constructor
 * @param {Object} event - A jQuery UI event object
 * @param {Object} author - A jQuery UI ui object
 */
geosite.ui_update_slider_label = function(event, ui)
{
  var that = $(this);
  var type = that.data('type');
  var range = that.data('range');

  if(type=="ordinal")
  {
    var v2 = that.data('options')[ui.value];
    var h = that.data('label-template')
      .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), v2);
    that.data('label').html(h);
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(s?).0(\\s*)}}', 'gi'), (ui.values[0]))
        .replace(new RegExp('{{(\\s*)value(s?).1(\\s*)}}', 'gi'), (ui.values[1]));
      that.data('label').html(h);
    }
    else if(range=="min" || range=="max")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), (ui.value / 100.0));
      that.data('label').html(h);
    }
  }
};

var getHashValue = function(keys, type)
{
    var value = undefined;
    if(typeof keys === 'string')
    {
      keys = [keys.toLowerCase()];
    }
    else
    {
      keys = $.map(keys,function(value, i){return value.toLowerCase();});
    }
    var hash_lc = location.hash.toLowerCase();
    for(var i = 0; i < keys.length; i++)
    {
      var key = keys[i];
      var keyAndHash = hash_lc.match(new RegExp(key + '=([^&]*)'));
      if(keyAndHash)
      {
          value = keyAndHash[1];
          if(value != undefined && value != null && value != "")
          {
            break;
          }
      }
    }

    if(type != undefined)
    {
        if(type == "integer")
        {
          value = (value != undefined && value != null && value != "") ? parseInt(value, 10) : undefined;
        }
        else if(type == "integerarray")
        {
          if(value != undefined)
          {
            var sValue = value.split(",");
            var newValue = [];
            for(var i = 0; i < sValue.length; i++)
            {
              var v = sValue[i];
              newValue.push((v != undefined && v != null && v != "") ? parseInt(v, 10) : undefined);
            }
            value = newValue;
          }
        }
        else if(type == "float")
        {
          value = (value != undefined && value != null && value != "") ? parseFloat(value) : undefined;
        }
        else if(type == "floatarray")
        {
          if(value !=undefined)
          {
            var sValue = value.split(",");
            var newValue = [];
            for(var i = 0; i < sValue.length; i++)
            {
              var v = sValue[i];
              newValue.push((v != undefined && v != null && v != "") ? parseFloat(v) : undefined);
            }
            value = newValue;
          }
        }
    }
    return value;
};
var hasHashValue = function(keys)
{
    var value = getHashValue(keys);
    return value != undefined && value != null && value != "";
};
var getHashValueAsInteger = function(keys)
{
  return getHashValue(keys, "integer");
};
var getHashValueAsIntegerArray = function(keys)
{
  return getHashValue(keys, "integerarray");
};
var getHashValueAsFloat = function(keys)
{
  return getHashValue(keys, "float");
};
var sortLayers = function(layers, reverse)
{
  var renderLayers = $.isArray(layers) ? layers : $.map(layers, function(layer){return layer;});
  renderLayers = renderLayers.sort(function(a, b){
      return a.options.renderOrder - b.options.renderOrder;
  });
  if(reverse === true)
    renderLayers.reverse();
  return renderLayers;
};
var updateRenderOrder = function(layers)
{
    for(var i = 0; i < layers.length; i++)
    {
        layers[i].bringToFront();
    }
};
var layersAsArray = function(layers)
{
  return $.map(layers, function(layer, id){return {'id':id, 'layer':layer};});
};

geosite.codec = {};

geosite.codec.parseFeatures = function(response, fields_by_featuretype)
{
  var features = [];
  //$(response).find("FeatureCollection")  No need to search for featurecollection.  It IS the featurecollection
  $(response).find('gml\\:featuremember').each(function(){
      //var f = $(this).find(typeName.indexOf(":") != -1 ? typeName.substring(typeName.indexOf(":") + 1) : typeName);
      var f = $(this).children();
      var typeName = f.prop("tagName").toLowerCase();
      var attributes = geosite.codec.parseAttributes(f, fields_by_featuretype[typeName]);
      var coords = f.find("geonode\\:shape").find("gml\\:point").find("gml\\:coordinates").text().split(",");
      var geom = new L.LatLng(parseFloat(coords[1]), parseFloat(coords[0]));

      var newFeature = {
        'featuretype': typeName,
        'attributes': attributes,
        'geometry': geom};

      features.push(newFeature);
  });
  return features;
};
geosite.codec.parseAttributes  = function(element, fields)
{
  var attributes = {};
  for(var k = 0; k < fields.length; k++)
  {
    var field = fields[k];
    var attributeName = field['output'] || field['attribute'];
    attributes[attributeName] = undefined;
    var inputName = field['attribute'] || field['input'];
    var inputNames = inputName != undefined ? [inputName] : field['inputs'];
    if(inputNames!= undefined)
    {
      for(var l = 0; l < inputNames.length; l++)
      {
        var inputName = inputNames[l];
        if(element.find("geonode\\:"+inputName).length > 0)
        {
          attributes[attributeName] = element.find("geonode\\:"+inputName).text();
          break;
        }
      }
    }
  }
  return attributes;
};

geosite.popup = {};

geosite.popup.buildField = function(field, feature)
{
  var output = field["output"] || field["attribute"];
  var html = undefined;
  var bInclude = false;
  if(field.when != undefined)
  {
    if(field.when.toLowerCase() == "defined")
    {
      if(feature.attributes[output] != undefined)
      {
        bInclude = true;
      }
    }
    else
    {
      bInclude = true;
    }
  }
  else
  {
    bInclude = true;
  }

  if(bInclude)
  {
    if(field.type == "link")
    {
      var value = field.value != undefined ? field.value : "{{ attributes." + output + " }}";
      html = "<span><b>"+ field.label +":</b> <a target=\"_blank\" href=\""+field.url+"\">";
      html += value;
      html += "</a></span>";
    }
    else if(field.type == "date")
    {
      var value = undefined;
      if(field.value != undefined)
      {
        value = field.value;
      }
      else
      {
        var format = field.format || "medium";
        value = "{{ attributes." + output + " | date:'"+format+"'}}"
      }
      html = "<span><b>"+ field.label +":</b> "+value+"</span>";
    }
    else
    {
      html = "<span><b>"+ field.label +":</b> {{ attributes." + output + " }}</span>";
    }
  }
  return html;
};

geosite.popup.openPopup = function($interpolate, featureLayer, feature, location, map)
{
  var fl = featureLayer;
  var panes = fl.popup.panes;
  var paneContents = [];
  for(var i = 0; i < panes.length; i++)
  {
    var pane = panes[i];
    var popupFields = [];
    for(var j = 0; j < pane.fields.length; j++)
    {
      var popupField = geosite.popup.buildField(pane.fields[j], feature);
      if(popupField != undefined)
      {
        popupFields.push(popupField);
      }
    }
    var paneContent = popupFields.join("<br>");
    paneContents.push(paneContent);
  }

  var popupTemplate = undefined;
  if(panes.length > 1)
  {
    var tabs = [];
    var pane = panes[0];
    tabs.push("<li class=\"active\"><a data-toggle=\"tab\" href=\"#"+pane.id+"\">"+pane.tab.label+"</a></li>");
    for(var i = 1; i < panes.length; i++)
    {
      pane = panes[i];
      tabs.push("<li><a data-toggle=\"tab\" href=\"#"+pane.id+"\">"+pane.tab.label+"</a></li>");
    }
    var tab_html = "<ul class=\"nav nav-tabs nav-justified\">"+tabs.join("")+"</ul>";
    ///////////////
    var paneContentsWithWrapper = [];
    paneContentsWithWrapper.push("<div id=\""+panes[0].id+"\" class=\"tab-pane fade in active\">"+paneContents[0]+"</div>");
    for(var i = 1; i < panes.length; i++)
    {
      paneContentsWithWrapper.push("<div id=\""+panes[i].id+"\" class=\"tab-pane fade\">"+paneContents[i]+"</div>");
    }
    ///////////////
    var content_html = "<div class=\"tab-content\">"+paneContentsWithWrapper.join("")+"</div>";
    popupTemplate = tab_html + content_html;
  }
  else
  {
    popupTemplate = paneContents[0];
  }
  var popupContent = $interpolate(popupTemplate)(feature);
  var popup = new L.Popup({maxWidth: (fl.popup.maxWidth || 400)}, undefined);
  popup.setLatLng(new L.LatLng(location.lat, location.lon));
  popup.setContent(popupContent);
  map.openPopup(popup);
};

geosite.tilemath = {
  "D2R": Math.PI / 180,
  "R2D": 180 / Math.PI
};

geosite.tilemath.point_to_bbox = function(x, y, z, digits)
{
  var radius = geosite.tilemath.point_to_radius(z);
  var e = x + radius; if(digits != undefined && digits >= 0){e = e.toFixed(digits);}
  var w = x - radius; if(digits != undefined && digits >= 0){w = w.toFixed(digits);}
  var s = y - radius; if(digits != undefined && digits >= 0){s = s.toFixed(digits);}
  var n = y + radius; if(digits != undefined && digits >= 0){n = n.toFixed(digits);}
  return [w, s, e, n];
};

geosite.tilemath.point_to_radius = function(z)
{
  return 4.0 / z;
};

geosite.tilemath.tms_to_bbox = function(x, y, z)
{
  var e = geosite.tilemath.tile_to_lon(x+1, z);
  var w = geosite.tilemath.tile_to_lon(x, z);
  var s = geosite.tilemath.tile_to_lat(y+1, z);
  var n = geosite.tilemath.tile_to_lat(y, z);
  return [w, s, e, n];
};


geosite.tilemath.tile_to_lon = function(x, z)
{
  return x / Math.pow(2, z) * 360-180;
};


geosite.tilemath.tile_to_lat = function(y, z)
{
  n = Math.pi - 2 * Math.PI * y / Math.pow(2,z);
  return ( R2D * Math.atan(0.5 * ( Math.exp(n) - Math.exp(-n))));
};

geosite.http = {};

geosite.http.build_promises = function($http, urls)
{
  var promises = [];
  for(var i = 0; i < urls.length; i++)
  {
    var url = urls[i];
    var config = {};
    var promise = $http.get(url, config);
    promises.push(promise);
  }
  return promises;
};
geosite.http.build_features = function(responses, fields_by_featuretype)
{
  var features = [];
  for(var i = 0; i < responses.length; i++)
  {
    var response = responses[i];
    if(response.status == 200)
    {
      var data = response.data;
      features = features.concat(geosite.codec.parseFeatures(data, fields_by_featuretype));
    }
  }
  return features;
};

geosite.layers = {};

geosite.layers.aggregate_fields = function(featureLayer)
{
  var fields = [];
  for(var i = 0; i < featureLayer.popup.panes.length; i++)
  {
    fields = fields.concat(featureLayer.popup.panes[i].fields);
  }
  return fields;
};
geosite.layers.init_baselayers = function(map, baselayers)
{
  var layers = {};
  for(var i = 0; i < baselayers.length; i++)
  {
      var tl = baselayers[i];
      try{
        layers[tl.id] = L.tileLayer(tl.source.url, {
            id: tl.id,
            attribution: tl.source.attribution
        });
      }catch(err){console.log("Could not add baselayer "+i);}
  }
  return layers;
};
geosite.layers.init_featurelayer_post = function($scope, live, id, fl)
{
  if(fl != undefined)
  {
    fl.addTo(live["map"]);
    geosite.intend("layerLoaded", {'type':'featurelayer', 'layer': id}, $scope);
  }
  else
  {
    console.log("Could not add featurelayer "+id+" because it is undefined.");
  }
};
geosite.layers.init_featurelayer_wms = function($scope, live, map_config, id, layerConfig)
{
  //https://github.com/Leaflet/Leaflet/blob/master/src/layer/tile/TileLayer.WMS.js
  var w = layerConfig.wms;
  var fl = L.tileLayer.wms(w.url, {
    renderOrder: $.inArray(id, map_config.renderlayers),
    buffer: w.buffer || 0,
    version: w.version || "1.1.1",
    layers: w.layers.join(","),
    styles: w.styles ? w.styles.join(",") : '',
    format: w.format,
    transparent: w.transparent || false,
    attribution: layerConfig.source.attribution
  });
  live["featurelayers"][id] = fl;
  geosite.layers.init_featurelayer_post($scope, live, id, fl);
};
geosite.layers.init_featurelayer_geojson = function($scope, live, map_config, id, layerConfig)
{
  $.ajax({
    url: layerConfig.source.url,
    dataType: "json",
    success: function(response){
      var fl = L.geoJson(response, {
        attribution: layerConfig.source.attribution
      });
      live["featurelayers"][id] = fl;
      geosite.layers.init_featurelayer_post($scope, live, id, fl);
    }
  });
};
geosite.layers.init_featurelayer = function(id, layerConfig, $scope, live, map_config)
{
  if(layerConfig.enabled == undefined || layerConfig.enabled == true)
  {
    if(layerConfig.type.toLowerCase() == "geojson")
    {
      geosite.layers.init_featurelayer_geojson($scope, live, map_config, id, layerConfig);
    }
    else if(layerConfig.type.toLowerCase() == "wms")
    {
      geosite.layers.init_featurelayer_wms($scope, live, map_config, id, layerConfig);
    }
  }
};
geosite.layers.init_featurelayers = function(featureLayers, $scope, live, map_config)
{
  $.each(featureLayers, function(id, layerConfig){
    geosite.layers.init_featurelayer(id, layerConfig, $scope, live, map_config);
  });
};
