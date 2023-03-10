//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/dom", "dojo/dom-class", "dojo/dom-construct", "./_TouchBase", "../kernel"], function(m, r, k, n, l, s, t, p, g, d, q, u) {
    return m(null, {
        declaredClass: "esri.dijit.NavigationBar",
        _items: [],
        constructor: function(a, b) {
            var c;
            this.container = p.byId(b);
            this._touchBase = q(this.container, null);
            this._slideDiv = d.create("div", {}, this.container, "first");
            this.events = [k.connect(this._touchBase, "onclick", this,
                this._onClickHandler)];
            this._items = a.items;
            g.add(this.container, "esriMobileNavigationBar");
            var h = d.create("div", {}, this._slideDiv);
            for (c = 0; c < this._items.length; c++) {
                var e, f;
                switch (this._items[c].type) {
                    case "img":
                        f = d.create("div", {
                            "class": "esriMobileNavigationItem"
                        }, h);
                        e = d.create("img", {
                            src: this._items[c].src.toString(),
                            style: {
                                width: "100%",
                                height: "100%"
                            }
                        }, f);
                        break;
                    case "span":
                        f = d.create("div", {
                            "class": "esriMobileNavigationItem"
                        }, h);
                        e = d.create("span", {
                            innerHTML: this._items[c].text
                        }, f);
                        break;
                    case "div":
                        f =
                            d.create("div", {
                                "class": "esriMobileNavigationInfoPanel"
                            }, h), e = d.create("div", {
                                innerHTML: this._items[c].text
                            }, f)
                }
                g.add(f, this._items[c].position);
                this._items[c].className && g.add(e, this._items[c].className);
                e._index = c;
                e._item = this._items[c];
                this._items[c]._node = e
            }
        },
        startup: function() {
            this.onCreate(this._items)
        },
        destroy: function() {
            n.forEach(this.events, k.disconnect);
            this._touchBase = null;
            l.query("img", this.container).forEach(function(a) {
                a._index = null;
                a._item = null;
                d.destroy(a)
            });
            this._items = null;
            d.destroy(this._slideDiv);
            d.destroy(this.container);
            this.container = this._slideDiv = null
        },
        getItems: function() {
            return this._items
        },
        select: function(a) {
            this._markSelected(a._node, a)
        },
        onSelect: function(a) {},
        onUnSelect: function(a) {},
        onCreate: function(a) {},
        _onClickHandler: function(a) {
            if ("img" === a.target.tagName.toLowerCase()) {
                var b = a.target,
                    c = b._item;
                l.query("img", this.container).forEach(function(a) {
                    a !== b && a._item.toggleGroup === c.toggleGroup && this._markUnSelected(a, a._item)
                }, this);
                this._toggleNode(b, c)
            }
        },
        _toggleNode: function(a, b) {
            "ON" ===
                b.toggleState ? (b.toggleState = "OFF", b.src && (a.src = b.src.toString()), this.onUnSelect(b)) : (b.toggleState = "ON", b.srcAlt && (a.src = b.srcAlt), this.onSelect(b))
        },
        _markSelected: function(a, b) {
            b.toggleState = "ON";
            b.srcAlt && (a.src = b.srcAlt);
            this.onSelect(b)
        },
        _markUnSelected: function(a, b) {
            "ON" === b.toggleState && (b.toggleState = "OFF", b.src && (a.src = b.src.toString()), this.onUnSelect(b))
        }
    })
});