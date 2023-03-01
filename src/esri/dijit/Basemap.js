//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../request", "./BasemapLayer"], function(d, e, c, l, f, g, h) {
    return d(null, {
        declaredClass: "esri.dijit.Basemap",
        id: null,
        title: "",
        thumbnailUrl: null,
        layers: null,
        itemId: null,
        basemapGallery: null,
        constructor: function(a, k) {
            a = a || {};
            !a.layers && !a.itemId && console.error("esri.dijit.Basemap: unable to find the 'layers' property in parameters");
            this.id = a.id;
            this.itemId = a.itemId;
            this.layers = a.layers;
            this.title = a.title || "";
            this.thumbnailUrl =
                a.thumbnailUrl;
            this.basemapGallery = k
        },
        getLayers: function(a) {
            if (this.layers) return this.layers;
            if (this.itemId) return a = g({
                url: (a || f.dijit._arcgisUrl) + "/content/items/" + this.itemId + "/data",
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: c.hitch(this, function(a, c) {
                    if (this.basemapGallery) this.basemapGallery.onError("esri.dijit.Basemap: could not access basemap item.");
                    else console.error("esri.dijit.Basemap: could not access basemap item.")
                })
            }), a.addCallback(c.hitch(this, function(a, c) {
                if (a.baseMap) return this.layers = [], e.forEach(a.baseMap.baseMapLayers, function(a) {
                    var b = {};
                    a.url && (b.url = a.url);
                    a.type && (b.type = a.type);
                    a.isReference && (b.isReference = a.isReference);
                    a.displayLevels && (b.displayLevels = a.displayLevels);
                    a.visibleLayers && (b.visibleLayers = a.visibleLayers);
                    a.bandIds && (b.bandIds = a.bandIds);
                    this.layers.push(new h(b))
                }, this), this.layers;
                if (this.basemapGallery) this.basemapGallery.onError("esri.dijit.Basemap: could not access basemap item.");
                else console.error("esri.dijit.Basemap: could not access basemap item.");
                return []
            })), a
        }
    })
});