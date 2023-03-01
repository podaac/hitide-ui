define([
    "jpl/utils/state-trackers/DownloadQueriesTracker",
    "jpl/utils/state-trackers/TabTracker",
    "jpl/utils/ConfigManager"
], function (DownloadQueriesTracker, TabTracker, ConfigManager) {
    var config = ConfigManager.getInstance();

    function saveState(key) {
        var state = {};
        state.stateSaverTimestamp = Date.now();
        state.downloadQueries = DownloadQueriesTracker.getCurrentQueries();
        state.config = config.getCurrentConfig();
        state.tabState = TabTracker.getState();
        localStorage.setItem(key, JSON.stringify(state));
    }

    function loadState(key) {
        try {
            var state = JSON.parse(localStorage.getItem(key));
            DownloadQueriesTracker.restoreQueries(state.downloadQueries);
            config.safelyLoadConfig(state.config);
            TabTracker.setState(state.tabState);
            localStorage.removeItem(key);
        } catch (error) {
            console.error(
                "StateSaver: Could not load state object " + key + "\n",
                error
            );
        }
    }

    function clearOldStates(options) {
        var maxAge = (options && options.maxAge) || 60 * 60 * 1000; // default maxAge: 1 hour
        var currentTime = Date.now();

        // For each object in localStorage, flag for deletion if it is a stateSaver object and is older than maxAge
        var keysToDelete = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);

            var stateSaverTimestamp;
            try {
                var localStorageValue = JSON.parse(localStorage.getItem(key));
                stateSaverTimestamp = localStorageValue.stateSaverTimestamp;
            } catch (error) {
                continue;
            }

            var age = currentTime - stateSaverTimestamp;
            if (stateSaverTimestamp && age > maxAge) {
                keysToDelete.push(key);
            }
        }

        // Delete flagged localStorage objects
        keysToDelete.forEach(function (keyToDelete) {
            localStorage.removeItem(keyToDelete);
        });
    }

    return {
        saveState: saveState,
        loadState: loadState,
        clearOldStates: clearOldStates
    };
});
