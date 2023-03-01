define([
    "jpl/utils/LabelFormatter"
], function(LabelFormatter){

    describe("The LabelFormatter distance formatting", function() {
        var labelFormatter = new LabelFormatter();

        it("should append with 'm' label for values less than 1000 meters", function() {
            expect(labelFormatter.distanceLabelFromValue(100.32)).toBe("100.32 m");
            expect(labelFormatter.distanceLabelFromValue("100.32")).toBe("100.32 m");
            expect(labelFormatter.distanceLabelFromValue(17.54)).toBe("17.54 m");
            expect(labelFormatter.distanceLabelFromValue(-100.32)).toBe("-100.32 m");
            expect(labelFormatter.distanceLabelFromValue(-17.54)).toBe("-17.54 m");
        });

        it("should append with 'km' label for values greater than 1000 meters", function() {
            expect(labelFormatter.distanceLabelFromValue(1023.67798)).toBe("1.02 km");
            expect(labelFormatter.distanceLabelFromValue("1023.67798")).toBe("1.02 km");
            expect(labelFormatter.distanceLabelFromValue(95745.043)).toBe("95.75 km");
            expect(labelFormatter.distanceLabelFromValue(-1023.67798)).toBe("-1.02 km");
            expect(labelFormatter.distanceLabelFromValue(-95745.043)).toBe("-95.75 km");
        });
    });

    describe("The LabelFormatter decimal formatting", function() {
        var labelFormatter = new LabelFormatter();

        it("should format values to 2 decimal places by default", function() {
            expect(labelFormatter.decimalFormat(100.452871)).toBe(100.45);
            expect(labelFormatter.decimalFormat(17.84263)).toBe(17.84);
            expect(labelFormatter.decimalFormat("17.84263")).toBe(17.84);
        });

        it("should format values to 4 decimal places when specified", function() {
            expect(labelFormatter.decimalFormat(100.452871, 4)).toBe(100.4529);
            expect(labelFormatter.decimalFormat(17.84263, 4)).toBe(17.8426);
            expect(labelFormatter.decimalFormat("17.84263", "4")).toBe(17.8426);
        });

        it("should return original value if value is not a number", function() {
            expect(labelFormatter.decimalFormat("not a number")).toBe("invalid number");
        });
    });

    describe("The LabelFormatter unit conversions", function() {
        var labelFormatter = new LabelFormatter();

        it("should covert meters to feet with correct decimal format", function() {
            expect(labelFormatter.metersToFeet(45.43)).toBe(149.05);
            expect(labelFormatter.metersToFeet("45.43")).toBe(149.05);
            expect(labelFormatter.metersToFeet(85478.2256)).toBe(280440.38);
        });

        it("should return original value if not a number", function() {
            expect(labelFormatter.metersToFeet("not a number")).toBe("invalid number");
        });
    });

});