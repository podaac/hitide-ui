//>>built
define(["require", "dojo/_base/array", "dojo/_base/config", "dojo/_base/Deferred", "dojo/_base/lang", "dojo/_base/url", "dojo/_base/xhr", "dojo/io/script", "dojo/io/iframe", "dojo/dom-construct", "dojo/io-query", "./kernel", "./config", "./sniff", "./lang", "./urlUtils", "./deferredUtils"], function(P, w, J, R, p, W, z, X, Y, S, T, l, Z, q, x, r, $) {
    function K(a) {
        a = new W(a);
        return (a.host + (a.port ? ":" + a.port : "")).toLowerCase()
    }

    function C(a, d, e, f) {
        var k = !1,
            n = !1,
            t;
        x.isDefined(d) && (p.isObject(d) ? (k = !!d.useProxy, n = !!d.usePost, t = d.crossOrigin) : k = !!d);
        a = p.mixin({},
            a);
        a._ssl && (a.url = a.url.replace(/^http:/i, "https:"));
        d = a.content;
        var h = a.url,
            g = e && a.form,
            s = m;
        t = x.isDefined(t) ? t : s.useCors;
        a.load = function(a) {
            var b;
            a && (a.error ? (b = p.mixin(Error(), a.error), b.log = J.isDebug) : "error" === a.status && (b = p.mixin(Error(), a), b.log = J.isDebug), b && !x.isDefined(b.httpCode) && (b.httpCode = b.code));
            return b || a
        };
        a.error = function(a, b) {
            b && b.xhr && b.xhr.abort();
            a instanceof Error || (a = p.mixin(Error(), a));
            a.log = J.isDebug;
            s.errorHandler(a, b);
            return a
        };
        a._token && (a.content = a.content || {}, a.content.token =
            a._token);
        var y = 0,
            A;
        d && h && (A = T.objectToQuery(d), y = A.length + h.length + 1, q("esri-url-encodes-apostrophe") && (y = A.replace(/'/g, "%27").length + h.length + 1));
        a.timeout = x.isDefined(a.timeout) ? a.timeout : s.timeout;
        a.handleAs = a.handleAs || "json";
        try {
            var u, v, b = t && r.canUseXhr(a.url) && !/https?:\/\/[^\/]+\/[^\/]+\/admin\/?(\/.*)?$/i.test(a.url),
                c = r.hasSameOrigin(a.url, window.location.href) || b,
                B = n || e || y > s.postLength ? !0 : !1,
                U = !c && -1 !== a.handleAs.indexOf("json") && a.callbackParamName && !e ? !0 : !1,
                D = r.getProxyRule(a.url) ||
                s.alwaysUseProxy || k || (!U || B) && !c ? !0 : !1;
            e && (!q("esri-file-upload") && !D && b) && (D = !0);
            if (D)
                if (u = r.getProxyUrl(h, t), v = u.path, u._xo && (b = !0), !B && v.length + 1 + y > s.postLength && (B = !0), a.url = v + "?" + h, B) a.content = p.mixin(u.query || {}, d);
                else {
                    var V = T.objectToQuery(p.mixin(u.query || {}, d));
                    V && (a.url += "?" + V);
                    a.content = null
                }
            if (U && !B) return !x.isDefined(a.isAsync) && 4 > q("ff") && (a.isAsync = !0), X.get(E ? E(a) : a);
            var F = a.headers;
            if (b && (!F || !F.hasOwnProperty("X-Requested-With"))) F = a.headers = F || {}, F["X-Requested-With"] = null;
            if (e) {
                var L =
                    a.callbackParamName || "callback.html",
                    C = a.callbackElementName || "textarea",
                    G, M, H, N, O = g.elements ? g.elements.length : 0,
                    Q;
                if (d = a.content)
                    for (G in d)
                        if (H = d[G], x.isDefined(H)) {
                            M = null;
                            for (N = 0; N < O; N++)
                                if (Q = g.elements[N], Q.name === G) {
                                    M = Q;
                                    break
                                }
                            M ? M.value = H : f ? g.append(G, H) : g.appendChild(S.create("input", {
                                type: "hidden",
                                name: G,
                                value: H
                            }))
                        }
                if (q("esri-file-upload")) w.forEach(g.elements, function(a) {
                    a.name === L && g.removeChild(a)
                }), a.contentType = !1, a.postData = f ? g : new FormData(g), delete a.form;
                else {
                    g.enctype = "multipart/form-data";
                    9 > q("ie") && (g.encoding = "multipart/form-data");
                    g.method = "post";
                    w.some(g.elements, function(a) {
                        return a.name === L
                    }) || g.appendChild(S.create("input", {
                        type: "hidden",
                        name: L,
                        value: C
                    }));
                    if (-1 !== h.toLowerCase().indexOf("addattachment") || -1 !== h.toLowerCase().indexOf("updateattachment")) a.url = h + (-1 === h.indexOf("?") ? "?" : "\x26") + L + "\x3d" + C, D && (a.url = v + "?" + a.url);
                    delete a.content
                }
            }
            if (b && !a.hasOwnProperty("withCredentials"))
                if (f = D ? v : h, -1 !== w.indexOf(m.webTierAuthServers, K(f))) a.withCredentials = !0;
                else if (l.id) {
                var I =
                    l.id.findServerInfo(f);
                I && I.webTierAuth && (a.withCredentials = !0)
            }
            a = E ? E(a) : a;
            return B ? e && !q("esri-file-upload") ? Y.send(a) : z.post(a) : z.get(a)
        } catch (P) {
            return e = new R, e.errback(a.error(P)), e
        }
    }

    function O(a) {
        var d = m._processedCorsServers,
            e = -1,
            e = r.canUseXhr(a, !0); - 1 < e && m.corsEnabledServers.splice(e, 1);
        d[K(a)] = 1;
        return e
    }

    function I(a) {
        var d = m._processedCorsServers;
        if (m.corsDetection && m.useCors) try {
            var e = K(a);
            q("esri-cors") && (a && -1 !== a.toLowerCase().indexOf("/rest/services") && !r.hasSameOrigin(a, window.location.href) &&
                !r.canUseXhr(a) && !d[e]) && (d[e] = -1, z.get({
                url: a.substring(0, a.toLowerCase().indexOf("/rest/") + 6) + "info",
                content: {
                    f: "json"
                },
                failOk: !0,
                handleAs: "json",
                headers: {
                    "X-Requested-With": null
                }
            }).then(function(f) {
                f ? (d[e] = 2, r.canUseXhr(a) || m.corsEnabledServers.push(e)) : d[e] = 1
            }, function(a) {
                d[e] = 1
            }))
        } catch (f) {
            console.log("esri._detectCors: an unknown error occurred while detecting CORS support")
        }
    }

    function n(a, d) {
        function e(b) {
            b._pendingDfd = C(a, d, y, s);
            if (!b._pendingDfd) {
                b.ioArgs = b._pendingDfd && b._pendingDfd.ioArgs;
                var c = Error("Deferred object is missing");
                c.log = J.isDebug;
                a._usrDfd = null;
                b.errback(c);
                b._pendingDfd = null;
                return b
            }
            b._pendingDfd.addCallback(function(d) {
                b.ioArgs = b._pendingDfd && b._pendingDfd.ioArgs;
                a._usrDfd = null;
                b.callback(d);
                b._pendingDfd = null
            }).addErrback(function(c) {
                var e, f, g;
                c && (e = c.code, f = c.subcode, g = (g = c.messageCode) && g.toUpperCase());
                if (c && 403 == e && (4 == f || c.message && -1 < c.message.toLowerCase().indexOf("ssl") && -1 === c.message.toLowerCase().indexOf("permission"))) {
                    if (!a._ssl) {
                        a._ssl = a._sslFromServer = !0;
                        a._usrDfd = b;
                        n(a, d);
                        return
                    }
                } else if (c && 415 == c.status) {
                    if (O(a.url), !a._err415) {
                        a._err415 = 1;
                        a._usrDfd = b;
                        n(a, d);
                        return
                    }
                } else if (l.id && -1 !== w.indexOf(l.id._errorCodes, e) && !l.id._isPublic(a.url) && !p && (403 != e || -1 === w.indexOf(aa, g) && (!x.isDefined(f) || 2 == f))) {
                    b._pendingDfd = l.id.getCredential(a.url, {
                        token: a._token,
                        error: c
                    });
                    b._pendingDfd.addCallback(function(c) {
                        a._token = c.token;
                        a._usrDfd = b;
                        a._credential = c;
                        a._ssl = a._sslFromServer || c.ssl;
                        n(a, d)
                    }).addErrback(function(c) {
                        a._usrDfd = null;
                        b.errback(c);
                        b._pendingDfd =
                            null
                    });
                    return
                }
                b.ioArgs = b._pendingDfd && b._pendingDfd.ioArgs;
                a._usrDfd = null;
                b.errback(c);
                b._pendingDfd = null
            })
        }
        a.url = r.fixUrl(a.url);
        d = d || {};
        var f, k = a.form,
            p = d.disableIdentityLookup,
            t = d._preLookup,
            h = !1;
        if (q("esri-workers") && !1 !== m.useWorkers)
            if (!0 === d.useWorkers || !0 === m.useWorkers) h = !0;
            else if (d.workerOptions) {
            var g = d.workerOptions;
            if (g.callback || g.worker && g.worker.worker instanceof Worker) h = !0
        }
        var s = k && k.append,
            y = k && (k.elements ? w.some(k.elements, function(a) {
                return "file" === a.type
            }) : s),
            A = -1 !== a.url.toLowerCase().indexOf("token\x3d") ||
            a.content && a.content.token || y && w.some(k.elements, function(a) {
                return "token" === a.name
            }) ? 1 : 0;
        I(a.url);
        if (a._usrDfd) f = a._usrDfd;
        else {
            f = new R($._dfdCanceller);
            f.addCallback(function(b) {
                /\/sharing\/rest\/accounts\/self/i.test(a.url) && (!A && !a._token && b.user && b.user.username) && m.webTierAuthServers.push(K(a.url));
                if (b = a._credential) {
                    var c = l.id.findServerInfo(b.server);
                    if (c = c && c.owningSystemUrl) c = c.replace(/\/?$/, "/sharing"), (b = l.id.findCredential(c, b.userId)) && -1 === l.id._getIdenticalSvcIdx(c, b) && b.resources.splice(0,
                        0, c)
                }
            });
            f.addBoth(function(b) {
                delete a._credential;
                if (b && (!q("ie") || !b.nodeType)) b._ssl = a._ssl
            });
            var u = a.load,
                v = a.error;
            u && f.addCallback(function(a) {
                var c = f._pendingDfd,
                    c = c && c.ioArgs;
                return u.call(c && c.args, a, c)
            });
            v && f.addErrback(function(a) {
                var c = f._pendingDfd,
                    c = c && c.ioArgs;
                return v.call(c && c.args, a, c)
            })
        } if (l.id && !A && !a._token && !l.id._isPublic(a.url) && (!p || t))
            if (k = l.id.findCredential(a.url)) a._token = k.token, a._ssl = k.ssl;
        h ? d.workerOptions && d.workerOptions.worker ? (z = d.workerOptions.worker, e(f)) : P(["./workers/RequestClient"],
            function(a) {
                if (d.workerOptions) {
                    var c = d.workerOptions;
                    z = a.getClient(c.callback, c.cbFunction)
                } else z = a.getClient();
                e(f)
            }) : e(f);
        return f
    }
    var E, m = Z.defaults.io,
        aa = ["COM_0056", "COM_0057"];
    n._request = C;
    n._disableCors = O;
    n._detectCors = I;
    n.setRequestPreCallback = function(a) {
        E = a
    };
    return n
});