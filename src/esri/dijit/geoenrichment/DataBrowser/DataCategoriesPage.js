//>>built
define(["../../../declare", "dojo/string", "dojo/_base/lang", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/on", "dojo/has", "dojo/i18n!../../../nls/jsapi", "dojo/text!./templates/DataCategoriesPage.html", "../../../tasks/geoenrichment/GeoenrichmentTask", "../config", "../_WizardPage", "../Pagination", "../AnimationHelper", "dojo/store/Memory", "dijit/layout/ContentPane", "dijit/form/FilteringSelect", "./SearchTextBox"], function(m, n, p, q, r, k, x, y, f, s, t, l, u, z, v, w) {
    f = f.geoenrichment.dijit.DataCategoriesPage;
    return m([u], {
        templateString: s,
        nls: f,
        baseClass: "DataCategoriesPage",
        items: null,
        countryID: null,
        countryBox: !0,
        dataCollections: {},
        rowsPerPage: 8,
        _task: null,
        _list: null,
        _pageCount: 0,
        _pageSize: 0,
        currentPage: 0,
        shoppingCart: null,
        selection: null,
        flyAnim: null,
        scrollAnim: null,
        constructor: function() {
            this._task = new t(l.server);
            this._task.token = l.token;
            this.scrollAnim = new v
        },
        buildRendering: function() {
            this.inherited(arguments);
            this.pagination.createItemContainer = this._createItemContainer;
            this.pagination.updateItemContainer = this._updateItemContainer;
            q.after(this.layoutGrid, "resize", p.hitch(this.pagination, this.pagination.resize))
        },
        startup: function() {
            this.inherited(arguments);
            this.countryBox ? (this.countrySelect.set("labelAttr", "label"), this.countrySelect.set("searchAttr", "label"), this.countrySelect.store.idProperty = "value", this.countrySelect.set("item", {
                value: "_",
                label: f.loading
            }, null, f.loading), this.countrySelect.set("disabled", !0), this.showProgress(this._task.getAvailableCountries(), "_onCountriesResponse")) : (k.destroy(this.countryDiv), this._loadDataCollections())
        },
        _createItemContainer: function() {
            var a = k.create("div", {
                "class": "DataCategoriesPage_Item"
            });
            k.create("span", null, a);
            return a
        },
        _updateItemContainer: function(a, c) {
            a.childNodes[0].innerHTML = c.name;
            a.className = "DataCategoriesPage_Item DataBrowser_Clickable DataCategoriesPage_Item_" + c.id.replace(/ /g, "_");
            a.data = c
        },
        _onItemClick: function(a) {
            if (this.flyAnim) {
                var c = this.flyAnim.fly(a, "Breadcrumb_SelectCategory");
                c.innerHTML = "";
                r.remove(c, "DataBrowser_Clickable")
            }
            this.onSelect(a.data)
        },
        _coerceCurrentPage: function(a) {
            0 >
                a ? a = 0 : a >= this._pageCount && (a = this._pageCount - 1);
            return a
        },
        _back: function() {
            this.set("currentPage", this.currentPage - 1)
        },
        _forward: function() {
            this.set("currentPage", this.currentPage + 1)
        },
        _onCountriesResponse: function(a) {
            this.countrySelect.set("disabled", !1);
            for (var c = [{
                value: "_",
                label: f.global
            }], g = 0; g < a.length; g++) c.push({
                value: a[g].id,
                label: a[g].name
            });
            a = new w({
                data: c,
                idProperty: "value"
            });
            this.countrySelect.set("store", a);
            this.countrySelect.set("value", this.countryID || "_")
        },
        _onCountryChanged: function() {
            var a =
                this.countrySelect.get("value");
            "_" == a && (a = null);
            this.countryID = a;
            this._loadDataCollections()
        },
        _setCountryIDAttr: function(a) {
            this.countryID != a && (this._set("countryID", a), this._loadDataCollections())
        },
        _loadDataCollections: function() {
            this.cancelProgress("_onDataCollectionsResponse");
            this.showProgress(this._task.getDataCollections(this.countryID, null, "id alias description popularity fieldCategory vintage filteringTags".split(" ")), "_onDataCollectionsResponse")
        },
        _onDataCollectionsResponse: function(a) {
            this.dataCollections ||
                (this.dataCollections = {});
            this.dataCollections[this.countryID] = a ? a : {};
            for (var c = {}, g = [], h = 0; h < a.length; h++) {
                var b = a[h];
                b.fieldCategories = {};
                if (b.metadata.filters)
                    for (var d = 0; d < b.metadata.filters.length; d++) b.metadata.filters[d].id = b.metadata.filters[d].id.replace("Diposable", "Disposable");
                if (b.metadata.categories) {
                    if (b.variables)
                        for (var e = 0; e < b.variables.length; e++) {
                            b.variables[e].id2 = b.id + "." + b.variables[e].id;
                            b.variables[e].hidden = 0;
                            b.variables[e].idDesc = b.variables[e].id + "." + b.variables[e].description;
                            for (d = 0; d < b.variables[e].filteringTags; d++) b.variables[e].filteringTags[d].value = b.variables[e].filteringTags[d].value.replase("$", "");
                            if (this.selection && this.selection.length)
                                for (d = 0; d < this.selection.length; d++)
                                    if (this.selection[d] === b.variables[e].id2) {
                                        g.push(b.variables[e]);
                                        break
                                    }
                        }
                    for (d = 0; d < b.metadata.categories.length; d++) {
                        var f = b.metadata.categories[d],
                            e = f.id.toLowerCase();
                        c[e] ? c[e].dataCollections.push(b) : c[e] = {
                            id: e,
                            name: f.alias,
                            dataCollections: [b],
                            displayOrder: f.displayOrder
                        }
                    }
                }
            }
            this.shoppingCart.setVariables(g);
            a = [];
            for (f in c) c[f].dataCollections.sort(function(a, b) {
                return b.metadata.title < a.metadata.title ? 1 : -1
            }), a.push(c[f]);
            a.sort(function(a, b) {
                return b.displayOrder - a.displayOrder
            });
            this.set("items", a)
        },
        _setItemsAttr: function(a) {
            this._set("items", a);
            this.pagination.set("items", a);
            this._started && this.resize()
        },
        onSelect: function(a) {},
        _search: function() {
            if (this.txbSearch.get("value")) {
                var a = this.txbSearch.get("value"),
                    c = this.get("items"),
                    g = [],
                    h, b;
                for (i = 0; i < c.length; i++)
                    for (j = 0; j < c[i].dataCollections.length; j++) {
                        b =
                            c[i].dataCollections[j];
                        h = {
                            id: b.id,
                            metadata: b.metadata,
                            keywords: b.keywords,
                            variables: []
                        };
                        for (var d = 0; d < b.variables.length; d++) this._match(b.variables[d], a) && h.variables.push(b.variables[d]);
                        0 < h.variables.length && g.push(h)
                    }
                0 < g.length ? (this._set("selectedCollections", g), this.onSearch("'" + a + "'")) : this.txbSearch.showTooltip(n.substitute(f.noResults, {
                    seachKey: a
                }))
            }
        },
        _match: function(a, c) {
            return a.alias && -1 !== a.alias.toLowerCase().indexOf(c.toLowerCase()) || a.description && -1 !== a.description.toLowerCase().indexOf(c.toLowerCase()) ||
                a.fieldCategory && -1 !== a.fieldCategory.toLowerCase().indexOf(c.toLowerCase())
        },
        onSearch: function() {}
    })
});