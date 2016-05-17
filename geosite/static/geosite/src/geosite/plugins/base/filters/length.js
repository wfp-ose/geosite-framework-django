geosite.filters["len"] = geosite.filters["length"] = function()
{
  return function(value)
  {
    if($.isArray(value))
    {
      return value.length;
    }
    else
    {
      return 0;
    }
  };
};
