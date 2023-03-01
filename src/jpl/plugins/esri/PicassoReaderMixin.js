define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/regexp",
    // "jpl/data/PicassoLayers",
    "esri/geometry/screenUtils",
    "esri/geometry/ScreenPoint"
], function(declare, domConstruct, domStyle, regexp, screenUtils, ScreenPoint) {
    return declare(null, {
        scale: 1,
        offset: 0,
        constructor: function() {
            var re = /__s([\d\-\.]+)o([\d\-\.]+)__/;
            var scaleoffset = re.exec(this.id);
            this.scale = +scaleoffset[1];
            this.offset = +scaleoffset[2];
        },
        _isLittleEndian: function () {
            // from TooTallNate / endianness.js.   https://gist.github.com/TooTallNate/4750953
            var b = new ArrayBuffer(4);
            var a = new Uint32Array(b);
            var c = new Uint8Array(b);
            a[0] = 0xdeadbeef;
            if (c[0] == 0xef) {
                this._isLittleEndian = function () {
                    return true
                };
                return true;
            }
            if (c[0] == 0xde) {
                this._isLittleEndian = function () {
                    return false
                };
                return false;
            }
            throw new Error('unknown endianness');
        },
        _imagetoraw: function (imagedata) {
            var rawdata = new Float32Array(imagedata.data.buffer);
            var imagedata32 = new Uint32Array(imagedata.data.buffer);

            if (this._isLittleEndian()) {
                for(var i = 0; i < imagedata32.length; ++i) {
                    var encoded = imagedata32[i];
                    //console.log(encoded & 0x000000ff);

                    if (encoded == 0) {
                        rawdata[i] = Number.NaN;
                    } else {
                        //var r =  (encoded & 0x000000ff);
                        //var g = ((encoded & 0x0000ff00) >> 8);
                        //var b = ((encoded & 0x00ff0000) >> 16);
                        //var a = ((encoded & 0xff000000) >>> 24);
                        rawdata[i] = ((encoded & 0x00ffffff) / this.scale + this.offset);
                    }
                }
            } else {
                for(var i = 0; i < imagedata32.length; ++i) {
                    var encoded = imagedata32[i];
                    if (encoded == 0) {
                        rawdata[i] = Number.NaN;
                    } else {
                        //var a =  (encoded & 0x000000ff);
                        //var b = ((encoded & 0x0000ff00) >> 8);
                        //var g = ((encoded & 0x00ff0000) >> 16);
                        //var r = ((encoded & 0xff000000) >>> 24);
                        rawdata[i] = (((encoded & 0xff000000) >>> 24) | ((encoded & 0x00ff0000) >> 8)| ((encoded & 0x0000ff00) << 8) / this.scale + this.offset);
                    }
                }
            }
            return {buffer: rawdata};

        },
        colorize: function(min, max, canvas, reset) {
            reset = typeof reset !== 'undefined' ? reset : false;
            if(reset) {
                canvas.highlighterWorker = null;
            }
            var me = this;
            if(canvas.imagedata != null) {
                if(canvas.highlighterWorker == null) {
                    canvas.highlighterWorker = new Worker('jpl/workers/canvashighlighter_le.js');
                    canvas.imgdata = canvas.getContext('2d').createImageData(canvas.width, canvas.height);
                    canvas.highlighterWorker.postMessage({mode: "set", buffer: canvas.imagedata.buffer, colorbar: this.colorLegend.colorData.scale, canvasid:canvas.id});
                    canvas.highlighterWorkerProcessing = false;
                    canvas.highlighterWorker.addEventListener('message', function (e) {
                        var canvas = me._tiles[e.data.canvasid];
                        if (canvas != null && canvas.highlighterWorker != null) {
                            var buf = e.data.buffer;
                            var buf8 = new Uint8ClampedArray(buf);
                            var ctx = canvas.getContext('2d');
                            //var imgdata = ctx.createImageData(canvas.width, canvas.height);
                            canvas.imgdata.data.set(buf8);
                            ctx.putImageData(canvas.imgdata, 0, 0);
                            if(canvas.style.visibility !== 'visible') {
                                canvas.style.visibility = 'visible'; // prevents flash of raw color
                            }
                            if(canvas.highlighterWorkerNext != null) { // if there's a pending job, do it!
                                var temp = canvas.highlighterWorkerNext;
                                canvas.highlighterWorkerNext = temp;
                                canvas.highlighterWorkerNext = null;
                                canvas.highlighterWorker.postMessage({mode: "compute", min: temp[0], max: temp[1]});
                            } else {
                                canvas.highlighterWorkerProcessing = false;
                            }
                        }
                    }, false);
                }

                // blarg, only keep the next one to process (when user is scrubbing).
                canvas.highlighterWorkerNext = [min, max];
                if(!canvas.highlighterWorkerProcessing) { // call webworker immediately if it's not processing
                    canvas.highlighterWorkerProcessing = true;
                    var temp = canvas.highlighterWorkerNext;
                    canvas.highlighterWorkerNext = null;
                    canvas.highlighterWorker.postMessage({mode: "compute", min: temp[0], max: temp[1]});
                }
            }

        },
        resetColors: function() {
            this.highlightRange(this.offset, (Math.pow(2, 24) - 1) / this.scale, false, "rgba(0,0,0,0)");
        },
        highlightRange: function(min, max, cliptoview, background, reset) {
            var me = this;
            if(this._tiles == null) {
                return;
            }
            //if(background != null) {
            //    this._div.style.backgroundColor = background;
            //} else {
            //    this._div.style.backgroundColor = "rgba(0, 0, 0, .666)"
            //}
            var keys = Object.keys(this._tiles);
            var values = keys.map(function(v) { return me._tiles[v]; });
            var extent = this.getMap().extent;
            for(var j = 0; j < values.length; j++) {
                var canvas = values[j];
                // only process ones in view
                //if(!cliptoview || (canvas.ulmap != null && canvas.lrmap != null && canvas.ulmap.x <= extent.xmax && canvas.ulmap.y >= extent.ymin && canvas.lrmap.x >= extent.xmin && canvas.lrmap.y <= extent.ymax)) {
                    this.colorize(min, max, canvas, reset);
                //}
            }
        }
        // _tileLoadHandler: function() {
        //     var img = arguments[0].currentTarget;
        //     var canvas = domConstruct.create("canvas");
        //     var imgid = img.id;

        //     // do/undo what is done in the parent function
        //     this._noDom ? this._standby.push(canvas) : (this._tilePopPop(img));
        //     this._tiles[imgid] = canvas;

        //     // copy img attributes
        //     canvas.style.cssText = img.style.cssText;
        //     canvas.style.visibility = 'hidden';
        //     canvas.className = img.className;
        //     canvas.width = img.width;
        //     canvas.height = img.height;

        //     // generate Picasso data
        //     var ctx = canvas.getContext('2d');
        //     ctx.drawImage(img, 0, 0);
        //     canvas.imagedata = this._imagetoraw(ctx.getImageData(0, 0, canvas.width, canvas.height));

        //     // replace and destroy original img
        //     img.parentNode.replaceChild(canvas, img);
        //     domConstruct.destroy(imgid);
        //     canvas.id = imgid;

        //     // Save the tile to picasso
        //     var map = this.getMap();
        //     var picassoLayers = PicassoLayers.getInstance();
        //     picassoLayers.setMap(map);
        //     picassoLayers.setTileSize(canvas.width, canvas.height);

        //     // save tile bbox
        //     var transform = (domStyle.getComputedStyle(canvas).transform || domStyle.getComputedStyle(canvas).webkitTransform).split(/[,\)]/);
        //     var gptransform = (domStyle.getComputedStyle(canvas.parentNode.parentNode).transform || domStyle.getComputedStyle(canvas.parentNode.parentNode).webkitTransform).split(/[,\)]/);
        //     canvas.ulscreen = new ScreenPoint(+transform[4] + +gptransform[4], +transform[5] + +gptransform[5]);;
        //     canvas.lrscreen = new ScreenPoint(+transform[4] + +gptransform[4] + +canvas.width, +transform[5] + +gptransform[5] +canvas.height);;
        //     canvas.ulmap = screenUtils.toMapPoint(map.extent, map.width, map.height, canvas.ulscreen);
        //     canvas.lrmap = screenUtils.toMapPoint(map.extent, map.width, map.height, canvas.lrscreen);
        //     picassoLayers.addTile(this.id, this.layerConfig.layerTitle || this.layerInfo.title, canvas);

        //     if(this.colorLegend) {
        //         var rangeValues = this.colorLegend.getRangeValues();
        //         this.colorize(rangeValues[0], rangeValues[1], canvas);
        //     } else {
        //         this.colorize(this.offset, (Math.pow(2, 24) - 1) / this.scale, canvas);
        //     }
        // }
    });
});