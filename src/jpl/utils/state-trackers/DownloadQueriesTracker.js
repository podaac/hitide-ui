/**
 * Module that keeps track of Download Queries that have not yet been submitted.
 */
define([
    "dojo/topic",
    "jpl/events/MyDataEvent",
    "jpl/events/DownloadsEvent"
], function(topic, MyDataEvent, DownloadsEvent){

    var downloadQueries = {};

    topic.subscribe(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, handleAddDownloadQuery);
    topic.subscribe(MyDataEvent.prototype.REMOVE_DOWNLOAD_QUERY, handleRemoveDownloadQuery);
    topic.subscribe(DownloadsEvent.prototype.JOB_SUBMITTED, handleJobSubmitted);

    function handleAddDownloadQuery(message) {
        downloadQueries[message.queryId] = message;
    }

    function handleRemoveDownloadQuery(message) {
        delete downloadQueries[message.queryId];
    }

    function handleJobSubmitted() {
        downloadQueries = {};
    }

    function getCurrentQueries() {
        return downloadQueries;
    }

    function restoreQueries(queries) {
        Object.values(queries).forEach(function (query) {
            topic.publish(MyDataEvent.prototype.ADD_DOWNLOAD_QUERY, query);
        })
    }

    return {
        getCurrentQueries: getCurrentQueries,
        restoreQueries: restoreQueries
    };
});
