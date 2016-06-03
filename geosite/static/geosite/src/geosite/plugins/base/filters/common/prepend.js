geosite.filters["prepend"] = function()
{
  return function(value, arg)
  {
    if(Array.isArray(arg))
    {
      var arr = arg;
      return arr[value % arr.length] + value;
    }
    else if(arguments.length > 2)
    {
      var arr = Array.prototype.slice.call(arguments, [1]);
      return arr[value % arr.length] + value;
    }
    else
    {
      return arg + value;
    }
  };
};
