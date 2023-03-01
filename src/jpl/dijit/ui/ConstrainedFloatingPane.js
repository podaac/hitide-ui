/**
 * Floating window that extends FloatingPane and is constrained from moving outside a specified zone
 *
 * @module jpl/dijit/ui/ConstrainedFloatingPane
 * @requires jpl/dijit/ui/FloatingPane
 * @requires dojo/dnd/move
 */

define([
    "dojo/_base/declare",
    "jpl/dijit/ui/FloatingPane",
    "dojo/dnd/move"
], function(declare, FloatingPane, move){
    return declare(FloatingPane,{
        l:0,
        t:0,
        w:window.innerWidth,
        h:window.innerHeight,
        
        postCreate: function() {
            this.inherited(arguments);
            this.moveable = this.createConstrainedZone();
        }, 

        /**
         * Creates the constrained zone for the floating pane
         */
        createConstrainedZone: function() {
            new move.constrainedMoveable(
                this.domNode, {
                    handle: this.focusNode,
                    constraints: function() {
                        return {
                            l: 0,
                            t: 0,
                            w: window.innerWidth,
                            h: window.innerHeight
                        };
                    },
                    within: true
                }
            );
        }
    });
});