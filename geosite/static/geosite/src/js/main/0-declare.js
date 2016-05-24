var geosite = {
  'directives': {},
  'filters': {},
  'vecmath': {},
  'tilemath': {},
  'api': {}
};

geosite.api.welcome = function(options)
{
  options = options || {};
  var scope = options['$scope'] || options['scope'] || angular.element("#geosite-main").scope();
  var intentData = {
    "id": "geosite-modal-welcome",
    "dynamic": {},
    "static": {
      "welcome": scope.map_config["welcome"]
    }
  };
  geosite.intend("toggleModal", intentData, scope);
};

geosite.assert_float = function(x, fallback)
{
  if(x === undefined || x === "")
  {
    return fallback;
  }
  else if(angular.isNumber(x))
  {
    return x;
  }
  else
  {
    return parseFloat(x);
  }
};

geosite.assert_array_length = function(x, length, fallback)
{
  if(x === undefined || x === "")
  {
    return fallback;
  }
  else if(angular.isString(x))
  {
    x = x.split(",");
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
  else if(angular.isArray(x))
  {
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
};
