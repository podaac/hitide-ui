/**
 * A dialog window for entering an email address and starting a download job.
 *
 * @module jpl/dijit/ui/EmailSubmissionDialog
 */

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/EmailSubmissionDialog.html',
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dijit/form/Form",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/form/ValidationTextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/Select",
    "dojo/topic",
    "jpl/events/ToolEvent",
    "dojo/dom-attr",
    "dojo/date/locale",
    "dojo/date",
    "dojox/layout/TableContainer",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on, registry, Form, Button, TextBox,
            ValidationTextBox, NumberTextBox, Select, topic, ToolEvent , domAttr, locale, DojoDate, TableContainer, query, Modal, win){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
        templateString: template,
        widgetsInTemplate: true,

        constructor: function (topicType, topicArgs) {
            this.topicType = topicType;
            this.topicArgs = topicArgs;
        },

        postCreate: function () {
            this.createContainer();
            this.modalObject = query(this.emailSubmissionModal);
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
            var emailAddress = this.emailAddress.getValue();
            var resolution = this.resolution.getValue();
            if (!this.emailAddress.validate()) {
                this.emailAddress.focus();
                this.emailAddress.displayMessage("Invalid email address");
                return;
            } else {
                this.topicArgs.jobUrl = this.topicArgs.jobUrl.replace("{emailAddress}", emailAddress)
                                        .replace("{resolution}", resolution);

                topic.publish(this.topicType, this.topicArgs);

                this.hide();
            }
        },

        createContainer: function(){
            this.placeAt(win.body());
        }
    });
}); 