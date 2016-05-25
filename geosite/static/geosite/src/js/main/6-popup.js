geosite.popup = {};

geosite.popup.buildChart = function(chart, layer, feature, state)
{
  return "<div id=\""+chart.id+"\" class=\"geosite-popup-chart\"></div>"
}

geosite.popup.buildField = function(field, layer, feature, state)
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
      var value = field.value != undefined ? field.value : "{{ feature.attributes." + output + " }}";
      html = "<span><b>"+ field.label +":</b> <a target=\"_blank\" href=\""+field.url+"\">";
      html += value;
      html += "</a></span>";
    }
    else
    {
      var value = undefined;
      if(field.value != undefined)
      {
        value = field.value;
      }
      else
      {
        if(field.type == "date")
        {
          var format = field.format || "medium";
          value = "feature.attributes." + output + " | date:'"+format+"'"
        }
        else
        {
          value = "feature.attributes." + output
        }
        if(field.fallback)
        {
          value = "("+value+") || '"+field.fallback+"'"
        }
        value = "{{ "+value +" }}";
      }
      html = "<span><b>"+ field.label +":</b> "+value+"</span>";
    }
  }
  return html;
};

geosite.popup.buildPopupTemplate = function(popup, layer, feature, state)
{
  var panes = popup.panes;
  var popupTemplate = "";
  //////////////////
  if(angular.isDefined(popup.title))
  {
    popupTemplate += "<h5 style=\"word-wrap:break-word;text-align:center;\">"+popup.title+"</h5>";
  }
  //////////////////
  var paneContents = [];
  for(var i = 0; i < panes.length; i++)
  {
    var pane = panes[i];
    var popupFields = [];
    var popupCharts = [];
    if("fields" in pane)
    {
      for(var j = 0; j < pane.fields.length; j++)
      {
        var popupField = geosite.popup.buildField(pane.fields[j], layer, feature, state);
        if(popupField != undefined)
        {
          popupFields.push(popupField);
        }
      }  
    }
    if("charts" in pane)
    {
      for(var j = 0; j < pane.charts.length; j++)
      {
        var popupChart = geosite.popup.buildChart(pane.charts[j], layer, feature, state);
        if(popupChart != undefined)
        {
          popupCharts.push(popupChart);
        }
      }
    }
    var paneContent = popupFields.join("<br>");
    if(popupCharts.length > 0)
    {
      paneContent += "<hr>" + popupCharts.join("<br>");
    }
    paneContents.push(paneContent);
  }
  //////////////////
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
    popupTemplate += tab_html + content_html;
  }
  else
  {
    popupTemplate += paneContents[0];
  }
  return popupTemplate;
};

geosite.popup.buildPopupContent = function($interpolate, featureLayer, feature, state)
{
  var popupTemplate = geosite.popup.buildPopupTemplate(featureLayer.popup, featureLayer, feature, state);
  var ctx = {
    'layer': featureLayer,
    'feature': feature,
    'state': state
  };
  return $interpolate(popupTemplate)(ctx);
};

geosite.popup.openPopup = function($interpolate, featureLayer, feature, location, map, state)
{
  var popupContent = geosite.popup.buildPopupContent($interpolate, featureLayer, feature, state);
  var popup = new L.Popup({maxWidth: (featureLayer.popup.maxWidth || 400)}, undefined);
  popup.setLatLng(new L.LatLng(location.lat, location.lon));
  popup.setContent(popupContent);
  map.openPopup(popup);
};
