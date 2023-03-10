//>>built
define(["dojo/_base/declare", "dojo/_base/config", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/_base/json", "dojo/_base/url", "dojo/sniff", "dojo/cookie", "dojo/io-query", "./kernel", "./config", "./lang", "./ServerInfo", "./urlUtils", "./deferredUtils", "./request", "./Evented", "./OAuthCredential", "./arcgis/OAuthInfo"], function(H, x, q, f, I, A, y, J, B, Q, r, C, w, D, s, K, E, L, M, R) {
    var z = {},
        F = function(a) {
            var b = (new y(a.owningSystemUrl)).host;
            a = (new y(a.server)).host;
            var c = /.+\.arcgis\.com$/i;
            return c.test(b) && c.test(a)
        },
        G = function(a,
            b) {
            return !(!F(a) || !b || !f.some(b, function(b) {
                return b.test(a.server)
            }))
        },
        u, P = H(L, {
            declaredClass: "esri.IdentityManagerBase",
            constructor: function() {
                this._portalConfig = q.getObject("esriGeowConfig");
                this.serverInfos = [];
                this.oAuthInfos = [];
                this.credentials = [];
                this._soReqs = [];
                this._xoReqs = [];
                this._portals = [];
                this._getOAuthHash()
            },
            defaultTokenValidity: 60,
            tokenValidity: null,
            signInPage: null,
            useSignInPage: !0,
            normalizeWebTierAuth: !1,
            _busy: null,
            _oAuthHash: null,
            _gwTokenUrl: "/sharing/generateToken",
            _agsRest: "/rest/services",
            _agsPortal: /\/sharing(\/|$)/i,
            _agsAdmin: /https?:\/\/[^\/]+\/[^\/]+\/admin\/?(\/.*)?$/i,
            _adminSvcs: /\/admin\/services(\/|$)/i,
            _agolSuffix: ".arcgis.com",
            _gwDomains: [{
                regex: /https?:\/\/www\.arcgis\.com/i,
                tokenServiceUrl: "https://www.arcgis.com/sharing/generateToken"
            }, {
                regex: /https?:\/\/dev\.arcgis\.com/i,
                tokenServiceUrl: "https://dev.arcgis.com/sharing/generateToken"
            }, {
                regex: /https?:\/\/.*dev[^.]*\.arcgis\.com/i,
                tokenServiceUrl: "https://devext.arcgis.com/sharing/generateToken"
            }, {
                regex: /https?:\/\/.*qa[^.]*\.arcgis\.com/i,
                tokenServiceUrl: "https://qaext.arcgis.com/sharing/generateToken"
            }, {
                regex: /https?:\/\/.*.arcgis\.com/i,
                tokenServiceUrl: "https://www.arcgis.com/sharing/generateToken"
            }],
            _legacyFed: [],
            _regexSDirUrl: /http.+\/rest\/services\/?/ig,
            _regexServerType: /(\/(MapServer|GeocodeServer|GPServer|GeometryServer|ImageServer|NAServer|FeatureServer|GeoDataServer|GlobeServer|MobileServer|GeoenrichmentServer)).*/ig,
            _gwUser: /http.+\/users\/([^\/]+)\/?.*/i,
            _gwItem: /http.+\/items\/([^\/]+)\/?.*/i,
            _gwGroup: /http.+\/groups\/([^\/]+)\/?.*/i,
            _errorCodes: [499, 498, 403, 401],
            _publicUrls: [/\/arcgis\/tokens/i, /\/sharing\/generatetoken/i, /\/rest\/info/i],
            registerServers: function(a) {
                var b = this.serverInfos;
                b ? (a = f.filter(a, function(a) {
                    return !this.findServerInfo(a.server)
                }, this), this.serverInfos = b.concat(a)) : this.serverInfos = a;
                f.forEach(a, function(a) {
                    a.owningSystemUrl && this._portals.push(a.owningSystemUrl);
                    if (a.hasPortal) {
                        this._portals.push(a.server);
                        var b = C.defaults.io.corsEnabledServers,
                            e = this._getOrigin(a.tokenServiceUrl);
                        s.canUseXhr(a.server) ||
                            b.push(a.server.replace(/^https?:\/\//i, ""));
                        s.canUseXhr(e) || b.push(e.replace(/^https?:\/\//i, ""))
                    }
                }, this)
            },
            registerOAuthInfos: function(a) {
                var b = this.oAuthInfos;
                b ? (a = f.filter(a, function(a) {
                    return !this.findOAuthInfo(a.portalUrl)
                }, this), this.oAuthInfos = b.concat(a)) : this.oAuthInfos = a
            },
            registerToken: function(a) {
                var b = this._sanitizeUrl(a.server),
                    c = this.findServerInfo(b),
                    d;
                c || (c = new D, c.server = this._getOrigin(b), c.tokenServiceUrl = this._getTokenSvcUrl(b), c.hasPortal = !0, this.registerServers([c]));
                (d = this.findCredential(b,
                    a.userId)) ? q.mixin(d, a) : (d = new u({
                    userId: a.userId,
                    server: c.server,
                    token: a.token,
                    expires: a.expires,
                    ssl: a.ssl,
                    scope: this._isServerRsrc(b) ? "server" : "portal"
                }), d.resources = [b], this.credentials.push(d));
                d.onTokenChange(!1)
            },
            toJson: function() {
                return w.fixJson({
                    serverInfos: f.map(this.serverInfos, function(a) {
                        return a.toJson()
                    }),
                    oAuthInfos: f.map(this.oAuthInfos, function(a) {
                        return a.toJson()
                    }),
                    credentials: f.map(this.credentials, function(a) {
                        return a.toJson()
                    })
                })
            },
            initialize: function(a) {
                if (a) {
                    q.isString(a) &&
                        (a = A.fromJson(a));
                    var b = a.serverInfos,
                        c = a.oAuthInfos;
                    a = a.credentials;
                    if (b) {
                        var d = [];
                        f.forEach(b, function(a) {
                            a.server && a.tokenServiceUrl && d.push(a.declaredClass ? a : new D(a))
                        });
                        d.length && this.registerServers(d)
                    }
                    if (c) {
                        var e = [];
                        f.forEach(c, function(a) {
                            a.appId && e.push(a.declaredClass ? a : new R(a))
                        });
                        e.length && this.registerOAuthInfos(e)
                    }
                    a && f.forEach(a, function(a) {
                            a.userId && (a.server && a.token && a.expires && a.expires > (new Date).getTime()) && (a = a.declaredClass ? a : new u(a), a.onTokenChange(), this.credentials.push(a))
                        },
                        this)
                }
            },
            findServerInfo: function(a) {
                var b;
                a = this._sanitizeUrl(a);
                f.some(this.serverInfos, function(c) {
                    s.hasSameOrigin(c.server, a, !0) && (b = c);
                    return !!b
                });
                return b
            },
            findOAuthInfo: function(a) {
                var b;
                a = this._sanitizeUrl(a);
                f.some(this.oAuthInfos, function(c) {
                    s.hasSameOrigin(c.portalUrl, a, !0) && (b = c);
                    return !!b
                });
                return b
            },
            findCredential: function(a, b) {
                var c, d;
                a = this._sanitizeUrl(a);
                d = this._isServerRsrc(a) ? "server" : "portal";
                b ? f.some(this.credentials, function(e) {
                    s.hasSameOrigin(a, e.server, !0) && (b === e.userId && e.scope ===
                        d) && (c = e);
                    return !!c
                }, this) : f.some(this.credentials, function(b) {
                    s.hasSameOrigin(a, b.server, !0) && (-1 !== this._getIdenticalSvcIdx(a, b) && b.scope === d) && (c = b);
                    return !!c
                }, this);
                return c
            },
            getCredential: function(a, b) {
                var c, d, e = !0;
                w.isDefined(b) && (q.isObject(b) ? (c = !!b.token, d = b.error, e = !1 !== b.prompt) : c = b);
                a = this._sanitizeUrl(a);
                var h = new I(K._dfdCanceller),
                    f = this._isAdminResource(a),
                    n = c && this._doPortalSignIn(a) ? this._getEsriAuthCookie() : null;
                c = c ? this.findCredential(a) : null;
                if (n || c) return e = Error("You are currently signed in as: '" +
                    (n && n.email || c && c.userId) + "'. You do not have access to this resource: " + a), e.code = "IdentityManagerBase.1", e.httpCode = d && d.httpCode, e.messageCode = d ? d.messageCode : null, e.subcode = d ? d.subcode : null, e.details = d ? d.details : null, e.log = x.isDebug, h.errback(e), h;
                if (d = this._findCredential(a, b)) return h.callback(d), h;
                if (d = this.findServerInfo(a))!d.hasServer && this._isServerRsrc(a) && (d._restInfoDfd = this._getTokenSvcUrl(a, !0), d.hasServer = !0);
                else {
                    n = this._getTokenSvcUrl(a);
                    if (!n) return e = Error("Unknown resource - could not find token service endpoint."),
                        e.code = "IdentityManagerBase.2", e.log = x.isDebug, h.errback(e), h;
                    d = new D;
                    d.server = this._getOrigin(a);
                    q.isString(n) ? (d.tokenServiceUrl = n, e && !this._findOAuthInfo(a) && (d._selfDfd = this._getPortalSelf(n.replace(/\/sharing\/generatetoken/i, "/sharing/rest/portals/self"), a)), d.hasPortal = !0) : (d._restInfoDfd = n, d.hasServer = !0);
                    this.registerServers([d])
                }
                return this._enqueue(a, d, b, h, f)
            },
            getResourceName: function(a) {
                return this._isRESTService(a) ? a.replace(this._regexSDirUrl, "").replace(this._regexServerType, "") || "" :
                    this._gwUser.test(a) && a.replace(this._gwUser, "$1") || this._gwItem.test(a) && a.replace(this._gwItem, "$1") || this._gwGroup.test(a) && a.replace(this._gwGroup, "$1") || ""
            },
            generateToken: function(a, b, c) {
                var d, e, f, m, n, N, t = new y(window.location.href.toLowerCase()),
                    g = this._getEsriAuthCookie(),
                    v, O = a.webTierAuth && !b;
                m = a.shortLivedTokenValidity;
                var p;
                b && (p = r.id.tokenValidity || m || r.id.defaultTokenValidity, p > m && (p = m));
                c && (d = c.isAdmin, e = c.serverUrl, f = c.token, N = c.ssl, a.customParameters = c.customParameters);
                if (d) m = a.adminTokenServiceUrl;
                else if (m = a.tokenServiceUrl, n = new y(m.toLowerCase()), g && (v = (v = g.auth_tier) && v.toLowerCase()), ("web" === v || a.webTierAuth) && c && c.serverUrl && !N && "http" === t.scheme && (s.hasSameOrigin(t.uri, m, !0) || "https" === n.scheme && t.host === n.host && "7080" === t.port && "7443" === n.port)) m = m.replace(/^https:/i, "http:").replace(/:7443/i, ":7080");
                c = E(q.mixin({
                    url: m,
                    content: q.mixin({
                        request: "getToken",
                        username: b && b.username,
                        password: b && b.password,
                        serverUrl: e,
                        token: f,
                        expiration: p,
                        referer: d || -1 !== a.tokenServiceUrl.toLowerCase().indexOf("/sharing/generatetoken") ?
                            window.location.host : null,
                        client: d ? "referer" : null,
                        f: "json"
                    }, a.customParameters),
                    handleAs: "json",
                    callbackParamName: O ? "callback" : void 0
                }, c && c.ioArgs), {
                    usePost: !O,
                    disableIdentityLookup: !0,
                    useProxy: this._useProxy(a, c)
                });
                c.addCallback(function(c) {
                    if (!c || !c.token) return c = Error("Unable to generate token"), c.code = "IdentityManagerBase.3", c.log = x.isDebug, c;
                    var d = a.server;
                    z[d] || (z[d] = {});
                    b && (z[d][b.username] = b.password);
                    c.validity = p;
                    return c
                });
                c.addErrback(function(a) {});
                return c
            },
            isBusy: function() {
                return !!this._busy
            },
            checkSignInStatus: function(a) {
                return this.getCredential(a, {
                    prompt: !1
                })
            },
            setRedirectionHandler: function(a) {
                this._redirectFunc = a
            },
            setProtocolErrorHandler: function(a) {
                this._protocolFunc = a
            },
            signIn: function() {},
            oAuthSignIn: function() {},
            onCredentialCreate: function() {},
            onCredentialsDestroy: function() {},
            destroyCredentials: function() {
                if (this.credentials) {
                    var a = this.credentials.slice();
                    f.forEach(a, function(a) {
                        a.destroy()
                    })
                }
                this.onCredentialsDestroy()
            },
            _getOAuthHash: function() {
                var a = window.location.hash;
                if (a) {
                    "#" ===
                        a.charAt(0) && (a = a.substring(1));
                    var a = Q.queryToObject(a),
                        b = !1;
                    a.access_token && a.expires_in && a.state && a.hasOwnProperty("username") ? (a.state = A.fromJson(a.state), this._oAuthHash = a, b = !0) : a.error && a.error_description && (console.log("IdentityManager OAuth Error: ", a.error, " - ", a.error_description), "access_denied" === a.error && (b = !0));
                    b && (8 === J("ie") ? window.location.hash = "X" : 7 !== J("ie") && (window.location.hash = ""))
                }
            },
            _findCredential: function(a, b) {
                var c = -1,
                    d, e, h, m, n = b && b.token;
                d = b && b.resource;
                var r = this._isServerRsrc(a) ?
                    "server" : "portal",
                    t = f.filter(this.credentials, function(b) {
                        return s.hasSameOrigin(b.server, a, !0) && b.scope === r
                    });
                a = d || a;
                if (t.length)
                    if (1 === t.length)
                        if (d = t[0], h = (e = (m = this.findServerInfo(d.server)) && m.owningSystemUrl) && this.findCredential(e, d.userId), c = this._getIdenticalSvcIdx(a, d), n) - 1 !== c && (d.resources.splice(c, 1), this._removeResource(a, h));
                else return -1 === c && d.resources.push(a), this._addResource(a, h), d;
                else {
                    var g, v;
                    f.some(t, function(b) {
                        v = this._getIdenticalSvcIdx(a, b);
                        return -1 !== v ? (g = b, h = (e = (m = this.findServerInfo(g.server)) &&
                            m.owningSystemUrl) && this.findCredential(e, g.userId), c = v, !0) : !1
                    }, this);
                    if (n) g && (g.resources.splice(c, 1), this._removeResource(a, h));
                    else if (g) return this._addResource(a, h), g
                }
            },
            _findOAuthInfo: function(a) {
                var b = this.findOAuthInfo(a);
                b || f.some(this.oAuthInfos, function(c) {
                    this._isIdProvider(c.portalUrl, a) && (b = c);
                    return !!b
                }, this);
                return b
            },
            _addResource: function(a, b) {
                b && -1 === this._getIdenticalSvcIdx(a, b) && b.resources.push(a)
            },
            _removeResource: function(a, b) {
                var c = -1;
                b && (c = this._getIdenticalSvcIdx(a, b), -1 < c &&
                    b.resources.splice(c, 1))
            },
            _useProxy: function(a, b) {
                return b && b.isAdmin && !s.hasSameOrigin(a.adminTokenServiceUrl, window.location.href) || !this._isPortalDomain(a.tokenServiceUrl) && 10.1 == a.currentVersion && !s.hasSameOrigin(a.tokenServiceUrl, window.location.href)
            },
            _getOrigin: function(a) {
                a = new y(a);
                return a.scheme + "://" + a.host + (w.isDefined(a.port) ? ":" + a.port : "")
            },
            _sanitizeUrl: function(a) {
                a = s.fixUrl(q.trim(a));
                var b = (C.defaults.io.proxyUrl || "").toLowerCase(),
                    c = b ? a.toLowerCase().indexOf(b + "?") : -1; - 1 !== c && (a =
                    a.substring(c + b.length + 1));
                return s.urlToObject(a).path
            },
            _isRESTService: function(a) {
                return -1 < a.indexOf(this._agsRest)
            },
            _isAdminResource: function(a) {
                return this._agsAdmin.test(a) || this._adminSvcs.test(a)
            },
            _isServerRsrc: function(a) {
                return this._isRESTService(a) || this._isAdminResource(a)
            },
            _isIdenticalService: function(a, b) {
                var c;
                if (this._isRESTService(a) && this._isRESTService(b)) {
                    var d = this._getSuffix(a).toLowerCase(),
                        e = this._getSuffix(b).toLowerCase();
                    c = d === e;
                    c || (c = /(.*)\/(MapServer|FeatureServer).*/ig,
                        c = d.replace(c, "$1") === e.replace(c, "$1"))
                } else this._isAdminResource(a) && this._isAdminResource(b) ? c = !0 : !this._isServerRsrc(a) && (!this._isServerRsrc(b) && this._isPortalDomain(a)) && (c = !0);
                return c
            },
            _isPortalDomain: function(a) {
                a = a.toLowerCase();
                var b = (new y(a)).authority,
                    c = this._portalConfig,
                    d = -1 !== b.indexOf(this._agolSuffix);
                !d && c && (d = s.hasSameOrigin(c.restBaseUrl, a, !0));
                if (!d) {
                    if (!this._arcgisUrl && (c = q.getObject("esri.arcgis.utils.arcgisUrl"))) this._arcgisUrl = (new y(c)).authority;
                    this._arcgisUrl && (d =
                        this._arcgisUrl.toLowerCase() === b)
                }
                d || (d = f.some(this._portals, function(b) {
                    return s.hasSameOrigin(b, a, !0)
                }));
                return d = d || this._agsPortal.test(a)
            },
            _isIdProvider: function(a, b) {
                var c = -1,
                    d = -1;
                f.forEach(this._gwDomains, function(e, f) {
                    -1 === c && e.regex.test(a) && (c = f); - 1 === d && e.regex.test(b) && (d = f)
                });
                var e = !1;
                if (-1 < c && -1 < d)
                    if (0 === c || 4 === c) {
                        if (0 === d || 4 === d) e = !0
                    } else if (1 === c) {
                    if (1 === d || 2 === d) e = !0
                } else 2 === c ? 2 === d && (e = !0) : 3 === c && 3 === d && (e = !0); if (!e) {
                    var h = this.findServerInfo(b),
                        m = h && h.owningSystemUrl;
                    m && (F(h) &&
                        this._isPortalDomain(m) && this._isIdProvider(a, m)) && (e = !0)
                }
                return e
            },
            _isPublic: function(a) {
                a = this._sanitizeUrl(a);
                return f.some(this._publicUrls, function(b) {
                    return b.test(a)
                })
            },
            _getIdenticalSvcIdx: function(a, b) {
                var c = -1;
                f.some(b.resources, function(b, e) {
                    return this._isIdenticalService(a, b) ? (c = e, !0) : !1
                }, this);
                return c
            },
            _getSuffix: function(a) {
                return a.replace(this._regexSDirUrl, "").replace(this._regexServerType, "$1")
            },
            _getTokenSvcUrl: function(a) {
                var b, c;
                if ((b = this._isRESTService(a)) || this._isAdminResource(a)) return c =
                    a.toLowerCase().indexOf(b ? this._agsRest : "/admin/"), b = a.substring(0, c) + "/admin/generateToken", a = a.substring(0, c) + "/rest/info", c = E({
                        url: a,
                        content: {
                            f: "json"
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    }), c.adminUrl_ = b, c;
                if (this._isPortalDomain(a)) {
                    var d = "";
                    f.some(this._gwDomains, function(b) {
                        b.regex.test(a) && (d = b.tokenServiceUrl);
                        return !!d
                    });
                    d || f.some(this._portals, function(b) {
                        s.hasSameOrigin(b, a, !0) && (d = b + this._gwTokenUrl);
                        return !!d
                    }, this);
                    d || (c = a.toLowerCase().indexOf("/sharing"), -1 !== c && (d = a.substring(0,
                        c) + this._gwTokenUrl));
                    d || (d = this._getOrigin(a) + this._gwTokenUrl);
                    d && (b = (new y(a)).port, /^http:\/\//i.test(a) && "7080" === b && (d = d.replace(/:7080/i, ":7443")), d = d.replace(/http:/i, "https:"));
                    return d
                }
                if (-1 !== a.toLowerCase().indexOf("premium.arcgisonline.com")) return "https://premium.arcgisonline.com/server/tokens"
            },
            _getPortalSelf: function(a, b) {
                "https:" === window.location.protocol ? a = a.replace(/^http:/i, "https:").replace(/:7080/i, ":7443") : /^http:/i.test(b) && (a = a.replace(/^https:/i, "http:").replace(/:7443/i,
                    ":7080"));
                return E({
                    url: a,
                    content: {
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                }, {
                    crossOrigin: !1,
                    disableIdentityLookup: !0
                })
            },
            _hasPortalSession: function() {
                return !!this._getEsriAuthCookie()
            },
            _getEsriAuthCookie: function() {
                var a;
                if (B.isSupported())
                    for (var b = B.getAll("esri_auth"), c = b.length - 1; 0 <= c; c--) {
                        var d = A.fromJson(b[c]);
                        if (d.portalApp) {
                            a = d;
                            break
                        }
                    }
                return a
            },
            _doPortalSignIn: function(a) {
                if (B.isSupported()) {
                    var b = this._getEsriAuthCookie(),
                        c = this._portalConfig,
                        d = window.location.href,
                        e = this.findServerInfo(a);
                    if (this.useSignInPage && (c || this._isPortalDomain(d) || b) && (e ? e.hasPortal || e.owningSystemUrl && this._isPortalDomain(e.owningSystemUrl) : this._isPortalDomain(a)) && (this._isIdProvider(d, a) || c && (s.hasSameOrigin(c.restBaseUrl, a, !0) || this._isIdProvider(c.restBaseUrl, a)) || s.hasSameOrigin(d, a, !0))) return !0
                }
                return !1
            },
            _checkProtocol: function(a, b, c, d) {
                var e = !0;
                d = d ? b.adminTokenServiceUrl : b.tokenServiceUrl;
                if (0 === q.trim(d).toLowerCase().indexOf("https:") && 0 !== window.location.href.toLowerCase().indexOf("https:") &&
                    (!C.defaults.io.useCors || !s.canUseXhr(d) && !s.canUseXhr(s.getProxyUrl(!0).path))) e = this._protocolFunc ? !!this._protocolFunc({
                    resourceUrl: a,
                    serverInfo: b
                }) : !1, e || (a = Error("Aborted the Sign-In process to avoid sending password over insecure connection."), a.code = "IdentityManagerBase.4", a.log = x.isDebug, console.log(a.message), c(a));
                return e
            },
            _enqueue: function(a, b, c, d, e, f) {
                d || (d = new I(K._dfdCanceller));
                d.resUrl_ = a;
                d.sinfo_ = b;
                d.options_ = c;
                d.admin_ = e;
                d.refresh_ = f;
                this._busy ? s.hasSameOrigin(a, this._busy.resUrl_, !0) ? this._soReqs.push(d) : this._xoReqs.push(d) : this._doSignIn(d);
                return d
            },
            _doSignIn: function(a) {
                this._busy = a;
                var b = this,
                    c = function(c) {
                        var d = a.options_ && a.options_.resource,
                            e = a.resUrl_,
                            p = a.refresh_,
                            l = !1; - 1 === f.indexOf(b.credentials, c) && (p && -1 !== f.indexOf(b.credentials, p) ? (p.userId = c.userId, p.token = c.token, p.expires = c.expires, p.validity = c.validity, p.ssl = c.ssl, p.creationTime = c.creationTime, l = !0, c = p) : b.credentials.push(c));
                        c.resources || (c.resources = []);
                        c.resources.push(d || e);
                        c.scope = b._isServerRsrc(e) ?
                            "server" : "portal";
                        c.onTokenChange();
                        var d = b._soReqs,
                            k = {};
                        b._soReqs = [];
                        f.forEach(d, function(a) {
                            if (!this._isIdenticalService(e, a.resUrl_)) {
                                var b = this._getSuffix(a.resUrl_);
                                k[b] || (k[b] = !0, c.resources.push(a.resUrl_))
                            }
                        }, b);
                        a.callback(c);
                        f.forEach(d, function(a) {
                            a.callback(c)
                        });
                        b._busy = a.resUrl_ = a.sinfo_ = a.refresh_ = null;
                        if (!l) b.onCredentialCreate({
                            credential: c
                        });
                        b._soReqs.length && b._doSignIn(b._soReqs.shift());
                        b._xoReqs.length && b._doSignIn(b._xoReqs.shift())
                    },
                    d = function(c) {
                        a.errback(c);
                        b._busy = a.resUrl_ =
                            a.sinfo_ = a.refresh_ = null;
                        b._soReqs.length && b._doSignIn(b._soReqs.shift());
                        b._xoReqs.length && b._doSignIn(b._xoReqs.shift())
                    },
                    e = function(g, e, f, p) {
                        var l = a.sinfo_,
                            k = !a.options_ || !1 !== a.options_.prompt;
                        b._doPortalSignIn(a.resUrl_) ? (e = b._getEsriAuthCookie(), g = b._portalConfig, e ? c(new u({
                            userId: e.email,
                            server: l.server,
                            token: e.token,
                            expires: null
                        })) : k ? (k = "", e = window.location.href, k = b.signInPage ? b.signInPage : g ? g.baseUrl + g.signin : b._isIdProvider(e, a.resUrl_) ? b._getOrigin(e) + "/home/signin.html" : l.tokenServiceUrl.replace(/\/sharing\/generatetoken/i,
                                "") + "/home/signin.html", k = k.replace(/http:/i, "https:"), g && !1 === g.useSSL && (k = k.replace(/https:/i, "http:")), 0 === e.toLowerCase().replace("https", "http").indexOf(k.toLowerCase().replace("https", "http")) ? (l = Error("Cannot redirect to Sign-In page from within Sign-In page. URL of the resource that triggered this workflow: " + a.resUrl_), l.code = "IdentityManagerBase.5", l.log = x.isDebug, d(l)) : b._redirectFunc ? b._redirectFunc({
                                signInPage: k,
                                returnUrlParamName: "returnUrl",
                                returnUrl: e,
                                resourceUrl: a.resUrl_,
                                serverInfo: l
                            }) :
                            window.location = k + "?returnUrl\x3d" + window.escape(e)) : (l = Error("User is not signed in."), l.code = "IdentityManagerBase.6", l.log = x.isDebug, d(l))) : g ? c(new u({
                            userId: g,
                            server: l.server,
                            token: f,
                            expires: w.isDefined(p) ? Number(p) : null,
                            ssl: !!e
                        })) : t ? (g = t._oAuthCred, g || (e = new M(t, window.localStorage), f = new M(t, window.sessionStorage), e.isValid() && f.isValid() ? e.expires > f.expires ? (g = e, f.destroy()) : (g = f, e.destroy()) : g = e.isValid() ? e : f, t._oAuthCred = g), g.isValid() ? c(new u({
                            userId: g.userId,
                            server: l.server,
                            token: g.token,
                            expires: g.expires,
                            ssl: g.ssl,
                            _oAuthCred: g
                        })) : b._oAuthHash && b._oAuthHash.state.portalUrl === t.portalUrl ? (k = b._oAuthHash, l = new u({
                            userId: k.username,
                            server: l.server,
                            token: k.access_token,
                            expires: (new Date).getTime() + 1E3 * Number(k.expires_in),
                            ssl: "true" === k.ssl,
                            oAuthState: k.state,
                            _oAuthCred: g
                        }), g.storage = k.persist ? window.localStorage : window.sessionStorage, g.token = l.token, g.expires = l.expires, g.userId = l.userId, g.ssl = l.ssl, g.save(), b._oAuthHash = null, c(l)) : k ? a._pendingDfd = b.oAuthSignIn(a.resUrl_, l, t, a.options_).addCallbacks(c,
                            d) : (l = Error("User is not signed in."), l.code = "IdentityManagerBase.6", l.log = x.isDebug, d(l))) : k ? b._checkProtocol(a.resUrl_, l, d, a.admin_) && (k = a.options_, a.admin_ && (k = k || {}, k.isAdmin = !0), a._pendingDfd = b.signIn(a.resUrl_, l, k).addCallbacks(c, d)) : (l = Error("User is not signed in."), l.code = "IdentityManagerBase.6", l.log = x.isDebug, d(l))
                    },
                    h = function() {
                        var e = a.sinfo_,
                            v = e.owningSystemUrl,
                            h = a.options_,
                            p, l, k;
                        h && (p = h.token, l = h.error);
                        k = b._findCredential(v, {
                            token: p,
                            resource: a.resUrl_
                        });
                        !k && F(e) && f.some(b.credentials,
                            function(a) {
                                this._isIdProvider(v, a.server) && (k = a);
                                return !!k
                            }, b);
                        k ? (h = b.findCredential(a.resUrl_, k.userId)) ? c(h) : G(e, b._legacyFed) ? (h = k.toJson(), h.server = e.server, h.resources = null, c(new u(h))) : (a._pendingDfd = b.generateToken(b.findServerInfo(k.server), null, {
                            serverUrl: a.resUrl_,
                            token: k.token,
                            ssl: k.ssl
                        })).addCallbacks(function(b) {
                            c(new u({
                                userId: k.userId,
                                server: e.server,
                                token: b.token,
                                expires: w.isDefined(b.expires) ? Number(b.expires) : null,
                                ssl: !!b.ssl,
                                isAdmin: a.admin_,
                                validity: b.validity
                            }))
                        }, d) : (b._busy =
                            null, p && (a.options_.token = null), (a._pendingDfd = b.getCredential(v.replace(/\/?$/, "/sharing"), {
                                resource: a.resUrl_,
                                token: p,
                                error: l
                            })).addCallbacks(function(c) {
                                b._enqueue(a.resUrl_, a.sinfo_, a.options_, a, a.admin_)
                            }, function(a) {
                                d(a)
                            }))
                    },
                    m = a.sinfo_.owningSystemUrl,
                    n = this._isServerRsrc(a.resUrl_),
                    r = a.sinfo_._restInfoDfd,
                    t = this._findOAuthInfo(a.resUrl_);
                r ? r.addCallbacks(function(c) {
                    var d = a.sinfo_;
                    d.adminTokenServiceUrl = d._restInfoDfd.adminUrl_;
                    d._restInfoDfd = null;
                    d.tokenServiceUrl = q.getObject("authInfo.tokenServicesUrl", !1, c) || q.getObject("authInfo.tokenServiceUrl", !1, c) || q.getObject("tokenServiceUrl", !1, c);
                    d.shortLivedTokenValidity = q.getObject("authInfo.shortLivedTokenValidity", !1, c);
                    d.currentVersion = c.currentVersion;
                    d.owningTenant = c.owningTenant;
                    if (c = d.owningSystemUrl = c.owningSystemUrl) b._portals.push(c), !d.hasPortal && s.hasSameOrigin(c, a.resUrl_, !0) && (t || (d._selfDfd = b._getPortalSelf(c.replace(/\/?$/, "/sharing/rest/portals/self"), a.resUrl_)), d.hasPortal = !0);
                    n && c ? h() : e()
                }, function() {
                    a.sinfo_._restInfoDfd = null;
                    var b =
                        Error("Unknown resource - could not find token service endpoint.");
                    b.code = "IdentityManagerBase.2";
                    b.log = x.isDebug;
                    d(b)
                }) : n && m ? h() : a.sinfo_._selfDfd ? (m = function(c) {
                    a.sinfo_._selfDfd = null;
                    var d = c && c.user && c.user.username,
                        f = c && c.allSSL;
                    a.sinfo_.webTierAuth = !!d;
                    d && b.normalizeWebTierAuth ? (a.sinfo_._tokenDfd = b.generateToken(a.sinfo_, null, {
                        ssl: f
                    }), c = function(b) {
                        a.sinfo_._tokenDfd = null;
                        e(d, f, b && b.token, b && b.expires)
                    }, a.sinfo_._tokenDfd.then(c, c)) : e(d, f)
                }, a.sinfo_._selfDfd.then(m, m)) : e()
            }
        });
    u = H(L, {
        declaredClass: "esri.Credential",
        tokenRefreshBuffer: 2,
        constructor: function(a) {
            q.mixin(this, a);
            this.resources = this.resources || [];
            w.isDefined(this.creationTime) || (this.creationTime = (new Date).getTime())
        },
        _oAuthCred: null,
        refreshToken: function() {
            function a() {
                "portal" === b.scope && f.forEach(r.id.credentials, function(a) {
                    var c = r.id.findServerInfo(a.server),
                        d = c && c.owningSystemUrl;
                    if (a !== b && a.userId === b.userId && d && "server" === a.scope && (s.hasSameOrigin(b.server, d, !0) || r.id._isIdProvider(d, b.server))) G(c, r.id._legacyFed) ? (a.token = b.token, a.expires =
                        b.expires, a.creationTime = b.creationTime, a.validity = b.validity, a.onTokenChange()) : a.refreshToken()
                })
            }
            var b = this,
                c = this.resources && this.resources[0],
                d = r.id.findServerInfo(this.server),
                e = d && d.owningSystemUrl,
                h = !!e && "server" === this.scope,
                m = h && G(d, r.id._legacyFed),
                n = h && r.id.findServerInfo(e),
                q, t = (q = d.webTierAuth) && r.id.normalizeWebTierAuth,
                g = z[this.server],
                g = g && g[this.userId],
                v = {
                    username: this.userId,
                    password: g
                },
                u;
            if (!q || t)
                if (h && !n && f.some(r.id.serverInfos, function(a) {
                    r.id._isIdProvider(e, a.server) && (n =
                        a);
                    return !!n
                }), q = n && r.id.findCredential(n.server, this.userId), !h || q)
                    if (m) q.refreshToken();
                    else {
                        if (h) u = {
                            serverUrl: c,
                            token: q && q.token,
                            ssl: q && q.ssl
                        };
                        else if (t) v = null, u = {
                            ssl: this.ssl
                        };
                        else if (g) this.isAdmin && (u = {
                            isAdmin: !0
                        });
                        else {
                            var p;
                            c && (c = r.id._sanitizeUrl(c), this._enqueued = 1, p = r.id._enqueue(c, d, null, null, this.isAdmin, this), p.addCallback(function() {
                                b._enqueued = 0;
                                a()
                            }).addErrback(function() {
                                b._enqueued = 0
                            }));
                            return p
                        }
                        return r.id.generateToken(h ? n : d, h ? null : v, u).addCallback(function(c) {
                            b.token = c.token;
                            b.expires = w.isDefined(c.expires) ? Number(c.expires) : null;
                            b.creationTime = (new Date).getTime();
                            b.validity = c.validity;
                            b.onTokenChange();
                            a()
                        }).addErrback(function() {})
                    }
        },
        onTokenChange: function(a) {
            clearTimeout(this._refreshTimer);
            var b = this.server && r.id.findServerInfo(this.server),
                c = (b = b && b.owningSystemUrl) && r.id.findServerInfo(b);
            !1 !== a && ((!b || "portal" === this.scope || c && c.webTierAuth && !r.id.normalizeWebTierAuth) && (w.isDefined(this.expires) || w.isDefined(this.validity))) && this._startRefreshTimer()
        },
        onDestroy: function() {},
        destroy: function() {
            this.userId = this.server = this.token = this.expires = this.validity = this.resources = this.creationTime = null;
            this._oAuthCred && (this._oAuthCred.destroy(), this._oAuthCred = null);
            var a = f.indexOf(r.id.credentials, this); - 1 < a && r.id.credentials.splice(a, 1);
            this.onTokenChange();
            this.onDestroy()
        },
        toJson: function() {
            return this._toJson()
        },
        _toJson: function() {
            var a = w.fixJson({
                    userId: this.userId,
                    server: this.server,
                    token: this.token,
                    expires: this.expires,
                    validity: this.validity,
                    ssl: this.ssl,
                    isAdmin: this.isAdmin,
                    creationTime: this.creationTime,
                    scope: this.scope
                }),
                b = this.resources;
            b && 0 < b.length && (a.resources = b);
            return a
        },
        _startRefreshTimer: function() {
            clearTimeout(this._refreshTimer);
            var a = 6E4 * this.tokenRefreshBuffer,
                b = (this.validity ? this.creationTime + 6E4 * this.validity : this.expires) - (new Date).getTime();
            0 > b && (b = 0);
            this._refreshTimer = setTimeout(q.hitch(this, this.refreshToken), b > a ? b - a : b)
        }
    });
    P.Credential = u;
    return P
});