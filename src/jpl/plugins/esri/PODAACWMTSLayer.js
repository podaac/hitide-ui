/**
 * This class is to read from PO.DAAC's WMTS server. PO.DAAC runs an older build of the OnEarth software,
 * which for some reason has a different scale/resolution than what GIBS has, despite having the same
 * tilematrixset name.
 */
define([
    "dojo/_base/declare",
    "esri/layers/LOD",
    "esri/layers/WMTSLayer",
    "jpl/plugins/esri/GIBSWMTSLayer"
], function(declare, LOD, WMTSLayer, GIBSWMTSLayer) {
    return declare(GIBSWMTSLayer, {
        prefixre: /^([^?]+)/,
        servicere: /(SERVICE=[^&]+)/,
        requestre: /(REQUEST=[^&]+)/,
        versionre: /(VERSION=[^&]+)/,
        layerre: /(LAYER=[^&]+)/,
        stylere: /(STYLE=)[^&]+/,
        tilematrixsetre: /(TILEMATRIXSET=[^&]+)/,
        tilematrixre: /(TILEMATRIX=[^&]+)/,
        tilerowre: /(TILEROW=[^&]+)/,
        tilecolre: /(TILECOL=[^&]+)/,
        formatre: /(FORMAT=[^&]+)/,
        timere: /(TIME=[^&]+)/,
        getTileUrl: function (a, b, f) {
            a = this._levelToLevelValue[a];
            a = this.resourceUrls && 0 < this.resourceUrls.length ? this.resourceUrls[b %
            this.resourceUrls.length].template.replace(/\{Style\}/gi, this._style).replace(/\{TileMatrixSet\}/gi, this._tileMatrixSetId).replace(/\{TileMatrix\}/gi, a).replace(/\{TileRow\}/gi, b).replace(/\{TileCol\}/gi, f).replace(/\{dimensionValue\}/gi, this._dimension) : this.UrlTemplate.replace(/\{level\}/gi, a).replace(/\{row\}/gi, b).replace(/\{col\}/gi, f);
            if(this.datetime && this.datetime.length > 0) {
                a += "&TIME=" + this.datetime;
            }

            a = this.prefixre.exec(a)[1] + "?" +
            this.servicere.exec(a)[1] + "&" +
            this.requestre.exec(a)[1] + "&" +
            this.versionre.exec(a)[1] + "&" +
            this.layerre.exec(a)[1] + "&" +
            this.stylere.exec(a)[1] + "&" +
            this.tilematrixsetre.exec(a)[1] + "&" +
            this.tilematrixre.exec(a)[1] + "&" +
            this.tilerowre.exec(a)[1] + "&" +
            this.tilecolre.exec(a)[1] + "&" +
            this.formatre.exec(a)[1].replace("/", "%2F");
            if (this.timere.exec(a)) {
                a += "&" + this.timere.exec(a)[1];
            }
            return a = this.addTimestampToURL(a)
        },
        onLoad: function() {
            var tilematrixset = ["", "", "", "EPSG4326_16km", "", "", "EPSG4326_2km", "EPSG4326_1km", "EPSG4326_500m", "EPSG4326_250m", "", "", "EPSG4326_31m"];
            var resolution = 0.5631315220428238;
            var scale = 223632905.6114871;
            var lods = [];
            for(var i = 0; i < tilematrixset.length; i++) {
                if(tilematrixset[i] === this._tileMatrixSetId) {
                    break;
                }
                var lod = new LOD();
                lod.level = i;
                lod.levelValue = i + "";
                lod.scale = scale;
                lod.resolution = resolution;
                lods.push(lod);
                scale = scale/2;
                resolution = resolution/2;
            }
            this.layerInfo.tileInfo.lods = lods;
            this.inherited(arguments);
        }
    });
});