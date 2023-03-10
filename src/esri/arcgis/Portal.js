//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/kernel", "dojo/_base/Deferred", "dojo/_base/array", "dojo/_base/sniff", "dojo/DeferredList", "../kernel", "../lang", "../request", "../Evented", "../IdentityManager"], function(g, c, v, l, h, A, B, w, x, y, z) {
    var f = {
            options: {
                disableIdentityLookup: !0
            },
            requestParams: {
                f: "json"
            }
        },
        k = function(a) {
            function b(b) {
                a[b] || (a[b] = function() {
                    var c = arguments;
                    return l.when(a, function(a) {
                        Array.prototype.unshift.call(c, a.results || a);
                        return k(h[b].apply(h, c))
                    })
                })
            }
            if (!a) return a;
            a.then && (a = c.delegate(a));
            a.total || (a.total = l.when(a, function(a) {
                return x.isDefined(a.total) ? a.total : a.length || 0
            }));
            b("forEach");
            b("filter");
            b("map");
            b("some");
            b("every");
            return a
        },
        d = {
            useSSL: function(a, b) {
                var e = f && f.self || {};
                if (e && !e.isPortal) return -1 !== a.indexOf("https:") || e.allSSL ? b.replace("http:", "https:") : b;
                var c = d.getLocation(b);
                if (-1 < e.portalHostname.toLowerCase().indexOf(c.hostname.toLowerCase()) && c.port && "80" !== c.port && "443" !== c.port) {
                    var g = c.pathname && c.pathname.replace(c.pathname.replace(/^\/([^\/]*).*$/, "$1"),
                        "arcgis") || "";
                    return e.allSSL || -1 < a.indexOf("https:") ? "https://" + c.hostname + (e.httpsPort && "443" !== e.httpsPort ? ":" + e.httpsPort : "") + g + c.search : "http://" + c.hostname + (e.httpPort && "80" !== e.httpPort ? ":" + e.httpPort : "") + g + c.search
                }
                return -1 !== a.indexOf("https:") || e.allSSL ? b.replace("http:", "https:") : b
            },
            formatUrl: function(a) {
                var b = f.loggedInUser && f.loggedInUser.credential && f.loggedInUser.credential.token;
                return -1 !== a.indexOf("null") ? null : d.useSSL(window.location.protocol, b ? a + (-1 !== a.indexOf("?") ? "\x26" : "?") +
                    ("token\x3d" + b) : a)
            },
            getLocation: function(a) {
                var b = document.createElement("a");
                b.href = a;
                return {
                    protocol: b.protocol,
                    hostname: b.hostname,
                    port: b.port,
                    pathname: b.pathname,
                    search: b.search,
                    hash: b.hash,
                    host: b.host
                }
            },
            resultsToTypedArray: function(a, b, e) {
                e = e ? e.listings || e.notifications || e.userInvitations || e.tags || e.items || e.groups || e.comments || e.results || e : [];
                return h.map(e, function(e) {
                    e = c.mixin(e, b || {});
                    return a ? new a(e) : e
                })
            },
            clearFieldsFromObject: function(a, b) {
                var e, d = a.length;
                if (c.isArray(a))
                    for (e = 0; e < d; e++) delete b[a[e]];
                else
                    for (e in a) delete b[e];
                return b
            },
            requestToTypedArray: function(a, b, e, f, g) {
                return k(d.request(a, b, e).then(c.partial(d.resultsToTypedArray, f, g)))
            },
            request: function(a, b, e) {
                var g;
                b && b.portal && delete b.portal;
                b && b.form && (g = b.form, delete b.form);
                b = c.mixin(c.mixin({}, b || {}), f.requestParams);
                e = c.mixin(e || {}, f.options);
                return y({
                    url: d.useSSL(window.location.protocol, a.url || a),
                    content: b,
                    callbackParamName: "callback",
                    timeout: e && e.timeout || 0,
                    form: g
                }, e)
            },
            formatQueryParams: function(a, b, e) {
                a = c.mixin(c.mixin({},
                    a), c.isString(b) ? {
                    q: b
                } : b || {});
                a.q = !e && f.extraQuery ? "(" + a.q + ")" + f.extraQuery : a.q;
                return a
            }
        },
        n = g([], {
            declaredClass: "esri.arcgis.PortalComment",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = this.item.itemUrl + "/comments/" + this.id;
                this.created = this.created ? new Date(this.created) : null
            }
        }),
        p = g([], {
            declaredClass: "esri.arcgis.PortalRating",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = this.item.itemUrl + "/rating";
                this.created = this.created ? new Date(this.created) : null
            }
        }),
        m = g([], {
            declaredClass: "esri.arcgis.PortalItem",
            constructor: function(a) {
                c.mixin(this, a);
                this.folderId = this.ownerFolder || this.folderId;
                this.itemUrl = (this.portal && this.portal.portalUrl) + "content/items/" + this.id;
                this.userItemUrl = this.hasOwnProperty("ownerFolder") ? this.itemUrl.replace("content", "content/users/" + this.owner + (this.folderId ? "/" + this.folderId : "")) : null;
                this.itemDataUrl = d.formatUrl(this.itemUrl + "/data");
                this.thumbnailUrl = d.formatUrl(this.itemUrl + "/info/" + this.thumbnail);
                this.created = this.created ? new Date(this.created) : null;
                this.uploaded =
                    this.uploaded ? new Date(this.uploaded) : null;
                this.modified = this.modified ? new Date(this.modified) : null
            },
            addComment: function(a) {
                var b = c.isString(a) ? {
                    comment: a
                } : a;
                return d.request(this.itemUrl + "/addComment", b, {
                    usePost: !0
                }).then(c.hitch(this, function(a) {
                    return n(c.mixin(b, {
                        id: a.commentId,
                        item: this
                    }))
                }))
            },
            updateComment: function(a) {
                if (a && a.url && a.comment) return d.request(a.url + "/update", {
                    comment: a.comment
                }, {
                    usePost: !0
                }).then(function(b) {
                    a.id = b.commentId;
                    return a
                });
                throw Error();
            },
            getComments: function() {
                return d.requestToTypedArray(this.itemUrl +
                    "/comments", null, null, n, {
                        item: this
                    })
            },
            deleteComment: function(a) {
                if (a && a.url) return d.request(a.url + "/delete", null, {
                    usePost: !0
                });
                throw Error();
            },
            addRating: function(a) {
                var b = c.isObject(a) ? a : {
                    rating: parseFloat(a)
                };
                return d.request(this.itemUrl + "/addRating", b, {
                    usePost: !0
                }).then(c.hitch(this, function(a) {
                    return new p(c.mixin(b, {
                        id: a.ratingId,
                        item: this
                    }))
                }))
            },
            getRating: function() {
                return d.request(this.itemUrl + "/rating").then(c.hitch(this, function(a) {
                    return new p(c.mixin(a, {
                        item: this
                    }))
                }))
            },
            deleteRating: function() {
                return d.request(this.itemUrl +
                    "/deleteRating", null, {
                        usePost: !0
                    })
            }
        }),
        q = g([], {
            declaredClass: "esri.arcgis.PortalListing",
            constructor: function(a) {
                c.mixin(this, a);
                this.id = this.itemId;
                this.url = (this.portal && this.portal.portalUrl) + "content/" + (this.userItemUrl ? "items/" : "listings/") + this.itemId;
                this.commentsUrl = this.url + "/comments";
                this.created = this.created ? new Date(this.created) : null;
                this.banner = this.banner ? d.formatUrl(this.url + "/info/" + this.banner) : "";
                this.thumbnail = this.thumbnail ? d.formatUrl(this.url + "/info/" + this.thumbnail) : "";
                this.largeThumbnail =
                    this.largeThumbnail ? d.formatUrl(this.url + "/info/" + this.largeThumbnail) : "";
                this.avgRating = this.avgRating || 0;
                this.numRatings = this.numRatings || 0;
                this.numComments = this.numComments || 0;
                this.listingProperties = this.listingProperties || {
                    priceDesc: "",
                    creditsPerTransaction: 0,
                    licenseType: "free",
                    trialSupported: !1,
                    trialDuration: 0,
                    listingAccess: "private"
                };
                for (var b in this.listingProperties) this[b] && (this.listingProperties[b] = this[b]);
                this.properties = this.properties || {
                    systemRequirements: "",
                    termsAndConditions: "",
                    version: "1.0"
                };
                this.screenshots = h.map(this.screenshots, c.hitch(this, function(a) {
                    return d.formatUrl(this.url + "/info/" + a)
                }));
                this.vendorName = this.vendor.name;
                this.vendor.thumbnail = this.vendor.thumbnail ? this.userItemUrl ? d.formatUrl(this.portal.portalUrl + "/accounts/self/resources/" + this.vendor.thumbnail) : d.formatUrl(this.url + "/vendorinfo/" + this.vendor.thumbnail) : ""
            },
            getComments: function() {
                return d.requestToTypedArray(this.commentsUrl, null, null, n, {
                    item: this
                })
            },
            getVendor: function() {
                return this.vendor
            }
        }),
        r = g([], {
            declaredClass: "esri.arcgis.PortalProvision",
            constructor: function(a) {
                c.mixin(this, a);
                this.created = this.created ? new Date(this.created) : null;
                this.startDate = this.startDate ? new Date(this.startDate) : null;
                this.endDate = this.endDate && -1 !== this.endDate ? new Date(this.endDate) : null;
                this.listing = a.listing ? new q(c.mixin(a.listing, {
                    portal: this.portal
                })) : null
            }
        }),
        s = g([], {
            declaredClass: "esri.arcgis.PortalGroup",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = (this.portal && this.portal.portalUrl) + "community/groups/" +
                    this.id;
                this.thumbnailUrl = d.formatUrl(this.url + "/info/" + this.thumbnail);
                this.modified = this.modified ? new Date(this.modified) : null;
                this.created = this.created ? new Date(this.created) : null
            },
            getMembers: function() {
                return d.request(this.url + "/users")
            },
            queryItems: function(a) {
                a = d.formatQueryParams({}, a);
                a.q = "group:" + this.id + (a.q ? " " + a.q : "");
                return this.portal.queryItems(a)
            }
        }),
        t = g([], {
            declaredClass: "esri.arcgis.PortalFolder",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = (this.portal && this.portal.portalUrl) +
                    "content/users/" + this.username + "/" + this.id;
                this.created = this.created ? new Date(this.created) : null
            },
            getItems: function() {
                return d.requestToTypedArray(this.url, null, null, m, {
                    portal: this.portal,
                    folderId: this.id
                })
            }
        }),
        u = g([], {
            declaredClass: "esri.arcgis.PortalUser",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = (this.portal && this.portal.portalUrl) + "community/users/" + this.username;
                this.userContentUrl = (this.portal && this.portal.portalUrl) + "content/users/" + this.username;
                this.thumbnailUrl = d.formatUrl(this.url +
                    "/info/" + this.thumbnail);
                this.modified = this.modified ? new Date(this.modified) : null;
                this.created = this.created ? new Date(this.created) : null
            },
            getGroups: function() {
                return k(d.request(this.url).then(c.hitch(this, function(a) {
                    return d.resultsToTypedArray(s, {
                        portal: this.portal
                    }, a.groups)
                })))
            },
            getNotifications: function() {
                return d.requestToTypedArray(this.url + "/notifications", null, null, null, {
                    portal: this.portal
                })
            },
            getGroupInvitations: function() {
                return d.requestToTypedArray(this.url + "/invitations", null, null, null, {
                    portal: this.portal
                })
            },
            getTags: function() {
                return d.requestToTypedArray(this.url + "/tags", null, null, null, {
                    portal: this.portal
                })
            },
            getFolders: function() {
                return k(this.getContent().then(function(a) {
                    return a.folders
                }))
            },
            getItems: function(a) {
                return k(this.getContent(a).then(function(a) {
                    return a.items
                }))
            },
            getItem: function(a) {
                return d.request(this.portal.portalUrl + "content/items/" + a).then(c.hitch(this, function(a) {
                    return new m(c.mixin(a, {
                        portal: this.portal
                    }))
                }))
            },
            getContent: function(a) {
                var b = this.url.replace("community",
                    "content") + (a ? "/" + a : "");
                return d.request(b).then(c.hitch(this, function(b) {
                    b.folders = d.resultsToTypedArray(t, {
                        portal: this.portal
                    }, b.folders);
                    b.items = d.resultsToTypedArray(m, {
                        portal: this.portal,
                        folderId: a
                    }, b.items);
                    return b
                }))
            }
        });
    return {
        Portal: g([z], {
            declaredClass: "esri.arcgis.Portal",
            onLoad: function() {},
            onError: function() {},
            constructor: function(a) {
                a = c.isObject(a) ? a : {
                    url: a
                };
                this.registerConnectEvents();
                a.self ? (f.self = a.self, c.mixin(this, {
                    url: a.url || window.location.protocol + "//" + (a.self.urlKey ? a.self.urlKey +
                        "." + a.self.customBaseUrl : a.self.portalHostname)
                }), this.portalUrl = -1 !== this.url.indexOf("/sharing") ? this.url + "/" : this.url + "/sharing/rest/", a = a.self.user ? this.signIn() : this.init(this.url)) : (a.url && c.mixin(this, {
                    url: a.url
                }), a = this.init(this.url));
                a.then(c.hitch(this, function() {
                    this.emit("ready", this);
                    this.onLoad(this)
                }))
            },
            init: function(a, b) {
                a = (a || this.portalUrl).replace(/\/+$/, "");
                this.portalUrl = -1 !== a.indexOf("/sharing") ? a + "/" : a + "/sharing/rest/";
                return this._getSelf(this.portalUrl).then(c.hitch(this,
                    function(a) {
                        f.self = c.mixin({}, a);
                        if ((a = a.user) && b) a.portal = this, a = new u(a), f.loggedInUser = c.mixin({}, c.mixin(a, {
                            credential: b
                        }));
                        f.self.id && !1 === f.self.canSearchPublic && (f.extraQuery = " AND orgid:" + f.self.id);
                        c.mixin(this, f.self);
                        this.thumbnailUrl = d.formatUrl(this.portalUrl + "accounts/self/resources/" + this.thumbnail);
                        this.isOrganization = this.access && this.access.length || !1;
                        this.created = this.created ? new Date(this.created) : null;
                        this.modified = this.modified ? new Date(this.modified) : null;
                        return this
                    }), c.hitch(this,
                    function(a) {
                        this.onError(a);
                        throw a;
                    }))
            },
            signIn: function() {
                var a = new l,
                    b = c.hitch(this, function() {
                        this._onSignIn().then(c.hitch(this, function() {
                            a.resolve(f.loggedInUser)
                        }), c.hitch(this, function(b) {
                            a.reject(b)
                        }))
                    });
                if (!f || !f.self) this.on("load", c.hitch(this, function() {
                    b()
                }));
                else f && f.loggedInUser ? setTimeout(function() {
                    a.resolve(f.loggedInUser)
                }, 0) : b();
                return a
            },
            signOut: function() {
                f.loggedInUser.credential && f.loggedInUser.credential.destroy();
                f.loggedInUser = null;
                f.options.disableIdentityLookup = !0;
                d.clearFieldsFromObject(f.self,
                    this);
                f.self = null;
                return this.init(this.url)
            },
            getPortalUser: function() {
                return f.loggedInUser
            },
            addResource: function(a, b) {
                return d.request(this.portalUrl + "portals/self/addResource", {
                    key: a,
                    text: b
                }, {
                    usePost: !0
                })
            },
            update: function(a) {
                return d.request(this.portalUrl + "portals/self/update", a, {
                    usePost: !0
                })
            },
            queryGroups: function(a) {
                return this._queryPortal(this.portalUrl + "community/groups", d.formatQueryParams({}, a), s)
            },
            queryItems: function(a) {
                return this._queryPortal(this.portalUrl + "search", d.formatQueryParams({},
                    a), m)
            },
            queryListings: function(a) {
                a = d.formatQueryParams({}, a, !0);
                var b = "";
                a.q && -1 < a.q.toLowerCase().indexOf("mylistings:true") ? (a.q = a.q.toLowerCase().replace("mylistings:true", ""), b = "?mylistings\x3dtrue") : a.q || (a.q = '""');
                return this._queryPortal(this.portalUrl + "content/listings" + b, a, q)
            },
            getProvisions: function() {
                return this.getCustomers().then(c.hitch(this, function(a) {
                    return a.purchases
                }))
            },
            getInterests: function() {
                return this.getCustomers().then(c.hitch(this, function(a) {
                    return a.interests
                }))
            },
            getTrials: function() {
                return this.getCustomers().then(c.hitch(this,
                    function(a) {
                        return a.trials
                    }))
            },
            getCustomers: function(a) {
                return d.request(this.portalUrl + "portals/self/customers", {
                    status: a || "all"
                })
            },
            getMyPurchases: function() {
                return this.getPurchases().then(function(a) {
                    return a.purchases
                })
            },
            getMyInterests: function() {
                return this.getPurchases().then(function(a) {
                    return a.interests
                })
            },
            getPurchases: function() {
                return d.request(this.portalUrl + "portals/self/purchases").then(c.hitch(this, function(a) {
                    a.interests = h.map(a.interests, function(a) {
                        return c.mixin(a.provision, {
                            listing: a.listing
                        })
                    });
                    a.purchases = h.map(a.purchases, function(a) {
                        return c.mixin(a.provision, {
                            listing: a.listing
                        })
                    });
                    a.trials = h.map(a.trials, function(a) {
                        return c.mixin(a.provision, {
                            listing: a.listing
                        })
                    });
                    a.interests = d.resultsToTypedArray(r, {
                        portal: this
                    }, a.interests);
                    a.trials = d.resultsToTypedArray(r, {
                        portal: this
                    }, a.trials);
                    a.purchases = d.resultsToTypedArray(r, {
                        portal: this
                    }, a.purchases);
                    return a
                }))
            },
            queryUsers: function(a) {
                return this._queryPortal(this.portalUrl + "community/users", d.formatQueryParams({
                        sortField: "username"
                    }, a),
                    u)
            },
            _onSignIn: function() {
                f.options.disableIdentityLookup = !1;
                if (!f.self || !f.self.user) f.self = null;
                return w.id.getCredential(this.portalUrl).then(c.hitch(this, "init", this.url)).then(function() {
                    return f.loggedInUser
                }, c.hitch(this, function(a) {
                    f.options.disableIdentityLookup = !0;
                    this.onError(a);
                    throw a;
                }))
            },
            _getSelf: function(a) {
                var b;
                a = a + "accounts/self?culture\x3d" + v.locale;
                f.self ? (b = new l, setTimeout(function() {
                    b.resolve(f.self)
                }, 0)) : b = d.request(a);
                return b
            },
            _queryPortal: function(a, b, e) {
                var f = c.mixin({
                        num: 10,
                        start: 0,
                        sortField: "title",
                        sortOrder: "asc"
                    }, b),
                    g = ["start", "query", "num", "nextStart"];
                a = d.request(a, f).then(c.hitch(this, function(a) {
                    a.results = d.resultsToTypedArray(e, {
                        portal: this
                    }, a);
                    a.queryParams = c.mixin({}, f);
                    a.nextQueryParams = c.mixin(f, {
                        start: a.nextStart
                    });
                    return d.clearFieldsFromObject(g, a)
                }));
                a = c.delegate(a);
                a.queryParams = c.mixin({}, f);
                a.nextQueryParams = l.when(a, function(a) {
                    return a.nextQueryParams
                });
                return k(a)
            }
        }),
        PortalFolder: t,
        PortalGroup: s,
        PortalItem: m,
        PortalComment: n,
        PortalRating: p,
        PortalUtil: d,
        PortalResult: k,
        PortalListing: q
    }
});