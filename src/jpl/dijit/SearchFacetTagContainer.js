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
    'dojo/text!./templates/SearchFacetTagContainer.html',
    "jpl/events/SearchEvent",
    "jpl/dijit/SearchFacetTag"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, registry,
    _WidgetBase, _TemplatedMixin, template, SearchEvent, SearchFacetTag) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        facetKeys: null,
        searchFacetMapping: null,
        facetKeyValues: {},
        facetKeyGroups: {},

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            topic.subscribe(SearchEvent.prototype.REMOVE_FACET, lang.hitch(this, this.removeFacet));
        },

        addFacetItems: function(facets) {
            this.facetKeys = Object.keys(facets);
            for (var i = 0; i < this.facetKeys.length; i++) {
                var key = this.facetKeys[i];
                this.facetKeyValues[key] = [];
                var groupEl = domConstruct.toDom("<div class='searchFacetTagGroup'></div>");
                this.facetKeyGroups[key] = groupEl;
                domConstruct.place(groupEl, this.tagsContainer);
                this.redisplayGroup(key);
            }
        },

        addFacet: function(message) {
            this.facetKeyValues[message.facetKey].push(message.facetValue);
            this.redisplayGroup(message.facetKey);
        },

        redisplayGroup: function(facetKey) {
            var group = this.facetKeyGroups[facetKey];
            domAttr.set(group, "innerHTML", "");
            // If group has 0 items, hide the whole thing
            if (this.facetKeyValues[facetKey].length === 0) {
                domStyle.set(group, "display", "none");
            } else {
                // Add facet tags
                var title = domConstruct.toDom("<span class='searchFacetTagTitle'>" + this.searchFacetMapping[facetKey] + ": </span>");
                domConstruct.place(title, group);
                for (var i = 0; i < this.facetKeyValues[facetKey].length; i++) {
                    var facetTag = new SearchFacetTag({
                        facetKey: facetKey,
                        facetValue: this.facetKeyValues[facetKey][i]
                    });
                    domConstruct.place(facetTag.domNode, group);
                    facetTag.startup();
                    // Add an "or" if not last one
                    if (i !== this.facetKeyValues[facetKey].length - 1) {
                        domConstruct.place(domConstruct.toDom("<span class='facetTagOr no-selection'>or</span>"), group);
                    }
                }
                domStyle.set(group, "display", "block");
            }
        },

        removeFacet: function(message) {
            // Remove Facet
            var i = this.facetKeyValues[message.facetKey].indexOf(message.facetValue);
            if (i !== -1) {
                this.facetKeyValues[message.facetKey].splice(i, 1);
            }
            // See if Facet group should be hidden
            this.redisplayGroup(message.facetKey);
        }
    });
});
