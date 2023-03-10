//>>built
define(["../../declare", "dojo/_base/lang", "dojo/string", "./_Wizard", "./InfographicsOptions", "./InfographicsMainPage", "./DataBrowser", "./lang", "dojo/i18n!../../nls/jsapi"], function(r, a, x, s, p, t, u, v, y) {
    return r("esri.dijit.geoenrichment.InfographicsConfig", [s], {
        options: null,
        _eventMap: {
            ok: !0,
            cancel: !0
        },
        constructor: function() {
            this.pages.m = new t({
                onAddVariables: a.hitch(this, this._addVariables),
                onOK: a.hitch(this, this._onOK),
                onCancel: a.hitch(this, this._onCancel)
            })
        },
        startup: function() {
            this.inherited(arguments);
            this.options ||
                this.set("options", new p);
            this.loadPage("m")
        },
        _setOptionsAttr: function(a) {
            this._set("options", a);
            this.pages.m.set("options", a)
        },
        _addVariables: function() {
            var w = this,
                d = this.pages.db;
            d || (d = new u({
                countryID: "US",
                countryBox: !1,
                multiSelect: !0,
                title: this.pages.m.nls.mainTitle,
                onBack: a.hitch(this, this.loadPage, "m"),
                onCancel: a.hitch(this, this._onCancel),
                onOK: a.hitch(this, this._applyVariables)
            }), this.pages.db = d);
            var e = this.pages.m.get("country");
            d.set("countryID", e);
            var f = [];
            this.options.getItems(e).then(function(a) {
                for (var g =
                    0; g < a.length; g++) {
                    var c = a[g];
                    !("OneVar" != c.type || 1 != c.variables.length) && f.push(c.variables[0])
                }
                d.set("selection", f);
                w.loadPage("db")
            })
        },
        _applyVariables: function() {
            function a(d) {
                if (!l)
                    for (var b = 0; b < f.length; b++) l[f[b].id] = f[b];
                return l[d]
            }
            for (var d = this, e = this.pages.m.get("country"), f = this.pages.db.dataCollections[e], l = null, g = {}, c = this.pages.db.get("selection"), m = 0; m < c.length; m++) {
                var k = c[m];
                if (v.endsWith(k, ".*"))
                    for (var k = k.split(".")[0], q = a(l).variables, n = 0; n < q.length; n++) g[k + "." + q[n].id] = !0;
                else g[k] = !0
            }
            this.options.getItems(e).then(function(a) {
                for (var b = a.length - 1; 0 <= b; b--) {
                    var h = a[b];
                    if (!("OneVar" != h.type || 1 != h.variables.length)) {
                        var c = h.variables[0];
                        g[c] ? g[c] = !1 : a.splice(b, 1)
                    }
                }
                for (b = 0; b < f.length; b++)
                    for (var c = f[b].variables, e = 0; e < c.length; e++) h = f[b].id + "." + c[e].id, g[h] && (h = new p.Item("OneVar", [h]), h.title = c[e].alias, a.push(h));
                d.loadPage("m");
                d.pages.m.set("options", d.options)
            })
        },
        _onOK: function() {
            this.onOK()
        },
        onOK: function() {},
        _onCancel: function() {
            this.onCancel()
        },
        onCancel: function() {}
    })
});