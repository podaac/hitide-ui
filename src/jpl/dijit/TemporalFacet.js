define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/date",
    "dojo/topic",
    "dojo/query",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/DateTextBox",
    'dojo/text!./templates/TemporalFacet.html',
    "xstyle/css!./css/TemporalFacet.css",
    "jpl/events/SearchEvent",
    "dojo/_base/window",
    "jpl/dijit/ui/AlertDialog",
    "moment/moment"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, dojoDate, topic, query, registry,
    _WidgetBase, _TemplatedMixin, DateTextBox, template, css, SearchEvent, win, AlertDialog, moment) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        open: false,
        startDateWidget: null,
        endDateWidget: null,
        currentStartDate: null,
        currentEndDate: null,
        constraints: null,
        addedDatasets: null,
        _monthNames: [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ],


        constructor: function() {},

        postCreate: function() {},

        createContainer: function() {
            this.placeAt(win.body());
        },

        startup: function() {
            // Create facet items
            this.createDateItems();

            this.granuleSelection = registry.byId("GranuleSelection").content;
            this.search = registry.byId("Search").content;

            topic.subscribe(SearchEvent.prototype.DATE_CHANGE, lang.hitch(this, this.onDateChange));

            // Set click listeners
            on(this.temporalFacetApply, "click", lang.hitch(this, this.apply));
            on(this.temporalFacetClear, "click", lang.hitch(this, this.clear));
            on(this.temporalFacetCancel, "click", lang.hitch(this, this.hide));
        },

        onDateChange: function(message) {
            if (message.origin === "config") {
                if (!message.startDate || !message.startDate.isValid()) {
                    this.startDateWidget.reset();
                } else {
                    this.setStartDate(message.startDate);
                }
                if (!message.endDate || !message.endDate.isValid()) {
                    this.endDateWidget.reset();
                } else {
                    this.setEndDate(message.endDate);
                }
                topic.publish(SearchEvent.prototype.DATE_CHANGE, {
                    startDate: this.getStartDate(),
                    endDate: this.getEndDate(),
                    noSearch: true,
                    origin: "picker",
                    dateRangeWasUndefined: (!message.startDate && !message.endDate)
                });
            } /*else {
                new AlertDialog({
                    alertTitle: "Error",
                    alertMessage: "Unable to apply date filters from configuration."
                }).startup();
            }*/
        },

        _formatDate: function(value) {
            return this._monthNames[value.month()] + " " + value.date() + ", " + value.year();
        },

        isValidDate: function(d) {
            if (Object.prototype.toString.call(d) !== "[object Date]")
                return false;
            return !isNaN(d.getTime());
        },

        dateToYYMMDDinUTC: function(date) {
            // Add one to month since starts at 0
            var month = date.getUTCMonth() + 1;
            var monthStr = month.toString();
            if (month < 10) {
                monthStr = "0" + monthStr;
            }
            var day = date.getUTCDate();
            var dayStr = day.toString();
            if (day < 10) {
                dayStr = "0" + dayStr;
            }
            return date.getUTCFullYear() + "-" + monthStr + "-" + dayStr;
        },

        createDateItems: function() {
            // Create the start and end date widgets
            var _context = this;
            this.startDateWidget = new DateTextBox({
                value: "2000-01-01",
                style: "width: 120px;",
                onChange: function(v) {
                    if (_context.validate()) {
                        _context.hideError();
                        topic.publish(SearchEvent.prototype.START_DATE_CHANGE, {
                            startDate: moment.utc(v).startOf("day")
                        });
                    } else {
                        _context.displayError();
                    }
                }
            }, this.temporalFacetStartDate);

            this.endDateWidget = new DateTextBox({
                value: moment.utc().startOf("day").format("YYYY-MM-DD"),
                style: "width: 120px;",
                onChange: function(v) {
                    if (_context.validate()) {
                        _context.hideError();
                        topic.publish(SearchEvent.prototype.END_DATE_CHANGE, {
                            endDate: moment.utc(v).endOf("day")
                        });
                    } else {
                        _context.displayError();
                    }
                }
            }, this.temporalFacetEndDate);
        },

        displayError: function() {
            domAttr.set(this.errorMsg, "innerHTML", "Invalid dates – Ensure that 'from' is before 'to' and that both dates are in YYYY/MM/DD format.");
        },

        hideError: function() {
            domAttr.set(this.errorMsg, "innerHTML", "");
        },

        setStartDate: function(value) {
            // Set value without triggering onChange (third bool value controls this)
            this.startDateWidget.set("value", value.toDate(), false);
        },
        setEndDate: function(value) {
            // Set value without triggering onChange (third bool value controls this)
            this.endDateWidget.set("value", value.toDate(), false);
        },

        getStartDate: function() {
            return moment.utc(this.startDateWidget.get("value")).startOf("day");
        },

        getEndDate: function() {
            return moment.utc(this.endDateWidget.get("value")).endOf("day");;
        },

        apply: function() {
            // Validate
            if (!this.validate()) {
                return;
            }

            // If any datasets in granule selection, do popup confirmation
            if (this.addedDatasets.length > 0) {
                this.hide();
                new AlertDialog({
                    alertTitle: "Warning",
                    alertMessage: "Applying your new date range: <b>" +
                        this.search.dateToString(this.getStartDate()) + " – " + this.search.dateToString(this.getEndDate()) +
                        "</b> will reset your datasets in GRANULE SELECTION. All footprints and previews will be cleared. <br><i>Note, this will not affect anything currently in your downloads.</i>",
                    cancelAction: lang.hitch(this, function() {
                        this.show();
                    }),
                    confirmAction: lang.hitch(this, function() {
                        // Publish date change
                        this.currentStartDate = this.getStartDate();
                        this.currentEndDate = this.getEndDate();
                        topic.publish(SearchEvent.prototype.DATE_CHANGE, {
                            startDate: this.getStartDate(),
                            endDate: this.getEndDate(),
                            resetDatasets: true,
                            origin: "picker"
                        })
                    })
                }).startup();
            } else {
                // Publish date change and close
                this.currentStartDate = this.getStartDate();
                this.currentEndDate = this.getEndDate();
                topic.publish(SearchEvent.prototype.DATE_CHANGE, {
                    startDate: this.getStartDate(),
                    endDate: this.getEndDate(),
                    origin: "picker"
                });
                this.hide();
            }
        },

        refreshAddedDatasets: function() {
            var addedDatasets = this.granuleSelection.datasetController.datasetStore.query();
            if (addedDatasets.length > 0) {
                var text = "";
                var _context = this;
                addedDatasets.forEach(function(item) {
                    text += ("<div class='temporalFacetAddedDataset'><div class='temporalFacetAddedDatasetTitle'>" +
                        item.DatasetShortName + "</div>" + "<div class='temporalFacetAddedDatasetDate'>" + _context._formatDate(item.datasetStartDate) +
                        " – " + _context._formatDate(item.datasetEndDate) + "</div></div>");
                });
                domAttr.set(this.addedDatasetsListing, "innerHTML", text);
            } else {
                domAttr.set(this.addedDatasetsListing, "innerHTML", "None");
            }
            this.addedDatasets = addedDatasets;
        },

        clear: function() {
            this.startDateWidget.reset();
            this.endDateWidget.reset();
            this.apply();
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
            if (!this.startDateWidget.value || !this.endDateWidget.value) {
                return false;
            }
            if (!this.startDateWidget.validate() || !this.endDateWidget.validate()) {
                return false;
            }
            if (!this.validateDates(this.startDateWidget.value, this.endDateWidget.value)) {
                return false;
            }

            return true;
        },

        show: function() {
            // Set things up if this is the first time we've opened
            if (!this.modalObject) {
                this.createContainer();
                this.modalObject = query(this.dateRangeDialogModal);
            }
            this.modalObject.modal();
            this.refreshAddedDatasets();
            // this.refreshConstraints();
        },

        hide: function() {
            this.modalObject.modal("hide");
        }
    });
});
