var hitideProfileOrigin = "https://hitide.profile.podaac.earthdatacloud.nasa.gov/hitide/api";

window.hitideConfig = {
    datasetSearchService: "https://podaac-tools.jpl.nasa.gov/l2ss-services/l2ss/dataset/search",
    datasetMetadataService: "https://podaac-tools.jpl.nasa.gov/l2ss-services/l2ss/dataset/search",
    granuleSearchService: "https://podaac-tools.jpl.nasa.gov/l2ss-services/l2ss/granule/search",
    granuleAvailabilityService: "https://podaac-tools.jpl.nasa.gov/l2ss-services/l2ss/granule/availability",
    variableService: "https://podaac-tools.jpl.nasa.gov/l2ss-services/l2ss/dataset/variable",
    paletteService: "https://hitide.podaac.earthdatacloud.nasa.gov/palettes",

    cmrDatasetSearchService: hitideProfileOrigin + "/cmr/search/collections.json?tool_name=HiTIDE",
    cmrGranuleSearchService: hitideProfileOrigin + "/cmr/search/granules.umm_json",
    cmrGranuleAvailabilityService: hitideProfileOrigin + "/cmr",
    cmrVariableService: hitideProfileOrigin + "/cmr/graphql",
    crossOriginCmrCookies: true,

    authCodeUrl: "https://urs.earthdata.nasa.gov/oauth/authorize",

    loginUrl: hitideProfileOrigin + "/session/login",
    logoutUrl: hitideProfileOrigin + "/session/logout",
    getUserUrl: hitideProfileOrigin + "/session/user/",
    submitJobUrl: hitideProfileOrigin + "/jobs/submit",
    jobStatusUrl: hitideProfileOrigin + "/jobs/status",
    jobHistoryUrl: hitideProfileOrigin + "/jobs/history",
    disableJobUrl: hitideProfileOrigin + "/jobs/disable",
    crossOriginCookies: true,

    datasetSearchServiceItemsPerPage: 200,
    maxGranulesPerDownload: 999999999,
    googleTagManagerId: "GTM-WNP7MLF",
    earthDataAppClientId: "7cglnEBy7FkeXMzrflGY4Q"
};