define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dojo/store/Memory",
    "jpl/utils/MakeSingletonUtil"
], function(declare, _WidgetBase, Memory, MakeSingletonUtil) {
    /**
     * Singleton object that stores scale bar units used by the map scale bar component. Example units are kilometers, miles, etc.
     * @module jpl/data/ScaleBarUnits
     * @requires dojo/_base/declare
     * @requires dijit/_WidgetBase
     * @requires dojo/store/Memory
     * @requires jpl/utils/MakeSingletonUtil
     * @class jpl.data.ScaleBarUnits
     */
    return MakeSingletonUtil(
        declare("gov.nasa.jpl.data.ScaleBarUnits", [_WidgetBase], /** @lends jpl.data.ScaleBarUnits.prototype */ {
            /**
             * @property {dojo/store/memory} - Available scale bar units
             * @type {dojo/store/memory}
             * @description Available scale bar units
             */
            unitStore: null,
            /**
             * @property {number} - The selected measurement unit ID for the scale bar
             * @type {number}
             * @description The selected measurement unit ID for the scale bar
             */
            selectedUnitId: 0,

            constructor: function(args) {
                if(this.unitStore === null) {
                    this.unitStore = this.retrieveAllScaleBarUnits();
                }
            },

            /**
             * Retrieves all available scalebar units and stores into memory.
             * @return {dojo/store/memory} The collection of scalebar units available
             */
            retrieveAllScaleBarUnits: function() {
                //For now the scale bar assumes all lengths are in meters.
                //km and mi don't have icons
                var units = [
                    {unitId:"0", name:"Kilometers", lengthMeters:"1000", icon:""},
                    {unitId:"1", name:"Miles", lengthMeters:"1609.34", icon:""},
                    {unitId:"2", name:"Golden Gate Bridge", lengthMeters:"2737", icon:"icon-bridge"},
                    {unitId:"3", name:"Soccer Field", lengthMeters:"110", icon:"fa fa-futbol-o"},
                    {unitId:"4", name:"School Bus", lengthMeters:"13.716", icon:"fa fa-bus icon-schoolbus"}
                ];

                return new Memory({data:units, idProperty: "unitId"});
            },

            /**
             * Retrieves a scalebar unit object using an ID
             * @param {number} id - The ID of the scalebar unit
             * @return {object} The scalebar unit
             */
            getUnitById: function(id){
                return this.unitStore.query({unitId:id})[0];
            },

            /**
             * Retrieves all scalebar units
             * @return {dojo/store/memory} The collection of scalebar units
             */
            getUnits: function(){
                return this.unitStore.data;
            },

            /**
             * Retrieves the scalebar selected unit ID
             * @return {number} The scalebar unit ID
             */
            getSelectedUnitId: function(){
                return this.selectedUnitId;
            },

            /**
             * Sets the selected scalebar unit ID
             * @param {number} unitId - The ID of the scalebar unit
             * @return {null} The collection of scalebar units available
             */
            setSelectedUnitId: function(unitId){
                this.selectedUnitId = unitId;
            }
        })
    );
});