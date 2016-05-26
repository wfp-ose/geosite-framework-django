
geosite.controllers.controller_base = function($scope, $element) {

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
