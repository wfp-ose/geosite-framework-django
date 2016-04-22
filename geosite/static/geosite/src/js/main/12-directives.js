geosite.directives = {};

//geosite-modal-layer-more
//geosite.directives["geositeModalLayerMore"] =

//geosite-modal-layer-more
//geosite.directives["geositeModalLayerCarto"] = 

geosite.directives["stopEvent"] = function(){
  return {
    restrict: 'EA',
    link: function(scope, element, attr){
      var events = attr.stopEvent.split(' ');
      var stopFunction = function(e) {
        e.stopPropagation();
      };
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        element.bind(event, stopFunction);
      }
    }
  };
};
