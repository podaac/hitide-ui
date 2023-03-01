define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/request/xhr",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/mouse",
    "dijit/registry",
    "dojo/_base/fx",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/DownloadsListingDataset.html',
    "xstyle/css!./css/DownloadsListingDataset.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/events/MyDataEvent",
    "jpl/data/Layer",
    "jpl/data/Layers",
    "jpl/dijit/FacetItem",
    "jpl/utils/MapUtil",
    "jpl/events/SearchEvent",
    "jpl/config/Config",
    "jpl/utils/DOMUtil",
    "moment/moment"
], function(declare, lang, on, topic, domStyle, domConstruct, query, xhr, domClass, domAttr, mouse, registry, baseFx, _WidgetBase, _TemplatedMixin,
    template, css, AnimationUtil, BrowserEvent, MapEvent, MyDataEvent, Layer, Layers, FacetItem, MapUtil, SearchEvent, Config, DOMUtil, moment) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function(options) {
            this.datasetId = options.datasetId;
            this.datasetShortName = options.datasetShortName;
            this.numMatching = options.numMatching;
            this.numSelected = options.numSelected;
            this.downloadQueryId = options.downloadQueryId;
            this.bbox = options.bbox;
            this.granuleNames = options.granuleNames;
            this.granuleIds = options.granuleIds;
            this.granuleNamesFilter = options.granuleNamesFilter;
            this.variables = options.variables;
            this.startDate = options.startDate;
            this.endDate = options.endDate;
            this.defaultVars = options.defaultVars;
            this.variableListing = null;
            this.notifyOnRemove = false;
            this.source = options.source;
        },

        postCreate: function() {},

        startup: function() {
            domAttr.set(this.datasetTitle, "innerHTML", this.datasetShortName);
            domAttr.set(this.datasetSelected, "innerHTML", this.numSelected);
            if (this.bbox) {
                domAttr.set(this.downloadQueryRegion, "innerHTML", this.bbox.split(",").join(", "));
            }
            if (this.startDate) {
                domAttr.set(this.downloadQueryDateRangeStart, "innerHTML", this.startDate);
            }
            if (this.endDate) {
                domAttr.set(this.downloadQueryDateRangeEnd, "innerHTML", this.endDate);
            }
            if (this.granuleNamesFilter) {
                domAttr.set(this.downloadQueryGranuleNameFilter, "innerHTML", this.granuleNamesFilter);
            }
            if (this.granuleNames && this.granuleNames.length > 0) {
                var displayString = this.granuleNames.join("<br>");
                domAttr.set(this.downloadQueryGranuleName, "innerHTML", displayString);
            } else {
                domStyle.set(this.granuleNamesContainer, "display", "none");
            }
            this.initVariableSelector();
            on(this.datasetListingHeader, "click", lang.hitch(this, this.toggleDetailsContainer));
            on(this.granuleNamesTitleContainer, "click", lang.hitch(this, this.toggleGranuleNamesContainer));
            on(this.removeDownloadQuery, "click", lang.hitch(this, this.handleRemoveDownloadQuery));
        },

        updateDatasetSelectedCount: function(numSelected) {
            // Update number of selected granules 
            this.numSelected = numSelected;
            domAttr.set(this.datasetSelected, "innerHTML", this.numSelected);
        },

        initVariableSelector: function() {
            var _context = this;
            this.variableListing = new FacetItem({
                key: "variable_selection",
                label: "Select Extraction Variables",
                items: this.variables,
                fireEvent: false
            });
            this.variableListing.setIconClass("fa-angle-right", "fa-angle-down");
            this.variableListing.startup();
            domConstruct.place(this.variableListing.domNode, this.variablesContainer);
            this.variableListing.selectAll();
            on(this.variableListing.facetItemKey, "click", function() {
                _context.variableListing.toggleByClass();
            });
            on(this.variableListing.faCaret, "click", function() {
                _context.variableListing.toggleByClass();
            });
            on(this.variableListing.faCaretActive, "click", function() {
                _context.variableListing.toggleByClass();
            });

        },
        
        handleRemoveDownloadQuery: function(evt) {
            topic.publish(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, {
                queryId: this.downloadQueryId,
                numSelected: this.numSelected
            });
        },

        showElement: function(elm) {
            domStyle.set(elm, "display", "block");
            baseFx.fadeIn({
                node: elm,
                duration: 75
            }).play();
        },

        hideElement: function(elm) {
            baseFx.fadeOut({
                node: elm,
                duration: 75,
                onEnd: function() {
                    domStyle.set(elm, "display", "none");
                }
            }).play();
        },

        toggleDetailsContainer: function(evt) {
            if (evt.target.className === "removeDownloadsQueryButton") {
                return;
            }

            if (domStyle.get(this.downloadQueryDetailsContainer, "display") == "none") {
                this.showElement(this.downloadQueryDetailsContainer);
            } else {
                this.hideElement(this.downloadQueryDetailsContainer);
            }
            domClass.toggle(this.detailsToggle, "fa-angle-down");
            domClass.toggle(this.detailsToggle, "fa-angle-right");
        },

        toggleGranuleNamesContainer: function() {
            if (domStyle.get(this.downloadQueryGranuleName, "display") == "none") {
                this.showElement(this.downloadQueryGranuleName);
            } else {
                this.hideElement(this.downloadQueryGranuleName);
            }
            domClass.toggle(this.granuleNamesToggle, "fa-angle-down");
            domClass.toggle(this.granuleNamesToggle, "fa-angle-right");
        },

        getDownloadQuery: function(options) {
            var query = {};

            // add dataset id
            query.datasetId = this.datasetId;

            // add granule ids if applicable
            if (this.granuleNames && this.granuleNames.length > 0) {
                query.granuleIds = this.granuleIds;
                query.granuleNames = this.granuleNames;
            } else {
                // add granule filters if no granule ids are present
                if (this.startDate && this.endDate) {
                    query.dateRange = {
                        start: DOMUtil.prototype.dateFormatISOBeginningOfDay(moment.utc(this.startDate, "YYYYMMDD")),
                        end: DOMUtil.prototype.dateFormatISOEndOfDay(moment.utc(this.endDate, "YYYYMMDD"))
                    };
                }
                if (this.granuleNamesFilter) {
                    query.granuleNamePattern = this.granuleNamesFilter;
                }
            }

            // add the bounding box to the query
            if (this.bbox) {
                query.bbox = this.bbox;
            }

            // add search start and end dates
            if (this.startDate) {
                query.searchStartDate = this.startDate;
            }

            if(this.endDate){
                query.searchEndDate = this.endDate
            }

            if(this.source){
                query.source = this.source;
            }

            // add variable selection
            query.variables = [];
            var variableObjList = this.variableListing.getSelected();
            if (variableObjList.length > 0) {
                if(this.source === 'cmr' && this.allVariablesAreSelected()) {
                    query.variables = ['all'];
                }
                else {
                    query.variables = variableObjList.map(function(x) {
                        return x.label;
                    });
                }
            }

            if(this.source !== 'cmr') {
                query.variables = query.variables.concat(this.defaultVars);
            }

            // cut at scanline (force into truthy)
            query.compact = options.cutAtScanline === true;

            // merge granules (force into truthy)
            query.merge = options.mergeGranules === true;

            return query;
        },

        allVariablesAreSelected: function() {
            var numberOfNonDefaultVariables = this.variables.length / 2; // divide by 2 because this.variables -> ['var1', '', 'var2', '', ....]
            var numberOfSelectedVariables = this.variableListing.getSelected().length;
            return numberOfNonDefaultVariables === numberOfSelectedVariables
        },

        getFullDownloadQuery: function(options) {
            var query = this.getDownloadQuery(options);
            query.datasetShortName = this.datasetShortName;
            query.numMatching = this.numSelected;
            return query;
        }

    });
});
