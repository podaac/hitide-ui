//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/dom", "dojo/dom-attr", "dojo/dom-construct", "dojo/dom-style", "dojo/dom-class", "dojo/dom-geometry", "../kernel", "../lang", "../SpatialReference", "../geometry/webMercatorUtils", "../geometry/Extent"], function(w, l, h, q, x, C, D, y, s, t, r, k, u, E, v, z, A, B) {
    return w(null, {
        declaredClass: "esri.dijit.Attribution",
        itemDelimiter: " | ",
        listClass: "esriAttributionList",
        itemClass: "esriAttributionItem",
        lastItemClass: "esriAttributionLastItem",
        delimiterClass: "esriAttributionDelim",
        constructor: function(d, b) {
            try {
                l.mixin(this, d);
                this._attributions = {};
                this._pendingDfds = {};
                this._activeLayers = [];
                this._sharedLayers = [];
                var a = this.domNode = y.byId(b),
                    c = this.map,
                    e = "Map Data Provided By NASA, JPL, Dawn, USGS, DLR \x3cspan style='display:none' class\x3d'" + this.listClass + "'\x3e\x3c/span\x3e";
                a && (s.set(a, "innerHTML", e), this.listNode = x.query(".esriAttributionList", a)[0], this.itemNodes = {});
                this._eventConnections = [q.connect(c, "onLayerAdd", this, this._onLayerAdd), q.connect(c, "onLayerRemove", this, this._onLayerRemove), q.connect(c,
                    "onLayerSuspend", this, this._onLayerSuspend), q.connect(c, "onLayerResume", this, this._onLayerResume), q.connect(c, "onExtentChange", this, this._onExtentChange)];
                if (c.loaded) {
                    var f = c.layerIds.concat(c.graphicsLayerIds),
                        g, n, p = f.length;
                    for (n = 0; n < p; n++) g = c.getLayer(f[n]), g.loaded && this._onLayerAdd(g)
                }
            } catch (h) {}
        },
        startup: function() {},
        destroy: function() {
            h.forEach(this._eventConnections, q.disconnect);
            t.destroy(this.listNode);
            this.map = this.domNode = this._eventConnections = this.listNode = this._attributions = this._pendingDfds =
                this.itemNodes = this._activeLayers = this._lastItem = this._sharedLayers = null
        },
        _onLayerAdd: function(d) {
            try {
                var b = this._attributions,
                    a = d.id;
                if (!v.isDefined(b[a]) && d.showAttribution)
                    if (d.hasAttributionData) {
                        var c = d.getAttributionData();
                        this._pendingDfds[a] = 1;
                        b[a] = c;
                        c.addBoth(l.partial(this._onAttributionLoad, this, d))
                    } else b[a] = d.copyright || d.copyrightText || "", b[a] ? (d.suspended || this._activeLayers.push(a), this._createNode(a)) : this._onLayerRemove(d)
            } catch (e) {}
        },
        _onAttributionLoad: function(d, b, a) {
            var c = d._attributions,
                e = d._pendingDfds,
                f = b.id;
            if (e && e[f]) {
                delete e[f];
                if (!a || a instanceof Error) a = "";
                c[f] = a ? d._createIndexByLevel(a, -1 !== b.declaredClass.toLowerCase().indexOf("vetiledlayer")) : b.copyright || b.copyrightText || "";
                c[f] ? (b.suspended || d._activeLayers.push(f), d._createNode(f)) : d._onLayerRemove(b)
            }
        },
        _onLayerRemove: function(d) {
            try {
                var b = d.id,
                    a = this.itemNodes,
                    c, e = -1;
                this._onLayerSuspend(d);
                delete this._attributions[b];
                delete this._pendingDfds[b];
                c = this._getGroupIndex(b); - 1 !== c && (e = h.indexOf(this._sharedLayers[c],
                    b), -1 !== e && (this._sharedLayers[c].splice(e, 1), 1 >= this._sharedLayers[c].length && this._sharedLayers.splice(c, 1)));
                a[b] && -1 === e && t.destroy(a[b]);
                delete a[b];
                this._updateLastItem()
            } catch (f) {}
        },
        _onLayerSuspend: function(d) {
            try {
                var b = d.id;
                if (this._attributions[b]) {
                    var a = h.indexOf(this._activeLayers, b),
                        c = this.itemNodes[b]; - 1 !== a && this._activeLayers.splice(a, 1);
                    c && this._toggleItem(c, !1, this._getGroupIndex(b))
                }
            } catch (e) {}
        },
        _onLayerResume: function(d) {
            try {
                var b = d.id,
                    a = this._attributions[b],
                    c = this.itemNodes[b];
                if (a && (-1 === h.indexOf(this._activeLayers, b) && this._activeLayers.push(b), c)) {
                    var e = l.isString(a) ? a : this._getContributorsList(a, this.map.extent, this.map.getLevel());
                    l.isString(a) || s.set(c, "innerHTML", e ? e + this._getDelimiter() : "");
                    e && this._toggleItem(c, !0, this._getGroupIndex(b))
                }
            } catch (f) {}
        },
        _onExtentChange: function(d, b, a, c) {
            try {
                var e = this._activeLayers,
                    f = this._attributions,
                    g = this.itemNodes,
                    n, p, h, k, q = e.length || 0;
                for (k = 0; k < q; k++)
                    if (p = e[k], h = f[p], (n = g[p]) && !l.isString(h)) {
                        var m = this._getContributorsList(h,
                            d, c ? c.level : -1);
                        s.set(n, "innerHTML", m ? m + this._getDelimiter() : "");
                        this._toggleItem(n, !!m, -1)
                    }
            } catch (r) {}
            this._adjustCursorStyle()
        },
        _createNode: function(d) {
            if (this.domNode) {
                var b = this._checkShareInfo(d),
                    a = b && b.sharedWith,
                    a = a && this.itemNodes[a],
                    c = this.map,
                    e = this._attributions[d],
                    e = l.isString(e) ? e : this._getContributorsList(e, c.extent, c.getLevel()),
                    c = !!e && !c.getLayer(d).suspended;
                a ? (this.itemNodes[d] = a, this._toggleItem(a, c, b.index)) : (d = this.itemNodes[d] = t.create("span", {
                    "class": this.itemClass,
                    innerHTML: e ?
                        e + this._getDelimiter() : "",
                    style: {
                        display: c ? "inline" : "none"
                    }
                }, this.listNode), c && this._setLastItem(d));
                this._adjustCursorStyle()
            }
        },
        _checkShareInfo: function(d) {
            var b = this._attributions,
                a, c, e = -1,
                f = b[d],
                g;
            if (f && l.isString(f)) {
                for (c in b)
                    if (a = b[c], c !== d && a && l.isString(a) && a.length === f.length && a.toLowerCase() === f.toLowerCase()) {
                        g = c;
                        break
                    }
                b = this._sharedLayers;
                a = b.length;
                if (g) {
                    for (c = 0; c < a; c++)
                        if (f = b[c], -1 !== h.indexOf(f, g)) {
                            e = c;
                            f.push(d);
                            break
                        } - 1 === e && (e = b.push([g, d]) - 1)
                }
            }
            return -1 < e ? {
                index: e,
                sharedWith: g
            } :
                null
        },
        _getGroupIndex: function(d) {
            var b = this._sharedLayers,
                a, c = b.length,
                e = -1;
            for (a = 0; a < c; a++)
                if (-1 !== h.indexOf(b[a], d)) {
                    e = a;
                    break
                }
            return e
        },
        _getDelimiter: function() {
            var d = this.itemDelimiter;
            return d ? "\x3cspan class\x3d'" + this.delimiterClass + "'\x3e" + d + "\x3c/span\x3e" : ""
        },
        _toggleItem: function(d, b, a) {
            if (-1 < a && !b) {
                a = this._sharedLayers[a];
                var c, e = a.length,
                    f = this._activeLayers;
                for (c = 0; c < e; c++)
                    if (-1 !== h.indexOf(f, a[c])) return
            }
            r.set(d, "display", b ? "inline" : "none");
            this._updateLastItem()
        },
        _updateLastItem: function() {
            var d =
                this.listNode.childNodes,
                b;
            b = d.length;
            var a;
            if (b)
                for (b -= 1; 0 <= b; b--)
                    if (a = d[b], "none" !== r.get(a, "display")) {
                        this._setLastItem(a);
                        break
                    }
            this._adjustCursorStyle()
        },
        _setLastItem: function(d) {
            var b = this.itemClass,
                a = this.lastItemClass;
            this._lastItem && k.replace(this._lastItem, b, a);
            d && (k.replace(d, a, b), this._lastItem = d)
        },
        _createIndexByLevel: function(d, b) {
            var a = d.contributors,
                c, e, f, g, n = a ? a.length : 0,
                p, h, k = new z(4326),
                l = {},
                m;
            for (g = 0; g < n; g++) {
                c = a[g];
                h = (e = c.coverageAreas) ? e.length : 0;
                for (p = 0; p < h; p++) {
                    f = e[p];
                    m = f.bbox;
                    m = {
                        extent: A.geographicToWebMercator(new B(m[1], m[0], m[3], m[2], k)),
                        attribution: c.attribution || "",
                        zoomMin: f.zoomMin - (b && f.zoomMin ? 1 : 0),
                        zoomMax: f.zoomMax - (b && f.zoomMax ? 1 : 0),
                        score: v.isDefined(f.score) ? f.score : 100,
                        objectId: g
                    };
                    for (f = m.zoomMin; f <= m.zoomMax; f++) l[f] = l[f] || [], l[f].push(m)
                }
            }
            return l
        },
        _getContributorsList: function(d, b, a) {
            var c = "";
            if (b && v.isDefined(a) && -1 < a) {
                d = d[a];
                a = b.getCenter().normalize();
                for (var e = d ? d.length : 0, f = [], g = {}, c = 0; c < e; c++) b = d[c], !g[b.objectId] && b.extent.contains(a) && (g[b.objectId] =
                    1, f.push(b));
                f.sort(function(a, b) {
                    return b.score - a.score || a.objectId - b.objectId
                });
                e = f.length;
                for (c = 0; c < e; c++) f[c] = f[c].attribution;
                c = f.join(", ")
            }
            return c
        },
        _adjustCursorStyle: function() {
            var d = u.position(this.listNode.parentNode, !0).h;
            k.contains(this.listNode.parentNode, "esriAttributionOpen") ? (k.remove(this.listNode.parentNode, "esriAttributionOpen"), d > u.position(this.listNode.parentNode, !0).h ? (r.set(this.listNode.parentNode, "cursor", "pointer"), k.add(this.listNode.parentNode, "esriAttributionOpen")) :
                r.set(this.listNode.parentNode, "cursor", "default")) : (k.add(this.listNode.parentNode, "esriAttributionOpen"), d < u.position(this.listNode.parentNode, !0).h ? r.set(this.listNode.parentNode, "cursor", "pointer") : r.set(this.listNode.parentNode, "cursor", "default"), k.remove(this.listNode.parentNode, "esriAttributionOpen"))
        }
    })
});