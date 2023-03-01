/**
 * A dialog window for Date Time calculation parameters.
 *
 * @module jpl/dijit/ui/DateTimeDialog
 */

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/DateTimeDialog.html',
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dijit/form/Form",
    "dijit/form/DateTextBox",
    "dijit/form/TimeTextBox",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/form/ValidationTextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/Select",
    "xstyle/css!./../css/SunAngleDialog.css",
    "dojo/topic",
    "jpl/events/ToolEvent",
    "dojo/dom-attr",
    "dojo/date/locale",
    "dojo/date",
    "dojox/layout/TableContainer",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on, registry, Form, DateTextBox, TimeTextBox, Button, TextBox,
            ValidationTextBox, NumberTextBox, Select, sunAngleDialogCSS, topic, ToolEvent , domAttr, locale, DojoDate, TableContainer, query, Modal, win){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
        templateString: template,
        widgetsInTemplate: true,

        constructor: function (topicType, topicArgs) {
            this.topicType = topicType;
            this.topicArgs = topicArgs;
        },

        postCreate: function () {
            this.createContainer();
            this.modalObject = query(this.dateTimeModal);
            this.modalObject.modal();

            on(this.submitButton, "click", lang.hitch(this, this.formSubmit));
            on(this.cancelButton, "click", lang.hitch(this, this.hide));
        },

        show: function(){
           this.modalObject.modal();
        },

        hide: function() {
            this.modalObject.modal("hide");
        },

        formSubmit: function() {
            var startDateTime = this.combineDateAndTime(
                this.dateTimeForm.getValues().sunAngleStartDate,
                this.dateTimeForm.getValues().sunAngleStartTime
            );
            var endDateTime = this.combineDateAndTime(
                this.dateTimeForm.getValues().sunAngleEndDate,
                this.dateTimeForm.getValues().sunAngleEndTime
            );
            var startDate = locale.format(startDateTime, {selector:"date", datePattern:"yyyy-MM-dd"});
            var startTime = locale.format(startDateTime, {selector:"date", datePattern:"HH:mm:ss"});
            var endDate = locale.format(endDateTime, {selector:"date", datePattern:"yyyy-MM-dd"});
            var endTime = locale.format(endDateTime, {selector:"date", datePattern:"HH:mm:ss"});

            this.topicArgs.url = this.topicArgs.url.replace("{starttime}", Date.parse(startDateTime))
                .replace("{startdate}", startDate)
                .replace("{endtime}", Date.parse(endDateTime))
                .replace("{enddate}", endDate)
                .replace("{producttype}", this.productType.value);

            this.topicArgs.distributionURL = this.topicArgs.distributionURL.replace("{starttime}", startTime)
                .replace("{startdate}", startDate)
                .replace("{endtime}", endTime)
                .replace("{enddate}", endDate)
                .replace("{producttype}", this.productType.value);

            this.topicArgs.startDate = startDate;
            this.topicArgs.startTime = startTime;
            this.topicArgs.endDate = endDate;
            this.topicArgs.endTime = endTime;
            this.topicArgs.productType = this.productType.value;

            topic.publish(this.topicType, this.topicArgs);

            this.hide();
        },

        createContainer: function(){
            this.placeAt(win.body());
        },

        validateDates: function(startDate, endDate){
            if (DojoDate.compare(startDate, endDate) >= 0){
                return false;
            }
            return true;
        },

        combineDateAndTime: function(date, time){
            var year = locale.format(date, {selector:"date", datePattern:"yyyy"});
            var month = parseInt(locale.format(date, {selector:"date", datePattern:"MM"}), 10) - 1;
            var day = locale.format(date, {selector:"date", datePattern:"dd"});
            var hour = locale.format(time, {selector:"date", datePattern:"H"});
            var minute = locale.format(time, {selector:"date", datePattern:"m"});
            var second = locale.format(time, {selector:"date", datePattern:"s"});

            return new Date(year, month, day, hour, minute, second);
        }
    });
});