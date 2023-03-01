define([
    "dojo/_base/declare",
    'cesium/Core/defined',
    'cesium/Core/DeveloperError',
    "cesium/Scene/WebMapServiceImageryProvider",
    'cesium/Scene/ImageryProvider'
], function(declare, defined, DeveloperError, WebMapServiceImageryProvider, ImageryProvider){
    return declare(WebMapServiceImageryProvider, {
        requestImage: function (x, y, level) {
            if (!this._ready) {
                throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
            }

            return ImageryProvider.loadImage(
                this,
                this.buildImageUrl(this, x, y, level)
            );
        },

        buildImageUrl: function(imageryProvider, x, y, level) {
            var url = imageryProvider._url;
            url += level + '/' + y + '/' + x;

            var proxy = imageryProvider._proxy;
            if (defined(proxy)) {
                url = proxy.getURL(url);
            }

            return url;
        }
    });
});