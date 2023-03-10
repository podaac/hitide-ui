//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/i18n", "dojo/has", "dojo/Deferred", "dojo/sniff", "dojo/promise/all", "./lang", "./kernel", "./request", "./tasks/query", "./tasks/QueryTask", "./tasks/StatisticDefinition", "dojo/i18n!dojo/cldr/nls/number"], function(F, m, l, z, K, L, C, G, t, g, M, H, D, I, J, E) {
    return F(null, {
        declaredClass: "esri.PopupInfo",
        initialize: function(a, b) {
            if (a) {
                m.mixin(this, b);
                this.info = a;
                this.title = this.getTitle;
                this.content = this.getContent;
                var d = this._fieldLabels = {},
                    c = this._fieldsMap = {};
                a.fieldInfos && l.forEach(a.fieldInfos, function(a) {
                    d[a.fieldName] = a.label;
                    c[a.fieldName] = a
                });
                this._relatedFieldPrefix = "relationships/";
                this.titleHasRelatedFields = !!(a.title && -1 !== a.title.indexOf("{" + this._relatedFieldPrefix))
            }
        },
        toJson: function() {
            return z.fromJson(z.toJson(this.info))
        },
        getTitle: function() {},
        getContent: function() {},
        getComponents: function(a) {
            var b = this.info,
                d = new C,
                c, e;
            b.fieldInfos && (e = l.filter(b.fieldInfos, function(a) {
                return -1 !== a.fieldName.indexOf(this._relatedFieldPrefix)
            }, this));
            e && 0 < e.length && (c = this._getRelatedRecords({
                graphic: a,
                fieldsInfo: e
            }));
            c ? c.then(m.hitch(this, function() {
                d.resolve(this._getPopupValues(a))
            }), m.hitch(this, this._handlerErrorResponse, c)) : d.resolve(this._getPopupValues(a));
            return d.promise
        },
        _getPopupValues: function(a, b) {
            var d = this.info,
                c = a.getLayer(),
                e = m.clone(a.attributes) || {},
                f = m.clone(e),
                p = d.fieldInfos,
                h = "",
                k = "",
                w, n, q, u, r, A = c && c._getDateOpts && c._getDateOpts().properties,
                s = {
                    dateFormat: {
                        properties: A,
                        formatter: "DateFormat" + this._insertOffset(this._dateFormats.shortDateShortTime)
                    }
                };
            if (this._relatedInfo)
                for (u in this._relatedInfo)
                    if (this._relatedInfo.hasOwnProperty(u)) {
                        var v = this._relatedInfo[u],
                            t = this._relatedLayersInfo[u];
                        v && (l.forEach(v.relatedFeatures, function(a) {
                            for (r in a.attributes)
                                if (a.attributes.hasOwnProperty(r) && "esriRelCardinalityOneToOne" === t.relation.cardinality) {
                                    var b = this._toRelatedFieldName([t.relation.id, r]);
                                    e[b] = f[b] = a.attributes[r]
                                }
                        }, this), l.forEach(v.relatedStatsFeatures, function(a) {
                            for (r in a.attributes)
                                if (a.attributes.hasOwnProperty(r)) {
                                    var b = this._toRelatedFieldName([t.relation.id,
                                        r
                                    ]);
                                    e[b] = f[b] = a.attributes[r]
                                }
                        }, this))
                    }
            p && l.forEach(p, function(a) {
                n = a.fieldName;
                f[n] = this._formatValue(f[n], n, s);
                A && (a.format && a.format.dateFormat) && (a = l.indexOf(A, n), -1 < a && A.splice(a, 1))
            }, this);
            if (c) {
                u = c.types;
                var z = (v = c.typeIdField) && e[v];
                for (n in e)
                    if (e.hasOwnProperty(n) && -1 === n.indexOf(this._relatedFieldPrefix) && (q = e[n], g.isDefined(q))) {
                        var x = this._getDomainName(c, u, z, n, q);
                        g.isDefined(x) ? f[n] = x : n === v && (x = this._getTypeName(c, q), g.isDefined(x) && (f[n] = x))
                    }
            }
            d.title && (h = this._processFieldsInLinks(this._fixTokens(d.title),
                e), h = m.trim(g.substitute(f, h, s) || ""));
            if (b) return {
                title: h
            };
            d.description && (k = this._processFieldsInLinks(this._fixTokens(d.description), e), k = m.trim(g.substitute(f, k, s) || ""));
            p && (w = [], l.forEach(p, function(a) {
                (n = a.fieldName) && a.visible && w.push([a.label || n, g.substitute(f, "${" + n + "}", s) || ""])
            }));
            var y, B;
            d.mediaInfos && (y = [], l.forEach(d.mediaInfos, function(a) {
                B = 0;
                q = a.value;
                switch (a.type) {
                    case "image":
                        var b = q.sourceURL,
                            b = b && m.trim(g.substitute(e, this._fixTokens(b)));
                        B = !!b;
                        break;
                    case "piechart":
                    case "linechart":
                    case "columnchart":
                    case "barchart":
                        B =
                            l.some(q.fields, function(a) {
                                return g.isDefined(e[a]) || -1 !== a.indexOf(this._relatedFieldPrefix) && this._relatedInfo
                            }, this);
                        break;
                    default:
                        return
                }
                if (B) {
                    a = m.clone(a);
                    q = a.value;
                    var b = a.title ? this._processFieldsInLinks(this._fixTokens(a.title), e) : "",
                        d = a.caption ? this._processFieldsInLinks(this._fixTokens(a.caption), e) : "";
                    a.title = b ? m.trim(g.substitute(f, b, s) || "") : "";
                    a.caption = d ? m.trim(g.substitute(f, d, s) || "") : "";
                    if ("image" === a.type) q.sourceURL = g.substitute(e, this._fixTokens(q.sourceURL)), q.linkURL && (q.linkURL =
                        m.trim(g.substitute(e, this._fixTokens(q.linkURL)) || ""));
                    else {
                        var c, h;
                        l.forEach(q.fields, function(a, b) {
                            if (-1 !== a.indexOf(this._relatedFieldPrefix)) h = this._getRelatedChartInfos(a, q, e, s), h instanceof Array ? q.fields = h : q.fields[b] = h;
                            else {
                                var d = e[a],
                                    d = void 0 === d ? null : d;
                                c = e[q.normalizeField] || 0;
                                d && c && (d /= c);
                                q.fields[b] = {
                                    y: d,
                                    tooltip: (this._fieldLabels[a] || a) + ":\x3cbr/\x3e" + this._formatValue(d, a, s, !!c)
                                }
                            }
                        }, this)
                    }
                    y.push(a)
                }
            }, this));
            return {
                title: h,
                description: k,
                fields: w && w.length ? w : null,
                mediaInfos: y && y.length ?
                    y : null,
                formatted: f,
                editSummary: c && c.getEditSummary ? c.getEditSummary(a) : ""
            }
        },
        _getRelatedChartInfos: function(a, b, d, c) {
            var e, f, p, h, k, g;
            e = [];
            g = this._fromRelatedFieldName(a);
            k = g[0];
            f = this._relatedInfo[k];
            k = this._relatedLayersInfo[k];
            f && l.forEach(f.relatedFeatures, function(f) {
                f = f.attributes;
                var k, l;
                for (l in f)
                    if (f.hasOwnProperty(l) && l === g[1]) {
                        k = {};
                        h = f[l];
                        b.normalizeField && (p = -1 !== b.normalizeField.indexOf(this._relatedFieldPrefix) ? f[this._fromRelatedFieldName(b.normalizeField)[1]] : d[b.normalizeField]);
                        h &&
                            p && (h /= p);
                        if (b.tooltipField)
                            if (-1 !== b.tooltipField.indexOf(this._relatedFieldPrefix)) {
                                var m = this._fromRelatedFieldName(b.tooltipField)[1];
                                k.tooltip = f[m] + ":\x3cbr/\x3e" + this._formatValue(h, f[m], c, !!p)
                            } else k.tooltip = (this._fieldLabels[a] || a) + ":\x3cbr/\x3e" + this._formatValue(h, b.tooltipField, c, !!p);
                        else k.tooltip = h;
                        k.y = h;
                        e.push(k)
                    }
            }, this);
            return "esriRelCardinalityOneToMany" === k.relation.cardinality || "esriRelCardinalityManyToMany" === k.relation.cardinality ? e : e[0]
        },
        getAttachments: function(a) {
            var b = a.getLayer();
            a = a.attributes;
            if (this.info.showAttachments && (b && b.hasAttachments && b.objectIdField) && (a = a && a[b.objectIdField])) return b.queryAttachmentInfos(a)
        },
        _dateFormats: {
            shortDate: "(datePattern: 'M/d/y', selector: 'date')",
            shortDateLE: "(datePattern: 'd/M/y', selector: 'date')",
            longMonthDayYear: "(datePattern: 'MMMM d, y', selector: 'date')",
            dayShortMonthYear: "(datePattern: 'd MMM y', selector: 'date')",
            longDate: "(datePattern: 'EEEE, MMMM d, y', selector: 'date')",
            shortDateShortTime: "(datePattern: 'M/d/y', timePattern: 'h:mm a', selector: 'date and time')",
            shortDateLEShortTime: "(datePattern: 'd/M/y', timePattern: 'h:mm a', selector: 'date and time')",
            shortDateShortTime24: "(datePattern: 'M/d/y', timePattern: 'H:mm', selector: 'date and time')",
            shortDateLEShortTime24: "(datePattern: 'd/M/y', timePattern: 'H:mm', selector: 'date and time')",
            shortDateLongTime: "(datePattern: 'M/d/y', timePattern: 'h:mm:ss a', selector: 'date and time')",
            shortDateLELongTime: "(datePattern: 'd/M/y', timePattern: 'h:mm:ss a', selector: 'date and time')",
            shortDateLongTime24: "(datePattern: 'M/d/y', timePattern: 'H:mm:ss', selector: 'date and time')",
            shortDateLELongTime24: "(datePattern: 'd/M/y', timePattern: 'H:mm:ss', selector: 'date and time')",
            longMonthYear: "(datePattern: 'MMMM y', selector: 'date')",
            shortMonthYear: "(datePattern: 'MMM y', selector: 'date')",
            year: "(datePattern: 'y', selector: 'date')"
        },
        _reHref: /href\s*=\s*\"[^\"]+\"/ig,
        _fixTokens: function(a) {
            return a.replace(/(\{[^\{\r\n]+\})/g, "$$$1")
        },
        _processFieldsInLinks: function(a, b) {
            return a && a.replace(this._reHref, function(a) {
                return a = g.substitute(b, a)
            })
        },
        _formatValue: function(a, b, d,
            c) {
            var e = this._fieldsMap[b],
                f = e && e.format;
            b = "number" === typeof a && -1 === l.indexOf(d.dateFormat.properties, b) && (!f || !f.dateFormat);
            if (!g.isDefined(a) || !e || !g.isDefined(f)) return b ? this._forceLTR(a) : a;
            var p = "",
                h = [],
                e = f.hasOwnProperty("places") || f.hasOwnProperty("digitSeparator"),
                k = f.hasOwnProperty("digitSeparator") ? f.digitSeparator : !0;
            if (e) p = "NumberFormat", h.push("places: " + (g.isDefined(f.places) && (!c || 0 < f.places) ? Number(f.places) : "Infinity")), h.length && (p += "(" + h.join(",") + ")");
            else if (f.dateFormat) p =
                "DateFormat" + this._insertOffset(this._dateFormats[f.dateFormat] || this._dateFormats.shortDateShortTime);
            else return b ? this._forceLTR(a) : a;
            a = g.substitute({
                myKey: a
            }, "${myKey:" + p + "}", d) || "";
            e && !k && E.group && (a = a.replace(RegExp("\\" + E.group, "g"), ""));
            return b ? this._forceLTR(a) : a
        },
        _forceLTR: function(a) {
            var b = G("ie");
            return b && 10 >= b ? a : "\x3cspan class\x3d'esriNumericValue'\x3e" + a + "\x3c/span\x3e"
        },
        _insertOffset: function(a) {
            a && (a = g.isDefined(this.utcOffset) ? a.replace(/\)\s*$/, ", utcOffset:" + this.utcOffset + ")") :
                a);
            return a
        },
        _getDomainName: function(a, b, d, c, e) {
            var f, p;
            b && g.isDefined(d) && l.some(b, function(b) {
                if (b.id == d) {
                    if ((f = b.domains && b.domains[c]) && "inherited" === f.type) f = this._getLayerDomain(a, c), p = !0;
                    return !0
                }
                return !1
            }, this);
            !p && !f && (f = this._getLayerDomain(a, c));
            if (f && f.codedValues) {
                var h;
                l.some(f.codedValues, function(a) {
                    return a.code == e ? (h = a.name, !0) : !1
                });
                return h
            }
        },
        _getLayerDomain: function(a, b) {
            var d = a.fields;
            if (d) {
                var c;
                l.some(d, function(a) {
                    return a.name === b ? (c = a.domain, !0) : !1
                });
                return c
            }
        },
        _getTypeName: function(a,
            b) {
            var d = a.types;
            if (d) {
                var c;
                l.some(d, function(a) {
                    return a.id == b ? (c = a.name, !0) : !1
                });
                return c
            }
        },
        _getRelatedRecords: function(a) {
            var b = a.graphic,
                d = new C,
                c;
            this._relatedLayersInfo ? this._queryRelatedLayers(b).then(m.hitch(this, function(a) {
                this._setRelatedRecords(b, a);
                d.resolve(a)
            }), m.hitch(this, this._handlerErrorResponse, d)) : this._getRelatedLayersInfo(a).then(m.hitch(this, function(a) {
                for (c in a) a.hasOwnProperty(c) && a[c] && (this._relatedLayersInfo[c].relatedLayerInfo = a[c]);
                this._queryRelatedLayers(b).then(m.hitch(this,
                    function(a) {
                        this._setRelatedRecords(b, a);
                        d.resolve(a)
                    }), m.hitch(this, this._handlerErrorResponse, d))
            }), m.hitch(this, this._handlerErrorResponse, d));
            return d.promise
        },
        _getRelatedLayersInfo: function(a) {
            var b = a.fieldsInfo,
                d, c, e = {};
            d = a.graphic.getLayer();
            this._relatedLayersInfo || (this._relatedLayersInfo = {});
            l.forEach(b, function(a) {
                var b, c, e, g;
                b = this._fromRelatedFieldName(a.fieldName);
                c = b[0];
                b = b[1];
                c && (this._relatedLayersInfo[c] || (l.some(d.relationships, function(a) {
                    if (a.id == c) return g = a, !0
                }), g && (this._relatedLayersInfo[c] = {
                    relation: g,
                    relatedFields: [],
                    outStatistics: []
                })), this._relatedLayersInfo[c] && (this._relatedLayersInfo[c].relatedFields.push(b), a.statisticType && (e = new J, e.statisticType = a.statisticType, e.onStatisticField = b, e.outStatisticFieldName = b, this._relatedLayersInfo[c].outStatistics.push(e))))
            }, this);
            for (c in this._relatedLayersInfo) this._relatedLayersInfo.hasOwnProperty(c) && this._relatedLayersInfo[c] && (a = this._relatedLayersInfo[c].relation, a = d.url.replace(/[0-9]+$/, a.relatedTableId), this._relatedLayersInfo[c].relatedLayerUrl =
                a, e[c] = H({
                    url: a,
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback"
                }));
            return t(e)
        },
        _queryRelatedLayers: function(a) {
            var b = {},
                d;
            for (d in this._relatedLayersInfo) this._relatedLayersInfo.hasOwnProperty(d) && (b[d] = this._queryRelatedLayer({
                graphic: a,
                relatedInfo: this._relatedLayersInfo[d]
            }));
            return t(b)
        },
        _queryRelatedLayer: function(a) {
            var b, d, c, e, f, g, h, k, m, n;
            b = a.graphic;
            d = b.getLayer().url.match(/[0-9]+$/g)[0];
            k = a.relatedInfo;
            h = k.relatedLayerInfo;
            m = k.relatedLayerUrl;
            n = k.relation;
            l.some(h.relationships, function(a) {
                if (a.relatedTableId ===
                    parseInt(d, 10)) return c = a, !0
            }, this);
            c && (a = new D, l.some(h.fields, function(a) {
                if (a.name === c.keyField) return f = -1 !== l.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], a.type) ? "number" : "string", !0
            }), e = "string" === f ? c.keyField + "\x3d'" + b.attributes[n.keyField] + "'" : c.keyField + "\x3d" + b.attributes[n.keyField], a.where = e, a.outFields = k.relatedFields, k.outStatistics && (0 < k.outStatistics.length && h.supportsStatistics) && (g = new D, g.where = a.where, g.outFields = a.outFields,
                g.outStatistics = k.outStatistics), b = new I(m), e = [], e.push(b.execute(a)), g && e.push(b.execute(g)));
            return t(e)
        },
        _setRelatedRecords: function(a, b) {
            this._relatedInfo = [];
            for (var d in b)
                if (b.hasOwnProperty(d) && b[d]) {
                    var c = b[d];
                    this._relatedInfo[d] = {};
                    this._relatedInfo[d].relatedFeatures = c[0].features;
                    g.isDefined(c[1]) && (this._relatedInfo[d].relatedStatsFeatures = c[1].features)
                }
        },
        _handlerErrorResponse: function(a, b) {
            a.reject(b);
            console.log(b)
        },
        _fromRelatedFieldName: function(a) {
            var b = []; - 1 !== a.indexOf(this._relatedFieldPrefix) &&
                (a = a.split("/"), b = a.slice(1));
            return b
        },
        _toRelatedFieldName: function(a) {
            var b = "";
            a && 0 < a.length && (b = this._relatedFieldPrefix + a[0] + "/" + a[1]);
            return b
        }
    })
});