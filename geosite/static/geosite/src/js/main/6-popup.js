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
