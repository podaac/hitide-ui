define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-attr",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'moment/moment',
    'dojo/text!./templates/DownloadInfoDataset.html',
    "xstyle/css!./css/DownloadInfoDataset.css"
], function(declare, lang, on, domClass, domAttr, _WidgetBase, _TemplatedMixin, moment, template, css) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function(options) {
            this.datasetId = options.datasetId;
            this.datasetShortName = options.datasetId;
            this.numMatching = options.numMatching ||  "--";
            this.bbox = options.bbox;
            this.granuleNames = options.granuleIds;
            this.granuleNamesFilter = options.granuleNamesFilter;
            this.variables = options.variables;
            this.startDate = options.dateRange ? options.dateRange.start :  "";
            this.endDate = options.dateRange ? options.dateRange.end :  "";
        },

        postCreate: function() {
            domAttr.set(this.datasetIdContainer, "innerHTML", this.datasetId);
            domAttr.set(this.datasetTitleContainer, "innerHTML", this.datasetShortName);
            domAttr.set(this.numMatchingContainer, "innerHTML", this.numMatching);
            if (this.bbox) {
                domAttr.set(this.downloadQueryRegion, "innerHTML", this.bbox.split(",").join(", "));
            }
            if (this.searchStartDate) {
                domAttr.set(this.downloadQueryDateRangeStart, "innerHTML", moment.utc(this.searchStartDate).utc().format("YYYY-MM-DD"));
            } else {
                // Hide start date row since not applicable
                domAttr.set(this.downloadQueryDateRangeStart, "innerHTML", "none");
            }
            if (this.searchEndDate) {
                domAttr.set(this.downloadQueryDateRangeEnd, "innerHTML", moment.utc(this.searchEndDate).utc().format("YYYY-MM-DD"));
            } else {
                // Hide end date row since not applicable
                domAttr.set(this.downloadQueryDateRangeEnd, "innerHTML", "none");
            }
            if (!this.searchEndDate && !this.searchStartDate) {
                domClass.toggle(this.downloadQueryDateRange, "hidden");
            }

            if (this.granuleNamesFilter) {
                domAttr.set(this.downloadQueryGranuleNameFilter, "innerHTML", this.granuleNamesFilter);
            }
            if (this.granuleNames && this.granuleNames.length > 0) {
                var displayString = this.granuleNames.join(", ");
                domAttr.set(this.downloadQueryGranuleName, "innerHTML", displayString);
            }
            if (this.variables && this.variables.length > 0) {
                var displayString = this.variables.join(", ");
                domAttr.set(this.downloadQueryVariables, "innerHTML", displayString);
            }
        },
        toggleInfoContainer: function() {
            domClass.toggle(this.subjobsContainer, "hidden");
        }
    });
});
