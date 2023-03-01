define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/request/xhr",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Preferences.html',
    "xstyle/css!./css/Preferences.css",
    "jpl/utils/AnimationUtil",
    "jpl/events/MyDataEvent",
    "jpl/config/Config"
], function(declare, lang, on, topic, domStyle, domConstruct, query, xhr, domClass, domAttr, registry, _WidgetBase, _TemplatedMixin,
    template, css, AnimationUtil, MyDataEvent, Config) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        postCreate: function() {

        },

        startup: function() {
            this.config = Config.getInstance();
            // on(this.CANCEL_BUTTON, 'click', function(evt) {
            //     topic.publish(MyDataEvent.prototype.CANCEL_REQUESTS, {
            //         target: "*"
            //     });
            // });

            // topic.subscribe(MyDataEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, lang.hitch(this, this.switchActiveGranulesController));
        }
    });
});
