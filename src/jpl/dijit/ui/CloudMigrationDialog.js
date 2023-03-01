define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/CloudMigrationDialog.html',
    "xstyle/css!../css/CloudMigrationDialog.css",
    "dojo/query",
    "dojo/_base/window"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, css, query,  win) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        startup: function() {},

        postCreate: function() {
            this.createContainer();
            this.modalObject = query(this.cloudMigrationDialog);
            this.modalObject.modal();
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
