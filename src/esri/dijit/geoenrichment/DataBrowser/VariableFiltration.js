//>>built
define(["../../../declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/i18n!../../../nls/jsapi", "dojo/store/Memory", "dijit/form/TextBox", "../CheckList", "dojox/form/RangeSlider", "dijit/layout/ContentPane", "dijit/form/Select"], function(g, h, k, e, s, l, m, n, t) {
    k = g(null, {
        index: 1,
        flag: 1,
        collections: [],
        id: "",
        name: "",
        containsFilter: function(b) {
            var d = !1;
            if (b.metadata.filters && 0 < b.metadata.filters.length)
                for (i = 0; i < b.metadata.filters.length; i++)
                    if (b.metadata.filters[i].id == this.id) {
                        d = !0;
                        break
                    }
            return d
        },
        containsFilterTag: function(b) {
            if (b.filteringTags &&
                0 < b.filteringTags.length)
                for (var d = 0; d < b.filteringTags.length && b.filteringTags[d].id != this.id; d++);
            return b.filteringTags[d]
        },
        setFlag: function(b, d) {
            b.hidden = d ? b.hidden & ~Math.pow(2, this.index) : b.hidden | Math.pow(2, this.index)
        },
        apply: function() {}
    });
    var p = g([k], {
            name: "By Keyword",
            keyValue: "",
            fieldToFilter: ["description", "alias"],
            _textBox: null,
            render: function() {
                var b = e.create("div", {
                    "class": "DataVariablePageFilter"
                });
                e.create("div", {
                    "class": "dijitInline VarLabel FilterName",
                    innerHTML: this.name
                }, b);
                this._textBox =
                    (new m({
                    style: "width:200px",
                    trim: !0,
                    onKeyUp: h.hitch(this, this._checkKeyword)
                })).placeAt(b);
                return b
            },
            _checkKeyword: function() {
                var b = h.trim(this._textBox.displayedValue).toLowerCase();
                if (b != this.keyValue) {
                    for (var d = Math.pow(2, this.index), a = -1 != b.indexOf(this.keyValue), c = -1 != this.keyValue.indexOf(b), f = 0; f < this.collections.length; f++)
                        for (var e = 0; e < this.collections[f].variables.length && !(a && this.collections[f].variables[e].hidden & 0 == d) && !(c && this.collections[f].variables[e].hidden & d == d); e++) {
                            this.collections[f].variables[e].hidden |=
                                d;
                            for (var g = 0; g < this.fieldToFilter.length; g++)
                                if (this.collections[f].variables[e][this.fieldToFilter[g]] && -1 != this.collections[f].variables[e][this.fieldToFilter[g]].toLowerCase().indexOf(b)) {
                                    this.collections[f].variables[e].hidden &= ~d;
                                    break
                                }
                        }
                    this.keyValue = b;
                    this.apply()
                }
            }
        }),
        q = g([k], {
            enumValues: [],
            _checkList: null,
            render: function() {
                var b = e.create("div", {
                    "class": "DataVariablePageFilter"
                });
                e.create("div", {
                    "class": "dijitInline VarLabel FilterName",
                    innerHTML: this.name
                }, b);
                this._checkList = new n({
                        electionMode: "toggle"
                    },
                    b);
                this._checkList.renderRow = function(b, a) {
                    var c = e.create("div");
                    e.create("div", {
                        "class": "dijit dijitInline dijitCheckBox dijitCheckBoxChecked"
                    }, c);
                    e.create("div", {
                        "class": "dijitInline TrimWithEllipses VarLabel",
                        innerHTML: b.name
                    }, c);
                    return c
                };
                this._checkList.set("store", new l({
                    data: this.enumValues
                }));
                this._checkList.selectAll();
                this._checkList.onSelect = h.hitch(this, this._onSelectVariable);
                this._checkList.onDeselect = h.hitch(this, this._onDeselectVariable);
                b.style.heght = "" + 15 * (this.enumValues + 1) + "px";
                return b
            },
            addEnumValue: function(b) {
                for (var d = !1, a = 0; a < this.enumValues.length; a++)
                    if (this.enumValues[a].id === b) {
                        d = !0;
                        break
                    }
                d || this.enumValues.push({
                    name: b,
                    id: b
                })
            },
            _onDeselectVariable: function(b) {
                h.hitch(this, this._checkVariables(b.rows[0], !1))
            },
            _onSelectVariable: function(b) {
                h.hitch(this, this._checkVariables(b.rows[0], !0))
            },
            _checkVariables: function(b, d) {
                this._checkList.get("selectedItems");
                for (var a = !1, c = 0; c < this.collections.length; c++)
                    if (this.containsFilter(this.collections[c]))
                        for (var e = 0; e < this.collections[c].variables.length; e++)(a =
                            this.containsFilterTag(this.collections[c].variables[e])) && a.value == b.data.name && this.setFlag(this.collections[c].variables[e], d);
                this.apply()
            }
        }),
        r = g([k], {
            rangeMin: null,
            rangeMax: null,
            minLabel: null,
            maxLabel: null,
            _checkList: null,
            render: function() {
                var b = e.create("div", {
                    "class": "DataVariablePageFilter"
                });
                e.create("div", {
                    "class": "dijitInline TrimWithEllipses VarLabel FilterName",
                    innerHTML: this.name
                }, b);
                var d = e.create("div", {
                    "class": "LabelDiv"
                }, b);
                this.minLabel = e.create("div", {
                        "class": "dijitInline TrimWithEllipses MinLabel"
                    },
                    d);
                this.maxLabel = e.create("div", {
                    "class": "dijitInline TrimWithEllipses MaxLabel"
                }, d);
                this.minLabel.innerHTML = this.rangeMin;
                this.maxLabel.innerHTML = this.rangeMax;
                d = e.create("div", {}, b);
                this._rangeSlider = new dojox.form.HorizontalRangeSlider({
                    name: "rangeSlider",
                    value: [this.rangeMin, this.rangeMax],
                    minimum: this.rangeMin,
                    maximum: this.rangeMax,
                    showButtons: !1,
                    intermediateChanges: !0,
                    onChange: h.hitch(this, this._onChangeValue)
                }, d);
                return b
            },
            _onChangeValue: function(b) {
                b = [Math.floor(b[0]), Math.ceil(b[1])];
                var d = !1;
                b[0] < parseFloat(this.rangeMin) && (b[0] = parseFloat(this.rangeMin), d = !0);
                b[1] > parseFloat(this.rangeMax) && (b[1] = parseFloat(this.rangeMax), d = !0);
                d && (this._rangeSlider.value = b);
                for (var a = !1, a = [], d = 0; d < this.collections.length; d++)
                    if (this.containsFilter(this.collections[d]))
                        for (var c = 0; c < this.collections[d].variables.length; c++)
                            if (a = this.containsFilterTag(this.collections[d].variables[c])) a = "\x3c" == a.value.substr(0, 1) ? [this.rangeMin, a.value.substring(1)] : "+" == a.value.substr(a.value.length - 2, 1) ? [a.value.substring(0,
                                a.value.length - 2), this.rangeMax] : a.value.split("-"), this.setFlag(this.collections[d].variables[c], parseFloat(a[0]) >= b[0] && parseFloat(a[1]) <= b[1]);
                this.minLabel.innerHTML = b[0];
                this.maxLabel.innerHTML = b[1];
                this.apply()
            }
        });
    return g(null, {
        collections: [],
        divLocaiton: null,
        filters: {},
        construct: function() {
            var b = 1,
                d = [],
                d = [null, null];
            this.divLocaiton.innerHTML = "";
            this.filters = {};
            var a = new p;
            a.id = "keyword";
            a.collections = this.collections;
            a.apply = this.apply;
            a.index = b;
            this.filters.keyword = a;
            for (a = 0; a < this.collections.length; a++)
                if (this.collections[a].metadata.filters &&
                    0 < this.collections[a].metadata.filters.length)
                    for (var c = 0; c < this.collections[a].metadata.filters.length; c++)
                        if ("Enumeration" == this.collections[a].metadata.filters[c].type)
                            if (d = this.collections[a].metadata.filters[c].enumValues.split(","), this.filters[this.collections[a].metadata.filters[c].id])
                                for (var e = 0; e < d.length; e++) this.filters[this.collections[a].metadata.filters[c].id].addEnumValue(d[e]);
                            else {
                                this.filters[this.collections[a].metadata.filters[c].id] = new q;
                                this.filters[this.collections[a].metadata.filters[c].id].id =
                                    this.collections[a].metadata.filters[c].id;
                                this.filters[this.collections[a].metadata.filters[c].id].collections = this.collections;
                                this.filters[this.collections[a].metadata.filters[c].id].name = this.collections[a].metadata.filters[c].name;
                                this.filters[this.collections[a].metadata.filters[c].id].enumValues = [];
                                for (e = 0; e < d.length; e++) this.filters[this.collections[a].metadata.filters[c].id].addEnumValue(d[e]);
                                this.filters[this.collections[a].metadata.filters[c].id].apply = this.apply;
                                this.filters[this.collections[a].metadata.filters[c].id].index =
                                ++b
                            } else "Range" == this.collections[a].metadata.filters[c].type && (d = [this.collections[a].metadata.filters[c].rangeMin, this.collections[a].metadata.filters[c].rangeMax], this.filters[this.collections[a].metadata.filters[c].id] ? (this.filters[this.collections[a].metadata.filters[c].id].rangeMin = Math.min(this.filters[this.collections[a].metadata.filters[c].id].rangeMin, d[0]), this.filters[this.collections[a].metadata.filters[c].id].rangeMax = Math.max(this.filters[this.collections[a].metadata.filters[c].id].rangeMax,
                d[1])) : (this.filters[this.collections[a].metadata.filters[c].id] = new r, this.filters[this.collections[a].metadata.filters[c].id].id = this.collections[a].metadata.filters[c].id, this.filters[this.collections[a].metadata.filters[c].id].collections = this.collections, this.filters[this.collections[a].metadata.filters[c].id].name = this.collections[a].metadata.filters[c].name, this.filters[this.collections[a].metadata.filters[c].id].rangeMin = d[0], this.filters[this.collections[a].metadata.filters[c].id].rangeMax =
                d[1], this.filters[this.collections[a].metadata.filters[c].id].apply = this.apply, this.filters[this.collections[a].metadata.filters[c].id].index = ++b));
            for (filter in this.filters) this.filters[filter].render && this.divLocaiton.appendChild(this.filters[filter].render())
        },
        apply: function() {}
    })
});