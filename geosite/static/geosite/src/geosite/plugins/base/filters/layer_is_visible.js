geosite.filters["layer_is_visible"] = function()
{
  return function(layerID, state)
  {
    state = state || $("#geosite-main").scope().state;
    var visibleFeatureLayers = state.view.featurelayers;
    return $.inArray(layerID, visibleFeatureLayers) != -1;
  };
};
