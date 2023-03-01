define([
    "dojo/_base/declare",
    "dojo/topic",
    "dojo/on",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/TileInfo",
    "esri/layers/WMTSLayerInfo",
    "esri/geometry/Extent",
    "esri/map",
    "esri/dijit/Attribution",
    "esri/SpatialReference",
    "jpl/config/Config",
    "jpl/data/Projection",
    "jpl/events/MapEvent",
    "jpl/plugins/esri/GIBSSMAPReader",
    "jpl/plugins/esri/GIBSSMAPPicReader",
    // "jpl/plugins/esri/GIBSSMAPPicPngReader",
    "jpl/plugins/esri/GIBSWMTSLayer",
    "jpl/plugins/esri/GIBSWMTSPicLayer",
    "jpl/plugins/esri/PODAACWMTSLayer",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/Color",
    "esri/config",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImage",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/LabelLayer",
    "esri/tasks/query",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "proj4js/proj4js",
    "terraformer"
], function(declare, topic, on, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer, TileInfo, WMTSTileInfo, Extent, Map,
    Attribution, SpatialReference, Config, Projection, MapEvent, GIBSSMAPReader, GIBSSMAPPicReader, GIBSWMTSLayer, GIBSWMTSPicLayer, PODAACWMTSLayer,
    Polygon, Polyline, Point, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, TextSymbol, Font, Color, esriConfig, Graphic,
    GraphicsLayer, MapImage, MapImageLayer, FeatureLayer, LabelLayer, esriQuery, SimpleRenderer, InfoTemplate, proj4js, Terraformer) {
    return declare(null, {

        constructor: function() {},

        /***
         * Creates a new map
         * @param container - The container to place to map
         * @param zoomLevel - The initial zoom level of the map
         * @param projection - The projection string to get the extent
         */
        createMap: function(container, zoomLevel, projection) {
            config = Config.getInstance();

            var zoomDuration = 400;
            var zoomRate = 10;

            if (projection === config.projection.EQUIRECT) {
                var extent = this.getInitialExtent("equirectangular");
                var map = new Map(container, {
                    extent: extent,
                    spatialReference: extent.spatialReference,
                    logo: false,
                    autoResize: true,
                    zoom: zoomLevel,
                    slider: false,
                    sliderPosition: "bottom-right",
                    smartNavigation: false,
                    wrapAround180: false,
                    showAttribution: false,
                    showLabels: true
                });
            } else if (projection === config.projection.N_POLE) {
                var extent = this.getInitialExtent("north_pole");
                var map = new Map(container, {
                    extent: extent,
                    spatialReference: extent.spatialReference,
                    logo: false,
                    autoResize: true,
                    zoom: zoomLevel,
                    slider: false,
                    sliderPosition: "bottom-right",
                    smartNavigation: false,
                    wrapAround180: false,
                    showAttribution: false
                });
            } else {
                var extent = this.getInitialExtent("south_pole");
                var map = new Map(container, {
                    extent: extent,
                    spatialReference: extent.spatialReference,
                    logo: false,
                    autoResize: true,
                    zoom: zoomLevel,
                    slider: false,
                    sliderPosition: "bottom-right",
                    smartNavigation: false,
                    wrapAround180: false,
                    showAttribution: false
                });
            }

            esriConfig.defaults.map.zoomDuration = zoomDuration;
            esriConfig.defaults.map.zoomRate = zoomRate;

            return map;
        },

        /***
         * Centers the map to the lat,lon provided
         * @param map - The map object to add the layer
         * @param lat - latitude to center the map to
         * @param lon - longitude to center the map to
         */
        centerMapAt: function(map, lat, lon) {
            var centerPoint = new Point(lat, lon, map.extent.spatialReference);
            map.centerAt(centerPoint);
        },

        centerAndZoomMapAt: function(map, lat, lon, zoomLevel) {
            var centerPoint = new Point(lat, lon, map.extent.spatialReference);
            map.centerAt(centerPoint).then(function() {
                if (zoomLevel <= map.getMaxZoom() && zoomLevel >= map.getMinZoom()) {
                    map.setZoom(zoomLevel);
                }
            });
        },

        /***
         * Creates the appropriate arcgis service layer from the
         * Layer object and adds it to the referenced map object
         * @param layer - Layer object of type jpl/data/Layer
         * @param map - The map object to add the layer
         */
        addLayerToMap: function(layer, map, isBasemap) {
            var config = Config.getInstance();
            var self = this;

            if (!isBasemap) {
                isBasemap = false;
            }

            var hostportre = /\/\/([^\/]+)\//;
            var hostport = hostportre.exec(layer.endPoint)[1];
            if (esriConfig.defaults.io.corsEnabledServers.indexOf(hostport) < 0) {
                esriConfig.defaults.io.corsEnabledServers.push(hostport);
            }

            var serviceLayer = null;
            if (layer.serviceProtocol === "ArcGIS") {
                var serviceOptions = {
                    id: layer.productLabel,
                    opacity: layer.opacity,
                    showAttribution: true,
                    hasAttributionData: true
                };

                switch (layer.layerService) {
                    case "dynamic":
                        serviceLayer = new ArcGISDynamicMapServiceLayer(layer.endPoint, serviceOptions);
                        break;
                    case "tiled":
                        serviceLayer = new ArcGISTiledMapServiceLayer(layer.endPoint, serviceOptions);
                        break;
                    case "image":
                        serviceLayer = new ArcGISImageServiceLayer(layer.endPoint, serviceOptions);
                        break;
                    case "nomenclature":

                        var featureLayer = new FeatureLayer(layer.endPoint, {
                            outFields: ["*"],
                            mode: FeatureLayer.MODE_AUTO,
                            supportsAdvancedQueries: true,
                            showLabels: true,
                            //orderByFields: ["score ASC"],
                            maxRecordCount: 20
                        });
                        featureLayer.setRenderer(this.createInvisibleMarkerRenderer());

                        map.addLayer(featureLayer);


                        serviceLayer = new LabelLayer({
                            id: layer.productLabel
                        });

                        serviceLayer.addFeatureLayer(
                            featureLayer,
                            this.createTextLabelRenderer("#ffffff", "'Roboto',sans-serif", "300", "0.8em", 0, 0),
                            "{name}", {
                                pointPriorities: "CenterCenter"
                            }
                        );

                        serviceLayer.on("mouse-over", function(evt) {
                            map.setMapCursor("pointer");
                        });
                        serviceLayer.on("mouse-out", function() {
                            map.setMapCursor("default");
                        });

                        //Hack for now, need to move this to its own module
                        serviceLayer.on("click", function(evt) {
                            var featureAttributes,
                                featureLayer = this.featureLayers[0].graphics;

                            for (var i = 0; i < featureLayer.length; i++) {
                                if (featureLayer[i].attributes.name === evt.graphic.symbol.text) {
                                    featureAttributes = featureLayer[i].attributes;
                                    featureAttributes.x = evt.graphic.geometry.x;
                                    featureAttributes.y = evt.graphic.geometry.y;
                                }
                            }

                            if (featureAttributes) {
                                var position = {
                                    x: featureAttributes.x,
                                    y: featureAttributes.y
                                };

                                if (layer.layerProjection === config.projection.N_POLE) {

                                    var convertedPosition = self.convertNorthPolarMetersToDegrees(position.x, position.y);
                                    position.x = convertedPosition.x.toFixed(2) + "&deg;";
                                    position.y = convertedPosition.y.toFixed(2) + "&deg;";
                                } else if (layer.layerProjection === config.projection.S_POLE) {
                                    var convertedPosition = self.convertSouthPolarMetersToDegrees(position.x, position.y);
                                    position.x = convertedPosition.x.toFixed(2) + "&deg;";
                                    position.y = convertedPosition.y.toFixed(2) + "&deg;";
                                } else {
                                    position.x = position.x.toFixed(2) + "&deg;";
                                    position.y = position.y.toFixed(2) + "&deg;";
                                }

                                map.infoWindow.setTitle("");
                                map.infoWindow.setContent(
                                    '<table width="100%" class="nomenclature-info">' +
                                    '<tr><th>Name:</th><td>' + featureAttributes.name + '</td></tr>' +
                                    '<tr><th>Diameter:</th><td>' + featureAttributes.diameter + ' km</td></tr>' +
                                    '<tr><th>Latitude:</th><td>' + position.y + '</td></tr>' +
                                    '<tr><th>Longitude:</th><td>' + position.x + '</td></tr>' +
                                    '<tr><th>Origin:</th><td>' + featureAttributes.origin + '</td></tr>' +
                                    '<tr><th>Ethnicity:</th><td>' + featureAttributes.ethnicity + '</td></tr>' +
                                    '<tr><th>Type:</th><td>' + featureAttributes.type + '</td></tr>' +
                                    '<tr><th></th><td><a href="' + featureAttributes.link + '" target="_blank">Additional Info</a></td></tr>' +
                                    '</table>'
                                );

                                map.infoWindow.show(evt.graphic.geometry, map.getInfoWindowAnchor(evt.screenPoint));
                            }
                        });


                        break;
                }
            } else if (layer.serviceProtocol === "GIBS") {
                var serviceLayer;


                if (layer.layerService.indexOf("smap") == 0) {
                    if (layer.layerService === "smap") {
                        if (layer.wmts.tileFormat.indexOf("png") >= 0) {
                            // serviceLayer = new GIBSSMAPPicPngReader(null, {
                            //     opacity: layer.opacity
                            // }, layer, config);
                        } else {
                            serviceLayer = new GIBSSMAPReader(null, {
                                opacity: layer.opacity
                            }, layer, config);
                        }

                    } else if (layer.layerService === "smappic") {
                        serviceLayer = new GIBSSMAPPicReader(null, {
                            opacity: layer.opacity
                        }, layer, config);
                    }

                } else if (layer.layerService.indexOf("wmts") == 0) {
                    var layerInfo = new WMTSTileInfo({
                        identifier: layer.wmts.tileLayerName,
                        tileMatrixSet: layer.wmts.tileMatrixSet
                    });
                    var options = {
                        serviceMode: "KVP",
                        layerInfo: layerInfo,
                        opacity: layer.opacity
                    };
                    if (layer.layerService === "wmts") {
                        serviceLayer = new GIBSWMTSLayer(layer.endPoint, options, layer);
                    } else if (layer.layerService === "wmtspic") {
                        serviceLayer = new GIBSWMTSPicLayer(layer.endPoint, options, layer);
                    }
                    serviceLayer.setDateTime("2015-03-17");
                    //serviceLayer.setDateTime("2012-12-22");
                }
            } else if (layer.serviceProtocol === "PODAAC") {
                if (layer.layerService.indexOf("wmts") == 0) {
                    var layerInfo = new WMTSTileInfo({
                        identifier: layer.wmts.tileLayerName,
                        tileMatrixSet: layer.wmts.tileMatrixSet
                    });
                    var options = {
                        serviceMode: "KVP",
                        layerInfo: layerInfo
                    }
                    if (layer.layerService === "wmts") {
                        serviceLayer = new PODAACWMTSLayer(layer.endPoint, options, layer);
                    }
                    serviceLayer.setDateTime("2015-03-17");
                    //serviceLayer.setDateTime("2012-12-22");
                }
            }
            if (serviceLayer !== null) {
                if (isBasemap) {
                    map.addLayer(serviceLayer, 0);
                } else {
                    map.addLayer(serviceLayer);
                }
            }
        },

        addFeatureLayerToMap: function(layer, map, renderer, labelLayer, fieldName) {
            var serviceOptions = {
                id: layer.productLabel,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: [fieldName],
                maxRecordCount: 25
            };
            var featureLayer = new FeatureLayer(layer.endPoint, serviceOptions);
            featureLayer.setRenderer(renderer);
            map.addLayer(featureLayer);
            labelLayer.addFeatureLayer(featureLayer, renderer, "{" + fieldName + "}");
            map.addLayer(labelLayer);
        },

        /***
         * Removes a layer from the map given the layerID.
         * @param layerID - LayerID assigned when layer was added to map
         * @param map - The map object to remove the layer from
         */
        removeLayerFromMap: function(layerID, map) {
            var layerToRemove = map.getLayer(layerID);
            if (layerToRemove) {
                map.removeLayer(layerToRemove);
            }
        },

        getLayerFromMap: function(layerID, map) {
            return map.getLayer(layerID);
        },

        reorderLayerOnMap: function(layer, map, order) {
            map.reorderLayer(layer, order);
        },

        createMapLayer: function(layer) {
            var serviceLayer;

            switch (layer.layerService) {
                case "dynamic":
                    serviceLayer = new ArcGISDynamicMapServiceLayer(layer.endPoint);
                    break;
                case "tiled":
                    serviceLayer = new ArcGISTiledMapServiceLayer(layer.endPoint);
                    break;
                case "image":
                    serviceLayer = new ArcGISImageServiceLayer(layer.endPoint);
                    break;
            }


            return serviceLayer;
        },

        changeLayerOpacity: function(layer, opacity) {
            layer.setOpacity(opacity);
        },

        showLayer: function(layer) {
            if (layer) {
                layer.show();
            }
        },

        hideLayer: function(layer) {
            if (layer) {
                layer.hide();
            }
        },

        reorderLayers: function(productLabels, map) {
            for (var i = 0; i < productLabels.length; i++) {
                var theLayer = this.getLayerFromMap(productLabels[i], map);
                //add 1 to because we always want to be above the basemap
                var order = i + 1;
                this.reorderLayerOnMap(theLayer, map, i + 1);
            }
        },

        /***
         * Given a projection, will return the initial extent object for the map
         * @param {string} projection - 3 accepted projection values: "equirectangular", "north_pole", "south_pole"
         * @returns {object} Extent - The extent object
         */
        getInitialExtent: function(projection) {
            var result, spatialRefType, spatialRefValue, config = Config.getInstance(),
                xmin, ymin, xmax, ymax;

            switch (projection) {
                case "equirectangular":
                    if (this.isWKIDDefined(config.projection.SPATIAL_REFERENCES.EQUIRECT.wkid)) {
                        spatialRefType = "wkid";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.EQUIRECT.wkid;
                    } else {
                        spatialRefType = "wkt";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.EQUIRECT.wkt;
                    }

                    xmin = config.projection.EXTENTS.EQUIRECT.xmin;
                    ymin = config.projection.EXTENTS.EQUIRECT.ymin;
                    xmax = config.projection.EXTENTS.EQUIRECT.xmax;
                    ymax = config.projection.EXTENTS.EQUIRECT.ymax;

                    break;
                case "north_pole":
                    if (this.isWKIDDefined(config.projection.SPATIAL_REFERENCES.N_POLE.wkid)) {
                        spatialRefType = "wkid";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.N_POLE.wkid;
                    } else {
                        spatialRefType = "wkt";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.N_POLE.wkt;
                    }

                    xmin = config.projection.EXTENTS.N_POLE.xmin;
                    ymin = config.projection.EXTENTS.N_POLE.ymin;
                    xmax = config.projection.EXTENTS.N_POLE.xmax;
                    ymax = config.projection.EXTENTS.N_POLE.ymax;

                    break;
                case "south_pole":
                    if (this.isWKIDDefined(config.projection.SPATIAL_REFERENCES.S_POLE.wkid)) {
                        spatialRefType = "wkid";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.S_POLE.wkid;
                    } else {
                        spatialRefType = "wkt";
                        spatialRefValue = config.projection.SPATIAL_REFERENCES.S_POLE.wkt;
                    }

                    xmin = config.projection.EXTENTS.S_POLE.xmin;
                    ymin = config.projection.EXTENTS.S_POLE.ymin;
                    xmax = config.projection.EXTENTS.S_POLE.xmax;
                    ymax = config.projection.EXTENTS.S_POLE.ymax;
                    break;
                default:
                    //not a valid projection
                    break;
            }

            result = new Extent({
                "xmin": xmin,
                "ymin": ymin,
                "xmax": xmax,
                "ymax": ymax,
                "spatialReference": {}
            });
            result.spatialReference[spatialRefType] = spatialRefValue;

            return result;
        },

        setMapExtent: function(xmin, ymin, xmax, ymax, map) {
            var newExtent = new Extent({
                "xmin": xmin,
                "ymin": ymin,
                "xmax": xmax,
                "ymax": ymax,
                "spatialReference": map.spatialReference
            });

            map.setExtent(newExtent, true);
        },

        isWKIDDefined: function(wkid) {
            return (wkid !== '' && wkid !== null && wkid !== undefined);
        },

        createWrapAroundPolygonGraphic: function(bbox, map, fillSymbol) {
            if (bbox[0] < -180) {
                var leftBbox = bbox.slice(0);
                leftBbox[0] = -180;
                var left = this.createPolygonGraphic(leftBbox, map, fillSymbol, true, false);

                var rightBbox = bbox.slice(0);
                rightBbox[0] += 360;
                rightBbox[2] = 180;
                var right = this.createPolygonGraphic(rightBbox, map, fillSymbol, false, true);
                return [left, right];
            } else {
                console.warn("ERROR NO HANDLING FOR > 180 WRAP?");
                return [null, null];
            }
        },

        createPolygonGraphic: function(bbox, map, fillSymbol, noLeft, noRight) {
            var xy1 = this.convertLatLngToXY(bbox[0], bbox[3]);
            var xy2 = this.convertLatLngToXY(bbox[2], bbox[3]);
            var xy3 = this.convertLatLngToXY(bbox[2], bbox[1]);
            var xy4 = this.convertLatLngToXY(bbox[0], bbox[1]);
            var points;
            if (noLeft) {
                points = [
                    new Point(xy1.x, xy1.y, map.spatialReference),
                    new Point(xy2.x, xy2.y, map.spatialReference),
                    new Point(xy3.x, xy3.y, map.spatialReference),
                    new Point(xy4.x, xy4.y, map.spatialReference)
                ];

            } else if (noRight) {
                points = [
                    new Point(xy2.x, xy2.y, map.spatialReference),
                    new Point(xy1.x, xy1.y, map.spatialReference),
                    new Point(xy4.x, xy4.y, map.spatialReference),
                    new Point(xy3.x, xy3.y, map.spatialReference)
                ];
            } else {
                points = [
                    new Point(xy1.x, xy1.y, map.spatialReference),
                    new Point(xy2.x, xy2.y, map.spatialReference),
                    new Point(xy3.x, xy3.y, map.spatialReference),
                    new Point(xy4.x, xy4.y, map.spatialReference),
                    new Point(xy1.x, xy1.y, map.spatialReference)
                ];
            }

            var polygon = new Polygon();
            polygon.addRing(points);
            polygon.spatialReference = map.spatialReference;
            return new Graphic(polygon, fillSymbol);
        },

        createLayerPolygon: function(layer, map, outlineID) {
            var points = [
                new Point(layer.boundingBox.west, layer.boundingBox.north, map.spatialReference),
                new Point(layer.boundingBox.east, layer.boundingBox.north, map.spatialReference),
                new Point(layer.boundingBox.east, layer.boundingBox.south, map.spatialReference),
                new Point(layer.boundingBox.west, layer.boundingBox.south, map.spatialReference),
                new Point(layer.boundingBox.west, layer.boundingBox.north, map.spatialReference)
            ];

            var polygon = new Polygon();
            polygon.addRing(points);
            polygon.spatialReference = map.spatialReference;

            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([247, 235, 14, 0.85]), 2),
                new Color([255, 255, 0, 0])
            );

            var polygonGraphic = new Graphic(polygon, symbol, {
                keeper: true
            });
            var polyLayer = new GraphicsLayer({
                id: outlineID
            });

            this.addLayerPolygon(polyLayer, map);

            polyLayer.add(polygonGraphic);

            return polyLayer;
        },

        createGraphicsLayer: function() {
            return new GraphicsLayer();
        },
        addGraphicToLayer: function(graphicsLayer, graphic) {
            graphicsLayer.add(graphic);
        },
        removeGraphicFromLayer: function(graphicsLayer, graphic) {
            graphicsLayer.remove(graphic);
        },
        getExtentFromWKT: function(extentWktStr, map) {
            var poly = this.createArcgisPolygon(extentWktStr, map);
            return poly.getExtent();
        },

        createArcgisPolygon: function(wktStr, map) {
            var currentPrimitive = Terraformer.WKT.parse(wktStr);
            var arcgis = Terraformer.ArcGIS.convert(currentPrimitive);

            // Project to EQUIRECT
            var _context = this;
            if (currentPrimitive.type == "MultiLineString" ||
                currentPrimitive.type == "LineString") {
                arcgis.paths.forEach(function(path, i) {
                    path.forEach(function(coordinate, j) {
                        var xy = _context.convertLatLngToXY(coordinate[0], coordinate[1]);
                        arcgis.paths[i][j] = [xy.x, xy.y];
                    })
                })

                var line = new Polyline(arcgis);
                line.setSpatialReference(map.spatialReference);

                return line;
            } else { //polygon
                arcgis.rings.forEach(function(polygon, i) {
                    polygon.forEach(function(coordinate, j) {
                        var xy = _context.convertLatLngToXY(coordinate[0], coordinate[1]);
                        arcgis.rings[i][j] = [xy.x, xy.y];
                    })
                })

                var poly = new Polygon(arcgis);
                poly.setSpatialReference(map.spatialReference);

                return poly;
            }
        },

        createGraphicFromWKTString: function(wktStr, map, borderColor, fillColor) {
            var poly = this.createArcgisPolygon(wktStr, map);
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(borderColor), 2),
                new Color(fillColor)
            );

            var graphic = new Graphic(poly, symbol);
            return graphic;
        },

        createImageLayer: function() {
            return new MapImageLayer({
                "className": "mapImageLayer"
            });
        },

        createMapImage: function(href, extent) {
            return new MapImage({
                'extent': extent,
                'href': href
            });
        },

        addImageToMapLayer: function(mapLayer, image) {
            mapLayer.addImage(image);
        },
        removeImageFromMapLayer: function(mapLayer, image) {
            mapLayer.removeImage(image);
        },

        createImagePreview: function(href, extent, map, opacity) {
            var ml = new MapImageLayer({
                "className": "mapImageLayer",
                'opacity': opacity
            });
            ml.addImage(new MapImage({
                'extent': extent,
                'href': href
            }));
            return ml;
            // var poly = this.createArcgisPolygon(extentWktStr, map);
            // var ml = new MapImageLayer({
            //     "className": "mapImageLayer"
            // });
            // ml.addImage(new MapImage({
            //     'extent': poly.getExtent(),
            //     'href': href
            // }));
            // return ml;
        },

        restrictToMaxExtent: function(evt, map) {
            console.log(evt, "uygh", map);
            // console.log(evt.extent.xmax, "xmax")
            // console.log(evt.extent.xmin, "xmin")
            // console.log(evt.extent.ymin, "ymin")
            // console.log(evt.extent.ymax, "ymax")

            // Check for _clip in evt in case window is larger than map
            var xmax = evt.extent.xmax;
            var ymax = evt.extent.ymax;
            var xmin = evt.extent.xmin;
            var ymin = evt.extent.ymin;

            if (evt.extent._clip) {
                console.log("CLIP")
                xmax = evt.extent._clip.xmax;
                ymax = evt.extent._clip.ymax;
                xmin = evt.extent._clip.xmin;
                ymin = evt.extent._clip.ymin;
            }

            console.log(xmax, "xmax")
            console.log(xmin, "xmin")
            console.log(ymin, "ymin")
            console.log(ymax, "ymax")


            var flag = false;
            var maxExtent = new Extent(-270, -90, 270, 90);
            var adjustedExtent = new Extent(xmin, ymin, xmax, ymax);
            //set a buffer to make the max extent a slightly bigger to void minor differences
            //the map unit for this case is meter. 
            var buffer = 10;
            if (xmin < (maxExtent.xmin - buffer)) {
                console.log("CASE 1");
                adjustedExtent.xmin = maxExtent.xmin;
                adjustedExtent.xmax = Math.abs(xmin - maxExtent.xmin) + xmax;
                flag = true;
            }

            // if (evt.extent.ymin < maxExtent.ymin - buffer) {
            //     console.log("CASE 2");
            //     adjustedExtent.ymin = maxExtent.ymin;
            //     adjustedExtent.ymax = Math.abs(evt.extent.ymin - maxExtent.ymin) + evt.extent.ymax;
            //     flag = true;
            // }
            if (xmax - buffer > maxExtent.xmax) {
                console.log("CASE 3");
                adjustedExtent.xmax = maxExtent.xmax;
                adjustedExtent.xmin = xmin - Math.abs(xmax - maxExtent.xmax);
                flag = true;
            }
            // if (evt.extent.ymax - buffer > maxExtent.ymax) {
            //     console.log("CASE 4");
            //     adjustedExtent.ymax = maxExtent.ymax;
            //     adjustedExtent.ymin = evt.extent.ymin - Math.abs(evt.extent.ymax - maxExtent.ymax);
            //     flag = true;
            // }

            if (flag) {
                map.setExtent(adjustedExtent);
            }
        },

        addMapImageLayer: function(mapImageLayer, map) {
            if (mapImageLayer) {
                map.addLayer(mapImageLayer);
            }
        },

        removeMapImageLayer: function(mapImageLayer, map) {
            if (mapImageLayer) {
                map.removeLayer(mapImageLayer);
            }
        },

        addGraphic: function(graphic, map) {
            map.graphics.add(graphic);
        },

        removeGraphic: function(graphic, map) {
            map.graphics.remove(graphic);
        },

        addLayerPolygon: function(polygonLayer, map) {
            if (polygonLayer) {
                map.addLayer(polygonLayer);
            }
        },

        removeLayerPolygon: function(polygonLayer, map) {
            if (polygonLayer) {
                map.removeLayer(polygonLayer);
            }
        },

        getProjectionBySpatialReference: function(spatialReference) {
            var config = Config.getInstance(),
                projection;

            if (spatialReference.wkid == config.projection.SPATIAL_REFERENCES.EQUIRECT.wkid ||
                spatialReference.wkt == config.projection.SPATIAL_REFERENCES.EQUIRECT.wkt) {
                projection = config.projection.EQUIRECT;
            } else if (spatialReference.wkid == config.projection.SPATIAL_REFERENCES.N_POLE.wkid ||
                spatialReference.wkt == config.projection.SPATIAL_REFERENCES.N_POLE.wkt) {
                projection = config.projection.N_POLE;
            } else if (spatialReference.wkid == config.projection.SPATIAL_REFERENCES.S_POLE.wkid ||
                spatialReference.wkt == config.projection.SPATIAL_REFERENCES.S_POLE.wkt) {
                projection = config.projection.S_POLE;
            } else {}

            return projection;
        },

        checkAndSetMapProjection: function(projection, mapProjection) {
            if (projection !== mapProjection) {
                topic.publish(MapEvent.prototype.PROJECTION_CHANGED, {
                    projection: projection
                });
            }

        },

        resizeFix: function() {
            window.setTimeout(function() {
                on.emit(window, "resize", {
                    bubbles: true,
                    cancelable: true
                });
            }, 400);
        },

        /***
         * Function to return a formatted x/y coordinate value
         * @value {number} - value of the coordinate
         * @type {string} - type of coordinate: 'x' or 'y'
         * @returns {string} - Formatted numeric coordinate
         */
        formatCoordinate: function(value, type) {
            var num = parseFloat(value),
                multiplier = Math.pow(10, 2),
                result = (Number(Math["round"](num * multiplier) / multiplier));

            if ((type === 'x' && result >= -180 && result <= 180) ||
                (type === 'y' && result >= -90 && result <= 90)) {
                return result;
            } else {
                return '-';
            }
        },

        createInvisibleMarkerRenderer: function() {
            var marker = new SimpleMarkerSymbol();
            //make it invisible
            marker.setSize(0);
            //return the renderer
            return new SimpleRenderer(marker);
        },

        createPictureMarker: function(url) {
            return new PictureMarkerSymbol({
                "angle": 0,
                "xoffset": 0,
                "yoffset": 0,
                "type": "esriPMS",
                "url": url,
                "contentType": "image/png",
                "width": 24,
                "height": 24
            });
        },

        createTextLabelRenderer: function(color, font, fontWeight, fontSize, offsetx, offsety) {
            //TODO: Type checking, assuming all values are passed in correctly for now
            var textSymbol = new TextSymbol();
            if (color) {
                textSymbol.setColor(new Color(color));
            }
            if (font) {
                textSymbol.font.setFamily(font);
            }
            if (fontWeight) {
                textSymbol.font.setWeight(fontWeight);
            }
            if (fontSize) {
                textSymbol.font.setSize(fontSize);
            }
            if (offsetx && offsety) {
                textSymbol.setOffset(offsetx, offsety);
            }

            return new SimpleRenderer(textSymbol);
        },

        mapZoomIn: function(map) {
            var newZoom = map.getZoom() + 1,
                maxZoom = map.getMaxZoom();

            if (newZoom <= maxZoom) {
                map.setZoom(newZoom);
            }
        },

        mapZoomOut: function(map) {
            var newZoom = map.getZoom() - 1,
                minZoom = map.getMinZoom();

            if (newZoom >= minZoom) {
                map.setZoom(newZoom);
            }
        },

        getMapZoomLevel: function(map) {
            return map.getZoom();
        },

        getNativeResolutionLabel: function(map, nativeResolution) {
            var levels = [
                "36km",
                "18km",
                "9km",
                "3km"
            ];
            var mapZoomLevel = Number(this.getMapZoomLevel(map));
            var nativeZoomLevel = Number(levels.indexOf(nativeResolution));

            if (nativeZoomLevel > -1) {
                if (nativeZoomLevel > mapZoomLevel) {
                    return "Zoomed Out";
                } else if (nativeZoomLevel === mapZoomLevel) {
                    return "Native Resolution";
                } else if (nativeZoomLevel < mapZoomLevel) {
                    return "Zoomed In";
                } else {
                    return "-"
                }
            } else {
                return "";
            }
        },

        calculateDistance: function(geometry, endpoint, radius) {

        },

        getActiveMap: function(basemap, mapDijit, projection) {
            if (basemap.currentMapProjection === projection.N_POLE) {
                return mapDijit.northPoleMap;
            } else if (basemap.currentMapProjection === projection.S_POLE) {
                return mapDijit.southPoleMap;
            } else {
                //default to equirect for all others
                return mapDijit.equirectMap;
            }
        },

        convertNorthPolarMetersToDegrees: function(x, y) {
            var config = Config.getInstance();
            var from = config.projection.SPATIAL_REFERENCES.N_POLE.proj4;
            var to = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;

            //var rad = 252478;
            //var clat = 90;
            //var j = Math.atan2(x,-y);
            //var k = clat * (Math.PI/180);
            //var b = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
            //var h = 2 * Math.atan(b/(2 * rad));
            //var d = Math.asin(Math.cos(h) * Math.sin(k));
            //var lat = d * 180/Math.PI;
            //var lon = j * 180/Math.PI;

            var results = proj4js(from, to, [x, y]);
            var lon = results[0];
            var lat = results[1];

            return {
                x: lon,
                y: lat
            }
        },

        convertSouthPolarMetersToDegrees: function(x, y) {
            var config = Config.getInstance();
            var from = config.projection.SPATIAL_REFERENCES.S_POLE.proj4;
            var to = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;

            //var rad = 252478;
            //var clat = -90;
            //var j = Math.atan2(x,y);
            //var k = clat * (Math.PI/180);
            //var b = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            //var h = 2 * Math.atan(b/(2*rad));
            //var d = Math.asin(Math.cos(h) * Math.sin(k));
            //var lat = d * 180/Math.PI;
            //var lon = j * 180/Math.PI;

            var results = proj4js(from, to, [x, y]);
            var lon = results[0];
            var lat = results[1];

            return {
                x: lon,
                y: lat
            }
        },
        convertLatLonToNorthPolarMeters: function(x, y) {
            var rad = 252478;
            var f = x * Math.PI / 180;
            var c = y * Math.PI / 180;

            return {
                x: (2 * rad * Math.tan(Math.PI / 4 - c / 2) * Math.sin(f)),
                y: (-2 * rad * Math.tan(Math.PI / 4 - c / 2) * Math.cos(f))
            }
        },
        convertLatLonToSouthPolarMeters: function(x, y) {
            var rad = 252478;
            var f = x * Math.PI / 180;
            var c = y * Math.PI / 180;

            return {
                x: 2 * rad * Math.tan(Math.PI / 4 + c / 2) * Math.sin(f),
                y: 2 * rad * Math.tan(Math.PI / 4 + c / 2) * Math.cos(f)
            }
        },
        convertLatLngToXY: function(lat, lng) {
            var config = Config.getInstance();
            var from = config.projection.SPATIAL_REFERENCES.LATLONG.proj4;
            var to = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;

            var results = proj4js(from, to, [lat, lng]);
            var x = results[0];
            var y = results[1];
            return {
                x: x,
                y: y
            }
        },
        convertXYToLatLng: function(x, y, fromextents) {
            var config = Config.getInstance();
            var from = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;
            var to = config.projection.SPATIAL_REFERENCES.LATLONG.proj4;

            if (fromextents) {
                x = Math.max(Math.min(x, fromextents.xmax), fromextents.xmin);
                y = Math.max(Math.min(y, fromextents.ymax), fromextents.ymin);
            }

            var results = proj4js(from, to, [x, y]);
            var lon = results[0];
            var lat = results[1];
            return {
                lat: lat,
                lon: lon
            }
        },
        convertToDegrees: function(x, y, fromproj, fromextents) {
            var config = Config.getInstance();
            var from = fromproj;
            var to = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;

            if (fromextents) {
                x = Math.max(Math.min(x, fromextents.xmax), fromextents.xmin);
                y = Math.max(Math.min(y, fromextents.ymax), fromextents.ymin);
            }

            if (config.projection.LATLONG) { // If there's a specially defined latlong projection
                to = config.projection.SPATIAL_REFERENCES.LATLONG.proj4;
            }

            //var rad = 252478;
            //var clat = -90;
            //var j = Math.atan2(x,y);
            //var k = clat * (Math.PI/180);
            //var b = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            //var h = 2 * Math.atan(b/(2*rad));
            //var d = Math.asin(Math.cos(h) * Math.sin(k));
            //var lat = d * 180/Math.PI;
            //var lon = j * 180/Math.PI;

            var results = proj4js(from, to, [x, y]);
            var lon = results[0];
            var lat = results[1];

            return {
                x: lon,
                y: lat
            }
        },
        convert180CoordsToInf: function(bbox) {
            // If any mins are greater than their maxes, subtract 360. 
            // ASSUMES bbox coords are within -180,-90,180,90
            var xyBbox = bbox.slice(0);
            if (bbox[0] > bbox[2]) {
                xyBbox[0] -= 360;
            }
            if (bbox[1] > bbox[3]) {
                xyBbox[1] -= 360;
            }
            return xyBbox;
        },

        convertInfCoordsTo180: function(bbox) {
            // ASSUMES bbox coords follow 360/180 constraints
            var xyBbox = bbox.slice(0);
            if (bbox[0] < -180) {
                xyBbox[0] += 360;
            }
            // if (bbox[1] > bbox[3]) {
            //     xyBbox[1] -= 360;
            // }
            return xyBbox;
        },
        estimateScaleDistance: function(startPoint, endPoint, mapExtent) {
            var config = Config.getInstance();

            var proj4 = null;
            if (mapExtent.spatialReference.wkid == config.projection.N_POLE) {
                proj4 = config.projection.SPATIAL_REFERENCES.N_POLE.proj4;
            } else if (mapExtent.spatialReference.wkid == config.projection.S_POLE) {
                proj4 = config.projection.SPATIAL_REFERENCES.S_POLE.proj4;
            } else if (mapExtent.spatialReference.wkid == config.projection.EQUIRECT) {
                proj4 = config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4;
            }






            proj4 = proj4js(proj4);
            if (!proj4.oProj.units || proj4.oProj.units.toLowerCase() === 'degree') { // assume degrees is default
                var R = proj4.oProj.a / 1000; // Radius in km
                var dLat = (endPoint.y - startPoint.y) * Math.PI / 180; // deg2rad below
                var dLon = (endPoint.x - startPoint.x) * Math.PI / 180;
                var a = 0.5 - Math.cos(dLat) / 2 + Math.cos(startPoint.y * Math.PI / 180) *
                    Math.cos(endPoint.y * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
                return R * 2 * Math.asin(Math.sqrt(a));
            } else if (proj4.oProj.units.toLowerCase().indexOf('m') == 0) {
                var lowY = Math.min(startPoint.y, endPoint.y);
                var highY = Math.max(startPoint.y, endPoint.y);
                var lowX = Math.min(startPoint.x, endPoint.x);
                var highX = Math.max(startPoint.x, endPoint.x);

                var dy = highY - lowY;
                var dx = highX - lowX;

                var dtwo = Math.pow(dy, 2) + Math.pow(dx, 2);

                return (Math.sqrt(dtwo)) / 1000;
            }

            return 0;
        }
    });
});
