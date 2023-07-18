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
    "jpl/dijit/LegendsAndOpacityDataset",
    "jpl/events/SearchEvent",
    "jpl/events/GranuleSelectionEvent",
    "jpl/events/MapEvent",
    "jpl/events/LayerEvent",
    "jpl/events/NavigationEvent",
    "dojo/_base/fx",
    "dojo/fx/Toggler",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/LegendsAndOpacity.html',
    "xstyle/css!./css/LegendsAndOpacity.css"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse,
    coreFx, LegendsAndOpacityDataset, SearchEvent, GranuleSelectionEvent, MapEvent, LayerEvent, NavigationEvent,
    baseFx, Toggler, registry, _WidgetBase, _TemplatedMixin, template, css) {
    return declare([_WidgetBase, _TemplatedMixin], {
        id: "LegendsAndOpacity",
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        toggler: null,
        open: true,
        datasets: null,
        animationMs: 200,
        map: null,
        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.datasets = {};
            this.setAttributes();

            topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, this.loadMap));

            topic.subscribe(SearchEvent.prototype.ADD_DATASET, lang.hitch(this, this.addDataset));
            topic.subscribe(SearchEvent.prototype.REMOVE_DATASET, lang.hitch(this, this.removeDataset));

            topic.subscribe(GranuleSelectionEvent.prototype.VARIABLES_FETCHED, lang.hitch(this, this.handleVariablesFetched));
            topic.subscribe(GranuleSelectionEvent.prototype.ADD_GRANULE_FOOTPRINT, lang.hitch(this, this.handleAddGranuleFootprint));
            topic.subscribe(GranuleSelectionEvent.prototype.REMOVE_GRANULE_FOOTPRINT, lang.hitch(this, this.handleRemoveGranuleFootprint));
            topic.subscribe(GranuleSelectionEvent.prototype.ADD_GRANULE_PREVIEW, lang.hitch(this, this.handleAddGranulePreview));
            topic.subscribe(GranuleSelectionEvent.prototype.REMOVE_GRANULE_PREVIEW, lang.hitch(this, this.handleRemoveGranulePreview));
            topic.subscribe(GranuleSelectionEvent.prototype.GRANULES_SEARCH_COMPLETE, lang.hitch(this, this.show));

            topic.subscribe(LayerEvent.prototype.COLOR_PALETTE_HOVER, lang.hitch(this, this.handlePaletteHover));
            topic.subscribe(LayerEvent.prototype.COLOR_PALETTE_HOVER_EXIT, lang.hitch(this, this.handlePaletteHoverExit));

            on(this.labelDiv, "click", lang.hitch(this, this.toggle));
            on(this.noDatasetsMessage, ".tabSwitchLink:click", lang.hitch(this, function(evt) {
                topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                    tabID: evt.target.getAttribute("rel")
                });
            }));
            this.hide();
        },

        setAttributes: function() {
            this.setLabel();
        },

        loadMap: function() {
            this.map = registry.byId("mainSearchMap").equirectMap;
        },

        setLabel: function() {
            var num = Object.keys(this.datasets).length;
            var text = num !== 0 ? "Legends & Opacity  <span class='laoCount'>(" + num + ")</span>" : "Legends & Opacity";
            domAttr.set(this.label, "innerHTML", text);

            // Set default message
            if (num === 0) {
                domStyle.set(this.noDatasetsMessage, "display", "block");
            } else {
                domStyle.set(this.noDatasetsMessage, "display", "none");
            }
        },

        addDataset: function(message) {
            if (this.datasets[message.datasetId]) {
                this.removeDataset(message);
            }

            var laoDataset = new LegendsAndOpacityDataset({
                _id: Math.random(),
                datasetId: message.datasetId,
                datasetShortName: message.datasetShortName,
                datasetColor: message.datasetColor,
                map: this.map
            });
            laoDataset.startup();
            domConstruct.place(laoDataset.domNode, this.datasetsContainer);
            this.datasets[message.datasetId] = laoDataset;
            this.setLabel();
        },

        removeDataset: function(message) {
            var d = this.datasets[message.datasetId];
            if (d) {
                d.destroyRecursive();
                this.datasets[message.datasetId] = null;
                delete this.datasets[message.datasetId];
                this.setLabel();
            }
        },

        toggle: function() {
            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
        },

        show: function(duration) {
            // if (Object.keys(this.datasets).length === 0) {
            //     return;
            // }
            // if (this.open) {
            //     return;
            // }
            domStyle.set(this.datasetsContainer, "display", "block");
            // domStyle.set(this.datasetsContainer, "height", "");
            domClass.add(this.toggleButton, "fa-angle-double-down");
            domClass.remove(this.toggleButton, "fa-angle-double-up");
            // coreFx.wipeIn({
            //     node: this.datasetsContainer,
            //     duration: duration || this.animationMs,
            // }).play();
            // baseFx.fadeIn({
            //     node: this.datasetsContainer,
            //     duration: 200,
            // }).play();
            // domStyle.set(this.faCaretActive, "opacity", "1");
            this.open = true;
        },

        hide: function(duration) {
            if (!this.open) {
                return;
            }
            domStyle.set(this.datasetsContainer, "display", "none");
            domClass.add(this.toggleButton, "fa-angle-double-up");
            domClass.remove(this.toggleButton, "fa-angle-double-down");

            this.open = false;
        },
        handleVariablesFetched: function(message) {

            // code to modify imgVariables when there are mutlti groups
              if (this.datasets[message.datasetId]) {
                this.datasets[message.datasetId].updateVariables(message.imgVariables);
              }
            /*
            if ('multi_lon_lat' in message) {
              const newVariables = [];
              for (const groupName of message.multi_groups) {
                for (const imageVariable of message.imgVariables) {
                  const updatedVariable = { ...imageVariable };
                  updatedVariable.id = `${groupName}/${updatedVariable.id}`;
                  newVariables.push(updatedVariable);
                }
              }
              if (this.datasets[message.datasetId]) {
                this.datasets[message.datasetId].updateVariables(newVariables);
              }
            } else {
              if (this.datasets[message.datasetId]) {
                this.datasets[message.datasetId].updateVariables(message.imgVariables);
              }
            }*/
        },
        handleAddGranuleFootprint: function(message) {
            var laoDataset = this.datasets[message.granuleObj["Granule-DatasetId"]];
            if (laoDataset) {
                laoDataset.addGranuleFootprint(message);
            }
        },
        handleRemoveGranuleFootprint: function(message) {
            var laoDataset = this.datasets[message.granuleObj["Granule-DatasetId"]];
            if (laoDataset) {
                laoDataset.removeGranuleFootprint(message);
            }
        },
        handleAddGranulePreview: function(message) {
            var laoDataset = this.datasets[message.granuleObj["Granule-DatasetId"]];
            if (laoDataset) {
                laoDataset.addGranulePreview(message);
            }
        },
        handleRemoveGranulePreview: function(message) {
            var laoDataset = this.datasets[message.granuleObj["Granule-DatasetId"]];
            if (laoDataset) {
                laoDataset.removeGranulePreview(message);
            }
        },
        handlePaletteHover: function(message) {
            // {color: colorStr, value: value, x: evt.clientX, y: evt.clientY}
            domStyle.set(this.displayColor, "background-color", "rgb(" + message.color + ")");
            this.displayValue.innerHTML = message.value;
            domStyle.set(this.hoverValueDisplay, { top: (parseInt(message.y) - 55) + "px", left: (parseInt(message.x) - 20) + "px", display: "block" });
        },
        handlePaletteHoverExit: function() {
            domStyle.set(this.hoverValueDisplay, "display", "none");
        }
    });
});
