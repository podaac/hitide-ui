define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/date",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/has",
    "dojo/request/xhr",
    "dojo/dom-class",
    'dojo/store/Cache',
    'dojo/store/Memory',
    "dojo/store/Observable",
    'dgrid/OnDemandGrid',
    'dgrid/Selection',
    "dgrid/editor",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/form/DateTextBox",
    'dojo/text!./templates/GranulesController.html',
    "xstyle/css!./css/GranulesController.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/events/MyDataEvent",
    "jpl/events/DownloadsEvent",
    "jpl/utils/MapUtil",
    "jpl/events/SearchEvent",
    "jpl/events/GranuleSelectionEvent",
    "jpl/config/Config",
    "jpl/dijit/VariableListing",
    "jpl/dijit/ui/AlertDialog",
    "jpl/utils/DOMUtil",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/CheckedMenuItem",
    "dijit/MenuSeparator",
    "dijit/PopupMenuItem",
    "dojo/aspect",
    "dojo/_base/Deferred",
    "dojo/keys",
    "moment/moment",
    "jpl/utils/GranuleMetadata",
    "jpl/utils/SearchVariables"
], function(declare, lang, on, dojoDate, topic, domStyle, domAttr, domConstruct, query, has, xhr, domClass, Cache, Memory, Observable, OnDemandGrid, Selection, editor, registry, _WidgetBase, _TemplatedMixin,
    Button, TextBox, DateTextBox, template, css, AnimationUtil, BrowserEvent, MapEvent, MyDataEvent, DownloadsEvent, MapUtil, SearchEvent, GranuleSelectionEvent, Config, VariableListing, AlertDialog, DOMUtil,
    Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem, aspect, Deferred, dojoKeys, moment, GranuleMetadata, SearchVariables) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        granuleStore: null,
        granuleGrid: null,
        datasetId: null,
        datasetShortName: null,
        visible: null,
        datasetColor: "black",
        nameFilterBox: null,
        constraints: null,
        startTime: null,
        endTime: null,
        queryId: null,
        startDateWidget: null,
        endDateWidget: null,
        contextMenu: null,
        numMatchingSearch: 0,
        itemsPerPage: 25,
        currentSolrIdx: 0,
        availableGranules: 0,
        granulesInGrid: 0,
        _granuleSearchInProgress: false,
        loadingGranulesMessage: '<div class="granulesControllerLoadingGranulesMessage">Loading Granules...</div>',
        noGranulesMessage: '<div class="granulesControllerNoDataMessage">No Granules Found</div>',

        constructor: function() {
            this.datasetVariables = {};
        },

        postCreate: function() {},

        startup: function() {
            this.config = Config.getInstance();
            // Set attributes
            this.setAttributes();

            // Initialize granuleGrid
            this.initializeGranuleGrid();

            // Initialize filters
            this.initializeFilters();

            // Initialize contextMenu
            this.initializeContextMenu();

            // Fetch granules
            this.fetchGranules();

            // Fetch variables
            var _context = this;
            this.fetchVariables(this.datasetId, this.datasetShortName).then(function(success) {
                // _context.variableListing.setVariableListing(success.variables);
                // _context.variableListing.activateFirstVariable();
                if (_context.domNode) {
                    success.datasetId = _context.datasetId;
                    _context.datasetVariables = success;
                    topic.publish(GranuleSelectionEvent.prototype.VARIABLES_FETCHED, success);
                }
            }, function(err) {
                new AlertDialog({
                    alertTitle: "Server Error",
                    alertMessage: "Unable to fetch dataset variables for <b>" + _context.datasetShortName + "</b>. Please try again later."
                }).startup();

                // broadcast event to force footprint control
                var message = {
                    datasetId: _context.datasetId,
                    variables: [],
                    imgVariables: []
                };
                topic.publish(GranuleSelectionEvent.prototype.VARIABLES_FETCHED, message);
            });
            
            // // set up button listener
            on(this.addMatchingBtn, "click", lang.hitch(this, this.handleDownloadMatching));
            on(this.matchingAddedMessageUndo, "click", lang.hitch(this, this.removeMatchingDownload));

            // Set listeners
            this.setEventListeners();

            var temp_dataset = {
                "source": _context.source,
                "Dataset-PersistentId": _context.datasetId
            }
            if(_context.source === "cmr"){
                SearchVariables.search(temp_dataset).then(function(variableNames) {
                    var variables = variableNames.map(function(variableName) {
                        return { id: variableName }
                    });
                    _context.cmr_variables = variables;
                });
            }

        },

        windowResized: function(message) {
            // Resize table
            domStyle.set(this.granuleGrid.domNode, "height", (document.body.clientHeight - 750) + 210 + "px");
        },

        setAttributes: function() {
            // Get map
            this.mapDijit = registry.byId("mainSearchMap");
            this.map = this.mapDijit.equirectMap;

            // Set title
            domAttr.set(this.granulesControllerTitleContainer, "innerHTML", "<span class='granulesControllerTitleName'>&nbsp&nbsp&nbsp" + this.datasetShortName + "</span> &nbspGranules");

            // Initialize footprint graphics obj
            this.footprintGraphics = {};
            this.previewGraphics = {};

            // Set dataset color where appropriate
            domStyle.set(this.datasetDot1, "background", this.datasetColor);
            var rgb = this.hexToRgb(this.datasetColor);
            var rgbaString = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + "0.3)";
            domStyle.set(this.datasetDot2, "background", rgbaString);
            domStyle.set(this.granulesControllerTitleContainer, "border-bottom-color", this.datasetColor);

            // Update grid labels 
            this.updateGridLabels();

            // Set visibility
            if (this.visible) {
                this.show();
            } else {
                this.hide();
            }
        },

        enableMatchingGranuleDownloadButton: function() {
            // Enable/disable button depending on number granules
            if (this.availableGranules < 1) {
                domClass.add(this.addMatchingBtn, "addMatchingBtnDisabled");
            } else {
                domClass.remove(this.addMatchingBtn, "addMatchingBtnDisabled");
            }
        },

        mapInitialized: function(message) {
            this.mapDijit = registry.byId("mainSearchMap");
            this.map = this.mapDijit.equirectMap;
        },

        updateGridLabels: function() {
            // Set num matching search
            domAttr.set(this.granulesControllerNumMatchingSearch, "innerHTML", this.numMatchingSearch + " matching search, ");

            // Set num matching filter
            domAttr.set(this.granulesControllerNumMatchingFilter, "innerHTML", this.availableGranules + " matching filter, ");

            // Set num granules in grid
            domAttr.set(this.granulesControllerNumGranulesDisplayed, "innerHTML", "Displaying " + this.granulesInGrid + " out of " + this.availableGranules);

            // Set num matching in download btn
            domAttr.set(this.matchingBtnNumGranules, "innerHTML", this.availableGranules + (this.availableGranules !== 1 ? " Granules" : " Granule"));
        },

        initializeGranuleGrid: function() {
            var _context = this;

            // Initialize the store
            var data = {};
            data.items = [];
            data.identifier = "id";
            data.label = "Granule-Name";
            this.stateStore = new Memory();
            this.stateStore.idProperty = "Granule-Id";
            this.gridStore = new Observable(new Memory());

            // Init columns
            var columns = [{
                field: "footprint",
                label: "",
                sortable: false,
                renderCell: function(obj) {
                    // Get status from stateStore
                    var cellContent = domConstruct.create("div", {});
                    var btn;
                    if (obj.footprint) {
                        if(obj.source == "cmr"){
                            if(obj["Granule-Footprint"]){
                                btn = domConstruct.toDom("<span class='ms ms-hatch-fill granuleIcon' style='color:" + _context.datasetColor + "'></span>");
                            }
                            else{
                                btn = domConstruct.toDom("<span class='fa fa-ban granuleIcon'></span>");
                            }
                        }
                        else{
                            btn = domConstruct.toDom("<span class='ms ms-hatch-fill granuleIcon' style='color:" + _context.datasetColor + "'></span>");
                        } 
                    }
                    else {
                        if(obj.source == "cmr"){
                            if(obj["Granule-Footprint"]){
                                btn = domConstruct.toDom("<span class='ms ms-stroke granuleIcon'></span>");
                            }
                            else{
                                btn = domConstruct.toDom("<span class='fa fa-ban granuleIcon'></span>");
                            }
                        }
                        else{
                            btn = domConstruct.toDom("<span class='ms ms-stroke granuleIcon'></span>");
                        } 
                    }
                    domConstruct.place(btn, cellContent);

                    if(obj.source == "cmr"){
                        if(obj["Granule-Footprint"]){
                            on(btn, "click", function(evt) {
                                obj.footprint = !obj.footprint;
                                _context.gridStore.put(obj)
                                _context.updateStateStoreObj(obj);
                                _context.toggleFootprintDisplay(obj);
                            });
                        }
                    }
                    else{
                        on(btn, "click", function(evt) {
                            obj.footprint = !obj.footprint;
                            _context.gridStore.put(obj)
                            _context.updateStateStoreObj(obj);
                            _context.toggleFootprintDisplay(obj);
                        });                
                    }

                    return cellContent;
                }
            }, {
                field: "preview",
                label: "",
                sortable: false,
                renderCell: function(obj) {
                    // Get status from stateStore

                    var cellContent = domConstruct.create("div", {});
                    var btn;
                    if (obj.preview) {
                        if(obj.source == "cmr"){
                            if(obj.has_image){
                                btn = domConstruct.toDom("<span class='fa fa-image granuleIcon' style='color:" + _context.datasetColor + "'></span>");
                            }
                            else{
                                btn = domConstruct.toDom("<span class='fa fa-ban granuleIcon'></span>");
                            }
                        }
                        else{
                            btn = domConstruct.toDom("<span class='fa fa-image granuleIcon' style='color:" + _context.datasetColor + "'></span>");
                        } 

                    } else {
                        if(obj.source === "cmr"){
                            if(obj.has_image){
                                btn = domConstruct.toDom("<span class='fa fa-image granuleIcon'></span>");
                            }
                            else{
                                btn = domConstruct.toDom("<span class='fa fa-ban granuleIcon'></span>");
                            }
                        }
                        else{
                            btn = domConstruct.toDom("<span class='fa fa-image granuleIcon'></span>");
                        } 
                    }
                    domConstruct.place(btn, cellContent);

                    if(obj.source === "cmr"){
                        if(obj.has_image){
                            on(btn, "click", function(evt) {
                                obj.preview = !obj.preview;
                                _context.gridStore.put(obj)
                                _context.updateStateStoreObj(obj);
                                _context.togglePreviewDisplay(obj);
                            });
                        }
                    }
                    else{
                        on(btn, "click", function(evt) {
                            obj.preview = !obj.preview;
                            _context.gridStore.put(obj)
                            _context.updateStateStoreObj(obj);
                            _context.togglePreviewDisplay(obj);
                        });
                    }

                    return cellContent;
                }
            }, {
                field: "Granule-Name",
                label: "Name",
                formatter: function(value) {
                    return value;
                }
            }, {
                field: "Granule-StartTime",
                label: "Start Time",
                formatter: function(value) {
                    return _context.formatTableDate(value);
                }
            }, {
                field: "Granule-StopTime",
                label: "End Time",
                formatter: function(value) {
                    return _context.formatTableDate(value);
                }
            }];
            // Initialize the OnDemandGrid
            this.granuleGrid = new(declare([OnDemandGrid, Selection]))({
                store: this.gridStore,
                sort: [{
                    attribute: "Granule-StartTime",
                    descending: true
                }],
                selectionMode: "extended",
                columns: columns,
                cellNavigation: false,
                loadingMessage: this.loadingGranulesMessage,
                noDataMessage: this.loadingGranulesMessage
            }, this.granulesControllerGrid);

            this.granuleGrid.startup();
        },

        initializeContextMenu: function() {
            var contextMenu;
            var _context = this;
            contextMenu = new Menu({
                targetNodeIds: [this.granulesControllerGrid],
                selector: "td.dgrid-cell"
            });

            contextMenu.addChild(new MenuItem({
                label: "Add selected granules to DOWNLOADS",
                iconClass: "icon-in color-green",
                onClick: function(evt) {
                    var node = this.getParent().currentTarget;
                    var selectedGranules = Object.keys(_context.granuleGrid.selection);
                    var granuleObjs = selectedGranules.map(function(x) {
                        return _context.granuleGrid.row(x).data;
                    })
                    _context.handleDownloadSelectedGranules(granuleObjs);
                }
            }));
            contextMenu.addChild(new MenuSeparator());
            contextMenu.addChild(new MenuItem({
                label: "Activate footprints for selected granules",
                iconClass: "fa fa-plus color-green",
                onClick: function(evt) {
                    var node = this.getParent().currentTarget;
                    var selectedGranules = Object.keys(_context.granuleGrid.selection);
                    var granuleObjs = selectedGranules.map(function(x) {
                        return _context.granuleGrid.row(x).data;
                    })
                    _context.toggleFootprints(granuleObjs, true);
                }
            }));
            contextMenu.addChild(new MenuItem({
                label: "Deactivate footprints for selected granules",
                iconClass: "fa fa-minus color-red",
                onClick: function(evt) {
                    var node = this.getParent().currentTarget;
                    var selectedGranules = Object.keys(_context.granuleGrid.selection);
                    var granuleObjs = selectedGranules.map(function(x) {
                        return _context.granuleGrid.row(x).data;
                    })
                    _context.toggleFootprints(granuleObjs, false);
                }
            }));
            contextMenu.addChild(new MenuItem({
                label: "Clear all footprints",
                iconClass: "fa fa-trash color-orange",
                onClick: function(evt) {
                    _context.hideAllFootprints();
                }
            }));
            contextMenu.addChild(new MenuSeparator());
            contextMenu.addChild(new MenuItem({
                label: "Activate image preview for selected granules",
                iconClass: "fa fa-plus color-green",
                onClick: function(evt) {
                    var node = this.getParent().currentTarget;
                    var selectedGranules = Object.keys(_context.granuleGrid.selection);
                    var granuleObjs = selectedGranules.map(function(x) {
                        return _context.granuleGrid.row(x).data;
                    })
                    _context.togglePreviews(granuleObjs, true);
                }
            }));
            contextMenu.addChild(new MenuItem({
                label: "Deactivate image preview for selected granules",
                iconClass: "fa fa-minus color-red",
                onClick: function(evt) {
                    var node = this.getParent().currentTarget;
                    var selectedGranules = Object.keys(_context.granuleGrid.selection);
                    var granuleObjs = selectedGranules.map(function(x) {
                        return _context.granuleGrid.row(x).data;
                    })
                    _context.togglePreviews(granuleObjs, false);
                }
            }));
            contextMenu.addChild(new MenuItem({
                label: "Clear all image previews",
                iconClass: "fa fa-trash color-orange",
                onClick: function(evt) {
                    _context.hideAllPreviews();
                }
            }));
        },

        initializeFilters: function() {
            // Initialize name filter
            // Create input
            this.nameFilterBox = new TextBox({
                name: "nameFilter",
                placeholder: "Wildcard search ( e.g. ascat*240* )",
                style: {
                    "width": "289px"
                },
                value: ""
            }, this.nameFilterBoxEl);
            var _context = this;
            this.nameFilterBox.on("keyup", function(evt) {
                if (evt.keyCode === dojoKeys.ENTER) {
                    _context.filterGranules();
                }
            });
            // Initialize search 'go!' button for the filter box
            on(this.granulesControllerFilterBoxButton, "click", lang.hitch(this, _context.filterGranules));
            // Initialize date range filter
            // Create the start and end date widgets
            this.constraints = {};
            this.constraints.min = this.startTime.toDate();
            this.constraints.max = this.endTime.toDate();
            this.startDateWidget = new DateTextBox({
                value: this.startTime.format("YYYY-MM-DD"),
                constraints: {
                    min: this.constraints.min
                },
                style: "width: 120px;",
                onChange: function(v) {
                    if (_context.validate()) {
                        _context.filterGranules();
                    }
                }
            }, this.granulesControllerStartDate);

            on(this.startDateWidget, "keyup", function(evt) {
                if (evt.keyCode === dojoKeys.ENTER && _context.validate()) {
                    _context.filterGranules();
                }
            });

            this.endDateWidget = new DateTextBox({
                value: this.endTime.format("YYYY-MM-DD"),
                style: "width: 120px;",
                constraints: {
                    max: this.constraints.max
                },
                onChange: function(v) {
                    if (_context.validate()) {
                        _context.filterGranules();
                    }
                }
            }, this.granulesControllerEndDate);

            on(this.endDateWidget, "keyup", function(evt) {
                if (evt.keyCode === dojoKeys.ENTER && _context.validate()) {
                    _context.filterGranules();
                }
            });
        },

        isValidDate: function(d) {
            if (Object.prototype.toString.call(d) !== "[object Date]")
                return false;
            return !isNaN(d.getTime());
        },

        validateDates: function(startDate, endDate) {
            if (!startDate || !endDate) {
                return false;
            }
            if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
                return false;
            }
            if ((typeof startDate !== "object") || (typeof endDate !== "object")) {
                return false;
            }
            return dojoDate.compare(startDate, endDate) !== 1;
        },

        validate: function() {
            // Validate start and end dates from widgets
            if (!this.startDateWidget || !this.endDateWidget) {
                return false;
            }
            if (!this.startDateWidget.get("value") || !this.endDateWidget.get("value")) {
                return false;
            }
            if (!this.startDateWidget.validate() || !this.endDateWidget.validate()) {
                return false;
            }
            if (!this.validateDates(this.startDateWidget.get("value"), this.endDateWidget.get("value"))) {
                return false;
            }

            return true;
        },

        fetchVariables: function(datasetId, datasetShortName) {
            var deferred = new Deferred();

            if(this.source === "cmr"){
                var configPath = "dataset-configs/" + this.datasetShortName + '.cfg';

                xhr(configPath, {
                    handleAs: "json"
                }).then(function(obj){
                    deferred.resolve(obj);
                }, function(error) {
                    deferred.reject(error);
                });                
                
                return deferred.promise;
            }

            // console.warn("Warning, dataset variables hardcoded to a single variable");
            var url = this.config.hitide.externalConfigurables.variableService + "?datasetId=" + datasetId;

            var _context = this;
            xhr.get(url, {
                headers: {
                    "X-Requested-With": null
                },
                handleAs: "json",
                method: "get"
            }).then(function(response) {
                deferred.resolve(response);
            }, function(err) {
                console.log("GranulesController – Variable request error");
                deferred.reject(err);
            });
            return deferred.promise;
        },

        initializeVariablesGrid: function() {
            var vListing = new VariableListing({
                visible: true,
                checkboxGrid: true,
                descriptionGrid: true,
                checkboxType: "toggle",
                checkboxEvent: GranuleSelectionEvent.prototype.TOGGLE_VARIABLE_PREVIEW,
                datasetId: this.datasetId
            });
            vListing.startup();
            this.variableListing = vListing;
            domConstruct.place(vListing.domNode, this.variablesContainer);
        },

        setEventListeners: function() {
            // topic.subscribe(GranuleSelectionEvent.prototype.TOGGLE_VARIABLE_PREVIEW, lang.hitch(this, this.toggleVariablePreview));
            on(this.granulesControllerGrid, (!has("mozilla") ? "mousewheel, scroll" : "DOMMouseScroll, scroll"), lang.hitch(this, this.handleGridScroll));
            this.granuleGrid.on("dgrid-sort", lang.hitch(this, this.handleGridSort));
            this._eventListeners = [];
            this._eventListeners.push(topic.subscribe(BrowserEvent.prototype.FINISHED_RESIZING, lang.hitch(this, this.windowResized)));
            this._eventListeners.push(topic.subscribe(DownloadsEvent.prototype.JOB_SUBMITTED, lang.hitch(this, this.resetHandleDownloadMatchingBtn)))
            this._eventListeners.push(topic.subscribe(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY_NOTIFY, lang.hitch(this, this.handleRemoveDownloadQueryNotify)))
            this._eventListeners.push(topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, this.mapInitialized)));

        },

        displayLoadingSpinner: function(display) {
            domStyle.set(this.granulesControllerLoadingSpinner, "visibility", (display ? "visible" : "hidden"));
        },

        fetchGranules: function() {
            // Set searching flag to true
            this._granuleSearchInProgress = true;

            // Show spinner 
            this.displayLoadingSpinner(true);

            var withCredentials = false;

            var url;
            if(this.source === "cmr"){

                var sort 
                if(this.granuleGrid._sort[0].attribute == "Granule-StartTime"){
                    sort = "start_date";
                }
                else if(this.granuleGrid._sort[0].attribute == "Granule-StopTime"){
                    sort = "end_date";
                }
                else if(this.granuleGrid._sort[0].attribute ==  "Granule-Name"){
                    sort = "readable_granule_name";
                }

                url = this.config.hitide.externalConfigurables.cmrGranuleSearchService + "?";
                url += "collection_concept_id=" + this.datasetId;
                url += "&bounding_box[]=" + (this.bbox || "");
                url += "&page_size=" + this.itemsPerPage;
                url += "&offset=" + this.currentSolrIdx;
                url += "&temporal[]=" + DOMUtil.prototype.dateFormatISOBeginningOfDay(this.startDateWidget.get("value")) + "," + DOMUtil.prototype.dateFormatISOEndOfDay(this.endDateWidget.get("value"));
                url += "&sort_key[]=" + (this.granuleGrid._sort[0].descending ? "-" : "%2B") + sort
                
                console.log(url);
                if(this.nameFilterBox.get("value")){
                    url += "&native_id[]=" + this.nameFilterBox.get("value") + "&options[native_id][pattern]=true";
                }

                withCredentials = this.config.hitide.externalConfigurables.crossOriginCmrCookies;
            }
            else{
                url = this.config.hitide.externalConfigurables.granuleSearchService + "?";
                url += "datasetId=" + this.datasetId;
                url += "&startTime=" + DOMUtil.prototype.dateFormatISOBeginningOfDay(this.startDateWidget.get("value"));
                url += "&endTime=" + DOMUtil.prototype.dateFormatISOEndOfDay(this.endDateWidget.get("value"));
                url += "&name=" + this.nameFilterBox.get("value");
                url += "&bbox=" + (this.bbox || "");
                url += "&itemsPerPage=" + this.itemsPerPage;
                url += "&startIndex=" + this.currentSolrIdx;
                url += "&sort=" + this.granuleGrid._sort[0].attribute + (this.granuleGrid._sort[0].descending ? " desc" : " asc");
            }

            var _context = this;
            var r;
            var topicHandler = topic.subscribe(SearchEvent.prototype.CANCEL_REQUESTS, function(message) {
                if (message.target === "*" || message.target === this.datasetId) {
                    r.cancel();
                }
            });
            r = xhr.get(url, {
                headers: {
                    "X-Requested-With": null
                },
                handleAs: "json",
                method: "get",
                withCredentials: withCredentials
            }).then(function(response) {
                // Unsubscribe from cancel requests
                topicHandler.remove();
                // Update accordingly
                if (_context.domNode) {
                    _context.postGranulesFetch(response);
                }

                // var func = lang.hitch(_context, function(response) {
                //     _context.postGranulesFetch(response);
                // });
                // func(response);
            }, function(err) {
                // Unsubscribe from cancel requests
                topicHandler.remove();
                console.log("ERROR", err);
                // Set searching flag to false
                _context._granuleSearchInProgress = false;

                // Show spinner 
                _context.displayLoadingSpinner(false);

                // new AlertDialog({
                //     alertTitle: "Server Error",
                //     alertMessage: "Unable to fetch dataset variables for <b>" + this.datasetShortName + "</b>. Please try again later."
                // }).startup();
            });
        },

        
        postGranulesFetch: function(response) {
            if(this.source === "cmr"){
                this.availableGranules = response.hits;
                var _context = this;
                response.items.map(function(x) {

                    GranuleMetadata.convertFootprintAndImageFromCMR(x);

                    var granule_id = x["meta"]["concept-id"];
                    var fpState = _context.stateStore.get(granule_id);
                    var previewState = _context.stateStore.get(granule_id);

                    x["Granule-DatasetId"] = _context.datasetId;
                    x["Granule-Name"] = x["meta"]["native-id"];

                    x.footprint = fpState ? fpState.footprint : false;
                    x.preview = previewState ? previewState.preview : false;
                                     
                    x["Granule-StartTime"] = moment.utc(x["umm"]["TemporalExtent"]["RangeDateTime"]["BeginningDateTime"]);
                    x["Granule-StopTime"] = moment.utc(x["umm"]["TemporalExtent"]["RangeDateTime"]["EndingDateTime"]);
                    
                    x["source"] = "cmr";

                    _context.gridStore.add(x)
                });
            }
            else{
                this.availableGranules = response.response.numFound;
                var _context = this;
                response.response.docs.map(function(x) {

                    // MapUtil and Terraformer don't properly handle granule footprints or extents
                    // when they are ENVELOPE type. So, convert all ENVELOPE strings to POLYGON strings.
                    GranuleMetadata.convertFootprintsAndExtentsFromEnvelopeToPolygon(x);

                    // Add extra fields to response docs
                    // Check for state in stateStore
                    var fpState = _context.stateStore.get(x["Granule-Id"]);
                    var previewState = _context.stateStore.get(x["Granule-Id"]);

                    x.footprint = fpState ? fpState.footprint : false;
                    x.preview = previewState ? previewState.preview : false;
                    x["Granule-StartTime"] = moment.utc(x["Granule-StartTime"]);
                    x["Granule-StopTime"] = moment.utc(x["Granule-StopTime"]);


                    // Add to gridStore
                    _context.gridStore.add(x);
                });
            }
            this.granulesInGrid = this.gridStore.query().length;

            // Set no data message accordingly
            if (this.availableGranules === 0) {
                this.granuleGrid.noDataMessage = this.noGranulesMessage;
                if (this.granuleGrid.noDataNode) {
                    domAttr.set(this.granuleGrid.noDataNode, "innerHTML", this.noGranulesMessage);
                }
            } else {
                this.granuleGrid.noDataMessage = this.loadingGranulesMessage;
                if (this.granuleGrid.noDataNode) {
                    domAttr.set(this.granuleGrid.noDataNode, "innerHTML", this.loadingGranulesMessage);
                }
            }

            // Update button status
            this.enableMatchingGranuleDownloadButton();

            this.updateGridLabels();

            // Set searching flag to false
            this._granuleSearchInProgress = false;

            // Show spinner 
            this.displayLoadingSpinner(false);

        },

        filterGranules: function() {
            // Clear old memory
            this.gridStore = new Observable(new Memory());

            // Set grid to new store
            this.granuleGrid.setStore(this.gridStore);

            // Clear startIdx
            this.currentSolrIdx = 0;

            // Fetch new granules
            this.fetchGranules();

            this.resetHandleDownloadMatchingBtn();

        },

        handleGridSort: function(evt) {
            // Prevent normal sorting
            evt.preventDefault();

            // Clear old memory
            this.gridStore = new Observable(new Memory());

            // Set grid to new store
            evt.grid.setStore(this.gridStore);

            // Update sort arrow
            this.granuleGrid.updateSortArrow(evt.sort, true);

            // Clear startIdx
            this.currentSolrIdx = 0;

            // Fetch new granules
            this.fetchGranules();
        },

        handleGridScroll: function() {
            if (this.availableGranules === this.granulesInGrid) {
                return;
            }

            if (this._granuleSearchInProgress) {
                return;
            }
            var scrollPosTop = this.granuleGrid.bodyNode.scrollTop;
            var scrollHeight = this.granuleGrid.bodyNode.scrollHeight;
            var offsetHeight = this.granuleGrid.bodyNode.offsetHeight;

            // First approach, fetch more if scroll pos is 90% of way down
            if ((scrollPosTop + offsetHeight) / scrollHeight > 0.90) {
                this.currentSolrIdx += this.itemsPerPage;
                this.fetchGranules();
            }
        },

        formatTableDate: function(value) {
            if (isNaN(value)) {
                // console.log(value, "is invalid, assuming it means 'Present'");
                return "-";
            }
            return value.toISOString().slice(0, 16);
        },

        updateStateStoreObj: function(obj) {
            // If obj has no active states, remove it else upsert
            if (!obj.footprint && !obj.preview) {
                this.stateStore.remove(obj["Granule-Id"]);
            } else {
                this.stateStore.put(obj);
            }
        },

        hide: function() {
            domStyle.set(this.granulesControllerRoot, "display", "none");
        },

        show: function() {
            domStyle.set(this.granulesControllerRoot, "display", "block");
            domClass.remove(this.datasetDot2, "datasetDotPulse");
            domClass.add(this.datasetDot2, "datasetDotPulse");
        },

        clearListeners: function() {
            for (var i = 0; i < this._eventListeners.length; i++) {
                this._eventListeners[i].remove();
            }
        },

        clearFootprintsAndPreviews: function() {
            this.hideAllFootprints();
            this.hideAllPreviews();
        },

        toggleFootprintDisplay: function(obj) {
            if (obj.footprint) {
                // if (!this.footprintGraphics[obj["Granule-Id"]]) {
                var rgb = this.hexToRgb(this.datasetColor);
                var borderColor = [rgb.r, rgb.g, rgb.b, 0.7];
                var fillColor = [rgb.r, rgb.g, rgb.b, 0.00];
                topic.publish(GranuleSelectionEvent.prototype.ADD_GRANULE_FOOTPRINT, {
                    granuleObj: obj,
                    border: borderColor,
                    fill: fillColor
                });
            } else {
                topic.publish(GranuleSelectionEvent.prototype.REMOVE_GRANULE_FOOTPRINT, {
                    granuleObj: obj
                });
            }
        },

        toggleFootprints: function(granuleObjs, active) {
            for (var i = 0; i < granuleObjs.length; i++) {
                // Update store
                var obj = granuleObjs[i];

                if (obj.footprint != active) {

                    if(obj.source === "cmr"){
                        if(obj["Granule-Footprint"]){
                            obj.footprint = active;
                            this.gridStore.put(obj);
                            this.updateStateStoreObj(obj);

                            // Update fp
                            this.toggleFootprintDisplay(obj);
                        }
                    }
                    else{
                        obj.footprint = active;
                        this.gridStore.put(obj);
                        this.updateStateStoreObj(obj);

                        // Update fp
                        this.toggleFootprintDisplay(obj);
                    }
                }

            }
        },

        togglePreviews: function(granuleObjs, active) {
            for (var i = 0; i < granuleObjs.length; i++) {
                // Update store
                var obj = granuleObjs[i];
                if (obj.preview != active) {

                    if(obj.source === "cmr"){
                        if(obj.has_image){
                            obj.preview = active;
                            this.gridStore.put(obj);
                            this.updateStateStoreObj(obj);

                            // Update preview
                            this.togglePreviewDisplay(obj);
                        }
                    }
                    else{
                        obj.preview = active;
                        this.gridStore.put(obj);
                        this.updateStateStoreObj(obj);

                        // Update preview
                        this.togglePreviewDisplay(obj);
                    }
                }
            }
        },

        togglePreviewDisplay: function(obj) {
            if (obj.preview) {
                topic.publish(GranuleSelectionEvent.prototype.ADD_GRANULE_PREVIEW, {
                    granuleObj: obj
                });
            } else {
                topic.publish(GranuleSelectionEvent.prototype.REMOVE_GRANULE_PREVIEW, {
                    granuleObj: obj
                });
            }
        },

        hideAllPreviews: function() {
            this.togglePreviews(this.stateStore.query(), false);
        },

        hideAllFootprints: function() {
            this.toggleFootprints(this.stateStore.query(), false);
        },

        resize: function() {
            this.granuleGrid.resize();
        },

        hexToRgb: function(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        removeMatchingDownload: function(message) {
            topic.publish(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, {
                queryId: this.queryId,
                numSelected: this.availableGranules
            })
        },

        handleRemoveDownloadQueryNotify: function(message) {
            var datasetId = message.datasetId;
            // determine if we need to reset the Add Matching button
            if (this.queryId === message.queryId) {
                this.resetHandleDownloadMatchingBtn();
            }
        },

        handleDownloadMatching: function() {
            // Block 0 granule downloads
            if (this.availableGranules < 1) {
                return;
            }
            // Alert user if > max granule downloads and block
            if (this.availableGranules > this.config.hitide.externalConfigurables.maxGranulesPerDownload) {
                new AlertDialog({
                    alertTitle: "Alert",
                    alertMessage: "<div>The number of granules you are attempting to download is greater than " +
                        this.config.hitide.externalConfigurables.maxGranulesPerDownload + " granule limit and cannot be added to DOWNLOADS. Please ensure that your number of " +
                        "matching granules is less than the specified limit."
                }).startup();
            } else {
                // 
                var _context = this
                var granuleNameIds = _context.granuleGrid.observers[0].rows.map(function(granuleRow){
                    return granuleRow.getElementsByClassName('field-Granule-Name')[0].innerHTML
                })

                // eslint-disable-next-line no-console
                console.log(granuleNameIds)

                var startDate = moment.utc(this.startDateWidget.getValue());
                var endDate = moment.utc(this.endDateWidget.getValue());
                var queryId = Math.floor(Math.random() * (9999999999 - 0)) + 0;
                var downloadQuery = {
                    datasetId: this.datasetId,
                    datasetShortName: this.datasetShortName,
                    startDate: startDate.format("YYYY/MM/DD"),
                    endDate: endDate.format("YYYY/MM/DD"),
                    numSelected: this.availableGranules,
                    bbox: this.bbox.toString(),
                    notifyOnRemove: true,
                    variables: this.datasetVariables,
                    granuleNames: granuleNameIds,
                    granuleNamesFilter: this.nameFilterBox.value,
                    queryId: queryId
                };
                // eslint-disable-next-line no-console
                console.log(downloadQuery)
                /* add source: 'cmr' if appropriate */
                if(this.source === 'cmr')
                    downloadQuery.source = 'cmr';

                topic.publish(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, downloadQuery);
                this.queryId = queryId;
                domStyle.set(this.addMatchingBtn, "display", "none");
                domStyle.set(this.matchingAddedMessage, "display", "block");
            }
        },

        resetHandleDownloadMatchingBtn: function() {
            domStyle.set(this.addMatchingBtn, "display", "inline-block");
            domStyle.set(this.matchingAddedMessage, "display", "none");
            this.enableMatchingGranuleDownloadButton();
        },
        
        handleDownloadSelectedGranules: function(granuleObjArr) {

            var granuleNameIds = [];
            var granuleIds = [];
            var earliestTime = null;
            var latestTime = null;

            granuleObjArr.forEach(function(granuleObj){
                var name = granuleObj["Granule-Name"];
                var id = name;
                if(granuleObj.source === 'cmr')
                    id = granuleObj.meta['concept-id'];
                var startTime = granuleObj["Granule-StartTime"];
                var stopTime = granuleObj["Granule-StopTime"];
                granuleNameIds.push(name);
                granuleIds.push(id);

                if(!earliestTime || startTime.isBefore(earliestTime)){
                    earliestTime = startTime;
                }
                
                if(!latestTime || stopTime.isAfter(latestTime)){
                    latestTime = stopTime;
                }
            });


            // Alert user if > max granule downloads and block
            if (granuleNameIds.length > this.config.hitide.externalConfigurables.maxGranulesPerDownload) {
                new AlertDialog({
                    alertTitle: "Alert",
                    alertMessage: "<div>The number of granules you are attempting to download is greater than " +
                        this.config.hitide.externalConfigurables.maxGranulesPerDownload + " granule limit and cannot be added to DOWNLOADS. Please ensure that your number of " +
                        "matching granules is less than the specified limit."
                }).startup();
            } else {
                var startDate = moment.utc(earliestTime);
                var endDate = moment.utc(latestTime);
                var queryId = Math.floor(Math.random() * (9999999999 - 0)) + 0;

                if(this.source === 'cmr') {
                    // Overwrite the variables (not image variables) that were obtained from config file
                    // using variables obtained from cmr
                    this.datasetVariables.variables = this.cmr_variables.map(function (variable) { return variable.id });
                }

                topic.publish(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, {
                    datasetId: this.datasetId,
                    datasetShortName: this.datasetShortName,
                    startDate: startDate.format("YYYY/MM/DD"),
                    endDate: endDate.format("YYYY/MM/DD"),
                    numSelected: granuleNameIds.length,
                    bbox: this.bbox.toString(),
                    variables: this.datasetVariables,
                    granuleNames: granuleNameIds,
                    granuleIds: granuleIds,
                    granuleNamesFilter: this.nameFilterBox.value,
                    queryId: queryId,
                    source: this.source
                });
            }
        }
    });
});
