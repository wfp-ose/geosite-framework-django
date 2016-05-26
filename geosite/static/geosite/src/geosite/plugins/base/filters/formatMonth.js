geosite.filters["formatMonth"] = function()
{
  return function(value, type)
  {
    if(type == "long")
    {
      return months_long[value-1];
    }
    else if(type == "short3" || type == "short_3")
    {
      return months_short_3[value-1];
    }
    else
    {
      return value.toString();
    }
  };
};