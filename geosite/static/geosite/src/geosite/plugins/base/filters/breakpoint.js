geosite.filters["breakpoint"] = function()
{
    return function(style, index)
    {
      var breakpoints = geosite.breakpoints[style.styles.default.dynamic.options.breakpoints];
      if(breakpoints != undefined && breakpoints.length > 0)
      {
        return breakpoints[index];
      }
      else
      {
        return -1;
      }
    };
};
