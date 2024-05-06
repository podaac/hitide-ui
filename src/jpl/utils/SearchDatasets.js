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
            // eslint-disable-next-line no-console
            console.log('Did not enable cmr datasets');
        }

        return all(promises).then(function(resultsArray) {
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

    function getAdditionalCmrMetadata(collectionObjectArray) {
        var graphqlURL = config.hitide.externalConfigurables.cmrVariableService
        var collectionIds = collectionObjectArray.map(function(collectionObject) {
            return '"' + collectionObject["Dataset-PersistentId"] + '"'
        })
        var templateQuery = "{\n  collections (conceptId: [{COLLECTION_ID}], limit: 2000) {\n    items {\n        conceptId\n    spatialExtent\n      relatedUrls\n     }\n   }\n}"
        var query = templateQuery.replace("{COLLECTION_ID}", collectionIds);
        var updatedCollectionObjects = request.post(graphqlURL, {
            handleAs: 'json',
            withCredentials: config.hitide.externalConfigurables.crossOriginCmrCookies,
            headers: {
                "X-Requested-With": null,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ query: query })
        }).then(function(response) {
            return collectionObjectArray.map(function(collectionObject) {
                collectionObject["Dataset-ImageUrl"] = 'https://podaac.jpl.nasa.gov/Podaac/thumbnails/image_not_available.jpg'
                var objectWithMetadata = response.data.collections.items.find(function (metadataItem) { return metadataItem.conceptId === collectionObject["Dataset-PersistentId"] })
                var databaseCollectionObjectToReturn = collectionObject
                if(objectWithMetadata) {
                    databaseCollectionObjectToReturn = getCmrSpatialExtent(collectionObject, objectWithMetadata)
                }
                return databaseCollectionObjectToReturn
            })
        })
        return all(updatedCollectionObjects).then(function(resolvedPromises) {
            return resolvedPromises
        })
    }

    function getCmrSpatialExtent(datasetObject, additionalMetadataObject){
        datasetObject["Dataset-Resolution"] = []
        var resolutionAndCoordinateSystemObject = additionalMetadataObject.spatialExtent.horizontalSpatialDomain.resolutionAndCoordinateSystem
        var relatedUrlsArray = additionalMetadataObject.relatedUrls
        if (resolutionAndCoordinateSystemObject) {
            var resolutionObjects = resolutionAndCoordinateSystemObject.horizontalDataResolution.genericResolutions
            if (resolutionObjects) {
                resolutionObjects.forEach(function(resolutionObject) {
                    var acrossTrack = resolutionObject.xdimension
                    var alongTrack = resolutionObject.ydimension
                    var unit = resolutionObject.unit
                    datasetObject["Dataset-Resolution"].push({"Dataset-AcrossTrackResolution": acrossTrack, "Dataset-AlongTrackResolution": alongTrack, "Unit": unit})
                });
            } else {
                // Resolution not available by error
                datasetObject["Dataset-Resolution"].push({"error": "Not Available"})
            }
        } else {
            // Key [Collection]/SpatialExtent/HorizontalSpatialDomain/ResolutionAndCoordinateSystem does not exist. This likely was intentional to indicate resolution is not applicable to this collection.
            datasetObject["Dataset-Resolution"].push({"error": "Not Applicable"})
        }
        if (relatedUrlsArray) {
            var urlDatasetImageUrl = 'https://podaac.jpl.nasa.gov/Podaac/thumbnails/image_not_available.jpg'
            for(var i=0; i < relatedUrlsArray.length; i++) {
                var currentRelatedUrlObject = relatedUrlsArray[i]
                if (currentRelatedUrlObject.description === 'Thumbnail') {
                    urlDatasetImageUrl = currentRelatedUrlObject.url
                }
            }
            datasetObject["Dataset-ImageUrl"] = urlDatasetImageUrl
        } 
        return datasetObject
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