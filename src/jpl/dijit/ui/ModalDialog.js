define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/query",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!../templates/ModalDialog.html'
], function (declare, lang, on, topic, query, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        title: "",
        content: "",
        size: "sm",
        buttonText: "OK",

        constructor: function (title, content, size, buttonText) {
            this.title = title;
            this.content = content;

            if(size === "lg") {
                this.size = size;
            }

            if(buttonText) {
                this.buttonText = buttonText;
            }
        },

        postCreate: function () {
        },

        startup: function () {
            query(this.modalContainer).modal();
        }
    });
});