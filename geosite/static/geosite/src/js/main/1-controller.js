geosite.intend = function(name, data, scope)
{
    scope.$emit(name, data);
};

geosite.init_intents = function(element, scope)
{
  element.on('click', '.geosite-intent', function(event) {
    event.preventDefault();  // For anchor tags
    var that = $(this);
    if(that.hasClass('geosite-toggle'))
    {
      if(that.hasClass('geosite-off'))
      {
        that.removeClass('geosite-off');
        geosite.intend(that.data('intent-names')[0], that.data('intent-data'), scope);
      }
      else
      {
        that.addClass('geosite-off');
        geosite.intend(that.data('intent-names')[1], that.data('intent-data'), scope);
      }
    }
    else if(that.hasClass('geosite-radio'))
    {
      var siblings = that.parents('.geosite-radio-group:first').find(".geosite-radio").not(that);
      if(!(that.hasClass('geosite-on')))
      {
        that.addClass('geosite-on');
        if(that.data("intent-class-on"))
        {
          that.addClass(that.data("intent-class-on"));
          siblings.removeClass(that.data("intent-class-on"));
        }
        siblings.removeClass('geosite-on');
        if(that.data("intent-class-off"))
        {
          that.removeClass(that.data("intent-class-off"));
          siblings.addClass(that.data("intent-class-off"));
        }
        geosite.intend(that.data('intent-name'), that.data('intent-data'), scope);
      }
    }
    else
    {
      geosite.intend(that.data('intent-name'), that.data('intent-data'), scope);
    }
  });
};

geosite.controllers = {};

geosite.controllers.controller_base = function($scope, $element) {

  this.intend = geosite.intend;

  geosite.init_intents($($element), $scope);

};

geosite.init_controller_base = function(app)
{
  app.controller("GeositeControllerBase", geosite.controllers.controller_base);
};

geosite.init_controller = function(that, app, controller)
{
  var controllerName = that.data('controllerName');
  var controllerType = that.data('controllerType');

  app.controller(controllerName, controller || geosite.controllers.controller_base);
};

geosite.init_controllers = function(that, app, controllers)
{
  for(var i = 0; i < controllers.length; i++)
  {
    var c = controllers[i];
    $(c.selector, that).each(function(){
        try
        {
          geosite.init_controller($(this), app, c.controller);
        }
        catch(err)
        {
          console.log("Could not load Geosite Controller \""+c.selector+"\"", err);
        }
    });
  }
};
