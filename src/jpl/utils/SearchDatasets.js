define([
    "dojo/request",
    "dojo/promise/all",
    "jpl/config/Config"
], function(request, all, Config){

    var PODAAC_LABEL = " - PODAAC";
    var POCLOUD_LABEL = " - POCLOUD";
    var config = Config.getInstance();

    /**
     * Search L2SS and CMR datasets - returning datasets and facets
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

        var l2ssSearchUrl = config.hitide.externalConfigurables.datasetSearchService;
        var cmrSearchUrl = config.hitide.externalConfigurables.cmrDatasetSearchService;

        var promises = [];
        if(typeof l2ssSearchUrl === 'string') promises.push(searchL2ss(options));
        if(typeof cmrSearchUrl === 'string') promises.push(searchCmr(options));
        if(promises.length === 0) {
            console.log('Did not enable l2ss or cmr datasets');
        }

        return all(promises).then(function(resultsArray) {
            if(promises.length === 1) {
                return resultsArray[0];
            }
            return combineResults(resultsArray[0], resultsArray[1]);
        });
    }

    function combineResults(first, second) {
        var combined = {
            response: {
                docs: first.response.docs.concat(second.response.docs)
            },
            facet_counts: {
                facet_fields: {
                    "DatasetParameter-Variable-Full": 
                        first.facet_counts.facet_fields["DatasetParameter-Variable-Full"]
                        .concat(second.facet_counts.facet_fields["DatasetParameter-Variable-Full"]),
                    "DatasetSource-Sensor-LongName-Full":
                        first.facet_counts.facet_fields["DatasetSource-Sensor-LongName-Full"]
                        .concat(second.facet_counts.facet_fields["DatasetSource-Sensor-LongName-Full"]),
                    "Dataset-Provider-ShortName": 
                        first.facet_counts.facet_fields["Dataset-Provider-ShortName"]
                        .concat(second.facet_counts.facet_fields["Dataset-Provider-ShortName"])
                    
                }
            }
        };

        return combined;
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
        });
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
                "Dataset-ImageUrl": "https://podaac.jpl.nasa.gov/Podaac/thumbnails/" + doc.short_name + ".jpg",
                "Dataset-Description": doc.summary
            }
        });

        return datasets;
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


    /////////////////////////////////////////////////////////////////////
    //
    //          L2SS Functions
    //
    /////////////////////////////////////////////////////////////////////
    function searchL2ss(options) {
        var url = constructL2ssUrl(options);

        return request(url, {
            handleAs: 'json',
            headers: {
                "X-Requested-With": null
            }
        }).then(function(response) {
            return processL2ssResponse(response);
        });
            
    }

    function processL2ssResponse(response) {
        Object.values(response.facet_counts.facet_fields).forEach(function(facet) {
            for(var i = 0; i < facet.length; i+= 2) {
                facet[i] += PODAAC_LABEL;
            }
        });

        return response;
    }

    function constructL2ssUrl(options) {
        var url = config.hitide.externalConfigurables.datasetSearchService;
        var itemsPerPage = config.hitide.externalConfigurables.datasetSearchServiceItemsPerPage;
        url += "?itemsPerPage=" + (itemsPerPage || 200);
        if(options.startTime) url += "&startTime=" + options.startTime;
        if(options.endTime) url += "&endTime=" + options.endTime;
        if(options.bbox) url += "&bbox=" + options.bbox;
        if(options.facets) {
            Object.keys(options.facets).forEach(function(facetName) {
                var facetArray = options.facets[facetName];
                facetArray.forEach(function(facetValue) {
                    url += '&' + facetName + '=' + facetValue.replace(PODAAC_LABEL, '');
                })
            })
        }
        return url;
    }

    
    return {
        search: search
    };
});