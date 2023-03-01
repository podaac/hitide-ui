define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!../templates/MetadataDialog.html',
    "xstyle/css!../css/MetadataDialog.css",
    "jpl/dijit/VariableListing",
    "jpl/dijit/DatasetAvailability",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/_base/window",
    "jpl/config/Config",
    "moment/moment",
    "jpl/utils/SearchVariables"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, css,
    VariableListing, DatasetAvailability, domAttr, domConstruct, query, win, Config, 
    moment, SearchVariables) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        datasetId: null,
        addedDatasets: null,

        constructor: function() {},

        startup: function() {
            this.config = Config.getInstance();
            this.monthNames = this.config.hitide.monthNames;
            domAttr.set(this.metadataDatasetShortName, "innerHTML", this.datasetShortName);

            // Initialize variable listing
            this.variableListing = new VariableListing({
                visible: true,
                checkboxGrid: false,
                descriptionGrid: false,
                checkboxType: null,
                checkboxEvent: null
            });
            this.variableListing.startup();
            domConstruct.place(this.variableListing.domNode, this.variableListingNode);

            // Initialize dataset availability
            // Check if primary dataset is in added datasets. If not, add it
            if (!this.addedDatasets.hasOwnProperty(this.datasetId)) {
                this.addedDatasets[this.datasetId] = this.initialSearch[this.datasetId];
            }
            this.datasetAvailability = new DatasetAvailability({
                datasets: this.addedDatasets,
                primaryDataset: this.datasetId
            });
            this.datasetAvailability.startup();
            domConstruct.place(this.datasetAvailability.domNode, this.datasetAvailabilityNode);

            this.populateMetadata();
            this.populateVariables();

            // Teardown
            var _context = this;
            query(this.metadataDialogModal).on("hidden.bs.modal", function() {
                _context.destroy();
            });
        },

        postCreate: function() {
            this.createContainer();
            this.modalObject = query(this.metadataDialogModal);
            this.modalObject.modal();
        },

        populateMetadata: function() {
            var metadata = this.dataset;

            /* Set image url */
            var metadataImgSrc = metadata["Dataset-ImageUrl"] !== "https://podaac.jpl.nasa.gov/Podaac/thumbnails/image_not_available.jpg" ? metadata["Dataset-ImageUrl"] : "jpl/assets/images/earth.jpg";
            domAttr.set(this.metadataDatasetImage, "src", metadataImgSrc);

            /* Set long name */
            domAttr.set(this.metadataDatasetLongName, "innerHTML", metadata["Dataset-LongName"]);

            /* Set along/across-track resolution */
            var alongTrackResolution = metadata["Dataset-AlongTrackResolution"];
            var acrossTrackResolution = metadata["Dataset-AcrossTrackResolution"];
            if(alongTrackResolution && acrossTrackResolution)
                domAttr.set(this.metadataAlongAcrossRes, "innerHTML", parseInt(metadata["Dataset-AlongTrackResolution"]) / 1000 + "km x " + parseInt(metadata["Dataset-AcrossTrackResolution"]) / 1000 + "km");
            else
                domAttr.set(this.metadataAlongAcrossRes, "innerHTML", "Not Available");

            /* Set date range */
            var startDate = metadata["DatasetCoverage-StartTimeLong"];
            var formattedStart = "Unknown";
            if (startDate) {
                formattedStart = this.monthNames[startDate.month()] + " " + startDate.date() + ", " + startDate.year();
            }
            var endDate = metadata["DatasetCoverage-StopTimeLong"];
            var formattedEnd = "Present";
            if (endDate) {
                formattedEnd = this.monthNames[endDate.month()] + " " + endDate.date() + ", " + endDate.year();
            }
            domAttr.set(this.metadataTimeSpan, "innerHTML", formattedStart + " – " + formattedEnd);

            /* Set landing page link */
            domAttr.set(this.metadataExternalLink, "innerHTML", "http://podaac.jpl.nasa.gov/dataset/" + this.datasetShortName);
            domAttr.set(this.metadataExternalLink, "href", "http://podaac.jpl.nasa.gov/dataset/" + this.datasetShortName);

            /* Set description */
            domAttr.set(this.metadataDatasetDescription, "innerHTML", metadata["Dataset-Description"]);
        },

        populateVariables: function() {
            var variableListing = this.variableListing;
            SearchVariables.search(this.dataset).then(function(variableNames) {
                var variables = variableNames.map(function(variableName) {
                    return { id: variableName }
                });
                variableListing.setVariableListing(variables);
            });
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
