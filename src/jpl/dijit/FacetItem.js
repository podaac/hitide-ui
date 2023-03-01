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
    "dojo/_base/fx",
    "dojo/fx/Toggler",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/FacetItem.html',
    "xstyle/css!./css/FacetItem.css",
    "jpl/data/Layers",
    "jpl/events/SearchEvent",
    "jpl/dijit/FacetValue"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, baseFx, Toggler, registry,
    _WidgetBase, _TemplatedMixin, template, css, Layers, SearchEvent, FacetValue) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        toggler: null,
        key: null,
        label: null,
        items: null,
        valueWidgets: null,
        fireEvent: true,
        inactiveIconClass: "fa-angle-down",
        activeIconClass: "fa-caret-down",

        constructor: function() {
            this.valueWidgets = [];
        },

        postCreate: function() {},

        startup: function() {
            this.setAttributes();
            this.initializeValueWidgets();

            // this.toggler = new Toggler({
            //     node: this.facetItemValuesContainer,
            //     showFunc: baseFx.fadeIn,
            //     hideFunc: baseFx.fadeOut
            // });
            // this.toggler.hide();
            this.hide();
        },

        setAttributes: function() {
            domAttr.set(this.facetItemKey, "innerHTML", this.label);
        },

        setIconClass: function(inactiveClass, activeClass) {
            this.inactiveIconClass = inactiveClass;
            this.activeIconClass = activeClass;
            this.hideByClass();
        },

        initializeValueWidgets: function() {
            for (var i = 0; i < this.items.length; i += 2) {
                var newValueWidget = new FacetValue({
                    label: this.items[i],
                    count: this.items[i + 1],
                    key: this.key,
                    fireEvent: this.fireEvent
                });
                newValueWidget.startup();
                domConstruct.place(newValueWidget.domNode, this.facetItemValuesContainer);
                this.valueWidgets.push(newValueWidget);
            }
        },
        getSelected: function() {
            return this.valueWidgets.filter(function(item) {
                return item.checked;
            });
        },
        updateValues: function(values) {
            var valueMap = {};
            for (var i = 0; i < values.length; i += 2) {
                var label = values[i];
                var count = values[i + 1];
                valueMap[label] = count;
            }
            for (var j = 0; j < this.valueWidgets.length; j++) {
                var valueWidget = this.valueWidgets[j];
                var count2 = valueMap[valueWidget.label] ? valueMap[valueWidget.label] : 0;
                valueWidget.setCountAndDisplay(count2);
            }
        },
        selectAll: function() {
            this.valueWidgets.map(function(x) {
                x.setChecked();
            });
        },
        show: function() {
            domStyle.set(this.facetItemValuesContainer, "display", "block");
            baseFx.fadeIn({
                node: this.facetItemValuesContainer,
                duration: 75
            }).play();
            domStyle.set(this.faCaretActive, "opacity", "1");
        },
        hide: function() {
            var facetItemValuesContainer = this.facetItemValuesContainer;
            baseFx.fadeOut({
                node: this.facetItemValuesContainer,
                duration: 75,
                onEnd: function() {
                    domStyle.set(facetItemValuesContainer, "display", "none");
                }
            }).play();
            domStyle.set(this.faCaretActive, "opacity", "0");
        },
        toggle: function() {
            if (domStyle.get(this.facetItemValuesContainer, "display") == "none") {
                this.show();
            } else {
                this.hide();
            }
        },
        toggleByClass: function() {
            if (domStyle.get(this.facetItemValuesContainer, "display") == "none") {
                this.showByClass();
            } else {
                this.hideByClass();
            }  
        },
        showByClass: function() {
            domStyle.set(this.facetItemValuesContainer, "display", "block");
            baseFx.fadeIn({
                node: this.facetItemValuesContainer,
                duration: 75
            }).play();
            domClass.add(this.faCaret, this.activeIconClass);
            domClass.remove(this.faCaret, this.inactiveIconClass);
        },
        hideByClass: function() {
            var facetItemValuesContainer = this.facetItemValuesContainer;
            baseFx.fadeOut({
                node: this.facetItemValuesContainer,
                duration: 75,
                onEnd: function() {
                    domStyle.set(facetItemValuesContainer, "display", "none");
                }
            }).play();
            domClass.remove(this.faCaret, this.activeIconClass);
            domClass.add(this.faCaret, this.inactiveIconClass);
        }
    });
});
