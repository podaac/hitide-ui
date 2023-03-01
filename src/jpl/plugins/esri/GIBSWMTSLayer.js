define([
    "dojo/_base/declare",
    "esri/layers/WMTSLayer"
], function(declare, WMTSLayer) {
    return declare(WMTSLayer, {
        constructor: function(a, b, layerConfig) {
            WMTSLayer.prototype.constructor(a, b);
            this.layerConfig = layerConfig;
            this.id = layerConfig.productLabel;
            this.dateTime = "";
            if(this.layerConfig.wmts && this.layerConfig.wmts.dateTime) {
                this.dateTime = this.layerConfig.wmts.dateTime;
            }
        },
        setDateTime: function(dateTime) {
            this.dateTime = dateTime;
        },
        getTileUrl: function (a, b, f) {
            a = this._levelToLevelValue[a];
            a = this.resourceUrls && 0 < this.resourceUrls.length ? this.resourceUrls[b %
            this.resourceUrls.length].template.replace(/\{Style\}/gi, this._style).replace(/\{TileMatrixSet\}/gi, this._tileMatrixSetId).replace(/\{TileMatrix\}/gi, a).replace(/\{TileRow\}/gi, b).replace(/\{TileCol\}/gi, f).replace(/\{dimensionValue\}/gi, this._dimension) : this.UrlTemplate.replace(/\{level\}/gi, a).replace(/\{row\}/gi, b).replace(/\{col\}/gi, f);
            a = a.replace(/\{Time\}/gi, this.dateTime);
            return a = this.addTimestampToURL(a)
        }
    });
});