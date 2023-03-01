define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./../templates/HelpDialog.html',
    "xstyle/css!../css/HelpDialog.css",
    "dijit/Dialog",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dojo/topic",
    "jpl/events/BrowserEvent",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/query",
    "bootstrap/Modal",
    "dojo/_base/window",
    "jpl/utils/ConfigManager",
    "jpl/utils/JPLTour",
    "dojo/request/xhr"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, css, Dialog, connectUtil, lang, on,
    registry, topic, BrowserEvent, dom, domAttr, domStyle, domClass, query, Modal, win, ConfigManager, JPLTour, xhr) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        startup: function() {},

        postCreate: function() {
            // this.configManager = ConfigManager.getInstance();
            this.createContainer();
            this.modalObject = query(this.helpDialogModal);
            this.modalObject.modal();
            var _context = this;
            query(this.helpDialogModal).on("hidden.bs.modal", function() {
                _context.hide();
            })

            on(this.helpGalleryBackBtn, "click", function(evt){
                _context.setContentPage("helpRoot");
            });

            query(".help-link").on("click", function(evt){
                _context.setContentPage(evt.target.id);
            });
        },

        setContentPage: function(pageName) {

            if (pageName === "helpTutorial") {
                this.modalObject.modal("hide");
                this.startTour();
                return;
            }
            query(".help-container").addClass("help-container-hidden");
            domClass.remove(dom.byId(pageName + "Content"), "help-container-hidden");

            if (pageName === "helpRoot") {
                domStyle.set(this.helpGalleryBackBtn, "display", "none");
                domAttr.set(this.helpDialogTitle, "innerHTML", "Help");
            } else {
                domStyle.set(this.helpGalleryBackBtn, "display", "block");
                if (pageName === "helpAbout") {
                    var this_modal = this;
                    domAttr.set(this_modal.helpDialogTitle, "innerHTML", "About");
                    xhr('version.json', {
                        handleAs: "json",
                        sync : true
                    }).then(function(obj){
                        var hitide_version = obj['version'];
                        var text_version = 'version ' + hitide_version;
                        domAttr.set(this_modal.hitideVersion, "innerHTML", text_version);  
                    },function(err){});
                } else if (pageName === "helpFaq") {
                    domAttr.set(this.helpDialogTitle, "innerHTML", "FAQ");
                } else if (pageName === "helpContact") {
                    domAttr.set(this.helpDialogTitle, "innerHTML", "Contact");
                } else if (pageName === "helpReleaseNotes") {
                    domAttr.set(this.helpDialogTitle, "innerHTML", "Release Notes");
                } else if (pageName === "helpSystemRecommendation") {
                    domAttr.set(this.helpDialogTitle, "innerHTML", "System Recommendation");
                }
            }
        },

        startTour: function() {
            JPLTour().start();
        },

        show: function() {
            this.modalObject.modal();
        },

        hide: function() {
            this.destroy();
        },

        createContainer: function() {
            this.placeAt(win.body());
        }
    });
});
