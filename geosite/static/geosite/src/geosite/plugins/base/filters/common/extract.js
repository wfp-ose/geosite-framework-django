geosite.filters["extract"] = function()
{
  var _extract = function(keyChain, node)
  {
    var obj = undefined;
    if(keyChain.length==0)
    {
      obj = node;
    }
    else
    {
      if(node!=undefined)
      {
        var newKeyChain = keyChain.slice(1);
        var newNode = Array.isArray(node) ? node[keyChain[0]]: node[""+keyChain[0]];
        obj = extract(newKeyChain, newNode);
      }
    }
    return obj;
  };

  var _expand = function(arr)
  {
    var newArray = [];
    for(var i = 0; i < arr.length; i++)
    {
      var value = arr[i];
      if(value.indexOf(".") != -1)
      {
        newArray = newArray.concat(value.split("."));
      }
      else
      {
        newArray.push(value);
      }
    }
    return newArray;
  }

  return function(node)
  {
    var keyChain = Array.prototype.slice.call(arguments, [1]);
    if(keyChain.length > 0)
    {
      return _extract(_expand(keyChain), node);
    }
    else
    {
      return null;
    }
  };
};
