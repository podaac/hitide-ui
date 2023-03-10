//>>built
define(["dojo/_base/sniff", "./kernel"], function(a, m) {
    var c = a("ff"),
        d = a("ie"),
        g = a("webkit"),
        f = a("opera"),
        k = a("chrome"),
        l = a("safari"),
        h = navigator.userAgent,
        e;
    (e = h.match(/(iPhone|iPad|CPU)\s+OS\s+(\d+\_\d+)/i)) && a.add("esri-iphone", parseFloat(e[2].replace("_", ".")));
    (e = h.match(/Android\s+(\d+\.\d+)/i)) && a.add("esri-android", parseFloat(e[1]));
    (e = h.match(/Fennec\/(\d+\.\d+)/i)) && a.add("esri-fennec", parseFloat(e[1]));
    0 <= h.indexOf("BlackBerry") && 0 <= h.indexOf("WebKit") && a.add("esri-blackberry", 1);
    a.add("esri-touch",
        a("esri-iphone") || a("esri-android") || a("esri-blackberry") || 6 <= a("esri-fennec") || (c || g) && document.createTouch ? !0 : !1);
    a.add("esri-pointer", navigator.pointerEnabled || navigator.msPointerEnabled);
    m._getDOMAccessor = function(a) {
        var b = "";
        c ? b = "Moz" : g ? b = "Webkit" : d ? b = "ms" : f && (b = "O");
        return b + a.charAt(0).toUpperCase() + a.substr(1)
    };
    a.add("esri-phonegap", !!window.cordova);
    a.add("esri-cors", 4 <= k || 3.5 <= c || 4 <= l || 10 <= d || a("esri-phonegap"));
    a.add("esri-file-upload", window.FormData && window.FileList ? !0 : !1);
    a.add("esri-workers",
        window.Worker ? !0 : !1);
    a.add("esri-transforms", 9 <= d || 3.5 <= c || 4 <= k || 3.1 <= l || 10.5 <= f || 3.2 <= a("esri-iphone") || 2.1 <= a("esri-android"));
    a.add("esri-transitions", 10 <= d || 4 <= c || 4 <= k || 3.1 <= l || 10.5 <= f || 3.2 <= a("esri-iphone") || 2.1 <= a("esri-android"));
    a.add("esri-transforms3d", 11 <= d || 10 <= c || 12 <= k || 4 <= l || 3.2 <= a("esri-iphone") || 3 <= a("esri-android"));
    a.add("esri-url-encodes-apostrophe", function() {
        var a = window.document.createElement("a");
        a.href = "?'";
        return -1 < a.href.indexOf("?%27")
    });
    3 > a("esri-android") && (a.add("esri-transforms", !1, !1, !0), a.add("esri-transitions", !1, !1, !0), a.add("esri-transforms3d", !1, !1, !0));
    m._css = function(e) {
        var b = a("esri-transforms3d");
        if (void 0 !== e && null !== e) b = e;
        else if (b && (k || l && !a("esri-iphone"))) b = !1;
        var h = b ? "translate3d(" : "translate(",
            m = b ? k ? ",-1px)" : ",0px)" : ")",
            n = b ? "scale3d(" : "scale(",
            p = b ? ",1)" : ")",
            q = b ? "rotate3d(0,0,1," : "rotate(",
            r = b ? "matrix3d(" : "matrix(",
            s = b ? ",0,0," : ",",
            t = b ? ",0,0,0,0,1,0," : ",",
            u = b ? ",0,1)" : ")";
        return {
            names: {
                transition: g && "-webkit-transition" || c && "MozTransition" || f && "OTransition" ||
                    d && "msTransition",
                transform: g && "-webkit-transform" || c && "MozTransform" || f && "OTransform" || d && "msTransform",
                transformName: g && "-webkit-transform" || c && "-moz-transform" || f && "-o-transform" || d && "-ms-transform",
                origin: g && "-webkit-transform-origin" || c && "MozTransformOrigin" || f && "OTransformOrigin" || d && "msTransformOrigin",
                endEvent: g && "webkitTransitionEnd" || c && "transitionend" || f && "oTransitionEnd" || d && "MSTransitionEnd"
            },
            translate: function(a, b) {
                return h + a + "px," + b + "px" + m
            },
            scale: function(a) {
                return n + a + "," + a + p
            },
            rotate: function(a) {
                return q +
                    a + "deg)"
            },
            matrix: function(a) {
                return r + a.xx + "," + a.xy + s + a.yx + "," + a.yy + t + a.dx.toFixed(10) + (c ? "px," : ",") + a.dy.toFixed(10) + (c ? "px" : "") + u
            }
        }
    };
    return a
});