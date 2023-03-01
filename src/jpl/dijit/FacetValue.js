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
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/FacetValue.html',
    "xstyle/css!./css/FacetValue.css",
    "jpl/events/SearchEvent"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse,
    registry, _WidgetBase, _TemplatedMixin, template, css, SearchEvent) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        label: null,
        checked: false,
        count: 0,
        shown: true,
        key: null,
        fireEvent: true,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.checked = false;
            this.setAttributes();
            on(this.facetValueNode, "click", lang.hitch(this, this.checkboxChange));
            topic.subscribe(SearchEvent.prototype.REMOVE_FACET_REQUEST, lang.hitch(this, this.remove));
        },

        setAttributes: function() {
            if (this.count != "") {
                domAttr.set(this.labelNode, "innerHTML", this.label + " (" + this.count + ")");
            } else {
                domAttr.set(this.labelNode, "innerHTML", this.label);
            }
        },

        setCountAndDisplay: function(count) {
            this.count = count;
            if (count > 0 || this.checked) {
                domAttr.set(this.labelNode, "innerHTML", this.label + " (" + this.count + ")");
                this.show();
            } else {
                this.hide();
            }
        },

        show: function() {
            domStyle.set(this.facetValueNode, "display", "inherit");
            this.shown = true;
        },

        hide: function() {
            domStyle.set(this.facetValueNode, "display", "none");
            this.shown = false;
        },

        isVisible: function() {
            return this.shown;
        },

        setChecked: function() {
            this.checked = true;
            domClass.remove(this.checkbox, "fa-square-o");
            domClass.add(this.labelNode, "activeValueLabel");
            domClass.add(this.checkbox, "fa-check-square");
        },

        setUnchecked: function() {
            this.checked = false;
            domClass.remove(this.checkbox, "fa-check-square");
            domClass.remove(this.labelNode, "activeValueLabel");
            domClass.add(this.checkbox, "fa-square-o");
        },

        remove: function(message) {
            if (message.facetKey === this.key && message.facetValue === this.label) {
                this.setUnchecked();
                if (this.fireEvent) {
                    topic.publish(SearchEvent.prototype.REMOVE_FACET, {
                        facetKey: this.key,
                        facetValue: this.label
                    });
                }
            }
        },

        checkboxChange: function(evt) {
            if (!this.checked) {
                this.setChecked();
                if (this.fireEvent) {
                    topic.publish(SearchEvent.prototype.ADD_FACET, {
                        facetKey: this.key,
                        facetValue: this.label
                    });
                }
            } else {
                this.setUnchecked();
                if (this.fireEvent) {
                    topic.publish(SearchEvent.prototype.REMOVE_FACET, {
                        facetKey: this.key,
                        facetValue: this.label
                    });
                }
            }
        }
    });
});
