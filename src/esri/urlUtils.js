//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/url", "dojo/io-query", "./kernel", "./config", "./sniff", "dojo/i18n!./nls/jsapi"], function(k, r, n, p, s, t, q, u) {
    var e = {},
        l = t.defaults.io,
        m = window.location.protocol;
    "file:" === m && (m = "http:");
    e.urlToObject = function(a) {
        var b = a.indexOf("?");
        return -1 === b ? {
            path: a,
            query: null
        } : {
            path: a.substring(0, b),
            query: p.queryToObject(a.substring(b + 1))
        }
    };
    e.getProxyUrl = function(a, b) {
        var c = k.isString(a) ? 0 === k.trim(a).toLowerCase().indexOf("https:") : a,
            d = l.proxyUrl,
            f, g, h = u.io.proxyNotSet;
        if (k.isString(a) && (g = e.getProxyRule(a))) d = g.proxyUrl;
        if (!d) throw console.log(h), Error(h);
        c && (!1 !== b && 0 !== window.location.href.toLowerCase().indexOf("https:")) && (c = d, 0 !== c.toLowerCase().indexOf("http") && (c = e.getAbsoluteUrl(c)), c = c.replace(/^http:/i, "https:"), e.canUseXhr(c) && (d = c, f = 1));
        d = e.urlToObject(d);
        d._xo = f;
        return d
    };
    e.addProxy = function(a) {
        var b = e.getProxyRule(a),
            c;
        b ? c = e.urlToObject(b.proxyUrl) : l.alwaysUseProxy && (c = e.getProxyUrl());
        c && (b = e.urlToObject(a), a = c.path + "?" + b.path, (c = p.objectToQuery(k.mixin(c.query || {}, b.query))) && (a += "?" + c));
        return a
    };
    e.addProxyRule = function(a) {
        var b = a.urlPrefix = e.urlToObject(a.urlPrefix).path.replace(/([^\/])$/, "$1/").replace(/^https?:\/\//ig, "").toLowerCase(),
            c = l.proxyRules,
            d, f = c.length,
            g, h = f;
        for (d = 0; d < f; d++)
            if (g = c[d].urlPrefix, 0 === b.indexOf(g)) {
                if (b.length === g) return -1;
                h = d;
                break
            } else 0 === g.indexOf(b) && (h = d + 1);
        c.splice(h, 0, a);
        return h
    };
    e.getProxyRule = function(a) {
        var b = l.proxyRules,
            c = b.length,
            d = e.urlToObject(a).path.replace(/([^\/])$/, "$1/").replace(/^https?:\/\//ig, "").toLowerCase(),
            f;
        for (a = 0; a < c; a++)
            if (0 === d.indexOf(b[a].urlPrefix)) {
                f = b[a];
                break
            }
        return f
    };
    e.hasSameOrigin = function(a, b, c) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        var d = window.location.href.toLowerCase();
        a = 0 === a.indexOf("http") ? new n(a) : d = new n(d);
        b = 0 === b.indexOf("http") ? new n(b) : k.isString(d) ? new n(d) : d;
        return (c || a.scheme === b.scheme) && a.host === b.host && a.port === b.port
    };
    e.canUseXhr = function(a, b) {
        var c = q("esri-phonegap") ? !0 : !1,
            d = e.hasSameOrigin,
            f = l.corsEnabledServers,
            g, h = -1;
        !c && (q("esri-cors") && f && f.length) && (c = r.some(f,
            function(b, c) {
                g = 0 !== k.trim(b).toLowerCase().indexOf("http");
                return d(a, g ? "http://" + b : b) || g && d(a, "https://" + b) ? (h = c, !0) : !1
            }));
        return b ? h : c
    };
    e.getAbsoluteUrl = function(a) {
        return k.isString(a) && -1 === a.indexOf("http://") && -1 === a.indexOf("https://") ? 0 === a.indexOf("//") ? m + a : 0 === a.indexOf("/") ? m + "//" + window.location.host + a : s._appBaseUrl + a : a
    };
    e.fixUrl = function(a) {
        /^\/\//i.test(a) && (a = m + a);
        return a = a.replace(/^(https?:\/\/)(arcgis\.com)/i, "$1www.$2")
    };
    return e
});