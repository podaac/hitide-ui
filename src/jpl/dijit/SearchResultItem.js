define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/query",
    "dojo/mouse",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/SearchResultItem.html',
    "jpl/data/Layers",
    "jpl/events/LayerEvent",
    "jpl/utils/MapUtil",
    "jpl/utils/AnimationUtil",
    "jpl/config/Config"
], function (declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, registry, _WidgetBase,
             _TemplatedMixin, template, Layers, LayerEvent, MapUtil, AnimationUtil, Config) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        layerOutline: null,
        layerAdded: false,

        constructor: function (layer) {
            this.layer = layer;
            this.config = Config.getInstance();
        },

        postCreate: function () {
        },

        startup: function () {
            this.mapDijit = registry.byId("mainSearchMap");

            domAttr.set(this.resultItemThumbnail, "src", this.layer.thumbnailImage);
            domAttr.set(this.resultItemTitle, "innerHTML", this.layer.layerTitle);
            domAttr.set(this.resultItemTeaser, "innerHTML", "Lorem ipsum dolor sit amet consectetur.");

            on(this.resultItem, mouse.enter, lang.hitch(this, this.onSearchItemMouseover));
            on(this.resultItem, mouse.leave, lang.hitch(this, this.onSearchItemMouseout));
            on(this.resultItem, "click", lang.hitch(this, this.addButtonClicked));
            on(this.resultItem, "dblclick", lang.hitch(this, this.addButtonDoubleClicked));
            on(this.resultItemActionsBtn, "click, dblclick", lang.hitch(this, this.actionsButtonClicked));
            on(this.resultItemFlyToBtn, "click", lang.hitch(this, this.flyToLayer));

            if(this.layerAdded) {
                domStyle.set(this.layerAddedLabel, "display", "block");
            }
        },

        addButtonClicked: function(evt) {
            this.addToMyData(evt);
        },

        addButtonDoubleClicked: function(evt) {
            this.addToMyData(evt);
            this.flyToLayer();
        },

        actionsButtonClicked: function(evt) {
            if(this.isCollapsed) {
                AnimationUtil.prototype.wipeInAnimation(this.resultItemActionsContainer);
                this.isCollapsed = false;
            } else {
                AnimationUtil.prototype.wipeOutAnimation(this.resultItemActionsContainer);
                this.isCollapsed = true;
            }

            evt.preventDefault();
            evt.stopPropagation();
        },

        addToMyData: function(evt) {
            //only add if it hasn't been added yet
            if(!registry.byId("myLayer_" + this.layer.productLabel)) {
                topic.publish(LayerEvent.prototype.ADD_TO_MY_DATA, {
                    productLabel: this.layer.productLabel, projection: this.layer.layerProjection, thumbnailURL: this.layer.thumbnailImage
                });
                domClass.add(this.resultItem, "layer-added");
                domStyle.set(this.layerAddedLabel, "display", "block");
            }
        },

        flyToLayer: function(evt) {
            MapUtil.prototype.checkAndSetMapProjection(this.layer.layerProjection, this.mapDijit.currentMapProjection);
            MapUtil.prototype.setMapExtent(this.layer.boundingBox.west, this.layer.boundingBox.south,
                this.layer.boundingBox.east, this.layer.boundingBox.north, this.getMap());

            evt.preventDefault();
            evt.stopPropagation();
        },

        onSearchItemMouseover: function(evt) {
            this.layerOutline = MapUtil.prototype.createLayerPolygon(this.layer, this.getMap(), "searchOutline_" + this.layer.productLabel);
        },

        onSearchItemMouseout: function(evt) {
            MapUtil.prototype.removeLayerPolygon(this.layerOutline, this.getMap());
        },

        getMap: function() {
            var map;
            //hack for now
            if(this.layer.layerProjection === this.config.projection.EQUIRECT) {
                map = this.mapDijit.equirectMap;
            } else if(this.layer.layerProjection === this.config.projection.N_POLE) {
                map = this.mapDijit.northPoleMap;
            } else if(this.layer.layerProjection === this.config.projection.S_POLE) {
                map = this.mapDijit.southPoleMap;
            }

            return map;
        },

        hideAddedLabel: function() {
            try{
                domStyle.set(this.layerAddedLabel, "display", "none");
                domClass.remove(this.resultItem, "layer-added");
            } catch(ex) {}
        },

        remove: function() {
            //hide tooltips so they dont get orphaned and stuck on the screen
            query(".tooltip").style("display", "none");

            this.destroy();
        }
    });
});