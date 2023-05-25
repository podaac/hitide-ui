define([
    "dojox/string/sprintf"
], function (sprintf) {

    return {

        extractNumbersFromString: function(string) {
            return string.match(/-?\d+(\.\d+)?/g).map(Number);
        },
        
        convertEnvelopeStringToPolygonString: function(envelopeString) {
            var numbers = this.extractNumbersFromString(envelopeString);

            var polygonString = sprintf(
                "POLYGON ((%d %d, %d %d, %d %d, %d %d, %d %d))",
                numbers[0], numbers[2],
                numbers[1], numbers[2],
                numbers[1], numbers[3],
                numbers[0], numbers[3],
                numbers[0], numbers[2]
            );
            return polygonString;
        },

        isEnvelope: function(granuleMetadata) {
            return /envelope/i.test(granuleMetadata["Granule-Footprint"]);
        },

        convertFootprintsAndExtentsFromEnvelopeToPolygon: function(granuleMetadata) {
            if( this.isEnvelope(granuleMetadata) ) {
                granuleMetadata["Granule-Footprint"] = this.convertEnvelopeStringToPolygonString(granuleMetadata["Granule-Footprint"]);
                granuleMetadata["Granule-Extent"] = granuleMetadata["Granule-Footprint"];
            }
        },

        getPairs: function(footprint_data_array){
            var pairs = [];
            for(var i=0; i<footprint_data_array.length; i++){
                pairs.push(footprint_data_array[i]['Longitude'] + " " + footprint_data_array[i]['Latitude']);
            }
            return pairs
        },

        convertToPolygonStringCMR: function(footprint_data){
            var footprint_data_array, pairs, polygonString;
            var polygonArray = []
            for(var i=0; i< footprint_data.length; i++){

                exclusivePolygonString = null;
                if('ExclusiveZone' in footprint_data[i]){
                    exclusiveZone = footprint_data[i]['ExclusiveZone'];
                    exclusiveZoneArray = [];

                    for(var j=0; j<exclusiveZone['Boundaries'].length; j++){
                        exclusiveZonePoints = footprint_data[i]['ExclusiveZone']['Boundaries'][j]['Points'];
                        exclusivePairs = this.getPairs(exclusiveZonePoints);
                        exclusivePolygonString = sprintf("(%s)", exclusivePairs.join(", "));
                        exclusiveZoneArray.push(exclusivePolygonString);
                    }
                }

                footprint_data_array = footprint_data[i]['Boundary']['Points'];
                pairs = this.getPairs(footprint_data_array);

                if(exclusivePolygonString != null){
                    outerPolygon = sprintf("(%s)", pairs.join(", "));
                    innerHoles = sprintf("%s", exclusiveZoneArray.join(", "));
                    polygonString = sprintf("(%s,%s)", outerPolygon, innerHoles);
                    polygonArray.push(polygonString);
                }
                else{
                    polygonString = sprintf("((%s))", pairs.join(", "));
                    polygonArray.push(polygonString);
                }

            }
            var multiPolygonString = sprintf("MULTIPOLYGON (%s)", polygonArray.join(", "));
            return multiPolygonString;
        },

        convertToLineStringCMR: function(footprint_data){
            var footprint_data_array, pairs, lineString;
            var lineArray = []
            for(var i=0; i< footprint_data.length; i++){
                footprint_data_array = footprint_data[i]['Points'];
                pairs = this.getPairs(footprint_data_array);
                lineString = sprintf("(%s)", pairs.join(", "));
                lineArray.push(lineString);
            }
            var multiLineString = sprintf("MULTILINESTRING (%s)", lineArray.join(", "));
            return multiLineString;
        },

        convertBoundingRectanglesToPolygonStringCMR: function(footprint_data){
            var footprint_data_array, polygonString;
            var polygonArray = []
            for(var i=0; i< footprint_data.length; i++){
                footprint_data_array = footprint_data[i];
                polygonString = sprintf(
                    "((%d %d, %d %d, %d %d, %d %d, %d %d))",
                    footprint_data_array["EastBoundingCoordinate"], footprint_data_array["NorthBoundingCoordinate"],
                    footprint_data_array["WestBoundingCoordinate"], footprint_data_array["NorthBoundingCoordinate"],
                    footprint_data_array["WestBoundingCoordinate"], footprint_data_array["SouthBoundingCoordinate"],
                    footprint_data_array["EastBoundingCoordinate"], footprint_data_array["SouthBoundingCoordinate"],
                    footprint_data_array["EastBoundingCoordinate"], footprint_data_array["NorthBoundingCoordinate"]
                );
                polygonArray.push(polygonString);
            }
            var multiPolygonString = sprintf("MULTIPOLYGON (%s)", polygonArray.join(", "));
            return multiPolygonString;
        },

        convertFootprintAndImageFromCMR: function(granuleMetadata){
            try{
                if(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["GPolygons"]){
                    granuleMetadata["Granule-Footprint"] = this.convertToPolygonStringCMR(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["GPolygons"]);
                    granuleMetadata["Granule-Extent"] = granuleMetadata["Granule-Footprint"];
                }
                else if(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["Lines"]){
                    granuleMetadata["Granule-Footprint"] = this.convertToLineStringCMR(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["Lines"]);
                    granuleMetadata["Granule-Extent"] = granuleMetadata["Granule-Footprint"];
                }
                else if(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["BoundingRectangles"]){
                    granuleMetadata["Granule-Footprint"] = this.convertBoundingRectanglesToPolygonStringCMR(granuleMetadata["umm"]["SpatialExtent"]["HorizontalSpatialDomain"]["Geometry"]["BoundingRectangles"]);
                    granuleMetadata["Granule-Extent"] = granuleMetadata["Granule-Footprint"];
                }
                else{
                    granuleMetadata["Granule-Footprint"] = false;
                }

            }
            catch(err){
                granuleMetadata["Granule-Footprint"] = false;
            }

            try{
                var relatedUrls = granuleMetadata.umm.RelatedUrls;
                var has_image = false;
                for(i=0; i < relatedUrls.length; i++){
                    objectURL = relatedUrls[i]['URL'];
                    if(objectURL.includes('.png')){
                        has_image = true;
                    }
                }
                granuleMetadata['has_image'] = has_image;
            }
            catch(err){
                granuleMetadata['has_image'] = false;
            }

        }

    };

});