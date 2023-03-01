define([
    "dojo/_base/declare",
    'dojo/request/script'
], function (declare, script) {
    return declare([], {

        constructor: function (analyticsID) {
            window.GoogleAnalyticsObject = 'ga';
            window.ga = function() {
                (window.ga.q = window.ga.q || []).push(arguments);
            };
            window.ga.l = 1 * new Date();

            script.get('//google-analytics.com/analytics.js').then(function(data) {
                window.ga('create', analyticsID, 'auto');
                window.ga('send', 'pageview');
            });
        }
    });
});