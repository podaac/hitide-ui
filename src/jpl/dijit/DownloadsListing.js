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
    "dojo/dom-attr",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/DownloadsListing.html',
    "xstyle/css!./css/DownloadsListing.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/events/MyDataEvent",
    "jpl/events/NavigationEvent",
    "jpl/data/Layer",
    "jpl/data/Layers",
    "jpl/utils/MapUtil",
    "jpl/events/SearchEvent",
    "jpl/config/Config",
    "jpl/dijit/DownloadsListingDataset"
], function(declare, lang, on, topic, dom, domStyle, domConstruct, query, xhr, domClass, domAttr, registry, _WidgetBase, _TemplatedMixin,
    template, css, AnimationUtil, BrowserEvent, MapEvent, MyDataEvent, NavigationEvent, Layer, Layers, MapUtil, SearchEvent, Config, DownloadsListingDataset) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        downloadQueriesListing: {},
        numDownloadQueries: 0,
        numDownloadGranules: 0,

        constructor: function() {},

        postCreate: function() {

        },

        startup: function() {
            topic.subscribe(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, lang.hitch(this, this.handleAddDownloadQuery));
            topic.subscribe(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, lang.hitch(this, this.handleRemoveDownloadQuery));
            domStyle.set(this.listingNode, "display", "none");
            domStyle.set(dom.byId("downloadsSubmissionContainer"), "display", "none");
            on(this.downloadsListingDiv, ".tabSwitchLink:click", lang.hitch(this, function(evt) {
                topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                    tabID: evt.target.getAttribute("rel")
                });
            }));
        },

        handleAddDownloadQuery: function(message) {
            var datasetId = message.datasetId;
            var datasetShortName = message.datasetShortName;
            var numSelected = message.numSelected;
            var bbox = message.bbox;
            var startDate = message.startDate;
            var endDate = message.endDate;
            var granuleNames = message.granuleNames;
            var granuleIds = message.granuleIds;
            var granuleNamesFilter = message.granuleNamesFilter;
            var notifyOnRemove = message.notifyOnRemove;
            var queryId = message.queryId;
            var source = message.source;
            var variables = [];
            var all_variables = [];

            for (var j = 0; j < message.variables.variables.length; ++j) {
                var variable = message.variables.variables[j];
                if (
                    variable !== message.variables.latVar &&
                    variable !== message.variables.lonVar &&
                    variable !== message.variables.timeVar
                ) {
                    all_variables.push(variable);
                }
            }

            all_variables.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });

            for (var i = 0; i < all_variables.length; ++i) {
                variables.push(all_variables[i]);
                variables.push("");
            }

            // create new listing
            var downloadsListingDataset = new DownloadsListingDataset({
                datasetId: datasetId,
                datasetShortName: datasetShortName,
                numSelected: numSelected,
                bbox: bbox,
                startDate: startDate,
                endDate: endDate,
                variables: variables,
                defaultVars: [message.variables.latVar, message.variables.lonVar, message.variables.timeVar],
                granuleNames: granuleNames,
                granuleIds: granuleIds,
                granuleNamesFilter: granuleNamesFilter,
                notifyOnRemove: notifyOnRemove,
                downloadQueryId: queryId,
                source : source
            });
            downloadsListingDataset.startup();
            domConstruct.place(downloadsListingDataset.domNode, this.listingNode, "last");

            // Add widget to listing
            this.downloadQueriesListing[queryId] = downloadsListingDataset;

            // Hide default message if visible
            domStyle.set(this.downloadsListingDefaultMessage, "display", "none");
            domStyle.set(this.downloadsListingSubmitSuccess, "display", "none");
            domStyle.set(this.listingNode, "display", "inherit");
            domStyle.set(dom.byId("downloadsSubmissionContainer"), "display", "inherit");
            this.numDownloadQueries += 1;
            this.numDownloadGranules += numSelected;
            topic.publish(MyDataEvent.prototype.GRANULE_COUNT_CHANGE, { count: this.numDownloadGranules });
        },
        
        handleRemoveDownloadQuery: function(message) {
            if (this.downloadQueriesListing[message.queryId].notifyOnRemove) {
                topic.publish(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY_NOTIFY, { datasetId: this.downloadQueriesListing[message.queryId].datasetId, queryId: message.queryId });
            }

            // remove the download query
            this.downloadQueriesListing[message.queryId].destroy();
            delete this.downloadQueriesListing[message.queryId];
            this.numDownloadQueries -= 1;
            this.numDownloadGranules -= message.numSelected;
            topic.publish(MyDataEvent.prototype.GRANULE_COUNT_CHANGE, { count: this.numDownloadGranules });

            // return to default view
            if (this.numDownloadQueries == 0) {
                domStyle.set(this.downloadsListingDefaultMessage, "display", "inherit");
                domStyle.set(this.downloadsListingSubmitSuccess, "display", "none");
                domStyle.set(this.listingNode, "display", "none");
                domStyle.set(dom.byId("downloadsSubmissionContainer"), "display", "none");
            }
        },
        
        clearDownloadsAndShowSubmitSuccess: function() {
            // descriptive enough for you?
            for (var id in this.downloadQueriesListing) {
                if (this.downloadQueriesListing.hasOwnProperty(id)) {
                    this.downloadQueriesListing[id].destroy();
                    this.downloadQueriesListing[id] = null;
                    delete this.downloadQueriesListing[id];
                }
            }
            this.numDownloadQueries = 0;
            this.numDownloadGranules = 0;
            topic.publish(MyDataEvent.prototype.GRANULE_COUNT_CHANGE, { count: this.numDownloadGranules });

            domStyle.set(this.downloadsListingSubmitSuccess, "display", "inherit");
            domStyle.set(this.downloadsListingDefaultMessage, "display", "none");
            domStyle.set(this.listingNode, "display", "none");
            domStyle.set(dom.byId("downloadsSubmissionContainer"), "display", "none");
        },
        
        getDownloadQueryObjs: function() {
            return this.downloadQueriesListing;
        }
    });
});
