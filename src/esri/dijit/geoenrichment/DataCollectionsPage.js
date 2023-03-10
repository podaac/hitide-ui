//>>built
define(["../../declare", "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/DataCollectionsPage.html", "../../tasks/geoenrichment/GeoenrichmentTask", "./config", "./CheckListPage", "dijit/layout/ContentPane", "dijit/form/Select"], function(h, k, e, l, d, m, n, b, p) {
    function f(a) {
        var g = e.create("table", {
                "class": "DataCollection"
            }),
            c = e.create("tr", null, g),
            d = e.create("td", {
                "class": "DataCollection_Icon"
            }, c),
            b = a.metadata.icon;
        b && k.add(d, "DataCollection_" + b);
        e.create("td", {
            "class": "DataCollection_Label",
            innerHTML: a.metadata.title
        }, c);
        return g
    }
    d = d.geoenrichment.dijit.DataCollectionsPage;
    return h([p], {
        templateString: m,
        nls: d,
        multiSelectClass: "DCsMultiSelect",
        singleSelectClass: "DCsSingleSelect",
        countryID: null,
        countryBox: !0,
        dataCollections: null,
        _task: null,
        constructor: function() {
            this._task = new n(b.server);
            this._task.token = b.token
        },
        renderSingleSelectRow: function(a, d) {
            return f(a)
        },
        renderMultiSelectRow: function(a, d) {
            var c = f(a),
                b = l(".DataCollection_Icon", c)[0];
            e.create("div", {
                    "class": "dijit dijitInline dijitCheckBox"
                },
                b);
            return c
        },
        startup: function() {
            this.inherited(arguments);
            this.countryBox ? (this.countrySelect.addOption({
                value: "_",
                label: d.loading
            }), this.countrySelect.set("disabled", !0), this.showProgress(this._task.getAvailableCountries(), "_onCountriesResponse")) : (e.destroy(this.countryDiv), this._loadDataCollections())
        },
        _onCountriesResponse: function(a) {
            this.countrySelect.set("disabled", !1);
            for (var b = [{
                value: "_",
                label: d.global
            }], c = 0; c < a.length; c++) b.push({
                value: a[c].id,
                label: a[c].name
            });
            this.countrySelect.set("options",
                b);
            this.countrySelect.set("value", this.countryID || "_")
        },
        _onCountryChanged: function() {
            var a = this.countrySelect.get("value");
            "_" == a && (a = null);
            this.countryID = a;
            this._loadDataCollections()
        },
        _setCountryIDAttr: function(a) {
            this.countryID != a && (this._set("countryID", a), this._loadDataCollections())
        },
        _loadDataCollections: function() {
            this.cancelProgress("_onDataCollectionsResponse");
            this.showProgress(this._task.getDataCollections(this.countryID), "_onDataCollectionsResponse")
        },
        _onDataCollectionsResponse: function(a) {
            this.dataCollections[this.countryID] =
                a;
            this.set("items", a)
        }
    })
});