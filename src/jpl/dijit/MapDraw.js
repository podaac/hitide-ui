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
    "dojo/fx",
    "dojo/fx/Toggler",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/MapDraw.html',
    "xstyle/css!./css/MapDraw.css",
    "jpl/data/Layers",
    "jpl/events/LayerEvent",
    "jpl/events/MapEvent",
    "jpl/events/SearchEvent",
    "jpl/utils/MapUtil",
    "jpl/utils/AnimationUtil",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "esri/toolbars/edit"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, coreFx, Toggler, registry,
    _WidgetBase, _TemplatedMixin, template, css, Layers, LayerEvent, MapEvent, SearchEvent, MapUtil, AnimationUtil,
    Graphic, Point, Polygon, SimpleFillSymbol, SimpleLineSymbol, Color, Draw, Edit) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        toggler: null,
        tmpBboxGraphic: null,
        bboxGraphic: null,

        constructor: function(layer) {
            //this.layer = layer;
        },

        postCreate: function() {},

        startup: function() {
            this.mapDijit = registry.byId("mainSearchMap");
            this.map = this.mapDijit.equirectMap;

            // Init draw/edit tools
            this.toolbar = new Draw(this.map);
            this.editToolbar = new Edit(this.map);
            this.fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.85]), 2),
                new Color([255, 0, 0, 0.10])
            );
            this.toolbar.fillSymbol = this.fillSymbol;
            // Add graphics to map when draw complete
            on(this.toolbar, "draw-end", lang.hitch(this, this.drawEnd));
            // on(this.mapDrawShape,"click",)

            this.toggler = new Toggler({
                node: this.mapDrawContainer,
                showFunc: coreFx.wipeIn,
                hideFunc: coreFx.wipeOut
            });
            this.toggler.hide();

            on(this.mapDrawCancel, "click", lang.hitch(this, this.cancel));
            on(this.mapDrawConfirm, "click", lang.hitch(this, this.confirm));
            on(this.mapDrawShape, "click", lang.hitch(this, this.enableDrawMode));
            on(this.mapDrawEdit, "click", lang.hitch(this, this.enableEditMode));
        },

        confirm: function(evt) {
            topic.publish(SearchEvent.prototype.CONFIRM_MAP_DRAW, {
                bbox: this.tmpBboxGraphic,
                origin: "mapDraw"
            });
            this.hide();
        },

        cancel: function(evt) {
            topic.publish(SearchEvent.prototype.CANCEL_MAP_DRAW, null);
            this.hide();
        },

        drawEnd: function(evt) {
            this.toolbar.deactivate();
            if (!this.tmpBboxGraphic) {
                this.tmpBboxGraphic = new Graphic(evt.geometry, this.fillSymbol);
                this.map.graphics.add(this.tmpBboxGraphic);
            } else {
                this.tmpBboxGraphic.setGeometry(evt.geometry);
            }
            // Jump to edit mode
            this.tmpBboxGraphic.show();
            this.enableEditMode()
        },

        enableDrawMode: function() {
            // Deactivate Edit Mode
            this.editToolbar.deactivate();
            // Reset and activate draw mode
            this.toolbar.deactivate();
            this.toolbar.activate(Draw["RECTANGLE"]);
            domClass.add(this.mapDrawShape, "activeMapDrawIcon");
            domClass.remove(this.mapDrawEdit, "activeMapDrawIcon");
        },

        enableEditMode: function() {
            // Disable and redirect to draw mode if there's nothing to edit
            if (!this.tmpBboxGraphic) {
                this.enableDrawMode();
                return;
            }
            this.toolbar.deactivate();

            this.editToolbar.activate(Edit.SCALE | Edit.MOVE, this.tmpBboxGraphic);
            domClass.remove(this.mapDrawShape, "activeMapDrawIcon");
            domClass.add(this.mapDrawEdit, "activeMapDrawIcon");
        },

        show: function(bboxGraphic) {
            // Show the widget
            this.toggler.show();
            this.bboxGraphic = bboxGraphic;

            // If there's already a bbox, go into edit mode
            if (this.bboxGraphic) {
                // Hide the master bbox graphic
                this.bboxGraphic.hide();
                // Set tmpBboxGraphic to copy of master bbox graphic
                if (this.tmpBboxGraphic) {
                    // If we already have a tmpBboxGraphic, set geometry
                    this.tmpBboxGraphic.setGeometry(this.bboxGraphic.geometry);
                } else {
                    this.tmpBboxGraphic = new Graphic(this.bboxGraphic.geometry, this.fillSymbol);
                    this.map.graphics.add(this.tmpBboxGraphic);
                }
                this.tmpBboxGraphic.show();
                this.enableEditMode();
            } else {
                this.enableDrawMode();
            }
        },

        hide: function() {
            if (this.bboxGraphic) {
                this.bboxGraphic.show();
            }
            if (this.tmpBboxGraphic) {
                this.tmpBboxGraphic.hide();
            }
            this.toolbar.deactivate();
            this.editToolbar.deactivate();
            this.toggler.hide();
        }
    });
});
