var hitideProfileOrigin = "https://hitide.profile.podaac.sit.earthdatacloud.nasa.gov/hitide/api";

window.hitideConfig = {
    paletteService: "https://hitide.podaac.sit.earthdatacloud.nasa.gov/palettes",

    cmrDatasetSearchService: hitideProfileOrigin + "/cmr/search/collections.json?tool_name=HiTIDE",
    cmrGranuleSearchService: hitideProfileOrigin + "/cmr/search/granules.umm_json",
    cmrCollectionSearchService: hitideProfileOrigin + "/cmr/search/concepts",
    cmrGranuleAvailabilityService: hitideProfileOrigin + "/cmr",
    cmrVariableService: hitideProfileOrigin + "/cmr/graphql",
    crossOriginCmrCookies: true,

    authCodeUrl: "https://uat.urs.earthdata.nasa.gov/oauth/authorize",

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
    googleTagManagerId: "GTM-M5D83V6",
    earthDataAppClientId: "dxpH2WeN_f8IpNLgHwplsg"
};