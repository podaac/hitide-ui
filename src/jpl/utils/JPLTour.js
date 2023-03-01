define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "bootstrap-tour/Tour",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/query",
    "dijit/registry",
    "jpl/events/NavigationEvent",
    "jpl/events/GranuleSelectionEvent"
], function(declare, lang, topic, Tour, dom, domAttr, domStyle, domClass, query, registry, NavigationEvent, GranuleSelectionEvent) {
    return declare(null, {

        constructor: function() {},
        startup: function() {},
        getAddedDatasets: function() {
            return registry.byId("Search").content.addedDatasets;
        },
        start: function() {
            var _context = this;
            this._eventListener;
            var tour = new Tour({
                name: "demo-tour",
                backdrop: false,
                storage: false,
                autoscroll: false,
                delay: 400,
                keyboard: false,
                orphan: true,
                template: function(i, step) {
                    return "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><button class='fa fa-close' data-role='end' style='position:absolute;top:7px;right:5px;font-size:1.2em;color:#ffffff;background:none;border:none;'></button><div class='popover-content'></div><nav class='popover-navigation' style='text-align:center'>" +
                        "<button class='btn btn-sm btn-info' style='float:left' data-role='prev'><span class='fa fa-arrow-left' style='margin-right: 3px'></span>Prev</button><span class='popover-progress'>(" +
                        (i + 1) + "/" + _context.getSteps().length + ")</span><button class='btn btn-sm btn-info' style='float:right' data-role='next'>Next<span class='fa fa-arrow-right' style='margin-left: 3px'></span></button></nav></div>";
                },
                onStart: function(tour) {
                    // Start tour on Search
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                },
                onNext: function(tour) {
                    // _context.displaySidebar(tour.getCurrentStep() + 1, true);
                },

                onPrev: function(tour) {
                    // _context.displaySidebar(tour.getCurrentStep() - 1, true);
                },
                onShown: function() {
                    domClass.remove(dom.byId(this.id), "fade");
                },
                onHide: function() {
                    if (dom.byId(this.id))
                        domClass.add(dom.byId(this.id), "fade");
                },
                onEnd: function(tour) {
                    if (_context._eventListener) {
                        _context._eventListener.remove();
                    }
                },
                steps: _context.getSteps()
            });

            tour.init(true);
            tour.start();
        },
        getSteps: function() {
            var _context = this;
            var steps = [{
                title: "<h1>Welcome</h1>",
                backdrop: true,
                content: 'HiTIDE, the High-level Tool for Interactive Data Extraction, allows users to subset and download popular PO.DAAC level 2 (swath) datasets. Users can search across a wide variety of parameters, such as variables, sensors and platforms, and filter the resulting data based on spatial and temporal boundaries of interest to the user. HiTIDE goes even further, offering instant previews of variable imagery, allowing users to rapidly find data of interest for download and further, rigorous scientific analysis. This tutorial will walk you through an entire subsetting workflow and takes approximately 5 minutes to complete.',
                template: "<div class='popover tour'><div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'>" +
                    "<button class='btn btn-alt button-grey' data-role='end'>Skip Tour</button> <button class='btn btn-alt popover-start' data-role='next'>Start Tour</button></div>" +
                    "</div></div>",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Search for Datasets",
                element: "#tab-item-search",
                content: 'There are three main sections of this workflow.<br><br><ol><li><div class="tabSwitchLinkStyle">SEARCH DATASETS</div></li><li><div class="tabSwitchLinkStyle">GRANULE SELECTION</div></li><li><div class="tabSwitchLinkStyle">DOWNLOADS</div></li></ol>' +
                    '<br>The first section begins in the <span class="tabSwitchLinkStyle">SEARCH DATASETS</span> tab. Use this tab to search for datasets and set the region and initial date range for subsetting granules.',
                placement: "left",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Select Date Range",
                element: "#dateRangeSelectorBtn",
                content: 'Select a date range using this button. Setting this date range will narrow down the datasets in the results below as well as specify the date range in which to search for granules.<br><br><i>Note: Date range defaults to 1/1/2000 – Today.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Select Region",
                element: "#regionSelectorBtn",
                content: 'Select a region using this button. Setting this region will narrow down the datasets in the results below as well as specify the region in which to search for granules.<br><br><i>Note: Region defaults to global.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Using Faceted Dataset Search",
                element: "#facetSelectorNode",
                content: 'Search for datasets using the provided facets. Hover over a facet to view its available values.<br><br>Note: the facet search is <b>OR</b> within a single facet<br><br><i>For Example: Under "Variable",' +
                    ' enabling "Surface Winds" and "Sea Surface Temperature" translates to "Find datasets that have either Surface Winds <b>OR</b> Sea Surface Temperature"</i><br><br> and <b>AND</b> among different facets<br><br>' +
                    '<i>For Example: Under "Variable", enabling "Surface Winds" and "Sea Surface Temperature" and under "Sensor" enabling "Advanced Scatterometer" translates to "Find datasets where (Variable = Surface Winds <b>OR</b> Sea Surface Temperature' +
                    ') <b>AND</b> where (Sensor = Advanced Scatterometer).</i>',
                placement: "left",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Select Datasets",
                element: "#datasetGrid",
                content: 'Select datasets of interest in the results table by clicking on the checkboxes in the first column. More information about each dataset can be accessed by clicking on the <span class="fa fa-info-circle" style="color:rgb(111, 169, 255)"></span> information icons.<br><br><b>Go ahead and select one or more datasets before moving to the next step.</b>',
                placement: "left",
                onShow: function(tour) {
                    // Make sure we have a dataset 
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                }
            }, {
                title: "Select and Preview Granules",
                element: "#selectAndPreviewButton",
                content: 'After selecting datasets and optionally choosing a date range and region, proceed to the <span class="tabSwitchLinkStyle">GRANULE SELECTION</span> tab by clicking on this button or by clicking on the <span class="tabSwitchLinkStyle">GRANULE SELECTION</span> tab at the top of the page.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Search"
                    });
                },
                onShown: function(tour) {
                    if (_context._eventListener) {
                        _context._eventListener.remove()
                    }
                    // Listen to switch tab events
                    var handler = topic.subscribe(NavigationEvent.prototype.SWITCH_TAB, function(message) {
                        if (message.tabID && message.tabID === "GranuleSelection") {
                            // Go to next step
                            tour.next();
                        }
                    })
                    _context._eventListener = handler;
                },
                onNext: function() {
                    if (_context._eventListener) {
                        _context._eventListener.remove()
                    }
                },
                onPrev: function() {
                    if (_context._eventListener) {
                        _context._eventListener.remove()
                    }
                }
            }, {
                title: "Granule Selection",
                element: "#tab-item-granuleSelection",
                content: 'Use <span class="tabSwitchLinkStyle">GRANULE SELECTION</span> to preview granule variables and footprints on the map and select granules for download.',
                placement: "left",
                onShown: function(tour) {
                    // If no datasets, tell user to go back and disable next
                    if (Object.keys(_context.getAddedDatasets()).length < 1) {
                        var stepContent = query(".popover-content")[0];
                        console.log(stepContent, "sc")
                        var next = query(".btn.btn-sm.btn-info")[1];
                        domStyle.set(next, "display", "none");
                        domAttr.set(stepContent, "innerHTML", "Oops, no datasets are selected. To continue, go back to <span class='tabSwitchLinkStyle'>SEARCH DATASETS</span> and select at least one dataset.")
                    }
                },
                onShow: function(tour) {
                    // Go back to search
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Manage Selected Datasets",
                element: "#datasetControllerGrid",
                content: 'This table displays all selected datasets and the number of granules matching the original date range and region. Click on the <span class="icon-in"></span> button in a dataset row to add all matching granules for that dataset to <span class="tabSwitchLinkStyle">DOWNLOADS</span>.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Browse Granules",
                element: "#datasetControllerGrid",
                content: 'Once a dataset\'s granule search has completed, click on that dataset\'s row to further filter, select, and preview granules.',
                placement: "left",
                onShown: function(tour) {
                    if (_context._eventListener) {
                        _context._eventListener.remove()
                    }
                    // Listen to granulesController activations
                    var handler = topic.subscribe(GranuleSelectionEvent.prototype.SWITCH_ACTIVE_GRANULES_CONTROLLER, function(message) {
                        if (message.datasetId) {
                            // We're good to go
                            domStyle.set(query(".btn.btn-sm.btn-info")[1], "display", "block");
                        } else {
                            // Re-hide
                            domStyle.set(query(".btn.btn-sm.btn-info")[1], "display", "none");
                        }
                    })
                    _context._eventListener = handler;
                    // If no active granulesController
                    if (!registry.byId("GranuleSelection").content.activeDataset) {
                        domStyle.set(query(".btn.btn-sm.btn-info")[1], "display", "none");
                    }
                },
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                },
                onNext: function() {
                    if (_context._eventListener) {
                        _context._eventListener.remove()
                    }
                }
            }, {
                title: "Filter Granules",
                element: "#granulesControllerFilterContainer",
                content: 'In this dataset granules browser are two additional methods for narrowing down and navigating granules.<br><br><b>1.</b> Use wildcard search on granule name.<br><b>2.</b> Use date filters to quickly narrow down and navigate the granule results within the original date range without going back to search and resetting results.<br><br>These methods can be useful for quickly previewing and downloading granules within several different windows within a large date range.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Granules Matching Filters",
                element: "#granulesControllerStatusContainer",
                content: 'Changing the filters above will modify the number of <span style="color: rgb(126, 145, 255);font-weight: 400;">granules matching filter</span>. Note that the number of <span style="color: #8F8F8F;font-weight: 400;">granules matching search</span> will remain unchanged and that it is still possible to download all granules matching the original search using the <span class="icon-in"></span> buttons in the table above.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Download Filtered Granules",
                element: "#addMatchingBtn",
                content: 'To add all <span style="color: rgb(126, 145, 255);font-weight: 400;">granules matching filter</span> to downloads, click the <span style="color: #8BC34A;font-weight: 400;">Add Matching # Granules to Downloads <span class="icon-in"></span></span> button.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Preview Granules",
                element: "#granulesControllerGrid",
                content: 'This table lists all granules matching the original search region and date range defined in <span class="tabSwitchLinkStyle">SEARCH DATASETS</span> as well as the wildcard and date filters defined above. Use the <span class="ms ms-stroke" style="position:relative;top:1px;"></span> icon to toggle the granule\'s swath and use the <span class="fa fa-image"></span> icon to preview the granule\'s variables on the map.<br><br>Select, deselect, and download multiple granules in the table using cmd/ctrl-click and shift-click and the right clicking on the selection.<br><br><b>Go ahead and toggle several footprints and variable previews.</b>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Legends, Opacity, and Variable Controls",
                element: "#legendsAndOpacityContainer",
                content: 'Use this widget to control visibility and opacity for variables within each active dataset and view colorbars for each variable. By default, the first variable in the list for each dataset will be active.<br><br><i>Note: Not all dataset variables are available for preview.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Download Some Granules",
                element: "#GranuleSelection",
                content: '<b>Go ahead and add a few granules to <span class="tabSwitchLinkStyle">DOWNLOADS</span> using any of the methods discussed previously. For demonstration purposes, try only adding a small number of granules in order to more quickly see the entire download process through completion.</b>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "GranuleSelection"
                    });
                }
            }, {
                title: "Downloads",
                element: "#tab-item-downloads",
                content: 'Use the <span class="tabSwitchLinkStyle">DOWNLOADS</span> tab to review all of download selections, initiate downloads, and view the status of current and past downloads.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Review Download Selections",
                element: "#downloadsListingContainer",
                content: 'Review all download selections here. Click on a download to view selected region, date range, and wildcard filter. Expand <b>Select Extraction Variables</b> to exclude certain variables in that particular download.<br><br><i>Note: By default, all variables will be included.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Login",
                element: "#login-dropdown",
                content: 'To enable submitting a subset job, be sure to log in. By clicking on <b>Login</b> button you will be redirected to the Earthdata Login page. If you do not have an account, you will be directed to make one. The EOSDIS Earthdata Login account is usable on EOSDIS websites, PODAAC websites, and the websites of other DAACs.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Submit Download Job",
                element: "#downloadsSubmissionButton",
                content: 'Once you are logged in, downloads will be enabled. HiTIDE will fill in an email address for you to receive notifications of job completion. You can also enter an alternate email address. Then click <b>Download Selected Granules</b> to start the download.<br><br><i>Note: to learn more about the "cut scanline" and "merge granules" options, visit the FAQs in the Help section.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Your Downloads",
                element: "#jobsGridElContainer",
                content: 'Once you have initiated the download, PO.DAAC will subset and package the submission. Once the submission has finished processing, download links will appear in this tab and will be sent to the email address provided. <br><br><i>Note: Once complete, the subsetted files will only be available for <b>48 hours</b>. Also note that closing the HiTIDE interface will not stop any download submissions.</i>',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Save",
                element: "#utilityFunction-save",
                content: 'Click the save <span class="fa fa-floppy-o"></span> icon to name and save the current configuration. You may store as many configurations as you would like. <br><br><i>Note: This configuration will <b>only</b> store selected datasets, date range and region specified in <span class="tabSwitchLinkStyle">SEARCH DATASETS</span>. It will <b>not</b> store active variable previews and footprints, wildcard and further date filters, and download submissions (these submissions are stored automatically in the browser but are not part of the configuration).</i>',
                placement: "bottom",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Load",
                element: "#utilityFunction-load",
                content: 'Click the load <span class="fa fa-folder-open-o"></span> icon to load configurations you have previously saved.',
                placement: "bottom",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Share",
                element: "#utilityFunction-share",
                content: 'Click the share <span class="fa fa-share-alt"></span> icon to share your current configuration via url.<br><br><i>Note: You can also copy this url from your browser\'s search bar. If you refresh this page, your current configuration will be automatically loaded from this url. Additionally, <b>only</b> selected datasets, date range and region will be shared.</i>',
                placement: "bottom",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }, {
                title: "Help",
                element: "#utilityFunction-help",
                content: 'Click the help <span class="fa fa-question-circle"></span> icon for more in-depth help, FAQ, or to replay this tutorial.',
                placement: "left",
                onShow: function(tour) {
                    // Go to Granule Selection
                    topic.publish(NavigationEvent.prototype.SWITCH_TAB, {
                        tabID: "Downloads"
                    });
                }
            }];


            //final step for all
            steps.push({
                title: "Tour Complete",
                backdrop: true,
                content: "Now that you have an idea of the tools and features available in HiTIDE, it's time to start subsetting! You can always take this tour again from the Help section.",
                template: "<div class='popover tour'><div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'>" +
                    "<button class='btn btn-sm btn-info' data-role='prev'><span class='fa fa-arrow-left' style='margin-right: 3px'></span>Prev</button>" +
                    "<button class='btn btn-sm btn-info' data-role='end' style='float:right'>End Tutorial</button></div></div></div>"
            });

            var stepsCount = steps.length;

            return steps;
        }
    })
});
