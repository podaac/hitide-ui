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
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Downloads.html',
    "xstyle/css!./css/Downloads.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/events/MyDataEvent",
    "jpl/data/Layer",
    "jpl/data/Layers",
    "jpl/utils/MapUtil",
    "jpl/events/SearchEvent",
    "jpl/events/DownloadsEvent",
    "jpl/config/Config",
    "jpl/dijit/VariableListing",
    "jpl/dijit/ui/AlertDialog",
    "jpl/dijit/DownloadsListing",
    "jpl/dijit/DownloadsManager",
    "jpl/utils/state-trackers/DownloadQueriesTracker"
], function(declare, lang, on, topic, domStyle, domConstruct, query, xhr, domClass, domAttr, registry, _WidgetBase, _TemplatedMixin,
    template, css, AnimationUtil, BrowserEvent, MapEvent, MyDataEvent, Layer, Layers, MapUtil, SearchEvent, DownloadsEvent, Config,
    VariableListing, AlertDialog, DownloadsListing, DownloadsManager, DownloadQueriesTracker) {

    var loggedIn = false;

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        downloadsListing: null,

        constructor: function() {},

        postCreate: function() {

        },

        startup: function() {
            var _context = this;

            // Create downloads listing
            this.downloadsListing = new DownloadsListing();
            this.downloadsListing.startup();
            domConstruct.place(this.downloadsListing.domNode, this.downloadsListingContainer);

            // Create downloads manager
            this.downloadsManager = new DownloadsManager();
            this.downloadsManager.startup();
            domConstruct.place(this.downloadsManager.domNode, this.downloadsManagerContainer);

            // listen for jobs to be submitted
            topic.subscribe(DownloadsEvent.prototype.JOB_SUBMITTED, lang.hitch(this, this.handleJobSubmitted));
            topic.subscribe(DownloadsEvent.prototype.JOB_SUBMIT_FAILED, lang.hitch(this, this.handleJobSubmitFailed));
            topic.subscribe(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, lang.hitch(this, this.handleLoginStatusChange));

            // Set up email field, download button, and any toggleable options
            domStyle.set(this.downloadsSubmissionEmailError, "visibility", "hidden");
            on(this.downloadsSubmissionEmail, "blur", lang.hitch(this, function(evt) {
                this.validateEmailAndDisplayError(this.downloadsSubmissionEmail.value);
            }));
            on(this.downloadsSubmissionEmail, "input", lang.hitch(this, function(evt) {
                this.validateEmailAndUpdateButton(this.downloadsSubmissionEmail.value);
            }));

            // set up submission button
            on(this.downloadsSubmissionButton, "click", lang.hitch(this, function(evt) {
                this.submitDownloadQueries();
            }));

            // // Check that the visibility of cutScanlineWarning is correctly set. Update whenever a new download query is added/removed.
            // this.updateCutScanlineWarningVisibility();
            // topic.subscribe(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, lang.hitch(this, this.updateCutScanlineWarningVisibility));
            // topic.subscribe(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, lang.hitch(this, this.updateCutScanlineWarningVisibility));
            // topic.subscribe(DownloadsEvent.prototype.JOB_SUBMITTED, lang.hitch(this, this.updateCutScanlineWarningVisibility));
        },

        handleLoginStatusChange: function(loginStatus){
            loggedIn = loginStatus.loggedIn;

            if(loggedIn){
                document.getElementById("loginReminderMessage").style.display = "none";
                document.getElementById("downloadsSubmissionControls").removeAttribute("disabled");
                this.downloadsSubmissionEmail.value = loginStatus.email;
                this.validateEmailAndUpdateButton(this.downloadsSubmissionEmail.value);
                this.downloadsManager.updateHistory();
            }
            else{
                document.getElementById("loginReminderMessage").style.display = "inherit";
                document.getElementById("downloadsSubmissionControls").setAttribute("disabled", "");
                this.downloadsSubmissionEmail.value = "";
                this.validateEmailAndUpdateButton(this.downloadsSubmissionEmail.value);
                this.downloadsManager.removeAllJobs();
            }
        },


        submitDownloadQueries: function() {
            // Get options
            if (loggedIn && this.isValidEmail(this.downloadsSubmissionEmail.value)) {

                // Update UI for while job being submitted
                domClass.remove(this.downloadsSubmitSpinner, "hidden");
                domClass.add(this.downloadsSubmissionButton, "disabled");
                domClass.add(this.downloadSubmitText, "hidden");
                
                // Assemble job
                var subjobs = this.downloadsListing.getDownloadQueryObjs();
                var downloadOptions = {
                    mergeGranules: this.mergeGranulesSelection.checked
                };
                console.log(subjobs)
                for (var subjobId in subjobs) {
                    if (subjobs.hasOwnProperty(subjobId)) {
                        var subjob = subjobs[subjobId];
                        if(subjob.source == "cmr"){
                            var cloudJob = {
                                email: this.downloadsSubmissionEmail.value,
                                // cloud: true,
                                subjobs: []
                            }
                            cloudJob.subjobs.push(subjob.getFullDownloadQuery(downloadOptions));
                            this.downloadsManager.submitJob(cloudJob);
                        }
                    }
                }
            }
        },

        validateEmailAndDisplayError: function(email) {
            if (this.isValidEmail(email)) {
                domStyle.set(this.downloadsSubmissionEmailError, "visibility", "hidden");
                domClass.remove(this.downloadsSubmissionButton, "disabled");
                return true;
            } else {
                domStyle.set(this.downloadsSubmissionEmailError, "visibility", "visible");
                domClass.add(this.downloadsSubmissionButton, "disabled");
                return false;
            }
        },

        validateEmailAndUpdateButton: function(email) {
            if (loggedIn && this.isValidEmail(email)) {
                domClass.remove(this.downloadsSubmissionButton, "disabled");
            } else {
                domClass.add(this.downloadsSubmissionButton, "disabled");
            }
        },

        isValidEmail: function(email) {
            if (email.indexOf("@") !== -1) {
                return true;
            }
            return false;
        },

        handleJobSubmitted: function() {
            if (this.downloadsListing) {
                this.downloadsListing.clearDownloadsAndShowSubmitSuccess();
            }
            domClass.add(this.downloadsSubmitSpinner, "hidden");
            domClass.remove(this.downloadsSubmissionButton, "disabled");
            domClass.remove(this.downloadSubmitText, "hidden");
        },

        handleJobSubmitFailed: function() {
            domClass.add(this.downloadsSubmitSpinner, "hidden");
            domClass.remove(this.downloadsSubmissionButton, "disabled");
            domClass.remove(this.downloadSubmitText, "hidden");
            new AlertDialog({
                alertTitle: "Download Submission Failed",
                alertMessage: "Please try again later"
            }).startup();
        },

        // updateCutScanlineWarningVisibility: function () {
        //     if(this.cloudDatasetQueryExists()) {
        //         domClass.remove(this.cutAtScanlineCloudWarning, "hidden");
        //     }
        //     else {
        //         domClass.add(this.cutAtScanlineCloudWarning, "hidden");
        //     }
        // },

        cloudDatasetQueryExists: function() {
            var downloadQueryArray = Object.values(DownloadQueriesTracker.getCurrentQueries());
            for(var i = 0; i < downloadQueryArray.length; i++) {
                if(downloadQueryArray[i].source === "cmr") return true;
            }
            return false;
        }
    });
});
