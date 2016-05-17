geosite.filters["formatBreakpoint"] = function()
{
    return function(value)
    {
      if(Number.isInteger(value))
      {
        return geosite.filters["formatInteger"]()(value, 'delimited', ' ');
      }
      else if($.isNumeric(value))
      {
        return geosite.filters["formatFloat"]()(value, 2);
      }
      else
      {
        return "" + value;
      }
    };
};
