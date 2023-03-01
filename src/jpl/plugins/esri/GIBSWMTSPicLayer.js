define([
    "dojo/_base/declare",
    "jpl/plugins/esri/GIBSWMTSLayer",
    "jpl/plugins/esri/PicassoReaderMixin"
], function(declare, GIBSWMTSLayer, PicassoReaderMixin) {
    return declare([GIBSWMTSLayer, PicassoReaderMixin], {
    });
});