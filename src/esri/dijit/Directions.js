//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Color", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/keys", "dojo/has", "dojo/on", "dojo/mouse", "dojo/dom", "dojo/dom-geometry", "dojo/dom-style", "dojo/dom-class", "dojo/dom-attr", "dojo/query", "dojo/number", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/Directions.html", "./Geocoder", "dojo/dom-construct", "dojo/promise/all", "dojo/Deferred", "dojo/dnd/Source", "../kernel", "../graphic", "../units", "../InfoTemplate", "../SpatialReference", "../layers/ArcGISDynamicMapServiceLayer", "../geometry/Point", "../geometry/Extent", "../geometry/Polyline", "../geometry/mathUtils", "../symbols/PictureMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/TextSymbol", "../symbols/Font", "./_EventedWidget", "../tasks/FeatureSet", "../tasks/RouteTask", "../tasks/RouteParameters", "../toolbars/edit", "../request", "dojo/uacss"],
    function(C, L, d, q, A, p, M, y, aa, g, D, E, N, m, k, s, v, B, h, O, F, r, G, l, P, ba, w, n, H, Q, R, S, T, I, U, x, J, V, z, W, X, Y, Z, K, $) {
        return L("esri.dijit.Directions", [W, M], {
            templateString: O,
            basePath: C.toUrl("."),
            _eventMap: {
                load: !0,
                "directions-start": !0,
                "directions-finish": ["result"],
                "directions-clear": !0,
                "segment-select": ["graphic"],
                "segment-highlight": ["graphic"],
                error: ["error"],
                "stops-update": ["stops"]
            },
            _tmDrivingTime: "Driving Time",
            _tmTruckingTime: "Trucking Time",
            _tmWalkingTime: "Walking Time",
            _tmDrivingDistance: "Driving Distance",
            _tmTruckingDistance: "Trucking Distance",
            _tmWalkingDistance: "Walking Distance",
            _agolRouteUrlSuffix: ".arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
            constructor: function(a, b) {
                this._css = {
                    widgetContainerClass: "esriDirectionsContainer",
                    stopsContainerClass: "esriStopsContainer",
                    reverseStopsClass: "esriStopsReverse",
                    addStopsClass: "esriStopsAdd",
                    stopsClass: "esriStops",
                    stopsRemovableClass: "esriStopsRemovable",
                    stopsButtonContainerClass: "esriStopsButtons",
                    stopsOptionsButtonClass: "esriStopsOptionsButton",
                    stopsAddDestinationClass: "esriStopsAddDestination",
                    stopsGetDirectionsContainerClass: "esriStopsGetDirectionsContainer",
                    stopsGetDirectionsClass: "esriStopsGetDirections",
                    stopsClearDirectionsClass: "esriStopsClearDirections",
                    stopsOptionsOptionsEnabledClass: "esriStopsOptionsEnabled",
                    stopsOptionsMenuClass: "esriStopsOptionsMenu",
                    stopsFindOptimalOrderClass: "esriFindOptimalOrderOption",
                    stopsUseTrafficClass: "esriUseTrafficOption",
                    stopsReturnToStartClass: "esriReturnToStartOption",
                    stopsOptionsCheckboxesClass: "esriOptionsCheckboxes",
                    stopsOptionsToggleContainerClass: "esriOptionsToggleContainer",
                    stopsOptionsUnitsContainerClass: "esriOptionsUnitsContainer",
                    stopsOptionsUnitsMiClass: "esriOptionsUnitsMi",
                    stopsOptionsUnitsKmClass: "esriOptionsUnitsKm",
                    stopsOptionsImpedanceContainerClass: "esriOptionsImpedanceContainer",
                    stopsOptionsImpedanceTimeClass: "esriOptionsImpedanceTime",
                    stopsOptionsImpedanceDistanceClass: "esriOptionsImpedanceDistance",
                    travelModesContainerClass: "esriTravelModesContainer",
                    stopsTravelModeCarClass: "esriTravelModeCar",
                    stopsTravelModeTruckClass: "esriTravelModeTruck",
                    stopsTravelModeWalkingClass: "esriTravelModeWalking",
                    stopClass: "esriStop",
                    stopOriginClass: "esriStopOrigin",
                    stopDestinationClass: "esriStopDestination",
                    esriStopGeocoderColumnClass: "esriStopGeocoderColumn",
                    esriStopReverseColumnClass: "esriStopReverseColumn",
                    stopIconColumnClass: "esriStopIconColumn",
                    stopIconClass: "esriStopIcon",
                    stopIconRemoveColumnClass: "esriStopIconRemoveColumn",
                    stopIconRemoveClass: "esriStopIconRemove",
                    resultsContainerClass: "esriResultsContainer",
                    resultsLoadingClass: "esriResultsLoading",
                    resultsPrintClass: "esriResultsPrint",
                    resultsSummaryClass: "esriResultsSummary",
                    resultsViewFullRouteClass: "esriResultsViewFullRoute",
                    resultsRouteNameClass: "esriResultsRouteName",
                    resultsRouteButtonContainerClass: "esriResultsButtonsContainer",
                    routesContainerClass: "esriRoutesContainer",
                    routesClass: "esriRoutes",
                    routesErrorClass: "esriRoutesError",
                    routeClass: "esriRoute",
                    routeTextColumnClass: "esriRouteTextColumn",
                    routeTextClass: "esriRouteText",
                    routeLengthClass: "esriRouteLength",
                    routeOriginClass: "esriDMTStopOrigin",
                    routeDestinationClass: "esriDMTStopDestination",
                    routeLastClass: "esriDMTStopLast",
                    routeInfoClass: "esriRouteInfo",
                    routeIconColumnClass: "esriRouteIconColumn",
                    routeIconClass: "esriRouteIcon",
                    infoWindowRouteClass: "esriInfoWindowRoute",
                    routeZoomClass: "esriRouteZoom",
                    esriPrintPageClass: "esriPrintPage",
                    esriPrintBarClass: "esriPrintBar",
                    esriPrintButtonClass: "esriPrintButton",
                    esriCloseButtonClass: "esriCloseButton",
                    esriPrintMainClass: "esriPrintMain",
                    esriPrintHeaderClass: "esriPrintHeader",
                    esriPrintLogoClass: "esriPrintLogo",
                    esriPrintNameClass: "esriPrintName",
                    esriPrintNotesClass: "esriPrintNotes",
                    esriPrintLengthClass: "esriPrintLength",
                    esriPrintDirectionsClass: "esriPrintDirections",
                    esriPrintFooterClass: "esriPrintFooter",
                    esriPrintStopLabelClass: "esriPrintStopLabel",
                    clearClass: "esriClear",
                    dndDragBodyClass: "esriDndDragDirection",
                    stopsButtonClass: "esriDirectionsButton",
                    stopsButtonTabClass: "esriDirectionsTabButton",
                    stopsButtonTabLastClass: "esriDirectionsTabLastButton",
                    stopsPressedButtonClass: "esriDirectionsPressedButton",
                    linkButtonClass: "esriLinkButton"
                };
                this.options = {
                    map: null,
                    autoSolve: !0,
                    minStops: 2,
                    maxStops: 20,
                    theme: "simpleDirections",
                    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    directions: null,
                    returnToStart: !1,
                    optimalRoute: !1,
                    routeTaskUrl: location.protocol + "//route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
                    routeParams: {},
                    stops: ["", ""],
                    geocoderOptions: {
                        autoComplete: !1,
                        autoNavigate: !1
                    },
                    stopsInfoTemplate: new H("Location", "${address}${error}"),
                    segmentInfoTemplate: new H("Route", '\x3cdiv class\x3d"${maneuverType}"\x3e\x3cdiv class\x3d"' +
                        this._css.routeIconClass + " " + this._css.infoWindowRouteClass + '"\x3e\x3cstrong\x3e${step}.\x3c/strong\x3e ${formattedText}\x3c/div\x3e\x3c/div\x3e'),
                    textSymbolFont: new z("11px", z.STYLE_NORMAL, z.VARIANT_NORMAL, z.WEIGHT_NORMAL, "Arial, Helvetica, sans-serif"),
                    textSymbolColor: new A([255, 255, 255]),
                    textSymbolOffset: {
                        x: 0,
                        y: 10.875
                    },
                    fromSymbol: (new x({
                        url: this.basePath + "/images/Directions/greenPoint.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4OTI1MkU2ODE0QzUxMUUyQURFMUNDNThGMTA3MjkzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4OTI1MkU2OTE0QzUxMUUyQURFMUNDNThGMTA3MjkzMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MjUyRTY2MTRDNTExRTJBREUxQ0M1OEYxMDcyOTMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5MjUyRTY3MTRDNTExRTJBREUxQ0M1OEYxMDcyOTMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iVNkdQAABJlJREFUeNp0VltvG0UUnpkdr72261CnCQWEIA9FqOKlqooARUKCtAUhoA+VoBVRhfgFXKSKJ97goRL8ARCIclGgL0VUkBBAoBaVoggEQQVSAhFS06SJje3Y3t25cc7srL3YjddHs3N85pvvfOfMyJRs83n8o+P7POI9yQibooTeBa68ISbSRv+hifpCGHX2s6dnfrrRWjroOPzB0T0+zZ0q8uDRSrniF/MB8X2fADhR8IRRRDphh7Q6rbgtOucU0Sdnj59Z2hb00PtHD+Zp/p2x6uitO4o7iLYP8DMafjVE2wXUboALm50W2ahtXO3q8MTX02fnh0Affu/IkSAXnL55dLzMPU6kURZMIZQhFtRk2VBKcpQTIQVZ21hrdUX4zDcnPv2kBzr59mP3BLnChfGx8YrHPKIAELSzMPhQk+ydzpOvIYwywjFeK7K+vt6IlZw8/+y5RZ4gm9eCUrGCmkUyBkCV0Sd5UlBtTLIhRWQE9ixwsVwe6dY3X4WwJ+j9bx7a7/v5i6O7qlxisFZJAvBF7Rjty56CWlmszilj6BNgXd+syTCO7uNK62nuezyUkWWASTPHDtOjbgOHkJTOsbXAyJhIC+rlODdROM211gcQKBJxoh+EKAs4AGqybHVfBvdICNIU/IDHYbcJiS6le4wwbW1B9UDXJcg9QBxtbglh1BlAJzjoUxIGQZFRwtAypgnjtH0spDG9MWVs34xrN5uBLnEoTKQUgDLgZ6hliLunBaIDhy4LYhyotptZlphGyLUhfyspxxj3AIpaVqikdgyzoGn7p0xNj71rNamweCscWC0qoQ8YRm3K2OgpeFoc+j9FSUYKB+4OgxIK4RcZUJ6RsUgqCrShxWzza9035aw/lzYGY5P4xFSMR5vMcFpm87opL4HjXsr76dLhC2xYhgx3I0BfoS7RCp+3K/e8vn+Ke2zWK+cYofQG9yMlw1eK1aAni9oSWil9eOmFhXkPnbXZ1eXqwVsirfQU9Vynm75lymLbxvpSP4yqI4iR5uWlFxdOI56Xbro5t3qhOrW7ZmL1EOFwp7k6pRXuWaZgBmuwJSIl1fNXXvrxjRTLy2ZTm1v9YeTBXedNbCYZZ1U4pdt+NGiomuKKEvKp5ZM/f5z9zctc1vju1b9cv5q/M/icBd4+KNztlnGWKfYjAMqm+K7zZ/PYP6d+X3TrafbmR8N71QcrOPMLd5RGdj838WFup393orNLWRki6vFv197661i40m6AKwYLneG79BzDPNhNYFWwnfguGyKgPl32bwseoTnKekVpS9n49vorWwv1JsSVwAJHCHcW2Agsk3rBBZXBihhcn11biTfDixpPik1bEZyj34EVXXzJrUccWwrbZo5+B6ztRpvO1kLjjO5qW3YccZ5JeTAecQxqqV0Q6hM5KVIrNL5a/77yQPUyLbK9qiMv49zFhW6MMnPE0dwxlQ48ckXDNHJOq0C2xByreHtxhPk1sK4DEI5dut7+QWCZCyj9MXKLWmD/gl1Xtfhd6F2CI86dv+XiIrdOpeeCDd0VyW7KGbLptn9p/mrgNsIxwzKN0QO3IvlPgAEA3AQhIZtaN54AAAAASUVORK5CYII\x3d",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    fromSymbolDrag: (new x({
                        url: this.basePath + "/images/Directions/greenPointMove.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzU5RTBFMjk2QzlCMTFFMkI3NTI4NEEyOTA0NjEyMEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzU5RTBFMkE2QzlCMTFFMkI3NTI4NEEyOTA0NjEyMEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NTlFMEUyNzZDOUIxMUUyQjc1Mjg0QTI5MDQ2MTIwRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NTlFMEUyODZDOUIxMUUyQjc1Mjg0QTI5MDQ2MTIwRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkWg288AAAVnSURBVHjadFVrbBVFFD4zO3fvo7e9baEBIUohQBQRRWwQhJDwLBIRE4yAEmPgh4l/NGrqP0wkIhJ8JYYYfCAqBuGHkBgoIK9QIzVEAiXYQoHGpi2l9NrXvbs7OzOe2Z29vRTYm9OZOXvmm+9858yWwH2e535ZN9MC63kKdDEBMhVdcQXKlUq2SBBHuRIHDq3Ze/5ee8lIx7I9q6fYJLYtxZLLy9JldiqeBNu2AcFB4M9xXcg5ORjIDXhDPPebAFlXv27/lfuCLv1p9ZI4ie+qqhw1rjRVCjL4KZjMJsAUVg0t/nW4wm8EB+iN/bkB6Ont6chL59UT6w8ci3CsaLLox1WrErH43jFVVaNisRg40gVPeDDZngBL0vMhw0phkv0Q9PBeaPc6wVMcbBaDRDJR6jj5F8avnHSp7deWZo1F9Z95362YTsH6PlNenkatYJDnIMfzkPMdeDazECzLKtiK8kXgcJTAywMKAD5KUl5ZUWoRa7fG0Xgs1EBtSZakyrRmru+BRODo2dH1AyRpAjaOWws7O/ZAXjjgYgaKKAClgBILGLUglU5n8tnbH+KWlWzO10tnUcuqZXGKzPKgpAilJhBo1+F2hjohy9b8dTwQe0Bh/aUM/Ao4cIlZ2BQYo8trdi6aRfHlemZbzPFRQ7QnMzPgi+mbwRc++NIHjiPHkTGGPhH4fDxYoH352BaoKX8CmbuBWTHGlFLrmZSyRlfY5R48M7oGNlSvCxjEUBmdJjGsNVN9EPJEthLiKIn2bax+GaRUcKbnLEiC3YJ4TCg5Ec8GIiTMr3o6CAy0fOrjOxuaEPh29mf3vCgLxsyBkzcbAp0RdCLSlSVcaVACJ7obYMaoaUHgpvNbC22sAd9//F30hQcprSuOH8ysC9Ynus4EEmFBdBYlDAvjCkyLUArHO05jNQHefPR1uJi9bG4HKRSqCX0aLgLVvk+adsDRjlNByaQunlQOQzluCN+voszC20Ogvv0kHG0/VWAYgQaF0mwKTBUsr18TzANAHKWPBVSyjSLhJsHDFtH9KaUIq4up6FGnFbfsgFXcihfeBfE413vCvejjQsM3kUc+n72MMnKYpe0CK0KG02548dBdhZm7r9YwBgiFCEd/gIMSqpaSND0mPdEovLD3tC5CDNvmxu13XFO9Lrw38YG5yJKLRo1n3TrYriqWPXADW+oVEqNEmVOjX3P2KnQOdUMmUQZfXdgFB1sPF96FVMPCiRyXKMNrzW80thY+fVO3z6ojMfKRlWRB+iOadHiuonSjNYDI46Xg6r2Wt89tvePTd/tIZ0Pl4rG9yhMLgRGmJVVmszJsolaKABW2jhjkrvDFW1ff+fvTu76n+uk90vlXZsHoM8pT8yijlYTCfR+pO6afXxXcf+la3YV9xe+sov8Aem5lf+/uiFcnD9OkNZMw8mDAuJip7kcE9Pv5H7nW/rX/bmtuMvtJ8b8TYr6rNlrCmJ2YUJIZu2Hiz7EK+2FiDWuKLQM86/3T9c31tU7bUB+6PDTHmJ77lmEYRytHq0Sr0HO/jyeJTa7Z45O1WEAaXU8x5Pt9p29tGjyX7ce4ErSkIaRP5miCFqWeMEFptJQOztbfbPNuO39KfVOCtAXotfYbsJSJLzH7NU5QCl1MYejn0IbMGKQzeK5vv8zLoOx61OuilEfGaxyltZQmSOvjGikiS/Qd7z5bNrfyMknRaSLnX9ZrE+eY0S1aaxzJDFPfgLumaFbw8Q+1SuKdPkLLrGl6xHUXWt4AcMMu2q9N0eF7UXjpmk0DaP+h3RK93m7sXdCjXhv/gIlzzT4R3YuR7a3MacKYZpMfuth/SeFHQ49FLKMYWXxr9fO/AAMAeko3KTmnLXwAAAAASUVORK5CYII\x3d",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    stopSymbol: (new x({
                        url: this.basePath + "/images/Directions/bluePoint.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRDNGRjhFQzNDMDcxMUUyQTlERUFFMkE4NTNDNjgwMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRDNGRjhFRDNDMDcxMUUyQTlERUFFMkE4NTNDNjgwMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBEM0ZGOEVBM0MwNzExRTJBOURFQUUyQTg1M0M2ODAyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBEM0ZGOEVCM0MwNzExRTJBOURFQUUyQTg1M0M2ODAyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+G7OGVQAABIpJREFUeNqEVE1oXUUUPvPz7vvPHy9FIi4KWiS6KSW4UHBToUXwb1ewCILLrhTEiLizi+JKd25iFaUiBYWCmGy6abUIukitVBGLkIZE4stLXt79mZnjOTNzk9vXFO/jvJk795xvvnO+MyPm37sO/CRSgRICQApoaFoQ8rgGfFFKOCnAHaOVOjrInBC3jRXLxsE3AO4XgwLy3AIKBAfosTTc/zxGdqGt8fRkt5W0mnWoJzUQ9KNQyLJidriXPj0YjhZ3UrhCvm+T/V4FGAd9rqXtUm96aq7baQESiwIR8hQILrAAUYNmJ4Fmu5s0d4cv/7PVfyoH8Rp9WTkM9KVGIj/r9XqdWqJhN6d0CNC5ABYhaaMwSipTrd6C3mwyZza2Lo8K8yotf1sFfVIp/HRyZrrDNcoyC5bAqIZUKyIXgXjuLL0IT5mAAWqkw/TMdDff2LxIIc/Qh1VtqOI1Kc63Wt0JEgBGNjAUFMC6oQljyZLxnZ+zLATMzAi93elOUik+MIgvMNMTSqlTMqnDsHAhXSYjuREEN8N+7h7QcUlo5A1dAFY0V0kDtFKnjTEntEU8K+sNnZrozCy5ZsxChHn1cRHcUkahEg64ZJLmqtnQONg9qxFxwaGEjMqADBhzlRTBYvCrGBPKs42sPXvyVbyOiuruFpjpUSMU0HahY4gdp+w4dYdw2ONKYAxz3tJa3l3x+lFNq+3CMUMXWFEqXnER2PiNZGTpDkB9JzBTUQpIP+v4W5uYOsqc1UavJEF6MAYPzLmAByx9n3qRgh+6uAmGrqGuSDVK8Zd1ZlbSSWFZ/PGPWguAe4QqG98zi+0VrNyADrIUdzTttOpssYBC+5QZhOspKmjlFMc2YHZY2YxwuINWJal1yRWpPzZhR06D+/XAbLTqu/cJlQyxrIFJWZtL0jV7K7YoblhTgKucGKr5A81Fn1J9Nh9POIwnfbyAd1226xAqP3lgEG1/beznM0h3HOMwXmwWWHE2XzR729RvNtxOhxhW5taW5aDLJx2QSMVief3ty3HkzRU+7Ofo74JsTtS5kf/3QSIwGmQE/Bax+3jjw5P3CLsv9My5K89KXftEtiYfFSp5IJ4zOeBo+w9nije2Pnr+arU5VKVreK5GN75Y0w/Pf0dsj9PV8wjI+xkjA+5tXcv//vlMf+n11Rgvqi0o4mXNtBrREj33xOTEK+e/VFMPPQ5SVymC7a//Nrj8zhmzdnObVnKyNBrPjYoM62RTZDNk0zx3O5tN0PU/5ZFjp6DWkKHJSaBh36Q/ffV+/uvygJbaZM1IiMkVpfpl6o3o1CFrsfPo2tIdt732A9osHEYa+Z3XI1gr+rdjvCrvH4xXBtPfIxvG0aeT31r+GrOhP7888nsl5XF/xkEZDwc7cX02yO6Srcf51uj65z+6dPsWi8Mjv/N6/L4e/TdiPOM4HZmaCJ5F0TiNWqxVE0f977EzO89jBBpFgCKyK+NdyRQqJTARmIN2yPpkm/bfuxe5njzye1zfiX5ZjLNlr8rxFizvk2jMZlTcvnoTCwM8VliWPm7sVoT/BBgAPp8JxKgcaMoAAAAASUVORK5CYII\x3d",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    stopSymbolDrag: (new x({
                        url: this.basePath + "/images/Directions/bluePointMove.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkQ5MDM5MjY2QzlCMTFFMkI0NTE5QUY4QjQzREJFODIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkQ5MDM5Mjc2QzlCMTFFMkI0NTE5QUY4QjQzREJFODIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RDkwMzkyNDZDOUIxMUUyQjQ1MTlBRjhCNDNEQkU4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RDkwMzkyNTZDOUIxMUUyQjQ1MTlBRjhCNDNEQkU4MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmssHYwAAAUwSURBVHjahFZtiFRVGH7PuR8zc3dmv9odzazc0C0sEBEriohiKzcjy1AQ8k/QT8lK0goJ+pGWGET9CPpjFoYigomypoj+0VrCPlhTVw0t2JVdWWd3dubOnXs+et9zz6zX2aK7+95z3nPf85zn/Tq7bPHWM0CPzx1wGAPgDLIuLjC+1AW9inPoY6B6cSWjFUSKsWEh2TGh4CCA+lVoBvW6BM00KNAGy4XZzyKUHS2u7m8rBH6Qy0DG94DhD26FKIq7K9Xa41OV8L1yDQ6j7WaUS2kA3gT4TODKk8WOwqq5c4t+NihADB7cG9Sgf95NWIAj6bl8K8wpFv1iZ+Fln4mTuK8vDZJm+lLW5990dXXlPd+F6Tq6ozUsuSOCFxZUjUFPexXQUzg77gPHMHmZALq6/XlibOJAGItX0eT7NNOHHEd/3dbZkacYTUcSKri7iuOaRRE4jjMja3sjCGP8jt/KaCPRvqOzo+Aw2E04hqnAiHucbQuCQismAEKZMGR4HOVt+2AOAk/DW8sF7Bx0oSqYYas1pYUZVi5msyVfaLsxUfpIaP0iub8MGazgfgYqsQKlMIMaDChH1L/KdDYzLC/cZOa7ETxQqwQYWYLjZ8F1nH4hxDIutV7PM1m3JjTUUR6bD7BntQPoAIqGWCbiui4IHNEEqwDMfO8rLjxxD0CEi7TfyWVddHI9vvRypTl+UPB0jwNvPOLZuhVQk0kI8NcwFVqg22CY5ryE/cZHHdRjOHFVYNgcrFe13EWmPYI5QBT67vOMIT171wa31RpD9IPr/q2sAZ7F1hi4ItCIDtA9LsK3xHgyYwqOXolh2fyMMdx4pGwYJoAAn/YX4M0jJsCGLSYdPnu+YPSBSyFywvhKzImGFmSqIood4xoOD0cGYetTrXB2JJ4BBOv+2dHYANJpGDaz9uGJKTh0MTI6VQ1WRc3VnF2VSnRz5plMHrqIvTdcSwCtmNrDREmtbzFFefjLsWQO1PdUDdjInF3jyHpIyRgkspVYIhJdoMyS3sh+1k2SksXkCKWtrTa2Zo/SCVPEQXWI3bnpxHPM8QacoP1WUlIML7yzcFZi7v/kcsI4tUZzWS3hK17BVa7ruIzjQSlisHVvXEESRrYcGb+tTUlX1obsG2L2Iw7huWY/g/dZNH2UB+28+f7aP1Qy3bVmSTvs+61k9DQ7M1KH1cqKcNBUsjlbfwdVvYHuqs3gZLbzbB5Bbr8RWZObDaDGiqpNI1S0RQP/mAddt+yLbx+nZt+Arx0815qhQv7fR0tQ4VSklNyENL4Y29k3i4TROzccfpK73lc8aFvIHP8/8ZSogw4nLysRvz7x+cpT6bw5KQ9p7oSDe0bcuxYPINulePXcDXw2Y02A1YnT9b9/WVfa9dpQU8HMKJQwopW14rvzHmxrXb3tO6d97gPA3TRFkKXrF6YOvLtOjJybxJU6Ss0KzYVjGVLDU6F2onTQXJXHc+Bm/uTF3hXgZbmGpDVlpSRqP+/7oP7HsSlcakHJWUJEjnpb8pTrWWuUR6ErKhee3nVNTY78qGVkQkYj6bRuwQJr32L3O5Dc70kzWPr0F65iR+NO/fyx/TqqaHOJ4Eh6yuVme8LR3DYHGVF8xlBGUa7b+UR45tufVG3yPCWHRtJp3X6/bu3H7H7CUa5lKix4ZJNGbng2Vjkdln7Q+e7FNFqg0ALEll1jv2owhVQIhAWmTXQjU0+Oy5ujuymeNJJu18vWLrL7ZKNWm/9DmblPrBCbMB4+dU7HAmhMsWzYqKYLC/4RYACkZdX+YS9hNAAAAABJRU5ErkJggg\x3d\x3d",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    toSymbol: (new x({
                        url: this.basePath + "/images/Directions/redPoint.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNEZDQTg5MTE0QzYxMUUyQURFMUNDNThGMTA3MjkzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNEZDQTg5MjE0QzYxMUUyQURFMUNDNThGMTA3MjkzMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MjUyRTZBMTRDNTExRTJBREUxQ0M1OEYxMDcyOTMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI0RkNBODkwMTRDNjExRTJBREUxQ0M1OEYxMDcyOTMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+pmgrrgAABHNJREFUeNqEVU2IHEUUflVd3fO/P3FWRPAQ0EVWL2FZFBS8REgQXD0GDILg0Zsgbg7ezCFXb15iFCUigkJAzF5y0RgQPUyIRBFz2SxusszO7uxMd1e953vV1TM9m6gF31S96qqvvvdTNerH9RWQFtUSUCYCRWwkddAAJ8iYdVD6JIJa5tkaAKUK8bZCexWc/QYJflXO8jADcsRAz2XgwfYU4wI1Wqebnfmk1mhCnNSYWwFZB3meLo0Phy+M9gcbcLh/hde+x/i9SnCU9GWXNC8udLuPN9sdYBo+PQcYsxIivyDmLmk2oNNsJMNB4/X+/XvPKZu9yZ82H0b6mo7rn3aXum1jYqDDAyBEJitcgkDKA/+rlIZmLYaEBezu2K/taPQGT39bJX2WVPTJ4tx828coTZnQFQRCptSE2B9STjGxYgGLC4udnSy7BA5f5NmeQSZRcXy+02rOKbJAo5FXyDsKqFlSD/6O3CsZRxp0ZKDTas33x/c+JGtfFaWrURSdqvFHPBwWhJ5DsRDt1UzaRCmDM83BAZULcQR1HUFkzGlr7aoh587WtTaUjv3igrQgJNRTlWXzXkgCOTwcIpTD2Vs5nInNAdFZw1ldY42AWeozrLzLvI1JJRmeVFAmqlSLQYDYIEJYqfA4WhOlxyPLsdQhL56ECWWTJ62onBQAToiLsZzrIPJn4HHDdovyHFCrEMciOQV5KKcJM01DMFFMRTjYxiKJLYPWpSRKhcTHUQiwIC8KcjamvgKguAyEwUZvyzVFpLFRSH9Z65Zizr4vESjJS8KH+F+WFk1VinrHqpnvDpcU9XKHawZKlzkEhLNk1TqtHEAz5AC58zHuac7W5bHF4EVwwbtRAZePx4yNfq3fE/YKD5K6rLsRbubO3citmyTA9+j+A/gAZH+OeEP4pJAcB+PcAc/4U0u4CsIlmtqzEPX71gf1nPCVd3Azc7ixl/Fjwq5R6dpRhPAUISrC4RiDjFU62iifv0k2Np9/VMrzHa6kC3NG1yIF/9tYNAwsps7hu/ywfHTy+t8zVT3J85XVYy/FWn88H+snE/3vzOwZ7Fn6g6P29is/716r3De+rtMrI+Po87ujrZWW+Y7VnkgUPBGV5VlBxhJ3c/rhl73szFu9fm/6Tk7JVHisE0Y9IHmmbebPL8998VgSPW0qgi2Tbmfut/dvD87cPLB7IpoxDpCxjYJC/qeEBcYxxqKMdzJs1BT8udzQp+r8Dhd3naCfO/vl9viDq/ezAa9rMRpBkBydl9kvXa+HRW1GUxZf3Brd2UrxeuqKApdebJkPZM2wvhX2RxCedfK1Wsg/ZAxD791hRV8NnX80QXqxKy4fXe//2Ix/kopFEp80hKJE/bPt0U/rjyS32lqt7GV4S+ywbhz6tGILD5qg1AbyNCRN3IhDrBp9S98vIa1Iz/Y2YxQI8qCu3O//a3TlTSs/pmHTPqPP2LmbuUsST+nFDvP7YV0a9rmyVvWRmqZwmgsQNaNr/fwmP+MgfUVluQarhS/tHwEGAEyHOx7EoDsBAAAAAElFTkSuQmCC",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    toSymbolDrag: (new x({
                        url: this.basePath + "/images/Directions/redPointMove.png",
                        height: 21.75,
                        width: 15.75,
                        imageData: "iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RDNTQyNTU2QzlCMTFFMkExREZEMUE4OEI2QURDNjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RDNTQyNTY2QzlCMTFFMkExREZEMUE4OEI2QURDNjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3REM1NDI1MzZDOUIxMUUyQTFERkQxQTg4QjZBREM2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REM1NDI1NDZDOUIxMUUyQTFERkQxQTg4QjZBREM2MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PubpLUYAAAU3SURBVHjahFVbiFZVFF57n33Of5+LOWZFkOAMMQUh49jFyofGUIosIlBLgqCgB4NIEvNBItAHA6N6qhfTSkwxykZEfTFJLckixgsqli8zw4zaP//9nLMvrbXP/i+ORZtZs89eZ+1vf+tb69+HnVo1CDS8VABMeMAMLoI0cIBFRohVwPiIBjaA3hSACZnWl5iWR0HJ77SB35mS+BiBUQZNWywBt49+tO0mk1uZLXQHqUwW/CCF2AyMVBDHYV+jVl1aL5feg1p5FGM3ol3uBJgNulwF2Z09c+fenc0XAGHw9BiggUyMsQE+TkE2A4VsJqiWMi8Ub1x/mMnoVXx1rAnCOwCf5376wLw+BPR9MLUK6EoZNM71+f3w99KXoH5XP+h6BVRlBky1DNmUD/OQgBekD+D+52YzfdAw74veru681SgMwWiFbgPxwGKoP/GiDarfsxBAxiAungHG0ME41sGH3p7ewnQU7QKlH0fvGNcIYjjbVshlu5jBZ2SiwyqYGIHjGKKn1oLneS2LRl5B4Ah0hO8bNYwvA0eJCrlct9Zyq4oalukQBq9IeRxTRTCNFSQW+I9xDumvtoJJZUGt3gDenu2obxWICLICjZmwGEXGw9IcDxVipZRySBil1qU5FyZsYLbagSaARqPkE3/aM4glu3YegN7bAqI8KJGmw+kQlAKBRcWYdRyrOowcbToqioA99CSID/aBlihF0xBACNF61k3f1m9tvI4jUCiVRzjKDBPTBR4FISkxvBz81W/bokiRwlavOykSpjFutAMzglQm0XntOxBhu6kzR8BDtzF6gUBFclQQjc0tljxtA2lkt+2/pYEZSpLfcQj+dTy6AqonD4GmXtY6J7RUoU0LN8lThyE9uNjGlT5c34Sz/7s2fIy+t6ye9g+t+91Pklb7adRJgulr0xBMm7+kVH0+Vj888YOF6HpjC8Tnz4Jrxnb6F8669BNU8pU+ex8aJ0ZtARVeBoh3DVvKjMVKDwuqKILUjn8P9R8PtsBc7q1CtYeByZeHWgfQiOlCMZqa3+xtSJ2808lNo20abQPsU6t1Opf4qAMwhmLtHreXcLRhe9kfy+70rks42eN7S3wsVpJym+jCg5dvq8uVZ/vbMrhBLItS/zJXwGN0oSgUY3MlRonp1KapxKZ2bLzlZ0rrW+LQiH1ZWlE3E5735n15qClzVRoI0T/iE1nTLkbjynmQU+PgF3pgevdHUDy8z/oN/fpwpjYqxxoiDZtw6+6sYO1qHHtkHoGtRwW2dwme8hj878BEoCR1qJTGi4F/OnJ6qlO5dp1Hh+Ys8zn/vNvnCwP+38gRajgjzRVU7fVnfr15PGlg9+vr6HB69r6eqI8P5sRhZLsoYHCvBy68wyKkeDM2J3+bida8NlYcc/tbDJoLugIDtLSz4IG86N420LVnfuDdLzoIo/YwGamLmy6V1pyryBkijdZwRs/ScwzxSwk9aHPQeul5OtKZFIOrAxm+Is3xs2OLY6AYK/nNZGPL0RtRCeNyaBlHiI6mG0fxjtTTLihP9wkF7xyvXxsP9elQJQ1OM63J78CyLj7n9nvJRyZRSjn6NbSqm206yGh/VRFNfIEzrTtSnh1vP2ykpXZBpE/opGha+svJ+s+r7ggu5DkbnIn0BVq7uIabw4414WjhmEoHHrqiURq+0ypTlOZInzaDNON6km47BxA7ds399lvDW1dO+2XoNpXRimjTE5HaRXrSTGvnL7u40O1TzV7ls3rauNOUM2JTP16Mz+EVDDR3sGzG6M7Gp/GPAAMAKMYdXbFXj3QAAAAASUVORK5CYII\x3d",
                        contentType: "image/png",
                        type: "esriPMS"
                    })).setOffset(0, 10.875),
                    routeSymbol: (new J).setColor(new A([0, 69, 117, 1])).setWidth(4),
                    segmentSymbol: (new J).setColor(new A([0, 122, 194, 1])).setWidth(8),
                    printPage: "",
                    printTemplate: "",
                    autoCenterAtSegmentStart: !0,
                    focusOnNewStop: !0,
                    dragging: !0,
                    canModifyStops: !0,
                    directionsLengthUnits: null,
                    traffic: !1,
                    trafficLayer: null,
                    showPrintPage: !0,
                    showSegmentPopup: !0,
                    showSegmentHighlight: !0,
                    showReverseStopsButton: !0,
                    showReturnToStartOption: !0,
                    showOptimalRouteOption: !0,
                    showTravelModesOption: !0,
                    showMilesKilometersOption: !0,
                    showClearButton: !1
                };
                this.defaults = d.mixin({}, this.options, a);
                this._sortId = "_dndId_" + this.id;
                this._stopReference = "_dndStop_" + this.id;
                this._i18n = h;
                this.domNode = b
            },
            postCreate: function() {
                this.inherited(arguments);
                this.own(g(this._addDestinationNode, p, d.hitch(this, this._addStopButton)));
                this.own(g(this._optionsButtonNode, p, d.hitch(this, this._toggleOptionsMenu)));
                this.own(g(this._findOptimalOrderNode, p, d.hitch(this, this._toggleCheckbox)));
                this.own(g(this._returnToStartNode,
                    p, d.hitch(this, this._toggleCheckbox)));
                this.own(g(this._useTrafficNode, p, d.hitch(this, this._toggleCheckbox)));
                this.own(g(this._useMilesNode, p, d.hitch(this, this._toggleUnits)));
                this.own(g(this._useKilometersNode, p, d.hitch(this, this._toggleUnits)));
                this.own(g(this._useTravelModeTimeNode, p, d.hitch(this, this._toggleTravelModeImpedance)));
                this.own(g(this._useTravelModeDistanceNode, p, d.hitch(this, this._toggleTravelModeImpedance)));
                this.own(g(this._useTravelModeCarNode, p, d.hitch(this, this._toggleTravelMode)));
                this.own(g(this._useTravelModeTruckNode, p, d.hitch(this, this._toggleTravelMode)));
                this.own(g(this._useTravelModeWalkingNode, p, d.hitch(this, this._toggleTravelMode)));
                this.own(g(this._getDirectionsButtonNode, p, d.hitch(this, this._solveAndZoom)));
                this.own(g(this._clearDirectionsButtonNode, p, d.hitch(this, function() {
                    this.clearDirections();
                    this.onDirectionsClear()
                })));
                this._setWidgetProperties()
            },
            startup: function() {
                this._init()
            },
            destroy: function() {
                this._disconnectEvents();
                r.empty(this.domNode);
                this.inherited(arguments)
            },
            _destroyGeocoders: function() {
                var a = this.get("geocoders");
                if (a && a.length)
                    for (var b = 0; b < a.length; b++) a[b] && a[b].destroy();
                this.set("geocoders", [])
            },
            _disconnectEvents: function() {
                this.clearDirections();
                var a;
                if (this._watchEvents && this._watchEvents.length)
                    for (a = 0; a < this._watchEvents.length; a++) this._watchEvents[a].unwatch();
                if (this._onEvents && this._onEvents.length)
                    for (a = 0; a < this._onEvents.length; a++) this._onEvents[a].remove();
                if (this._geocoderFindEvents && this._geocoderFindEvents.length)
                    for (a = 0; a < this._geocoderFindEvents.length; a++) this._geocoderFindEvents[a].remove();
                if (this._geocoderWatchEvents && this._geocoderWatchEvents.length)
                    for (a = 0; a < this._geocoderWatchEvents.length; a++) this._geocoderWatchEvents[a].unwatch();
                if (this._geocoderSelectEvents && this._geocoderSelectEvents.length)
                    for (a = 0; a < this._geocoderSelectEvents.length; a++) this._geocoderSelectEvents[a].remove();
                this._onEvents = [];
                this._watchEvents = [];
                this._geocoderSelectEvents = [];
                this._geocoderFindEvents = [];
                this._geocoderWatchEvents = [];
                this._disconnectResults();
                this._destroyGeocoders();
                this._destroyGlobalGeocoder();
                this._destroyDnD()
            },
            clearDirections: function() {
                this.get("routeParams") && this.get("routeParams").stops && (this.get("routeParams").stops.features = []);
                this.set("directions", null);
                this._clearDisplayBeforeSolve();
                this._clearDisplayAfterSolve()
            },
            reset: function() {
                this._setWidgetProperties();
                this._init()
            },
            onLoad: function() {},
            onDirectionsStart: function() {
                this._clearDisplayBeforeSolve();
                this.set("solving", !0)
            },
            onDirectionsFinish: function() {
                this.set("solving", !1)
            },
            onDirectionsClear: function() {},
            onSegmentSelect: function() {},
            onSegmentHighlight: function() {},
            onStopsUpdate: function() {},
            onError: function() {},
            removeStops: function() {
                return this._enqueue(function() {
                    this.clearErrors();
                    return this._removeStops()
                })
            },
            removeStop: function(a) {
                return this._enqueue(function() {
                    if (this.stops.length > this.get("minStops")) return this.clearErrors(), this._removeStop(a);
                    var b = new l;
                    b.reject();
                    return b.promise
                })
            },
            updateStops: function(a) {
                return this._enqueue(function() {
                    this.clearErrors();
                    return this._updateStops(a)
                })
            },
            addStops: function(a, b) {
                return this._enqueue(function() {
                    this.clearErrors();
                    return this._addStops(a, b)
                })
            },
            addStop: function(a, b) {
                return this._enqueue(function() {
                    this.clearErrors();
                    return this._addStop(a, b)
                })
            },
            updateStop: function(a, b) {
                return this._enqueue(function() {
                    this.clearErrors();
                    return this._updateStop(a, b)
                })
            },
            clearErrors: function() {
                this.errors = [];
                this._errorNode && (this._errorNode.innerHTML = "")
            },
            getDirections: function() {
                return this._enqueue(function() {
                    this._removeEmptyStops();
                    this.clearErrors();
                    var a = new l;
                    this._calculateValidStops() >= this.get("minStops") ? (this.onDirectionsStart(),
                        this._dnd.sync(), this._sortGeocoders(), this._getCandidates(this.get("stops")).then(d.hitch(this, function(b) {
                            this.stops = b;
                            this._setStops();
                            var c = this._validateStops(b);
                            c.error ? (b = h.widgets.directions.error.locator, (c = this.get("geocoders")[c.index]) && (b = h.widgets.directions.error.unknownStop.replace("\x3cname\x3e", c.get("value"))), this._resultError(b), a.reject(b), this.onDirectionsFinish(Error([b]))) : this._configureRoute(a)
                        }), d.hitch(this, function(b) {
                            a.reject(b);
                            this.onDirectionsFinish()
                        }))) : (this.clearDirections(),
                        this.createRouteSymbols(), a.reject(h.widgets.directions.error.notEnoughStops));
                    return a.promise
                })
            },
            unhighlightSegment: function() {
                this.get("map") && (this.get("map").graphics && this.get("showSegmentHighlight")) && (this.get("map").graphics.remove(this._segmentGraphic), this._segmentGraphic = null)
            },
            highlightSegment: function(a) {
                "undefined" === typeof a && (a = 0);
                a = this.get("directions").features[a];
                var b = new I(a.geometry),
                    c = b.getPoint(0, 0),
                    f = b.getPoint(0, 1);
                U.getLength(c, f) ? b.getPoint(0, 0) : b = c;
                this.unhighlightSegment();
                (this._segmentGraphic = new w(b, this.get("segmentSymbol"), a.attributes, this.get("segmentInfoTemplate"))) && this.get("map") && this.get("map").graphics && this.get("showSegmentHighlight") && this.get("map").graphics.add(this._segmentGraphic)
            },
            zoomToSegment: function(a) {
                "undefined" === typeof a && (a = 0);
                if (this.get("map")) {
                    var b = this.get("directions").features[a],
                        c = (new I(b.geometry)).getExtent();
                    this.get("map").setExtent(c, !0).then(d.hitch(this, function() {
                        this._showSegmentPopup(b, a)
                    }))
                }
            },
            centerAtSegmentStart: function(a) {
                "undefined" ===
                    typeof a && (a = 0);
                if (this.get("map")) {
                    var b = this.get("directions").features[a],
                        c = b.geometry.getPoint(0, 0);
                    this.get("map").centerAt(c).then(d.hitch(this, function() {
                        this._showSegmentPopup(b, a)
                    }))
                }
            },
            zoomToFullRoute: function() {
                this.get("map") && (this._clearInfoWindow(), this.unhighlightSegment(), this.get("map").setExtent(this.get("directions").extent, !0))
            },
            setListIcons: function() {
                var a, b = this._dnd.getAllNodes();
                for (a = 0; a < b.length; a++) {
                    var c = v("." + this._css.stopIconClass, b[a])[0];
                    c && (c.innerHTML = this._getLetter(a));
                    k.remove(b[a], this._css.stopOriginClass + " " + this._css.stopDestinationClass);
                    0 === a ? k.add(b[a], this._css.stopOriginClass) : a === b.length - 1 && k.add(b[a], this._css.stopDestinationClass)
                }
                a = v("[data-reverse-td]", this._dndNode)[0];
                r.destroy(a);
                this.get("showReverseStopsButton") && r.create("td", {
                    "data-reverse-td": "true",
                    rowspan: b.length,
                    className: this._css.esriStopReverseColumnClass,
                    innerHTML: '\x3cdiv role\x3d"button" class\x3d"' + this._css.reverseStopsClass + '" data-reverse-stops\x3d"true" title\x3d"' + h.widgets.directions.reverseDirections +
                        '"\x3e\x3c/div\x3e'
                }, b[0])
            },
            addRouteSymbols: function() {
                if (this.stopGraphics.length && this.get("map") && this.get("map").graphics)
                    for (var a = 0; a < this.stopGraphics.length; a++)
                        if (this.stopGraphics[a]) {
                            this.get("map").graphics.add(this.stopGraphics[a]);
                            var b = this.stopGraphics[a].getDojoShape();
                            b && b.moveToFront();
                            this.get("map").graphics.add(this.textGraphics[a]);
                            (b = this.textGraphics[a].getDojoShape()) && b.moveToFront()
                        }
            },
            createRouteSymbols: function() {
                this._clearStopGraphics();
                for (var a = this.get("stops"), b =
                    0; b < a.length; b++) {
                    var c = a[b];
                    if (c && c.feature) {
                        var f = this._setStopSymbol(b, a.length),
                            e = this._defaultSR;
                        this.get("map") && (e = this.get("map").spatialReference);
                        var e = new S(c.feature.geometry.x, c.feature.geometry.y, e),
                            d = this._getLetter(b),
                            d = new V(d, this.get("textSymbolFont"), this.get("textSymbolColor"));
                        this.get("textSymbolOffset") && d.setOffset(this.get("textSymbolOffset").x, this.get("textSymbolOffset").y);
                        d = new w(e, d);
                        d._textGraphic = !0;
                        d._index = b;
                        c = new w(e, f, {
                            address: c.name
                        }, this.get("stopsInfoTemplate"));
                        c._drag = !0;
                        c._index = b;
                        this.stopGraphics[b] = c;
                        this.textGraphics[b] = d
                    }
                }
                this.set("stopGraphics", this.stopGraphics);
                this.set("textGraphics", this.textGraphics);
                this.addRouteSymbols()
            },
            setTravelMode: function(a) {
                var b = new l,
                    c = this.serviceDescription;
                if (c && c.supportedTravelModes && c.supportedTravelModes.length) {
                    for (var c = c.supportedTravelModes, f = !1, e = !1, d = 0; d < c.length; d++)
                        if (c[d].name === a && c[d]._nodeTravelMode && c[d]._nodeImpedance) {
                            c[d]._nodeTravelMode.click();
                            c[d]._nodeImpedance.click();
                            e = !0;
                            f = this.travelModeName &&
                                this.travelModeName !== a;
                            this.set("travelModeName", c[d].name);
                            this.routeParams.travelMode = c[d].itemId;
                            break
                        }
                    e ? f ? this._solveAndZoom().always(function() {
                        b.resolve(a)
                    }) : b.resolve(a) : b.reject(a)
                } else b.reject(a);
                return b.promise
            },
            getSupportedTravelModeNames: function() {
                var a = [],
                    b = this.serviceDescription;
                if (b && b.supportedTravelModes && b.supportedTravelModes.length)
                    for (var b = b.supportedTravelModes, c = 0; c < b.length; c++) a.push(b[c].name);
                return a
            },
            setDirectionsLengthUnits: function(a) {
                var b = new l;
                k.remove(this._useMilesNode,
                    this._css.stopsPressedButtonClass);
                k.remove(this._useKilometersNode, this._css.stopsPressedButtonClass);
                a === n.KILOMETERS ? k.add(this._useKilometersNode, this._css.stopsPressedButtonClass) : a === n.MILES && k.add(this._useMilesNode, this._css.stopsPressedButtonClass);
                this.directionsLengthUnits !== a ? a === n.KILOMETERS || a === n.METERS || a === n.MILES || a === n.NAUTICAL_MILES ? (this.directionsLengthUnits = a, this.autoSolve ? this.getDirections().always(function() {
                    b.resolve(a)
                }) : b.resolve(a)) : b.reject(a) : b.resolve(a);
                return b.promise
            },
            _showLoadingSpinner: function(a) {
                void 0 === a && (a = this._requestQueueTail && !this._requestQueueTail.isFulfilled() && this.loaded);
                a ? k.add(this._widgetContainer, this._css.resultsLoadingClass) : k.remove(this._widgetContainer, this._css.resultsLoadingClass)
            },
            _enqueue: function() {
                var a = new l,
                    b = arguments;
                this._requestQueueTail || (this._requestQueueTail = new l, this._requestQueueTail.resolve());
                this._requestQueueTail.promise.always(d.hitch(this, function() {
                    var c = b[0];
                    try {
                        var f = c.call(this);
                        f && "object" === typeof f && f.hasOwnProperty("isFulfilled") ?
                            f.then(d.hitch(this, function(b) {
                                a.resolve(b);
                                this._showLoadingSpinner()
                            }), d.hitch(this, function(b) {
                                a.reject(b);
                                this._showLoadingSpinner()
                            })) : (a.resolve(f), this._showLoadingSpinner())
                    } catch (e) {
                        a.reject(e), this._showLoadingSpinner()
                    }
                }));
                this._requestQueueTail = a;
                this._showLoadingSpinner();
                return a.promise
            },
            _createDnD: function() {
                this._dnd = new P(this._dndNode, {
                    skipForm: !0,
                    withHandles: !0
                })
            },
            _destroyDnD: function() {
                r.empty(this._dndNode);
                this._dnd && (this._dnd.destroy(), this._dnd = null)
            },
            _setGeocoderOptions: function() {
                var a = {
                    theme: this.get("theme")
                };
                this.defaults.geocoderOptions.autoComplete || (a.maxLocations = 1);
                var b = {
                    map: this.get("map")
                };
                this.geocoderOptions = d.mixin(a, this.defaults.geocoderOptions, b)
            },
            _setDefaultUnits: function() {
                if (this.get("directionsLengthUnits")) this.setDirectionsLengthUnits(this.directionsLengthUnits);
                else {
                    var a = n.KILOMETERS;
                    this.defaults.routeParams.directionsLengthUnits ? a = this.defaults.routeParams.directionsLengthUnits : this.defaults.routeParams.directionsLanguage && (a = "en" === this.defaults.routeParams.directionsLanguage ?
                        n.MILES : n.KILOMETERS);
                    this.set("directionsLengthUnits", a)
                }
            },
            _setTrafficOptions: function() {
                this.defaults.hasOwnProperty("showTrafficOption") ? this.set("showTrafficOption", this.defaults.showTrafficOption) : -1 < this.get("routeTaskUrl").search(/^https?:\/\/route[^.]*\.arcgis\.com.*$/i) && this.set("showTrafficOption", !0); - 1 < this.get("routeTaskUrl").search(/^https?:\/\/route[^.]*\.arcgis\.com.*$/i) && (this.get("trafficLayer") || this.set("trafficLayer", new R(location.protocol + "//traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer", {
                    opacity: 0.4
                })))
            },
            _updateCanModifyStops: function() {
                this.get("canModifyStops") ? this._showAddDestination() : this._hideAddDestination()
            },
            _setWidgetProperties: function() {
                this._stopsReady = !1;
                this._disconnectEvents();
                this.set("loaded", !1);
                this.set("map", this.defaults.map);
                this.set("alphabet", this.defaults.alphabet);
                this.set("directions", this.defaults.directions);
                this.set("directionsLanguage", this.defaults.directionsLanguage);
                this.set("routeTaskUrl", this.defaults.routeTaskUrl);
                this.set("stops", []);
                this.set("textSymbolFont",
                    this.defaults.textSymbolFont);
                this.set("textSymbolColor", this.defaults.textSymbolColor);
                this.set("textSymbolOffset", this.defaults.textSymbolOffset);
                this.set("fromSymbol", this.defaults.fromSymbol);
                this.set("fromSymbolDrag", this.defaults.fromSymbolDrag);
                this.set("stopSymbol", this.defaults.stopSymbol);
                this.set("stopSymbolDrag", this.defaults.stopSymbolDrag);
                this.set("toSymbol", this.defaults.toSymbol);
                this.set("toSymbolDrag", this.defaults.toSymbolDrag);
                this.set("routeSymbol", this.defaults.routeSymbol);
                this.set("segmentSymbol", this.defaults.segmentSymbol);
                this.set("showPrintPage", this.defaults.showPrintPage);
                this.set("showSegmentPopup", this.defaults.showSegmentPopup);
                this.set("showSegmentHighlight", this.defaults.showSegmentHighlight);
                this.set("autoCenterAtSegmentStart", this.defaults.autoCenterAtSegmentStart);
                this.set("showReverseStopsButton", this.defaults.showReverseStopsButton);
                this.set("focusOnNewStop", this.defaults.focusOnNewStop);
                this.set("dragging", this.defaults.dragging);
                this.set("canModifyStops",
                    this.defaults.canModifyStops);
                this.set("theme", this.defaults.theme);
                this.set("showReturnToStartOption", this.defaults.showReturnToStartOption);
                this.set("showOptimalRouteOption", this.defaults.showOptimalRouteOption);
                this.set("optimalRoute", this.defaults.optimalRoute);
                this.set("returnToStart", this.defaults.returnToStart);
                this.set("traffic", this.defaults.traffic);
                this.set("trafficLayer", this.defaults.trafficLayer);
                this.set("minStops", this.defaults.minStops);
                this.set("maxStops", this.defaults.maxStops);
                this.set("printPage", this.defaults.printPage);
                this.set("autoSolve", this.defaults.autoSolve);
                this.set("directionsLengthUnits", this.defaults.directionsLengthUnits);
                this.set("stopsInfoTemplate", this.defaults.stopsInfoTemplate);
                this.set("segmentInfoTemplate", this.defaults.segmentInfoTemplate);
                this.set("geocoders", []);
                this.set("showTravelModesOption", this.defaults.showTravelModesOption);
                this.set("showMilesKilometersOption", this.defaults.showMilesKilometersOption);
                this.set("showClearButton", this.defaults.showClearButton);
                this._defaultSR = new Q(4326);
                this._updateCanModifyStops()
            },
            _setStopsAttr: function(a) {
                this._stopsReady ? (a || (a = []), this._updateStops(a), this._setStops()) : this._set("stops", a)
            },
            _updateStops: function(a) {
                this.stops || (this.stops = []);
                a || (a = []);
                var b = this.stops.length;
                return a && a.length ? this._getCandidates(a).then(d.hitch(this, function(a) {
                    var d = a.length,
                        e = 0,
                        e = 0;
                    if (d === b)
                        for (e = 0; e < d; e++) this._updateStopInsert(a[e], e);
                    else if (d > b) {
                        if (b)
                            for (e; e < b; e++) this._updateStopInsert(a[e], e);
                        for (e; e < d; e++) this._insertStop(a[e],
                            e)
                    } else {
                        for (var u = b - d, e = 0; e < u; e++) this._removeStop();
                        for (e = 0; e < d; e++) this._updateStopInsert(a[e], e)
                    }
                    this._setStops()
                })) : this._removeStops()
            },
            _removeStops: function() {
                var a = d.clone(this.get("stops")),
                    b = new l;
                if (this.stops.length) {
                    for (; this.stops.length;) this._removeStop();
                    b.resolve(a)
                } else b.reject("no stops to remove");
                return b.promise
            },
            _removeStop: function(a) {
                var b = new l;
                if (this.stops.length) {
                    "undefined" === typeof a && (a = this.stops.length - 1);
                    var c = d.clone(this.stops[a]);
                    this.stops.splice(a, 1);
                    this._setStops();
                    var f = this._dnd.getAllNodes()[a],
                        e = this.get("geocoders");
                    e[a].destroy();
                    e.splice(a, 1);
                    this.set("geocoders", e);
                    this._geocoderSelectEvents[f.id].remove();
                    this._geocoderFindEvents[f.id].remove();
                    this._geocoderWatchEvents[f.id].unwatch();
                    r.destroy(f);
                    this._dnd.sync();
                    this._stopsRemovable();
                    this._optionsMenu();
                    this._checkMaxStops();
                    this.setListIcons();
                    this._sortGeocoders();
                    b.resolve(c, a)
                } else b.reject(h.widgets.directions.error.cantRemoveStop);
                return b.promise
            },
            _removeTrafficLayer: function() {
                var a = this.get("trafficLayer"),
                    b = this.get("map");
                a && b && b.removeLayer(a);
                this._trafficLayerAdded = !1
            },
            _addStops: function(a, b) {
                for (var c = 0; c < Math.min(a.length, this.maxStops - this.stopGraphics.length); c++) this.addStop(a[c], void 0 === b ? b : b + c)
            },
            _addStop: function(a, b) {
                var c = new l;
                this._checkMaxStops();
                this.maxStopsReached ? (this._resultError(h.widgets.directions.error.maximumStops), c.reject(h.widgets.directions.error.maximumStops)) : this._getCandidate(a).then(d.hitch(this, function(a) {
                        b = this._insertStop(a, b);
                        this._setStops();
                        c.resolve(a, b)
                    }),
                    d.hitch(this, function(a) {
                        c.reject(a)
                    }));
                return c.promise
            },
            _removeEmptyStops: function() {
                if (this.stops.length > this.get("minStops"))
                    for (var a = this.stops.length - 1; this.stops.length > this.get("minStops") && -1 < a; a--) {
                        var b = this.stops[a];
                        (!b || !b.name) && this._removeStop(a)
                    }
            },
            _setReverseGeocode: function(a, b) {
                if (a.feature.geometry) {
                    var c = {
                        address: a.name
                    };
                    this.stopGraphics[this._dragGraphic._index] && (this.stopGraphics[this._dragGraphic._index].setAttributes(c), this.stopGraphics[this._dragGraphic._index].setGeometry(b));
                    this.textGraphics[this._dragGraphic._index] && (this.textGraphics[this._dragGraphic._index].setAttributes(c), this.textGraphics[this._dragGraphic._index].setGeometry(b));
                    this.set("stopGraphics", this.stopGraphics);
                    this.set("textGraphics", this.textGraphics);
                    this._moveInProgress || this._unsetDraggableObject(this._dragGraphic);
                    this.get("geocoders")[this._dragGraphic._index] && this.get("geocoders")[this._dragGraphic._index].set("value", a.name);
                    this.stops[this._dragGraphic._index] = a;
                    this.stops[this._dragGraphic._index].feature.setGeometry(b);
                    this._setStops();
                    this.get("autoSolve") && this.getDirections()
                }
            },
            _insertStop: function(a, b) {
                var c, d;
                if (void 0 === b)
                    for (c = 0; c < this.geocoders.length; c++) {
                        if (!this.geocoders[c].get("value")) {
                            d = this.geocoders[c];
                            break
                        }
                    } else c = b, this.geocoders[c] && !this.geocoders[c].get("value") && (d = this.geocoders[c]);
                d && (void 0 === b || b === c) ? (d.set("value", a.name), this.stops[c] = a, d[this._stopReference] = a) : (void 0 === b && (b = this.geocoders.length), this._createGeocoder(a, b))
            },
            _createGeocoder: function(a, b) {
                var c = this._dnd.getAllNodes(),
                    f = !1,
                    e = !1,
                    u = c.length;
                c[b] ? (e = c[b], f = !0) : f = e = !1;
                var t = r.create("tr", {
                        className: this._css.stopClass
                    }),
                    c = r.create("td", {
                        className: this._css.stopIconColumnClass
                    }, t);
                r.create("div", {
                    className: this._css.stopIconClass + " dojoDndHandle",
                    innerHTML: this._getLetter(u)
                }, c);
                u = r.create("td", {
                    className: this._css.esriStopGeocoderColumnClass
                }, t);
                u = r.create("div", {}, u);
                this.get("canModifyStops") && (c = r.create("td", {
                    className: this._css.stopIconRemoveColumnClass
                }, t), r.create("div", {
                    className: this._css.stopIconRemoveClass,
                    role: "button",
                    "data-remove": "true"
                }, c));
                this._dnd.insertNodes(!1, [t], f, e);
                this.stops.splice(b, 0, a);
                f = d.mixin({}, this.get("geocoderOptions"), {
                    value: a.name
                });
                f = new F(f, u);
                f[this._sortId] = t.id;
                f[this._stopReference] = a;
                e = this.get("geocoders");
                e.splice(b, 0, f);
                f.startup();
                this.set("geocoders", e);
                e = d.hitch(this, function(a) {
                    if (a && (a.results || a.result)) {
                        var b = this._dnd.getAllNodes(),
                            b = q.indexOf(b, t),
                            c = !0;
                        a.results && a.results.results && a.results.results.length ? (this._setStops(), this.stops[b] = a.results.results[0]) :
                            a.result ? (this._setStops(), this.stops[b] = a.result) : (this._removeStopButton(b), c = !1);
                        c && this._solveAndZoom()
                    }
                });
                u = f.on("select", e);
                this._geocoderSelectEvents[t.id] = u;
                e = f.on("find-results", e);
                this._geocoderFindEvents[t.id] = e;
                e = f.watch("value", d.hitch(this, function(a, b, c) {
                    a = this._dnd.getAllNodes();
                    a = q.indexOf(a, t);
                    this.stops[a] && c !== this.stops[a].name && (this.stops[a] = {
                        name: c
                    }, this._setStops())
                }));
                this._geocoderWatchEvents[t.id] = e;
                this._checkMaxStops();
                this.setListIcons();
                this.get("focusOnNewStop") &&
                    f.focus();
                this._stopsRemovable();
                this._optionsMenu();
                this._sortGeocoders()
            },
            _validateStops: function(a) {
                if (a)
                    for (var b = 0; b < a.length; b++)
                        if (!a[b] || !a[b].feature || !a[b].extent) return {
                            error: !0,
                            index: b
                        };
                return {
                    error: !1
                }
            },
            _sortStops: function() {
                this.stops.length && (this.stops.sort(d.hitch(this, function(a, b) {
                    for (var c, d, e = 0; e < this.get("geocoders").length; e++) this.geocoders[e][this._stopReference] === a ? c = e : this.geocoders[e][this._stopReference] === b && (d = e);
                    return c > d ? 1 : d > c ? -1 : 0
                })), this._setStops())
            },
            _getCandidate: function(a) {
                var b =
                    new l,
                    c = typeof a,
                    f = {
                        name: ""
                    };
                a ? "object" === c && a.hasOwnProperty("feature") && a.hasOwnProperty("name") ? b.resolve(a) : "object" === c && a.hasOwnProperty("address") && a.hasOwnProperty("location") ? (c = this._globalGeocoder._hydrateResult(a), b.resolve(c)) : "object" === c && a.hasOwnProperty("name") && !a.name ? b.resolve(f) : ("object" === c && a.hasOwnProperty("name") && (a = a.name), this._globalGeocoder ? this._globalGeocoder.find(a).then(d.hitch(this, function(c) {
                    c.results && c.results.length ? a.geometry && !isNaN(a.geometry.x) && !isNaN(a.geometry.y) &&
                        this.map.spatialReference.wkid === a.geometry.spatialReference.wkid ? (c.results[0].feature.geometry = a.geometry, b.resolve(c.results[0])) : !c.results[0].feature.geometry || isNaN(c.results[0].feature.geometry.x) || isNaN(c.results[0].feature.geometry.y) ? (this._resultError(h.widgets.directions.error.locator), b.reject(h.widgets.directions.error.locator)) : b.resolve(c.results[0]) : (this._resultError(h.widgets.directions.error.locator), b.reject(h.widgets.directions.error.locator))
                }), d.hitch(this, function() {
                    this._resultError(h.widgets.directions.error.locator);
                    b.reject(h.widgets.directions.error.locator)
                })) : (this._resultError(h.widgets.directions.error.locatorUndefined), b.reject(h.widgets.directions.error.locatorUndefined))) : b.resolve(f);
                return b.promise
            },
            _updateStopInsert: function(a, b) {
                this.get("geocoders")[b] && (this.get("geocoders")[b].set("value", a.name), this.stops[b] = a, this._setStops())
            },
            _updateStop: function(a, b) {
                var c = new l;
                this.stops ? ("undefined" === typeof b && (b = this.stops.length - 1), this._getCandidate(a).then(d.hitch(this, function(a) {
                    this._updateStopInsert(a,
                        b);
                    c.resolve(a)
                }), d.hitch(this, function(a) {
                    c.reject(a)
                }))) : c.reject("could not update stop");
                return c.promise
            },
            _renderDirections: function() {
                var a = this.get("directions"),
                    b = "";
                if (this._resultsNode) {
                    b += '\x3cdiv class\x3d"' + this._css.resultsRouteNameClass + '"\x3e';
                    b += a.routeName;
                    b += "\x3c/div\x3e";
                    b += '\x3cdiv class\x3d"' + this._css.clearClass + '"\x3e\x3c/div\x3e';
                    if (a.totalLength || a.totalTime) {
                        var c = this._formatDistance(a.totalLength, h.widgets.directions.units[this._getUnits(this.get("directionsLengthUnits"))].name),
                            f = this._formatTime(a.totalTime),
                            b = b + ('\x3cdiv class\x3d"' + this._css.resultsSummaryClass + '"\x3e');
                        c && (b += c);
                        c && f && (b += " \x26middot; ");
                        f && (b += f);
                        b += "\x3c/div\x3e"
                    }
                    b += '\x3cdiv class\x3d"' + this._css.clearClass + '"\x3e\x3c/div\x3e';
                    b += '\x3cdiv class\x3d"' + this._css.resultsRouteButtonContainerClass + '"\x3e';
                    b += '\x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"' + this._css.linkButtonClass + " " + this._css.resultsViewFullRouteClass + '" data-full-route\x3d"true"\x3e' + h.widgets.directions.viewFullRoute + "\x3c/div\x3e";
                    this.get("showPrintPage") && (b += '\x3cdiv tabindex\x3d"0" role\x3d"button" title\x3d"' + h.widgets.directions.print + '" class\x3d"' + this._css.resultsPrintClass + '" data-print-directions\x3d"true"\x3e\x3c/div\x3e');
                    var b = b + ('\x3cdiv class\x3d"' + this._css.clearClass + '"\x3e\x3c/div\x3e'),
                        b = b + "\x3c/div\x3e",
                        b = b + ('\x3cdiv class\x3d"' + this._css.routesClass + '"\x3e'),
                        b = b + ('\x3ctable summary\x3d"' + a.routeName + '"\x3e'),
                        b = b + '\x3ctbody role\x3d"menu"\x3e',
                        e = 0;
                    q.forEach(a.features, d.hitch(this, function(c, d) {
                        var f = this._css.routeClass;
                        c.attributes && (c.attributes.step = d + 1);
                        c.attributes.maneuverType && (f += " " + c.attributes.maneuverType);
                        if (0 === d || this._startReturn && d + 1 === a.features.length) f += " " + this._css.routeOriginClass;
                        else if (d === a.features.length - 1 || this.get("stops").length - 1 === e && ("esriDMTStop" === c.attributes.maneuverType || "esriDMTDepart" === c.attributes.maneuverType)) f += " " + this._css.routeDestinationClass;
                        a.features.length === d + 1 && (f += " " + this._css.routeLastClass);
                        b += '\x3ctr tabindex\x3d"0" role\x3d"menuitem" class\x3d"' + f + " " +
                            this._css.routeZoomClass + '" data-segment\x3d"' + d + '"\x3e';
                        b += '\x3ctd class\x3d"' + this._css.routeIconColumnClass + '"\x3e';
                        b += '\x3cdiv class\x3d"' + this._css.routeIconClass + '"\x3e';
                        0 === d ? (b += this._getLetter(e), e++) : "esriDMTStop" === c.attributes.maneuverType ? b = this._startReturn && d + 1 === a.features.length ? b + this._getLetter(0) : b + this._getLetter(e) : "esriDMTDepart" === c.attributes.maneuverType && (b += this._getLetter(e), e++);
                        b += "\x3c/div\x3e";
                        b += "\x3c/td\x3e";
                        b += '\x3ctd class\x3d"' + this._css.routeTextColumnClass +
                            '"\x3e';
                        b += '\x3cdiv class\x3d"' + this._css.routeInfoClass + '"\x3e';
                        b += '\x3cdiv class\x3d"' + this._css.routeTextClass + '"\x3e';
                        var f = a.strings[d],
                            g;
                        if (f) {
                            var k = c.attributes.text;
                            for (g = 0; g < f.length; g++) k = this._boldText(k, f[g].string);
                            c.attributes.formattedText = k
                        } else c.attributes.formattedText = c.attributes.text;
                        b += "\x3cstrong\x3e" + B.format(c.attributes.step) + ".\x3c/strong\x3e " + c.attributes.formattedText;
                        b += "\x3c/div\x3e";
                        f = this._formatDistance(c.attributes.length, h.widgets.directions.units[this._getUnits(this.get("directionsLengthUnits"))].abbr);
                        g = this._formatTime(c.attributes.time);
                        f && (b += '\x3cdiv class\x3d"' + this._css.routeLengthClass + '"\x3e', b += f, g && (b += " " + g), b += "\x3c/div\x3e");
                        b += "\x3c/div\x3e";
                        b += "\x3c/td\x3e";
                        b += "\x3c/tr\x3e"
                    }));
                    b += "\x3c/tbody\x3e";
                    b += "\x3c/table\x3e";
                    b += "\x3c/div\x3e";
                    this._resultsNode && (this._resultsNode.innerHTML = b);
                    this._disconnectResults();
                    (c = v("[data-segment]", this._resultsNode)) && c.length && q.forEach(c, d.hitch(this, function(b) {
                        var c = g(b, D.enter, d.hitch(this, function() {
                            var c = parseInt(s.get(b, "data-segment"), 10);
                            this.highlightSegment(c);
                            this.onSegmentHighlight(a.features[c])
                        }));
                        this._resultEvents.push(c);
                        c = g(b, "focusin", d.hitch(this, function() {
                            var c = parseInt(s.get(b, "data-segment"), 10);
                            this.highlightSegment(c);
                            this.onSegmentHighlight(a.features[c])
                        }));
                        this._resultEvents.push(c);
                        c = g(b, "focusout", d.hitch(this, function() {
                            this.unhighlightSegment()
                        }));
                        this._resultEvents.push(c);
                        c = g(b, D.leave, d.hitch(this, function() {
                            this.unhighlightSegment()
                        }));
                        this._resultEvents.push(c);
                        this.get("autoCenterAtSegmentStart") && (c =
                            g(b, "click, keydown", d.hitch(this, function(c) {
                                if (c && ("click" === c.type || "keydown" === c.type && c.keyCode === y.ENTER)) c = parseInt(s.get(b, "data-segment"), 10), this.centerAtSegmentStart(c), this.onSegmentSelect(a.features[c])
                            })), this._resultEvents.push(c))
                    }))
                }
            },
            _showRoute: function(a) {
                if (!this._moveInProgress) {
                    this.editToolbar.deactivate();
                    this._clearDisplayAfterSolve();
                    this.set("solveResult", a);
                    var b = a.routeResults[0].directions;
                    this.set("directions", b);
                    var c = a.routeResults[0].stops;
                    if (c && c.length) {
                        var f = [],
                            e, h = c.length;
                        this._startReturn && h--;
                        for (e = 0; e < h; e++) {
                            var g = c[e],
                                g = {
                                    extent: new T({
                                        xmin: g.geometry.x - 0.25,
                                        ymin: g.geometry.y - 0.25,
                                        xmax: g.geometry.x + 0.25,
                                        ymax: g.geometry.y + 0.25,
                                        spatialReference: g.geometry.spatialReference
                                    }),
                                    feature: g,
                                    name: g.attributes.Name
                                };
                            f.push(g)
                        }
                        this.stops = f;
                        for (e = 0; e < this.stops.length; e++) this._updateStop(this.stops[e], e);
                        this._setStops()
                    }
                    this.set("mergedRouteGraphic", new w(b.mergedGeometry, this.get("routeSymbol")));
                    if (this.get("map") && this.get("map").graphics) {
                        var k = [];
                        q.forEach(b.features,
                            d.hitch(this, function(a, b) {
                                a.setSymbol(this.get("routeSymbol"));
                                this.get("map").graphics.add(a);
                                k.push(a);
                                var c = a.getDojoShape();
                                c && c.moveToBack()
                            }));
                        this.set("displayedRouteGraphics", k)
                    }
                    this.createRouteSymbols();
                    this._renderDirections();
                    this.onDirectionsFinish(a)
                }
            },
            _setGeocodersStopReference: function() {
                if (this.geocoders)
                    for (var a = 0; a < this.geocoders.length; a++) this.geocoders[a] && this.stops[a] && (this.geocoders[a][this._stopReference] = this.stops[a])
            },
            _setStops: function() {
                this._setGeocodersStopReference();
                this.createRouteSymbols();
                this._set("stops", this.stops);
                this.onStopsUpdate(this.stops)
            },
            _getCandidates: function(a) {
                var b = [];
                if (a && a.length) {
                    for (var c = 0; c < a.length; c++) b.push(this._getCandidate(a[c]));
                    return G(b)
                }
                a = new l;
                a.resolve([]);
                return a.promise
            },
            _clearResultsHTML: function() {
                this._resultsNode && (this._resultsNode.innerHTML = "")
            },
            _showSegmentPopup: function(a) {
                if (a && this.get("showSegmentPopup") && this.get("map") && this.get("map").infoWindow) {
                    var b = a.geometry.getPoint(0, 0);
                    a = new w(b, null, a.attributes,
                        this.get("segmentInfoTemplate"));
                    this.get("map").infoWindow.setFeatures([a]);
                    this.get("map").infoWindow.show(b)
                }
            },
            _removeStopButton: function(a) {
                this.stops.length > this.get("minStops") ? this.removeStop(a) : (this._setStops(), this._clearDisplayBeforeSolve(), this._clearDisplayAfterSolve())
            },
            _addStopButton: function() {
                this.addStop(void 0, this.stops.length)
            },
            _sortGeocoders: function() {
                var a = this._dnd.getAllNodes();
                this.geocoders.sort(d.hitch(this, function(b, c) {
                    return this._sortGeocodersToNodes(b, c, a, this._sortId)
                }));
                this._sortStops()
            },
            _disconnectResults: function() {
                if (this._resultEvents && this._resultEvents.length)
                    for (var a = 0; a < this._resultEvents.length; a++) this._resultEvents[a] && this._resultEvents[a].remove();
                this._resultEvents = []
            },
            _formatTime: function(a) {
                var b, c = "";
                b = Math.round(a);
                a = Math.floor(b / 60);
                b = Math.floor(b % 60);
                a && (c += a + " ", c = 1 < a ? c + h.widgets.directions.time.hours : c + h.widgets.directions.time.hour);
                a && b && (c += " ");
                b && (c += b + " ", c = 1 < b ? c + h.widgets.directions.time.minutes : c + h.widgets.directions.time.minute);
                return c
            },
            _formatDistance: function(a, b) {
                var c = Math.round(100 * a) / 100;
                return 0 === c ? "" : B.format(c) + " " + b
            },
            _setMoveSymbol: function(a) {
                this._moveSymbolSet = !0;
                var b = this._setStopSymbol(a._index, this.stopGraphics.length, !0);
                a.setSymbol(b)
            },
            _unsetMoveSymbol: function(a) {
                var b = this._setStopSymbol(a._index, this.stopGraphics.length);
                a.setSymbol(b);
                this._moveSymbolSet = !1
            },
            _removeTextGraphic: function(a) {
                a = this.textGraphics[a];
                this.get("map").graphics.remove(a)
            },
            _setDraggableObject: function(a) {
                a._drag && (this.get("map") &&
                    this.get("map").graphics) && (this.get("map")._directionsWidgetDragging = !0, this._removeTextGraphic(a._index), this._dragGraphic = a, this._dragGeometry = a.geometry, this.editToolbar.activate(K.MOVE, a))
            },
            _setTextGraphic: function(a) {
                if (a._drag && this.get("map") && this.get("map").graphics) {
                    var b = this.textGraphics[a._index];
                    b.setGeometry(a.geometry);
                    this.get("map").graphics.add(b);
                    (a = b.getDojoShape()) && a.moveToFront()
                }
            },
            _unsetDraggableObject: function(a) {
                a._drag && (this.get("map")._directionsWidgetDragging = !1, this._moveSymbolSet &&
                    this._unsetMoveSymbol(a), this._setTextGraphic(a), this.editToolbar.deactivate())
            },
            _isMyStopGraphic: function(a) {
                return -1 < q.indexOf(this.get("stopGraphics"), a) || -1 < q.indexOf(this.get("textGraphics"), a)
            },
            _editToolbar: function() {
                this.get("map") ? this.set("editToolbar", new K(this.get("map"))) : this.set("editToolbar", null)
            },
            _destroyGlobalGeocoder: function() {
                this._globalGeocoder && (this._globalGeocoder.destroy(), this._globalGeocoder = null)
            },
            _createGlobalGeocoder: function() {
                var a = new l;
                this._globalGeocoder = new F(this.get("geocoderOptions"),
                    r.create("div"));
                g.once(this._globalGeocoder, "load", d.hitch(this, function() {
                    a.resolve()
                }, function(b) {
                    a.reject(b)
                }));
                this._globalGeocoder.startup();
                return a.promise
            },
            _init: function() {
                if (this.get("map"))
                    if (this.get("map").loaded) this._configure();
                    else g.once(this.get("map"), "load", d.hitch(this, function() {
                        this._configure()
                    }));
                else this._configure()
            },
            _setDefaultStops: function() {
                var a = new l;
                this.defaults.stops && this.defaults.stops.length ? this._updateStops(this.defaults.stops).then(d.hitch(this, function() {
                    this.get("focusOnNewStop") &&
                        (this.get("geocoders") && this.get("geocoders").length) && this.get("geocoders")[0].focus();
                    this._removeEmptyStops();
                    a.resolve()
                }), a.reject) : a.resolve();
                return a.promise
            },
            _configure: function() {
                this._createDnD();
                this._setGeocoderOptions();
                this._createGlobalGeocoder().then(d.hitch(this, function() {
                    this._editToolbar();
                    this._enqueue(d.hitch(this, function() {
                        var a = new l,
                            b = [this._createRouteTask(), this._setDefaultStops()];
                        G(b).then(d.hitch(this, function() {
                            this._setDefaultUnits();
                            this._setTrafficOptions();
                            this._setMenuNodeValues();
                            this._setupEvents();
                            this._stopsReady = !0;
                            this.set("loaded", !0);
                            this.onLoad();
                            a.resolve(!0)
                        }), function(b) {
                            a.reject(b)
                        });
                        return a.promise
                    }))
                }))
            },
            _calculateValidStops: function() {
                for (var a = 0, b = this.stops, c = 0; c < b.length; c++) b[c] && b[c].name && a++;
                return a
            },
            _setStopSymbol: function(a, b, c) {
                return 0 === a ? c && this.get("fromSymbolDrag") ? this.get("fromSymbolDrag") : this.get("fromSymbol") : a === b - 1 ? c && this.get("toSymbolDrag") ? this.get("toSymbolDrag") : this.get("toSymbol") : c && this.get("stopSymbolDrag") ? this.get("stopSymbolDrag") :
                    this.get("stopSymbol")
            },
            _addTrafficLayer: function() {
                var a = this.get("trafficLayer"),
                    b = this.get("map");
                b && (a && !this._trafficLayerAdded) && (b.addLayer(a), a.show(), this._trafficLayerAdded = !0)
            },
            _toggleUnits: function(a) {
                a.target === this._useMilesNode ? this.setDirectionsLengthUnits(n.MILES) : a.target === this._useKilometersNode && this.setDirectionsLengthUnits(n.KILOMETERS)
            },
            _toggleTravelModeImpedance: function(a) {
                k.add(a.target, this._css.stopsPressedButtonClass);
                a.target === this._useTravelModeTimeNode ? k.remove(this._useTravelModeDistanceNode,
                    this._css.stopsPressedButtonClass) : a.target === this._useTravelModeDistanceNode && k.remove(this._useTravelModeTimeNode, this._css.stopsPressedButtonClass);
                this._travelModeImpedanceKey = a.target.attributes["travel-mode-key"].value;
                this.setTravelMode(this._travelModeKey + " " + this._travelModeImpedanceKey)
            },
            _toggleTravelMode: function(a) {
                k.add(a.target, this._css.stopsPressedButtonClass);
                a.target === this._useTravelModeCarNode ? (k.remove(this._useTravelModeTruckNode, this._css.stopsPressedButtonClass), k.remove(this._useTravelModeWalkingNode,
                    this._css.stopsPressedButtonClass)) : a.target === this._useTravelModeTruckNode ? (k.remove(this._useTravelModeCarNode, this._css.stopsPressedButtonClass), k.remove(this._useTravelModeWalkingNode, this._css.stopsPressedButtonClass)) : a.target === this._useTravelModeWalkingNode && (k.remove(this._useTravelModeCarNode, this._css.stopsPressedButtonClass), k.remove(this._useTravelModeTruckNode, this._css.stopsPressedButtonClass));
                this._travelModeKey = a.target.attributes["travel-mode-key"].value;
                this.setTravelMode(this._travelModeKey +
                    " " + this._travelModeImpedanceKey)
            },
            _toggleCheckbox: function(a) {
                var b = s.get(a.target, "checked");
                a.target === this._findOptimalOrderNode ? this.set("optimalRoute", b) : a.target === this._useTrafficNode ? this.set("traffic", b) : a.target === this._returnToStartNode && this.set("returnToStart", b)
            },
            _configureRouteOptions: function() {
                var a = this.get("routeParams");
                a.directionsLengthUnits = this.get("directionsLengthUnits");
                a.findBestSequence = this.get("optimalRoute");
                a.returnStops = a.findBestSequence ? !0 : !1;
                this.get("traffic") ?
                    (a.startTime = new Date, a.startTimeIsUTC = !0, this._addTrafficLayer()) : (a.startTime = null, a.startTimeIsUTC = null, this._removeTrafficLayer());
                if (this.get("returnToStart") && this.stopGraphics.length) {
                    var b = new w(this.stopGraphics[0].geometry, null, this.stopGraphics[0].attributes),
                        c = this.stopGraphics.slice(0);
                    this._startReturn = b;
                    c.push(b);
                    a.stops.features = c
                } else this._startReturn = null, a.stops.features = this.stopGraphics;
                this.set("routeParams", a)
            },
            _configureRoute: function(a) {
                this.createRouteSymbols();
                this._configureRouteOptions();
                this.routeTask.solve(this.routeParams, d.hitch(this, function(b) {
                    this._showRoute(b);
                    a.resolve(b)
                }), d.hitch(this, function(b) {
                    this.set("directions", null);
                    this._clearDisplayAfterSolve();
                    this.createRouteSymbols();
                    this._routeTaskError(b);
                    a.reject(b)
                }))
            },
            _boldText: function(a, b) {
                return a.replace(RegExp("(^|\\s)(" + b + ")(\\s|$)", "ig"), "$1\x3cstrong\x3e$2\x3c/strong\x3e$3")
            },
            _clearStopGraphics: function() {
                if (this.stopGraphics && this.stopGraphics.length && this.get("map") && this.get("map").graphics)
                    for (var a = 0; a < this.stopGraphics.length; a++) this.get("map").graphics.remove(this.stopGraphics[a]),
                        this.get("map").graphics.remove(this.textGraphics[a]);
                this.set("stopGraphics", []);
                this.set("textGraphics", [])
            },
            _clearRouteGraphics: function() {
                var a = this.get("displayedRouteGraphics"),
                    b = this.get("map");
                a && (a.length && b && b.graphics) && (q.forEach(a, function(a) {
                    b.graphics.remove(a)
                }), this.set("displayedRouteGraphics", []));
                this.unhighlightSegment()
            },
            _clearInfoWindow: function() {
                this.get("map") && this.get("map").infoWindow && (this.get("map").infoWindow.hide(), this.get("map").infoWindow.features && this.get("map").infoWindow.clearFeatures())
            },
            _clearDisplayBeforeSolve: function() {
                this._clearInfoWindow();
                this._clearResultsHTML()
            },
            _clearDisplayAfterSolve: function() {
                this._clearStopGraphics();
                this._clearRouteGraphics();
                this.clearErrors()
            },
            _getLetter: function(a) {
                var b = this.get("alphabet"),
                    c = "";
                b && b.length && (a = a || 0, a >= b.length && (c = this._getLetter(Math.floor(a / this.alphabet.length) - 1), a %= this.alphabet.length), "string" === typeof b ? c += b.substr(a, 1) : b instanceof Array && (c += b[a]));
                return c
            },
            _solveAndZoom: function() {
                if (this.get("autoSolve")) return this.getDirections().then(d.hitch(this,
                    function() {
                        this.zoomToFullRoute()
                    }));
                var a = new l;
                a.resolve();
                return a.promise
            },
            _setupEvents: function() {
                var a = g(this._dndNode, "[data-reverse-stops]:click, [data-reverse-stops]:keydown", d.hitch(this, function(a) {
                    a && ("click" === a.type || "keydown" === a.type && a.keyCode === y.ENTER) && this._reverseStops()
                }));
                this._onEvents.push(a);
                a = g(this._resultsNode, "[data-print-directions]:click, [data-print-directions]:keydown", d.hitch(this, function(a) {
                    a && ("click" === a.type || "keydown" === a.type && a.keyCode === y.ENTER) && this._printDirections()
                }));
                this._onEvents.push(a);
                a = g(this._resultsNode, "[data-full-route]:click, [data-full-route]:keydown", d.hitch(this, function(a) {
                    a && ("click" === a.type || "keydown" === a.type && a.keyCode === y.ENTER) && this.zoomToFullRoute()
                }));
                this._onEvents.push(a);
                a = g(this._dndNode, "[data-remove]:click, [data-remove]:keydown", d.hitch(this, function(a) {
                    if (a && ("click" === a.type || "keydown" === a.type && a.keyCode === y.ENTER)) {
                        var c = v("[data-remove]", this._dndNode);
                        a = q.indexOf(c, a.target);
                        this._removeStopButton(a)
                    }
                }));
                this._onEvents.push(a);
                a = g(this._dnd, "Drop", d.hitch(this, function() {
                    this._dnd.sync();
                    this._sortGeocoders();
                    this.setListIcons();
                    this._calculateValidStops() === this.get("geocoders").length && this.get("routeParams").stops.features.length && this._solveAndZoom()
                }));
                this._onEvents.push(a);
                a = g(this._dnd, "DndStart", d.hitch(this, function() {
                    var a = v("body")[0];
                    k.add(a, this._css.dndDragBodyClass)
                }));
                this._onEvents.push(a);
                a = g(this._dnd, "DndDrop, DndCancel", d.hitch(this, function() {
                    var a = v("body")[0];
                    k.remove(a, this._css.dndDragBodyClass)
                }));
                this._onEvents.push(a);
                this.get("map") && this.get("map").graphics && (a = this.get("map").graphics.on("mouse-over", d.hitch(this, function(a) {
                    if (this.get("dragging") && !this.get("map")._directionsWidgetDragging) {
                        var c;
                        this._isMyStopGraphic(a.graphic) && (a.graphic._drag ? (c = this.editToolbar.getCurrentState(), c.graphic || this._setDraggableObject(a.graphic), this._moveSymbolSet || this._setMoveSymbol(a.graphic)) : a.graphic._textGraphic && (c = this.editToolbar.getCurrentState(), this.stopGraphics[a.graphic._index] && (c.graphic ||
                            this._setDraggableObject(this.stopGraphics[a.graphic._index]), this._moveSymbolSet || this._setMoveSymbol(this.stopGraphics[a.graphic._index]))))
                    }
                })), this._onEvents.push(a), a = this.get("map").graphics.on("mouse-out", d.hitch(this, function(a) {
                    this.get("dragging") && this._isMyStopGraphic(a.graphic) && !this._moveInProgress && a.graphic._drag && this._unsetDraggableObject(a.graphic)
                })), this._onEvents.push(a), this._editToolbarEvents());
                a = this.watch("theme", this._updateThemeWatch);
                this._watchEvents.push(a);
                a = this.watch("canModifyStops",
                    this._updateCanModifyStops);
                this._watchEvents.push(a);
                a = this.watch("showReturnToStartOption", this._optionsMenu);
                this._watchEvents.push(a);
                a = this.watch("showOptimalRouteOption", this._optionsMenu);
                this._watchEvents.push(a);
                a = this.watch("returnToStart", this._setMenuNodeValues);
                this._watchEvents.push(a);
                a = this.watch("optimalRoute", this._setMenuNodeValues);
                this._watchEvents.push(a);
                a = this.watch("routeTaskUrl", d.hitch(this, function() {
                    this._createRouteTask();
                    this._setTrafficOptions()
                }));
                this._watchEvents.push(a);
                a = this.watch("routeParams", d.hitch(this, function() {
                    this._createRouteParams();
                    this._setDefaultUnits()
                }));
                this._watchEvents.push(a);
                a = this.watch("geocoderOptions", d.hitch(this, function() {
                    this._setGeocoderOptions();
                    this._createGlobalGeocoder()
                }));
                this._watchEvents.push(a);
                a = this.watch("showReverseStopsButton", this.setListIcons);
                this._watchEvents.push(a);
                a = this.watch("showPrintPage", this._renderDirections);
                this._watchEvents.push(a);
                a = this.watch("trafficLayer", this._trafficLayerUpdate);
                this._watchEvents.push(a);
                a = this.watch("editToolbar", this._editToolbarEvents);
                this._watchEvents.push(a);
                a = this.watch("showTravelModesOption", this._showTravelModesOption);
                this._watchEvents.push(a);
                a = this.watch("showMilesKilometersOption", this._showMilesKilometersOption);
                this._watchEvents.push(a);
                a = this.watch("showClearButton", this._showClearButton);
                this._watchEvents.push(a);
                a = this.watch("directionsLengthUnits", this.setDirectionsLengthUnits);
                this._watchEvents.push(a)
            },
            _editToolbarEvents: function() {
                var a = g(this.editToolbar, "graphic-click",
                    d.hitch(this, function(a) {
                        this.get("map") && this.get("map").infoWindow && (this.get("map").infoWindow.setFeatures([a.graphic]), this.get("map").infoWindow.show(a.graphic.geometry))
                    }));
                this._onEvents.push(a);
                a = g(this.editToolbar, "graphic-first-move", d.hitch(this, function() {
                    this._moveInProgress = !0
                }));
                this._onEvents.push(a);
                a = g(this.editToolbar, "graphic-move-stop", d.hitch(this, function(a) {
                    this._moveInProgress = !1;
                    this._unsetDraggableObject(a.graphic);
                    if (this._dragGeometry !== a.graphic.geometry) {
                        this._currentEditableGraphic =
                            a.graphic;
                        if (this.get("autoSolve")) this.onDirectionsStart();
                        this._globalGeocoder.find(a.graphic.geometry).then(d.hitch(this, function(a) {
                            a && a.results.length ? this._setReverseGeocode(a.results[0], a.geometry) : this._reverseGeocodeError(Error(h.widgets.directions.error.locator))
                        }), d.hitch(this, function(a) {
                            this._reverseGeocodeError(a)
                        }))
                    }
                }));
                this._onEvents.push(a)
            },
            _trafficLayerUpdate: function(a, b, c) {
                a = this.get("map");
                b && (a && this._trafficLayerAdded) && (a.removeLayer(b), this._trafficLayerAdded = !1);
                c && (a &&
                    this.get("traffic") && !this._trafficLayerAdded) && (a.addLayer(c), c.show(), this._trafficLayerAdded = !0)
            },
            _reverseGeocodeError: function(a) {
                this.onDirectionsFinish(a);
                a = h.widgets.directions.error.locator;
                this._resultError(a);
                this._clearRouteGraphics();
                this._currentEditableGraphic.setAttributes({
                    error: a
                });
                this._updateStop({
                    name: ""
                }, this._currentEditableGraphic._index)
            },
            _routeTaskError: function(a) {
                var b = h.widgets.directions.error.routeTask,
                    c = a.details;
                c && 1 === c.length && ("The distance between any inputs must be less than 50 miles (80 kilometers) when walking." ===
                    c[0] ? b = h.widgets.directions.error.maxWalkingDistance : "Driving a truck is currently not supported outside of North America and Central America." === c[0] && (b = h.widgets.directions.error.nonNAmTruckingMode));
                this._resultError(b);
                this.onDirectionsFinish(a)
            },
            _resultError: function(a) {
                var b = "";
                this.errors.push(a);
                b += '\x3cdiv class\x3d"' + this._css.routesErrorClass + '"\x3e';
                if (this.errors.length) {
                    for (var b = b + "\x3cul\x3e", c = 0; c < this.errors.length; c++) b += "\x3cli\x3e" + this.errors[c] + "\x3c/li\x3e";
                    b += "\x3c/ul\x3e"
                }
                b +=
                    "\x3c/div\x3e";
                this._errorNode && (this._errorNode.innerHTML = b);
                this.onError(a)
            },
            _getUnits: function(a) {
                switch (a) {
                    case n.KILOMETERS:
                        return "KILOMETERS";
                    case n.METERS:
                        return "METERS";
                    case n.NAUTICAL_MILES:
                        return "NAUTICAL_MILES";
                    default:
                        return "MILES"
                }
            },
            _createRouteTask: function() {
                this.set("routeTask", new Y(this.get("routeTaskUrl")));
                var a = new l; - 1 < this.routeTaskUrl.indexOf(this._agolRouteUrlSuffix) && this._setTravelModeComponentsVisibility(!0);
                $({
                    url: this.get("routeTask").url,
                    content: {
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                }).then(d.hitch(this, function(b) {
                    if (b.networkDataset) {
                        this.set("serviceDescription", b);
                        this._showTravelModesOption();
                        if (this._hasAGOLTravelModes) {
                            var c = this.getSupportedTravelModeNames(),
                                c = this.travelModeName && c.length && -1 < q.indexOf(c, this.travelModeName) ? this.travelModeName : this._tmDrivingTime,
                                d = c.split(" ");
                            this._travelModeKey = d[0];
                            this._travelModeImpedanceKey = d[1];
                            this.setTravelMode(c)
                        }
                        b.serviceLimits && b.serviceLimits.Route_MaxStops && this.set("maxStops", b.serviceLimits.Route_MaxStops);
                        a.resolve()
                    } else this._resultError(h.widgets.directions.error.cantFindRouteServiceDescription), a.reject(h.widgets.directions.error.cantFindRouteServiceDescription)
                }), d.hitch(this, function(b) {
                    this._resultError(h.widgets.directions.error.cantFindRouteServiceDescription);
                    a.reject(h.widgets.directions.error.cantFindRouteServiceDescription)
                }));
                this._createRouteParams();
                return a.promise
            },
            _showTravelModesOption: function() {
                var a = this.get("serviceDescription"),
                    b = !this.showTravelModesOption || !a;
                if (a) {
                    this._hasAGOLTravelModes =
                        (a = a.supportedTravelModes) && a.length ? !0 : !1;
                    var c = {};
                    c[this._tmDrivingTime] = null;
                    c[this._tmTruckingTime] = null;
                    c[this._tmWalkingTime] = null;
                    c[this._tmDrivingDistance] = null;
                    c[this._tmTruckingDistance] = null;
                    c[this._tmWalkingDistance] = null;
                    if (this._hasAGOLTravelModes)
                        for (var d in c)
                            if (c.hasOwnProperty(d)) {
                                for (var e = !1, g = 0; g < a.length; g++)
                                    if (a[g].name === d) {
                                        c[d] = a[g].itemId;
                                        a[g]._nodeTravelMode = -1 < d.indexOf("Driving") ? this._useTravelModeCarNode : -1 < d.indexOf("Trucking") ? this._useTravelModeTruckNode : this._useTravelModeWalkingNode;
                                        a[g]._nodeImpedance = -1 < d.indexOf("Time") ? this._useTravelModeTimeNode : this._useTravelModeDistanceNode;
                                        e = !0;
                                        break
                                    }
                                if (!e) {
                                    this._hasAGOLTravelModes = !1;
                                    break
                                }
                            }
                    b = b || !this._hasAGOLTravelModes;
                    this.showTravelModesOption = this.showTravelModesOption && this._hasAGOLTravelModes
                }
                this._setTravelModeComponentsVisibility(!b)
            },
            _setTravelModeComponentsVisibility: function(a) {
                m.set(this._travelModeContainerNode, "display", a ? "block" : "none");
                m.set(this._travelModeImpedanceNode, "display", a ? "block" : "none");
                m.set(this._useTravelModeTruckNode,
                    "display", this.hideTruckingMode ? "none" : "block");
                m.set(this._travelModeImpedanceNode, "display", this.hideFastestShortestOption ? "none" : "block")
            },
            _showMilesKilometersOption: function() {
                m.set(this._travelModeDistanceUnitsNode, "display", this.showMilesKilometersOption ? "block" : "none")
            },
            _showClearButton: function() {
                m.set(this._clearDirectionsButtonNode, "display", this.showClearButton ? "inline-block" : "none")
            },
            _createRouteParams: function() {
                var a = {
                    directionsOutputType: "complete",
                    stops: new X,
                    returnDirections: !0,
                    doNotLocateOnRestrictedElements: !0
                };
                this.get("map") ? a.outSpatialReference = this.get("map").spatialReference : a.outSpatialReference = this._defaultSR;
                this.get("routeParams") || (this.routeParams = {});
                var b = new Z;
                this.routeParams = d.mixin(b, {
                    returnRoutes: !1
                }, this.get("routeParams"), a)
            },
            _reverseStops: function() {
                var a = this._dnd.getAllNodes();
                a.length && (a.reverse(), this._dnd.clearItems(), this._dnd.insertNodes(!1, a), this._dnd.sync(), this._stopsRemovable(), this._optionsMenu(), this._checkMaxStops(), this.setListIcons(), this._sortGeocoders(), this._solveAndZoom())
            },
            _sortGeocodersToNodes: function(a, b, c, d) {
                b = b[d];
                a = E.byId(a[d]);
                d = E.byId(b);
                a = q.indexOf(c, a);
                d = q.indexOf(c, d);
                for (b = 0; b < c.length; b++) {
                    if (b === a) return -1;
                    if (b === d) return 1
                }
            },
            _setMenuNodeValues: function() {
                var a = this.get("optimalRoute");
                this._findOptimalOrderNode && s.set(this._findOptimalOrderNode, "checked", a);
                a = this.get("returnToStart");
                this._returnToStartNode && s.set(this._returnToStartNode, "checked", a);
                a = this.get("traffic");
                this._useTrafficNode && s.set(this._useTrafficNode, "checked", a);
                switch (this.get("directionsLengthUnits")) {
                    case n.KILOMETERS:
                        s.set(this._useKilometersNode,
                            "checked", !0);
                        s.set(this._useMilesNode, "checked", !1);
                        break;
                    case n.MILES:
                        s.set(this._useKilometersNode, "checked", !1), s.set(this._useMilesNode, "checked", !0)
                }
                this._showMilesKilometersOption();
                this._showClearButton()
            },
            _optionsMenu: function() {
                this._useTrafficItemNode && (this.get("showTrafficOption") ? m.set(this._useTrafficItemNode, "display", "block") : m.set(this._useTrafficItemNode, "display", "none"));
                this._returnToStartItemNode && (this.get("showReturnToStartOption") ? m.set(this._returnToStartItemNode, "display",
                    "block") : m.set(this._returnToStartItemNode, "display", "none"));
                this._findOptimalOrderItemNode && (this.get("showOptimalRouteOption") && 4 <= this.stops.length ? m.set(this._findOptimalOrderItemNode, "display", "block") : m.set(this._findOptimalOrderItemNode, "display", "none"));
                this.stops.length >= this.get("minStops") ? k.add(this._widgetContainer, this._css.stopsOptionsOptionsEnabledClass) : (k.remove(this._widgetContainer, this._css.stopsOptionsOptionsEnabledClass), this._optionsMenuNode && "block" === m.get(this._optionsMenuNode,
                    "display") && this._toggleOptionsMenu(), this._configureRouteOptions())
            },
            _stopsRemovable: function() {
                this.get("geocoders").length > this.get("minStops") ? k.add(this._widgetContainer, this._css.stopsRemovableClass) : k.remove(this._widgetContainer, this._css.stopsRemovableClass)
            },
            _checkMaxStops: function() {
                this.stops.length < this.get("maxStops") ? (this._showAddDestination(), this.set("maxStopsReached", !1)) : (this._hideAddDestination(), this.set("maxStopsReached", !0))
            },
            _updateThemeWatch: function(a, b, c) {
                k.remove(this.domNode,
                    b);
                k.add(this.domNode, c)
            },
            _toggleOptionsMenu: function() {
                this._optionsMenuNode && ("block" === m.get(this._optionsMenuNode, "display") ? (m.set(this._optionsMenuNode, "display", "none"), this._optionsButtonNode.innerHTML = h.widgets.directions.showOptions) : (m.set(this._optionsMenuNode, "display", "block"), this._optionsButtonNode.innerHTML = h.widgets.directions.hideOptions))
            },
            _hideAddDestination: function() {
                k.remove(this._widgetContainer, this._css.addStopsClass)
            },
            _showAddDestination: function() {
                k.add(this._widgetContainer,
                    this._css.addStopsClass)
            },
            _getAbsoluteUrl: function() {
                var a = C.toUrl(".");
                if (/^https?\:/i.test(a)) return a;
                if (/^\/\//i.test(a)) return window.location.protocol + a;
                if (/^\//i.test(a)) return window.location.protocol + "//" + window.location.host + a
            },
            _getManeuverImage: function(a) {
                if (a) {
                    var b = this._getAbsoluteUrl() + "/images/Directions/maneuvers/";
                    return "esriDMTStop" === a || "esriDMTDepart" === a ? "" : b + a + ".png"
                }
                return ""
            },
            _loadPrintDirections: function() {
                var a = this.get("printTemplate");
                if (!a) {
                    var b = this._getAbsoluteUrl() +
                        "/css/Directions.css",
                        c = this._getAbsoluteUrl() + "/css/DirectionsPrint.css",
                        f = this._getAbsoluteUrl() + "/images/Directions/print-logo.png",
                        e;
                    e = N.isBodyLtr() ? "ltr" : "rtl";
                    var a = "",
                        a = a + "\x3c!DOCTYPE HTML\x3e",
                        a = a + ('\x3chtml lang\x3d"en" class\x3d"' + this.get("theme") + '" dir\x3d"' + e + '"\x3e'),
                        a = a + "\x3chead\x3e",
                        a = a + '\x3cmeta charset\x3d"utf-8"\x3e',
                        a = a + '\x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3dEdge,chrome\x3d1"\x3e',
                        a = a + ("\x3ctitle\x3e" + this.get("directions").routeName + "\x3c/title\x3e"),
                        a =
                        a + ('\x3clink rel\x3d"stylesheet" media\x3d"screen" type\x3d"text/css" href\x3d"' + b + '" /\x3e'),
                        a = a + ('\x3clink rel\x3d"stylesheet" media\x3d"print" type\x3d"text/css" href\x3d"' + c + '" /\x3e'),
                        a = a + "\x3c/head\x3e",
                        a = a + ('\x3cbody class\x3d"' + this._css.esriPrintPageClass + '"\x3e'),
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriPrintBarClass + '"\x3e'),
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriCloseButtonClass + '" title\x3d"' + h.common.close + '" onclick\x3d"window.close();"\x3e' + h.common.close + "\x3c/div\x3e"),
                        a = a + ('\x3cdiv id\x3d"printButton" class\x3d"' +
                            this._css.esriPrintButtonClass + '" title\x3d"' + h.widgets.directions.print + '" onclick\x3d"window.print();"\x3e' + h.widgets.directions.print + "\x3c/div\x3e"),
                        a = a + "\x3c/div\x3e",
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriPrintMainClass + '"\x3e'),
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriPrintHeaderClass + '"\x3e'),
                        a = a + ('\x3cimg class\x3d"' + this._css.esriPrintLogoClass + '" src\x3d"' + f + '" /\x3e'),
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriPrintNameClass + '"\x3e' + this.get("directions").routeName + "\x3c/div\x3e"),
                        a = a + ('\x3cdiv class\x3d"' +
                            this._css.esriPrintLengthClass + '"\x3e' + this._formatDistance(this.get("directions").totalLength, h.widgets.directions.units[this._getUnits(this.get("directionsLengthUnits"))].name) + ". " + this._formatTime(this.get("directions").totalTime) + "\x3c/div\x3e"),
                        a = a + '\x3cdiv id\x3d"print_helper"\x3e\x3c/div\x3e',
                        a = a + ('\x3ctextarea onkeyup\x3d"document.getElementById(\'print_helper\').innerHTML\x3dthis.value;" id\x3d"print_area" class\x3d"' + this._css.esriPrintNotesClass + '" placeholder\x3d"' + h.widgets.directions.printNotes +
                            '"\x3e\x3c/textarea\x3e'),
                        a = a + ('\x3cdiv class\x3d"' + this._css.clearClass + '"\x3e\x3c/div\x3e'),
                        a = a + "\x3c/div\x3e",
                        a = a + ('\x3cdiv class\x3d"' + this._css.esriPrintDirectionsClass + '"\x3e'),
                        a = a + "\x3ctable\x3e",
                        a = a + "\x3ctbody\x3e",
                        g = 0;
                    q.forEach(this.get("directions").features, d.hitch(this, function(b, c) {
                        var d = this.get("directions").strings[c],
                            e;
                        if (d) {
                            var f = b.attributes.text;
                            for (e = 0; e < d.length; e++) f = this._boldText(f, d[e].string);
                            b.attributes.formattedText = f
                        } else b.attributes.formattedText = b.attributes.text;
                        d = "";
                        this.get("directions").features.length === c + 1 && (d = this._css.routeLastClass);
                        b.attributes && (b.attributes.step = c + 1);
                        a += '\x3ctr class\x3d"' + d + '"\x3e';
                        a += '\x3ctd class\x3d"' + this._css.routeIconColumnClass + '"\x3e';
                        var d = this._getManeuverImage(b.attributes.maneuverType),
                            k;
                        0 === c ? (k = this._getLetter(g), g++) : "esriDMTStop" === b.attributes.maneuverType ? k = this._getLetter(g) : "esriDMTDepart" === b.attributes.maneuverType && (k = this._getLetter(g), g++);
                        d ? a += '\x3cimg src\x3d"' + d + '" /\x3e' : k && (a += '\x3cdiv class\x3d"' +
                            this._css.esriPrintStopLabelClass + '"\x3e', a += k, a += "\x3c/div\x3e");
                        a += "\x3c/td\x3e";
                        a += '\x3ctd class\x3d"' + this._css.routeTextColumnClass + '"\x3e';
                        a += "\x3cdiv\x3e\x3cstrong\x3e" + B.format(b.attributes.step) + ".\x3c/strong\x3e " + b.attributes.formattedText + "\x3c/div\x3e";
                        a += "\x3c/td\x3e";
                        a += '\x3ctd class\x3d"' + this._css.routeTextColumnClass + '"\x3e';
                        a += '\x3cdiv class\x3d"' + this._css.routeLengthClass + '"\x3e' + this._formatDistance(b.attributes.length, h.widgets.directions.units[this._getUnits(this.get("directionsLengthUnits"))].abbr) +
                            "\x3c/div\x3e";
                        a += "\x3c/td\x3e";
                        a += "\x3c/tr\x3e"
                    }));
                    a += "\x3c/tbody\x3e";
                    a += "\x3c/table\x3e";
                    a += "\x3c/div\x3e";
                    a += '\x3cdiv class\x3d"' + this._css.esriPrintFooterClass + '"\x3e';
                    a += "\x3cp\x3e" + h.widgets.directions.printDisclaimer + "\x3c/p\x3e";
                    a += "\x3c/div\x3e";
                    a += "\x3c/div\x3e";
                    a += "\x3c/body\x3e";
                    a += "\x3c/html\x3e"
                }
                this._printWindow.document.open("text/html", "replace");
                this._printWindow.document.write(a);
                this._printWindow.document.close()
            },
            _printDirections: function() {
                var a = screen.width / 2,
                    b = screen.height /
                    1.5,
                    a = "toolbar\x3dno, location\x3dno, directories\x3dno, status\x3dyes, menubar\x3dno, scrollbars\x3dyes, resizable\x3dyes, width\x3d" + a + ", height\x3d" + b + ", top\x3d" + (screen.height / 2 - b / 2) + ", left\x3d" + (screen.width / 2 - a / 2);
                this.get("printPage") ? (window.directions = this.get("directions"), window.open(this.get("printPage"), "directions_widget_print", a, !0)) : (this._printWindow = window.open("", "directions_widget_print", a, !0), this._loadPrintDirections())
            }
        })
    });