define([
    "dojo/_base/declare",
    "dojo/fx",
    "dojo/_base/fx"
], function (declare, fx, baseFx) {
    return declare(null, {

            constructor: function () {

            },

            slideAnimation: function (node, top, left) {
                fx.slideTo({
                    node: node,
                    top: top.toString(),
                    left: left.toString(),
                    unit: "px",
                    onBegin: function() {
                        //me.animationPlaying = true;
                    },
                    onEnd: function() {
                        //me.animationPlaying = false;
                    }
                }).play();
            },

            fadeInOutAnimation: function(node) {
                 baseFx.fadeIn({node: node}).play();

                 setTimeout(function() {
                     baseFx.fadeOut({node: node}).play();
                 }, 3000);
            },

            wipeInAnimation: function(node) {
                fx.wipeIn({
                    node: node,
                    duration: 300
                }).play();
            },

            wipeOutAnimation: function(node) {
                fx.wipeOut({
                    node: node,
                    duration: 300
                }).play();
            }

        });
    });