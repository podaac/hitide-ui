define(["dojo/_base/declare", "dojo/request"], function (declare, dojoRequest) {

  return declare(null, {
    constructor: function(baseUrl) {
      this.baseUrl = baseUrl;
    },

    fetchOne: function(startTimeString, endTimeString, gap, datasetId) {
      if(!this.baseUrl) {
        console.error("Attempting to use CmrAvailabilityApi, but no baseUrl was set");
      }
      var url = this.baseUrl +
        "?datasetId=" + datasetId +
        "&startTime=" + startTimeString +
        "&endTime=" + endTimeString +
        "&gap=" + gap;
  
      return request(url).then(parseL2ssResponse);
    }
  });

  function request(url) {
    return dojoRequest.get(url, {
      headers: {
        "X-Requested-With": null
      },
      handleAs: "json"
    })
  }

  function parseL2ssResponse(response) {
    var obj = response.facet_counts.facet_dates["Granule-StartTime"];
    // Take out the "end","gap",and "start" key/values from this object
    delete obj["end"];
    delete obj["gap"];
    delete obj["start"];
    var arr = Object.keys(obj).map(function (key) {
      return [new Date(key).getTime(), obj[key]];
    });
    return arr;
  }
});
