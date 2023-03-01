define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/topic",
    "esri/geometry/Extent",
    "esri/layers/TiledMapServiceLayer",
    "esri/layers/TileInfo",
    "esri/SpatialReference",
    "jpl/events/DateEvent",
    "jpl/events/MapEvent",
    "jpl/data/PicassoPngLayers",
    "esri/geometry/screenUtils",
    "esri/geometry/ScreenPoint",
    "jpl/config/Config"
], function(declare, lang, domConstruct, domStyle, topic, Extent, TiledMapServiceLayer, TileInfo, SpatialReference, DateEvent, MapEvent, PicassoPngLayers, screenUtils, ScreenPoint, Config){
    return declare([TiledMapServiceLayer], {
        _dateTime: new Date(),
        colorTable: null,
        tilesHighlighted: false,
        bgwithdata: "rgba(255,255,255,.75)",
        bgwithoutdata: "rgba(0,0,0,.75)",
        bgreset: "transparent",
        latestUrls: [],
        constructor: function(endpoint, options, layerConfig, appConfig) {
            //http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Projected_coordinate_systems/02r3000000vt000000/
            var field = null;

            if (layerConfig.layerProjection === appConfig.projection.N_POLE) {
                field = 'N_POLE';
            } else if (layerConfig.layerProjection === appConfig.projection.S_POLE) {
                field = 'S_POLE';
            } else if(layerConfig.layerProjection === appConfig.projection.EQUIRECT) {
                field = 'EQUIRECT';
            }

            var sr = new SpatialReference(appConfig.projection.SPATIAL_REFERENCES[field].wkt);
            var ext = new Extent(appConfig.projection.EXTENTS[field].xmin,
                appConfig.projection.EXTENTS[field].ymin,
                appConfig.projection.EXTENTS[field].xmax,
                appConfig.projection.EXTENTS[field].ymax,
                sr);
            var origin = [appConfig.projection.EXTENTS[field].xmin, appConfig.projection.EXTENTS[field].ymax];

            var equi_lods = [
                {"level": 0, "resolution": 36032.2208405844, "scale": 15143017999579.047},
                {"level": 1, "resolution": 18016.1104202922, "scale": 7571508999789.5234},
                {"level": 2, "resolution" : 9008.0552101461, "scale" : 3785754499894.7617},
                {"level": 3, "resolution" : 3002.6850700487, "scale" : 1261918166631.5872}
            ];

            var overzoom = 10;
            for(var i = equi_lods.length; i < overzoom; i++) {
                equi_lods.push({
                    "level": i,
                    "resolution": (equi_lods[i-1].resolution/2),
                    "scale":  (equi_lods[i-1].scale/2)
                });
            }

            var tileInfo = new TileInfo({
                "format": layerConfig.wmts.tileFormat,
                "spatialReference": sr,
                "rows": 512,
                "cols": 512,
                "origin": {
                    "x": origin[0],
                    "y": origin[1]
                },
                "lods": equi_lods
            });

            this.spatialReference = sr;
            this.fullExtent = ext;
            this.tileInfo = tileInfo;
            this.origin = tileInfo.origin;

            this.layerConfig = layerConfig;
            this.id = layerConfig.productLabel;
            this.setDateTime(new Date());
            if(this.layerConfig.wmts && this.layerConfig.wmts.dateTime) {
                this.setDateTime(new Date(this.layerConfig.wmts.dateTime));
            }
            this.loaded = !0;
            this.onLoad(this);
            //topic.subscribe(DateEvent.prototype.DATETIME_RANGE_UPDATED, lang.hitch(this, this.dateTimeRangeUpdated));
            topic.subscribe(MapEvent.prototype.RELOAD_TILES, lang.hitch(this, this.reloadTiles));
        },
        dateTimeRangeUpdated: function(evt) {
            this.setDateTime(evt.endDate);
            this.refresh();
        },
        setDateTime: function(dateTime) {
            // correct for timezone difference so we always get UTC
            this._dateTime.setTime(dateTime.getTime());
        },
        _addImage: function(a, c, d, b, e, f, h, g, t, m, k) {
            //var elt = document.getElementById(f);
            //if(elt) {
            //    this._removeList.add(elt);
            //}
            // a = level, d = row, e = col, h = tilew, g = tileh
            this.inherited(arguments);
            var img = this._tiles[f];
            this.latestUrls[img.id] = img.src;

            if(a > 3) {
                var overzoomfactor = Math.pow(2, a - 3);
                img.style.width = h * overzoomfactor + "px";
                img.style.height = g * overzoomfactor + "px";
                img.style.margin = "-" + h * (d % overzoomfactor) + "px 0 0 " + ("-" + g * (e % overzoomfactor) + "px");
            }
        },
        highlightTiles: function(enable) {
            this.tilesHighlighted = enable;
            var c = domStyle.set,
                d, b, e;
            // code stolen from esri tiledmapservicelayer for changing opacity
            if ("css-transforms" === this._map.navigationMode) {
                if (this._active) {
                    e = this._active.childNodes;
                    for (d = e.length - 1; 0 <= d; d--) {
                        if(enable) {
                            if(e[d].firstChild.hasTileData) {
                                c(e[d], "background-color", this.bgwithdata);
                            } else {
                                c(e[d], "background-color", this.bgwithoutdata);
                            }
                        } else {
                            c(e[d], "background-color", this.bgreset);
                        }
                    }

                }
                for (d = this._passives.length - 1; 0 <= d; d--) {
                    e = this._passives[d].childNodes;
                    for (b = e.length - 1; 0 <= b; b--) {
                        if(enable) {
                            if(e[d].firstChild.hasTileData) {
                                c(e[d], "background-color", this.bgwithdata);
                            } else {
                                c(e[d], "background-color", this.bgwithoutdata);
                            }
                        } else {
                            c(e[d], "background-color", this.bgreset);
                        }
                    }
                }
            } else {
                e = this._div.childNodes;
                for (d = e.length - 1; 0 <= d; d--) {
                    if(enable) {
                        if(e[d].firstChild.hasTileData) {
                            c(e[d], "background-color", this.bgwithdata);
                        } else {
                            c(e[d], "background-color", this.bgwithoutdata);
                        }
                    } else {
                        c(e[d], "background-color", this.bgreset);
                    }
                }
            }
        },
        _tilePopPop: function(a) {
            this.inherited(arguments);
            if(!(a && a.parentNode && a.parentNode.parentNode)) {
                return;
            }
            if(domStyle.get(a, "display") !== "none") { // tiles with error
                return;
            }
            domStyle.set(a, "display", "");

            var img = a;
            var clippingDiv = domConstruct.create("div");
            var imgid = img.id;

            this._tiles[imgid] = clippingDiv;

            // copy img attributes
            clippingDiv.style.cssText = img.style.cssText;
            clippingDiv.style.visibility = 'hidden';
            clippingDiv.className = img.className;
            clippingDiv.style.width = "512px";
            clippingDiv.style.height = "512px";
            clippingDiv.style.margin = "";
            clippingDiv.style.overflow = 'hidden';

            // needed so that tiles will be pruned if they're offscreen
            var transform = (domStyle.getComputedStyle(img).transform || domStyle.getComputedStyle(img).webkitTransform).split(/[,\)]/);
            var gptransform = (domStyle.getComputedStyle(img.parentNode.parentNode).transform || domStyle.getComputedStyle(img.parentNode.parentNode).webkitTransform).split(/[,\)]/);
            clippingDiv._left = +transform[4];
            clippingDiv._top = +transform[5];

            // reset image sizes after clearing out other attributes
            var tmpw = img.style.width;
            var tmph = img.style.height;
            var tmpm = img.style.margin;
            img.style.cssText = "";
            img.style.width = tmpw;
            img.style.height = tmph;
            img.style.margin = tmpm;

            // replace and destroy original img
            img.parentNode.replaceChild(clippingDiv, img);
            clippingDiv.appendChild(img);
            img.removeAttribute("id");
            clippingDiv.id = imgid;

            // Do picasso png
            var canvas = domConstruct.create("canvas");
            canvas.width = 512;
            canvas.height = 512;
            var ctx = canvas.getContext('2d');
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            var marginLeft = parseInt(domStyle.getComputedStyle(img).marginLeft);
            var marginTop = parseInt(domStyle.getComputedStyle(img).marginTop);
            var width = parseInt(domStyle.getComputedStyle(img).width);
            var height = parseInt(domStyle.getComputedStyle(img).height);
            var m = parseInt(domStyle.getComputedStyle(img).width)/512;
            var sx = -(marginLeft/width) * 512;
            var sy = -(marginTop/height) * 512;
            var swidth = 512/m;
            var sheight = 512/m;

            canvas.m = m;
            canvas.sx = sx;
            canvas.sy = sy;
            canvas.swidth = swidth;
            canvas.sheight = sheight;

            var backcanvas = domConstruct.create("canvas");
            backcanvas.width = canvas.width;
            backcanvas.height = canvas.height;
            var backctx = backcanvas.getContext('2d');
            backctx.drawImage(img, 0, 0);
            canvas.imagedataraw =  backctx.getImageData(0, 0, 512, 512);
            domConstruct.destroy(backctx);

            if(this.colorTable == null) {
                ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, 512, 512);
            } else {
                this.highlightColorTableCanvas(this.colorTable, clippingDiv, canvas);
            }

            var scaledImageData = ctx.getImageData(0, 0, 512, 512);
            canvas.hasTileData = false;
            for(var i = 3; i < scaledImageData.data.length; i+= 4) {
                var val = scaledImageData.data[i];
                if(val != 0) {
                    canvas.hasTileData = true;
                    break;
                }
            }

            img.parentNode.replaceChild(canvas, img);
            domConstruct.destroy(img);
            // end do picasso png


            // Save the tile to picasso
            var map = this.getMap();
            var picassoPngLayers = PicassoPngLayers.getInstance();
            picassoPngLayers.setMap(map);
            picassoPngLayers.setTileSize(512, 512);

            canvas.ulscreen = new ScreenPoint(parseInt(transform[4]) + parseInt(gptransform[4]), parseInt(transform[5]) + parseInt(gptransform[5]));
            canvas.lrscreen = new ScreenPoint(parseInt(transform[4]) + parseInt(gptransform[4]) + canvas.width, parseInt(transform[5]) + parseInt(gptransform[5]) + canvas.height);
            canvas.ulmap = screenUtils.toMapPoint(map.extent, map.width, map.height, canvas.ulscreen);
            canvas.lrmap = screenUtils.toMapPoint(map.extent, map.width, map.height, canvas.lrscreen);
            picassoPngLayers.addTile(this.id, this.layerConfig.layerTitle || this.layerInfo.title, this, this.layerConfig.layerProjection, clippingDiv, canvas, {sx: sx, sy: sy, swidth: swidth, sheight: sheight});

            // highlight tiles
            if(this.tilesHighlighted) {
                if(canvas.hasTileData) {
                    domStyle.set(clippingDiv, "background-color", this.bgwithdata);
                } else {
                    domStyle.set(clippingDiv, "background-color", this.bgwithoutdata);
                }
            } else {
                domStyle.set(clippingDiv, "background-color", this.bgreset);
            }
            // end highlight tiles

            if(domStyle.get(clippingDiv, 'visibility') !== 'visible') {
                domStyle.set(clippingDiv, 'visibility', 'visible'); // prevents flash of raw color
            }
        },
        _tileLoadHandler: function(a) {
            a = a.currentTarget;
            if(this.latestUrls[a.id] !== a.src) { // make sure we only show the latest request
                if(a.parentNode) {
                    a.parentNode.removeChild(a)
                }
                this._tilePopPop(a);
                return;
            }
            delete this.latestUrls[a.id];
            this._noDom ? this._standby.push(a) : domStyle.set(a, "display", "none"), this._tilePopPop(a) // need to differentiate between loaded tiles and errored tiles, so use display
        },
        highlightColorTableCanvas: function (colorTable, div, canvas) {
            if (canvas.imagedataraw != null) {
                var me = this;
                if (colorTable == null) {
                    var ctx = canvas.getContext('2d');
                    ctx.putImageData(canvas.imagedataraw.data, 0, 0);
                } else {
                    if (canvas.highlighterWorker == null) {
                        canvas.highlighterWorker = new Worker('jpl/workers/canvashighlighter_le.js');
                        canvas.highlighterWorkerProcessing = false;
                        canvas.highlighterWorker.addEventListener('message', function (e) {
                            var div = me._tiles[e.data.divid];
                            var canvas = div.firstChild;
                            var buffer = e.data.buffer;
                            if (canvas != null && canvas.highlighterWorker != null) {
                                var backcanvas = domConstruct.create("canvas");
                                backcanvas.width = canvas.width;
                                backcanvas.height = canvas.height;
                                var backctx = backcanvas.getContext('2d');
                                var imgdata = backctx.createImageData(canvas.width, canvas.height);
                                var buf8 = new Uint8ClampedArray(buffer);
                                imgdata.data.set(buf8);
                                backctx.putImageData(imgdata, 0, 0);

                                var ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height); // TODO can optimize here to remove flicker
                                ctx.drawImage(backcanvas, canvas.sx, canvas.sy, canvas.swidth, canvas.sheight, 0, 0, canvas.width, canvas.height);
                                domConstruct.destroy(backcanvas);

                                if (canvas.colorTableNext != null) { // if there's a pending job, do it!
                                    var colorTableCurrent = canvas.colorTableNext;
                                    canvas.colorTableNext = null;
                                    canvas.highlighterWorker.postMessage({
                                        colorTable: colorTableCurrent,
                                        buffer: canvas.imagedataraw.data.buffer,
                                        divid: div.id
                                    });
                                } else {
                                    canvas.highlighterWorkerProcessing = false;
                                }
                            }
                        }, false);
                    }
                }
                canvas.colorTableNext = colorTable;
                if (!canvas.highlighterWorkerProcessing) { // call webworker immediately if it's not processing
                    canvas.highlighterWorkerProcessing = true;
                    var colorTableCurrent = canvas.colorTableNext;
                    canvas.colorTableNext = null;

                    canvas.highlighterWorker.postMessage({
                        colorTable: colorTableCurrent,
                        buffer: canvas.imagedataraw.data.buffer,
                        divid: div.id
                    });
                }
            }
        },
        highlightColorTable: function (colorTable) {
            var me = this;
            this.colorTable = colorTable;
            if (this._tiles == null) {
                return;
            }
            var keys = Object.keys(this._tiles);
            var values = keys.map(function (v) {
                return me._tiles[v];
            });
            for (var j = 0; j < values.length; j++) {
                var div = values[j];
                var canvas = div.firstChild;
                this.highlightColorTableCanvas(colorTable, div, canvas);
            }
        },
        getTileUrl: function(level, row, col) {
            var tileMatrixSet = this.layerConfig.wmts.tileMatrixSet;
            var tileMatrixSetParts = this.layerConfig.wmts.tileMatrixSet.split("_");
            var layerProj = "";

            if(level > 3) {
                var zoomfactor = Math.pow(2, level - 3);
                level = 3;
                row = Math.floor(row / zoomfactor);
                col = Math.floor(col / zoomfactor);
            }

            var dateTimeString = this.layerConfig.dateTime ? this.layerConfig.wmts.granule ? this.layerConfig.dateTime.toISOString().substring(0, 19) + "Z" : this.layerConfig.dateTime.toISOString().substring(0, 10) : null;

            var endpoint = this.layerConfig.endPoint;
            var configSingleton = Config.getInstance();
            if (this.layerConfig.layerProjection === configSingleton.projection.N_POLE) {
                layerProj = '_EN';
            } else if (this.layerConfig.layerProjection === configSingleton.projection.S_POLE) {
                layerProj = '_ES';
            } else if(this.layerConfig.layerProjection === configSingleton.projection.EQUIRECT) {
                layerProj = '_EG';
            }
            switch (level) {
                case 0:
                    //36km products
                    level = 0;
                    tileMatrixSet = "36km";
                    layerProj = layerProj + "36";
                    break;
                case 1:
                    //18km products
                    level = 0;
                    tileMatrixSet = "9km";
                    layerProj = layerProj + "9";
                    break;
                case 2:
                    //9km products
                    level = 1;
                    tileMatrixSet = "9km";
                    layerProj = layerProj + "9";
                    break;
                case 3:
                    //3km products
                    tileMatrixSet = "3km";
                    layerProj = layerProj + "3";
                    level = 0;
                    break;
            }
            var url = endpoint + "?TIME=" + dateTimeString + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=&FORMAT=" + this.layerConfig.wmts.tileFormat + "&LAYER=" +
                this.layerConfig.wmts.tileLayerName + layerProj + "&TILEMATRIXSET=" + tileMatrixSet + "&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col;
            return url;
        }
    });
});