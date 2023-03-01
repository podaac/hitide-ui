define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * Data holder for map projection information.
     * @module jpl/data/Projection
     * @requires dojo/_base/declare
     * @class jpl.data.Projection
     */
    return declare(null, /** @lends jpl.data.Projection.prototype */ {
        /**
         * @constant
         * @type {string}
         * @description Constant for Equirectangular projection
         */
        EQUIRECT: "",

        /**
         * @constant
         * @type {string}
         * @description Constant for North Pole projection
         */
        N_POLE: "",

        /**
         * @constant
         * @type {string}
         * @description Constant for South Pole projection
         */
        S_POLE: "",

        /**
         * @constant
         * @type {string}
         * @description Constant for a Latitude/Longitude projection
         */
        LATLONG: "",

        //TODO: remove this?
        GLOBE_3D: "globe_3d",

        /**
         * @property {object} - Contains extent objects for all projections
         * @type {object}
         * @description Contains extent objects for all projections
         */
        EXTENTS: {
            EQUIRECT: null,
            N_POLE: null,
            S_POLE: null,
            LATLONG: null
        },

        /**
         * @property {object} - Contains spatial reference objects for all projections
         * @type {object}
         * @description Contains spatial reference objects for all projections
         */
        SPATIAL_REFERENCES: {
            EQUIRECT: null,
            N_POLE: null,
            S_POLE: null,
            LATLONG: null
        },

        /**
         * Creates and stores a map extent object
         * @param {number} xmin - The minimum x value coordinate
         * @param {number} ymin - The minimum y value coordinate
         * @param {number} xmax - The maximum x value coordinate
         * @param {number} ymax - The maximum y value coordinate
         * @param {string} projection - The projection for the coordinates. Possible values are constants from this class: EQUIRECT, N_POLE, S_POLE
         * @return {null}
         */
        setExtent: function(xmin, ymin, xmax, ymax, projection) {
            var extent = {
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax
            };

            if(projection === this.EQUIRECT) {
                this.EXTENTS.EQUIRECT = extent;
            } else if(projection === this.N_POLE) {
                this.EXTENTS.N_POLE = extent;
            } else if(projection === this.S_POLE) {
                this.EXTENTS.S_POLE = extent;
            } else if(projection === this.LATLONG) {
                this.EXTENTS.S_POLE = extent;
            }
        },

        /**
         * Creates and stores a map projection object
         * @param {number} wkid - well-known id for the projection
         * @param wkt - well-known text for the projection
         * @param proj4 - proj4 string for the projection
         * @param projection - The projection for the coordinates. Possible values are constants from this class: EQUIRECT, N_POLE, S_POLE
         * @return null
         */
        setProjection: function(wkid, wkt, proj4, projection) {
            var proj = {
                wkid: wkid,
                wkt: wkt,
                proj4: proj4
            };

            if(projection === this.EQUIRECT) {
                this.SPATIAL_REFERENCES.EQUIRECT = proj;
            } else if(projection === this.N_POLE) {
                this.SPATIAL_REFERENCES.N_POLE = proj;
            } else if(projection === this.S_POLE) {
                this.SPATIAL_REFERENCES.S_POLE = proj;
            } else if(projection === this.LATLONG) {
                this.SPATIAL_REFERENCES.LATLONG = proj;
            }
        }
    });
});
