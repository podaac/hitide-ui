//>>built
define(["../../declare", "dojox/mvc/Templated", "dojo/text!./templates/BufferOptions.html", "dojo/i18n!../../nls/jsapi", "../../tasks/geoenrichment/RingBuffer", "../../tasks/geoenrichment/DriveBuffer", "../../tasks/geoenrichment/DriveUnits", "dijit/form/RadioButton", "./NumberSpinner", "dijit/form/Select"], function(f, g, h, b, e, d, c) {
    b = b.geoenrichment.dijit.BufferOptions;
    return f("esri.dijit.geoenrichment.BufferOptions", [g], {
        templateString: h,
        nls: b,
        geomType: "",
        _buffer: null,
        _ringBuffer: null,
        _driveTimeBuffer: null,
        _driveDistBuffer: null,
        constructor: function() {
            this._ringBuffer = new e;
            this._driveTimeBuffer = new d;
            this._driveDistBuffer = new d({
                radius: 1,
                units: c.MILES
            });
            this._buffer = this._ringBuffer
        },
        buildRendering: function() {
            this.inherited(arguments);
            this._updateUI()
        },
        _setGeomTypeAttr: function(a) {
            switch (a) {
                case "point":
                    this.radiusTr.style.display = this.studyAreaTr.style.display = "";
                    break;
                case "polyline":
                    this.studyAreaTr.style.display = "none";
                    this.radiusTr.style.display = "";
                    this.radiusLabel.innerHTML = b.buffer;
                    break;
                case "polygon":
                    this.radiusTr.style.display =
                        this.studyAreaTr.style.display = "none", this.radiusLabel.innerHTML = b.buffer
            }
            this.geomType = a
        },
        _getBufferAttr: function() {
            return this._buffer
        },
        _setBufferAttr: function(a) {
            if (this._buffer !== a) {
                if (a instanceof e) this._ringBuffer = a;
                else if (a instanceof d) a.units == c.MINUTES ? this._driveTimeBuffer = a : this._driveDistBuffer = a;
                else throw "Unexpected buffer type";
                this._buffer = a;
                this._updateUI();
                this._onChange()
            }
        },
        _updateUI: function() {
            var a;
            this._buffer instanceof e ? a = "Ring" : this._buffer instanceof d && (a = this._buffer.units ==
                c.MINUTES ? "DriveTime" : "DriveDistance");
            this.typeSelect.set("value", a);
            this.radiusSpinner.set("value", this._buffer.radii[0]);
            this._updateUnits()
        },
        _typeChange: function() {
            switch (this.typeSelect.get("value")) {
                case "Ring":
                    this.set("buffer", this._ringBuffer);
                    this.radiusLabel.innerHTML = b.radius;
                    break;
                case "DriveTime":
                    this.set("buffer", this._driveTimeBuffer);
                    this.radiusLabel.innerHTML = b.time;
                    break;
                case "DriveDistance":
                    this.set("buffer", this._driveDistBuffer), this.radiusLabel.innerHTML = b.distance
            }
        },
        _updateUnits: function() {
            this.unitsSelect.removeOption(this.unitsSelect.getOptions());
            "DriveTime" == this.typeSelect.get("value") ? (this.minutesSpan.style.display = "", this.unitsSelect.domNode.style.display = "none") : (this.minutesSpan.style.display = "none", this.unitsSelect.domNode.style.display = "", this._addOption(c.MILES), this._addOption(c.KILOMETERS), this._addOption(c.FEET), this._addOption(c.METERS));
            this.unitsSelect.set("value", this._buffer.units)
        },
        _addOption: function(a) {
            this.unitsSelect.addOption({
                value: a,
                label: b.units[a]
            })
        },
        _unitsChange: function() {
            var a = this.unitsSelect.get("value");
            a &&
                (this._buffer.units = a);
            this._onChange()
        },
        _radiusChange: function() {
            this.radiusSpinner.isValid() ? (this._buffer.radii = [this.radiusSpinner.get("value")], this._onChange()) : this._onError()
        },
        _onChange: function() {
            this.onChange()
        },
        onChange: function() {},
        _onError: function() {
            this.onError()
        },
        onError: function() {}
    })
});