define([
    "dojo/request",
    "jpl/config/Config"
], function(request, Config){

    var config = Config.getInstance();

    /**
     * 
     * @param {Object} dataset 
     * @param {string} dataset.source (optional) cmr
     * @param {string} dataset [\"Dataset-PersistentId\"]
     * 
     * @returns dojo promise containing response or error
     *          successful response is array of variable names
     */
    function search(dataset) {
        if(typeof dataset !== "object")
            throw new Error('Dataset object must be passed to SearchVariables.search(dataset)');

        if(dataset.source === 'cmr') {
            return searchCmr(dataset);
        }
    }

    function searchCmr(dataset, customQuery) {
        // This function uses the cmr graphql api, since this allows getting
        // all the variable names for a collection in one request
        var url = config.hitide.externalConfigurables.cmrVariableService;

        var templateQuery = "{\n  collection (conceptId:\"{COLLECTION_ID}\") {\n    variables {\n      items {\n        name\n      }\n    }\n  }\n}"
          
        var query = templateQuery.replace("{COLLECTION_ID}", dataset['Dataset-PersistentId']);
        if (customQuery) {
            query = customQuery
        }
        
        return request.post(url, {
            handleAs: 'json',
            withCredentials: config.hitide.externalConfigurables.crossOriginCmrCookies,
            headers: { "X-Requested-With": null, "Content-Type": "application/json" },
            data: JSON.stringify({ query: query })
        }).then(function(response) {
            var variables = response.data.collection.variables.items;
            variables.sort(function (a, b) {
                return a['name'].toLowerCase().localeCompare(b['name'].toLowerCase());
            });
            return variables.map(function(variableObject) {
                return variableObject.name; 
            });
        }).then(function(response) {
            return response;
        }, function(error){
            console.error("Error fetching variables for dataset:", dataset);
            return ['all'];
        });
    }

    return {
        search: search
    };
});
