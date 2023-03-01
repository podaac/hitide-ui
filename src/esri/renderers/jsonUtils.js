//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel", "./SimpleRenderer", "./UniqueValueRenderer", "./ClassBreaksRenderer"], function(f, g, h, c, d, e) {
    return {
        fromJson: function(a) {
            var b;
            switch (a.type || "") {
                case "simple":
                    b = new c(a);
                    break;
                case "uniqueValue":
                    b = new d(a);
                    break;
                case "classBreaks":
                    b = new e(a)
            }
            return b
        }
    }
});