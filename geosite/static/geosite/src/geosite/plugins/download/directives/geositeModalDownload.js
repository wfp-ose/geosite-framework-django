geosite.directives["geositeModalDownload"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    //scope: {
    //  layer: "=layer"
    //},
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'modal_download.tpl.html',
    link: function ($scope, element, attrs){
    }
  };
};
