define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/ShareDialog.html',
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
    "jpl/events/BrowserEvent",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/date/locale",
    "dojo/date",
    "dojox/layout/TableContainer",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on, registry, Form, Button, TextBox,
    ValidationTextBox, NumberTextBox, Select, topic, BrowserEvent, domAttr, domStyle, domClass, locale, DojoDate, TableContainer, query, Modal, win) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        maxNameLength: 100,

        constructor: function() {},

        startup: function() {},

        postCreate: function() {
            this.createContainer();
            this.modalObject = query(this.shareDialogModal);
            this.modalObject.modal();
            var _context = this;
            query(this.shareDialogModal).on("shown.bs.modal", function() {
                // Highlight hack, can't seem to figure out how to do it the Dojo way..
                _context.shareableUrl.focus();
                document.getElementById(_context.shareableUrl.id).select();
            });
            query(this.shareDialogModal).on("hidden.bs.modal", function() {
                _context.hide();
            })
            on(this.closeButton, "click", lang.hitch(this, function() {
                this.modalObject.modal("hide");
            }));
            on(this.shareForm, "submit", lang.hitch(this, this.formSubmit));
            this.shareableUrl.setValue(this.getLink());
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.destroy();
        },

        getLink: function() {
            return window.location.href;
        },

        formSubmit: function(evt) {
            evt.preventDefault();
            this.modalObject.modal("hide");
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
