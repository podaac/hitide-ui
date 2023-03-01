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
    "dojo/fx/Toggler",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/FacetSelector.html',
    "xstyle/css!./css/FacetSelector.css",
    "jpl/data/Layers",
    "jpl/events/SearchEvent",
    "jpl/config/Config",
    "jpl/dijit/FacetItem"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, Toggler, registry,
    _WidgetBase, _TemplatedMixin, template, css, Layers, SearchEvent, Config, FacetItem) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        // facetIdLabelMap: {
        //     "DatasetSource-Sensor-LongName-Full": "ensor",
        //     "DatasetParameter-Variable-Full": "Parameter",
        //     "Dataset-Provider-ShortName": "Provider",
        //     "Collection-ShortName-Full": "Collection"
        // },


        constructor: function() {
            this.config = Config.getInstance();
            this.searchFacetMapping = this.config.hitide.searchFacetMapping;
            this.items = {}; // Need to initialize this list here since it would otherwise be shared globally
        },

        postCreate: function() {},

        startup: function() {
            // this.addFacetItem("Parameter", ["test1", "test2", "test_longer_string", "really long string shouldn't be this long"]);
            // this.addFacetItem("Sensor", ["I love", "lamp", "cheese"]);
            // this.addFacetItem("Provider", ["JPL", "NASA", "LPDAAC", "NASA", "JAXA", "CNES", "ESA", "GSFC"]);
            // this.addFacetItem("Collection", this.rStrs(30));
            // this.addFacetItem("Platform", this.rStrs(26));
        },

        rStrs: function(num) {
            var results = [];
            for (var j = 0; j < num; j++) {
                // Generate random string
                var randStr = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 10; i++) {
                    randStr += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                results.push(randStr);
            }
            return results;
        },


        addFacetItems: function(facetItems) {
            var keys = Object.keys(facetItems);
            for (var i = 0; i < keys.length; i++) {
                var facetItem = facetItems[keys[i]];
                var label = this.searchFacetMapping.hasOwnProperty(keys[i]) ? this.searchFacetMapping[keys[i]] : "UNDEFINED";
                this.addFacetItem(keys[i], label, facetItem);
            }

        },

        updateFacets: function(updatedFacets) {
            var keys = Object.keys(this.items);
            for (var i = 0; i < keys.length; i++) {
                var facetItem = this.items[keys[i]];
                facetItem.updateValues(updatedFacets[keys[i]]);
            }
        },

        addFacetItem: function(key, label, items) {
            var newFacetItem = new FacetItem({
                key: key,
                label: label,
                items: items
            });
            newFacetItem.startup();
            domConstruct.place(newFacetItem.domNode, this.facetSelectorItems);
            on(newFacetItem.facetItemKeyContainer, mouse.enter, function() {
                newFacetItem.show();
            });
            on(newFacetItem.facetItemKeyContainer, mouse.leave, function() {
                newFacetItem.hide();
            });
            this.items[key] = newFacetItem;
        },

        getSelectedFacets: function() {
            var keys = Object.keys(this.items);
            var selectedFacets = {};
            for (var i = 0; i < keys.length; i++) {
                var facetItem = this.items[keys[i]];
                var selected = facetItem.getSelected();
                if (selected.length > 0) {
                    selectedFacets[keys[i]] = selected;
                }
            }
            return selectedFacets;
        }
    });
});
