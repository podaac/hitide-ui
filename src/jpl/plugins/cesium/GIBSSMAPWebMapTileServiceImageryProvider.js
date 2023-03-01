define([
    "cesium/Core/combine",
    "cesium/Core/defaultValue",
    "cesium/Core/defined",
    "cesium/Core/freezeObject",
    "cesium/Core/objectToQuery",
    "cesium/Core/queryToObject",
    "cesium/Scene/ImageryProvider",
    "cesium/Scene/WebMapTileServiceImageryProvider",
    "cesium/ThirdParty/Uri",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "jpl/events/DateEvent",
    "jpl/events/LayerEvent"
], function (combine, defaultValue, defined, freezeObject, objectToQuery, queryToObject, ImageryProvider, WebMapTileServiceImageryProvider, Uri, declare, lang, topic, DateEvent, LayerEvent) {
    return declare(WebMapTileServiceImageryProvider, {
        _dateTime: new Date(),
        defaultParameters: freezeObject({
            service: 'WMTS',
            version: '1.0.0',
            request: 'GetTile'
        }),
        temp: null,
        constructor: function (options, threedeeglobeview, layerConfig) {
            WebMapTileServiceImageryProvider.prototype.requestImage = function (x, y, level) {
                var url = this.buildImageUrl(this, x, y, level);
                return ImageryProvider.loadImage(this, url);
            };

            this.threedeeglobeview = threedeeglobeview;
            this.layerConfig = layerConfig;
            if(this.layerConfig.wmts && this.layerConfig.wmts.dateTime) {
                this.setDateTime(new Date(this.layerConfig.wmts.dateTime));
            }

            topic.subscribe(DateEvent.prototype.DATETIME_RANGE_UPDATED, lang.hitch(this, this.dateTimeRangeUpdated));
            topic.subscribe(LayerEvent.prototype.LAYER_CRID_CHANGED, lang.hitch(this, this.cridUpdated));
        },
        dateTimeRangeUpdated: function(evt) {
            this.setDateTime(evt.endDate);
            this.threedeeglobeview.getAndReloadLayer(this.layerConfig);
        },
        cridUpdated: function(evt) {
            if(evt.productLabel === this.layerConfig.productLabel) {
                var newTileLayerName = evt.crid ? evt.baseTileLayerName + "_" + evt.crid : "";
                this._layer = newTileLayerName;
                this.threedeeglobeview.getAndReloadLayer(this.layerConfig);
            }
        },
        setDateTime: function(dateTime) {
            // correct for timezone difference so we always get UTC
            this._dateTime.setTime(dateTime.getTime());
        },
        buildImageUrl: function (imageryProvider, col, row, level) {
            var labels = imageryProvider._tileMatrixLabels;
            var tileMatrix = defined(labels) ? labels[level] : level.toString();
            var url;

            var dateString  = this._dateTime.toISOString().substring(0, 10);
            var dateTimeString = this._dateTime.toISOString().substring(0, 19) + "Z";
            if(!this.layerConfig.wmts.granule) {
                dateTimeString = dateString;
            }

            if (imageryProvider._url.indexOf('{') >= 0) {
                // resolve tile-URL template
                url = imageryProvider._url
                    .replace('{style}', imageryProvider._style)
                    .replace('{Style}', imageryProvider._style)
                    .replace('{TileMatrixSet}', imageryProvider._tileMatrixSetID)
                    .replace('{TileMatrix}', tileMatrix)
                    .replace('{TileRow}', row.toString())
                    .replace('{TileCol}', col.toString());
                url.replace('?', '?time=' + dateTimeString);
            }
            else {
                // build KVP request
                var uri = new Uri(imageryProvider._url);
                var queryOptions = queryToObject(defaultValue(uri.query, ''));

                queryOptions = combine(this.defaultParameters, queryOptions);

                queryOptions.tilematrix = tileMatrix;
                queryOptions.layer = imageryProvider._layer;

                if (level == 0) {
                    queryOptions.layer += "_EG36";
                } else if (level == 1) {
                    queryOptions.layer += "_EG9";
                } else if (level == 2) {
                    queryOptions.layer += "_EG9";
                } else if (level == 3) {
                    queryOptions.layer += "_EG3";
                }

                queryOptions.style = imageryProvider._style;
                queryOptions.tilerow = row;
                queryOptions.tilecol = col;
                queryOptions.tilematrixset = imageryProvider._tileMatrixSetID;
                queryOptions.format = imageryProvider._format;
                queryOptions.time = dateTimeString;

                uri.query = objectToQuery(queryOptions);

                url = uri.toString();
            }

            var proxy = imageryProvider._proxy;
            if (defined(proxy)) {
                url = proxy.getURL(url);
            }

            if (level == 0) {
                url = url.replace(/tilematrixset=\d+km/i, "tilematrixset=36km");
                url = url.replace(/tilematrix=\d+/i, "tilematrix=0");
            } else if (level == 1) {
                url = url.replace(/tilematrixset=\d+km/i, "tilematrixset=9km");
                url = url.replace(/tilematrix=\d+/i, "tilematrix=0");
            } else if (level == 2) {
                url = url.replace(/tilematrixset=\d+km/i, "tilematrixset=9km");
                url = url.replace(/tilematrix=\d+/i, "tilematrix=1");
            } else if (level == 3) {
                url = url.replace(/tilematrixset=\d+km/i, "tilematrixset=3km");
                url = url.replace(/tilematrix=\d+/i, "tilematrix=0");
            }

            return url;
        }
    });
});