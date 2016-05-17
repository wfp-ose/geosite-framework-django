geosite.filters["breakpoints"] = function()
{
    return function(style)
    {
      var breakpoints = geosite.breakpoints[style.styles.default.dynamic.options.breakpoints];
      if(breakpoints != undefined && breakpoints.length > 0)
      {
        return breakpoints;
      }
      else
      {
        return [];
      }
    };
};
