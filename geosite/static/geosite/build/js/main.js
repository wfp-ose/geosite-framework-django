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
  newState["view"] = $.extend(newState["view"], {'lat': lat, 'lon': lon, 'z': z});

  // Update Filters
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
