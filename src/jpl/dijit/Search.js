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
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Search.html',
    "xstyle/css!./css/Search.css",
    'dojo/store/Memory',
    'dojo/store/Observable',
    'dgrid/OnDemandGrid',
    'dgrid/Keyboard',
    'dgrid/Selection',
    "jpl/dijit/FacetSelector",
    "jpl/dijit/SearchFacetTagContainer",
    "jpl/dijit/TemporalFacet",
    "jpl/dijit/SpatialFacet",
    "jpl/data/BaseMaps",
    "jpl/utils/MapUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/GranuleSelectionEvent",
    "jpl/events/SearchEvent",
    "jpl/events/MyDataEvent",
    "jpl/events/MapEvent",
    "jpl/events/NavigationEvent",
    "jpl/utils/DOMUtil",
    "jpl/config/Config",
    "jpl/dijit/ui/AlertDialog",
    "jpl/dijit/ui/MetadataDialog",
    'bootstrap/Dropdown',
    "bootstrap/Tooltip",
    "bootstrap/Collapse",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "moment/moment",
    "jpl/utils/SearchDatasets",
    "jpl/dijit/ui/HelpDialog"
], function(declare, lang, has, string, on, topic, query, registry, dom, Deferred, domAttr, domConstruct, domClass, xhr, domStyle, _WidgetBase, _TemplatedMixin,
    template, css, Memory, Observable, OnDemandGrid, Keyboard, Selection, FacetSelector, SearchFacetTagContainer, TemporalFacet, SpatialFacet,
    BaseMaps, MapUtil, BrowserEvent, GranuleSelectionEvent, SearchEvent, MyDataEvent, MapEvent, NavigationEvent, DOMUtil, Config, AlertDialog, MetadataDialog,
    Dropdown, Tooltip, Collapse, SimpleFillSymbol, SimpleLineSymbol, Color, moment, SearchDatasets, HelpDialog) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        datasetGrid: null,
        dateRangeSelector: null,
        regionSelector: null,
        initialSearch: null,
        addedDatasets: [],
        bboxGraphic1: null,
        bboxGraphic2: null,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.config = Config.getInstance();
            topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, function() {
                this.basemapSingleton = BaseMaps.getInstance();
                this.mapDijit = registry.byId("mainSearchMap");
                this.map = this.mapDijit.equirectMap;
            }));

            // Have to keep a mapping from DMAS facet IDs to L2SS facet ids
            this.searchFacetMapping = this.config.hitide.searchFacetMapping;

            this.granuleSelection = registry.byId("GranuleSelection").content;

            // Initialize facetSelector
            this.initializeFacetSelector();

            // Initialize search facet tag container
            this.initialSearchFacetTagContainer();

            // Initialize date range selector
            this.initializeDateRangeSelector();

            // Initialize region selector
            this.initializeRegionSelector();

            // Initialize dataset results grid
            this.initializeDatasetGrid();

            // Set click listeners
            this.setClickListeners();

            // Set bbox color 
            this.fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.9]), 2),
                new Color([255, 0, 0, 0.0])
            );

            // Initialize facets, then publish SEARCH_LOADED
            var _context = this;
            this.searchDatasets().then(function(results) {
                topic.subscribe(SearchEvent.prototype.DATE_CHANGE, lang.hitch(_context, _context.dateChange));
                topic.subscribe(SearchEvent.prototype.BBOX_CHANGE, lang.hitch(_context, _context.bboxChange));
                topic.subscribe(SearchEvent.prototype.ADD_FACET, lang.hitch(_context, _context.addFacet));
                topic.subscribe(SearchEvent.prototype.REMOVE_FACET, lang.hitch(_context, _context.removeFacet));
                topic.subscribe(GranuleSelectionEvent.prototype.REMOVE_DATASET, lang.hitch(_context, _context.deselectDataset));
                topic.subscribe(GranuleSelectionEvent.prototype.REMOVE_ALL_DATASETS, lang.hitch(_context, _context.deselectAllDatasets));
                topic.subscribe(SearchEvent.prototype.DATASET_COUNT_CHANGE, lang.hitch(_context, _context.updateAddedDatasetsDisplay));
                topic.subscribe(SearchEvent.prototype.SET_DATASETS_TO_LOAD, lang.hitch(_context, _context.setDatasetsToLoad));
                topic.subscribe(SearchEvent.prototype.TRIGGER_SEARCH, lang.hitch(_context, function() {
                    _context.searchDatasets(true);
                }));
                topic.subscribe(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, lang.hitch(_context, function() {
                    _context.searchDatasets(true);
                }));
                topic.subscribe(GranuleSelectionEvent.prototype.GRANULES_SEARCH_COMPLETE, lang.hitch(_context, _context.updateAddedDatasetsDisplay));
                topic.subscribe(BrowserEvent.prototype.FINISHED_RESIZING, lang.hitch(_context, _context.windowResized));

                // Populate facets
                var facets = results.facets;
                _context.facetSelector.addFacetItems(facets);
                _context.searchFacetTagContainer.addFacetItems(facets);

                // Populate search results with initial results from date range and region
                var datasets = results.datasets;
                var obj = {};
                datasets.forEach(function(val) {
                    obj[val["Dataset-PersistentId"]] = val;
                });
                _context.initialSearch = obj;
                topic.publish(SearchEvent.prototype.SEARCH_LOADED, {
                    success: true
                });
            }, function(error) {
                new AlertDialog({
                    alertTitle: "Server Error",
                    alertMessage: "Unable to initialize dataset facets. Please try again later."
                }).startup();
                topic.publish(SearchEvent.prototype.SEARCH_LOADED, {
                    success: false
                });
            });
        },

        initializeFacetSelector: function() {
            this.facetSelector = new FacetSelector();
            this.facetSelector.startup();
            domConstruct.place(this.facetSelector.domNode, this.facetSelectorNode);
        },

        initialSearchFacetTagContainer: function() {
            this.searchFacetTagContainer = new SearchFacetTagContainer({
                searchFacetMapping: this.searchFacetMapping
            });
            this.searchFacetTagContainer.startup();
            domConstruct.place(this.searchFacetTagContainer.domNode, this.activeSearchOptionsContainer);
        },

        initializeDateRangeSelector: function() {
            this.dateRangeSelector = new TemporalFacet();
            this.dateRangeSelector.startup();
        },

        initializeRegionSelector: function() {
            this.regionSelector = new SpatialFacet();
            this.regionSelector.startup();
        },

        compareDates: function(d1, d2) {
            return d1.isSame(d2, "day");
        },

        initializeDatasetGrid: function() {
            var _context = this;
            this.dateToday = moment.utc();
            this._monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
            var columns = [{
                field: "Add",
                label: "Select",
                sortable: false,
                renderCell: function(obj) {
                    var cellContent = domConstruct.create("div", {});
                    var className = !obj.Add ? "fa-square-o addDatasetCB" : "fa-check-square removeDatasetCB";
                    var btn = domConstruct.toDom("<span class='fa " + className + "'></span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        obj.Add = !obj.Add;
                        _context.datasetGrid.store.put(obj);
                        if (obj.Add) {
                            topic.publish(SearchEvent.prototype.ADD_DATASET, {
                                datasetId: obj["Dataset-PersistentId"],
                                datasetShortName: obj["Dataset-ShortName"],
                                startTime: _context.dateRangeSelector.getStartDate(),
                                endTime: _context.dateRangeSelector.getEndDate(),
                                bbox: _context.regionSelector.getRoundedBbox(),
                                datasetStartDate: obj["DatasetCoverage-StartTimeLong"],
                                datasetEndDate: obj["DatasetCoverage-StopTimeLong"],
                                source : obj.source
                            });
                        } else {
                            topic.publish(SearchEvent.prototype.REMOVE_DATASET, {
                                datasetId: obj["Dataset-PersistentId"]
                            });
                        }
                    });
                    return cellContent;
                }
            }, {
                field: "Info",
                label: "",
                sortable: false,
                renderCell: function(obj) {
                    var cellContent = domConstruct.create("div", {});
                    var btn;
                    btn = domConstruct.toDom("<span class='fa fa-info-circle metadataButton'></span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        new MetadataDialog({
                            dataset: obj,
                            datasetId: obj["Dataset-PersistentId"],
                            datasetShortName: obj["Dataset-ShortName"],
                            initialSearch: _context.initialSearch,
                            addedDatasets: jQuery.extend(true, {}, _context.addedDatasets)
                        }).startup();
                    });
                    return cellContent;
                }
            }, {
                field: "Dataset-ShortName",
                label: "Name",
                renderCell: function(obj) {
                    var element = domConstruct.toDom("<span>" + obj["Dataset-ShortName"] + "</span>");
                    return element;
                }
            }, {
                field: "DatasetCoverage-StartTimeLong",
                label: "Start Date",
                formatter: function(value) {
                    return _context.dateToString(value);
                }
            }, {
                field: "DatasetCoverage-StopTimeLong",
                label: "End Date",
                formatter: function(value) {
                    return _context.dateToString(value);
                }
            }];

            var data = {};
            data.items = {};
            data.identifier = "Dataset-PersistentId";
            data.label = "Dataset-ShortName";

            var store = new Observable(new Memory({
                data: data
            }));

            // Initialize the OnDemandGrid with keyboard controls and multiple selection
            this.datasetGrid = new(declare([OnDemandGrid, Keyboard, Selection]))({
                store: store,
                columns: columns,
                sort: "Dataset-ShortName",
                selectionMode: "single",
                cellNavigation: false,
                loadingMessage: "Searching...",
                noDataMessage: "<div class='searchNoDataMessage'>No Datasets Matching Query</div>"
            }, 'datasetGrid');

            this.datasetGrid.startup();
        },

        setClickListeners: function() {
            on(this.searchDiv, ".tabSwitchLink:click", lang.hitch(this, function(evt) {
                topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                    tabID: evt.target.getAttribute("rel")
                });
            }));
            on(this.dateRangeSelectorBtn, "click", lang.hitch(this, function() {
                this.dateRangeSelector.show();
            }));
            on(this.regionSelectorBtn, "click", lang.hitch(this, function() {
                this.regionSelector.show();
            }));
        },

        windowResized: function(message) {
            // Resize table
            domStyle.set(this.datasetGrid.domNode, "height", (document.body.clientHeight - 700) + 210 + "px");
        },

        setDatasetsToLoad: function(message) {
            // Remove all currently added datasets
            var allAddedIds = this.granuleSelection.datasetController.getAllActiveDatasets();
            var datasetsToRemove = allAddedIds.filter(function(x) {
                return message.datasetsToLoad.indexOf(x["DatasetId"]) === -1;
            })
            this.deselectAllDatasets({ datasets: datasetsToRemove });

            // Load requested datasets
            var datasetIds = message.datasetsToLoad;
            for (var i = 0; i < datasetIds.length; i++) {
                // Verify that dataset id is in the initial listing
                var id = datasetIds[i];
                if (!this.initialSearch.hasOwnProperty(id)) {
                    console.warn("UNABLE TO LOAD DATASET WITH ID FROM CONFIG", id);
                    continue;
                }
                var obj = this.initialSearch[id];
                // Add all datasets via datasetId
                topic.publish(SearchEvent.prototype.ADD_DATASET, {
                    datasetId: obj["Dataset-PersistentId"],
                    datasetShortName: obj["Dataset-ShortName"],
                    startTime: this.dateRangeSelector.getStartDate(),
                    endTime: this.dateRangeSelector.getEndDate(),
                    bbox: this.regionSelector.getRoundedBbox(),
                    datasetStartDate: obj["DatasetCoverage-StartTimeLong"],
                    datasetEndDate: obj["DatasetCoverage-StopTimeLong"],
                    source : obj.source
                });
            }
        },

        getSelectedFacets: function() {
            var facets = {};

            var selectedFacets = this.facetSelector.getSelectedFacets();
            var facetKeys = Object.keys(selectedFacets);
            for (var i = 0; i < facetKeys.length; i++) {
                var facetKey = facetKeys[i];
                var niceFacetKey = this.searchFacetMapping[facetKey];
                facets[niceFacetKey] = [];
                selectedFacets[facetKey].forEach(function(x) {
                    facets[niceFacetKey].push(x.label);
                });
            }

            return facets;
        },

        fetchDatasets: function() {
            var startTime = DOMUtil.prototype.dateFormatISOBeginningOfDay(this.dateRangeSelector.getStartDate());
            var endTime = DOMUtil.prototype.dateFormatISOEndOfDay(this.dateRangeSelector.getEndDate())
            var bbox = this.regionSelector.getRoundedBbox();
            var facets = this.getSelectedFacets();

            var requestId = Date.now();
            this.latestRequestId = requestId;

            var _context = this;
            return SearchDatasets.search({
                startTime: startTime,
                endTime: endTime,
                bbox: bbox,
                facets: facets
            }).then(function(response) {
                if(requestId !== _context.latestRequestId) {
                    throw new Error("Request canceled");
                }
                return response;
            });
        },

        searchDatasets: function(resetDatasets) {
            var dfd = new Deferred();
            // Set loading
            var el = "Searching Datasets <span class='fa fa-spinner fa-spin'>";
            domAttr.set(this.searchNumResults, "innerHTML", el);
            var _context = this;
            this.fetchDatasets().then(lang.hitch(this, function(response) {
                // Format results
                var data = _context.formatDatasetResponse(response.response.docs);
                this.updateDatasetGrid(response, data);
                this.updateFacetSelector(response);
                if (resetDatasets) {
                    this.updateGranuleSelectionDatasets();
                }
                dfd.resolve({
                    facets: response.facet_counts.facet_fields,
                    datasets: data
                });
            }), function(error) {
                if (error.message !== "Request canceled") {
                    new AlertDialog({
                        alertTitle: "Server Error",
                        alertMessage: "Unable to search datasets. Please try again later."
                    }).startup();
                    domAttr.set(_context.searchNumResults, "innerHTML", "<span style='color:red'>Search failed, please try again later.</span>");
                }
                dfd.reject(error);
            });
            return dfd.promise;
        },

        updateGranuleSelectionDatasets: function() {
            this.granuleSelection.updateAllDatasets(
                this.dateRangeSelector.getStartDate(),
                this.dateRangeSelector.getEndDate(),
                this.regionSelector.getRoundedBbox()
            );
        },

        updateDatasetGrid: function(response, responseData) {
            var data = {};
            data.items = responseData;
            // Set checked based off datasetController in GranuleSelection
            for (var i = 0; i < data.items.length; i++) {
                var d = this.granuleSelection.datasetController.getDataset(data.items[i]["Dataset-PersistentId"]);
                if (d) {
                    data.items[i].Add = true;
                }
            }
            data.identifier = "Dataset-PersistentId";
            data.label = "Dataset-ShortName";

            // Initialize the dstore from the data received
            var store = new Observable(new Memory({
                data: data
            }));

            this.datasetGrid.set("store", store);

            // Update results label
            if (response.response.numFound !== response.response.docs.length) {
                console.warn("WARNING: Number of results found does not match number of docs returned.");
            }
            var resultMessage = "Found " + response.response.docs.length + " matching datasets";
            domAttr.set(this.searchNumResults, "innerHTML", resultMessage);
        },

        dateToString: function(value) {
            return (isNaN(value) ? "Invalid Date" : (this.compareDates(value, this.dateToday) ? "Today" :
                this._monthNames[value.month()] + " " + value.date() + ", " + value.year()));
        },

        dateChange: function(message) {
            if (message.origin === "config") {
                return;
            }
            if (!message.noSearch) {
                this.searchDatasets(message.resetDatasets);
            }

            // Update label
            var label = "";
            if (message.dateRangeWasUndefined) {
                label = "SELECT DATE RANGE";
            } else {
                label = this.dateToString(message.startDate) + " – " + this.dateToString(message.endDate);
            }
            domAttr.set(this.dateRangeLabel, "innerHTML", label);
        },

        bboxChange: function(message) {
            if (!message.noSearch) {
                this.searchDatasets(message.resetDatasets);
            }
            // Update label
            var label = "";
            if (message.bboxWasUndefined) {
                label = "SELECT REGION";
            } else {
                label = message.bbox.join(", ");
            }

            domAttr.set(this.regionLabel, "innerHTML", label);

            // Update Map
            this.drawBbox(message.bbox);
        },

        addFacet: function(message) {
            this.searchDatasets();
            this.searchFacetTagContainer.addFacet({
                facetKey: message.facetKey,
                facetValue: message.facetValue
            });
        },
        
        removeFacet: function(message) {
            this.searchDatasets();
        },

        formatDatasetResponse: function(docs) {
            // Formats solr docs into store format. For each field, solr returns an array of objs.
            // For now, just take the first item in the array. If multiple objs, concatenate them?
            // Additionally, for known date time fields, parse them into dates
            return docs.map(function(obj) {
                var formattedObjs = {};
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length; i++) {
                    var valueArr = obj[keys[i]];
                    var value = Array.isArray(valueArr) ? valueArr.join(" AND ") : valueArr;
                    if (keys[i] === "DatasetCoverage-StartTimeLong" ||
                        keys[i] === "DatasetCoverage-StopTimeLong") {
                        value = value ? moment.utc(parseInt(value)) : moment.utc();
                    }
                    formattedObjs[keys[i]] = value;
                }
                formattedObjs.Add = false;
                return formattedObjs;
            });
        },

        updateFacetSelector: function(response) {
            this.facetSelector.updateFacets(response.facet_counts.facet_fields);
        },

        deselectDataset: function(message) {
            var obj = this.datasetGrid.store.get(message.datasetId);
            if (obj) {
                // Update state if dataset in store
                obj.Add = false;
                this.datasetGrid.store.put(obj);
            }
            topic.publish(SearchEvent.prototype.REMOVE_DATASET, {
                datasetId: message.datasetId
            });
        },

        deselectAllDatasets: function(message) {
            var datasets = message.datasets;
            for (var i = 0; i < datasets.length; i++) {
                var d = datasets[i];
                this.deselectDataset({
                    datasetId: d.DatasetId
                })
            }
        },

        drawBbox: function(bbox) {
            // Draws bbox on non-wraparound map
            // Remove old graphics
            if (this.bboxGraphic1) {
                this.map.graphics.remove(this.bboxGraphic1);
            }
            if (this.bboxGraphic2) {
                this.map.graphics.remove(this.bboxGraphic2);
            }
            // Convert bbox from 180 to Inf coordinate space
            var bboxInf = MapUtil.prototype.convert180CoordsToInf(bbox);
            // If bbox wraps, split down dateline and draw 2 polygons
            if (bboxInf[0] < -180 || bboxInf[2] > 180) {
                var gs = MapUtil.prototype.createWrapAroundPolygonGraphic(bboxInf, this.map, this.fillSymbol);
                this.bboxGraphic1 = gs[0];
                this.bboxGraphic2 = gs[1];
                this.map.graphics.add(this.bboxGraphic1);
                this.map.graphics.add(this.bboxGraphic2);
            } else {
                this.bboxGraphic1 = MapUtil.prototype.createPolygonGraphic(bboxInf, this.map, this.fillSymbol);
                this.map.graphics.add(this.bboxGraphic1);
            }

        },

        updateAddedDatasetsDisplay: function(message) {
            var newObj = {};
            var _context = this;
            message.addedDatasets.forEach(function(val) {
                newObj[val.DatasetId] = _context.initialSearch[val.DatasetId];
            });
            this.addedDatasets = newObj;
            domAttr.set(this.addedDatasetsDisplay, "innerHTML", "");
            for (var i = 0; i < message.count; i++) {
                var matching = message.addedDatasets[i]["MatchingGranules"];
                var matchingText = matching === -1 ? "Finding granules..." : matching + " matching granules";
                var content = domConstruct.toDom("<div class='searchAddedDatasetItem'>" + message.addedDatasets[i]["DatasetShortName"] +
                    " – <i>" + matchingText + "</i>" + "</div>");
                domConstruct.place(content, this.addedDatasetsDisplay);
            }
        }
    });
});
