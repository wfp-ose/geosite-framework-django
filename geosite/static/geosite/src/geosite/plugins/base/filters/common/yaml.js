geosite.filters["yaml"] = function()
{
  return function(value)
  {
    if(value != undefined)
    {
      return YAML.stringify(value, 4);
    }
    else
    {
      return "";
    }
  };
};
