define([
    "dojo/_base/declare",
    "cesium/Core/Rectangle",
    "cesium/Core/WebMercatorTilingScheme",
    "jpl/plugins/cesium/GIBSSMAPProjection"
], function (declare, Rectangle, WebMercatorTilingScheme, GIBSSMAPProjection) {
    return declare(WebMercatorTilingScheme, {
        constructor: function(options) {
            this._projection = new GIBSSMAPProjection(this._ellipsoid);
            var southwest = this._projection.unproject(this._rectangleSouthwestInMeters);
            var northeast = this._projection.unproject(this._rectangleNortheastInMeters);
            this._rectangle = new Rectangle(southwest.longitude, southwest.latitude,
                northeast.longitude, northeast.latitude);
        }
    });
});