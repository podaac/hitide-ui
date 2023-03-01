define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/parser",
    "dojo/on",
    "dojo/dom",
    "dojo/has",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-construct",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/NavSidebar.html',
    "xstyle/css!./css/NavSidebar.css",
    "jpl/events/NavigationEvent",
    "jpl/events/BrowserEvent",
    "jpl/events/MapEvent",
    "jpl/utils/MapUtil",
    "jpl/dijit/TabBar",
    "dijit/layout/StackContainer",
    "dijit/layout/ContentPane",
    "jpl/dijit/Search",
    "jpl/dijit/GranuleSelection",
    "jpl/dijit/Downloads",
    "jpl/utils/FeatureDetector",
    "bootstrap/Tooltip",
    "dojo/NodeList-traverse",
    "dojo/NodeList-dom"
], function(declare, lang, query, parser, on, dom, has, topic, domClass, domAttr, domStyle, domConstruct, _WidgetBase, _TemplatedMixin,
    template, css, NavigationEvent, BrowserEvent, MapEvent, MapUtil, TabBar, StackContainer, ContentPane, Search, GranuleSelection, Downloads, FeatureDetector, Tooltip) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: false,
        sidebarStackContainer: "",
        tabBar: "",

        startup: function() {
            this.detectedFeatures = FeatureDetector.getInstance();
            this.initTabBar();
            this.initStackContainer();
            topic.subscribe(NavigationEvent.prototype.SELECT_PAGE, lang.hitch(this, this.selectPage));
            topic.subscribe(NavigationEvent.prototype.OPEN_SIDEBAR, lang.hitch(this, this.openSidebar));
            topic.subscribe(NavigationEvent.prototype.CLOSE_SIDEBAR, lang.hitch(this, this.closeSidebar));
            topic.subscribe(NavigationEvent.prototype.SHRINK_SIDEBAR, lang.hitch(this, this.shrinkSidebar));
            topic.subscribe(NavigationEvent.prototype.EXPAND_SIDEBAR, lang.hitch(this, this.expandSidebar));
            topic.subscribe(BrowserEvent.prototype.WINDOW_RESIZED, lang.hitch(this, this.windowResized));
            topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, function() {
                topic.publish(NavigationEvent.prototype.SIDEBAR_READY);
            }))
        },

        initTabBar: function() {
            this.tabBar = new TabBar();
            this.tabBar.startup();
            domConstruct.place(this.tabBar.domNode, this.tabsContainer);
        },

        initStackContainer: function() {
            this.sidebarStackContainer = new StackContainer({
                style: "width:100%;height:100%;",
                id: "sidebarStackContainer"
            }, "scontainer");

            this.addStackContainerItem(new Search, "Search", "Search");
            this.addStackContainerItem(new GranuleSelection(), "GranuleSelection", "GranuleSelection");
            this.addStackContainerItem(new Downloads(), "Downloads", "Downloads");
            this.sidebarStackContainer.startup();
            // this.windowResized();

            //initialize the tooltips for non-mobile users. Mobile causes tooltips to show when touched.
            // if (!this.detectedFeatures.mobileDevice) {
            //     $('[class="tabs-link"]').tooltip({
            //         trigger: "hover"
            //     })
            // }
        },

        addStackContainerItem: function(item, title, id) {
            this.sidebarStackContainer.addChild(
                new ContentPane({
                    title: title,
                    content: item,
                    id: id
                })
            );
        },

        selectPage: function(evt) {
            var pageID = evt.pageID;
            var selectedPageID = "";
            switch (pageID) {
                case "Search":
                    selectedPageID = "Search";
                    break;
                case "GranuleSelection":
                    selectedPageID = "GranuleSelection";
                    break;
                case "Downloads":
                    selectedPageID = "Downloads";
                    break;
            }

            if (selectedPageID !== "") {
                this.sidebarStackContainer.selectChild(selectedPageID, false);
                this.windowResized({});
            } else {
                console.warn("WARNING: Selected page:", selectedPageID, "not found!")
            }
        },

        windowResized: function(message) {
            var sillyChildren = this.sidebarStackContainer.getChildren();
            var size = document.body.clientHeight - this.tabsContainer.clientHeight;
            for (var i = 0; i < sillyChildren.length; i++) {
                sillyChildren[i].domNode.style.height = size + "px";
            }
            // setTimeout(function() {
            topic.publish(BrowserEvent.prototype.FINISHED_RESIZING, { size: size });
            // }, 500)
        },

        openSidebar: function(evt) {
            domClass.add(document.body, "sidebar-open");
            // this.selectPage(evt.selectedOption);

            //default to fire the resize event
            if (evt.resize === undefined) {
                evt.resize = true;
            }

            if (evt.resize) {
                MapUtil.prototype.resizeFix();
            }
        },

        closeSidebar: function(evt) {
            domClass.remove(document.body, "sidebar-open");
            domStyle.set("mainContentWrapper", "left", "0px");

            //default to fire the resize event
            if (!evt) {
                evt = {
                    resize: true
                }
            }

            if (evt.resize) {
                MapUtil.prototype.resizeFix();
            }
        }
    });
});
