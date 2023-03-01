define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/AlertDialog.html',
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
    "dojo/dom-style",
    "dojo/date/locale",
    "dojo/date",
    "dojox/layout/TableContainer",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on, registry, Form, Button, TextBox,
    ValidationTextBox, NumberTextBox, Select, topic, ToolEvent, domAttr, domStyle, locale, DojoDate, TableContainer, query, Modal, win) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function(options) {
            this.alertTitle = options.alertTitle;
            this.alertMessage = options.alertMessage;
            this.alertPrefooter = options.alertFooter;
            this.cancelAction = options.cancelAction;
            this.confirmAction = options.confirmAction;
        },

        startup: function() {
            if(this.alertTitle) {
                domAttr.set(this.alertDialogTitle, "innerHTML", this.alertTitle);
            }
            if(this.alertMessage) {
                domAttr.set(this.alertDialogMessage, "innerHTML", this.alertMessage);
            }
            if(this.alertPrefooter) {
                domAttr.set(this.alertDialogPrefooter, "innerHTML", this.alertPrefooter);
            }

        },

        postCreate: function() {
            this.createContainer();
            this.modalObject = query(this.alertDialogModal);
            this.modalObject.modal();
            var _context = this;
            if (typeof this.cancelAction === "function") {
                domAttr.set(this.cancelButton, "innerHTML", "Cancel");
                domStyle.set(this.cancelButton, "color", "red");
                on(this.cancelButton, "click", lang.hitch(this, function() {
                    this.cancelAction();
                    _context.hide();
                }));
            } else {
                on(this.cancelButton, "click", lang.hitch(this, this.hide));
            }
            if (typeof this.confirmAction === "function") {
                domAttr.set(this.confirmButton, "innerHTML", "Confirm");
                on(this.confirmButton, "click", lang.hitch(this, function() {
                    this.confirmAction();
                    _context.hide();
                }));
            } else {
                domStyle.set(this.confirmButton, "display", "none");
            }
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.modalObject.modal("hide");
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
