geosite.tilemath = {
  "D2R": Math.PI / 180,
  "R2D": 180 / Math.PI
};

geosite.tilemath.point_to_bbox = function(x, y, z, digits)
{
  var radius = geosite.tilemath.point_to_radius(z);
  var e = x + radius; if(digits != undefined && digits >= 0){e = e.toFixed(digits);}
  var w = x - radius; if(digits != undefined && digits >= 0){w = w.toFixed(digits);}
  var s = y - radius; if(digits != undefined && digits >= 0){s = s.toFixed(digits);}
  var n = y + radius; if(digits != undefined && digits >= 0){n = n.toFixed(digits);}
  return [w, s, e, n];
};

geosite.tilemath.point_to_radius = function(z)
{
  return 4.0 / z;
};

geosite.tilemath.tms_to_bbox = function(x, y, z)
{
  var e = geosite.tilemath.tile_to_lon(x+1, z);
  var w = geosite.tilemath.tile_to_lon(x, z);
  var s = geosite.tilemath.tile_to_lat(y+1, z);
  var n = geosite.tilemath.tile_to_lat(y, z);
  return [w, s, e, n];
};


geosite.tilemath.tile_to_lon = function(x, z)
{
  return x / Math.pow(2, z) * 360-180;
};


geosite.tilemath.tile_to_lat = function(y, z)
{
  n = Math.pi - 2 * Math.PI * y / Math.pow(2,z);
  return ( R2D * Math.atan(0.5 * ( Math.exp(n) - Math.exp(-n))));
};
