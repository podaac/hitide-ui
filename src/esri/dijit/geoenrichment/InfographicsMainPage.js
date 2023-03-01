//>>built
define(["require", "../../declare", "dojo/_base/lang", "dojo/on", "dojo/dom-construct", "dojo/dom-class", "dojo/Deferred", "./_WizardPage", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/InfographicsMainPage.html", "../../tasks/geoenrichment/GeoenrichmentTask", "./config", "./_Invoke", "./CheckList", "./theme", "./DataBrowser/autoTooltip", "dijit/layout/ContentPane", "dijit/form/Select", "./BufferOptions"], function(u, g, k, v, f, w, x, l, e, m, n, h, p, q, r, s) {
    e = e.geoenrichment.dijit.InfographicsMainPage;
    var t = g([q], {
        renderRow: function(a, c) {
            var b = a.item,
                d = f.create("div", {
                    "class": "InfographicsMainPage_Item"
                }, this.itemsDiv);
            f.create("div", {
                "class": "dijit dijitInline dijitCheckBox InfographicsMainPage_ItemCheck"
            }, d);
            var e = f.create("div", {
                "class": "InfographicsMainPage_ItemLabel TrimWithEllipses",
                innerHTML: b.title
            }, d);
            f.create("div", {
                "class": "InfographicsMainPage_ItemImage InfographicsMainPage_ItemImage_" + b.type
            }, e);
            return d
        }
    });
    return g("esri.dijit.geoenrichment.InfographicsMainPage", [l, p], {
        templateString: m,
        nls: e,
        options: null,
        _varList: null,
        _eventMap: {
            "add-variables": !0,
            ok: !0,
            cancel: !0
        },
        constructor: function() {
            this._task = new n(h.server);
            this._task.token = h.token
        },
        buildRendering: function() {
            this.inherited(arguments);
            var a = k.hitch(this, this.invoke, "_onSelect"),
                c = this._varList = new t({}, this.varListNode);
            c.on("dgrid-select", a);
            c.on("dgrid-deselect", a);
            s(this.varListNode)
        },
        startup: function() {
            this.inherited(arguments);
            this.countrySelect.addOption({
                value: "_",
                label: e.loading
            });
            this.countrySelect.set("disabled", !0);
            this.resize();
            this.showProgress(this._task.getAvailableCountries(),
                "_onCountriesResponse")
        },
        _onCountriesResponse: function(a) {
            this.countrySelect.set("disabled", !1);
            for (var c = [], b = 0; b < a.length; b++) c.push({
                label: a[b].name,
                value: a[b].id
            });
            this.countrySelect.set("options", c);
            this.countrySelect.set("value", "US")
        },
        _getCountryAttr: function() {
            return this.countrySelect.get("value")
        },
        _setOptionsAttr: function(a) {
            this._set("options", a);
            this.themeSelect.set("value", a.theme);
            this.bufferOptions.set("buffer", a.studyAreaOptions);
            this._renderItems()
        },
        _onCountryChanged: function() {
            this._renderItems()
        },
        _onThemeChange: function(a, c) {
            var b = this.options.theme,
                d = this.themeSelect.get("value");
            r.change(this.varListNode, b, d);
            this.options.theme = d
        },
        _renderItems: function() {
            var a = this.countrySelect.get("value");
            a && "_" != a && this.showProgress(this.options.getItems(a), "_onGetItems")
        },
        _onGetItems: function(a) {
            for (var c = [], b = [], d = 0; d < a.length; d++) {
                var e = a[d],
                    f = d.toString();
                c.push({
                    id: f,
                    item: e
                });
                e.isVisible && b.push(f)
            }
            this._varList.set("items", c);
            this._varList.clearSelection();
            for (d = 0; d < b.length; d++) this._varList.select(b[d]);
            this.addMoreNode.style.display = "";
            this.resize()
        },
        _onSelect: function() {
            var a = !1,
                c = this._varList.get("selection"),
                b;
            for (b in c)
                if (c[b]) {
                    a = !0;
                    break
                }
            this.okButton.disabled = !a
        },
        _onBufferChange: function() {
            this.options.studyAreaOptions = this.bufferOptions.get("buffer")
        },
        _onAddVariables: function() {
            this.onAddVariables()
        },
        onAddVariables: function() {},
        _onOK: function() {
            for (var a = this._varList, c = a.get("store").data, b = 0; b < c.length; b++) c[b].item.isVisible = a.isSelected(c[b]);
            this.onOK()
        },
        onOK: function() {},
        _onCancel: function() {
            this.onCancel()
        },
        onCancel: function() {}
    })
});