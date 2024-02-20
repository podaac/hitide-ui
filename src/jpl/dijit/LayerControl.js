define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/touch",
    "dojo/request/xhr",
    "dojo/_base/array",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/LayerControl.html',
    "xstyle/css!./css/LayerControl.css",
    "jpl/data/Layers",
    "jpl/events/LayerEvent",
    "jpl/events/MapEvent",
    "jpl/utils/MapUtil",
    "jpl/utils/AnimationUtil",
    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "jpl/dijit/ui/AlertDialog",
    "jpl/config/Config",
    "esri/geometry/Extent"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, touch, xhr, array, _WidgetBase,
    _TemplatedMixin, template, css, Layers, LayerEvent, MapEvent, MapUtil, AnimationUtil,
    HorizontalSlider, HorizontalRule, HorizontalRuleLabels, AlertDialog, Config, Extent) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: false,

        constructor: function(layerData, map) {
            this.config = Config.getInstance();
            this.map = map;
            this.layer = layerData;
            this.layerTitle = this.layer.variableId;
            this.layerSubtitle = this.layer.variableTitle;
            this.variableId = this.layer.variableId;
            this.layerDict = {};
            this.paletteArr = [];
            this.isCollapsed = true;
            this.legendVisible = false;
            this.layerHighlighted = false;
            this.isVisible = !this.layer.startDisabled;
            this.footprintsMapLayer = null;
            this.previewsMapLayer = null;
        },

        postCreate: function() {},

        startup: function() {
            var _context = this;
            this.listenerArr = [];

            // set text
            this.myLayerTitle.innerHTML = this.layerTitle;
            this.myLayerSubtitle.innerHTML = this.layerSubtitle;

            // initialize slider
            this.createTransparencySlider();

            // initialize colorbar
            this.createColorbar();

            // init map layers
            this.footprintsMapLayer = MapUtil.prototype.createGraphicsLayer();
            this.previewsMapLayer = MapUtil.prototype.createImageLayer();
            MapUtil.prototype.addMapImageLayer(this.footprintsMapLayer, this.map);
            MapUtil.prototype.addMapImageLayer(this.previewsMapLayer, this.map);

            // check if we should be disabled
            if (!this.isVisible) {
                this.hideLayer({ layer: this.layer });
            }

            // set up more listeners
            this.listenerArr.push(topic.subscribe(LayerEvent.prototype.SHOW_LAYER, lang.hitch(this, this.showLayer)));
            this.listenerArr.push(topic.subscribe(LayerEvent.prototype.HIDE_LAYER, lang.hitch(this, this.hideLayer)));
            this.listenerArr.push(topic.subscribe(LayerEvent.prototype.CHANGE_OPACITY, lang.hitch(this, this.changeLayerOpacity)));

            // this.listenerArr.push(on(this.myLayerTitle, "click", lang.hitch(this, this.toggleCollapsed)));
            // this.listenerArr.push(on(this.btnMyLayerCollapse, "click", lang.hitch(this, this.toggleCollapsed)));
            this.listenerArr.push(on(this.myLayerContainerToggle, "click", lang.hitch(this, this.toggleCollapsed)));
            this.listenerArr.push(on(this.myLayerToggleBox, "click", lang.hitch(this, this.toggleBoxClicked)));

            // Open if default visible
            if (this.isVisible && this.variableId !== "footprints") {
                var evt = { target: { id: "" } };
                this.toggleCollapsed(evt)
            }
        },

        changeLayerOpacity: function(evt) {
            if (evt.layer.id === this.layer.id) {
                MapUtil.prototype.changeLayerOpacity(this.footprintsMapLayer, evt.opacity);
                MapUtil.prototype.changeLayerOpacity(this.previewsMapLayer, evt.opacity);
            }
        },

        createTransparencySlider: function(sliderValue) {
            if (typeof sliderValue !== 'number') {
                sliderValue = 100;
            }

            var sliderWidget = new HorizontalSlider({
                id: "slider_" + this.layer.id,
                name: "slider_" + this.layer.id,
                value: sliderValue,
                minimum: 0,
                maximum: 100,
                showButtons: false,
                discreteValues: 21,
                intermediateChanges: true
            }, this.sliderNode);

            sliderWidget.startup();

            on(sliderWidget, "change", lang.hitch(this, function(value) {
                var opacityValue = value / 100;
                topic.publish(LayerEvent.prototype.CHANGE_OPACITY, {
                    "layer": this.layer,
                    "opacity": opacityValue
                });
            }));
        },

        createColorbar: function() {
            if (this.variableId == "footprints") { // hack around for now
                domConstruct.destroy(this.colorbarContainer);
            } else {
                var _context = this;
                var url = this.config.hitide.externalConfigurables.paletteService + "/" + this.palette + ".json";
                xhr.get(url, {
                    handleAs: "json",     
                    headers: {
                        "X-Requested-With": null
                    },
                    method: "get",
                    withCredentials: false
                }).then(function(success) {
                        _context.paletteArr = success.Palette.values.value;
                        _context.drawColorbar(_context.paletteArr);
                    },
                    function(err) {
                        console.log('FAILED TO GET PALETTE', err)
                    });
            }

        },

        drawColorbar: function(paletteArr) {
            if (this.colorbarCanvas) {
                var canvasHeight = 20; // canvas is 20px tall TODO - not hardcode
                var canvasWidth = paletteArr.length;
                this.colorbarCanvas.setAttribute('width', canvasWidth);
                this.colorbarCanvas.setAttribute('height', canvasHeight);
                var context = this.colorbarCanvas.getContext('2d');

                // paint colors onto the canvas
                for (var i = 0; i < paletteArr.length; ++i) {
                    var color = this.rgbToHex(paletteArr[i].color);
                    context.beginPath();
                    context.moveTo(i, 0);
                    context.lineTo(i, canvasHeight - 1);
                    context.lineWidth = 1;
                    context.strokeStyle = color;
                    context.stroke();
                }

                // update labels
                this.minLabel.innerHTML = this.layer.min;
                this.maxLabel.innerHTML = this.layer.max;
                this.midLabel.innerHTML = this.layer.units;

                this.listenerArr.push(on(this.colorbarCanvas, "mousemove", lang.hitch(this, this.handlePaletteMouseOver)));
                this.listenerArr.push(on(this.colorbarCanvas, "mouseout", lang.hitch(this, this.handlePaletteMouseOut)));
            }
        },

        flyToView: function(message) {
            MapUtil.prototype.setMapExtent(message.xmin, message.ymin, message.xmax, message.ymax, this.map);
        },

        showLayer: function(evt) {
            if (evt.layer.id === this.layer.id) {
                MapUtil.prototype.showLayer(this.footprintsMapLayer);
                MapUtil.prototype.showLayer(this.previewsMapLayer);

                this.isVisible = true;
                domClass.remove(this.myLayerToggleBox, "fa-eye-slash");
                domClass.add(this.myLayerToggleBox, "fa-eye");
            }
        },

        hideLayer: function(evt) {
            if (evt.layer.id === this.layer.id) {
                MapUtil.prototype.hideLayer(this.footprintsMapLayer);
                MapUtil.prototype.hideLayer(this.previewsMapLayer);

                this.isVisible = false;
                domClass.remove(this.myLayerToggleBox, "fa-eye");
                domClass.add(this.myLayerToggleBox, "fa-eye-slash");
            }
        },

        toggleBoxClicked: function(evt) {
            if (!this.isVisible) {
                topic.publish(LayerEvent.prototype.SHOW_LAYER, {
                    "layer": this.layer
                });
            } else {
                topic.publish(LayerEvent.prototype.HIDE_LAYER, {
                    "layer": this.layer
                });
            }
        },

        toggleCollapsed: function(evt) {
            if (evt.target.id === "toggleBox") {
                return;
            }
            if (this.isCollapsed) {
                domStyle.set(this.myLayerControlsContainer, "display", "block");
                domClass.remove(this.myLayerContainer, "collapsed");
                domClass.remove(this.btnMyLayerCollapse, "fa-angle-right")
                domClass.add(this.btnMyLayerCollapse, "btnMyLayerCollapsed");
                domClass.add(this.btnMyLayerCollapse, "fa-angle-down");
                this.isCollapsed = false;
                // domClass.add(this.btnMyLayerCollapse, "fa-caret-down");
            } else {
                domStyle.set(this.myLayerControlsContainer, "display", "none");
                domClass.add(this.myLayerContainer, "collapsed");
                domClass.remove(this.btnMyLayerCollapse, "fa-angle-down");
                domClass.remove(this.btnMyLayerCollapse, "btnMyLayerCollapsed");
                domClass.remove(this.btnMyLayerCollapse, "fa-angle-down");
                domClass.add(this.btnMyLayerCollapse, "fa-angle-right")
                this.isCollapsed = true;
                // domClass.remove(this.btnMyLayerCollapse, "fa-caret-down");
            }
        },

        toggleLegend: function(evt) {
            if (this.legendVisible) {
                domClass.add(this.legendContainer, "hidden");
                this.legendVisible = false;
            } else {
                domClass.remove(this.legendContainer, "hidden");
                this.legendVisible = true;
            }
        },

        constructImagePreview: function(obj) {
            if(obj.granuleObj.source === 'cmr'){
                var granuleName = obj.granuleObj["Granule-Name"];
                var variableName = this.variableId;
                var imageFilename = calculateImageFilename(granuleName, variableName);
                var relatedUrls = obj.granuleObj.umm.RelatedUrls;
                var objectURL
                for(var i=0; i < relatedUrls.length; i++){
                    objectURL = relatedUrls[i]['URL'];
                    if(objectURL.includes(imageFilename)){
                        var currentExtent = this.translateExtent(obj.granuleObj["Granule-Extent"])

                        // Calculate the new extent properties based on the offset
                        var newExtent = new Extent({
                            xmin: currentExtent.xmin ,
                            ymin: currentExtent.ymin ,
                            xmax: currentExtent.xmax ,
                            ymax: currentExtent.ymax ,
                            spatialReference: currentExtent.spatialReference
                        });
                        
                        if(obj['global_grid'] === true){
                            newExtent = new Extent({
                                xmin: -180 ,
                                ymin: -90 ,
                                xmax: 180 ,
                                ymax: 90 ,
                                spatialReference: currentExtent.spatialReference
                            });
                        }

                        return MapUtil.prototype.createMapImage(objectURL, newExtent);
                    }
                }
            }
            else{
                var url = obj.granuleObj["Granule-Image-Root-URL"] + "/" + this.variableId + ".png";
                return MapUtil.prototype.createMapImage(url, this.translateExtent(obj.granuleObj["Granule-Extent"]));
            }
            // return MapUtil.prototype.createMapImage(obj.granuleObj["variables"][this.variableId], this.translateExtent(obj.granuleObj["Granule-Extent"]));
        },
        constructFootprintDisplay: function(obj) {
            return MapUtil.prototype.createGraphicFromWKTString(obj.granuleObj["Granule-Footprint"], this.map, obj.border, obj.fill);
        },

        addFootprint: function(message) {
            var mapLayer = this.constructFootprintDisplay(message);
            MapUtil.prototype.addGraphicToLayer(this.footprintsMapLayer, mapLayer);
            this.layerDict[message.granuleObj["Granule-Id"]] = mapLayer;
            // if(this.isVisible) {
            //     var extent = this.translateExtent(message.granuleObj["Granule-Extent"]);
            //     this.flyToView(extent);
            // }
        },
        removeFootprint: function(message) {
            var mapLayer = this.layerDict[message.granuleObj["Granule-Id"]];
            MapUtil.prototype.removeGraphicFromLayer(this.footprintsMapLayer, mapLayer);
            delete this.layerDict[message.granuleObj["Granule-Id"]];
        },

        addPreview: function(message) {
            var image = this.constructImagePreview(message);
            if(!image) {
                console.warn(
                    "Could not find preview image\n",
                    "granule: " + message.granuleObj["Granule-Name"] + "\n",
                    "variable: " + this.variableId + "\n");
                return;
            }

            // add the image to the map layer
            MapUtil.prototype.addImageToMapLayer(this.previewsMapLayer, image);

            // set up an error listener
            // image.getNode().onerror = function() {
            //     _context.handleImageLoadError();
            // };

            // store the image for reference
            this.layerDict[message.granuleObj["Granule-Id"]] = image;

            // TODO - FIX THE THING SO WE DON"T NEED THIS
            if (this.isVisible) {
                MapUtil.prototype.hideLayer(this.previewsMapLayer);
                MapUtil.prototype.showLayer(this.previewsMapLayer);
            }
        },
        removePreview: function(message) {
            var image = this.layerDict[message.granuleObj["Granule-Id"]];
            MapUtil.prototype.removeImageFromMapLayer(this.previewsMapLayer, image);
            delete this.layerDict[message.granuleObj["Granule-Id"]];
        },
        translateExtent: function(extentStr) {
            return MapUtil.prototype.getExtentFromWKT(extentStr, this.map);

            // KEEP UNTIL WE ARE 100% SURE WKT IS FINAL
            // var tempExtent = extentStr.split(":");
            // if (tempExtent.length == 2) {
            //     // south and north from first and -180 to 180 for W/E
            //     var tempExtentA = tempExtent[0].split(",");
            //     // var tempExtentB = tempExtent[1].split(",");
            //     return {
            //         'xmin': -180.0,
            //         'ymin': parseFloat(tempExtentA[1]),
            //         'xmax': 180.0,
            //         'ymax': parseFloat(tempExtentA[3]),
            //         'spatialReference': {
            //             'wkid': 4326
            //         }
            //     };
            // } else {
            //     tempExtent = tempExtent[0].split(",");
            //     return {
            //         'xmin': parseFloat(tempExtent[0]),
            //         'ymin': parseFloat(tempExtent[1]),
            //         'xmax': parseFloat(tempExtent[2]),
            //         'ymax': parseFloat(tempExtent[3]),
            //         'spatialReference': {
            //             'wkid': 4326
            //         }
            //     };
            // }
        },
        rgbToHex: function(rgb) {
            var rgbArr = rgb.split(",");
            return "#" + ((1 << 24) + (parseInt(rgbArr[0]) << 16) + (parseInt(rgbArr[1]) << 8) + parseInt(rgbArr[2])).toString(16).slice(1);
        },

        handlePaletteMouseOver: function(evt) {
            var target = evt.target || evt.srcElement;
            var rect = target.getBoundingClientRect();
            var x = Math.ceil(evt.clientX - rect.left);
            if (x < this.paletteArr.length) {
                // get the value range
                // var value = parseFloat(this.paletteArr[x].scaleIndex).toExponential(3) + " " + this.layer.units;
                var min = parseFloat(this.layer.min);
                var max = parseFloat(this.layer.max);
                var scale = parseFloat(this.paletteArr[x].scaleIndex);
                var value = (min + ((max - min) * scale)).toFixed(2) + " " + this.layer.units;

                // get the color from the canvas for display
                var ctx = this.colorbarCanvas.getContext('2d');
                var color = ctx.getImageData(x, 2, 1, 1).data;
                var colorStr = color[0] + "," + color[1] + "," + color[2];

                topic.publish(LayerEvent.prototype.COLOR_PALETTE_HOVER, {
                    color: colorStr,
                    value: value,
                    x: evt.clientX,
                    y: evt.clientY
                });
            }
        },
        handlePaletteMouseOut: function(evt) {
            topic.publish(LayerEvent.prototype.COLOR_PALETTE_HOVER_EXIT);
        },
        handleImageLoadError: function(evt) {
            new AlertDialog({
                alertTitle: "Variable Preview Error",
                alertMessage: "The preview for <b>" + this.variableId + "</b> failed to load. Sorry for the inconvenience."
            }).startup();
        },
        destroy: function() {
            this.inherited(arguments);
            MapUtil.prototype.removeMapImageLayer(this.footprintsMapLayer, this.map);
            MapUtil.prototype.removeMapImageLayer(this.previewsMapLayer, this.map);
            delete this.layerDict;
            for (var i = 0; i < this.listenerArr.length; ++i) {
                this.listenerArr[i].remove();
            }
        }
    });
});

function calculateImageFilename(granuleName, variableName) {
    var variableNameWithDots = variableName.replaceAll('/', '.').replaceAll(' ', '_');
    if (variableNameWithDots[0] !== '.') {
        variableNameWithDots = '.' + variableNameWithDots;
    }
    return granuleName + variableNameWithDots + ".png";
}