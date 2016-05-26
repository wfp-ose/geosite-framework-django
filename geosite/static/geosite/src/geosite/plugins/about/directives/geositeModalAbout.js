geosite.directives["geositeModalAbout"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    //scope: {
    //  layer: "=layer"
    //},
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'modal_about.tpl.html',
    link: function ($scope, element, attrs){
    }
  };
};
