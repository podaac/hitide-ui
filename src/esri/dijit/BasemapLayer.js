//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(b, c, d, e) {
    return b(null, {
        declaredClass: "esri.dijit.BasemapLayer",
        constructor: function(a) {
            a = a || {};
            !a.url && !a.type && console.error("esri.dijit.BasemapLayer: unable to find the 'url' or 'type' property in parameters");
            this.url = a.url;
            this.type = a.type;
            this.isReference = !0 === a.isReference ? !0 : !1;
            this.opacity = a.opacity;
            this.visibleLayers = a.visibleLayers;
            this.displayLevels = a.displayLevels;
            this.bandIds = a.bandIds;
            this.copyright = a.copyright;
            this.subDomains = a.subDomains;
            this.fullExtent = a.fullExtent;
            this.initialExtent = a.initialExtent;
            this.tileInfo = a.tileInfo;
            this.tileServers = a.tileServers
        }
    })
});