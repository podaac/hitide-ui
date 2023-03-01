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
    'dojo/text!./templates/LegendsAndOpacityDataset.html',
    "xstyle/css!./css/LegendsAndOpacityDataset.css",
    "jpl/dijit/LayerControl",
    "jpl/events/GranuleSelectionEvent",
    "jpl/events/LayerEvent"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, baseFx, Toggler, registry,
    _WidgetBase, _TemplatedMixin, template, css, LayerControl, GranuleSelectionEvent, LayerEvent) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: false,

        constructor: function(options) {
            this.variableLayers = {};
            this.datasetId = options.datasetId;
            this.datasetShortName = options.datasetShortName;
            this.datasetColor = options.datasetColor;
            this.map = options.map;
            this.isCollapsed = true;
            this.toggler = null;
            this.variableLayers = null;
            this.layersOpen = null;
            this.laodActive = false;
            this.variableControls = {};
            this.listenerArr = null;
        },

        postCreate: function() {},

        startup: function() {
            this.listenerArr = [];
            this.layersOpen = true;
            this.setAttributes();
            this.closeLayers();
            this.listenerArr.push(on(this.container, "click", lang.hitch(this, this.toggleOpen)));
            this.listenerArr.push(topic.subscribe(GranuleSelectionEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, lang.hitch(this, this.setLaodActive)));
        },

        setAttributes: function() {
            this.redisplay();
        },

        setLaodActive: function(message) {
            this.laodActive = (message.datasetId ? (message.datasetId === this.datasetId ? true : false) : false);
            this.redisplay();
        },

        redisplay: function() {
            domAttr.set(this.laodLabel, "innerHTML", this.datasetShortName + (this.laodActive ? " <span class='laodActive' style='color:" + this.datasetColor + "'>●</span>" : ""));
        },

        addLayer: function(layerData) {

        },

        removeLayer: function(layerId) {

        },

        toggleOpen: function() {
            if (this.layersOpen) {
                this.closeLayers();
            } else {
                this.openLayers();
            }
        },

        openLayers: function() {
            domStyle.set(this.layersContainer, "display", "block");
            this.layersOpen = true;
            domClass.add(this.layerControlsToggle, "fa-angle-down laodActiveDataset");
            domClass.remove(this.layerControlsToggle, "fa-angle-right");
        },

        closeLayers: function() {
            domStyle.set(this.layersContainer, "display", "none");
            this.layersOpen = false;
            domClass.add(this.layerControlsToggle, "fa-angle-right");
            domClass.remove(this.layerControlsToggle, "fa-angle-down laodActiveDataset");
        },

        // show: function() {
        //     console.log(this,"this showing")
        //     domStyle.set(this.container, "display", "block");
        // },
        // hide: function() {
        //     domStyle.set(this.container, "display", "none");
        // },
        updateVariables: function(variables) {

            ////////// BEGIN ////////////
            //doing a very bad hack to create a footprints control 
            this.addVariableControl({
                datasetId: this.datasetId,
                id: "footprints",
                title: "Granule Footprint Preview"
            }, false);
            //////////// END /////////////

            for (var i = 0; i < variables.length; ++i) {
                this.addVariableControl(variables[i], i > 0);
            }
        },
        addVariableControl: function(variableData, disable) {
            variableData.datasetId = this.datasetId;
            variableData.variableId = variableData.id;
            variableData.id = this.datasetId + "_" + variableData.variableId;
            variableData.variableTitle = variableData.title;
            variableData.title = "";
            variableData.startDisabled = disable;

            // make sure you're not re-creating a controller
            if (this.variableControls[variableData.id]) {
                // return;
                this.variableControls[variableData.id].destroy();
                delete this.variableControls[variableData.id];
            }
            var varController = new LayerControl(variableData, this.map);
            varController.startup();
            domConstruct.place(varController.domNode, this.layersContainer);
            this.variableControls[variableData.id] = varController;
        },
        addGranuleFootprint: function(message) {
            var controller = this.variableControls[this.datasetId + "_footprints"];
            if (controller) {
                controller.addFootprint(message);
            }
        },
        removeGranuleFootprint: function(message) {
            var controller = this.variableControls[this.datasetId + "_footprints"];
            if (controller) {
                controller.removeFootprint(message);
            }
        },
        addGranulePreview: function(message) {
            for (var variableControlId in this.variableControls) {
                if (this.variableControls.hasOwnProperty(variableControlId)) {
                    var controller = this.variableControls[variableControlId];
                    if (controller && controller.variableId != "footprints") {
                        controller.addPreview(message);
                    }
                }
            }
            // for (var variableId in message.granuleObj.variables) {
            //     if (message.granuleObj.variables.hasOwnProperty(variableId)) {
            //         var controller = this.variableControls[this.datasetId + "_" + variableId];
            //         if (controller) {
            //             controller.addPreview(message);
            //         }
            //     }
            // }
        },
        removeGranulePreview: function(message) {
            for (var variableControlId in this.variableControls) {
                if (this.variableControls.hasOwnProperty(variableControlId)) {
                    var controller = this.variableControls[variableControlId];
                    if (controller && controller.variableId != "footprints") {
                        controller.removePreview(message);
                    }
                }
            }
            // for (var variableId in message.granuleObj.variables) {
            //     if (message.granuleObj.variables.hasOwnProperty(variableId)) {
            //         var controller = this.variableControls[this.datasetId + "_" + variableId];
            //         if (controller) {
            //             controller.removePreview(message);
            //         }
            //     }
            // }
        },
        destroy: function() {
            this.inherited(arguments);
            // for(var variableId in this.variableControls) {
            //     if(this.variableControls.hasOwnProperty(layerControl)) {
            //         this.variableControls[variableId].clearMapLayers();
            //     }
            // }
            for (var i = 0; i < this.listenerArr.length; ++i) {
                this.listenerArr[i].remove();
            }
        }

        // show: function() {
        //     domStyle.set(this.facetItemValuesContainer, "display", "block");
        //     baseFx.fadeIn({
        //         node: this.facetItemValuesContainer,
        //         duration: 75,
        //     }).play();
        //     domStyle.set(this.faCaretActive, "opacity", "1");
        // },
        // hide: function() {
        //     var facetItemValuesContainer = this.facetItemValuesContainer;
        //     baseFx.fadeOut({
        //         node: this.facetItemValuesContainer,
        //         duration: 75,
        //         onEnd: function() {
        //             domStyle.set(facetItemValuesContainer, "display", "none");
        //         }
        //     }).play();
        //     domStyle.set(this.faCaretActive, "opacity", "0");
        // }
    });
});
