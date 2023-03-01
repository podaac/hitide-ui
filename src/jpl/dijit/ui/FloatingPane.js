/**
 * Floating window that extends FloatingPane and is constrained from moving outside a specified zone
 *
 * @module jpl/dijit/ui/FloatingPane
 * @requires dojox/layout/FloatingPane
 */

define([
    "dojo/_base/declare",
    "dojox/layout/FloatingPane",
    "dojo/_base/connect",
    "dojo/_base/lang"
], function(declare, FloatingPane, connectUtil, lang){
    return declare(FloatingPane,{
        isClosed:false,

        /**
         * Close functionality
         * TODO: Eddie needs to add description of what this is doing
         */
        close: function() {
            if(!this.closable) {
                return;
            }

            this.isClosed = true;

            connectUtil.unsubscribe(this._listener);

            this.hide(lang.hitch(this, function() {
                this.destroyRecursive();
            }));
        }

    });
});