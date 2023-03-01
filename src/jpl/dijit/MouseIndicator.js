/**
 * Mouse Indicator that extends Dojo Mouse Indicator but uses
 * extended Indicator Element instead.
 *
 * Changes the render function to display the labels differently and 
 * avoid going out of bounds.
 *
 * @module jpl/dijit/ui/FloatingPane
 * @requires dojox/layout/FloatingPane
 */

define([
    "dojo/_base/declare",
    "dojox/charting/action2d/MouseIndicator",
    "jpl/dijit/IndicatorElement",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojox/lang/utils"
], function(declare, MouseIndicator, IndicatorElement, lang, aspect, du){
    return declare(MouseIndicator, {

        connect: function(){

            // summary:
            //      Connect this action to the chart. This adds a indicator plot
            //      to the chart that's why Chart.render() must be called after connect.
            this.inherited(arguments);
            // add plot with unique name
            this.chart.addPlot(this._uName, {type: IndicatorElement, inter: this });
        }

    });
});