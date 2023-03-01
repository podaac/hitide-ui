/**
 * Scalebar that extends Scalebar and allows calculation of custom units rather than just km/m/mi
 *
 * @module jpl/dijit/ScaleBar
 **/

define([
    "dojo/_base/declare",
    "esri/dijit/Scalebar",
    "esri/geometry/Point",
    "jpl/data/ScaleBarUnits",
    "jpl/dijit/ui/ScaleBarDialog",
    "jpl/utils/LabelFormatter",
    "jpl/utils/MapUtil",
    "xstyle/css!./css/ScaleBar.css",
    "dojo/on",
    "dojo/_base/lang",
    "jpl/events/MapEvent",
    "jpl/config/Config",
    "dojo/topic"
], function(declare, Scalebar, Point, ScaleBarUnits, ScaleBarDialog, LabelFormatter, MapUtil, ScaleBarCSS, on,
            lang, MapEvent, Config, topic){
    return declare(Scalebar,{
        scaleBarUnits: null,
        scaleBarDialog: null,
        unitId: 0,
        scalebarAcb: null,

        startup: function(){
            this.inherited(arguments);

            this.config = Config.getInstance();

            on(this.metricScalebar, "click", lang.hitch(this, function(){
               this.showScaleBarDialog();
            }));

            topic.subscribe(MapEvent.prototype.CHANGE_SCALEBAR,  lang.hitch(this, this.changeScaleBarUnits));
        },

        //Scale bar overridden method which calculates and sets the bar and label on the scale;
        _drawScaleBar: function(a, c, b) {
            //Save a,c and b in case of a necessary forced redraw
            this.scalebarAcb = {a:a, c:c, b:b};

            //Let original _drawScaleBar method finish before any new changes.
            this.inherited(arguments);

            this.convertToCustomUnits(b);
        },

        _getDistance: function(mapExtent) {
            var centerPt = mapExtent.getCenter();
            var rightPt = new Point(mapExtent.xmax, centerPt.y);
            var distance = MapUtil.prototype.estimateScaleDistance(centerPt, rightPt, mapExtent);
            this._getScaleBarLength(distance * 2, "km")
        },

        convertToCustomUnits: function(b){
            this.getScaleBarUnits();
            var unit = this.scaleBarUnits.getUnitById(this.unitId);

            var convertedDistance = this.convertUnits(
                b,
                this.getEsriScaleDistance(b),
                unit
            );

            this.setNewTextLabel(convertedDistance, unit);
        },

        getScaleBarUnits: function(){
            if(this.scaleBarUnits === null){
                this.scaleBarUnits = ScaleBarUnits.getInstance();
            }
        },

        getEsriScaleDistance: function(units){
            var currentScaleString = this.metricScalebar.getElementsByClassName("esriScalebarLabel esriScalebarLineLabel esriScalebarSecondNumber")[0].innerHTML;
            if(units === "km"){
                return currentScaleString.substring(0, currentScaleString.indexOf("k"));
            }
            else if(units === "ft"){
                return currentScaleString.substring(0, currentScaleString.indexOf("f"));
            }
            else
                return currentScaleString.substring(0, currentScaleString.indexOf("m"));
        },

        //currently only converts on km. Need to make sure ft, m and mi are converted correctly as well.
        convertUnits: function(esriUnits, esriScaleDistance, scaleBarUnit){
            if(esriUnits === "km"){
                var calculatedValue = esriScaleDistance / (scaleBarUnit.lengthMeters / 1000);
                if (calculatedValue < 10){
                    return parseFloat(calculatedValue).toFixed(2);
                }
                else{
                    return Math.round(calculatedValue);
                }
            }
        },

        setNewTextLabel: function(distance, scaleBarUnit){
            var label = distance,
                formattedDistance = LabelFormatter.prototype.decimalFormat(distance);

            if(scaleBarUnit.name === "Kilometers"){
                label = "<span class='scaleBarDistanceLabelNoIcon'><span class='scaleBarDistanceTextNoIcon'>" + formattedDistance + "&nbsp;&nbsp;</span><span class='scaleBarDistanceIconNoIcon'>km</span></span>";
            }
            else if(scaleBarUnit.name === "Miles"){
                label = "<span class='scaleBarDistanceLabelNoIcon'><span class='scaleBarDistanceTextNoIcon'>" + formattedDistance + "&nbsp;&nbsp;</span><span class='scaleBarDistanceIconNoIcon'>mi</span></span>";
            }
            else{
                label = "<span class='scaleBarDistanceLabel'><span class='scaleBarDistanceText'>" + formattedDistance + "&nbsp;×&nbsp;</span><span class='scaleBarDistanceIcon'><span class='" + scaleBarUnit.icon + "'></span></span></span>";
            }

            //set the label
            this.metricScalebar.getElementsByClassName("esriScalebarLabel esriScalebarLineLabel esriScalebarSecondNumber")[0].innerHTML = label;
               
        },

        showScaleBarDialog: function(){
            if(this.scaleBarDialog === null){
                this.scaleBarDialog = new ScaleBarDialog();
            }else{
                this.scaleBarDialog.show();
            }
        },

        changeScaleBarUnits: function(event){
            this.unitId = event.unitId;

            //redraw the bar
            this._drawScaleBar(this.scalebarAcb.a, this.scalebarAcb.c, this.scalebarAcb.b);
        }

    });
});