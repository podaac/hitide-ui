(function () {
    // let the loader know where to look for packages
    var config = {
        baseUrl: './',
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
            'proj4js',
            'highcharts',
            'moment',
            'jquery',
            {name: 'bootstrap-tour', location: 'bootstrap-tour', main: 'Tour'},
            {name: 'use', location: 'use', main: 'use'},
            {name: 'highcharts', location: 'highcharts', main: 'highcharts'},
            {name: 'terraformer', location: 'terraformer'}
        ],

        parseOnLoad: false,
        async: true,
        use: {
            "highcharts/highcharts": {
                attach: "Highcharts"
            }
        },
        cacheBust: "v=@@VERSION",
        waitSeconds: 10
    };
    
    require(config, ['jquery/jquery','app']);
})();
