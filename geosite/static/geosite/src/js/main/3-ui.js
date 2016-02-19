/**
 * Initializes a filter slider's label
 * @constructor
 * @param {Object} that - DOM element for slider
 * @param {string} type - Either ordinal or continuous
 * @param {Object} range - Either true, "min", or "max".
 * @param {Object} value - If range is true, then integer array, else integer.
 */
geosite.ui_init_slider_label = function(that, type, range, value)
{
  if(type=="ordinal")
  {
    var h = that.data('label-template').replace(
      new RegExp('{{(\\s*)value(\\s*)}}', 'gi'),
      value);
    that.data('label').html(h);
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(s?).0(\\s*)}}', 'gi'), value[0])
        .replace(new RegExp('{{(\\s*)value(s?).1(\\s*)}}', 'gi'), value[1]);
      that.data('label').html(h);
    }
    else if(range=="min" || range=="max")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), value);
      that.data('label').html(h);
    }
  }
};

/**
 * Initializes a filter slider's label
 * @constructor
 * @param {Object} that - DOM element for slider
 * @param {string} type - Either ordinal or continuous
 * @param {Object} range - Either true, "min", or "max".
 * @param {Object} value - If range is true, then integer array, else integer.
 */
geosite.ui_init_slider_slider = function($scope, that, type, range, value, minValue, maxValue, step)
{
  if(type=="ordinal")
  {
    that.slider({
      range: (range.toLowerCase() == "true") ? true : range,
      value: value,
      min: 0,
      max: maxValue,
      step: 1,
      slide: function(event, ui) {
          geosite.ui_update_slider_label.apply(this, [event, ui]);
          var output = that.data('output');
          var newValue = that.data('options')[ui.value];
          var filter = {};
          filter[output] = newValue;
          geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
      }
    });
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      that.slider({
        range: true,
        values: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geosite.ui_update_slider_label.apply(this, [event, ui]);
            var output = that.data('output');
            var newValue = ui.values;
            var filter = {};
            filter[output] = newValue;
            geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
    else if(range=="min" || range=="max")
    {
      that.slider({
        range: range,
        value: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geosite.ui_update_slider_label.apply(this, [event, ui]);
            var output = that.data('output');
            var newValue = ui.value / 100.0;
            var filter = {};
            filter[output] = newValue;
            geosite.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
  }
};


/**
 * Updates a filter slider's label
 * @constructor
 * @param {Object} event - A jQuery UI event object
 * @param {Object} author - A jQuery UI ui object
 */
geosite.ui_update_slider_label = function(event, ui)
{
  var that = $(this);
  var type = that.data('type');
  var range = that.data('range');

  if(type=="ordinal")
  {
    var v2 = that.data('options')[ui.value];
    var h = that.data('label-template')
      .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), v2);
    that.data('label').html(h);
  }
  else if(type=="continuous")
  {
    if(range.toLowerCase() == "true")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(s?).0(\\s*)}}', 'gi'), (ui.values[0]))
        .replace(new RegExp('{{(\\s*)value(s?).1(\\s*)}}', 'gi'), (ui.values[1]));
      that.data('label').html(h);
    }
    else if(range=="min" || range=="max")
    {
      var h = that.data('label-template')
        .replace(new RegExp('{{(\\s*)value(\\s*)}}', 'gi'), (ui.value / 100.0));
      that.data('label').html(h);
    }
  }
};
