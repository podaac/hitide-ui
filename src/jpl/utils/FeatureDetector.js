define([
    "dojo/_base/declare",
    "dojo/Evented",
    "dojo/has",
    "dojo/topic",
    "jpl/utils/MakeSingletonUtil",
    "jpl/utils/WebGLDetector",
    "jpl/events/BrowserEvent"
], function(declare, Evented, has, topic, MakeSingletonUtil, WebGLDetector, BrowserEvent) {
    return MakeSingletonUtil(declare("gov.nasa.jpl.mmmp.FeatureDetector", [Evented], {
        mobileDevice: false,
        touchDevice: false,
        webGL: false,

        constructor: function () {
            this.mobileDevice = this.isMobile();
            this.touchDevice = this.hasTouch();
            this.webGL = this.hasWebGL();

            //this.detectionComplete();
        },

        hasTouch: function () {
            return has("touch");
        },

        isMobile: function () {
            if (has("ios") || has("android") || has("bb") || has("windowsphone")) {
                return true;
            } else {
                return false;
            }
        },

        hasWebGL: function() {
            return WebGLDetector.prototype.hasWebGL();
        },

        detectionComplete: function() {
            topic.publish(BrowserEvent.prototype.FEAT_DETECT_COMPLETE, null);
            console.log('feature detection complete');
        }
    })
    );
});