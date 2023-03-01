/**
 * Main Application entry point. Loads configuration
 *
 * @module app/App
 * @requires jpl/events/MapEvent
 */

define([
    'dojo/_base/declare',
    "dojo/_base/lang",
    "dojo/sniff",
    "dojo/parser",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom",
    "dojo/topic",
    "dojo/query",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/_base/fx",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./templates/App.html',
    "jpl/events/BrowserEvent",
    "jpl/dijit/SearchMap",
    "jpl/dijit/NavBar",
    "jpl/dijit/NavSidebar",
    "jpl/dijit/ControlBar",
    "jpl/utils/FeatureDetector",
    "dijit/layout/ContentPane",
    "jpl/events/MapEvent",
    "jpl/events/SearchEvent",
    "bootstrap/Modal",
    "jpl/dijit/ui/ModalDialog",
    "jpl/utils/ConfigManager",
    "jpl/utils/Analytics",
    "jpl/utils/JPLTour",
    "jpl/config/Config"
], function(declare, lang, has, parser, on, domConstruct, domStyle, domClass, domAttr, dom, topic, query, Deferred, all, baseFx, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, BrowserEvent,
    SearchMap, NavBar, NavSidebar, ControlBar, FeatureDetector, ContentPane, MapEvent, SearchEvent,
    Modal, ModalDialog, ConfigManager, Analytics, JPLTour, Config) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        detectedFeatures: FeatureDetector.getInstance(),
        config: Config.getInstance(),
        userConfig: ConfigManager.getInstance(),

        postCreate: function() {
            topic.subscribe(BrowserEvent.prototype.SHOW_ALERT, lang.hitch(this, this.showAlertMessage));
            // topic.subscribe(MapEvent.prototype.SPATIAL_FACET_MAP_READY, lang.hitch(this, this.appReady));

            var _context = this;
            all([this.createTopicPromise(MapEvent.prototype.SPATIAL_FACET_MAP_READY),
                this.createTopicPromise(SearchEvent.prototype.SEARCH_LOADED)
            ]).then(function(values) {
                // if values[1].success
                _context.appReady();
            });


            on(window, "resize", lang.hitch(this, this.windowResized));
        },

        startup: function() {
            this.setupAnalytics();

            if (has("ie") < 10) {
                //Not allowing IE for now, need to eventually check versions from 12 backwards
                var errorMessage = '<h1>' + this.config.siteTitle + '</h1>' +
                    '<div class="jumbotron">' +
                    '<h2">Unsupported Version of Internet Explorer</h2>' +
                    '<h4>Internet Explorer is only supported for version 10+. <br />Please revisit this site with a modern version of Internet Explorer to use the application.' +
                    '</div>';
                domAttr.set("appLoadingDiv", "innerHTML", errorMessage);
            } else if (this.detectedFeatures.mobileDevice) {
                var errorMessage = '<div style="background:white;width:100%;height:100%;position:absolute"><h1 style="margin-top: 30px;">' + this.config.siteTitle + '</h1>' +
                    '<h2 style="font-style:italic;font-size: 2em;margin-top: 30px;">Mobile Devices not Supported</h2>' + "</div>";
                domAttr.set("appLoadingDiv", "innerHTML", errorMessage);
            } else {
                this.inherited(arguments);

                if (this.detectedFeatures.webGL && !this.detectedFeatures.mobileDevice && this.config.controls.threedee) {
                } else {
                    topic.publish(MapEvent.prototype.GLOBE_INITIALIZED, {
                        eType: MapEvent.prototype.GLOBE_INITIALIZED
                    });
                }
            }
        },

        setupAnalytics: function() {
            // new Analytics(this.config.googleAnalyticsID);
        },

        /**
         * Called when all dependencies have been loaded and initialized
         *
         */
        appReady: function() {
            if (!this.userConfig.preferences.showWelcomePage) {
                this.continueToApp(false);
                return;
            }
            // Transition loading page into ready state
            // Hide loading element
            // domStyle.set("loader-container", "display", "none");
            domStyle.set("loader-container", "opacity", "0");
            domStyle.set("loader-container", "z-index", "-1");
            // Show tri logo
            domStyle.set("triLogo", "opacity", "1");
            domStyle.set("triLogo", "z-index", "99");
            // domStyle.set("triLogo", "display", "block");
            // Show HiTIDE helper text
            domStyle.set("appLoadingSubtitle", "opacity", "1");
            // domStyle.set("appLoadingSubtitle", "display", "block");
            // Show buttons
            domStyle.set("appLoadingBtns", "opacity", "1");
            domStyle.set("appLoadingBtns", "z-index", "99");
            domStyle.set("autoContinue", "display", "block");
            // Show footer
            domStyle.set("appLoadingFooterLink", "opacity", "1");
            domAttr.set("appLoadingFooterLink", "innerHTML", "Powered by PO.DAAC");
            domStyle.set("appLoadingFooterLink", "z-index", "1");

            // On autoContinue click, change btn state and set pref in local storage
            var showWelcomePage = this.userConfig.preferences.showWelcomePage;
            this.toggleCBState(showWelcomePage);
            on(dom.byId("autoContinue"), "click", lang.hitch(this, function() {
                showWelcomePage = !showWelcomePage;
                this.toggleCBState(showWelcomePage);
                this.userConfig.preferences.showWelcomePage = showWelcomePage;
                topic.publish(BrowserEvent.prototype.PREFERENCES_CHANGED, this.userConfig.preferences);
            }))

            // On click, continue to app with or without tutorial depending on btn
            on(dom.byId("appLoadingBtnContinue"), "click", lang.hitch(this, function() {
                this.continueToApp(false);
            }));

            on(dom.byId("appLoadingBtnTutorial"), "click", lang.hitch(this, function() {
                this.continueToApp(true);
            }));
        },

        toggleCBState: function(show) {
            if (show) {
                domClass.remove(dom.byId("autoContinueCB"), "fa-check-square");
                domClass.add(dom.byId("autoContinueCB"), "fa-square-o");
            } else {
                domClass.add(dom.byId("autoContinueCB"), "fa-check-square");
                domClass.remove(dom.byId("autoContinueCB"), "fa-square-o");
            }
        },

        continueToApp: function(playTutorial) {
            // Fade out logo on main page. Kind of a hack since it I was running into some weird
            // event glitches elsewhere..
            // baseFx.fadeOut({
            //     node: "navbarPODAACLogo",
            //     duration: 4000,
            //     delay: 10000,
            //     onEnd: lang.hitch(this, function() {
            //         setTimeout(function() {
            //             domStyle.set("navBar", "display", "none");
            //         }, 100);
            //     })
            // }).play();

            // Trigger tutorial start if needed
            // Destroy loading page
            domConstruct.destroy("appLoadingDiv");
            topic.publish(BrowserEvent.prototype.WINDOW_RESIZED);
            if (playTutorial) {
                // setTimeout(function() {
                    JPLTour().start();
                // }, 50)
            }
        },

        windowResized: function(evt) {
            topic.publish(BrowserEvent.prototype.WINDOW_RESIZED, {
                height: evt.currentTarget.innerHeight,
                width: evt.currentTarget.innerWidth
            });
        },

        showAlertMessage: function(evt) {
            new ModalDialog(evt.title, evt.content, evt.size).startup();
        },

        createTopicPromise: function(topicName) {
            var dfd = new Deferred(); // dojo/Deferred
            var handle = topic.subscribe(topicName, function(someValue) {
                handle.remove();
                dfd.resolve(someValue);
            });
            return dfd.promise;
        }
    });
});
