    define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/hash",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/MapPermalink.html",
    "xstyle/css!./css/MapPermalink.css"

    ], function (declare, lang, on, topic, hash, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function () {
            //topic.subscribe("/dojo/hashchange", lang.hitch(this, this.updatePermalink));
        },

        postCreate: function () {
        },

        startup: function () {
            on(this.permalinkText, "click", this.highlightPermalink);
        },

        highlightPermalink: function(evt) {
            this.focus();
            this.select();
        }

        //updatePermalink: function(evt) {
        //    this.permalinkText.innerHTML = location.href;
        //}

    })
});