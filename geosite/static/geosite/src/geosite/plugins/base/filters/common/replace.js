geosite.filters["replace"] = function()
{
  return function(value, oldSubstring, newSubstring)
  {
      if(angular.isString(value))
      {
        if(angular.isString(oldSubstring) && angular.isString(newSubstring))
        {
          return value.replace(oldSubstring, newSubstring);
        }
        else
        {
          return value;
        }
      }
      else
      {
        return "";
      }
  };
};
