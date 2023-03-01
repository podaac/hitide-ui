//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/html", "dojo/_base/array", "dojo/_base/json", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/sniff", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dijit/_Widget", "dijit/_Templated", "dojo/data/ItemFileReadStore", "dojox/grid/DataGrid", "dojox/gfx", "../../layers/FeatureLayer", "../../symbols/PictureMarkerSymbol", "./TemplatePickerItem", "../../kernel", "../../lang", "../../request", "../_EventedWidget", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/TemplatePicker.html"], function(C,
    D, l, k, u, g, v, w, x, O, P, y, z, r, s, E, F, G, H, Q, I, A, J, R, t, K, L, M, N) {
    var B = D([L, E, F], {
        declaredClass: "esri.dijit.editing.TemplatePicker",
        widgetsInTemplate: !0,
        templateString: N,
        basePath: C.toUrl(".") + "/",
        featureLayers: null,
        items: null,
        grouping: !0,
        showTooltip: !1,
        maxLabelLength: 0,
        rows: 4,
        _rows: 0,
        columns: 3,
        surfaceWidth: 30,
        surfaceHeight: 30,
        emptyMessage: "",
        useLegend: !0,
        legendCache: {},
        _uniqueId: {
            id: 0
        },
        _assumedCellWidth: 90,
        _initialAutoWidth: 300,
        _initialAutoHeight: 200,
        _ieTimer: 150,
        constructor: function(a, b) {
            a = a || {};
            !a.items &&
                !a.featureLayers && console.error("TemplatePicker: please provide 'featureLayers' or 'items' parameter in the constructor");
            this._dojo14x = 4 <= w.version.minor;
            this._itemWidgets = {};
            a.featureLayers && a.featureLayers.length && (this._flChanged = 1);
            this._nls = M.widgets.templatePicker;
            this.emptyMessage = a.emptyMessage || this._nls && this._nls.creationDisabled || ""
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this._preprocess()
        },
        startup: function() {
            this.inherited(arguments);
            if ("auto" === this.rows && "auto" ===
                this.columns) {
                var a = r.getContentBox(this.domNode);
                a.w || (this.domNode.style.width = this._initialAutoWidth + "px");
                a.h || (this.domNode.style.height = this._initialAutoHeight + "px");
                a = r.getContentBox(this.domNode);
                this._columns = Math.floor(a.w / this._assumedCellWidth) || 1
            }
            this._applyGridPatches();
            this._setGridLayout();
            k.connect(this.grid, "onRowClick", this, this._rowClicked);
            this._setGridData();
            this._toggleTooltip();
            9 > x("ie") && (this._repaintItems = l.hitch(this, this._repaintItems), setTimeout(this._repaintItems, this._ieTimer))
        },
        destroy: function() {
            this.showTooltip = !1;
            this._toggleTooltip();
            this._clearLegendInfo();
            this.featureLayers = this.items = this.grid = this._flItems = this._itItems = this._groupRowIndices = this._selectedCell = this._selectedInfo = this._selectedItem = null;
            this.inherited(arguments)
        },
        getSelected: function() {
            return this._selectedCell ? this._selectedItem : null
        },
        clearSelection: function() {
            var a = this._selectedCell,
                b = this._selectedInfo;
            a && this._rowClicked({
                cellNode: a,
                rowIndex: b.selRow,
                cellIndex: b.selCol
            })
        },
        update: function(a) {
            a =
                "auto" === this.rows && "auto" === this.columns && a ? !0 : !1;
            var b = this.grid,
                d;
            if (a) {
                d = this.domNode;
                var c;
                c = w.query("#" + d.id + ".templatePicker div.item")[0];
                d = r.getContentBox(d);
                c = (c = c && c.parentNode) ? u.coords(c).w : this._assumedCellWidth;
                this._columns = (this._columns = Math.floor((d.w - b.views.views[0].getScrollbarWidth()) / c)) || 1
            }
            c = this._rows;
            this._preprocess();
            var e = this._rows;
            this._setGridLayout();
            this._setGridData();
            e !== c && b.set("autoHeight", this._rows, !1);
            a ? (b._resize({
                    w: d.w,
                    h: d.h
                }), b.viewsHeaderNode.style.display =
                "none") : b.update();
            this._toggleTooltip();
            var h = this,
                f = this.getSelected();
            f && b.store.fetch({
                onComplete: function(a) {
                    var d = (a = h._locate(f, h._selectedInfo, a)) && b.views.views[0].getCellNode(a[0], a[1]);
                    d && h._rowClicked({
                        cellNode: d,
                        rowIndex: a[0],
                        cellIndex: a[1]
                    }, !0)
                }
            });
            9 > x("ie") && setTimeout(this._repaintItems, this._ieTimer);
            a = this.featureLayers;
            d = this.items;
            (!a || !a.length) && ((!d || !d.length) && b && this.emptyMessage) && b.showMessage(this.emptyMessage)
        },
        _eventMap: {
            "selection-change": !0
        },
        onSelectionChange: function() {},
        _setUseLegendAttr: function(a) {
            var b = this.useLegend;
            if (!this._started || b !== a) a ? this._flChanged = 1 : this._clearLegendInfo();
            this.useLegend = a
        },
        _setFeatureLayersAttr: function(a) {
            var b = this.featureLayers;
            if (!this._started || b !== a) this._flChanged = 1;
            this.featureLayers = a
        },
        _adjustRowsCols: function(a) {
            if ("auto" === this.rows && "auto" === this.columns) this._started || (this._rows = !1, this._columns = null, this._autoWidth = !1);
            else {
                var b = 0;
                this._rows = this.rows;
                this._columns = this.columns;
                "auto" === this.rows ? (this.featureLayers ?
                    this.grouping ? (b = a.length, g.forEach(a, function(a) {
                        b += Math.ceil(a.length / this.columns)
                    }, this)) : (g.forEach(a, function(a) {
                        b += a.length
                    }, this), b = Math.ceil(b / this.columns)) : b = Math.ceil(a.length / this.columns), this._rows = b) : "auto" === this.columns && (this.featureLayers ? this.grouping ? b = 3 : (g.forEach(a, function(a) {
                    b += a.length
                }, this), b = Math.ceil(b / this.rows)) : b = Math.ceil(a.length / this.rows), this._columns = b)
            }
        },
        _preprocess: function() {
            this.items && (this.grouping = !1);
            this._autoWidth = !1;
            if ("auto" === this.rows || "auto" ===
                this.columns) this._autoWidth = !0;
            var a;
            if (this.featureLayers)
                if (this.useLegend && this._flChanged && (this._legendIndices = [], this._loadingIndices = [], this._legendSymbols = {}, this._ignoreLegends(), this._loadingLegends = [], clearTimeout(this._legendTimer), this._legendTimer = null, this._processSelectionLayers(), this._flChanged = 0), g.every(this.featureLayers, function(a) {
                    return a.loaded
                })) a = this._flItems = this._getItemsFromLayers(this.featureLayers), this._adjustRowsCols(a);
                else {
                    var b = this.featureLayers.length;
                    g.forEach(this.featureLayers,
                        function(a) {
                            if (a.loaded) b--;
                            else var c = k.connect(a, "onLoad", this, function() {
                                k.disconnect(c);
                                c = null;
                                b--;
                                b || this.update()
                            })
                        }, this)
                } else a = this._itItems = this._getItemsFromItems(this.items), this._adjustRowsCols(a)
        },
        _processSelectionLayers: function() {
            var a, b, d, c, e, h, f, n = {};
            g.forEach(this.featureLayers, function(e, f) {
                e.mode === I.MODE_SELECTION && (e._map && e.url && e._params.drawMode && !e.source) && (b = l.trim(e._url.path).replace(/\/(MapServer|FeatureServer).*/ig, "/MapServer").replace(/^https?:\/\//ig, "").toLowerCase(),
                    d = n[b] = n[b] || {}, c = d.featureLayers = d.featureLayers || {}, h = d.indices = d.indices || [], c[f] = e, h.push(f), a = e._map)
            });
            a && g.forEach(a.layerIds, function(c) {
                if ((c = a.getLayer(c)) && c.url && (c.getImageUrl || c.getTileUrl) && c.loaded && 10.1 <= c.version) b = l.trim(c._url.path).replace(/(\/MapServer).*/ig, "$1"), e = b.replace(/^https?:\/\//ig, "").toLowerCase(), n[e] && !n[e].mapServiceUrl && (d = n[e], d.mapServiceUrl = b, d.mapServiceLayer = c, this._legendIndices = this._legendIndices.concat(d.indices), f = this._fetchLegend({
                    pickerInstance: this,
                    info: d
                }, e), f.then ? (this._loadingIndices = this._loadingIndices.concat(d.indices), this._loadingLegends.push(f)) : this._processLegendResponse(f, d))
            }, this)
        },
        _fetchLegend: function(a, b) {
            var d = B.prototype,
                c = d.legendCache[b];
            c ? c.then && c._contexts.push(a) : (c = d.legendCache[b] = K({
                url: a.info.mapServiceUrl + "/legend",
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }), c._contexts = [a], c.addBoth(function(a) {
                if (!c.canceled) {
                    d.legendCache[b] = a;
                    var h = c._contexts;
                    c._contexts = null;
                    g.forEach(h, function(b) {
                        var d = b.pickerInstance;
                        b = b.info;
                        var h;
                        d._destroyed || (g.forEach(b.indices, function(a) {
                            h = g.indexOf(d._loadingIndices, a); - 1 < h && d._loadingIndices.splice(h, 1)
                        }), h = g.indexOf(d._loadingLegends, c), -1 < h && d._loadingLegends.splice(h, 1), d._processLegendResponse(a, b))
                    })
                }
            }));
            return c
        },
        _clearLegendInfo: function() {
            clearTimeout(this._legendTimer);
            this._ignoreLegends();
            this._legendIndices = this._loadingIndices = this._legendSymbols = this._loadingLegends = this._legendTimer = null
        },
        _ignoreLegends: function() {
            this._loadingLegends && g.forEach(this._loadingLegends,
                function(a) {
                    var b = -1;
                    g.some(a._contexts, function(a, c) {
                        a.pickerInstance === this && (b = c);
                        return -1 < b
                    }, this); - 1 < b && a._contexts.splice(b, 1)
                }, this)
        },
        _processLegendResponse: function(a, b) {
            if (a && !(a instanceof Error)) g.forEach(b.indices, function(c) {
                var d = b.featureLayers[c].layerId,
                    f, n = b.mapServiceUrl + "/" + d + "/images/",
                    p = b.mapServiceLayer._getToken(),
                    q, m, k, l;
                this._legendSymbols[c] || (q = null, g.some(a.layers, function(a) {
                    a.layerId == d && (q = a);
                    return !!q
                }), q && (m = this._legendSymbols[c] = {}, g.forEach(q.legend, function(a) {
                    if ((k =
                        a.values) && k.length)
                        for (f = 0; f < k.length; f++) m[k[f]] = a;
                    else m.defaultSymbol = a; if ((l = a.url) && !a._fixed) a._fixed = 1, -1 === l.search(/https?\:/) && (a.url = n + l), p && -1 !== a.url.search(/https?\:/) && (a.url += (-1 < a.url.indexOf("?") ? "\x26" : "?") + "token\x3d" + p)
                })))
            }, this);
            else {
                var d;
                g.forEach(b.indices, function(a) {
                    d = g.indexOf(this._legendIndices, a); - 1 < d && this._legendIndices.splice(d, 1)
                }, this)
            }
            var c = this;
            c._started && !c._legendTimer && (c._legendTimer = setTimeout(function() {
                clearTimeout(c._legendTimer);
                c._legendTimer = null;
                c._destroyed || c.update()
            }, 0))
        },
        _applyGridPatches: function() {
            var a = this.grid,
                b = a.adaptWidth,
                d, c, e;
            a.adaptWidth = function() {
                d = this.views.views;
                for (c = 0; e = d[c]; c++) s.set(e.headerNode, "display", "block");
                b.apply(this, arguments);
                for (c = 0; e = d[c]; c++) s.set(e.headerNode, "display", "none")
            };
            if (this._dojo14x) {
                if ("auto" !== this.rows && "auto" !== this.columns) var h = k.connect(a, "_onFetchComplete", this, function() {
                    k.disconnect(h);
                    this.grid.set("autoHeight", this._rows)
                });
                k.connect(a, "_onDelete", this, this._destroyItems);
                k.connect(a,
                    "_clearData", this, this._destroyItems);
                k.connect(a, "destroy", this, this._destroyItems);
                if ((a = a.focus) && a.findAndFocusGridCell) a.findAndFocusGridCell = function() {
                    return !1
                }
            }
        },
        _setGridLayout: function() {
            var a = function(a) {
                    return function(b, c) {
                        return this._cellGet(a, b, c)
                    }
                },
                b = l.hitch(this, this._cellFormatter),
                d = [],
                c = this._columns,
                e;
            for (e = 0; e < c; e++) d.push({
                field: "cell" + e,
                get: l.hitch(this, a(e)),
                formatter: b
            });
            a = {
                cells: [d]
            };
            this.grouping && (c = {
                field: "groupName",
                colSpan: c,
                get: l.hitch(this, this._cellGetGroup),
                formatter: l.hitch(this,
                    this._cellGroupFormatter)
            }, a.cells.push([c]));
            c = this.grid;
            b = H.prototype.rowsPerPage;
            c.set("rowsPerPage", this._rows > b ? this._rows : b);
            c.set("structure", a)
        },
        _setGridData: function() {
            var a = [];
            if (this.grouping) {
                this._groupRowIndices = [];
                var b, d, c = this._columns;
                g.forEach(this._flItems, function(e, f) {
                    a.push({});
                    var g = 0 === f ? 0 : b + d + 1;
                    this._groupRowIndices.push(g);
                    b = g;
                    d = Math.ceil(e.length / c);
                    a = a.concat(this._getStoreItems(e))
                }, this)
            } else this.featureLayers ? (g.forEach(this._flItems, function(b) {
                    a = a.concat(b)
                }), a =
                this._getStoreItems(a)) : a = this._getStoreItems(this._itItems);
            var e = new G({
                data: {
                    items: a
                }
            });
            this.grid.setStore(e)
        },
        _toggleTooltip: function() {
            if (this.showTooltip) {
                if (!this.tooltip) {
                    this.tooltip = z.create("div", {
                        "class": "tooltip"
                    }, this.domNode);
                    this.tooltip.style.display = "none";
                    this.tooltip.style.position = "fixed";
                    var a = this.grid;
                    this._mouseOverConnect = k.connect(a, "onCellMouseOver", this, this._cellMouseOver);
                    this._mouseOutConnect = k.connect(a, "onCellMouseOut", this, this._cellMouseOut)
                }
            } else this.tooltip &&
                (k.disconnect(this._mouseOverConnect), k.disconnect(this._mouseOutConnect), z.destroy(this.tooltip), this.tooltip = null)
        },
        _rowClicked: function(a, b) {
            var d = a.cellNode,
                c = a.rowIndex,
                e = a.cellIndex,
                h = this._getCellInfo(d, c, e);
            if (h) {
                var f = this.grid.store;
                if (!f.getValue(h, "loadingCell") && (this._selectedCell && y.remove(this._selectedCell, "selectedItem"), d !== this._selectedCell ? (y.add(d, "selectedItem"), this._selectedCell = d, this._selectedItem = {
                    featureLayer: f.getValue(h, "layer"),
                    type: f.getValue(h, "type"),
                    template: f.getValue(h,
                        "template"),
                    symbolInfo: f.getValue(h, "symbolInfo"),
                    item: this._getItem(h)
                }, this._selectedInfo = {
                    selRow: c,
                    selCol: e,
                    index1: f.getValue(h, "index1"),
                    index2: f.getValue(h, "index2"),
                    index: f.getValue(h, "index")
                }) : this._selectedCell = this._selectedInfo = this._selectedItem = null, !b)) this.onSelectionChange()
            }
        },
        _locate: function(a, b, d) {
            var c = this.grid.store,
                e = Array(this._columns),
                h, f = b.index1,
                n = b.index2,
                p = b.index,
                k = a.item;
            g.some(d, function(a, b) {
                return g.some(e, function(d, e) {
                    var g = c.getValue(a, "cell" + e);
                    return g && (k ?
                        p === c.getValue(g, "index") : f === c.getValue(g, "index1") && n === c.getValue(g, "index2")) ? (h = [b, e], !0) : !1
                })
            });
            return h
        },
        _getCellInfo: function(a, b, d) {
            if (a) return a = this.grid, b = a.getItem(b), a.store.getValue(b, "cell" + d)
        },
        _getItem: function(a) {
            var b = this.items;
            if (b) return b[this.grid.store.getValue(a, "index")]
        },
        _cellMouseOver: function(a) {
            var b = this.tooltip,
                d = a.cellNode,
                c = this._getCellInfo(d, a.rowIndex, a.cellIndex);
            if (b && c) {
                var e = this.grid.store;
                a = e.getValue(c, "template");
                var h = e.getValue(c, "type"),
                    g = e.getValue(c,
                        "symbolInfo"),
                    e = e.getValue(c, "layer");
                a = (c = this._getItem(c)) && c.label + (c.description ? ": " + c.description : "") || a && a.name + (a.description ? ": " + a.description : "") || h && h.name || g && g.label + (g.description ? ": " + g.description : "") || (e && e.name + ": ") + "Default";
                b.style.display = "none";
                b.innerHTML = a;
                d = u.coords(d.firstChild);
                s.set(b, {
                    left: d.x + "px",
                    top: d.y + d.h + 5 + "px"
                });
                b.style.display = ""
            }
        },
        _cellMouseOut: function() {
            var a = this.tooltip;
            a && (a.style.display = "none")
        },
        _destroyItems: function() {
            var a = this._itemWidgets,
                b;
            for (b in a) a[b] &&
                (a[b].destroy(), delete a[b])
        },
        _repaintItems: function() {
            var a = this._itemWidgets,
                b;
            for (b in a) {
                var d = a[b];
                d && d._repaint(d._surface)
            }
        },
        _getStoreItems: function(a) {
            var b = this._uniqueId;
            a = g.map(a, function(a) {
                return l.mixin({
                    surfaceId: "tpick-surface-" + b.id++
                }, a)
            });
            for (var d = a.length, c = 0, e = {}, h = 0, f, n = [], p = !0, k = this._columns; c < d;) p = !0, f = "cell" + h, e[f] = a[c], c++, h++, 0 === h % k && (p = !1, n.push(e), e = {}, h = 0);
            p && d && n.push(e);
            return n
        },
        _getItemsFromLayers: function(a) {
            var b = [];
            g.forEach(a, function(a, c) {
                b.push(this._getItemsFromLayer(a,
                    c))
            }, this);
            return b
        },
        _getItemsFromLayer: function(a, b) {
            var d = [];
            if (this.useLegend && -1 < g.indexOf(this._loadingIndices, b)) return [{
                label: this._nls && this._nls.loading || "",
                symbol: null,
                layer: a,
                type: null,
                template: null,
                index1: b,
                index2: 0,
                loadingCell: 1
            }];
            var c = [],
                c = c.concat(a.templates);
            g.forEach(a.types, function(a) {
                var b = a.templates;
                g.forEach(b, function(b) {
                    b._type_ = a
                });
                c = c.concat(b)
            });
            var c = g.filter(c, t.isDefined),
                e = a.renderer;
            if (e) {
                var h = e.declaredClass.replace("esri.renderer.", "");
                if (0 < c.length) g.forEach(c,
                    function(c) {
                        var f = c.prototype;
                        if (f) {
                            var k = e.getSymbol(f);
                            if (k) {
                                var m = null,
                                    l;
                                if (this.useLegend && -1 < g.indexOf(this._legendIndices, b)) {
                                    if (l = this._legendSymbols && this._legendSymbols[b]) switch (h) {
                                        case "SimpleRenderer":
                                            m = l.defaultSymbol;
                                            break;
                                        case "UniqueValueRenderer":
                                            g.some(e.infos, function(a) {
                                                a.symbol === k && (m = l[a.value]);
                                                return !!m
                                            });
                                            break;
                                        case "ClassBreaksRenderer":
                                            g.some(e.infos, function(a) {
                                                a.symbol === k && (m = l[a.maxValue]);
                                                return !!m
                                            })
                                    }
                                    if (m) {
                                        f = v.fromJson(v.toJson(A.defaultProps));
                                        f.url = m.url;
                                        f.imageData =
                                            m.imageData;
                                        f.contentType = m.contentType;
                                        f.width = m.width;
                                        f.height = m.height;
                                        if (!t.isDefined(f.width) || !t.isDefined(f.height)) f.width = 15, f.height = 15;
                                        m = new A(f)
                                    }
                                }
                                d.push({
                                    label: this._trimLabel(c.name),
                                    symbol: m || k,
                                    legendOverride: !!m,
                                    layer: a,
                                    type: c._type_,
                                    template: c,
                                    index1: b,
                                    index2: d.length
                                })
                            }
                        }
                        delete c._type_
                    }, this);
                else {
                    var f = [];
                    "TemporalRenderer" === h && (e = e.observationRenderer) && (h = e.declaredClass.replace("esri.renderer.", ""));
                    switch (h) {
                        case "SimpleRenderer":
                            f = [{
                                symbol: e.symbol,
                                label: e.label,
                                description: e.description
                            }];
                            break;
                        case "UniqueValueRenderer":
                        case "ClassBreaksRenderer":
                            f = e.infos
                    }
                    d = g.map(f, function(c, d) {
                        return {
                            label: this._trimLabel(c.label),
                            description: c.description,
                            symbolInfo: l.mixin({
                                constructor: function() {}
                            }, c),
                            symbol: c.symbol,
                            layer: a,
                            index1: b,
                            index2: d
                        }
                    }, this)
                }
            }
            return d
        },
        _getItemsFromItems: function(a) {
            return g.map(a, function(a, d) {
                a = l.mixin({
                    index: d
                }, a);
                a.label = this._trimLabel(a.label);
                return a
            }, this)
        },
        _trimLabel: function(a) {
            var b = this.maxLabelLength;
            b && a && a.length > b && (a = a.substr(0, b) + "...");
            return a ||
                ""
        },
        _cellGet: function(a, b, d) {
            return !d ? "" : this.grid.store.getValue(d, "cell" + a)
        },
        _cellFormatter: function(a) {
            if (a) {
                var b = this._itemWidgets,
                    d = this.grid.store,
                    c = d.getValue(a, "surfaceId"),
                    e = b[c];
                e || (e = b[c] = new J({
                    id: c,
                    label: d.getValue(a, "label"),
                    symbol: d.getValue(a, "symbol"),
                    legendOverride: d.getValue(a, "legendOverride"),
                    surfaceWidth: this.surfaceWidth,
                    surfaceHeight: this.surfaceHeight,
                    template: d.getValue(a, "template")
                }));
                return e || ""
            }
            return ""
        },
        _cellGetGroup: function(a, b) {
            if (!this._groupRowIndices) return "";
            var d = g.indexOf(this._groupRowIndices, a);
            return !b || -1 === d ? "" : (d = this.featureLayers[d]) && (this.groupLabelFunction ? this.groupLabelFunction(d) : d.name) || ""
        },
        _cellGroupFormatter: function(a) {
            return a ? "\x3cdiv class\x3d'groupLabel'\x3e" + a + "\x3c/div\x3e" : ""
        }
    });
    return B
});