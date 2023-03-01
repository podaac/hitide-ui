define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/request/xhr",
    "dojo/dom-class",
    'dojo/store/Memory',
    'dojo/store/Observable',
    'dgrid/OnDemandGrid',
    'dgrid/Selection',
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/Button",
    'dojo/text!./templates/DatasetController.html',
    "xstyle/css!./css/DatasetController.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/events/GranuleSelectionEvent",
    "jpl/utils/MapUtil",
    "jpl/events/SearchEvent",
    "jpl/events/MyDataEvent",
    "jpl/events/DownloadsEvent",
    "jpl/config/Config",
    "dojo/_base/fx",
    "dojo/fx/easing",
    "jpl/dijit/ui/AlertDialog"
], function(declare, lang, on, topic, dom, domStyle, domConstruct, query, xhr, domClass, Memory, Observable, OnDemandGrid, Selection, registry, _WidgetBase, _TemplatedMixin,
    Button, template, css, AnimationUtil, BrowserEvent, MapEvent, GranuleSelectionEvent, MapUtil, SearchEvent, MyDataEvent, DownloadsEvent, Config, baseFx, easing, AlertDialog) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        datasetStore: null,
        datasetGrid: null,
        granulesCollection: {},
        mapDijit: null,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            // Get config
            this.config = Config.getInstance();
            // Initialize the store
            var data = {};
            data.items = [];
            data.identifier = "DatasetId";
            data.label = "DatasetShortName";
            this.datasetStore = new Observable(new Memory({
                data: data
            }));

            // Init columns
            var columns = [{
                field: "DatasetShortName",
                label: "Selected Datasets",
                renderCell: function(obj) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='datasetControllerDatasetColor' style='color:" +
                        obj.datasetColor + "'>●</span>" + obj.DatasetShortName);
                    domConstruct.place(btn, cellContent);
                    return cellContent;
                }
            }, {
                field: "MatchingGranules",
                label: "Matching Granules",
                formatter: function(value) {
                    if (value === -1) {
                        return "Searching...";
                    } else {
                        return value;
                    }
                }

            }, {
                field: "Download",
                label: "",
                renderHeaderCell: function(node) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='icon-in downloadDatasetIcon'></span>");
                    domConstruct.place(btn, cellContent);

                    on(btn, "click", function(evt) {
                        // get list of all active datasets
                        var datasetList = _context.datasetStore.query();

                        // make sure there are datasets to download
                        var blocked = [];
                        if (datasetList.length > 0) {
                            for (var i = 0; i < datasetList.length; ++i) {
                                var dataset = datasetList[i]; // reference dataset for date/region
                                if (!dataset.downloadChecked) {
                                    if (!_context.addEntireDatasetDownload(dataset)) {
                                        blocked.push(dataset);
                                    }
                                }
                            }
                        }
                        if (blocked.length > 0) {
                            new AlertDialog({
                                alertTitle: "Alert",
                                alertMessage: "<div>The following datasets either have no matching granules or are greater than the " + 
                                            _context.config.hitide.externalConfigurables.maxGranulesPerDownload + " granule limit and will not be added to DOWNLOADS:</div><br><ul>" + blocked.map(function(x) {
                                    return "<li style='font-weight:400'>" + x.DatasetShortName + "</li>";
                                }).join("") + "</ul>"
                            }).startup();
                        }
                    });
                    return cellContent;
                },
                sortable: false,
                renderCell: function(obj) {
                    var cellContent = domConstruct.create("div", {});
                    var c = !obj.downloadChecked ? "icon-in downloadDatasetIcon" : "fa fa-check-circle success-check";
                    var btn = domConstruct.toDom("<span id='" + obj.DatasetId + "_download_btn' class='" + c + "'></span>");
                    domConstruct.place(btn, cellContent);

                    var listener = on(btn, "click", function(evt) {
                        var dataset = obj;
                        if (!_context.addEntireDatasetDownload(dataset)) {
                            new AlertDialog({
                                alertTitle: "Alert",
                                alertMessage: "<div><span style='font-weight:400'>" + dataset.DatasetShortName + "</span> either has has no matching granules or is greater than the " +
                                 _context.config.hitide.externalConfigurables.maxGranulesPerDownload + " granule limit and will not be added to DOWNLOADS."
                            }).startup();
                        }
                    });

                    return cellContent;
                }
            }, {
                field: "Remove",
                label: "",
                renderHeaderCell: function(node) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='removeDatasetIcon'>&times;</span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        topic.publish(GranuleSelectionEvent.prototype.REMOVE_ALL_DATASETS, {
                            datasets: _context.datasetStore.query()
                        });
                    });
                    return cellContent;
                },
                sortable: false,
                renderCell: function(obj) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='removeDatasetIcon'>&times;</span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        topic.publish(GranuleSelectionEvent.prototype.REMOVE_DATASET, {
                            datasetId: obj.DatasetId,
                            datasetShortName: obj.DatasetShortName
                        });
                    });

                    return cellContent;
                }
            }];
            // Initialize the OnDemandGrid
            this.datasetGrid = new(declare([OnDemandGrid, Selection]))({
                store: this.datasetStore,
                columns: columns,
                sort: "DatasetShortName",
                selectionMode: "single",
                cellNavigation: false,
                noDataMessage: "<div class='datasetControllerNoDataMessage'>Select Datasets in Search Datasets</div>",
                allowSelect: function(row) {
                    return row.data.MatchingGranules !== -1;
                }
            }, this.datasetControllerGrid);
            this.datasetGrid.startup();

            // Row selection configuration
            var _context = this;
            this.datasetGrid.on('dgrid-select', function(event) {
                var selectedDatasetId = event.rows[0].id;
                topic.publish(GranuleSelectionEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, {
                    datasetId: selectedDatasetId
                });
            });
            this.datasetGrid.on('dgrid-deselect', function(event) {
                var selectedDatasetId = event.rows[0].id;
                topic.publish(GranuleSelectionEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, {
                    datasetId: null
                });
            });

            topic.subscribe(GranuleSelectionEvent.prototype.VARIABLES_FETCHED, lang.hitch(this, this.handleVariablesFetched));
            topic.subscribe(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY_NOTIFY, lang.hitch(this, this.handleRemoveDownloadQueryNotify));
            topic.subscribe(DownloadsEvent.prototype.JOB_SUBMITTED, lang.hitch(this, this.clearDownloadsInTable));
        },
        // setActive: function(datasetId) {
        //     var dataset = this.datasetStore.get(datasetId);
        //     if (!dataset) {
        //         console.log("ERROR: Could not find dataset:", datasetId, ", unable to set active");
        //         return;
        //     }
        //     this.datasetStore.put(dataset);
        // },
        addDataset: function(message) {
            if (this.datasetStore.get(message.datasetId)) {
                return;
            }
            var dataset = {
                DatasetId: message.datasetId,
                DatasetShortName: message.datasetShortName,
                MatchingGranules: -1,
                StartTime: message.startTime,
                EndTime: message.endTime,
                Download: false,
                Remove: false,
                BBox: message.bbox,
                datasetColor: message.datasetColor,
                datasetStartDate: message.datasetStartDate,
                datasetEndDate: message.datasetEndDate,
                source: message.source
            }
            this.datasetStore.put(dataset);

            // Publish new dataset count for Tab Display
            this.publishDatasetChange();
        },

        removeDataset: function(datasetId) {
            if (!this.datasetStore.get(datasetId)) {
                return;
            }
            this.datasetStore.remove(datasetId);

            // Publish new dataset count for Tab Display
            this.publishDatasetChange();

            // Cancel dataset network requests
            // topic.publish(GranuleSelectionEvent.prototype.CANCEL_REQUESTS, {
            //     target: datasetId
            // })
        },
        updateNumMatchingGranules: function(datasetId, count) {
            // Update number of granules matching the dataset matching
            // datasetId.
            var dataset = this.datasetStore.get(datasetId);
            if (!dataset) {
                console.log("Warning, tried to update num matching granules for dataset not in granuleSelection");
                return;
            }
            dataset.MatchingGranules = count;
            this.datasetStore.put(dataset);
        },
        publishDatasetChange: function() {
            var q = this.datasetStore.query();
            topic.publish(SearchEvent.prototype.DATASET_COUNT_CHANGE, {
                count: q.length,
                addedDatasets: q
            });
        },

        publishGranulesSearchComplete: function() {
            var q = this.datasetStore.query();
            topic.publish(GranuleSelectionEvent.prototype.GRANULES_SEARCH_COMPLETE, {
                count: q.length,
                addedDatasets: q
            });
        },
        getAllActiveDatasets: function() {
            return this.datasetStore.query();
        },
        getDataset: function(datasetId) {
            return this.datasetStore.get(datasetId);
        },
        handleVariablesFetched: function(message) {
            var dataset = this.datasetStore.get(message.datasetId);
            if (dataset) {
                dataset.variables = message;
                this.datasetStore.put(dataset);
            }
        },
        addEntireDatasetDownload: function(dataset) {
            // Block 0 granule downloads and > max granule downloads
            if (dataset.MatchingGranules < 1 || dataset.MatchingGranules > this.config.hitide.externalConfigurables.maxGranulesPerDownload) {
                return false;
            }
            if (!dataset.downloadChecked) {
                var queryId = Math.floor(Math.random() * (9999999999 - 0)) + 0;
                topic.publish(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, {
                    datasetId: dataset.DatasetId,
                    datasetShortName: dataset.DatasetShortName,
                    startDate: dataset.StartTime.format("YYYY/MM/DD"),
                    endDate: dataset.EndTime.format("YYYY/MM/DD"),
                    numSelected: dataset.MatchingGranules,
                    bbox: dataset.BBox.toString(),
                    variables: dataset.variables,
                    granuleNames: [],
                    granuleNamesFilter: null,
                    notifyOnRemove: true,
                    queryId: queryId,
                    source: dataset.source
                });
                var downloadBtn = dom.byId(dataset.DatasetId + "_download_btn");
                domClass.remove(downloadBtn, 'downloadDatasetIcon');
                domClass.add(downloadBtn, 'fa');
                domClass.add(downloadBtn, 'fa-check-circle-o');
                domClass.add(downloadBtn, 'success-check');
                dataset.downloadChecked = true;
                dataset.queryId = queryId;
                this.datasetStore.put(dataset);
                return true;
            } else {
                // Remove this dataset
                topic.publish(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, {
                    queryId: dataset.queryId,
                    numSelected: dataset.MatchingGranules
                })
                return true;
            }
        },
        handleRemoveDownloadQueryNotify: function(message) {
            var datasetId = message.datasetId;
            var dataset = this.getDataset(datasetId);
            // Case where dataset is no longer in dataset store
            if (!dataset) {
                return;
            }
            if (message.queryId !== dataset.queryId) {
                return;
            }
            dataset.downloadChecked = false;
            this.datasetStore.put(dataset);

            var downloadBtn = dom.byId(dataset.DatasetId + "_download_btn");
            domClass.add(downloadBtn, 'downloadDatasetIcon');
            domClass.remove(downloadBtn, 'fa');
            domClass.remove(downloadBtn, 'fa-check-circle');
            domClass.remove(downloadBtn, 'success-check');
        },
        clearDownloadsInTable: function(message) {
            // get list of all active datasets
            var datasetList = this.datasetStore.query();

            // make sure there are datasets to download
            if (datasetList.length > 0) {
                for (var i = 0; i < datasetList.length; ++i) {
                    var dataset = datasetList[i]; // reference dataset for date/region
                    dataset.downloadChecked = false;
                    this.datasetStore.put(dataset);
                }
            }
        }
    });
});
