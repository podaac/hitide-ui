define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/SaveDialog.html',
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
            this.modalObject = query(this.saveDialogModal);
            this.modalObject.modal();
            var _context = this;
            query(this.saveDialogModal).on("shown.bs.modal", function() {
                // Highlight hack, can't seem to figure out how to do it the Dojo way..
                _context.configurationName.focus();
                document.getElementById(_context.configurationName.id).select();
            })
            query(this.saveDialogModal).on("hidden.bs.modal", function() {
                _context.hide();
            })
            on(this.configurationName, "change", lang.hitch(this, this.validateName));
            on(this.saveButton, "click", lang.hitch(this, this.saveConfiguration));
            on(this.saveForm, "submit", lang.hitch(this, this.saveConfiguration));
            domAttr.set(this.saveDialogMessage, "innerHTML",
                "Enter a name for your current configuration or use the automatically generated name. <i>Character limit of " + this.maxNameLength + "</i>");
            domAttr.set(this.saveDialogError, "innerHTML", "Configuration name above " + this.maxNameLength + " character limit.");
            this.hideError();
            this.configurationName.setValue(this.getDefaultName());
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.destroy();
        },

        getDefaultName: function() {
            // TODO: Query config manager for default name
            //   base off current config
            return new Date().toString();
        },

        validateName: function() {
            var name = this.configurationName.get("value");
            if (name.length > this.maxNameLength) {
                this.showError();
                return false;
            }
            this.hideError();
            return true;
        },

        saveConfiguration: function(evt) {
            evt.preventDefault();
            if (this.validateName()) {
                topic.publish(BrowserEvent.prototype.SAVE_CONFIG, {
                    name: this.configurationName.get("value")
                });
                this.modalObject.modal("hide");
            }
        },

        showError: function() {
            domStyle.set(this.saveDialogError, "visibility", "visible");
        },

        hideError: function() {
            domStyle.set(this.saveDialogError, "visibility", "hidden");
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
