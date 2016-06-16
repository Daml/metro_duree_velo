(function () {
    "use strict";

    var geo = {};

    geo.Round = function (pos) {
        return Math.round(pos * 10000) / 10000;
    };

    // from: https://github.com/conveyal/otp.js/blob/master/lib/utils.js
    geo.DecodePolyline = function (polyline, factor) {
      if (typeof factor === "undefined") {
        factor = 0.00001;
      }

      var currentPosition = 0;
      var currentLat = 0;
      var currentLng = 0;

      var dataLength = polyline.length;

      var polylineLatLngs = [];

      while (currentPosition < dataLength) {
        var shift = 0;
        var result = 0;

        var byte;

        do {
          byte = polyline.charCodeAt(currentPosition++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);

        var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        currentLat += deltaLat;

        shift = 0;
        result = 0;

        do {
          byte = polyline.charCodeAt(currentPosition++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);

        var deltLng = ((result & 1) ? ~(result >> 1) : (result >> 1));

        currentLng += deltLng;

        polylineLatLngs.push(new L.LatLng(currentLat * factor, currentLng * factor));
      }

      return polylineLatLngs;
    };

    geo.Bearing = function(from, to) {
        var a, b, c, d, x, y;
        if (!(from instanceof L.LatLng)) {
          throw new TypeError('Bearing: from must be a L.LatLng');
        }
        if (!(to instanceof L.LatLng)) {
          throw new TypeError('Bearing: to must be a L.LatLng');
        }
        a = (to.lng * L.LatLng.DEG_TO_RAD) - (from.lng * L.LatLng.DEG_TO_RAD);
        b = to.lat * L.LatLng.DEG_TO_RAD;
        c = Math.cos(b);
        d = from.lat * L.LatLng.DEG_TO_RAD;
        y = Math.sin(a) * c;
        x = Math.cos(d) * Math.sin(b) - Math.sin(d) * c * Math.cos(a);
        return (Math.atan2(y, x) * L.LatLng.RAD_TO_DEG + 360) % 360;
    };

    // Export
    window.geo = geo;
}(window));
