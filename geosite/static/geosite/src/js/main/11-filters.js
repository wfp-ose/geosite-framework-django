geosite.filters = {};

geosite.filters["first"] = function()
{
    return function(array)
    {
        if (!Array.isArray(array))
        {
            return array;
        }
        return array[0];
    };
};

geosite.filters["md2html"] = function()
{
  return function(text)
  {
    if(text != undefined)
    {
      var converter = new showdown.Converter();
      html = converter.makeHtml(text);
      html = html.substring("<p>".length, html.length - "</p>".length);
      var pattern = new RegExp("(<a .*)>(.*?)</a>", "gi");
      html = html.replace(pattern, '$1 target="_blank">$2</a>');
      return html;
    }
    else
    {
      return "";
    }
  };
};

geosite.filters["default"] = function()
{
  return function(value, fallback)
  {
    return value || fallback;
  };
};

geosite.filters["tabLabel"] = function()
{
  return function(value)
  {
    return value.split(" ").length == 2 ? value.replace(' ', '<br>') : value;
  };
};
