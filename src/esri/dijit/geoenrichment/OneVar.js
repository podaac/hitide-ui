//>>built
define(["../../declare", "./BaseWidget", "./dom", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-attr", "dojo/query", "dojo/string", "./lang", "dojo/i18n!../../nls/jsapi", "./utils", "./formatVariable"], function(q, u, r, m, n, h, v, w, t, l, x, p) {
    l = l.geoenrichment.dijit.OneVar;
    return q("esri.dijit.geoenrichment.OneVar", [u], {
        constructor: function() {
            this._state = {
                sortBy: 1,
                sortDesc: !0
            }
        },
        _calculate: function() {
            var e = this.getDataFields(),
                g = this.getFieldByIndex(e[0]);
            this.primary.innerHTML = this.formatByIndex(0, e[0]) + " ";
            return {
                firstCol: g
            }
        },
        updateUIExpanded: function() {
            this.inherited(arguments);
            var e = this._calculate().firstCol,
                g = null;
            if (e) {
                for (var b = [], f = this.data.features.length, a = 0; a < f; a++) {
                    var d = [];
                    g || (g = d);
                    d.push(this.getFeatureTitle(a));
                    d.push(this.getValueByName(a, e.name));
                    b.push(d)
                }
                this.site.innerHTML = l.subtitleSite2;
                this._sortRows(b);
                a = this.getValueByName(0, e.name);
                if (d = t.isNumber(a)) {
                    var c = this.getValueByName(f - 1, e.name),
                        f = this.getFeatureTitle(f - 1),
                        a = 1 - c / a;
                    0.0050 > Math.abs(a) && (a = 0);
                    this.comp.innerHTML = w.substitute(0 > a ? l.lessThan :
                        0 < a ? l.moreThan : l.same, {
                            site: f
                        })
                } else this.comp.innerHTML = "";
                for (var f = this.table, k = b.length + 1; 1 < f.rows.length;) f.deleteRow(-1);
                c = f.rows[0];
                if (d)
                    for (; 4 > c.cells.length;) c.insertCell(-1);
                else
                    for (; 2 < c.cells.length;) n.destroy(c.cells[c.cells.length - 1]);
                for (a = 1; a < k; a++) c = f.insertRow(-1), 0 == a % 2 && 0 < a && (c.className = "AlternatingRow"), h.set(c.insertCell(-1), "class", "OneVarMultiComparison_TextColumn"), h.set(c.insertCell(-1), "class", "OneVarMultiComparison_ValueColumn"), d && (c = h.set(c.insertCell(-1), "class", "OneVarMultiComparison_ChartColumn"),
                    h.set(c, "colspan", "2"));
                k = Number.NEGATIVE_INFINITY;
                if (d) {
                    for (a = 0; a < b.length; a++) b[a][1] > k && (k = b[a][1]);
                    k = x.getCeiling(k);
                    f.rows[0].cells[2].innerHTML = p(e, 0);
                    f.rows[0].cells[3].innerHTML = p(e, k)
                }
                for (a = 0; a < b.length; a++)
                    if (c = f.rows[a + 1], c.cells[0].innerHTML = b[a][0], c.cells[1].innerHTML = p(e, b[a][1]), d) {
                        var s;
                        b[a] === g ? (m.remove(c, "OneVarMultiComparison_Row"), m.add(c, "OneVarMultiComparison_CurrentRow"), s = "OneVarMultiComparison_Expanded_CurrentBar") : (m.remove(c, "OneVarMultiComparison_CurrentRow"), m.add(c,
                            "OneVarMultiComparison_Row"), s = "OneVarMultiComparison_Expanded_Bar");
                        var q = r.pct(b[a][1] / k);
                        c.cells[2].innerHTML = "\x3cdiv class\x3d'" + s + "' style\x3d'width:" + q + "' /\x3e";
                        h.set(c.cells[0], "style", "width:50%");
                        h.set(c.cells[1], "style", "width:20%")
                    } else h.set(c.cells[0], "style", "width:50%"), h.set(c.cells[1], "style", "width:50%")
            }
        },
        updateUICollapsed: function() {
            this.inherited(arguments);
            var e = this._calculate().firstCol,
                g = null;
            if (e) {
                for (var b = [], f = this.data.features.length, a = 0; a < f; a++) {
                    var d = [];
                    g || (g = d);
                    d.push(this.getFeatureTitle(a));
                    d.push(this.getValueByName(a, e.name));
                    b.push(d)
                }
                this._sortRows(b);
                for (var d = this.getValueByName(0, e.name), f = this.table, c = b.length + 1, a = f.rows.length; a < c; a++) {
                    var k = f.insertRow(-1);
                    0 == a % 2 && (k.className = "AlternatingRow");
                    h.set(k.insertCell(-1), "class", "OneVarMultiComparison_TextColumn");
                    h.set(k.insertCell(-1), "class", "OneVarMultiComparison_ValueColumn")
                }
                for (; f.rows.length > c;) f.deleteRow(-1);
                a = t.isNumber(d);
                d = v("col", this.table);
                a ? (h.set(d[0], "style", "width:70%"), h.set(d[1],
                    "style", "width:30%")) : (h.set(d[0], "style", "width:50%"), h.set(d[1], "style", "width:50%"));
                for (a = 0; a < b.length; a++) d = f.rows[a + 1], d.cells[0].innerHTML = b[a][0], d.cells[1].innerHTML = p(e, b[a][1]), b[a] === g ? (m.remove(d, "OneVarMultiComparison_Row"), m.add(d, "OneVarMultiComparison_CurrentRow")) : (m.remove(d, "OneVarMultiComparison_CurrentRow"), m.add(d, "OneVarMultiComparison_Row"))
            }
        },
        createUIExpanded: function(e) {
            this.inherited(arguments);
            var g = e.addHeader("div", {
                    "class": "OneVarMultiComparison_Value"
                }),
                g = n.create("table", {
                    cellpadding: "0",
                    cellspacing: "0"
                }, g),
                b = g.insertRow(0),
                b = b.insertCell(-1);
            this.site = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Site"
            }, b);
            b = g.insertRow(-1);
            b = b.insertCell(-1);
            this.primary = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Primary"
            }, b);
            this.comp = n.create("span", {
                "class": "OneVarMultiComparison_Comparison"
            }, b);
            this.table = e.addContent("table", {
                "class": "OneVarMultiComparison_Table"
            });
            r.createCols(this.table, [0.5, 0.2, 0.15, 0.15]);
            b = this.table.insertRow(-1);
            this._appendSortHeader(b, l.areaCol, 0, {
                "class": "OneVarMultiComparison_TextColumnHeader"
            });
            this._appendSortHeader(b, l.valueCol, 1, {
                "class": "OneVarMultiComparison_ValueColumnHeader"
            });
            h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Lower");
            h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Upper");
            this.autoHeight && e.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");
            e.addFooter("div")
        },
        createUICollapsed: function(e) {
            this.inherited(arguments);
            var g =
                e.addHeader("div", {
                    "class": "OneVarMultiComparison_Value"
                }),
                g = n.create("table", {
                    cellpadding: "0",
                    cellspacing: "0"
                }, g),
                b = g.insertRow(0),
                b = b.insertCell(-1);
            this.site = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Site"
            }, b);
            b = g.insertRow(-1);
            b = b.insertCell(-1);
            this.primary = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Primary"
            }, b);
            this.table = e.addContent("table", {
                "class": "OneVarMultiComparison_Table"
            });
            r.createCols(this.table, [0.7, 0.3]);
            b = this.table.insertRow(-1);
            this._appendSortHeader(b,
                l.areaCol, 0, {
                    "class": "OneVarMultiComparison_TextColumnHeader"
                });
            this._appendSortHeader(b, l.valueCol, 1, {
                "class": "OneVarMultiComparison_ValueColumnHeader"
            });
            h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Lower");
            h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Upper");
            this.autoHeight && e.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");
            e.addFooter("div")
        }
    })
});