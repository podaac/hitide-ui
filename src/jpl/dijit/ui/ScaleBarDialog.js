/**
 * A dialog window for Sun angle calculation parameters.
 *
 * @module jpl/dijit/ui/SunAngleDialog
 */

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/ScaleBarDialog.html',
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "xstyle/css!./../css/ScaleBarDialog.css",
    "dojo/topic",
    "jpl/events/ToolEvent",
    "dojo/dom-attr",
    "dojo/date/locale",
    "dojo/date",
    "dojo/query",
    "dojo/fx/Toggler",
    "jpl/data/ScaleBarUnits",
    "dojo/dom-construct",
    "jpl/events/MapEvent",
    "jpl/utils/LabelFormatter",
    "bootstrap/Modal",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil,
    lang, on, registry, ScaleBarDialogCSS, topic, ToolEvent, domAttr, locale, DojoDate, query, Toggler,
    ScaleBarUnits, domConstruct, MapEvent, LabelFormatter, Modal, win) {
    return declare("ScaleBarDialog", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        toggler: null,
        currentUnitId: 0,
        choice: 0,

        constructor: function() {},

        postCreate: function() {
            this.createContainer();
            this.populateContainer();
            this.setListeners();

            //Show
            query(this.scaleBarModal).modal();
        },

        show: function() {
            this.createContainer();
            this.populateContainer();
            this.setListeners();

            //Show
            query(this.scaleBarModal).modal();
        },

        hide: function() {
            query(this.scaleBarModal).modal("hide");
        },

        createContainer: function() {
            this.placeAt(win.body());
        },

        populateContainer: function() {
            var self = this;
            var units = ScaleBarUnits.getInstance().getUnits();
            this.currentUnitId = ScaleBarUnits.getInstance().getSelectedUnitId();

            var listContainer = query(this.scaleBarModalListGroup)[0];

            //Create list of choices
            var listString = "";
            units.forEach(function(unit) {
                var unitMeterValue = LabelFormatter.prototype.decimalFormat(unit.lengthMeters),
                    unitFeetValue = LabelFormatter.prototype.metersToFeet(unit.lengthMeters);

                if (unit.name === "Kilometers") {
                    listString += "<a value='" + unit.unitId + "'" +
                        "class='scaleBarItem'>" +
                        "<span class='text-units'>km</span>" +
                        "<span>" +
                        "<span class='scaleBarUnitName'>" + unit.name + "</span> : " + unitMeterValue + " meters " +
                        "/ " + unitFeetValue + " feet</span>" +
                        "</a>";
                } else if (unit.name === "Miles") {
                    listString += "<a value='" + unit.unitId + "'" +
                        "class='scaleBarItem'>" +
                        "<span class='text-units'>Mi</span>" +
                        "<span>" +
                        "<span class='scaleBarUnitName'>" + unit.name + "</span> : " + unitMeterValue + " meters " +
                        "/ " + unitFeetValue + " feet</span>" +
                        "</a>";
                } else {
                    listString += "<a value='" + unit.unitId + "'" +
                        "class='scaleBarItem'>" +
                        "<span class='" + unit.icon + " graphic-units'></span>" +
                        "<span style='position:relative;top:-10px;'><span class='scaleBarUnitName'>" + unit.name + "</span> : " + unitMeterValue + " meters " +
                        "/ " + unitFeetValue + " feet</a>";
                }
            });
            listContainer.innerHTML = listString;

            //Set all to inactive
            query(this.scaleBarModalListGroup).query(".scaleBarItem").forEach(function(listItemInactivate) {
                domAttr.set(listItemInactivate, "class", "scaleBarItem");
            });

            //Set the selected one to active
            domAttr.set(query(this.scaleBarModalListGroup).query(".scaleBarItem")[self.currentUnitId], "class", "scaleBarItem active");
        },

        setListeners: function() {
            this.setListSelectionListeners();
        },

        setListSelectionListeners: function() {
            this.choice = this.currentUnitId;
            var self = this;

            //Set click listener for each list item.
            query(self.scaleBarModalListGroup).query(".scaleBarItem").forEach(function(listItem) {
                // on(listItem, "click", lang.hitch(this, function() {
                //     this.choice = domAttr.get(listItem, "value");

                //     //Set all to inactive
                //     query(self.scaleBarModalListGroup).query(".scaleBarItem").forEach(function(listItemInactivate) {
                //         domAttr.set(listItemInactivate, "class", "scaleBarItem");
                //     });

                //     //Set the selected one to active
                //     domAttr.set(query(self.scaleBarModalListGroup).query(".scaleBarItem")[this.choice], "class", "scaleBarItem active");
                // }));

                //Dbl click is the same as selecting and then pressing the ok button
                on(listItem, "click", lang.hitch(this, function() {
                    this.choice = domAttr.get(listItem, "value");

                    //Set all to inactive
                    query(self.scaleBarModalListGroup).query(".scaleBarItem").forEach(function(listItemInactivate) {
                        domAttr.set(listItemInactivate, "class", "scaleBarItem");
                    });

                    //Set the selected one to active
                    domAttr.set(query(self.scaleBarModalListGroup).query(".scaleBarItem")[this.choice], "class", "scaleBarItem active");
                    self.changeScaleBar();
                    self.hide();
                }));
            });
        },

        changeScaleBar: function() {
            this.currentUnitId = domAttr.get(query(this.scaleBarModalListGroup).query(".scaleBarItem.active")[0], "value");
            ScaleBarUnits.getInstance().setSelectedUnitId(this.currentUnitId);
            topic.publish(MapEvent.prototype.CHANGE_SCALEBAR, {
                unitId: this.currentUnitId
            });
        },

        changeScaleBarUnitId: function(event) {
            this.currentUnitId = event.unitId;
        }
    });
});
