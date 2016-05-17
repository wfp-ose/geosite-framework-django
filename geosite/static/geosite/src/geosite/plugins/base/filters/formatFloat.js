geosite.filters["formatFloat"] = function()
{
  return function(value, decimals)
  {
    if(decimals != undefined)
    {
      return value.toFixed(decimals);
    }
    else
    {
      return value.toString();
    }
  };
};
