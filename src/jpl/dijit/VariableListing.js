define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/query",
    "dojo/mouse",
    "dojo/fx",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/DateTextBox",
    'dojo/text!./templates/VariableListing.html',
    "xstyle/css!./css/VariableListing.css",
    'dgrid/OnDemandGrid',
    'dojo/store/Memory',
    'dojo/store/Observable'
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, registry,
    _WidgetBase, _TemplatedMixin, DateTextBox, template, css,
    OnDemandGrid, Memory, Observable) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        label: null,
        showTitle: null,
        visible: null,
        variables: null,
        checkboxGrid: null,
        descriptionGrid: null,
        checkboxType: null,
        checkboxEvent: null,
        datasetId: null,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            var data = {};
            data.items = [];
            data.identifier = "id";
            data.label = "id";
            this.variableStore = new Observable(new Memory({
                data: data
            }));
            // Determine functionalities based on args
            var columns;
            if (this.checkboxGrid && this.descriptionGrid) {
                var renderMethod;
                if (this.checkboxType === "checkbox") {
                    renderMethod = lang.hitch(this, this._renderCheckboxCell);
                } else {
                    renderMethod = lang.hitch(this, this._renderToggleCell);
                }
                columns = [{
                    field: "active",
                    label: "",
                    renderCell: renderMethod
                }, {
                    field: "id",
                    label: "Name"
                }, {
                    field: "description",
                    label: "Description"
                }];
            } else if (this.descriptionGrid) {
                columns = [{
                    field: "id",
                    label: "Name"
                }, {
                    field: "description",
                    label: "Description"
                }];
            } else {
                columns = [{
                    field: "id",
                    label: "Name"
                }]
            }
            this.variableGrid = new(declare([OnDemandGrid]))({
                store: this.variableStore,
                columns: columns,
                sort: "name",
                cellNavigation: false,
                loadingMessage: "Loading Variables..."
            }, this.variableListingGrid);

            this.variableGrid.startup();

            if (this.variables) {
                this.setVariableListing(this.variables);
            }

            if (this.visible) {
                this.show();
            } else {
                this.hide();
            }
            if (!this.showTitle) {
                domStyle.set(this.variableListingTitle, "display", "none");
            }
        },

        _renderCheckboxCell: function(obj) {
            var cellContent = domConstruct.create("div", {});
            // console.log(obj, obj.footprint)
            var addition = obj.active ? "checked" : "";
            var cb = domConstruct.toDom("<input class='fieldTypeCB' type='checkbox' " + addition + ">");
            domConstruct.place(cb, cellContent);

            return cellContent;
        },

        _renderToggleCell: function(obj) {
            var cellContent = domConstruct.create("div", {});
            var addition = obj.active ? " variableIconActive fa fa-eye" : " fa fa-eye-slash";
            var btn = domConstruct.toDom("<span class='variableIcon" + addition + "'></span>");
            domConstruct.place(btn, cellContent);
            on(btn, "click", lang.hitch(this, function(evt) {
                obj.active = !obj.active;
                this.variableStore.put(obj)
                    // if (obj.active) {
                    //     domAttr.set(btn, "className", "fa fa-eye variableIconActive");
                    // } else {
                    //     domAttr.set(btn, "className", "fa fa-eye-slash variableIcon");
                    // }
                topic.publish(this.checkboxEvent, {
                    datasetId: this.datasetId,
                    variableId: obj.id,
                    active: obj.active
                });
            }));

            return cellContent;
        },

        setVariableListing: function(data) {
            var variablesFormatted = data.map(function(x) {
                return {
                    id: x.id,
                    description: x.title + " – units: " + x.units,
                    active: false
                };
            });
            this.variableStore.setData(variablesFormatted);
            this.variableGrid.set("store", this.variableStore);
        },
        hide: function() {
            domStyle.set(this.variableListingRoot, "display", "none");
        },
        show: function() {
            domStyle.set(this.variableListingRoot, "display", "block");
        },
        activateFirstVariable: function() {
            var first = this.variableStore.query()[0];
            first.active = true;
            this.variableStore.put(first);
            topic.publish(this.checkboxEvent, {
                datasetId: this.datasetId,
                variableId: first.id,
                active: first.active
            });
        },
        getActiveVariables: function() {
            return this.variableStore.query({
                "active": true
            });
        },
        getAllVariables: function() {
            return this.variableStore.query();
        }
    });
});
