define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/query",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/cookie",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/HelpGallery.html',
    "xstyle/css!./css/HelpGallery.css",
    "jpl/events/MapEvent",
    "jpl/events/NavigationEvent",
    "jpl/config/Config",
    "bootstrap-tour/Tour",
    "jpl/utils/FeatureDetector"
], function (declare, lang, on, query, dom, domAttr, domClass, domStyle, topic, cookie, _WidgetBase, _TemplatedMixin,
             template, css, MapEvent, NavigationEvent, Config, Tour, FeatureDetector) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        mapDijit: "",
        searchType: "all",
        detectedFeatures: FeatureDetector.getInstance(),

        constructor: function () {
        },

        postCreate: function () {

        },

        startup: function () {
            this.config = Config.getInstance();
            domClass.add(this.domNode, "sidenav-gallery");

            on(this.tutorialBtn, "click", lang.hitch(this, this.startTour));

            on(window.document, "#tourShowPreferenceCkbox:click", function() {
                cookie("disableInitialTour", true, {expires: 3600 * 1000 * 24 * 365 * 2});
            });

            //if(!cookie("disableInitialTour")) {
            //    setTimeout(lang.hitch(this, this.startTour), 3000);
            //}

            domStyle.set("helpSpinner", "transform", "translateX(100%)");
            domStyle.set("helpSpinner", "-webkit-transform", "translateX(100%)");

            on(window.document, ".help-option:click", lang.hitch(this, this.showHelpContent));
            on(this.helpGalleryBackBtn, "click", lang.hitch(this, this.showMainContent));
        },

        getSteps: function() {
            var steps = [
                {
                    title: "<h1>Welcome to Vesta Trek</h1>",
                    backdrop: true,
                    content: '<span style="font-size: 1.2em;text-align:left;display:inline-block;">Vesta Trek is an application that allows you to view imagery and perform analysis on data from the asteroid Vesta.</span>',
                    template: "<div class='popover tour' style='max-width:400px;width:90%;text-align:center;'><div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'>" +
                    "<button class='btn btn-success' data-role='next'><span class='fa fa-check'></span> Start The Tour</button> <button class='btn btn-primary' data-role='end' style='float:none;'>Skip The Tour</button> </div>" +
                    "<div class='checkbox'> <label><input id='tourShowPreferenceCkbox' type='checkbox'> Do not show this dialog again </label></div></div></div>"
                },
                {
                    title: "<h2>What is Vesta?</h2>",
                    backdrop: true,
                    content: "<img src='./jpl/assets/images/facts/3dview.jpg' align='left' width='150' class='img-rounded' style='margin: 0 10px 0 0;' />" +
                    "<p>Discovered in 1807, Vesta is the second most massive body in the asteroid belt and is occasionally visible from Earth with a naked eye. It rotates every 5 hours 18 minutes, and has a temperature that ranges from -3&deg;C (27&deg;F) to -188&deg;C (-306&deg;F).</p>" +
                    "<p>Use Vesta Trek to explore its massive craters, and keep in mind that meteorites found on Earth have been traced back to originate from these areas. The majority of the equatorial region is sculpted by a series of troughs. " +
                    "The largest trough is 10-20 km wide (6.2-12.4 miles) and 465 km long (289 miles), which is very similar in size to the Grand Canyon (6.4-29 km wide (4-18 miles) and 446 km long (277 miles)).</p>" +
                    "<p>In 2011 the Dawn spacecraft visited Vesta for about a year, collecting data with its various on-board instruments. " +
                    "Use Vesta Trek to explore these data sets as colorized layers and compare the differences between the north and south polar regions.</p><p>For more detailed information, please visit our <a href='./facts.html' target='_blank' style='text-decoration:underline;color:#87AFE2'>About Vesta</a> page.</p>",

                    template: '<div class="popover" role="tooltip" style="max-width: 900px;width:90%;max-height:80%;overflow:auto;"> <div class="arrow"></div> <h3 class="popover-title"></h3> ' +
                    '<div class="popover-content"></div> <div class="popover-navigation"> ' +
                    '<button class="btn btn-sm btn-info pull-right" style="margin: 0 0 10px 0;" data-role="next">Next <span class="fa fa-arrow-right"></span></button> ' +
                    '</div>'
                },
                {
                    title: "Map Viewer",
                    content: 'This is an interactive map viewer. You can left click and move your mouse to pan and zoom, and use the scroll wheel to zoom in and out. ' +
                    'Feature names on the map can be clicked to show additional information such as diameter and origin. <h6 class="try-header">Give It A Try</h6>Click your mouse and drag around the map. Use your mouse wheel to zoom in and out. Click on a feature to see more information.'
                },
                {
                    element: "#controlItemProjection",
                    title: "Map Selection Panel",
                    content: 'The map selection panel allows you to change between a standard global (equirectangular) view of the data, north pole view and south pole view.<h6 class="try-header">Give It A Try</h6>Click on the North Pole and South Pole links to the right to navigate to each map.',
                    placement: "left"
                },
                {
                    element: "#controlItemTools",
                    title: "Tools Panel",
                    content: 'The tools panel gives you access to analysis tools such as distance calculation, elevation profiling, 3D printing and sun angle calculation. Tools are currently only available in 2D map view.<h6 class="try-header">Give It A Try</h6>Click on a tool to add a line, box, etc. to the map. You can then click the added graphic (in yellow) to access the available analysis functions.',
                    placement: "left"
                }
            ];

            if(!this.detectedFeatures.mobileDevice) {
                steps.push(
                    {
                        element: "#stlPrintContainer",
                        title: "3D Printing Capability",
                        content: 'The analysis Box tool allows you to draw a box anywhere on the map, and instantly generate a file for a 3D printer. However, you may want to print a complete Vesta model. For that we have pre-generated the files in varying resolutions. Use this link to select and download the files for your 3D printer.',
                        placement: "left"
                    }
                )
            };

            steps.push(
                {
                    element: "#controlItemLayers",
                    title: "Layers Panel",
                    content: 'The layers panel gives you access to all data sets that are available on both the map and the globe. You can click the arrow to the left of each row to expand it to show additional buttons and a transparency slider. You can also click and drag layers to reorder them. ' +
                    '<ul style="list-style-type:none;padding-top:10px;font-size:1.1em;">' +
                    '<li style="padding: 3px;"><span class="fa fa-eye" style="font-size:1.5em;padding-right: 5px;min-width: 25px;"></span> Show/Hide Layer</li><li style="padding: 3px;"><span class="fa fa-info-circle" style="font-size:1.5em;padding-right: 5px;min-width: 25px;"></span> View Layer Metadata</li>' +                            '</ul>',
                    placement: "left"
                },
                {
                    element: "#controlItemHelp",
                    title: "Help Panel",
                    content: "The help panel gives you access to tutorials and contact information. You can restart this tour anytime by clicking on Interactive Tour.",
                    placement: "left"
                },
                {
                    element: "#controlItemSearch",
                    title: "Search Panel",
                    content: 'The search panel allows you to find features by name, and fly to a selected feature. <h6 class="try-header">Give It A Try</h6>Search for "Claudia", and click on the result in the search list. You will be taken to the crater!',
                    placement: "left"
                }
            );

            if(!this.detectedFeatures.mobileDevice) {
                steps.push(
                    {
                        element: "#mapDetailsContainer",
                        title: "Map Information",
                        content: "Map information such as map scale and latitude/longitude mouse coordinates are displayed in this area.",
                        placement: "top"
                    },
                    {
                        element: "#mapScalebarsContainer",
                        title: "Scale Bar Selection",
                        content: "You can click the scale bar to select different units of measurement. This allows you to measure in ways that may be more relatable to you (for example: This crater is the length of 22 Golden Gate Bridges). Currently the following units are available: <ul><li>Kilometers</li><li>Miles</li><li>Golden Gate Bridge</li><li>Soccer Field</li><li>School Bus</li></ul>",
                        placement: "top"
                    },
                    {
                        element: "#mapZoomInBtn",
                        title: "Zoom Controls",
                        content: "Controls for zooming in and out on the 2D map and 3D globe. Alternatively, you can use your mouse scroll wheel to zoom.",
                        placement: "top"
                    },
                    {
                        element: "#overviewBtn",
                        title: "Overview of Global Position",
                        content: "Shows an overview of your current position. If viewing the 2D map, it will show a 3D globe centered to where you are viewing. If viewing the 3D globe, it will show a 2D map with a highlighted area of your view. Clicking on the overview will switch your view.",
                        placement: "right"
                    },
                    {
                        element: "#fullscreenBtn",
                        title: "Fullscreen View",
                        content: "Shows the current view (either 2D or 3D) in fullscreen, while hiding all other elements of the page.",
                        placement: "top"
                    }
                );
            };

            if(!this.detectedFeatures.mobileDevice && this.detectedFeatures.webGL) {
                steps.push(
                    {
                        element: "#view2DContainer",
                        title: "2D/3D Selection",
                        content: "Allows you to quickly toggle between 2D and 3D view.",
                        placement: "top"
                    },
                    {
                        element: "#gameControlsContainer",
                        title: "3D Game Controls",
                        content: "Toggle game controls by clicking the controller icon below. When the controller icon is green, game controls are enabled." +
                        "<ul>" +
                        "<li><strong>W or Up Arrow:</strong> Move Forward</li>" +
                        "<li><strong>A or Left Arrow:</strong> Move Left</li>" +
                        "<li><strong>S or Right Arrow:</strong> Move Right</li>" +
                        "<li><strong>D or Down Arrow:</strong> Move Backward</li>" +
                        "<li><strong>Mouse Left Click + Drag:</strong> Left click and drag to look</li>" +
                        "<li><strong>Ctrl + Mouse Left Click + Drag:</strong> Rotate camera" +
                        "</ul>",
                        placement: "top"
                    }
                );
            };

            //final step for all
            steps.push(
                {
                    title: "Tour Complete",
                    backdrop: true,
                    content: "Now that you have an idea of the tools and features available in Vesta Trek, it's time to start exploring! You can always take this tour again from the Help section if you need to review.",
                    template: "<div class='popover tour' style='max-width:400px;text-align:center;'><div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content' style='text-align:left;'></div> <div class='popover-navigation'>" +
                    "<button class='btn btn-success' data-role='end' style='float:none;'>Explore Vesta!</button></div>" +
                    "</div></div>"
                }
            );

            return steps;
        },

        showMainContent: function() {
            domStyle.set("helpSpinner", "transform", "translateX(100%)");
            domStyle.set("helpSpinner", "-webkit-transform", "translateX(100%)");
        },

        showHelpContent: function(evt) {
            var selected = evt.target.id;

            domClass.add(this.aboutHelpContainer, "hidden");
            domClass.add(this.aboutContactContainer, "hidden");
            domClass.add(this.aboutFAQContainer, "hidden");
            domClass.add(this.aboutCreditsContainer, "hidden");


            if(selected === "aboutBtn") {
                domClass.remove(this.aboutHelpContainer, "hidden");
            } else if(selected === "contactBtn") {
                domClass.remove(this.aboutContactContainer, "hidden");
            } else if(selected === "faqBtn") {
                domClass.remove(this.aboutFAQContainer, "hidden");
            } else if(selected === "creditsBtn") {
                domClass.remove(this.aboutCreditsContainer, "hidden");
            }

            domStyle.set("helpSpinner", "transform", "translateX(0%)");
            domStyle.set("helpSpinner", "-webkit-transform", "translateX(0%)");
        },

        displaySidebar: function(currentStep, show) {
            var selectedOption = "";

            switch(currentStep) {
                case 3:
                    selectedOption = "Projection"
                    break;
                case 4:
                    selectedOption = "Tools";
                    break;
                case 5:
                    selectedOption = "Tools";
                    break;
                case 6:
                    selectedOption = "Layers";
                    break;
                case 7:
                    selectedOption = "Help";
                    break;
                case 8:
                    selectedOption = "Search";
                    break;
                case 14:
                    topic.publish(MapEvent.prototype.VIEW_3D);
                    break;
                case 16:
                    topic.publish(MapEvent.prototype.VIEW_2D);
                default:
                    selectedOption = "";
                    break;
            }

            if(selectedOption !== "") {
                topic.publish(NavigationEvent.prototype.OPEN_SIDEBAR, {selectedOption: selectedOption, resize: false});
            } else {
                topic.publish(NavigationEvent.prototype.CLOSE_SIDEBAR, {resize: false});
            }
        },

        startTour: function() {
            var that = this;
            var tour = new Tour({
                name: "demo-tour",
                backdrop: false,
                storage: false,
                autoscroll: false,
                delay: 400,
                keyboard: false,
                orphan: true,
                onStart: function(tour) {
                    //make sure the sidebar is closed
                    topic.publish(NavigationEvent.prototype.CLOSE_SIDEBAR, {resize: false});
                },
                onNext: function(tour) {
                    that.displaySidebar(tour.getCurrentStep()+1, true);
                },

                onPrev: function(tour) {
                    that.displaySidebar(tour.getCurrentStep()-1, true);
                },
                onShown: function() {
                    domClass.remove(dom.byId(this.id), "fade");
                },
                onHide: function() {
                    if(dom.byId(this.id))
                        domClass.add(dom.byId(this.id), "fade");
                },
                steps: that.getSteps()
            });

            tour.init(true);
            tour.start();
        }

    });
});