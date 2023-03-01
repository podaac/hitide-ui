define([
    "dojo/_base/declare",
    "dojo/query",
    "moment/moment",
    "dojo/dom-style"
], function(declare, query, moment, domStyle) {
    return declare(null, {
        responsiveBreakpoints: {
            "XS": "xs",
            "SM": "sm",
            "MD": "md",
            "LG": "lg"
        },

        constructor: function(args) {
            //init
        },

        removeEmptyTextNodes: function(node) {
            for (var n = 0; n < node.childNodes.length; n++) {
                var child = node.childNodes[n];
                if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
                    node.removeChild(child);
                    n--;
                } else if (child.nodeType === 1) {
                    this.removeEmptyTextNodes(child);
                }
            }

            return node;
        },

        roundToFixed: function(value, places, rounding) {
            rounding = rounding || "round";
            var num = parseFloat(value),
                multiplier = Math.pow(10, places);

            return (Number(Math[rounding](num * multiplier) / multiplier));
        },

        isResponsiveBreakpoint: function(size) {
            return domStyle.get(query('.device-' + size)[0], "display") === "block";
        },

        launchFullScreen: function(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },

        dateFormatISOBeginningOfDay: function(datetime) {
            var mDate = moment.utc(datetime).startOf("day");
            return mDate.toISOString().slice(0, 11) + "00:00:00Z";
        },

        dateFormatISOEndOfDay: function(datetime) {
            var mDate = moment.utc(datetime).startOf("day");
            return mDate.toISOString().slice(0, 11) + "23:59:59Z";
        },

        prettyDateTime: function(dateTime) {
            return moment.utc(dateTime).local().format("MMM D, YYYY — h:mm:ss A");
        }
    });
});
