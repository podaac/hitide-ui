define(["dojo/_base/declare", "dojo/request", "dojo/promise/all", "moment/moment", "jpl/config/Config"], function (declare, dojoRequest, all, moment, Config) {

  var config = Config.getInstance();

  return declare(null, {
    constructor: function (baseUrl) {
      this.baseUrl = baseUrl;
    },

    fetchOne: function (startTimeString, endTimeString, gap, datasetId) {
      return fetchAvailabilityAsObjects(this.baseUrl, startTimeString, endTimeString, gap, datasetId)
        .then(convertObjectsToArrays)
        .then(function(results) {
          return addTimespansWithZeroGranules(startTimeString, endTimeString, gap, results)
        })
    }
  });

  function fetchAvailabilityAsObjects(baseUrl, start, end, gap, datasetId) {
    return fetchYears(baseUrl, start, end, datasetId)
      .then(function (results) {
        if (gap === "MONTH" || gap === "DAY") {
          return fetchMonthsFromLinks(results, baseUrl);
        } else {
          return results;
        }
      })
      .then(function (results) {
        if (gap === "DAY") {
          return fetchDaysFromLinks(results, baseUrl);
        } else {
          return results;
        }
      })
  }

  function replaceUrlBase(url, baseUrl) {
    var cmrBaseRegex = /https:\/\/cmr.*\.earthdata\.nasa\.gov/;
    return url.replace(cmrBaseRegex, baseUrl);
  }

  function request(url) {
    return dojoRequest.get(url, {
      headers: {
        "X-Requested-With": null
      },
      handleAs: "json",
      withCredentials: config.hitide.externalConfigurables.crossOriginCmrCookies
    });
  }

  function fetchYears(baseUrl, start, end, datasetId) {
    if(!baseUrl) {
      console.error("Attempting to use CmrAvailabilityApi, but no baseUrl was set");
    }

    var url = baseUrl + "/search/granules.json?include_facets=v2&page_size=0";
    url += "&collection_concept_id=" + datasetId;
    url += "&temporal[]=" + start + "," + end;

    return request(url).then(parseYears);
  }

  function parseYears(raw) {
    if(!raw.feed.facets.has_children) {
      return [];
    }

    var years = raw.feed.facets.children
      .find(function (item) {
        return item.title === "Temporal";
      })
      .children.find(function (item) {
        return item.title === "Year";
      })
      .children.map(function (year) {
        return {
          year: year.title,
          link: year.links.apply,
          count: year.count,
          children: year.children
        };
      });

    return years;
  }

  function fetchMonthsFromLinks(years, baseUrl) {
    var promises = years.map(function (year) {
      return request(replaceUrlBase(year.link, baseUrl));
    });
    return all(promises).then(function (raws) {
      var monthArrays = raws.map(parseMonths);
      var months = [];
      monthArrays.forEach(function (monthArray) {
        months.push.apply(months, monthArray);
      });
      return months;
    });
  }

  function parseMonths(raw) {
    var year = parseYears(raw)[0];
    var months = year.children
      .find(function (item) {
        return item.title === "Month";
      })
      .children.map(function (month) {
        return {
          year: year.year,
          month: month.title,
          link: month.links.apply,
          count: month.count,
          children: month.children
        };
      });

    return months;
  }

  function fetchDaysFromLinks(months, baseUrl) {
    var promises = months.map(function (month) {
      return request(replaceUrlBase(month.link, baseUrl));
    });
    return all(promises).then(function (raws) {
      var dayArrays = raws.map(parseDays);
      var days = [];
      dayArrays.forEach(function (dayArray) {
        days.push.apply(days, dayArray);
      });

      return days;
    });
  }

  function parseDays(raw) {
    var month = parseMonths(raw)[0];
    var days = month.children
      .find(function (item) {
        return item.title === "Day";
      })
      .children.map(function (rawDay) {
        return {
          year: month.year,
          month: month.month,
          day: rawDay.title,
          count: rawDay.count
        };
      });
    return days;
  }

  function addTimespansWithZeroGranules(start, end, gap, results) {
    start = moment.utc(start);
    end = moment.utc(end);
    var resultCounter = 0;
    var newResults = [];
    while(start.isSameOrBefore(end)) {
      var nextResult = results[resultCounter];
      if(!nextResult || start.valueOf() < nextResult[0]) {
        newResults.push([start.valueOf(), 0]);
      } else {
        newResults.push(nextResult);
        resultCounter++;
      }
      start.add(1, gap);
    }
    return newResults;
  }

  function convertObjectsToArrays(input) {
    var output = input.map(function (item) {
      return [dateToMilllis(item.year, item.month, item.day), item.count];
    });
    return output;
  }

  function dateToMilllis(year, month, day) {
    month = month || '01';
    day = day || '01';
    var date = moment.utc(year + '-' + month + '-' + day);
    return date.valueOf()
  }

});
