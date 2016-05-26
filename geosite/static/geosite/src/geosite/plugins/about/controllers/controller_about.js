geosite.controllers["controller_about"] = function(
  $scope, $element, $controller, $interpolate, state, map_config, live)
{
  angular.extend(this, $controller('GeositeControllerBase', {$element: $element, $scope: $scope}));
  //angular.extend(this, $controller('GeositeControllerModal', {$element: $element, $scope: $scope}));

};
