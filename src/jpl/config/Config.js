define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/request/xhr",
    "dojo/promise/all",
    "jpl/utils/MakeSingletonUtil",
    "jpl/utils/DOMUtil",
    "jpl/events/BrowserEvent",
    "jpl/data/Projection"
], function(declare, has, topic, lang, xhr, all, MakeSingletonUtil, DOMUtil, BrowserEvent, Projection) {
    return MakeSingletonUtil(declare("gov.nasa.jpl.config.Config", [], {
        siteTitle: "",
        basemapServiceURL: "",
        layersServiceURL: "",
        searchServiceURL: "",
        exploreServiceURL: "",
        elevationServiceURL: "",
        sunAngleServiceURL: "",
        stlServiceURL: "",
        projection: new Projection(),
        proxyEndpoint: "",
        terrainEndpoint: "",
        terrainProxyEndpoint: "",
        controls: null,
        tools: null,
        ellipsoidRadius: 0,
        elevationPoints: 0,
        layerOptions: null,
        hitide: null,
        configHasLoaded: false,

        constructor: function(configPath) {
            this.getConfiguration(configPath);
        },

        getConfigPath: function(configPath) {
            if (!configPath) {
                return "jpl/config/config.json";
            } else {
                return configPath;
            }
        },

        getConfiguration: function(configPath) {
            xhr(this.getConfigPath(configPath), {
                handleAs: "json"
            }).then(
                lang.hitch(this, this.initialize),
                lang.hitch(this, this.configError)
            );
        },

        configError: function(error) {
            console.log("Error retrieving configuration");
        },

        configComplete: function() {
            this.configHasLoaded = true;
            topic.publish(BrowserEvent.prototype.CONFIG_LOADED, null);
        },

        hasFinishedLoading: function() {
            return this.configHasLoaded;
        },

        initialize: function(mainConfig) {

            this.siteTitle = mainConfig.title;
            this.basemapServiceURL = mainConfig.services.basemapService;
            this.layersServiceURL = mainConfig.services.layersService;
            this.proxyEndpoint = mainConfig.services.proxyEndpoint;
            this.terrainEndpoint = mainConfig.services.terrainEndpoint;
            this.terrainProxyEndpoint = mainConfig.services.terrainProxyEndpoint;
            this.elevationDEMEndpoints = mainConfig.services.elevationDEMEndpoints;
            this.searchServiceURL = mainConfig.services.searchService;
            this.exploreServiceURL = mainConfig.services.exploreService;
            this.sunAngleServiceURL = mainConfig.services.sunAngleService;
            this.stlServiceURL = mainConfig.services.stlService;
            this.services = mainConfig.services;
            this.projection.N_POLE = mainConfig.projections.northpole;
            this.projection.S_POLE = mainConfig.projections.southpole;
            this.projection.EQUIRECT = mainConfig.projections.equirect;
            this.projection.LATLONG = mainConfig.projections.latlong;
            //set controls config
            this.controls = mainConfig.controls;
            //set tools config
            this.tools = mainConfig.tools;

            // Set application specific config
            this.hitide = mainConfig.hitide;
            // this.hitide.externalConfigurables = data.hitideExternalConfig;
            this.hitide.externalConfigurables = window.hitideConfig;


            if (typeof mainConfig.extents.equirect.xmin === 'string') {
                console.log("Please change config.json to use numbers and not strings for extents!");
            }

            //set north pole extent
            this.projection.setExtent(
                mainConfig.extents.northpole.xmin,
                mainConfig.extents.northpole.ymin,
                mainConfig.extents.northpole.xmax,
                mainConfig.extents.northpole.ymax,
                this.projection.N_POLE);

            //set south pole extent
            this.projection.setExtent(
                mainConfig.extents.southpole.xmin,
                mainConfig.extents.southpole.ymin,
                mainConfig.extents.southpole.xmax,
                mainConfig.extents.southpole.ymax,
                this.projection.S_POLE);

            //set equirect pole extent
            this.projection.setExtent(
                mainConfig.extents.equirect.xmin,
                mainConfig.extents.equirect.ymin,
                mainConfig.extents.equirect.xmax,
                mainConfig.extents.equirect.ymax,
                this.projection.EQUIRECT);

            //set north pole projection
            this.projection.setProjection(
                mainConfig.extents.northpole.wkid,
                mainConfig.extents.northpole.wkt,
                mainConfig.extents.northpole.proj4,
                this.projection.N_POLE);

            //set south pole projection
            this.projection.setProjection(
                mainConfig.extents.southpole.wkid,
                mainConfig.extents.southpole.wkt,
                mainConfig.extents.southpole.proj4,
                this.projection.S_POLE);

            //set equirect projection
            this.projection.setProjection(
                mainConfig.extents.equirect.wkid,
                mainConfig.extents.equirect.wkt,
                mainConfig.extents.equirect.proj4,
                this.projection.EQUIRECT);

            // set latlong projection
            // This is an optional projection. If all the other projections are in meters,
            // this defines a projection in lat long that those can be converted to.
            if (this.projection.LATLONG) {
                this.projection.setProjection(
                    mainConfig.extents.latlong.wkid,
                    mainConfig.extents.latlong.wkt,
                    mainConfig.extents.latlong.proj4,
                    this.projection.LATLONG);
            }

            this.ellipsoidRadius = mainConfig.ellipsoidRadius;
            this.elevationPoints = mainConfig.elevationPoints;
            this.layerOptions = mainConfig.layerOptions;

            // this.googleAnalyticsID = data.googleAnalyticsID;

            this.configComplete();
        }
    }));
});
