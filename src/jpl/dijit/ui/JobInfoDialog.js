define([
    "dojo/_base/declare",
    "jpl/dijit/ui/AlertDialog",
    "jpl/dijit/DownloadInfoDataset",
    "jpl/utils/Time"
], function(declare, AlertDialog, DownloadInfoDataset, time) {
    return declare([], {

        alert: null,

        constructor: function(job) {

            var subjobNodes = job.subjobs.map(function(x) {
                return new DownloadInfoDataset(x).domNode.outerHTML;
            });

            var message = subjobNodes.join("<br>");
            
            message += "<br><br>";
            
            message += "<div><b>Overall Job Data</b>";
            message += "<div>Total SubJobs: " + job.subjobs.length + "</div>";
            message += "<div>Total Granules Requested: " + job.granulesRequested + "</div>";
            message += "<div>Granules With Errors: " + job.granulesFailed + "</div>";
            if(job.totalDownloadBytes){
                message += "<div>Total Download Bytes: " + job.totalDownloadBytes + "</div>"
            }
            if(job.completeTime && job.requestTime){
                var millis1 = time.stringToDate(job.completeTime).getTime();
                var millis2 = time.stringToDate(job.requestTime).getTime();
                var millisecondDifference = millis1 - millis2;
                var seconds = Math.round(millisecondDifference / 1000);
                message += "<div>Processing Time: " + seconds + "s</div>";
            }
            message += "</div>";

            this.alert = new AlertDialog({
                alertTitle: "Job Information",
                alertMessage: message
            });
        },


        startup: function() {
            this.alert.startup();
        }


    });
});
