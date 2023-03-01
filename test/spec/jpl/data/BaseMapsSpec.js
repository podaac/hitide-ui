define([
    "jpl/data/BaseMaps"
], function(BaseMaps){

    describe("The BaseMap as a singleton", function() {
        var basemaps = BaseMaps.getInstance();

        it("should retain projection value", function() {
            //default values for new instance
            expect(basemaps.currentMapProjection).toBe("");

            //set the values and verify on this instance
            basemaps.currentMapProjection = "north pole";
            expect(basemaps.currentMapProjection).toBe("north pole");

            //get new singleton instance and verify data is still set
            var basemapsClone = BaseMaps.getInstance();
            expect(basemapsClone.currentMapProjection).toBe("north pole");
        });

        it("should retain map collections", function() {
            //set empty collection values
            basemaps.centerLayerList = [];
            basemaps.northLayerList = [];
            basemaps.southLayerList = [];
            expect(basemaps.centerLayerList).toEqual([]);
            expect(basemaps.northLayerList).toEqual([]);
            expect(basemaps.southLayerList).toEqual([]);

            basemaps.centerLayerList = [{name: "center-map", id: 1}];
            basemaps.northLayerList = [{name: "north-map", id: 2}];
            basemaps.southLayerList = [{name: "south-map", id: 3}];

            var basemapsClone = BaseMaps.getInstance();
            expect(basemapsClone.centerLayerList).toEqual([{name: "center-map", id: 1}]);
            expect(basemapsClone.northLayerList).toEqual([{name: "north-map", id: 2}]);
            expect(basemapsClone.southLayerList).toEqual([{name: "south-map", id: 3}]);
        });

    });

    describe("The BaseMap collections", function() {
        var basemaps = BaseMaps.getInstance(),
            projectionFixture = {
                EQUIRECT: "equirect",
                N_POLE: "n_pole",
                S_POLE: "s_pole"
            },
            layersFixture = [
            {
                "UUID": "12345",
                "Mission": "mission",
                "Instrument": "instrument",
                "ProductLabel": "product label",
                "ProductType": "product type",
                "ServiceProtocol": "service protocol",
                "EndPoint": "end point",
                "WMSEndPoint": "wms end point",
                "WMSLayer": "wms layers",
                "description": "description",
                "LayerTitle": "layer title",
                "LayerService": "layer service",
                "LayerProjection": "equirect",
                "ThumbnailImage": "thumbnail image",
                "bounding": {
                    "westbc": "west bounding",
                    "eastbc": "east bounding",
                    "northbc": "north bounding",
                    "southbc": "south bounding"
                }
            },
            {
                "UUID": "3456",
                "Mission": "mission",
                "Instrument": "instrument",
                "ProductLabel": "product label 2",
                "ProductType": "product type 2",
                "ServiceProtocol": "service protocol 2",
                "EndPoint": "end point 2",
                "WMSEndPoint": "wms end point 2",
                "WMSLayer": "wms layers",
                "description": "description",
                "LayerTitle": "layer title 2",
                "LayerService": "layer service 2",
                "LayerProjection": "n_pole",
                "ThumbnailImage": "thumbnail image 2",
                "bounding": {
                    "westbc": "west bounding 2",
                    "eastbc": "east bounding 2",
                    "northbc": "north bounding 2",
                    "southbc": "south bounding 2"
                }
            },
            {
                "UUID": "6789",
                "Mission": "mission",
                "Instrument": "instrument",
                "ProductLabel": "product label 3",
                "ProductType": "product type 3",
                "ServiceProtocol": "service protocol 3",
                "EndPoint": "end point 3",
                "WMSEndPoint": "wms end point 3",
                "WMSLayer": "wms layers",
                "description": "description",
                "LayerTitle": "layer title 3",
                "LayerService": "layer service 3",
                "LayerProjection": "s_pole",
                "ThumbnailImage": "thumbnail image 3",
                "bounding": {
                    "westbc": "west bounding 3",
                    "eastbc": "east bounding 3",
                    "northbc": "north bounding 3",
                    "southbc": "south bounding 3"
                }
            }];

        it("should accept an array of layers and sort them correctly", function() {
            //set empty collection values
            basemaps.centerLayerList = [];
            basemaps.northLayerList = [];
            basemaps.southLayerList = [];
            expect(basemaps.centerLayerList).toEqual([]);
            expect(basemaps.northLayerList).toEqual([]);
            expect(basemaps.southLayerList).toEqual([]);
            //set the collections
            basemaps.setAllLayers(layersFixture, projectionFixture);
            //validate collections were set correctly
            expect(basemaps.centerLayerList.length).toBe(1);
            expect(basemaps.centerLayerList[0].productLabel).toBe("product label");

            expect(basemaps.northLayerList.length).toBe(1);
            expect(basemaps.northLayerList[0].productLabel).toBe("product label 2");

            expect(basemaps.southLayerList.length).toBe(1);
            expect(basemaps.southLayerList[0].productLabel).toBe("product label 3");
        });

        it("should create a layer and set its properties", function() {
            //create the layer
            var layer = basemaps.createLayer(layersFixture[0]);
            //test the layer came back correctly
            expect(layer.uuid).toEqual("12345");
            expect(layer.mission).toEqual("mission");
            expect(layer.instrument).toEqual("instrument");
            expect(layer.mission).toEqual("mission");
            expect(layer.productLabel).toEqual("product label");
            expect(layer.productType).toEqual("product type");
            expect(layer.serviceProtocol).toEqual("service protocol");
            expect(layer.layerService).toEqual("layer service");
            expect(layer.endPoint).toEqual("end point");
            expect(layer.WMSEndPoint).toEqual("wms end point");
            expect(layer.WMSLayers).toEqual("wms layers");
            expect(layer.layerTitle).toEqual("layer title");
            expect(layer.description).toEqual("description");
            expect(layer.thumbnailImage).toEqual("thumbnail image");
            expect(layer.layerProjection).toEqual("equirect");
            expect(layer.boundingBox.west).toEqual("west bounding");
            expect(layer.boundingBox.east).toEqual("east bounding");
            expect(layer.boundingBox.north).toEqual("north bounding");
            expect(layer.boundingBox.south).toEqual("south bounding");
        });

        it("should request a layer by product label and projection", function() {
            //set the test collection
            basemaps.setAllLayers(layersFixture, projectionFixture);
            var productLabel = layersFixture[0].ProductLabel;
            var projection = layersFixture[0].LayerProjection;
            //get the layer from the product labe and projection
            var layer = basemaps.getLayerByProductLabel(productLabel, projection, projectionFixture);
            //test the layer came back correctly
            expect(layer.uuid).toEqual("12345");
            expect(layer.mission).toEqual("mission");
            expect(layer.instrument).toEqual("instrument");
            expect(layer.mission).toEqual("mission");
            expect(layer.productLabel).toEqual("product label");
            expect(layer.productType).toEqual("product type");
            expect(layer.serviceProtocol).toEqual("service protocol");
            expect(layer.layerService).toEqual("layer service");
            expect(layer.endPoint).toEqual("end point");
            expect(layer.WMSEndPoint).toEqual("wms end point");
            expect(layer.WMSLayers).toEqual("wms layers");
            expect(layer.layerTitle).toEqual("layer title");
            expect(layer.description).toEqual("description");
            expect(layer.thumbnailImage).toEqual("thumbnail image");
            expect(layer.layerProjection).toEqual("equirect");
        });
    });
});