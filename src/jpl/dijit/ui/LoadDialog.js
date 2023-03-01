define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/LoadDialog.html',
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
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
    "dojo/date/locale",
    "dojo/date",
    "dojox/layout/TableContainer",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window",
    "jpl/utils/ConfigManager",
    'dgrid/OnDemandGrid',
    'dojo/store/Memory',
    'dgrid/Keyboard',
    'dgrid/Selection'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Dialog, connectUtil, lang, on, domClass, registry, Form, Button, TextBox,
    ValidationTextBox, NumberTextBox, Select, topic, BrowserEvent, domAttr, domStyle, locale, DojoDate, TableContainer, query, Modal, win, ConfigManager,
    OnDemandGrid, Memory, Keyboard, Selection) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        maxNameLength: 100,

        constructor: function() {},

        startup: function() {},

        postCreate: function() {
            this.configManager = ConfigManager.getInstance();
            this.createContainer();
            this.modalObject = query(this.loadDialogModal);

            this.modalObject.modal();
            var _context = this;
            query(this.loadDialogModal).on("hidden.bs.modal", function() {
                    _context.hide();
                })
                // on(this.loadForm, "submit", lang.hitch(this, this.loadConfigurationEvt));
                // on(this.cancelButton, "click", lang.hitch(this, function() {
                //     this.modalObject.modal("hide");
                // }));
            on(this.deleteButton, "click", lang.hitch(this, function() {
                this.onDeleteButtonClick();
            }));
            on(this.loadButton, "click", lang.hitch(this, function() {
                this.onLoadButtonClick();
            }));
            domAttr.set(this.loadDialogMessage, "innerHTML", "Load configurations you've saved from table below");

            this.initializeConfigurationGrid();
            // domAttr.set(this.saveDialogError, "innerHTML", "Configuration name above " + this.maxNameLength + " character limit.");

            topic.subscribe(BrowserEvent.prototype.CONFIG_UPDATED, lang.hitch(this, this.updateConfigurationGrid));
            topic.subscribe(BrowserEvent.prototype.TOGGLE_LOAD_DIALOG, lang.hitch(this, function(message) {
                if (message.state === "open") {
                    this.show();
                } else {
                    this.hide();
                }
            }));
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.destroy();
        },

        updateConfigurationGrid: function() {
            var configs = this.configManager.getConfigurations();
            // console.log(configs,"CONFIGS");
            var keys = Object.keys(configs);
            var configArray = keys.map(function(x) {
                return configs[x];

            });
            this.store.setData(configArray);
            this.configGrid.refresh();
        },

        initializeConfigurationGrid: function() {
            // Get configurations
            var configs = this.configManager.getConfigurations();
            // console.log("NEW DIALOG", configs)
            // Transform configs
            var keys = Object.keys(configs);
            var configArray = keys.map(function(x) {
                return configs[x];

            })
            var store = new Memory({
                data: configArray
            });
            this.store = store;
            var columns = [{
                field: "name",
                label: "Name"
            }];
            var configGrid = new(declare([OnDemandGrid, Keyboard, Selection]))({
                store: store,
                columns: columns,
                selectionMode: "single",
                sort: "name",
                cellNavigation: false,
                loadingMessage: "Loading Configurations..."
            }, this.configGridEl);

            configGrid.startup();


            configGrid.on('dgrid-select', lang.hitch(this, function(event) {
                this.onSelect(event.rows[0].data);
            }));
            configGrid.on('dgrid-deselect', lang.hitch(this, function(event) {
                this.onDeselect();
            }));

            configGrid.on('.dgrid-row:dblclick', lang.hitch(this, function(event) {
                var row = configGrid.row(event);
                this.loadConfiguration(row.data);
            }));

            configGrid.addKeyHandler(13, lang.hitch(this, function(event) {
                var row = configGrid.row(event);
                this.loadConfiguration(row.data);
            }));

            this.configGrid = configGrid;
        },

        onSelect: function(obj) {
            this.selectedObj = obj;
            // Enable btns
            domClass.remove(this.deleteButton, "hitide-btn-disabled");
            domClass.remove(this.loadButton, "hitide-btn-disabled");
        },

        onDeselect: function() {
            this.selectedObj = null;
            // Disable btns
            domClass.add(this.deleteButton, "hitide-btn-disabled");
            domClass.add(this.loadButton, "hitide-btn-disabled");
        },

        onDeleteButtonClick: function(evt) {
            // If we have a config selected, remove it
            if (!this.selectedObj) {
                return;
            } else {
                this.deleteConfiguration(this.selectedObj);
            }
        },

        onLoadButtonClick: function(evt) {
            // If we have a config selected, load it
            if (!this.selectedObj) {
                return;
            } else {
                this.loadConfiguration(this.selectedObj);
            }
        },

        deleteConfiguration: function(obj) {
            this.configManager.deleteConfig(obj);
        },

        loadConfiguration: function(obj) {
            this.configManager.loadConfig(obj)
            this.modalObject.modal("hide");
        },

        // showError: function() {
        //     domStyle.set(this.saveDialogError, "visibility", "visible");
        // },

        // hideError: function() {
        //     domStyle.set(this.saveDialogError, "visibility", "hidden");
        // },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
