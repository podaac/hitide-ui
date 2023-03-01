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
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/SearchFacetTag.html',
    "jpl/events/SearchEvent"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, registry,
    _WidgetBase, _TemplatedMixin, template, SearchEvent) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        facetKey: null,
        facetValue: null,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.setAttributes();
            on(this.searchFacetTagRemove, "click", lang.hitch(this, this.onRemoveClick));
            // topic.subscribe(SearchEvent.prototype.REMOVE_FACET, lang.hitch(this, this.removeEvent));
        },

        setAttributes: function() {
            domAttr.set(this.searchFacetTagValue, "innerHTML", this.facetValue);
        },

        removeEvent: function(evt) {
            if (evt.facetValue === this.facetValue &&
                evt.facetKey === this.facetKey) {
                this.destroy();
            }
        },

        onRemoveClick: function(evt) {
            topic.publish(SearchEvent.prototype.REMOVE_FACET_REQUEST, {
                facetKey: this.facetKey,
                facetValue: this.facetValue
            });
        }
    });
});
