define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "dojo/on",
    "dojo/topic",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/query",
    "dojo/_base/fx",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TabBar.html',
    "xstyle/css!./css/TabBar.css",
    "jpl/config/Config",
    "jpl/events/NavigationEvent",
    "jpl/events/SearchEvent",
    "jpl/events/MyDataEvent",
    "jpl/utils/DOMUtil",
    "jpl/dijit/ui/SaveDialog",
    "jpl/dijit/ui/ShareDialog",
    "jpl/dijit/ui/LoadDialog",
    "jpl/dijit/ui/PreferencesDialog",
    "jpl/dijit/ui/HelpDialog",
    "jpl/dijit/ui/AlertDialog",
    "dojo/NodeList-traverse",
    "dojo/NodeList-dom",
    "bootstrap/Tooltip"
], function(declare, lang, has, on, topic, dom, domStyle, domConstruct, domGeometry, domAttr, domClass, query, baseFx, registry, _WidgetBase, _TemplatedMixin,
    template, css, Config, NavigationEvent, SearchEvent, MyDataEvent, DOMUtil, SaveDialog, ShareDialog, LoadDialog, PreferencesDialog, HelpDialog, AlertDialog) {

    var defaults = {
        defaultTab: "Search"
    };

    topic.subscribe(NavigationEvent.prototype.SWITCH_TAB, function(message) {
        defaults.defaultTab = message.tabID;
    });

    var TabBar = declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        activeControlOption: "",
        currentView: "map",
        gameControlsEnabled: false,
        configReady: false,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.toggleOpen = dom.byId("toggleOpen");
            this.config = Config.getInstance();
            this.setSubscriptions();
            this.setEventHandlers();
        },

        setSubscriptions: function() {
            topic.subscribe(NavigationEvent.prototype.SIDEBAR_READY, lang.hitch(this, this.openSidebarAndSwitch));
            topic.subscribe(SearchEvent.prototype.DATASET_COUNT_CHANGE, lang.hitch(this, this.granuleSelectionCountChange));
            topic.subscribe(MyDataEvent.prototype.GRANULE_COUNT_CHANGE, lang.hitch(this, this.downloadsCountChange));
            topic.subscribe(NavigationEvent.prototype.SWITCH_TAB, lang.hitch(this, function(message) {
                this.switchTab(message.tabID);
            }));
        },

        setEventHandlers: function() {
            on(document, ".tab-li:click", lang.hitch(this, function(evt) {
                topic.publish(NavigationEvent.prototype.SWITCH_TAB, { tabID: evt.target.getAttribute("rel") });
                // this.switchTab(evt.target.getAttribute("rel"));
            }));

            on(this.tabTitleLink, "click", function() {
                window.location = window.location.href.split("#")[0];
            });

            on(this.toggleClose, "click", lang.hitch(this, this.closeSidebar));
            on(this.toggleOpen, "click", lang.hitch(this, this.openSidebar));
            on(this.utilityFunctionSave, "click", function() {
                new SaveDialog().startup();
            });
            on(this.utilityFunctionShare, "click", function() {
                new ShareDialog().startup();
            });
            on(this.utilityFunctionLoad, "click", function() {
                new LoadDialog().startup();
            });
            on(this.utilityFunctionPreferences, "click", function() {
                new PreferencesDialog().startup();
            });
            on(this.utilityFunctionHelp, "click", function() {
                console.log("HELP");
                new HelpDialog().startup();
            });
        },
        openSidebarAndSwitch: function() {
            this.openSidebar();
            var context = this;
            setTimeout(function() {
                context.switchTab(defaults.defaultTab);
                context.initializeTooltips();
            }, 400);

        },
        initializeTooltips: function() {
            // Toggle open and close tooltips
            query('[data-toggle="tooltip"]').tooltip({
                trigger: "hover",
                container: query("body")[0],
                delay: {
                    show: 500
                }
            })
        },
        openSidebar: function() {
            // Open navsidebar
            topic.publish(NavigationEvent.prototype.OPEN_SIDEBAR, {});

            // Hide map sidebar toggle
            domStyle.set(this.toggleOpen, "opacity", "0")
            domStyle.set(this.toggleOpen, 'display', 'none');
        },

        closeSidebar: function() {
            // Close navsidebar
            topic.publish(NavigationEvent.prototype.CLOSE_SIDEBAR);

            // Show map sidebar toggle
            domStyle.set(this.toggleOpen, 'display', 'block');
            domStyle.set(this.toggleOpen, "opacity", "0");
            baseFx.fadeIn({
                node: this.toggleOpen
            }).play();
        },

        clearSelectedControls: function() {
            query("#tab-items li", this.domNode).forEach(function(node) {
                domClass.remove(node, "tab-selected");
            });

            this.activeControlOption = "";
        },

        switchTab: function(option) {
            if (option !== this.activeControlOption) {
                this.clearSelectedControls();
                var controlNode = query(".tab-link[rel=" + option + "]", this.domNode).parent()[0];
                domClass.add(controlNode, "tab-selected");
                this.activeControlOption = option;

                // Animate tab progress bar
                topic.publish(NavigationEvent.prototype.SELECT_PAGE, {
                    "pageID": option
                });

                var search = domGeometry.position(this.tabItemSearch, false);
                var granule = domGeometry.position(this.tabItemGranuleSelection, false);
                var downloads = domGeometry.position(this.tabItemDownloads, false);

                var targetWidth = 0;
                if (option === "Search") {
                    targetWidth = search.w;
                } else if (option === "GranuleSelection") {
                    targetWidth = search.w + granule.w;
                } else if (option === "Downloads") {
                    targetWidth = search.w + granule.w + downloads.w;
                }

                domStyle.set(this.tabProgress, "width", targetWidth + "px");

                // Animate icon transition
                var tabProgressArrow = this.tabProgressArrow;
                var tabProgressEnd = this.tabProgressEnd;
                if (option === "Downloads") {
                    domStyle.set(tabProgressArrow, "display", "none");
                    domStyle.set(tabProgressEnd, "display", "block");
                } else {
                    domStyle.set(tabProgressEnd, "display", "none");
                    domStyle.set(tabProgressArrow, "display", "block");
                }
            }
        },
        granuleSelectionCountChange: function(message) {
            this.updateAndHighlightBadge(this.granuleSelectionTabBadge, message.count);
        },
        downloadsCountChange: function(message) {
            this.updateAndHighlightBadge(this.downloadsTabBadge, message.count);
        },
        updateAndHighlightBadge: function(node, count) {
            if (node.innerHTML === count) {
                return;
            }
            if (count === 0) {
                // Hide badge
                domStyle.set(node, "transform", "scale(0)");
                domAttr.set(node, "innerHTML", "");
            } else {
                var targetSize = 18;
                if (count > 9999) {
                    targetSize = 44;
                } else if (count > 999) {
                    targetSize = 31;
                } else if (count > 99) {
                    targetSize = 27;
                } else if (count > 9) {
                    targetSize = 24;
                }
                domStyle.set(node, "opacity", 1);
                domStyle.set(node, "width", targetSize + "px");
                // domStyle.set(node, "height", targetSize + "px");
                domStyle.set(node, "transform", "scale(1)");
                domAttr.set(node, "innerHTML", count);
                domClass.remove(node, "tab-badge-pulse");
                //trigger reflow for animation
                node.offsetWidth = node.offsetWidth;
                domClass.add(node, "tab-badge-pulse");
            }
            node.innerHTML = count;
        }
    });

    return TabBar;
});
