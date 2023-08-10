define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "dojo/string",
    "dojo/on",
    "dojo/topic",
    "dojo/query",
    "dijit/registry",
    "dojo/dom",
    "dojo/Deferred",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/request/xhr",
    "dojo/dom-style",
    "jpl/dijit/ui/AlertDialog",
    "jpl/events/SearchEvent",
    "jpl/events/MapEvent",
    "jpl/events/GranuleSelectionEvent",
    "jpl/dijit/DatasetController",
    "jpl/dijit/GranulesController",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/GranuleSelection.html',
    "xstyle/css!./css/GranuleSelection.css",
    "jpl/config/Config",
    "jpl/utils/DOMUtil"
], function(declare, lang, has, string, on, topic, query, registry, dom, Deferred, domAttr, domConstruct,
    domClass, xhr, domStyle, AlertDialog, SearchEvent, MapEvent, GranuleSelectionEvent, DatasetController, GranulesController, _WidgetBase, _TemplatedMixin, template, css, Config, DOMUtil) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        datasetGranulesControllers: [],
        activeDataset: null,
        datasetColors: [
            "#9C27B0",
            "#673AB7",
            "#00BCD4",
            "#E91E63",
            "#F44336",
            "#607D8B",
            "#D400A3",
            "#2196F3",
            "#CDDC39",
            "#FFC107",
            "#00D4C4",
            "#009688",
            "#B50404",
            "#4CAF50",
            '#BE7AEF',
            "#EF7AD4",
            "#EF7A7A",
            "#7AEFE0",
            "#9AEF7A"
        ].map(function(x) {
            return [x, false];
        }),
        // }).sort(function() {
        //     // GET RID OF THIS FOR RELASE, TESTING ONLY
        //     return .5 - Math.random();
        // }),

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.config = Config.getInstance();
            this.mapDijit = registry.byId("mainSearchMap");
            this.map = this.mapDijit.equirectMap;

            // Initialize dataset controller
            this.initializeDatasetController();

            this.setSubscriptions();
        },

        initializeDatasetController: function() {
            this.datasetController = new DatasetController();
            this.datasetController.startup();
            domConstruct.place(this.datasetController.domNode, this.datasetControllerContainer);
        },

        setSubscriptions: function() {
            topic.subscribe(SearchEvent.prototype.ADD_DATASET, lang.hitch(this, this.addDataset));
            topic.subscribe(SearchEvent.prototype.REMOVE_DATASET, lang.hitch(this, this.removeDataset));
            topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, function() {
                this.mapDijit = registry.byId("mainSearchMap");
                this.map = this.mapDijit.equirectMap;
            }));
            topic.subscribe(GranuleSelectionEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, lang.hitch(this, this.switchActiveGranulesController));
        },
        addDataset: function(message) {
            // Get next datasetColor if not provided
            if (!message.datasetColor) {
                message.datasetColor = this.getNextDatasetColor();
            }

            // Add dataset to datasetController widget
            this.datasetController.addDataset(message);

            // Search granules for this dataset
            var _context = this;
            topic.publish(SearchEvent.prototype.CANCEL_REQUESTS, {
                target: message.datasetId
            });
            this.searchGranules(message.datasetId, message.startTime, message.endTime, message.bbox, message.source).then(
                function(response) {
                    if(message.source === "cmr"){
                        //var numFound = response.getHeader('cmr-hits');
                        var numFound = response.hits
                        var d = _context.datasetController.updateNumMatchingGranules(message.datasetId, numFound);
                        _context.datasetController.publishGranulesSearchComplete();

                        // Construct new GranulesController for this dataset
                        _context.createNewGranulesController(message, numFound, message.datasetColor);
                    }
                    else{
                        var d = _context.datasetController.updateNumMatchingGranules(message.datasetId, response.response.numFound);
                        _context.datasetController.publishGranulesSearchComplete();

                        // Construct new GranulesController for this dataset
                        _context.createNewGranulesController(message, response.response.numFound, message.datasetColor);
                    }
                },
                function(error) {
                    if (error === "Request canceled") {
                        _context.removeDataset({
                            datasetId: message.datasetId
                        });
                        topic.publish(GranuleSelectionEvent.prototype.REMOVE_DATASET, {
                            datasetId: message.datasetId,
                            datasetShortName: message.datasetShortName
                        });
                        new AlertDialog({
                            alertTitle: "Server Error",
                            alertMessage: "Unable to fetch granules for: " + message.datasetShortName
                        }).startup();
                    }
                }
            );
        },
        updateAllDatasets: function(startDate, endDate, region) {
            // Update all to new startDate, endDate, region
            var laoWidget = registry.byId("LegendsAndOpacity");
            var oldDatasets = this.datasetController.datasetStore.query();
            for (var i = 0; i < oldDatasets.length; i++) {
                var d = oldDatasets[i];
                // Remove the old dataset
                laoWidget.removeDataset({
                    datasetId: d["DatasetId"]
                });
                this.removeDataset({
                    datasetId: d["DatasetId"]
                });
                // Add the new dataset
                laoWidget.addDataset({
                    datasetId: d["DatasetId"],
                    datasetShortName: d["DatasetShortName"],
                    startTime: startDate,
                    endTime: endDate,
                    bbox: region,
                    datasetColor: d["datasetColor"]
                });
                this.addDataset({
                    datasetId: d["DatasetId"],
                    datasetShortName: d["DatasetShortName"],
                    startTime: startDate,
                    endTime: endDate,
                    bbox: region,
                    datasetStartDate: d["datasetStartDate"],
                    datasetEndDate: d["datasetEndDate"],
                    datasetColor: d["datasetColor"],
                    source : d["source"]
                });
            }
        },
        createNewGranulesController: function(message, numMatchingSearch, datasetColor) {
            var gController = new GranulesController({
                datasetId: message.datasetId,
                datasetShortName: message.datasetShortName,
                startTime: message.startTime,
                endTime: message.endTime,
                bbox: message.bbox,
                numMatchingSearch: numMatchingSearch,
                visible: false,
                datasetColor: datasetColor,
                source: message.source
            });
            gController.startup();

            // Add granulesController to datasetGranulesControllers
            this.datasetGranulesControllers[message.datasetId] = gController;
            domConstruct.place(gController.domNode, this.granulesControllerContainer);
        },
        switchActiveGranulesController: function(message) {
            if (!message.datasetId) {
                if (this.activeDataset) {
                    this.datasetGranulesControllers[this.activeDataset].hide();
                    this.activeDataset = null;
                }
                domStyle.set(this.granulesControllerDefaultMessage, "display", "block");
            } else {
                domStyle.set(this.granulesControllerDefaultMessage, "display", "none");
                if (this.activeDataset) {
                    this.datasetGranulesControllers[this.activeDataset].hide();
                }
                this.activeDataset = message.datasetId;
                this.datasetGranulesControllers[this.activeDataset].show();
                this.datasetGranulesControllers[this.activeDataset].granuleGrid.resize();
            }
        },
        removeDataset: function(message) {
            // Remove from datasets
            this.datasetController.removeDataset(message.datasetId);

            // If dataset exists
            if (this.datasetGranulesControllers[message.datasetId]) {
                // Free the dataset color
                this.freeDatasetColor(this.datasetGranulesControllers[message.datasetId].datasetColor);
                // Remove granulesController
                this.datasetGranulesControllers[message.datasetId].clearFootprintsAndPreviews();
                this.datasetGranulesControllers[message.datasetId].clearListeners();
                this.datasetGranulesControllers[message.datasetId].destroy();
                delete this.datasetGranulesControllers[message.datasetId];
            }

        },

        getNextDatasetColor: function() {
            var nextColor;
            for (var i = 0; i < this.datasetColors.length; i++) {
                var c = this.datasetColors[i];
                if (!c[1]) {
                    nextColor = c[0];
                    this.datasetColors[i][1] = true;
                    return nextColor;
                }
            }
            // Case we no color available
            console.warn("All out of colors!");
            var randColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            this.datasetColors.push([randColor, true]);
            return randColor;
        },

        freeDatasetColor: function(color) {
            // Free up this dataset color
            for (var i = 0; i < this.datasetColors.length; i++) {
                var c = this.datasetColors[i];
                if (c[0] === color) {
                    this.datasetColors[i][1] = false;
                    return;
                }
            }
        },

        searchGranules: function(datasetId, startTime, endTime, bbox, source) {
            var deferred = new Deferred();
            // Otherwise fetch variables
            var r;
            var topicHandler = topic.subscribe(SearchEvent.prototype.CANCEL_REQUESTS, function(message) {
                if (message.target === "*" || message.target === datasetId) {
                    r.cancel();
                }
            });

            var url;
            var withCredentials = false;
            if(source == "cmr"){
                url = this.config.hitide.externalConfigurables.cmrGranuleSearchService + "?";
                url += "concept_id=" + datasetId;
                url += "&bounding_box[]=" + (bbox ? bbox : "");
                url += "&temporal[]=" + DOMUtil.prototype.dateFormatISOBeginningOfDay(startTime) + "," + DOMUtil.prototype.dateFormatISOEndOfDay(endTime);
                url += "&page_size=0"
                withCredentials = this.config.hitide.externalConfigurables.crossOriginCmrCookies;
            }

            var _context = this;

            r = xhr.get(url, {
                headers: {
                    "X-Requested-With": null
                },
                withCredentials: withCredentials,
                handleAs: "json",
                method: "get"
            }).then(function(response) {
                // Unsubscribe from cancel requests
                topicHandler.remove();
                deferred.resolve(response);
            }, function(err) {
                // Unsubscribe from cancel requests
                topicHandler.remove();
                deferred.reject(err);
            });
            return deferred.promise;

        }
    });
});
