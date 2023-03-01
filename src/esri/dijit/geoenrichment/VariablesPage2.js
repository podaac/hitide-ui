//>>built
define(["../../declare", "dojo/text!./templates/VariablesPage2.html", "dojo/dom-construct", "dojo/dom-class", "./CheckListPage", "dijit/layout/ContentPane"], function(e, f, b, c, g) {
    return e([g], {
        templateString: f,
        multiSelectClass: "VarsMultiSelect",
        singleSelectClass: "VarsSingleSelect",
        renderSingleSelectRow: function(a, c) {
            return b.create("div", {
                "class": "VarLabel",
                innerHTML: a.alias
            })
        },
        renderMultiSelectRow: function(a, c) {
            var d = b.create("div");
            b.create("div", {
                "class": "dijit dijitInline dijitCheckBox"
            }, d);
            b.create("div", {
                "class": "dijitInline VarLabel",
                innerHTML: a.alias
            }, d);
            return d
        },
        _setDataCollectionAttr: function(a) {
            this.dataCollection && c.remove(this.dataCollectionIcon, "DataCollection_" + this.dataCollection.metadata.icon);
            this._set("dataCollection", a);
            this.dataCollectionName.innerHTML = a.metadata.title;
            c.add(this.dataCollectionIcon, "DataCollection_" + a.metadata.icon);
            this.set("items", a.variables)
        }
    })
});