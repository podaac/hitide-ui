
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * Formatting utility for labels such as distances.
     * @module jpl/utils/LabelFormatter
     * @requires dojo/_base/declare
     * @class jpl.utils.LabelFormatter
     */
    return declare(null, /** @lends jpl.utils.LabelFormatter.prototype */ {
        /**
         * Format a string or number to specified decimal places.
         * @param {number} value - The value to be formatted.
         * @param {number} places - The number of decimal places to format. The default is 2.
         * @return {number} the formatted value
         */
        decimalFormat: function(value, places) {
            places = this.validateNumberPlaces(places);

            try {
                var result = Number(
                    parseFloat(value)
                        .toFixed(places)
                        .toLocaleString()
                );

                if(typeof result === "number" && !isNaN(result)) {
                    return result;
                }

                return "invalid number";
            } catch(err) {
                return "invalid number1";
            }
        },

        /**
         * Format a value in meters to specified decimal places. Also appends proper distance label (m/km)
         * @param {number} value - The value to be formatted.
         * @param {number} places - The number of decimal places to format. The default is 2.
         * @return {string} the formatted value with distance label
         */
        distanceLabelFromValue: function(value, places) {
            places = this.validateNumberPlaces(places);

            if(value >= 1000 || value <= -1000) {
                return this.decimalFormat(value/1000, places) + " km";
            } else {
                return this.decimalFormat(value, places) + " m";
            }
        },

        /**
         * Format a value in meters to feet formatted label to specified decimal places
         * @param {number} meters - The value in meters to be converted to feet.
         * @param {number} places - The number of decimal places to format. The default is 2.
         * @return {number} the formatted value in feet
         */
        metersToFeet: function(meters, places) {
            places = this.validateNumberPlaces(places);

            try {
                var feet = this.decimalFormat(
                    Number(parseFloat(meters)) * 3.28084,
                    places
                );

                if(typeof feet === "number" && !isNaN(feet)) {
                    return feet;
                }

                return "invalid number";
            } catch(err) {
                return "invalid number";
            }
        },

        /**
         * Validates number of decimal places parameter. If invalid or not provided, sets to default of 2.
         * @param {number} places - The number of decimal places to format. The default is 2.
         * @return {number} decimal places to be used
         */
        validateNumberPlaces: function(places) {
            if(!places) {
                //default decimal places to 2
                return 2;
            } else {
                //make sure places is a number, if not set it to default
                places = Number(places);

                if(isNaN(places)) {
                    return 2;
                } else {
                    return places;
                }
            }
        }
    });
});