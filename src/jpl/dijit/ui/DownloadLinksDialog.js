define([
    "dojo/_base/declare",
    "jpl/dijit/ui/AlertDialog"
], function(declare, AlertDialog) {
    return declare([], {

        alert: null,

        constructor: function(job) {

            var links = job.downloadUrls.map(function(x) {
                return "<li class='download-link-li'><a class=\"download-link\" target=\"_blank\" href=\"" + x + "\">" + x + "</a></li>";
            });

            var citations = job.citations.map(function(x){
                return "<li class='download-link-li'>" + x + "</li>";
            });

            var message = 
                "<div style='font-size: 2em;'>Download Links</div>" +
                "<ol>" + links.join("") + "</ol>" +
                "<div style='font-size: 2em;'>Citations</div>" +
                "<ol>" + citations.join("") + "</ol>";

            this.alert = new AlertDialog({
                alertTitle: "Download Links and Citations",
                alertMessage: message,
                alertFooter: "Successfully subsetted <b>" + (job.granulesCompleted) + "</b> " +
                    "of <b>" + job.granulesRequested + "</b> granules."
            });
        },


        startup: function() {
            this.alert.startup();
        }


    });
});
