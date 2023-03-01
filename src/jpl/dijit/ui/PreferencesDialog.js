define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/PreferencesDialog.html',
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dojo/topic",
    "jpl/events/BrowserEvent",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window",
    "jpl/utils/ConfigManager"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on,
    registry, topic, BrowserEvent, domAttr, domStyle, domClass, query, Modal, win, ConfigManager) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        maxNameLength: 100,

        constructor: function() {},

        startup: function() {},

        postCreate: function() {
            this.configManager = ConfigManager.getInstance();
            // Set form preferences
            this.setFormPreferences();
            this.createContainer();
            this.modalObject = query(this.preferencesDialogModal);
            this.modalObject.modal();
            var _context = this;
            query(this.preferencesDialogModal).on("hidden.bs.modal", function() {
                _context.hide();
            })
            on(this.saveButton, "click", lang.hitch(this, this.save));
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.destroy();
        },

        setFormPreferences: function() {
            var prefs = this.configManager.getPreferences();
            domAttr.set(this.pref_showWelcomePage, "checked", !prefs.showWelcomePage);
        },

        getPreferencesFromForm: function() {
            return {
                showWelcomePage: !this.pref_showWelcomePage.checked
            };
        },

        save: function(evt) {
            evt.preventDefault();
            // Tell configManager to save
            console.log("SAVING", this.getPreferencesFromForm())
            topic.publish(BrowserEvent.prototype.PREFERENCES_CHANGED, this.getPreferencesFromForm());
            this.modalObject.modal("hide");
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
