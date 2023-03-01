define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/request/xhr",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/DownloadsManager.html',
    "xstyle/css!./css/DownloadsManager.css",
    "jpl/events/DownloadsEvent",
    "jpl/utils/MapUtil",
    "jpl/utils/DOMUtil",
    "jpl/events/SearchEvent",
    "jpl/config/Config",
    'dojo/store/Memory',
    'dojo/store/Observable',
    'dgrid/OnDemandGrid',
    "jpl/dijit/ui/AlertDialog",
    "jpl/dijit/DownloadInfoDataset",
    "jpl/utils/JobsApi",
    "jpl/dijit/ui/DownloadLinksDialog",
    "jpl/dijit/ui/JobInfoDialog"
], function(declare, lang, on, topic, domStyle, domConstruct, xhr, domClass, domAttr, registry, _WidgetBase, _TemplatedMixin,
    template, css, DownloadsEvent, MapUtil, DOMUtil, SearchEvent, Config, Memory, Observable, OnDemandGrid, AlertDialog,
    DownloadInfoDataset, jobsApi, DownloadLinksDialog, JobInfoDialog) {
    
    var INCONSISTENT_STATE_MESSAGE = 
        "INCONSISTENT LOGIN STATE: It appears that you are logged in for this tab, "
        + "but have logged out or logged in as a different user in a different tab "
        + "or window. Please refresh this page to update to most recent login state.";

    return declare([_WidgetBase, _TemplatedMixin], {

        templateString: template,
        widgetsInTemplate: true,
        jobsStore: null,
        jobsGrid: null,
        createJobUrl: null,
        jobStatusUrl: null,
        pollsInProgress: {},

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            var _context = this;

            this.config = Config.getInstance();
            
            // Create jobs store
            var data = {};
            data.items = [];
            data.identifier = "token";
            this.jobStore = new Observable(new Memory({
                data: data
            }));

            // Rendering of DownloadsManager
            var columns = [{
                field: "subjobs",
                label: "",
                sortable: false,
                renderCell: function(job) {
                    var cellContent = domConstruct.create("div", {});
                    var node = domConstruct.toDom("<span class=\"fa fa-info-circle subjobsButton\"></span>");
                    domConstruct.place(node, cellContent);
                    on(node, "click", lang.hitch(this, function() {
                        new JobInfoDialog(job).startup();
                    }));
                    return cellContent;
                }
            }, {
                field: "requestTime",
                label: "Start Time",
                formatter: function(date) {
                    return DOMUtil.prototype.prettyDateTime(date);
                }
            }, {
                field: "jobStatus",
                label: "Status",
                renderCell: function(job) {
                    var node = null;
                    var nodeString = "";

                    if(job.statusString === "processing" || job.statusString === 'running'){
                        var percentComplete = Math.round((job.granulesCompleted + job.granulesFailed) / job.granulesRequested * 100);
                        nodeString = "<span>PROCESSING - " + percentComplete + "%</span>";
                    }
                    else if(job.statusString === "done" || job.statusString === "partial error" || job.statusString === 'successful'){
                        nodeString = "<span class=\"button button-blue\">Done – Download Links</span>";
                        node = domConstruct.toDom(nodeString);

                        // set up a click listener for the download links
                        on(node, "click", lang.hitch(this, function() {
                            new DownloadLinksDialog(job).startup();
                        }));

                        return node;
                    }
                    else {
                        nodeString = "<span>" + job.statusString.toUpperCase() + "</span>";
                    }

                    return domConstruct.toDom(nodeString);
                }
            }, {
                field: "Remove",
                label: "",
                renderHeaderCell: function(node) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='removeDatasetIcon'>&times;</span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        _context.removeAllJobsAndDisable();
                    });
                    return cellContent;
                },
                sortable: false,
                renderCell: function(job) {
                    var cellContent = domConstruct.create("div", {});
                    var btn = domConstruct.toDom("<span class='removeDatasetIcon'>&times;</span>");
                    domConstruct.place(btn, cellContent);
                    on(btn, "click", function(evt) {
                        _context.removeJobAndDisable(job);
                    });

                    return cellContent;
                }
            }];

            // Initialize the OnDemandGrid
            this.jobsGrid = new(declare([OnDemandGrid]))({
                store: this.jobStore,
                columns: columns,
                sort: "requestTime",
                cellNavigation: false
            }, this.jobsGridEl);
            this.jobsGrid.startup();
        },

        startPolling: function(job){
            this.pollsInProgress[job.token] = true;
            this.poll(job);
        },

        stopPolling: function(job){
            this.pollsInProgress[job.token] = true;
            delete this.pollsInProgress[job.token];
        },

        poll: function(job){
            var _context = this;
            var pollDelayMillis = 1000;

            if(
                !this.pollsInProgress[job.token]
                || job.statusString === "done"
                || job.statusString === "partial error"
                || job.statusString === "error"
                || job.statusString === 'successful'
                || job.statusString === 'failed'
            ){
                return;
            }

            jobsApi.getJobStatus(job.token, function(response){
                if(response.token){
                    var updatedJob = response;
                    _context.jobStore.put(updatedJob);

                    setTimeout(function(){
                        _context.poll(updatedJob);
                    }, pollDelayMillis);
                }
                else if(response.error === "NOT_LOGGED_IN" || response.error === "NON_MATCHING_USERNAME"){
                    console.log("poll response.error: " + response.error);
                    alert(INCONSISTENT_STATE_MESSAGE);
                }
                else{
                    console.log("POLL ERROR: " + response.error + "  " + response.errorMessage);
                }
            });
        },

        submitJob: function(job) {
            var _context = this;

            jobsApi.submitJob(job, function(response){
                if(response.token){
                    var submittedJob = response;

                    _context.addJob(submittedJob);
                    topic.publish(DownloadsEvent.prototype.JOB_SUBMITTED);
                }
                else if(response.error === "NOT_LOGGED_IN" || response.error === "NON_MATCHING_USERNAME"){
                    console.log("submitJob response.error: " + response.error);
                    alert(INCONSISTENT_STATE_MESSAGE);
                    topic.publish(DownloadsEvent.prototype.JOB_SUBMIT_FAILED);
                }
                else{
                    console.log("SUBMIT JOB ERROR: " + response.error + "  " + response.errorMessage);
                    topic.publish(DownloadsEvent.prototype.JOB_SUBMIT_FAILED);
                }
            });

        },

        addJob: function(job) {

            this.jobStore.add(job);
            this.startPolling(job);

            if(this.jobAddedListeners){
                this.jobAddedListeners.forEach(function(callback){
                    callback(job);
                });
            }
        },

        removeJob: function(job) {
            this.stopPolling(job);
            this.jobStore.remove(job.token);
        },

        removeJobAndDisable: function(job){
            var _context = this;

            jobsApi.disableJob(job, function(response){
                if(response.success){
                    _context.removeJob(job);
                }
                else if(response.error === "NOT_LOGGED_IN" || response.error === "NON_MATCHING_USERNAME"){
                    console.log("removeJobAndDisable response.error: " + response.error); // put some code here to reset app
                    alert(INCONSISTENT_STATE_MESSAGE);
                }
                else{

                }
            });
        },

        removeAllJobs: function() {
            var _context = this;
            var jobs = this.jobStore.query();
            jobs.forEach(function(job) {
                _context.removeJob(job);
            });
        },

        removeAllJobsAndDisable: function(){
            var _context = this;
            var jobs = this.jobStore.query();
            jobs.forEach(function(job) {
                _context.removeJobAndDisable(job);
            });
        },

        updateHistory: function(){
            var _context = this;

            _context.removeAllJobs();

            jobsApi.getHistory(function(history){
                history.forEach(function(job){
                    _context.addJob(job);
                });
            });
        }


    });
});
