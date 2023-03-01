var hitideProfileBase = "https://localhost:8443";
var edlBase = "https://uat.urs.earthdata.nasa.gov";
var edlClientId = "dxpH2WeN_f8IpNLgHwplsg";
var l2ssBase = "https://podaac-tools.jpl.nasa.gov";
// var cmrBase = "https://localhost:8443/hitide/api/cmr";
var cmrBase = "https://cmr.uat.earthdata.nasa.gov";
var gtmId = "--";

window.hitideConfig = {
    datasetSearchService: l2ssBase + "/l2ss-services/l2ss/dataset/search",
    datasetMetadataService: l2ssBase + "/l2ss-services/l2ss/dataset/search",
    granuleSearchService: l2ssBase + "/l2ss-services/l2ss/granule/search",
    granuleAvailabilityService: l2ssBase + "/l2ss-services/l2ss/granule/availability",
    variableService: l2ssBase + "/l2ss-services/l2ss/dataset/variable",

    cmrDatasetSearchService: cmrBase + "/search/collections.json?tool_name=HiTIDE",
    cmrGranuleSearchService: cmrBase + "/search/granules.umm_json",
    cmrGranuleAvailabilityService: cmrBase,
    cmrVariableService: calculateCmrGraphqlUrl(cmrBase, hitideProfileBase),
    crossOriginCmrCookies: cmrBase.includes(hitideProfileBase),

    authCodeUrl: edlBase + "/oauth/authorize",

    loginUrl: hitideProfileBase + "/hitide/api/session/login",
    logoutUrl: hitideProfileBase + "/hitide/api/session/logout",
    getUserUrl: hitideProfileBase + "/hitide/api/session/user/",
    submitJobUrl: hitideProfileBase + "/hitide/api/jobs/submit",
    jobStatusUrl: hitideProfileBase + "/hitide/api/jobs/status",
    jobHistoryUrl: hitideProfileBase + "/hitide/api/jobs/history",
    disableJobUrl: hitideProfileBase + "/hitide/api/jobs/disable",
    crossOriginCookies: true,

    paletteService: "palettes",
    datasetSearchServiceItemsPerPage: 200,
    maxGranulesPerDownload: 999999999,
    googleTagManagerId: gtmId,
    earthDataAppClientId: edlClientId,
    showCloudMigrationDialog: false
};

function calculateCmrGraphqlUrl(cmrBase, hitideProfileBase) {
    return (
        cmrBase.includes(hitideProfileBase) ? cmrBase + "/graphql" :
        cmrBase.includes("uat") ? "https://graphql.uat.earthdata.nasa.gov/api" :
        cmrBase.includes("sit") ? "https://graphql.sit.earthdata.nasa.gov/api" :
        "https://graphql.earthdata.nasa.gov/api"
    );
}

