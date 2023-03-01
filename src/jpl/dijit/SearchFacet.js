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
    'dojo/text!./templates/SearchFacet.html',
    "jpl/dijit/SearchFacetItem",
    "jpl/utils/AnimationUtil"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, Toggler, registry,
    _WidgetBase, _TemplatedMixin, template, SearchFacetItem, AnimationUtil) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        toggler: null,
        label: null,
        open: false,
        items: null,
        itemsListing: null,


        constructor: function(layer) {
            //this.layer = layer;
            this.items = {}; // Need to initialize this list here since it would otherwise be shared globally
        },

        postCreate: function() {},

        startup: function() {
            this.mapDijit = registry.byId("mainSearchMap");

            // Create facet items
            this.createFacetItems();

            this.setAttributes();

            on(this.searchFacetLabel, "click", lang.hitch(this, this.toggle));
            on(this.searchFacetToggle, "click", lang.hitch(this, this.toggle));

            this.toggler = new Toggler({
                node: this.searchFacetContent,
                showFunc: coreFx.wipeIn,
                hideFunc: coreFx.wipeOut
            });
            this.toggler.hide();
        },

        setAttributes: function() {
            this.setLabelItemCount();
        },

        createFacetItems: function() {
            for (var i = 0; i < this.itemsListing.length; i += 2) {
                var item = this.itemsListing[i];
                var newSearchFacetItem = new SearchFacetItem({
                    label: item,
                    checked: false,
                    facetKey: this.id,
                    facetGrouping: this.facetGrouping,
                    count: this.itemsListing[i + 1]
                });
                newSearchFacetItem.startup();
                domConstruct.place(newSearchFacetItem.domNode, this.searchFacetContent);
                this.items[item] = newSearchFacetItem;
            }
        },

        setLabelItemCount: function() {
            domAttr.set(this.searchFacetLabel, "innerHTML", this.label + " (" +
                Object.keys(this.items).filter(lang.hitch(this, function(x) {
                    return this.items[x].isVisible();
                })).length + ")");
        },

        toggle: function(evt) {
            if (this.open) {
                this.toggleClosed();
            } else {
                this.toggleOpen();
            }
        },

        toggleOpen: function() {
            this.toggler.show();
            domClass.toggle(this.searchFacetToggle, "toggle-open");
            this.open = true;
        },

        toggleClosed: function() {
            this.toggler.hide();
            domClass.toggle(this.searchFacetToggle, "toggle-open");
            this.open = false;
        }
    });
});
