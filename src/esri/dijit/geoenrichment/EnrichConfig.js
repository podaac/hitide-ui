//>>built
define(["../../declare", "dojo/_base/lang", "dojo/dom-class", "./_Wizard", "../../tasks/geoenrichment/EnrichParameters", "../../tasks/geoenrichment/RingBuffer", "./EnrichOptionsPage", "./DataBrowser", "dojo/i18n!../../nls/jsapi"], function(l, f, m, n, p, q, r, s, g) {
    return l("esri.dijit.geoenrichment.EnrichConfig", [n], {
        enrichParams: null,
        geomType: null,
        fields: null,
        fieldsMap: null,
        allowNewColumns: !0,
        studyAreaCount: null,
        showBackButton: !0,
        title: g.geoenrichment.dijit.EnrichConfig.title,
        _nextButton: null,
        _dataCollections: null,
        _eventMap: {
            back: !0,
            finish: ["params", "fieldsMap", "dataCollections"]
        },
        selectedIDs: null,
        constructor: function() {
            this.selectedIDs = []
        },
        startup: function() {
            this.inherited(arguments);
            this.enrichParams || (this.enrichParams = new p);
            this.enrichParams.studyAreaOptions = new q;
            m.add(this.domNode, "EnrichConfig");
            this.pages.d = new s({
                countryID: this.enrichParams.countryID,
                countryBox: !0,
                multiSelect: !0,
                okButton: g.geoenrichment.dijit.WizardButtons.next,
                title: this.title,
                onBack: f.hitch(this, this._onBack),
                onCancel: f.hitch(this, this._onBack),
                onOK: f.hitch(this,
                    this._applyVariables)
            });
            this._loadDataBrowser()
        },
        _onDataCollectionSelect: function() {
            var d = !1,
                a = this.pages.d.get("selection"),
                b;
            for (b in a)
                if (a[b]) {
                    d = !0;
                    break
                }
            this._nextButton.disabled = !d
        },
        _loadDataBrowser: function() {
            this.pages.d.set("selection", this.selectedIDs);
            this.loadPage("d")
        },
        _applyVariables: function() {
            this._dataCollections = this.pages.d.dataCollections[this.enrichParams.countryID];
            this.pages.o || (this.pages.o = new r({
                buffer: this.enrichParams.studyAreaOptions,
                geomType: this.geomType,
                fields: this.fields,
                allowNewColumns: this.allowNewColumns,
                studyAreaCount: this.studyAreaCount,
                onBack: f.hitch(this, function() {
                    this.fieldsMap = this.pages.o.get("fieldsMap");
                    this._loadDataBrowser()
                }),
                onFinish: f.hitch(this, this._finish)
            }));
            this.pages.o.set("dataCollections", this._dataCollections);
            for (var d = this.fieldsMap || {}, a = {}, b = this.selectedIDs = this.pages.d.get("selection"), c = 0; c < b.length; c++) {
                var h = b[c];
                a[h] = d[h] || ""
            }
            this.fieldsMap = a;
            this.pages.o.set("fieldsMap", a);
            this.loadPage("o")
        },
        _onBack: function() {
            this.onBack()
        },
        onBack: function() {},
        _finish: function() {
            this.enrichParams.countryID = this.pages.d.get("countryID");
            this.enrichParams.studyAreaOptions = this.pages.o.get("buffer");
            var d = this.fieldsMap = this.pages.o.get("fieldsMap"),
                a = [];
            this.enrichParams.variables = [];
            for (var b = 0; b < this._dataCollections.length; b++) {
                for (var c = this._dataCollections[b], h = !0, k = [], e = 0; e < c.variables.length; e++) {
                    var g = c.id + "." + c.variables[e].id;
                    f.isString(d[g]) ? k.push(g) : h = !1
                }
                if (h) this.enrichParams.variables.push(c.id + ".*"), a.push(c);
                else if (0 <
                    k.length) {
                    for (e = 0; e < k.length; e++) this.enrichParams.variables.push(k[e]);
                    a.push(c)
                }
            }
            this.onFinish(this.enrichParams, d, a)
        },
        onFinish: function(d, a, b) {}
    })
});