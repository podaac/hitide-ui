define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom"
], function (declare, domConstruct, dom) {
    return declare(null, {

        constructor: function () {
        },

        hasWebGL: function() {
            var canvasID = '3dTestCanvas',
                canvas = this.generateTestCanvas(canvasID),
                glExperimental = false,
                gl;

            //check if webgl is enabled
            try {
                gl = canvas.getContext("webgl");
            } catch (x) {
                gl = null;
            }

            //check if experimental webgl is enabled
            if (gl === null) {
                try {
                    gl = canvas.getContext("experimental-webgl");
                    glExperimental = true;
                } catch (x) {
                    gl = null;
                }
            }

            this.destroyTestCanvas(canvasID);

            if(gl) {
                return true;
            } else {
                return false;
            }
        },

        generateTestCanvas: function(canvasID) {
            var testCanvas = '<canvas id="' + canvasID + '"></canvas>';

            domConstruct.place(testCanvas, document.body, "last");

            return dom.byId(canvasID);
        },

        destroyTestCanvas: function(canvasID) {
            domConstruct.destroy(canvasID);
        }
    });
});