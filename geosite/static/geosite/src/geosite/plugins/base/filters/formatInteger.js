geosite.filters["formatInteger"] = function()
{
  return function(value, type, delimiter)
  {
    if(type == "delimited")
    {
      delimiter = delimiter || ',';
      var str = value.toString();
      var pattern = new RegExp('(\\d+)(\\d{3})','gi');
      while(pattern.test(str)){str=str.replace(pattern,'$1'+ delimiter +'$2');}
      return str;
    }
    else
    {
      return value.toString();
    }
  };
};
