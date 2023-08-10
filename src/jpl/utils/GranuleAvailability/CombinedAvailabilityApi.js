define([
  "dojo/_base/declare",
  "dojo/promise/all",
  "jpl/utils/DOMUtil"
], function (declare, all, DOMUtil) {

  return declare(null, {
    constructor: function (options) {
      this.cmr = options.cmrAvailabilityApi;
    },

    fetchAvailability: function (startTime, endTime, gap, datasets) {
      var startTimeString = fixStartTime(startTime);
      var endTimeString = fixEndTime(endTime, gap);
  
      var _context = this;
      var requestPromises = Object.values(datasets).map(function (dataset) {
        var id = dataset["Dataset-PersistentId"];
        if (dataset.source === "cmr") {
          return _context.cmr.fetchOne(startTimeString, endTimeString, gap, id);
        }
      });
      return all(requestPromises);
    }
  });

  function fixStartTime(startTime) {
    return DOMUtil.prototype.dateFormatISOBeginningOfDay(new Date(startTime));
  }

  function fixEndTime(endTime, gap) {
    endTime = new Date(endTime);
    var newEndTime = endTime;
    if (gap === "MONTH") {
      if (endTime.getMonth() == 11) {
        newEndTime = new Date(endTime.getFullYear() + 1, 0, 1);
      } else {
        newEndTime = new Date(endTime.getFullYear(), endTime.getMonth() + 1, 1);
      }
    }
    return DOMUtil.prototype.dateFormatISOEndOfDay(newEndTime);
  }
});
