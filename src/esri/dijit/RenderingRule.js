//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/RenderingRule.html", "dojo/store/Memory", "dojo/has", "../kernel", "../layers/RasterFunction", "../geometry/Extent", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/Tooltip", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRuleLabels", "dijit/form/FilteringSelect"], function(m, g, h, n, p, q, k, w, x, l, r, s, t, u, v) {
    return m([s, t, u], {
        declaredClass: "esri.dijit.RenderingRule",
        templateString: q,
        widgetsInTemplate: !0,
        layer: null,
        map: null,
        hideApplyButton: !1,
        _renderingRuleObject: null,
        _rasterFunctionData: [],
        _rasterFunctionStore: null,
        _cachedFunctionList: [],
        _cachedkeyProperties: {},
        _pendingDfds: {},
        _redBandIdStore: null,
        _greenBandIdStore: null,
        _blueBandIdStore: null,
        _donotSaveChanges: !1,
        _resetBandCombination: !1,
        _serviceBandCount: 3,
        _defaultBandCombinationFncName: "User Defined Renderer",
        _firstFncInRenderingRuleList: null,
        _gammaSliderTooltip: null,
        constructor: function(a) {
            m.safeMixin(this,
                a);
            this._i18n = p;
            this._defaultBandCombinationFncName = this._i18n.widgets.renderingRule.userDefinedRendererTitle;
            this._renderingRuleObject = new l
        },
        startup: function() {
            this.inherited(arguments);
            h.connect(this.rasterFunctionList, "onChange", g.hitch(this, "_onRasterFunctionChange"));
            h.connect(this.stretchMethodList, "onChange", g.hitch(this, "_onStretchMethodChange"));
            h.connect(this.gammaSlider, "onChange", g.hitch(this, "_onGammaChange"));
            h.connect(this.gammaSlider, "onMouseLeave", g.hitch(this, "_onGammaMouseLeave"));
            h.connect(this._apply, "onclick", g.hitch(this, "_onClickApplyRenderingRule"));
            h.subscribe("onRenderingRuleApply", g.hitch(this, "_onClickApplyRenderingRule"));
            h.subscribe("onRenderingRuleReset", g.hitch(this, "_onClickResetRenderingRule"));
            this.hideApplyButton && (this._apply.style.display = "none")
        },
        destroy: function() {
            this._pendingDfds = null;
            this._gammaSliderTooltip && (this._gammaSliderTooltip.destroy(), this._gammaSliderTooltip = null);
            this.inherited(arguments)
        },
        _setLayerAttr: function(a) {
            if (a) {
                this.inherited(arguments);
                this.layer = a;
                this._donotSaveChanges = !0;
                this._firstFncInRenderingRuleList = null;
                this._fillStretchMehodList();
                this._hideStretch();
                var b = g.hitch(this, "_setupDefaults");
                this.layer.loaded ? this._setupDefaults() : h.connect(this.layer, "onLoad", b);
                this._donotSaveChanges = !1
            }
        },
        _setupDefaults: function() {
            this._setupBandIdDefaults();
            this._setupStretchDefaults();
            this._setupRenderingRuleDefaults()
        },
        _setupRenderingRuleDefaults: function() {
            if (this.layer) {
                this._rasterFunctionData = [];
                var a;
                for (a = 0; a < this._cachedFunctionList.length; a++) {
                    var b =
                        this._cachedFunctionList[a];
                    if (b && this.layer === b.layer) {
                        this._rasterFunctionData = b.data;
                        this._setupFunctionStore();
                        return
                    }
                }
                this._fillRasterFunctionList(this.layer)
            }
        },
        _setupFunctionStore: function() {
            if (this.layer) {
                this._rasterFunctionStore = new k({
                    data: this._rasterFunctionData,
                    idProperty: "name"
                });
                this.rasterFunctionList.set("store", this._rasterFunctionStore);
                this.rasterFunctionList.set("labelAttr", "label");
                this.rasterFunctionList.set("labelType", "html");
                var a = "";
                if ((a = this.layer.renderingRule && this.layer.renderingRule.functionName ?
                    "stretch" !== this.layer.renderingRule.functionName.toLowerCase() ? this.layer.renderingRule.functionName : this._defaultBandCombinationFncName : this._firstFncInRenderingRuleList && "none" !== this._firstFncInRenderingRuleList.toLowerCase() ? this._firstFncInRenderingRuleList : this._defaultBandCombinationFncName) && this._rasterFunctionStore.get(a)) this.rasterFunctionList.set("value", a), this._onRasterFunctionChange()
            } else console.log("Could not populate renderers as the layer does not exists")
        },
        _fillRasterFunctionList: function(a) {
            if (this.layer &&
                (this._rasterFunctionData = [], !(null === a || null === a.extent))) {
                var b = new r(a.extent.xmin, a.extent.ymin, a.extent.xmax, a.extent.ymax, a.extent.spatialReference),
                    c = b.getWidth(),
                    d = b.getHeight();
                if (2 <= c / d || 2 <= d / c) c = Math.min(c, d) / 2, d = b.getCenter(), b.update(d.x - c, d.y - c, d.x + c, d.y + c, a.extent.spatialReference);
                b = b.xmin + "," + b.ymin + "," + b.xmax + "," + b.ymax;
                c = a._getToken();
                d = "";
                c && (d = "\x26token\x3d" + c);
                var e = this.layer.url + "/exportImage?bbox\x3d" + b + d + "\x26imageSize\x3d400,400\x26f\x3dimage\x26renderingRule\x3d",
                    b = this.layer.bandIds,
                    c = e;
                b && 3 <= b.length && (c = e + "\x26bandIds\x3d" + b[0] + "," + b[1] + "," + b[2]);
                this._addFunctionItemToList(this._defaultBandCombinationFncName, this._defaultBandCombinationFncName, this._i18n.widgets.renderingRule.userDefinedRendererDesc, c, "");
                a.rasterFunctionInfos && 0 < a.rasterFunctionInfos.length && n.forEach(a.rasterFunctionInfos, g.hitch(this, function(a) {
                    null === this._firstFncInRenderingRuleList && (this._firstFncInRenderingRuleList = a.name);
                    "none" !== a.name.toLowerCase() && this._addFunctionItemToList(a.name, a.name, a.description,
                        e, '{"rasterFunction":"' + a.name + '"}')
                }));
                a = {};
                a.layer = this.layer;
                a.data = this._rasterFunctionData;
                this._cachedFunctionList.push(a);
                this._setupFunctionStore()
            }
        },
        _addFunctionItemToList: function(a, b, c, d, e) {
            var f = {};
            f.name = a;
            f.id = b;
            b = c;
            200 < b.length && (b = b.substring(0, 200) + "...");
            f.description = b;
            f.label = "\x3chtml\x3e\x3cbody\x3e\x3csection\x3e\x3ch4\x3e" + a + ":\x3c/h4\x3e\x3ctable cellspacing\x3d'5'\x3e\x3ctr\x3e\x3ctd\x3e\x3cimg src\x3d'" + d + e + "' height\x3d'100' width\x3d'100'\x3e\x3c/td\x3e\x3ctd\x3e\x3cp style\x3d'white-space:pre-wrap;width:40ex'\x3e\x3ci\x3e" +
                b + "\x3c/i\x3e\x3c/p\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/section\x3e\x3c/body\x3e\x3c/html\x3e";
            this._rasterFunctionData.push(f)
        },
        _setupBandIdDefaults: function() {
            if (this.layer) {
                var a = 3,
                    a = this.layer.bandCount,
                    b = this.layer.id,
                    c = this._cachedkeyProperties[b];
                !c && 1 < a ? (this.msgLabel.style.display = "", this.msgLabel.innerHTML = "\x3ci\x3e" + this._i18n.widgets.renderingRule.bandNamesRequestMsg + "\x3c/i\x3e", c = this.layer.getKeyProperties(), this._pendingDfds[b] = 1, c.addBoth(g.partial(this._fillBandIdList, this,
                    this.layer))) : this._fillBandIdList(this, this.layer, c);
                3 > a ? this._hideBandIds() : this._showBandIds()
            }
        },
        _fillBandIdList: function(a, b, c) {
            if (a.layer && a.layer === b) {
                var d = a._pendingDfds;
                b = a.layer.id;
                d && d[b] && delete d[b];
                a.msgLabel.style.display = "none";
                a.msgLabel.innerHTML = "";
                var d = 3,
                    d = a.layer.bandCount,
                    e;
                c && (c.BandProperties && 0 < c.BandProperties.length) && (e = c.BandProperties);
                var f = a._getBandIdList(d, e, "");
                a._redBandIdStore = new k({
                    data: f,
                    idProperty: "name"
                });
                a.bandIdsRedList.set("store", a._redBandIdStore);
                a.bandIdsRedList.set("labelAttr",
                    "label");
                a.bandIdsRedList.set("labelType", "html");
                f = a._getBandIdList(d, e, "");
                a._greenBandIdStore = new k({
                    data: f,
                    idProperty: "name"
                });
                a.bandIdsGreenList.set("store", a._greenBandIdStore);
                a.bandIdsGreenList.set("labelAttr", "label");
                a.bandIdsGreenList.set("labelType", "html");
                d = a._getBandIdList(d, e, "");
                a._blueBandIdStore = new k({
                    data: d,
                    idProperty: "name"
                });
                a.bandIdsBlueList.set("store", a._blueBandIdStore);
                a.bandIdsBlueList.set("labelAttr", "label");
                a.bandIdsBlueList.set("labelType", "html");
                (d = a.layer.bandIds) &&
                    2 < d.length ? (a.bandIdsRedList.set("value", a._getBandName(a._redBandIdStore, d[0])), a.bandIdsGreenList.set("value", a._getBandName(a._greenBandIdStore, d[1])), a.bandIdsBlueList.set("value", a._getBandName(a._blueBandIdStore, d[2]))) : 0 < a._redBandIdStore.data.length && (1 < a._greenBandIdStore.data.length && 2 < a._blueBandIdStore.data.length) && (d = a._getRedBandIndex(e), f = a._getGreenBandIndex(e), e = a._getBlueBandIndex(e), a.bandIdsRedList.set("value", a._redBandIdStore.data[d].name), a.bandIdsGreenList.set("value", a._greenBandIdStore.data[f].name),
                        a.bandIdsBlueList.set("value", a._blueBandIdStore.data[e].name));
                a._cachedkeyProperties[b] = c;
                a.rasterFunctionList.get("value") === a._defaultBandCombinationFncName && a._enableBandIds()
            }
        },
        _getRedBandIndex: function(a) {
            if (!this.layer || !a) return 0;
            var b;
            for (b = 0; b < a.length; b++)
                if (a[b] && a[b].hasOwnProperty("BandName") && "red" === a[b].BandName.toLowerCase()) return b;
            return 0
        },
        _getGreenBandIndex: function(a) {
            if (!this.layer || !a) return 1;
            var b;
            for (b = 0; b < a.length; b++)
                if (a[b] && a[b].hasOwnProperty("BandName") && "green" ===
                    a[b].BandName.toLowerCase()) return b;
            return 1
        },
        _getBlueBandIndex: function(a) {
            if (!this.layer || !a) return 2;
            var b;
            for (b = 0; b < a.length; b++)
                if (a[b] && a[b].hasOwnProperty("BandName") && "blue" === a[b].BandName.toLowerCase()) return b;
            return 2
        },
        _getBandIdList: function(a, b, c) {
            if (this.layer) {
                var d = [];
                c || (c = "Black");
                var e = !1;
                b && a === b.length && (e = !0);
                var f;
                for (f = 0; f < a; f++) {
                    var g = f,
                        h = f;
                    e && b[f] && b[f].BandName ? g = b[f].BandName : g++;
                    var k = {};
                    k.name = g;
                    k.index = h;
                    k.label = "\x3chtml\x3e\x3cbody\x3e\x3cspan value\x3d" + h + "\x3e\x3cfont color\x3d" +
                        c + "\x3e" + g + "\x3c/font\x3e\x3c/span\x3e\x3c/body\x3e\x3c/html\x3e";
                    d.push(k)
                }
                return d
            }
        },
        _getBandName: function(a, b) {
            if (a && a.data) {
                var c;
                for (c = 0; c < a.data.length; c++) {
                    var d = a.data[c];
                    if (d.index === b) return d.name
                }
                return ""
            }
        },
        _setupStretchDefaults: function() {
            this.layer && (this.layer.renderingRule && this.layer.renderingRule.functionName && "stretch" === this.layer.renderingRule.functionName.toLowerCase() ? this._loadStretchFunction() : (this.stretchMethodList.set("value", "0"), this._onStretchMethodChange(), this.numStdDevText.value =
                2, this.minPercentText.value = 2, this.maxPercentText.value = 2, this.gammaSlider.setValue(0), this.layer.minValues && 0 < this.layer.minValues.length && this.layer.maxValues && 0 < this.layer.maxValues.length ? (this.draCheckbox.checked = !1, this.draCheckbox.disabled = !1, this.draLabel.style.color = "Black") : (this.draCheckbox.checked = !0, this.draCheckbox.disabled = !0, this.draLabel.style.color = "Gray")), this._gammaSliderTooltip || (this._gammaSliderTooltip = new v({
                connectId: ["gammaSliderID"],
                position: ["below", "above"],
                id: "gammaSliderTooltipID"
            })))
        },
        _loadStretchFunction: function() {
            var a = this.layer.renderingRule;
            if (a && a.functionName && "stretch" === a.functionName.toLowerCase()) {
                a = a.functionArguments;
                this.stretchMethodList.set("value", a.StretchType.toString());
                this._onStretchMethodChange();
                a.NumberOfStandardDeviations && (this.numStdDevText.value = a.NumberOfStandardDeviations);
                this.draCheckbox.checked = a.DRA ? !0 : !1;
                if (a.UseGamma) {
                    var b = a.Gamma;
                    0 < a.Gamma.length && (b = a.Gamma[0]);
                    (b = Math.log(b) / Math.log(10)) && this.gammaSlider.setValue(b)
                }
                a.MinPercent && (this.minPercentText.value =
                    a.MinPercent);
                a.MaxPercent && (this.maxPercentText.value = a.MaxPercent)
            }
        },
        _fillStretchMehodList: function() {
            this.stretchMethodList.removeOption(this.stretchMethodList.getOptions());
            this.stretchMethodList.addOption([{
                value: "0",
                label: this._i18n.widgets.renderingRule.noneStretchAlias
            }, {
                value: "5",
                label: this._i18n.widgets.renderingRule.minMaxStretchAlias
            }, {
                value: "3",
                label: this._i18n.widgets.renderingRule.stdDevStretchAlias
            }, {
                value: "6",
                label: this._i18n.widgets.renderingRule.percentClipStretchAlias
            }]);
            this.stretchMethodList.set("value",
                "0");
            this._onStretchMethodChange()
        },
        _onRasterFunctionChange: function() {
            var a = this.rasterFunctionList.get("value");
            if (a) {
                var b = this._rasterFunctionStore.get(a).description;
                this.rasterFunctionList.set("title", b);
                b = this.layer.id;
                a === this._defaultBandCombinationFncName ? (this.rasterFunctionRow.width = "", 1 < this.layer.bandCount ? (this._showBandIds(), this._pendingDfds[b] ? this._disableBandIds() : this._enableBandIds()) : this._hideBandIds()) : (0 < this.domNode.clientWidth && (this.rasterFunctionRow.width = this.domNode.clientWidth),
                    this._hideBandIds());
                a === this._defaultBandCombinationFncName ? (this.imageEnhancementLabel.style.display = "", this.stretchMethodLabel.style.display = "", this.stretchDescLabel.style.display = "", this.stretchMethodList.domNode.style.display = "", this._onStretchMethodChange()) : this._hideStretch()
            }
        },
        _onStretchMethodChange: function() {
            if (!(1 > this.stretchMethodList.getOptions.length)) {
                var a = this.stretchMethodList.get("value");
                "0" === a ? this._hideStretchOptions(!0) : this._hideStretchOptions(!1);
                switch (a) {
                    case "0":
                        this.stretchMethodNoneDescBlock.style.display =
                            "";
                        break;
                    case "3":
                        this.numStdDevBlock.style.display = "";
                        break;
                    case "5":
                        this.stretchMethodMinMaxDescBlock.style.display = "";
                        break;
                    case "6":
                        this.minMaxPercentDescBlock.style.display = "", this.minPercentBlock.style.display = "", this.maxPercentBlock.style.display = ""
                }
            }
        },
        _onClickApplyRenderingRule: function() {
            this.rasterFunctionList.get("value") !== this._defaultBandCombinationFncName ? this._onRasterFunctionApply() : this._onBandIdsApply()
        },
        _onClickResetRenderingRule: function() {
            this.layer && (this.layer.renderingRule =
                null, this.layer.bandIds = null, this._setupDefaults(), this._onClickApplyRenderingRule())
        },
        _onRasterFunctionApply: function() {
            if (!this._donotSaveChanges && this.layer) {
                var a = this.rasterFunctionList.get("value"),
                    b = new l;
                b.functionName = a;
                this.layer.setBandIds([], !0);
                this.layer.setRenderingRule(b)
            }
        },
        _onBandIdsApply: function() {
            if (!this._donotSaveChanges && this.layer)
                if (!this._redBandIdStore || !this.bandIdsGreenList || !this.bandIdsBlueList) this._onStretchApply(!1);
                else {
                    var a = [],
                        b = this._redBandIdStore.get(this.bandIdsRedList.value),
                        c = this._greenBandIdStore.get(this.bandIdsGreenList.value),
                        d = this._blueBandIdStore.get(this.bandIdsBlueList.value);
                    b && (c && d) && (a.push(b.index), a.push(c.index), a.push(d.index));
                    this._onStretchApply(!0);
                    this.layer.setBandIds(a)
                }
        },
        _onStretchApply: function(a) {
            if (!this._donotSaveChanges && this.layer) {
                var b = null;
                "0" !== this.stretchMethodList.get("value") && (b = new l, b.functionName = "Stretch", this._buildStretchFunction(b));
                this.layer.setRenderingRule(b, a)
            }
        },
        _buildStretchFunction: function(a) {
            a.functionName = "Stretch";
            var b = this.stretchMethodList.get("value"),
                c = {};
            c.StretchType = parseInt(b, 10);
            c.DRA = this.draCheckbox.checked ? !0 : !1;
            var d = Math.exp(this.gammaSlider.value * Math.log(10)),
                d = parseFloat(parseFloat(d).toFixed(2)),
                e = [];
            e.push(d);
            1 < this.layer.bandCount && (e.push(d), e.push(d));
            c.Gamma = e;
            c.UseGamma = !0;
            "3" === b ? (c.NumberOfStandardDeviations = this.numStdDevText.value, a.outputPixelType = "U8") : "6" === b ? (c.MinPercent = parseFloat(this.minPercentText.value), c.MaxPercent = parseFloat(this.maxPercentText.value), a.outputPixelType =
                "U8") : "5" === b && (a.outputPixelType = "U8");
            a.functionArguments = c
        },
        _onGammaChange: function(a) {
            var b = this._gammaSliderTooltip;
            if (b) {
                var c = Math.exp(a * Math.log(10));
                b.label = c ? parseFloat(c).toFixed(2) : a;
                b.open("gammaSliderID")
            }
        },
        _onGammaMouseLeave: function() {
            this.gammaTooltipClose()
        },
        _disableBandIds: function() {
            this.bandIdsRedList.set("disabled", !0);
            this.bandIdsGreenList.set("disabled", !0);
            this.bandIdsBlueList.set("disabled", !0);
            this.bandIdsLabel.style.color = "Gray"
        },
        _enableBandIds: function() {
            this.bandIdsRedList.set("disabled", !1);
            this.bandIdsGreenList.set("disabled", !1);
            this.bandIdsBlueList.set("disabled", !1);
            "" === this.bandIdsRedList.value && this.bandIdsRedList.set("value", "1");
            "" === this.bandIdsGreenList.value && this.bandIdsGreenList.set("value", "2");
            "" === this.bandIdsBlueList.value && this.bandIdsBlueList.set("value", "3");
            this.bandIdsLabel.style.color = "Black"
        },
        _showBandIds: function() {
            this.bandIdsLabelBlock.style.display = "";
            this.bandIdsBlock.style.display = "";
            this.bandIdsMsgBlock.style.display = ""
        },
        _hideBandIds: function() {
            this.bandIdsLabelBlock.style.display =
                "none";
            this.bandIdsBlock.style.display = "none";
            this.bandIdsMsgBlock.style.display = "none"
        },
        _hideStretch: function() {
            this.imageEnhancementLabel.style.display = "none";
            this.stretchDescLabel.style.display = "none";
            this.stretchMethodLabel.style.display = "none";
            this.stretchMethodList.domNode.style.display = "none";
            this._hideStretchOptions(!0)
        },
        _hideStretchOptions: function(a) {
            var b = "";
            a && (b = "none");
            this.gammaBlock.style.display = b;
            this.draBlock.style.display = b;
            this.stretchMethodNoneDescBlock.style.display = "none";
            this.stretchMethodMinMaxDescBlock.style.display = "none";
            this.numStdDevBlock.style.display = "none";
            this.minMaxPercentDescBlock.style.display = "none";
            this.minPercentBlock.style.display = "none";
            this.maxPercentBlock.style.display = "none"
        },
        _getDefaultRedBandIndex: function() {
            var a;
            this._redBandIdStore && (a = this._redBandIdStore.get("Red"));
            a || (a = 1);
            return a
        },
        gammaTooltipClose: function() {
            this._gammaSliderTooltip && this._gammaSliderTooltip.close()
        }
    })
});