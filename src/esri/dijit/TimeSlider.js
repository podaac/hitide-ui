//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/dom-geometry", "dijit/_Widget", "dijit/_Templated", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojox/timing/_base", "dojox/form/RangeSlider", "dojo/text!dojox/form/resources/HorizontalRangeSlider.html", "../kernel", "../lang", "../TimeExtent", "./_EventedWidget", "dojo/text!./templates/TimeSlider.html", "dojo/i18n!../nls/jsapi"],
    function(q, k, c, l, m, D, E, f, g, r, n, s, t, p, u, v, w, x, y, F, z, h, A, B, C) {
        return k([A, s, t], {
            declaredClass: "esri.dijit.TimeSlider",
            widgetsInTemplate: !0,
            templateString: B,
            basePath: q.toUrl(".") + "/",
            _slideDuration: 1E3,
            _defaultCount: 10,
            _eventMap: {
                "time-extent-change": !0,
                play: !0,
                pause: !0,
                next: !0,
                previous: !0
            },
            constructor: function(a, b) {
                c.mixin(this, C.widgets.timeSlider);
                this._iconClass = "tsButton tsPlayButton";
                this.loop = this.playing = !1;
                this.thumbCount = 1;
                this.thumbMovingRate = 1E3;
                this._createTimeInstants = !1;
                this._options =
                    c.mixin({
                        excludeDataAtTrailingThumb: !1,
                        excludeDataAtLeadingThumb: !1
                    }, a.options || {})
            },
            postCreate: function() {
                this.inherited(arguments);
                n.isBodyLtr() || (this.playPauseBtn.domNode.parentNode.align = "left", this.previousBtn.domNode.parentNode.align = "right", this.nextBtn.domNode.parentNode.align = "right", f.add(this.playPauseBtn.iconNode, "tsFlipImage"), f.add(this.previousBtn.iconNode, "tsFlipImage"), f.add(this.nextBtn.iconNode, "tsFlipImage"))
            },
            startup: function() {
                this.inherited(arguments);
                this._timer = new w.Timer;
                this._timer.setInterval(this.thumbMovingRate);
                this._timer.onTick = c.hitch(this, "_bumpSlider", 1);
                this._createSlider()
            },
            destroy: function() {
                this._timer.stop();
                this.timeStops = this._timer = null;
                this._slider.destroy();
                this._slider = null;
                this._hTicks && (this._hTicks.destroyRecursive(), this._hTicks = null);
                this._hLabels && (this._hLabels.destroyRecursive(), this._hLabels = null);
                this.inherited(arguments)
            },
            onTimeExtentChange: function() {},
            onPlay: function() {},
            onPause: function() {},
            onNext: function() {},
            onPrevious: function() {},
            _onHorizontalChange: function() {
                var a = this._sliderToTimeExtent();
                this.onTimeExtentChange(a)
            },
            _onPlay: function() {
                this.playing = !this.playing;
                this._updateUI();
                this.playing ? (this._timer.start(), this.onPlay(this._sliderToTimeExtent())) : (this._timer.stop(), this.onPause(this._sliderToTimeExtent()));
                var a = this._getSliderValue();
                this._offset = c.isArray(a) ? a[1] - a[0] : 0
            },
            _onNext: function() {
                this.playing || (this._bumpSlider(1), this.onNext(this._sliderToTimeExtent()))
            },
            _onPrev: function() {
                this.playing || (this._bumpSlider(-1),
                    this.onPrevious(this._sliderToTimeExtent()))
            },
            createTimeStopsByCount: function(a, b) {
                if (!a || !a.startTime || !a.endTime) console.log(this.NLS_invalidTimeExtent);
                else {
                    b = b || this._defaultCount;
                    var e = Math.ceil((a.endTime - a.startTime) / (b - 1));
                    this.createTimeStopsByTimeInterval(a, e, "esriTimeUnitsMilliseconds")
                }
            },
            createTimeStopsByTimeInterval: function(a, b, e, d) {
                if (!a || !a.startTime || !a.endTime) console.log(this.NLS_invalidTimeExtent);
                else {
                    this.fullTimeExtent = new h(a.startTime, a.endTime);
                    d && !0 === d.resetStartTime &&
                        this._resetStartTime(this.fullTimeExtent, e);
                    this._timeIntervalUnits = e;
                    d = this.fullTimeExtent.startTime;
                    for (var c = []; d <= a.endTime;) c.push(d), d = a._getOffsettedDate(d, b, e);
                    0 < c.length && c[c.length - 1] < a.endTime && c.push(d);
                    this.setTimeStops(c)
                }
            },
            getCurrentTimeExtent: function() {
                return this._sliderToTimeExtent()
            },
            setTimeStops: function(a) {
                this.timeStops = a || [];
                this._numTicks = this._numStops = this.timeStops.length;
                !1 === z.isDefined(this.fullTimeExtent) && (this.fullTimeExtent = new h(a[0], a[a.length - 1]))
            },
            setLoop: function(a) {
                this.loop =
                    a
            },
            setThumbCount: function(a) {
                this.thumbCount = a;
                this.singleThumbAsTimeInstant(this._createTimeInstants);
                this._slider && this._createSlider()
            },
            setThumbIndexes: function(a) {
                this.thumbIndexes = c.clone(a) || [0, 1];
                this._initializeThumbs()
            },
            setThumbMovingRate: function(a) {
                this.thumbMovingRate = a;
                this._timer && this._timer.setInterval(this.thumbMovingRate)
            },
            setLabels: function(a) {
                this.labels = a;
                this._slider && this._createSlider()
            },
            setTickCount: function(a) {
                this._numTicks = a;
                this._slider && this._createSlider()
            },
            singleThumbAsTimeInstant: function(a) {
                this._createTimeInstants =
                    a && 1 === this.thumbCount
            },
            next: function() {
                this._onNext()
            },
            pause: function() {
                this.playing = !1;
                this._updateUI();
                this._timer.stop()
            },
            play: function() {
                !0 !== this.playing && (this.playing = !1, this._onPlay())
            },
            previous: function() {
                this._onPrev()
            },
            _updateUI: function() {
                f.remove(this.playPauseBtn.iconNode, this._iconClass);
                this._iconClass = this.playing ? "tsButton tsPauseButton" : "tsButton tsPlayButton";
                f.add(this.playPauseBtn.iconNode, this._iconClass);
                this.previousBtn.set("disabled", this.playing);
                this.nextBtn.set("disabled",
                    this.playing)
            },
            _createSlider: function() {
                this._slider && (this._slider.destroy(), this._slider = null);
                for (var a = this.domNode; a.parentNode && !a.dir;) a = a.parentNode;
                a = {
                    onChange: c.hitch(this, "_onHorizontalChange"),
                    showButtons: !1,
                    discreteValues: this._numStops,
                    slideDuration: this._slideDuration,
                    "class": "ts",
                    dir: n.isBodyLtr() ? "ltr" : "rtl"
                };
                this._ts = g.create("div", {}, m.query(".tsTmp", this.domNode)[0], "first");
                this._timeSliderTicks = g.create("div", {}, this._ts, "first");
                this._timeSliderLabels = g.create("div", {}, this._ts);
                2 === this.thumbCount ? this._createRangeSlider(a) : this._createSingleSlider(a);
                this.thumbIndexes = this.thumbIndexes || [0, 1];
                this._createHorizRule();
                this._createLabels();
                !0 === this._createTimeInstants && m.query(".dijitSliderProgressBarH, .dijitSliderLeftBumper, .dijitSliderRightBumper").forEach(function(a) {
                    r.set(a, {
                        background: "none"
                    })
                });
                this._initializeThumbs();
                l.disconnect(this._onChangeConnect);
                this._onChangeConnect = l.connect(this._slider, "onChange", c.hitch(this, "_updateThumbIndexes"))
            },
            _createRangeSlider: function(a) {
                this._isRangeSlider = !0;
                this._slider = new(k([p, x], {
                    templateString: y
                }))(a, this._ts)
            },
            _createSingleSlider: function(a) {
                this._isRangeSlider = !1;
                this._slider = new p(a, this._ts)
            },
            _createHorizRule: function() {
                this._hTicks && (this._hTicks.destroyRecursive(), this._hTicks = null);
                2 > this._numTicks || (this._hTicks = new u({
                    container: "topDecoration",
                    ruleStyle: "",
                    "class": "tsTicks",
                    count: this._numTicks
                }, this._timeSliderTicks))
            },
            _createLabels: function() {
                this._hLabels && (this._hLabels.destroyRecursive(), this._hLabels = null);
                this.labels && 0 < this.labels.length &&
                    (this._hLabels = new v({
                    labels: this.labels,
                    labelStyle: "",
                    "class": "tsLabels"
                }, this._timeSliderLabels))
            },
            _initializeThumbs: function() {
                if (this._slider) {
                    this._offset = this._toSliderValue(this.thumbIndexes[1]) || 0;
                    var a = this._toSliderValue(this.thumbIndexes[0]),
                        a = a > this._slider.maximum || a < this._slider.minimum ? this._slider.minimum : a;
                    if (!0 === this._isRangeSlider) {
                        var b = this._toSliderValue(this.thumbIndexes[1]),
                            b = b > this._slider.maximum || b < this._slider.minimum ? this._slider.maximum : b;
                        this._setSliderValue([a, b < a ?
                            a : b
                        ])
                    } else this._setSliderValue(a);
                    this._onHorizontalChange()
                }
            },
            _bumpSlider: function(a) {
                var b = this._getSliderValue(),
                    e = b,
                    d = e,
                    f = a;
                c.isArray(b) && (d = b[0], e = b[1], f = [{
                    change: a,
                    useMaxValue: !0
                }, {
                    change: a,
                    useMaxValue: !1
                }]);
                1E-10 > Math.abs(d - this._slider.minimum) && 0 > a || 1E-10 > Math.abs(e - this._slider.maximum) && 0 < a ? this._timer.isRunning && (this.loop ? (this._timer.stop(), this._setSliderValue(this._getSliderMinValue()), a = this._sliderToTimeExtent(), this.onTimeExtentChange(a), this._timer.start(), this.playing = !0) : this.pause()) :
                    this._slider._bumpValue(f)
            },
            _updateThumbIndexes: function() {
                var a = this._getSliderValue();
                c.isArray(a) ? (this.thumbIndexes[0] = this._toSliderIndex(a[0]), this.thumbIndexes[1] = this._toSliderIndex(a[1])) : this.thumbIndexes[0] = this._toSliderIndex(a)
            },
            _sliderToTimeExtent: function() {
                if (this.timeStops && 0 !== this.timeStops.length) {
                    var a = new h,
                        b = this._getSliderValue(),
                        e, d;
                    c.isArray(b) ? (b[0] > b[1] ? (d = b[0], e = b[1]) : (e = b[0], d = b[1]), a.startTime = new Date(this.timeStops[this._toSliderIndex(e)]), a.endTime = new Date(this.timeStops[this._toSliderIndex(d)]),
                        this._adjustTimeExtent(a)) : (a.startTime = !0 === this._createTimeInstants ? new Date(this.timeStops[this._toSliderIndex(b)]) : new Date(this.fullTimeExtent.startTime), a.endTime = !0 === this._createTimeInstants ? a.startTime : new Date(this.timeStops[this._toSliderIndex(b)]));
                    return a
                }
            },
            _adjustTimeExtent: function(a) {
                if (!(!1 === this._options.excludeDataAtTrailingThumb && !1 === this._options.excludeDataAtLeadingThumb) && a.startTime.getTime() !== a.endTime.getTime()) {
                    if (this._options.excludeDataAtTrailingThumb) {
                        var b = a.startTime;
                        b.setUTCSeconds(b.getUTCSeconds() + 1)
                    }
                    this._options.excludeDataAtLeadingThumb && (a = a.endTime, a.setUTCSeconds(a.getUTCSeconds() - 1))
                }
            },
            _resetStartTime: function(a, b) {
                switch (b) {
                    case "esriTimeUnitsSeconds":
                        a.startTime.setUTCMilliseconds(0);
                        break;
                    case "esriTimeUnitsMinutes":
                        a.startTime.setUTCSeconds(0, 0, 0);
                        break;
                    case "esriTimeUnitsHours":
                        a.startTime.setUTCMinutes(0, 0, 0);
                        break;
                    case "esriTimeUnitsDays":
                        a.startTime.setUTCHours(0, 0, 0, 0);
                        break;
                    case "esriTimeUnitsWeeks":
                        a.startTime.setUTCDate(a.startTime.getUTCDate() -
                            a.startTime.getUTCDay());
                        break;
                    case "esriTimeUnitsMonths":
                        a.startTime.setUTCDate(1);
                        a.startTime.setUTCHours(0, 0, 0, 0);
                        break;
                    case "esriTimeUnitsDecades":
                        a.startTime.setUTCFullYear(a.startTime.getUTCFullYear() - a.startTime.getUTCFullYear() % 10);
                        break;
                    case "esriTimeUnitsCenturies":
                        a.startTime.setUTCFullYear(a.startTime.getUTCFullYear() - a.startTime.getUTCFullYear() % 100)
                }
            },
            _getSliderMinValue: function() {
                return this._isRangeSlider ? [this._slider.minimum, this._slider.minimum + this._offset] : this._slider.minimum
            },
            _toSliderIndex: function(a) {
                a = Math.floor((a - this._slider.minimum) * this._numStops / (this._slider.maximum - this._slider.minimum));
                0 > a && (a = 0);
                a >= this._numStops && (a = this._numStops - 1);
                return a
            },
            _toSliderValue: function(a) {
                return a * (this._slider.maximum - this._slider.minimum) / (this._numStops - 1) + this._slider.minimum
            },
            _getSliderValue: function() {
                return this._slider.get("value")
            },
            _setSliderValue: function(a) {
                this._slider._setValueAttr(a, !1, !1)
            }
        })
    });