//>>built
define(["../../declare", "./BaseSelectComparison", "./dom", "dojo/dom-construct", "dojo/dom-attr", "./lang", "dojo/i18n!../../nls/jsapi", "dojo/dom-class", "dojo/query", "dojo/string", "dojo/number", "./formatVariable"], function(u, v, n, s, h, w, g, l, y, t, x, k) {
    g = g.geoenrichment.dijit.RelatedVariables;
    return u("esri.dijit.geoenrichment.RelatedVariables", [v], {
        _calculate: function() {
            for (var b, c, a = Number.NEGATIVE_INFINITY, e = Number.POSITIVE_INFINITY, d = Number.NEGATIVE_INFINITY, f = Number.POSITIVE_INFINITY, g = Number.NEGATIVE_INFINITY, h = Number.POSITIVE_INFINITY,
                l = [], k = this.getDataFields(), p = 0; p < k.length; p++) {
                var n = this.getFieldByIndex(k[p]),
                    m = this.getValueByName(0, n.name),
                    q;
                q = 0 <= this._state.selectedComparison ? x.round(m - this.getValueByName(this._getComparisonRow(), n.name), n.decimals || 0) : Number.NaN;
                q > d && (d = q);
                q < f && (f = q);
                var r = [];
                r.push(p);
                r.push(n.alias);
                r.push(m);
                r.push(q);
                l.push(r);
                m > a && (a = m, b = k[p]);
                m < e && (e = m, c = k[p]);
                m > g && (g = m);
                m < h && (h = m)
            }
            this._sortRows(l);
            return {
                rows: l,
                indexes: k,
                minDif: f,
                maxDif: d,
                minPct: h,
                maxPct: g,
                highCol: b,
                lowCol: c,
                lowValue: e,
                highValue: a
            }
        },
        updateUIExpanded: function() {
            this.inherited(arguments);
            for (var b = this._calculate(), c = Math.max(Math.abs(b.minDif), Math.abs(b.maxDif)), a, e = this.table.rows.length; e < b.indexes.length + 1; e++) {
                a = this.table.insertRow(-1);
                0 < e && 0 == e % 2 && (a.className = "AlternatingRow");
                h.set(a.insertCell(-1), "class", "RelatedVariables_TextColumn");
                h.set(a.insertCell(-1), "class", "RelatedVariables_ValueColumn");
                a.insertCell(-1);
                var d;
                d = a.insertCell(-1);
                h.set(d, "class", "RelatedVariables_ChartNegative");
                h.set(d, "style", "padding: 0;");
                d = a.insertCell(-1);
                h.set(d, "class", "RelatedVariables_ChartPositive");
                h.set(d, "style", "padding: 0;")
            }
            for (; this.table.rows.length > b.indexes.length + 1;) this.table.deleteRow(-1);
            for (e = 0; e < b.rows.length; e++) {
                var f = this.getFieldByIndex(b.indexes[b.rows[e][0]]);
                a = this.table.rows[e + 1];
                a.cells[0].innerHTML = b.rows[e][1];
                a.cells[1].innerHTML = k(f, b.rows[e][2]);
                d = b.rows[e][3];
                w.isNumber(d) ? (f = 0 < d ? "+" + k(f, d) : 0 > d ? "-" + k(f, -d) : "0", a.cells[2].innerHTML = f, a.cells[2].className = "RelatedVariables_DifferenceColumn", 0 < d ?
                    (l.add(a.cells[2], "RelatedVariables_DifferenceColumn_Positive"), d = n.pct(d / c), a.cells[3].innerHTML = "", a.cells[4].innerHTML = "\x3cdiv class\x3d'RelatedVariables_PositiveBar' style\x3d'width:" + d + "' /\x3e") : (0 > d ? (l.add(a.cells[2], "RelatedVariables_DifferenceColumn_Negative"), d = n.pct(-d / c), a.cells[3].innerHTML = "\x3cdiv class\x3d'RelatedVariables_NegativeBar' style\x3d'width:" + d + "' /\x3e") : a.cells[3].innerHTML = "", a.cells[4].innerHTML = "")) : (a.cells[2].innerHTML = "", a.cells[3].innerHTML = "", a.cells[4].innerHTML =
                    "")
            }
            f = this.getFieldByIndex(b.highCol);
            this.highLabel.innerHTML = t.substitute(g.highLabel2, {
                alias: f.alias
            }) + " (" + k(f, b.highValue) + ")";
            f = this.getFieldByIndex(b.lowCol);
            this.lowLabel.innerHTML = t.substitute(g.lowLabel2, {
                alias: f.alias
            }) + " (" + k(f, b.lowValue) + ")"
        },
        updateUICollapsed: function() {
            this.inherited(arguments);
            for (var b = this._calculate(), c, a = this.table.rows.length; a < b.indexes.length + 1; a++) c = this.table.insertRow(-1), 0 < a && 0 == a % 2 && (c.className = "AlternatingRow"), h.set(c.insertCell(-1), "class", "RelatedVariables_TextColumn"),
                h.set(c.insertCell(-1), "class", "RelatedVariables_ValueColumn");
            for (; this.table.rows.length > b.indexes.length + 1;) this.table.deleteRow(-1);
            for (a = 0; a < b.rows.length; a++) {
                var e = this.getFieldByIndex(b.indexes[b.rows[a][0]]);
                c = this.table.rows[a + 1];
                c.cells[0].innerHTML = b.rows[a][1];
                c.cells[1].innerHTML = k(e, b.rows[a][2]);
                l.remove(c.cells[1], "MaxPct");
                l.remove(c.cells[1], "MinPct");
                b.rows[a][2] == b.maxPct && l.add(c.cells[1], "MaxPct");
                b.rows[a][2] == b.minPct && l.add(c.cells[1], "MinPct")
            }
        },
        createUIExpanded: function(b) {
            this.inherited(arguments);
            var c = b.addHeader("div", {
                "class": "RelatedVariables_Labels"
            });
            this.highLabel = s.create("div", {
                "class": "RelatedVariables_HighLabel"
            }, c);
            this.lowLabel = s.create("div", {
                "class": "RelatedVariables_LowLabel"
            }, c);
            this.table = b.addContent("table", {
                "class": "RelatedVariables_Table",
                cellpadding: "2",
                cellspacing: "0"
            });
            n.createCols(this.table, [0.35, 0.15, 0.15, 0.175, 0.175]);
            c = this.table.insertRow(0);
            this._appendSortHeader(c, g.indicatorCol, 0, {
                "class": "RelatedVariables_ColumnHeader"
            });
            this._appendSortHeader(c, g.valueCol,
                2, {
                    "class": "RelatedVariables_ColumnHeader"
                });
            this._appendSortHeader(c, g.difCol, 3, {
                "class": "RelatedVariables_ColumnHeader",
                colspan: "3"
            });
            c = b.addFooter("div", {
                "class": "RelatedVariables_ComparisonDiv"
            });
            s.create("div", {
                "class": "RelatedVariables_ComparisonLabel",
                innerHTML: g.chartLabel
            }, c);
            this._createComboBox(c)
        },
        createUICollapsed: function(b) {
            this.inherited(arguments);
            this.table = b.addContent("table", {
                "class": "RelatedVariables_Table",
                cellpadding: "2",
                cellspacing: "0"
            });
            n.createCols(this.table, [0.7, 0.3]);
            var c = this.table.insertRow(0);
            this._appendSortHeader(c, g.indicatorCol, 0, {
                "class": "RelatedVariables_ColumnHeader"
            });
            this._appendSortHeader(c, g.valueCol, 2, {
                "class": "RelatedVariables_ColumnHeader"
            })
        }
    })
});