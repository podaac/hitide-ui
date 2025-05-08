var profile = {
    // This needs to be set so that the build system knows where to find the packages
    // relative to this file
    basePath: '../src/',

    action: 'release',

    // strip comments and combine css files.
    cssOptimize: 'comments',

    // optimizer engine for layer files
    layerOptimize: 'closure',

    // optimizer engine for all non-layer modules
    optimize: 'closure',

    // force to acme for now since that's what ESRI uses
    selectorEngine: 'acme',

    // strip all console calls
    //stripConsole: 'warn',

    pragmas: {
        debug: false
    },

    useSourceMaps: false,

    // use the smaller dojo framework set
    //mini: true,

    // build everything into one file
    layers: {
        'dojo/dojo': {
            include: [
                'dojo/dojo',
                'dojo/dnd/AutoSource',
                'dojo/dnd/Target',
                'dojox/gfx/path',
                'dojox/gfx/shape',
                'dojox/gfx/svg',
                'dojox/gfx/Mover',
                'dojox/gfx/Moveable',
                'dojo/i18n',
                'dijit/CheckedMenuItem',
                'dijit/PopupMenuItem',
                'dijit/TooltipDialog',
                'dijit/WidgetSet',
                'dijit/selection',
                'dijit/_base',
                'dijit/_base/focus',
                'dijit/_base/place',
                'dijit/_base/popup',
                'dijit/_base/scroll',
                'dijit/_base/sniff',
                'dijit/_base/typematic',
                'dijit/_base/wai',
                'dijit/_base/window',
                'dijit/form/ComboButton',
                'dijit/form/ToggleButton',
                'dijit/layout/StackController',
                'app/run',
                'esri/nls/jsapi',
                'xstyle/load-css'
            ],
            includeLocales: ['en-us'],
            customBase: true, // don't include all of the globals in dojo/main
            boot: true
        }
    },

    userConfig: {
        packages: ['app', 'dojo', 'dojox', 'dijit', 'xstyle', 'esri', 'jpl', 'bootstrap', 'put-selector']
    },

    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we do not need them in the build.
        'dojo-trace-api': false,
        'dojo-log-api': false,

        // This causes normally private loader data to be exposed for debugging. In a release build, we do not need
        // that either.
        'dojo-publish-privates': false,

        // We are not loading tests in production, so we can get rid of some test sniffing code.
        'dojo-test-sniff': false
    }
}
