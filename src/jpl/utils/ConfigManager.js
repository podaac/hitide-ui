define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/hash",
    "dojo/io-query",
    "dojo/topic",
    "jpl/utils/MakeSingletonUtil",
    "jpl/events/MapEvent",
    "jpl/events/SearchEvent",
    "jpl/events/BrowserEvent",
    "jpl/events/DownloadsEvent",
    "jpl/config/Config",
    "dijit/registry",
    "dojo/Deferred",
    "dojo/promise/all",
    "moment/moment",
    "jpl/dijit/ui/AlertDialog"
], function(declare, lang, array, hash, ioQuery, topic, MakeSingletonUtil,
    MapEvent, SearchEvent, BrowserEvent, DownloadsEvent, AppConfig, registry, Deferred, all, moment, AlertDialog) {
    return MakeSingletonUtil(
        declare(null, {


            appConfig: null,
            config: null,
            configurations: {}, // configuration map
            preferences: {}, // preferences map
            fullyrestored: false,
            lsConfigsName: "hitide-configurations",
            lsPrefsName: "hitide-preferences",
            configToLoad: null, // store config that might need to be loaded after some other request is finished
            mapReady: false,
            searchReady: false,


            constructor: function() {
                // Get appConfig instance
                this.appConfig = AppConfig.getInstance();
                // Init config
                this.config = this.newConfig({
                    id: this.generateRandomId()
                });

                // Init prefs
                this.preferences = this.newPrefs({});

                // Grab state from URL
                try {
                    var query = ioQuery.queryToObject(hash());
                    //Check for valid query
                    if (!query) throw "No query found";
                    if (typeof query !== "object") throw "Query object is invalid, not processing";
                    this.urlConfig = query;
                } catch (err) {
                    console.log(err);
                    new AlertDialog({
                        alertTitle: "Error",
                        alertMessage: "Unable to load configuration from URL."
                    }).startup();
                }

                // On map ready, load from URL
                var _context = this;

                // Check if localStorage is supported (all browsers do at this point..)
                var localStorageAvailable = this.checkLocalStorageAvailable();

                // Grab configurations from localStorage
                if (localStorageAvailable) {
                    this.getLocalStorageConfigurations().then(function(configs) {
                        _context.configurations = configs;
                    }, function(err) {
                        new AlertDialog({
                            alertTitle: "Error",
                            alertMessage: "Unable to read your previous configurations from your browser's local storage. Resetting."
                        }).startup();
                        _context.resetLSConfigs();
                    });
                    this.getLocalStoragePreferences().then(function(prefs) {
                        _context.ls_preferences = prefs;
                    }, function(err) {
                        new AlertDialog({
                            alertTitle: "Error",
                            alertMessage: "Unable to read your preferences from your browser's local storage. Resetting."
                        }).startup();
                        _context.resetLSPreferences();
                    });
                } else {
                    new AlertDialog({
                        alertTitle: "Alert",
                        alertMessage: "Your browser does not support local storage. You will not be able to save configurations in your browser, however you can still share and load configurations via URL."
                    }).startup();
                }


                all([this.createTopicPromise(SearchEvent.prototype.SEARCH_LOADED),
                    this.createTopicPromise(MapEvent.prototype.MAP_READY)
                ]).then(function(values) {
                    if (values[0].success) {
                        _context.allLoaded();
                    } else {
                        new AlertDialog({
                            alertTitle: "Error",
                            alertMessage: "Unable to load configuration, initial dataset listing not found."
                        }).startup();
                    }
                });
            },


            createTopicPromise: function(topicName) {
                var dfd = new Deferred();
                var handle = topic.subscribe(topicName, function(someValue) {
                    handle.remove();
                    dfd.resolve(someValue);
                });
                return dfd.promise;
            },


            checkLocalStorageAvailable: function() {
                var checkText = 'doesThisBrowserSupportLocalStorage';
                try {
                    localStorage.setItem(checkText, checkText);
                    localStorage.removeItem(checkText);
                    return true;
                } catch (e) {
                    return false;
                }
            },


            allLoaded: function() {
                this.loadConfig(this.urlConfig);
                this.setAppPreferencesFromLocalStorage(this.ls_preferences);
                topic.subscribe(MapEvent.prototype.MAP_MOVED, lang.hitch(this, this.onMapMoved));
                topic.subscribe(SearchEvent.prototype.DATE_CHANGE, lang.hitch(this, this.onDateChanged));
                // topic.subscribe(SearchEvent.prototype.END_DATE_CHANGE, lang.hitch(this, this.onEndDateChanged));
                topic.subscribe(SearchEvent.prototype.BBOX_CHANGE, lang.hitch(this, this.onBboxChanged));
                topic.subscribe(SearchEvent.prototype.ADD_DATASET, lang.hitch(this, this.onAddDataset));
                topic.subscribe(SearchEvent.prototype.REMOVE_DATASET, lang.hitch(this, this.onRemoveDataset));
                // topic.publish(BrowserEvent.prototype.CONFIG_READY);
                topic.subscribe(BrowserEvent.prototype.SAVE_CONFIG, lang.hitch(this, this.saveConfiguration));
                topic.subscribe(BrowserEvent.prototype.PREFERENCES_CHANGED, lang.hitch(this, this.onPreferencesChanged));
            },
            
            
            newConfig: function(args) {
                return {
                    id: args.id ? args.id : "",
                    name: args.name ? args.name : "",
                    version: args.version ? args.version : "0.1",
                    mapState_x: args.mapState_x ? args.mapState_x : "",
                    mapState_y: args.mapState_y ? args.mapState_y : "",
                    mapState_z: args.mapState_z ? args.mapState_z : "",
                    searchState_startDate: args.searchState_startDate || "",
                    searchState_endDate: args.searchState_endDate || "",
                    searchState_bbox: args.searchState_bbox ? args.searchState_bbox : "",
                    addedDatasets: args.addedDatasets ? args.addedDatasets.slice(0) : []
                };
            },
            
            
            newPrefs: function(args) {
                return {
                    showWelcomePage: args.hasOwnProperty("showWelcomePage") ? args.showWelcomePage : true
                }
            },
            
            
            generateRandomId: function() {
                // Generate random id
                var randId = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 6; i++) {
                    randId += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return randId;
            },


            resetLSConfigs: function() {
                // Clear localStorage configs
                localStorage.setItem(this.lsConfigsName, "");
            },
            
            
            resetLSPreferences: function() {
                // Clear localStorage preferences
                localStorage.setItem(this.lsPrefsName, "");
            },
            
            
            loadConfig: function(config) {
                this.config = this.newConfig(config);

                // Set components to config values
                this.setMapState();
                this.setSearchState();
                this.setAddedDatasets();

                // Set current config to new ID
                this.config.id = this.generateRandomId();

                this.fullyrestored = true;
            },

            safelyLoadConfig: function(config) {
                var _context = this;
                var handle = setInterval(function() {
                    if(_context.fullyrestored) {
                        _context.loadConfig(config);
                        clearInterval(handle);
                    }
                }, 100);
            },

            deleteConfig: function(config) {
                // Check to see if the config exists in the configs
                if (this.configurations[config.id]) {
                    delete this.configurations[config.id];
                    this.updateLocalStorageConfigurations();
                } else {
                    console.warn("Warning: Could not find config id " + config.id + " in configs");
                }
                topic.publish(BrowserEvent.prototype.CONFIG_UPDATED);

            },
            
            
            getLocalStorageConfigurations: function() {
                var val = localStorage.getItem(this.lsConfigsName);
                var deferred = new Deferred();
                if (!val) {
                    deferred.resolve({});
                } else {
                    var parsed;
                    try {
                        // Try to parse
                        parsed = JSON.parse(val);
                        if (!parsed) {
                            deferred.resolve({});
                        } else if (typeof parsed === "object") {
                            deferred.resolve(parsed);
                        } else {
                            deferred.reject();
                        }
                    } catch (e) {
                        console.warn("Invalid localStorage configurations, removing.");
                        deferred.reject();
                    }
                }
                return deferred.promise;
            },
            
            
            getLocalStoragePreferences: function() {
                var val = localStorage.getItem(this.lsPrefsName);
                var deferred = new Deferred();
                if (!val) {
                    deferred.resolve({});
                } else {
                    var parsed;
                    try {
                        // Try to parse
                        parsed = JSON.parse(val);
                        if (!parsed) {
                            deferred.resolve({});
                        } else if (typeof parsed === "object") {
                            deferred.resolve(parsed);
                        } else {
                            deferred.reject();
                        }
                    } catch (e) {
                        console.warn("Invalid localStorage preferences, removing.");
                        deferred.reject();
                    }
                }
                return deferred.promise;
            },
            
            
            updateLocalStorageConfigurations: function() {
                // Sets ls configs to manager configs.
                var s = JSON.stringify(this.configurations);
                localStorage.setItem(this.lsConfigsName, s);
            },
            
            
            updateUrl: function() {
                if (this.fullyrestored) {
                    // var endDate = this.config.searchState_endDate;
                    // this.config.searchState_startDate = "";
                    // this.config.searchState_endDate = "";
                    // var configCopy = lang.clone(this.config);
                    // this.config.searchState_startDate = startDate;
                    // this.config.searchState_endDate = endDate;
                    // configCopy.searchState_startDate = startDate ? startDate.format("YYYY-MM-DD") : "";
                    // configCopy.searchState_endDate = endDate ? endDate.format("YYYY-MM-DD") : "";
                    var queryString = ioQuery.objectToQuery(this.config);
                    hash(queryString, true);
                }
            },
            
            
            getPreferences: function() {
                return this.preferences;
            },
            
            
            getConfigurations: function() {
                return this.configurations;
            },


            getCurrentConfig: function() {
                return this.config;
            },   

            
            saveConfiguration: function(message) {
                // Save current configuration
                this.config.name = message.name;
                this.configurations[this.config.id] = this.newConfig(this.config);
                this.updateUrl();
                this.updateLocalStorageConfigurations();

                // Set current config to new ID
                this.config.id = this.generateRandomId();
            },
            
            
            setSearchState: function() {
                // Set start and end dates
                var startDate = this.config.searchState_startDate ? moment.utc(this.config.searchState_startDate).startOf("day") : "";
                var endDate = this.config.searchState_endDate ? moment.utc(this.config.searchState_endDate).startOf("day") : "";
                topic.publish(SearchEvent.prototype.DATE_CHANGE, {
                    startDate: startDate,
                    endDate: endDate,
                    noSearch: true,
                    origin: "config"
                });
                // }
                // if (this.config.searchState_bbox) {
                topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                    bbox: this.config.searchState_bbox,
                    origin: "config"
                });
                // }

                // search with reset
                topic.publish(SearchEvent.prototype.TRIGGER_SEARCH);
            },
            
            
            setAddedDatasets: function() {
                // Remove current datasets
                // this.searchGallery.deselectAllDatasets();

                if (!this.config.addedDatasets) {
                    return;
                }

                // Add new datasets by setting _datasetsToLoad in searchGallery.
                // This will be consumed by searchGallery upon search complete

                // Case of only 1 dataset
                if (typeof this.config.addedDatasets === "string") {
                    this.config.addedDatasets = [this.config.addedDatasets];
                }
                topic.publish(SearchEvent.prototype.SET_DATASETS_TO_LOAD, {
                    datasetsToLoad: this.config.addedDatasets
                })
            },

            
            validateFloatString: function(value) {
                return !/^\s*$/.test(value) && !isNaN(value);
            },
            
            
            setMapState: function(config) {
                // Set x,y,zoom
                if (!this.config.mapState_x || !this.config.mapState_y || !this.config.mapState_z) {
                    return;
                }
                if (!this.validateFloatString(this.config.mapState_x) || !this.validateFloatString(this.config.mapState_y) || !this.validateFloatString(this.config.mapState_z)) {
                    new AlertDialog({
                        alertTitle: "Error",
                        alertMessage: "Unable to load map state from this.configuration."
                    }).startup();
                } else {
                    topic.publish(MapEvent.prototype.CENTER_ZOOM_MAP_AT, {
                        x: this.config.mapState_x,
                        y: this.config.mapState_y,
                        zoom: this.config.mapState_z,
                        projection: this.appConfig.projection.EQUIRECT
                    });
                }
            },
            
            
            setAppPreferencesFromLocalStorage: function(preferences) {
                // Load prefs from ls
                this.preferences = this.newPrefs(preferences || {});
            },
            
            
            onPreferencesChanged: function(preferences) {
                // Update ls
                this.preferences = this.newPrefs(preferences);
                // console.log("UPDATING PREFS", this.preferences);
                localStorage.setItem(this.lsPrefsName, JSON.stringify(this.preferences));
            },
            
            
            onMapMoved: function(evt) {
                this.config.mapState_x = parseFloat(evt.extent.getCenter().x.toPrecision(8));
                this.config.mapState_y = parseFloat(evt.extent.getCenter().y.toPrecision(8));
                this.config.mapState_z = evt.zoom;
                this.updateUrl();
            },
            
            
            onDateChanged: function(message) {
                if (message.origin !== "config") {
                    this.config.searchState_startDate = message.startDate.format("YYYY-MM-DD");
                    this.config.searchState_endDate = message.endDate.format("YYYY-MM-DD");;
                    this.updateUrl();
                }
            },
            
            
            onBboxChanged: function(message) {
                this.config.searchState_bbox = message.bbox;
                this.updateUrl();
            },

            
            onAddDataset: function(message) {
                if (this.config.addedDatasets.indexOf(message.datasetId) === -1) {
                    this.config.addedDatasets.push(message.datasetId);
                }
                this.updateUrl();
            },

            
            onRemoveDataset: function(message) {
                var idx = this.config.addedDatasets.indexOf(message.datasetId);
                if (idx !== -1) {
                    this.config.addedDatasets.splice(idx, 1);
                }
                this.updateUrl();
            }


        })
    );
});
