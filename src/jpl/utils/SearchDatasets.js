define([
    "dojo/request",
    "dojo/promise/all",
    "jpl/config/Config"
], function(request, all, Config){

    var POCLOUD_LABEL = " - POCLOUD";
    var config = Config.getInstance();

    /**
     * Search CMR datasets - returning datasets and facets
     * 
     * @param {Object} options 
     * @param {string} options.startTime
     * @param {string} options.endTime
     * @param {string} options.bbox
     * @param {Object} options.facets
     * 
     * @returns dojo promise containing response or error
     */
    function search(options) {
        if(typeof options !== "object")
            throw new Error('Options object must be passed to SearchDatasets.search(options)');

        var cmrSearchUrl = config.hitide.externalConfigurables.cmrDatasetSearchService;

        var promises = [];
        if(typeof cmrSearchUrl === 'string') promises.push(searchCmr(options));
        if(promises.length === 0) {
            console.log('Did not enable cmr datasets');
        }

        return all(promises).then(function(resultsArray) {
            console.log(resultsArray)
            // get additional resolution info metadata for datasets
            var additionalDataPromises = []
            additionalDataPromises.push(getAdditionalCmrMetadata(resultsArray[0].response.docs))
            return all(additionalDataPromises).then(function() {
                return resultsArray
            })
        }).then(function(resultsArray) {
            return resultsArray[0];
        })
    }

    /////////////////////////////////////////////////////////////////////
    //
    //          CMR Functions
    //
    /////////////////////////////////////////////////////////////////////
    function searchCmr(options) {
        var url = constructCmrUrl(options);
        console.log('cmr call #1: ',url)
        return request(url, {
            handleAs: 'json',
            headers: {
                "X-Requested-With": null
            },
            withCredentials: config.hitide.externalConfigurables.crossOriginCmrCookies
        }).then(function(response) {
            var datasets = extractCmrDatasets(response);
            var facets = extractCmrFacets(response);
            return {
                response: {
                    docs: datasets
                },
                facet_counts: {
                    facet_fields: facets
                }
            };
        })
    }

    function constructCmrUrl(options) {
        var url = config.hitide.externalConfigurables.cmrDatasetSearchService;

        if(url.includes('?'))
            url += '&';
        else
            url += '?';
        url += "include_facets=true";

        var itemsPerPage = config.hitide.externalConfigurables.datasetSearchServiceItemsPerPage;
        url += "&page_size=" + (itemsPerPage || 200);

        if(options.bbox) url += '&bounding_box[]=' + options.bbox;

        var dateFilter = '';
        if(options.startTime) dateFilter += options.startTime;
        dateFilter += ',';
        if(options.endTime) dateFilter += options.endTime;
        if(dateFilter !== ',') url += '&temporal[]=' + dateFilter;

        var providers = options.facets.provider || [];
        providers.forEach(function(provider) {
            url += '&data_center=' + provider.replace(POCLOUD_LABEL, '');
        });

        var sensors = options.facets.sensor || [];
        sensors.forEach(function(sensor) {
            url += '&instrument=' + sensor.replace(POCLOUD_LABEL, '');
        });

        var variables = options.facets.variable || [];
        variables.forEach(function(variable) {
            url += '&science_keywords[0][variable-level-1]=' + variable.replace(POCLOUD_LABEL, '');
        });

        return url;
    }

    function extractCmrDatasets(response) {
        var datasets = response.feed.entry.map(function(doc) {
            return {
                "source": 'cmr',
                "Dataset-ShortName": doc.short_name,
                "Dataset-LongName": doc.title,
                "Dataset-PersistentId": doc.id,
                "DatasetCoverage-StartTimeLong": new Date(doc.time_start).getTime(),
                "DatasetCoverage-StopTimeLong": new Date(doc.time_end).getTime(),
                "Dataset-Description": doc.summary
            }
        });

        return datasets;
    }

    function getCmrSpatialExtent(datasetObject){
        var conceptId = datasetObject["Dataset-PersistentId"]
        var secondURL = config.hitide.externalConfigurables.cmrCollectionSearchService + "/" + conceptId + ".umm_json"
        return request(secondURL, {
            handleAs: 'json',
            headers: {
                "X-Requested-With": null
            },
            withCredentials: config.hitide.externalConfigurables.crossOriginCmrCookies
        }).then(function(response) {
            var resolutionAndCoordinateSystemObject = response.SpatialExtent.HorizontalSpatialDomain.ResolutionAndCoordinateSystem
            var relatedUrlsArray = response.RelatedUrls
            if (resolutionAndCoordinateSystemObject) {
                var resolutionObjects = resolutionAndCoordinateSystemObject.HorizontalDataResolution.GenericResolutions
                if (resolutionObjects) {
                    datasetObject["Dataset-Resolution"] = []
                    resolutionObjects.forEach(function(resolutionObject) {
                        var acrossTrack = resolutionObject.XDimension
                        var alongTrack = resolutionObject.YDimension
                        var unit = resolutionObject.Unit
                        datasetObject["Dataset-Resolution"].push({"Dataset-AcrossTrackResolution": acrossTrack, "Dataset-AlongTrackResolution": alongTrack, "Unit": unit})
                    });
                }
            }
            if (relatedUrlsArray) {
                for(var i=0; i < relatedUrlsArray.length; i++) {
                    var currentRelatedUrlObject = relatedUrlsArray[i]
                    if (currentRelatedUrlObject['Description'] === 'Thumbnail') {
                        datasetObject["Dataset-ImageUrl"] = currentRelatedUrlObject['URL']
                    }
                }
            }
            return datasetObject
        })
    }

    function getAdditionalCmrMetadata(collectionObjectArray) {
        var promises = collectionObjectArray.map(function(collectionObject) {
            return getCmrSpatialExtent(collectionObject)
        })
        return all(promises).then(function(resolvedPromises) {
            return resolvedPromises
        })
    }

    function extractCmrFacets(response) {
        var preFacets = response.feed.facets;

        var variables = [];
        var preVariables = preFacets.find(function(facet) {return facet.field === 'variable_level_1';})['value-counts'];
        preVariables.forEach(function(preVariable) { variables.push(preVariable[0] + POCLOUD_LABEL, preVariable[1]); });

        var sensors = [];
        var preSensors = preFacets.find(function(facet) {return facet.field === 'instrument';})['value-counts'];
        preSensors.forEach(function(preSensor) { sensors.push(preSensor[0] + POCLOUD_LABEL, preSensor[1]); });

        var providers = [];
        var preProviders = preFacets.find(function(facet) {return facet.field === 'data_center';})['value-counts'];
        preProviders.forEach(function(preProvider) { providers.push(preProvider[0] + POCLOUD_LABEL, preProvider[1]); });

        return {
            "DatasetParameter-Variable-Full": variables,
            "DatasetSource-Sensor-LongName-Full": sensors,
            "Dataset-Provider-ShortName": providers
        };
    }
    
    return {
        search: search
    };
});