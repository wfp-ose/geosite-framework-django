geosite.filters["layer_is_visible"] = function()
{
  return function(layerID, state)
  {
    state = state || $("#geosite-main").scope().state;
    var visibleFeatureLayers = state.view.featurelayers;
    return (layerID == state.view.baselayer) || $.inArray(layerID, visibleFeatureLayers) != -1;
  };
};
