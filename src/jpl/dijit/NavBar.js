define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/fx",
    "dojo/dom-style",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/NavBar.html',
    "xstyle/css!./css/NavBar.css",
    "jpl/config/Config",
    "dojo/topic",
    "jpl/events/BrowserEvent",
    "jpl/dijit/Login"
], function(declare, lang, fx, domStyle, _WidgetBase, _TemplatedMixin, template, css, Config, topic, BrowserEvent, login) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.config = Config.getInstance();

            login.init();
        }
        
    });
});
