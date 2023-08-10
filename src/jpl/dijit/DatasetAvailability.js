define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/query",
    "dojo/mouse",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/request/xhr",
    "dojo/fx",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/DateTextBox",
    'dojo/text!./templates/DatasetAvailability.html',
    "xstyle/css!./css/DatasetAvailability.css",
    "use!highcharts",
    "jpl/config/Config",
    "jpl/utils/DOMUtil",
    "jpl/dijit/ui/AlertDialog",
    "jpl/utils/GranuleAvailability/L2ssAvailabilityApi",
    "jpl/utils/GranuleAvailability/CmrAvailabilityApi",
    "jpl/utils/GranuleAvailability/CombinedAvailabilityApi"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, Deferred, all, xhr, coreFx, registry,
    _WidgetBase, _TemplatedMixin, DateTextBox, template, css, highcharts, Config, DOMUtil, AlertDialog, 
    L2ssAvailabilityApi, CmrAvailabilityApi, CombinedAvailabilityApi) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        datasets: null,
        primaryDataset: null,
        chart: null,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.config = Config.getInstance();
            this.initializeAvailabilityApi();

            this.seriesOptions = [];

            // Determine start and end date based off min/maxes of datasets
            var startTime = new Date(); // want this to be max date
            var endTime = new Date(1000, ""); // want this to be min date
            var datasetKeys = this.moveArrayItemToFront(Object.keys(this.datasets), this.primaryDataset);
            var _context = this;
            datasetKeys.forEach(function(key, i) {
                var d = _context.datasets[key];
                var newStart = new Date(d["DatasetCoverage-StartTimeLong"]);
                var newEnd = new Date(d["DatasetCoverage-StopTimeLong"]);
                if (newStart < startTime) {
                    startTime = newStart;
                }
                if (newEnd > endTime) {
                    endTime = newEnd;
                }
            });

            this.availability.fetchAvailability(startTime, endTime, "MONTH", this.datasets)
            .then(function(results) {
                results.forEach(function(response, i) {
                    _context.seriesOptions[i] = {
                        name: datasetKeys[i], // we're supposedly guaranteed same return order as input order here...
                        data: response
                    };
                });
                _context.createChart();
            }, function(error) {
                console.error("There was an error while fetching granule availability", error);
            });
        },

        initializeAvailabilityApi: function() {
            var cmrAvailabilityApi = new CmrAvailabilityApi(this.config.hitide.externalConfigurables.cmrGranuleAvailabilityService);
            this.availability = new CombinedAvailabilityApi({
                cmrAvailabilityApi: cmrAvailabilityApi
            });
        },

        moveArrayItemToFront: function(arr, item) {
            if (!item) {
                return arr;
            }
            var idx = arr.indexOf(item);
            if (idx === -1) {
                return arr;
            }
            if (idx === 0) {
                return arr;
            }
            // remove item from arr
            arr.splice(idx, 1);
            arr.unshift(item);
            return arr
        },

        determineGap: function(start, end) {
            var DAY_LIMIT = 62 // roughly 2 months
            if (end < start) {
                end.setDate(end.getDate() + 1);
            }
            var diff = end - start; // milliseconds
            var days = Math.floor(diff / 1000 / 60 / 60 / 24);
            return (days <= DAY_LIMIT ? "DAY" : "MONTH");
        },

        afterSetExtremes: function(e, chart, firstTime) {
            // Set loading
            chart.showLoading("Loading data from server...");

            // Determine which gap to use, day or month
            var start = new Date(e.min);
            var end = new Date(e.max);
            // the following is to handle cases where the times are on the opposite side of
            // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM
            var gap = this.determineGap(start, end);
            var _context = this;
            if (gap === "DAY") {
                // Configure  plot according to gap
                chart.tooltip.options.formatter = function() {
                    var s = '<b>' + Highcharts.dateFormat('%b %e %Y', this.x, true) + '</b>';
                    $.each(this.points, function(i, point) {
                        s += '<br/>' + "<span style='color:" + point.series.color + "'>" + _context.datasets[point.series.name]["Dataset-ShortName"] + "</span>" + ': ' + point.y;

                    });
                    return s;
                }
            } else {
                // Configure  plot according to gap
                chart.tooltip.options.formatter = function() {
                    var s = '<b>' + Highcharts.dateFormat('%b %Y', this.x, true) + '</b>';
                    $.each(this.points, function(i, point) {
                        s += '<br/>' + "<span style='color:" + point.series.color + "'>" + _context.datasets[point.series.name]["Dataset-ShortName"] + "</span>" + ': ' + point.y;
                    });
                    return s;
                }
            }

            // Send request
            var activeChartDatasets = chart.series.filter(function(x) {
                return x.visible && x.name !== "Navigator";
            })

            var activeDatasets = {};
            activeChartDatasets.forEach(function(z) {
                var dataset = _context.datasets[z.name];
                var datasetId = dataset['Dataset-PersistentId'];
                activeDatasets[datasetId] = dataset;
                
            });

            this.availability.fetchAvailability(start, end, gap, activeDatasets)
            .then(function(results) {
                results.forEach(function(response, i) {
                    activeChartDatasets[i].setData(response);
                });
                if (firstTime) {
                    chart.get("highcharts-navigator-series").setData(chart.series[0].options.data)
                }
                _context.chart.hideLoading();
            })

        },

        createChart: function() {
            var _context = this;
            var options = {
                exporting: {
                    enabled: false
                },
                chart: {
                    renderTo: this.datasetAvailabilityContainer,
                    width: 680,
                    height: 400,
                    zoomType: "x",
                    events: {
                        load: lang.hitch(this, function(event) {
                            this.afterSetExtremes(event.target.xAxis[0].getExtremes(), event.target, true);
                        })
                    }
                },
                colors: (function() {
                    var newColors = Highcharts.getOptions().colors.map(function(x) {
                        return new Highcharts.Color(x).setOpacity(0.5).get();
                    });
                    newColors.unshift("#E91E63");
                    return newColors;
                })(),
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                navigator: {
                    adaptToUpdatedData: false
                },
                scrollbar: {
                    liveRedraw: false
                },
                rangeSelector: {
                    inputEnabled: false,
                    buttons: [{
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 4
                },


                xAxis: {
                    type: "datetime",
                    events: {
                        afterSetExtremes: lang.hitch(this, function(e) { this.afterSetExtremes(e, this.chart) })
                    },
                    minRange: 86400000 * 7 // one week
                },

                yAxis: {
                    floor: 0,
                    labels: {
                        style: {
                            fontWeight: "bold"
                        }
                    },
                    title: {
                        // text: '% Expected Granules'
                        text: 'Granules'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: 'silver'
                    }]
                },
                plotOptions: {
                    series: {
                        events: {
                            showCheckbox: true,
                            show: lang.hitch(this, function(event) {
                                this.afterSetExtremes(this.chart.xAxis[0].getExtremes(), this.chart);
                            })
                        }
                    },
                    line: {
                        marker: {
                            // enabled: true
                        }
                    },
                    dataGrouping: {
                        enabled: false
                    }
                },
                legend: {
                    enabled: true,
                    labelFormatter: function() {
                        return _context.datasets[this.name]["Dataset-ShortName"];
                    }
                },
                tooltip: {
                    useHTML: true,
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                    valueDecimals: 0
                },
                series: this.seriesOptions
            };
            this.chart = new highcharts.StockChart(options);
        }
    });
});
