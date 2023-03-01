define([
    "dojo/_base/declare",
    "cesium/Core/Cartographic",
    "cesium/Core/Cartesian3",
    "cesium/Core/WebMercatorProjection",
    "cesium/Core/defined"
], function (declare, Cartographic, Cartesian3, WebMercatorProjection, defined) {
    return declare(WebMercatorProjection, {
        project: function(cartographic, result) {
            var abslatitude = Math.abs(cartographic.latitude);

            var fullhemisphereinmeters = 7342230.13649868;
            var fullhemispheres = Math.floor(abslatitude / (Math.PI / 2));
            var partialhemispheres = abslatitude % (Math.PI / 2);
            if(fullhemispheres % 2 == 1) {
                partialhemispheres = Math.PI/2 - partialhemispheres;
            }

            var a = 6378137.0;
            var e = 0.0818191908426;
            var fe0 = 0;
            var lambda0 = 0;
            var fe1 = 30 / (180 / Math.PI);

            var fe = partialhemispheres;
            var lambda = cartographic.longitude;

            var k0 = Math.cos(fe1) / Math.sqrt(1 - Math.pow(e, 2) * Math.pow(Math.sin(fe1), 2));
            var q1 = (1 - Math.pow(e, 2));
            var q2 = Math.sin(fe) / (1 - Math.pow(e, 2) * Math.pow(Math.sin(fe), 2));
            var q3 = (1 / (2 * e)) * Math.log((1 - e * Math.sin(fe)) / (1 + e * Math.sin(fe)));
            var q = q1 * (q2 - q3);

            var x = a * k0 * (lambda - lambda0);
            var y = (a * q) / (2 * k0); // hardcode -90 due to roundoff errors
            var z = cartographic.height;

            if (fullhemispheres % 2 == 1) {
                y = fullhemisphereinmeters - y;
            }
            y += fullhemisphereinmeters * fullhemispheres;

            if (cartographic.latitude != 0) {
                y *= (cartographic.latitude / Math.abs(cartographic.latitude));
            }

            if (!defined(result)) {
                return new Cartesian3(x, y, z);
            }

            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        },
        unproject: function(cartesian, result) {
            if (!defined(cartesian)) {
                throw new DeveloperError('cartesian is required');
            }

            var absy = Math.abs(cartesian.y);

            var fullhemisphereinmeters = 7342230.13649868;
            var fullhemispheres = Math.floor(absy / fullhemisphereinmeters);
            var partialhemispheres = absy % fullhemisphereinmeters;
            if (fullhemispheres % 2 == 1) {
                partialhemispheres = fullhemisphereinmeters - partialhemispheres;
            }


            //>>includeEnd('debug');
            var a = 6378137.0;
            var e = 0.0818191908426;
            var fe0 = 0;
            var lambda0 = 0;
            var fe1 = 30 / (180 / Math.PI);

            var x = cartesian.x;
            var y = partialhemispheres;
            var fe = 90 / (180 / Math.PI);

            var k0 = Math.cos(fe1) / Math.sqrt(1 - Math.pow(e, 2) * Math.pow(Math.sin(fe1), 2));
            var q1 = (1 - Math.pow(e, 2));
            var q2 = Math.sin(fe) / (1 - Math.pow(e, 2) * Math.pow(Math.sin(fe), 2));
            var q3 = (1 / (2 * e)) * Math.log((1 - e * Math.sin(fe)) / (1 + e * Math.sin(fe)));
            var qp = q1 * (q2 - q3);

            var beta = Math.asin((2 * y * k0) / (a * qp));

            fe = beta + (Math.pow(e, 2) / 3 + 31 * Math.pow(e, 4) / 180 + 517 * Math.pow(e, 6) / 5040) * Math.sin(2 * beta)
            + (23 * Math.pow(e, 4) / 360 + 251 * Math.pow(e, 6) / 3780) * Math.sin(4 * beta)
            + (761 * Math.pow(e, 6) / 45360) * Math.sin(6 * beta);
            var lambda = lambda0 + x / (a * k0);

            var longitude = lambda;
            var latitude = fe;
            var height = cartesian.z;

            if (fullhemispheres % 2 == 1) {
                latitude = Math.PI / 2 - latitude;
            }
            latitude += Math.PI / 2 * fullhemispheres;

            if (cartesian.y != 0) {
                latitude *= (cartesian.y / Math.abs(cartesian.y));
            }

            if (!defined(result)) {
                return new Cartographic(longitude, latitude, height);
            }

            result.longitude = longitude;
            result.latitude = latitude;
            result.height = height;
            return result;
        }
    });
});