//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/kernel", "dojo/has", "dojo/keys", "dojo/query", "dojo/dom", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-geometry", "dojo/window", "dojo/i18n!../nls/jsapi", "../kernel", "../domUtils", "../geometry/Extent", "./BookmarkItem", "../Evented"], function(q, c, r, d, g, w, s, x, t, f, e, k, u, l, y, n, h, p, v) {
    return q(v, {
        declaredClass: "esri.dijit.Bookmarks",
        _eventMap: {
            click: !0,
            edit: !0,
            remove: !0
        },
        constructor: function(a, b) {
            this.map = a.map;
            this.editable = a.editable;
            this.initBookmarks = a.bookmarks;
            this._clickHandlers = this._mouseOverHandlers = this._mouseOutHandlers = this._removeHandlers = this._editHandlers = [];
            this.bookmarkDomNode = f.create("div");
            e.add(this.bookmarkDomNode, "esriBookmarkList");
            this.bookmarkTable = f.create("table");
            e.add(this.bookmarkTable, "esriBookmarkTable");
            this.bookmarkDomNode.appendChild(this.bookmarkTable);
            b = t.byId(b);
            b.appendChild(this.bookmarkDomNode);
            this.scrNodeRef = b;
            e.add(this.scrNodeRef, "esriBookmarks");
            this._addInitialBookmarks()
        },
        onClick: function() {},
        onEdit: function() {},
        onRemove: function() {},
        addBookmark: function(a) {
            var b;
            "esri.dijit.BookmarkItem" == a.declaredClass ? b = a : (b = new h(a.extent), b = new p({
                name: a.name,
                extent: b
            }));
            this.bookmarks.push(b);
            if (this.editable) {
                b = l.widgets.bookmarks;
                b = f.create("div", {
                    innerHTML: "\x3cdiv class\x3d'esriBookmarkLabel'\x3e" + a.name + "\x3c/div\x3e\x3cdiv title\x3d'" + b.NLS_bookmark_remove + "' class\x3d'esriBookmarkRemoveImage'\x3e\x3cbr/\x3e\x3c/div\x3e\x3cdiv title\x3d'" + b.NLS_bookmark_edit + "' class\x3d'esriBookmarkEditImage'\x3e\x3cbr/\x3e\x3c/div\x3e"
                });
                var m = g.query(".esriBookmarkEditImage", b)[0],
                    d = g.query(".esriBookmarkRemoveImage", b)[0];
                this._removeHandlers.push(c.connect(d, "onclick", this, "_removeBookmark"));
                this._editHandlers.push(c.connect(m, "onclick", this, "_editBookmarkLabel"))
            } else b = f.create("div", {
                innerHTML: "\x3cdiv class\x3d'esriBookmarkLabel' style\x3d'width: 210px;'\x3e" + a.name + "\x3c/div\x3e"
            });
            e.add(b, "esriBookmarkItem");
            "esri.geometry.Extent" != a.extent.declaredClass && new h(a.extent);
            m = g.query(".esriBookmarkLabel", b)[0];
            this._clickHandlers.push(c.connect(m,
                "onclick", r.hitch(this, "_onClickHandler", a)));
            this._mouseOverHandlers.push(c.connect(b, "onmouseover", function() {
                e.add(this, "esriBookmarkHighlight")
            }));
            this._mouseOutHandlers.push(c.connect(b, "onmouseout", function() {
                e.remove(this, "esriBookmarkHighlight")
            }));
            a = this.bookmarkTable;
            a.insertRow(a.rows.length).insertCell(0).appendChild(b);
            u.scrollIntoView(b)
        },
        removeBookmark: function(a) {
            var b;
            b = g.query(".esriBookmarkLabel", this.bookmarkDomNode);
            b = d.filter(b, function(b) {
                return b.innerHTML == a
            });
            d.forEach(b,
                function(a) {
                    a.parentNode.parentNode.parentNode.parentNode.removeChild(a.parentNode.parentNode.parentNode)
                });
            for (b = this.bookmarks.length - 1; 0 <= b; b--) this.bookmarks[b].name == a && this.bookmarks.splice(b, 1);
            this.onRemove()
        },
        hide: function() {
            n.hide(this.bookmarkDomNode)
        },
        show: function() {
            n.show(this.bookmarkDomNode)
        },
        destroy: function() {
            this.map = null;
            d.forEach(this._clickHandlers, function(a, b) {
                c.disconnect(a)
            });
            d.forEach(this._mouseOverHandlers, function(a, b) {
                c.disconnect(a)
            });
            d.forEach(this._mouseOutHandlers,
                function(a, b) {
                    c.disconnect(a)
                });
            d.forEach(this._removeHandlers, function(a, b) {
                c.disconnect(a)
            });
            d.forEach(this._editHandlers, function(a, b) {
                c.disconnect(a)
            });
            f.destroy(this.bookmarkDomNode)
        },
        toJson: function() {
            var a = [];
            d.forEach(this.bookmarks, function(b, c) {
                a.push(b.toJson())
            });
            return a
        },
        _addInitialBookmarks: function() {
            if (this.editable) {
                var a = f.create("div", {
                    innerHTML: "\x3cdiv\x3e" + l.widgets.bookmarks.NLS_add_bookmark + "\x3c/div\x3e"
                });
                e.add(a, "esriBookmarkItem");
                e.add(a, "esriAddBookmark");
                this._clickHandlers.push(c.connect(a,
                    "onclick", this, this._newBookmark));
                this._mouseOverHandlers.push(c.connect(a, "onmouseover", function() {
                    e.add(this, "esriBookmarkHighlight")
                }));
                this._mouseOutHandlers.push(c.connect(a, "onmouseout", function() {
                    e.remove(this, "esriBookmarkHighlight")
                }));
                this.scrNodeRef.appendChild(a)
            }
            this.bookmarks = [];
            d.forEach(this.initBookmarks, function(a, c) {
                this.addBookmark(a)
            }, this)
        },
        _removeBookmark: function(a) {
            this.bookmarks.splice(a.target.parentNode.parentNode.parentNode.rowIndex, 1);
            a.target.parentNode.parentNode.parentNode.parentNode.removeChild(a.target.parentNode.parentNode.parentNode);
            this.onRemove()
        },
        _editBookmarkLabel: function(a) {
            a = a.target.parentNode;
            var b = k.position(a, !0),
                b = f.create("div", {
                    innerHTML: "\x3cinput type\x3d'text' class\x3d'esriBookmarkEditBox' style\x3d'left:" + b.x + "px; top:" + b.y + "px;'/\x3e"
                });
            this._inputBox = g.query("input", b)[0];
            this._label = g.query(".esriBookmarkLabel", a)[0];
            this._inputBox.value = this._label.innerHTML == l.widgets.bookmarks.NLS_new_bookmark ? "" : this._label.innerHTML;
            c.connect(this._inputBox, "onkeyup", this, function(a) {
                switch (a.keyCode) {
                    case s.ENTER:
                        this._finishEdit()
                }
            });
            c.connect(this._inputBox, "onblur", this, "_finishEdit");
            a.appendChild(b);
            this._inputBox.focus();
            b = k.position(a, !0);
            this._inputBox.style.left = b.x + "px";
            this._inputBox.style.top = b.y + "px"
        },
        _finishEdit: function() {
            try {
                this._inputBox.parentNode.parentNode.removeChild(this._inputBox.parentNode)
            } catch (a) {}
            var b = l.widgets.bookmarks.NLS_new_bookmark;
            this._label.innerHTML = "" == this._inputBox.value ? b : this._inputBox.value;
            var c = g.query(".esriBookmarkLabel", this.bookmarkDomNode);
            d.forEach(this.bookmarks, function(a,
                b) {
                a.name = c[b].innerHTML
            });
            this.onEdit()
        },
        _newBookmark: function() {
            var a = this.map,
                b = l.widgets.bookmarks.NLS_new_bookmark,
                c = a.extent;
            if (a.spatialReference._isWrappable()) {
                var d = h.prototype._normalizeX(c.xmin, a.spatialReference._getInfo()).x,
                    e = h.prototype._normalizeX(c.xmax, a.spatialReference._getInfo()).x;
                if (d > e) {
                    var f = a.spatialReference.isWebMercator(),
                        k = f ? 2.0037508342788905E7 : 180,
                        f = f ? -2.0037508342788905E7 : -180;
                    Math.abs(d - k) > Math.abs(e - f) ? e = k : d = f
                }
                a = new h(d, c.ymin, e, c.ymax, a.spatialReference)
            } else a =
                c;
            b = new p({
                name: b,
                extent: a
            });
            this.addBookmark(b);
            b = g.query(".esriBookmarkItem", this.bookmarkDomNode);
            a = {
                target: {
                    parentNode: null
                }
            };
            a.target.parentNode = b[b.length - 1];
            this._editBookmarkLabel(a)
        },
        _onClickHandler: function(a) {
            var b = a.extent;
            a.extent.declaredClass || (b = new h(a.extent));
            this.map.setExtent(b);
            this.onClick()
        }
    })
});