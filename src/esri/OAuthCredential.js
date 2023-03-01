//>>built
define(["./kernel", "dojo/_base/declare", "dojo/has", "dojo/json"], function(g, f, h, d) {
    return f(null, {
        declaredClass: "esri.OAuthCredential",
        oAuthInfo: null,
        storage: null,
        expires: null,
        ssl: null,
        token: null,
        userId: null,
        constructor: function(b, a) {
            this.oAuthInfo = b;
            this.storage = a;
            this._init()
        },
        isValid: function() {
            var b = !1;
            if (this.oAuthInfo && this.token && this.userId) {
                var a = (new Date).getTime();
                this.expires > a && (this.expires - a) / 1E3 > 60 * this.oAuthInfo.minTimeUntilExpiration && (b = !0)
            }
            return b
        },
        save: function() {
            if (this.storage) {
                var b =
                    this._load(),
                    a = this.oAuthInfo;
                if (a && a.authNamespace && a.portalUrl) {
                    var c = b[a.authNamespace];
                    c || (c = b[a.authNamespace] = {});
                    c[a.portalUrl] = {
                        expires: this.expires,
                        ssl: this.ssl,
                        token: this.token,
                        userId: this.userId
                    };
                    try {
                        this.storage.setItem("esriJSAPIOAuth", d.stringify(b))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        },
        destroy: function() {
            var b = this._load(),
                a = this.oAuthInfo;
            if (a && a.authNamespace && a.portalUrl && this.storage) {
                var c = b[a.authNamespace];
                if (c) {
                    delete c[a.portalUrl];
                    try {
                        this.storage.setItem("esriJSAPIOAuth", d.stringify(b))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
            a &&
                (this.oAuthInfo = a._oAuthCred = null)
        },
        _init: function() {
            var b = this._load(),
                a = this.oAuthInfo;
            if (a && (a.authNamespace && a.portalUrl) && (b = b[a.authNamespace]))
                if (b = b[a.portalUrl]) this.expires = b.expires, this.ssl = b.ssl, this.token = b.token, this.userId = b.userId
        },
        _load: function() {
            var b = {};
            if (this.storage) {
                var a = this.storage.getItem("esriJSAPIOAuth");
                if (a) try {
                    b = d.parse(a)
                } catch (c) {
                    console.log(c)
                }
            }
            return b
        }
    })
});