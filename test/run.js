(function () {
    // let the loader know where to look for packages
    var config = {
        baseUrl: '../src',
        packages: [
            'dojo',
            'dijit',
            'dojox',
            'dgrid',
            'put-selector',
            'xstyle',
            'app',
            'esri',
            'jpl',
            'bootstrap',
            'cesium',
            'bootstrap-tour',
            { name: 'jquery', location: 'jquery', main: 'jquery' },
            { name: 'specs', location: '../test/spec'}
        ],
        parseOnLoad: false,
        async: true,
        has: {
            'config-control-search': true,
            'config-control-login': false,
            'config-control-help': true,
            'config-control-layers': true,
            'config-control-explore': false,
            'config-control-tools': true,
            'config-control-projection': true,
            'config-control-basemaps': false
        },
        cacheBust: "v=0.9",
        waitSeconds: 10
    };

    require(config, [
        "specs/jpl/utils/LabelFormatterSpec"
    ]);
})();
