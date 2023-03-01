//>>built
define(["dojo/dom-construct", "dojo/dom-attr", "dojo/_base/lang", "dojox/mvc/Templated", "dojo/on", "../../../declare", "dijit/_WidgetBase", "dojo/text!./templates/ShoppingCart.html", "dgrid/List", "dojo/i18n!../../../nls/jsapi", "dojo/_base/window"], function(e, h, c, k, f, l, m, n, p, g, q) {
    g = g.geoenrichment.dijit.ShoppingCart;
    return l("esri.dijit.geoenrichment.ShoppingCart", [m, k], {
        nls: g,
        templateString: n,
        list: null,
        content: {},
        multiSelect: !0,
        constructor: function() {
            this.inherited(arguments)
        },
        buildRendering: function() {
            this.inherited(arguments);
            f(this.divList, "click, touchend", c.hitch(this, this._stopEvent))
        },
        displayCounter: function() {
            this.divCounter.innerHTML = this.contentLength().toString()
        },
        contentLength: function() {
            var a = 0,
                b;
            for (b in this.content) a++;
            return a
        },
        startup: function() {
            this.inherited(arguments);
            this.list = new p({
                renderRow: c.hitch(this, this.renderVariableRow)
            }, this.divList);
            this.list.startup();
            this.displayCounter();
            this.divOuter.style.display = "none"
        },
        renderVariableRow: function(a) {
            var b = e.create("div", {
                    "class": "ShoppingCartRowOuter"
                }),
                d = e.create("div", {
                    "class": "ShoppingCartRow"
                }, b);
            e.create("div", {
                "class": "TrimWithEllipses ShoppingCartRowLabel",
                innerHTML: a.alias
            }, d);
            d = e.create("div", {
                "class": "ShoppingCartRowCloser"
            }, d);
            h.set(d, "idDesc", a.idDesc);
            f(d, "click", c.hitch(this, this.onClick));
            return b
        },
        onClick: function(a) {
            delete this.content[a.currentTarget.attributes.idDesc.value];
            this.onRemoveElement(a.currentTarget.attributes.idDesc.value);
            this.refresh()
        },
        _showList: function(a) {
            "none" === this.divOuter.style.display && (this._stopEvent(a),
                this._displayList())
        },
        _toggleList: function(a) {
            this._stopEvent(a);
            "none" === this.divOuter.style.display ? this._displayList() : this._hideList()
        },
        _displayList: function() {
            this.refresh();
            this.divOuter.style.display = "";
            event.stopPropagation && event.stopPropagation();
            f.once(this.divOuter, "mouseleave", c.hitch(this, this._hideList));
            f.once(q.doc, "click", c.hitch(this, this._hideList))
        },
        _hideList: function() {
            this.divOuter && (this.divOuter.style.display = "none")
        },
        _stopEvent: function(a) {
            a.stopPropagation && a.stopPropagation()
        },
        addVariable: function(a) {
            this.content[a.idDesc] || (this.content[a.idDesc] = a, this.displayCounter(), this.onSelect());
            return !0
        },
        setVariables: function(a) {
            this.content = {};
            for (var b = 0; b < a.length; b++) this.multiSelect || (this.content = {}), this.content[a[b].idDesc] = a[b];
            this.displayCounter()
        },
        addVariables: function(a) {
            for (var b = 0; b < a.length; b++) this.multiSelect || (this.content = {}), this.content[a[b].idDesc] = a[b];
            this.displayCounter();
            this.onSelect()
        },
        removeVariable: function(a) {
            delete this.content[a];
            this.displayCounter()
        },
        refresh: function() {
            var a = [],
                b;
            for (b in this.content) a.push(this.content[b]);
            this.list.refresh();
            this.list.renderArray(a);
            this.displayCounter();
            this.divEmpty.style.visibility = 0 === a.length ? "visible" : "hidden"
        },
        collectSelection: function() {
            var a = [],
                b;
            for (b in this.content) a.push(this.content[b].id2);
            return a
        },
        onRemoveElement: function(a) {},
        onSelect: function() {}
    })
});