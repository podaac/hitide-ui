define([
    "app/App",
    "dojo/dom",
    "dojo/topic",
    "jpl/config/Config",
    "jpl/events/BrowserEvent",
    "dojo/domReady!"
], function(App, dom, topic, Config, BrowserEvent) {

    var cfg = Config.getInstance();

    if(cfg.hasFinishedLoading()) {
        var app = new App({}, dom.byId('appDiv'));
        app.startup();
    } else {
        topic.subscribe(BrowserEvent.prototype.CONFIG_LOADED, function() {
            var app = new App({}, dom.byId('appDiv'));
            app.startup();
        });
    }
});
