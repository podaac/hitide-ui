//>>built
define(["dojo/_base/kernel", "dojo/_base/config", "dojo/has"], function(b, c, a) {
    b = window.location;
    a = b.pathname;
    a = {
        version: "3.10",
        _appBaseUrl: b.protocol + "//" + b.host + a.substring(0, a.lastIndexOf(a.split("/")[a.split("/").length - 1]))
    };
    c.noGlobals || (window.esri = a);
    (a.dijit = a.dijit || {})._arcgisUrl = ("file:" === b.protocol ? "http:" : b.protocol) + "//www.arcgis.com/sharing/rest";
    return a
});