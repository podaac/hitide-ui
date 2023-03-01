define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-attr",
	"dojo/hash",
	"dojo/io-query",
	"dojo/json",
	"dojo/topic",
    "dojo/query",
	"jpl/data/Layers",
    "jpl/config/Config",
	"jpl/events/LayerEvent",
	"jpl/events/MapEvent",
    "jpl/events/DateEvent",
    "jpl/utils/MakeSingletonUtil",
    "dojo/_base/sniff",
    "dojo/has"
], function (declare, lang, array, domAttr, hash, ioQuery, JSON, topic, query, Layers, Config, LayerEvent, MapEvent, DateEvent, MakeSingletonUtil, sniff, has) {
	return MakeSingletonUtil(
		declare(null, {
			mapstate: {
				v: "0.1", // version of the state object
                x: "",
                y: "",
                z: "", //(z)oom
                p: "", //(p)rojection
                d: "", //format: YYYY-MM-DD-HHMM
				l: [] //layer - [[0]productLabel, [1]visible, [2]opacity, [3]crid]
			},
            layersloadedequirect: 0,
            layersloadedspole: 0,
            layersloadednpole: 0,
            fullyrestored: false,
			constructor: function () {
				try {
					var query = ioQuery.queryToObject(hash());
                    //Check for valid query
                    if (!query) throw "No query found";
                    if (typeof query !== "object") throw "Query object is invalid, not processing";
                    this.loadmapstate = query;
				} catch(err) {
                    console.log(err);
				}
				// topic.subscribe(MapEvent.prototype.MAP_MOVED, lang.hitch(this, this.mapMoved));
				// topic.subscribe(MapEvent.prototype.MAP_READY, lang.hitch(this, this.loadMapLink));
    //             //Layers can't be selected until that specific layer control has been loaded.
    //             topic.subscribe(LayerEvent.prototype.ADD_TO_MY_DATA, lang.hitch(this, this.saveLayerControlCountAndLoadMapLink));
    //             topic.subscribe(LayerEvent.prototype.LAYER_CONTROL_LOADED, lang.hitch(this, this.saveLayerControlCountAndLoadMapLink));
    //             topic.subscribe(LayerEvent.prototype.CESIUM_LAYER_LOADED, lang.hitch(this, this.saveLayerControlCountAndLoadMapLink));

				// topic.subscribe(LayerEvent.prototype.SHOW_LAYER, lang.hitch(this, this.showLayer));
				// topic.subscribe(LayerEvent.prototype.HIDE_LAYER, lang.hitch(this, this.hideLayer));
				// topic.subscribe(LayerEvent.prototype.CHANGE_OPACITY, lang.hitch(this, this.changeLayerOpacity));

    //             topic.subscribe(DateEvent.prototype.DATETIME_RANGE_UPDATED, lang.hitch(this, this.updateDate));
    //             topic.subscribe(LayerEvent.prototype.LAYER_CRID_CHANGED, lang.hitch(this, this.changeLayerCrid));
			},
            saveLayerControlCountAndLoadMapLink:function(evt) {
                var configSingleton = Config.getInstance();
                if(evt.projection === configSingleton.projection.EQUIRECT) {
                    this.layersloadedequirect++;
                } else if(evt.projection === configSingleton.projection.S_POLE) {
                    this.layersloadedspole++;
                } else if(evt.projection === configSingleton.projection.N_POLE) {
                    this.layersloadednpole++;
                }
                this.loadMapLink(evt);
            },
			loadMapLink: function (evt) {
                var layersSingleton = Layers.getInstance();
                // the events ADD_TO_MY_DATA, LAYER_CONTROL_LOADED, and CESIUM_LAYER_LOADED all contribute to the sum here.
                // loading will only happens after all layers have been properly added. Cesium only loads equirect maps and
                // considers the basemap separate, hence the plus 1.

                // In safari, the layers are getting counted differently for some reason.
                var targetLayerCount = has("safari") ? (layersSingleton.centerLayerList.length * 2) : (layersSingleton.centerLayerList.length * 3 + 1);
                if (this.layersloadedequirect == targetLayerCount &&
                    this.layersloadedspole == layersSingleton.southLayerList.length * 2 &&
                    this.layersloadednpole == layersSingleton.northLayerList.length * 2) {
                    var mapstate = this.loadmapstate;
                    if (mapstate.v != null) {
                        if (mapstate.v === "0.1") {
                            this._loadMapLinkV0_1(evt, mapstate);
                        } else {
                            topic.publish(MapEvent.prototype.MAPLINK_LOADED, {mapstate: null});
                            console.log("Unknown map link version, not processing");
                        }
                    } else {
                        topic.publish(MapEvent.prototype.MAPLINK_LOADED, {mapstate: null});
                    }
                    this.fullyrestored = true;
                }
			},
			_loadMapLinkV0_1: function (evt, mapstate) {
                var layersSingleton = Layers.getInstance();
                var configSingleton = Config.getInstance();
                //Check for valid x, y, (z)oom, and (p)rojection
                try {
                    array.forEach(["x","y","z"], lang.hitch(this, function(state) {
                        if (isNaN(mapstate[state])) {
                            throw "Bad or no " + state + " value given, not processing";
                        }
                    }));
                    var availableProjections = Object.keys(configSingleton.projection);
                    if (array.every(availableProjections, function(projection) {return mapstate.p !== configSingleton.projection[projection];})) {
                        throw "Invalid or unavailable projection"
                    }
//                     x,y,z,p seem valid - change projection and center map
                    var projectionLabel = "";
                    if(mapstate.p === configSingleton.projection.EQUIRECT) {
                       projectionLabel = "global";
                    } else if(mapstate.p === configSingleton.projection.S_POLE) {
                       projectionLabel = "southPole";
                    } else if(mapstate.p === configSingleton.projection.N_POLE) {
                       projectionLabel = "northPole";
                    }
                    topic.publish(MapEvent.prototype.CHANGE_PROJECTION, {projectionLabel: projectionLabel});
                    topic.publish(MapEvent.prototype.CENTER_ZOOM_MAP_AT, {
                    x: mapstate.x,
                    y: mapstate.y,
                    zoom: mapstate.z,
                    projection: mapstate.p
                    });
                } catch (err) {
                    console.log(err);
                }
                //Check for valid date setting
                if (mapstate.d) {
                    try {
                        var parsedDateTime = mapstate.d.split("T");
                        var parsedDate = parsedDateTime[0].split("-");
                        var parsedTime = parsedDateTime[1].split(":");
                        var newDate = new Date(Date.UTC(parsedDate[0], parsedDate[1]-1, parsedDate[2], parsedTime[0], parsedTime[1], parsedTime[2]));
                        if (!isNaN(newDate.valueOf())) {
                            topic.publish(DateEvent.prototype.SELECT_START_DATE, newDate);
                        } else {
                            throw "Bad Date"
                        }
                    } catch(err) {
                        console.log("Invalid date - must be in YYYY-MM-DD-HHMM format");
                        mapstate.d = null;
                    }
                }
                //Check for valid layers states
                if (mapstate.l) {
                    try {
                        var layers = typeof mapstate.l === "string" ? [mapstate.l] : mapstate.l;
                        array.forEach(layers, function (layerState) {
                            layerState = layerState.split(",");
                            var layer = layersSingleton.getLayerByProductLabel(layerState[0]);
                            if (!layer) throw "Layer specified doesn't exist";
                            if (layerState[1] === "true") {
                                topic.publish(LayerEvent.prototype.SHOW_LAYER, {layer: layer});
                            } else if (layerState[1] === "false") {
                                topic.publish(LayerEvent.prototype.HIDE_LAYER, {layer: layer});
                            } else {
                                throw "Layer visibility must be indicated - true or false"
                            }
                            if (!isNaN(layerState[2])) {
                                topic.publish(LayerEvent.prototype.CHANGE_OPACITY, {
                                    layer: layer,
                                    opacity: layerState[2]
                                });
                            } else if (layerState[2] && isNaN(layerState[2])) {
                                throw "Layer opacity must be a numeric value"
                            }
                            if(layerState[3]) {
                               topic.publish(LayerEvent.prototype.LAYER_CRID_CHANGED, {
                                   productLabel: layer.productLabel,
                                   cridName: layerState[3]
                               })
                            };
                        })
                    } catch (err) {
                        console.log(err);
                    }
                }
                topic.publish(MapEvent.prototype.MAPLINK_LOADED, {mapstate: mapstate});
			},
			mapMoved: function (evt) {
                this.mapstate.x = parseFloat(evt.extent.getCenter().x.toPrecision(8));
                this.mapstate.y = parseFloat(evt.extent.getCenter().y.toPrecision(8));
                this.mapstate.z = evt.zoom;
                this.mapstate.p = evt.projection;
				this.publishMapState();
			},
			showLayer: function(evt) {
                if (array.every(this.mapstate.l, function (layer) {
                        return layer[0] !== evt.layer.productLabel;
                    })) {
                    this.mapstate.l.push([evt.layer.productLabel]);
                }
                array.some(this.mapstate.l, function(layer){
                    if (layer[0] === evt.layer.productLabel) {
                        layer[1] = true;
                        return true;
                    }
                });
				this.publishMapState();
			},
			hideLayer: function(evt) {
                if (array.every(this.mapstate.l, function (layer) {
                        return layer[0] !== evt.layer.productLabel;
                    })) {
                    this.mapstate.l.push([evt.layer.productLabel]);
                }
                array.some(this.mapstate.l, function(layer){
                    if (layer[0] === evt.layer.productLabel) {
                        layer[1] = false;
                        return true;
                    }
                });
                this.publishMapState();
			},
			changeLayerOpacity: function(evt) {
                if (array.every(this.mapstate.l, function (layer) {
                        return layer[0] !== evt.layer.productLabel;
                    })) {
                    this.mapstate.l.push([evt.layer.productLabel]);
                }
                array.some(this.mapstate.l, function(layer){
                    if (layer[0] === evt.layer.productLabel) {
                        //Round to 2 decimal places (without trailing zeroes)
                        layer[2] = +(Math.round(evt.opacity + "e+2")  + "e-2");
                        return true;
                    }
                });
                if(!evt.changing) {
                    this.publishMapState();
                }
            },
            updateDate: function(evt) {
                //Format date into YYYY-MM-DD-HHMM
                var year = evt.startDate.getUTCFullYear();
                var month = (evt.startDate.getUTCMonth()+1) < 10 ? "0" + (evt.startDate.getUTCMonth()+1).toString() : (evt.startDate.getUTCMonth()+1);
                var date = evt.startDate.getUTCDate() < 10 ? "0" + evt.startDate.getUTCDate().toString() : evt.startDate.getUTCDate();
                var hours = evt.startDate.getUTCHours() < 10 ? "0" + evt.startDate.getUTCHours().toString() : evt.startDate.getUTCHours();
                var minutes = evt.startDate.getUTCMinutes() < 10 ? "0" + evt.startDate.getUTCMinutes().toString() : evt.startDate.getUTCMinutes();
                this.mapstate.d = year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":00";
                this.publishMapState();
            },
             changeLayerCrid: function(evt) {
                 array.forEach(this.mapstate.l, lang.hitch(this, function(layer, i) {
                     if(layer[0] === evt.productLabel) {
                         this.mapstate.l[i][3] = evt.cridName;
                         this.publishMapState();
                     }
                 }));
             },
			publishMapState: function() {
                if(this.fullyrestored) { // do make the URL bounce around until everything's done
                        var queryString = ioQuery.objectToQuery(this.mapstate);
                    hash(queryString, true);
                    query(".permalink-text")[0].innerHTML = queryString;
                }
			}
		}));
});