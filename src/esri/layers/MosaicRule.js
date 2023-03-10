//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../lang", "../geometry/Point"], function(e, d, h, k, l, f, g) {
    var b = e(null, {
        declaredClass: "esri.layers.MosaicRule",
        method: null,
        where: null,
        sortField: null,
        sortValue: null,
        ascending: !1,
        lockRasterIds: null,
        viewpoint: null,
        objectIds: null,
        operation: null,
        constructor: function(a) {
            d.isObject(a) && (d.mixin(this, a), a.mosaicMethod && (this.method = a.mosaicMethod), this.method && "esri" !== this.method.toLowerCase().substring(0, 4) && (this.method =
                this._getMethodEnum(this.method)), a.mosaicOperation && (this.operation = a.mosaicOperation), this.operation && "MT_" !== this.operation.toUpperCase().substring(0, 3) && (this.operation = this._getOperatorEnum(this.operation)), a.fids && (this.objectIds = a.fids), a.viewpoint && (this.viewpoint = new g(a.viewpoint)))
        },
        toJson: function() {
            var a = {
                mosaicMethod: this.method,
                where: this.where,
                sortField: this.sortField,
                sortValue: this.sortValue,
                ascending: this.ascending,
                lockRasterIds: this.lockRasterIds,
                viewpoint: this.viewpoint ? this.viewpoint.toJson() : null,
                fids: this.objectIds,
                mosaicOperation: this.operation
            };
            return f.filter(a, function(a) {
                if (null !== a) return !0
            })
        },
        _getMethodEnum: function(a) {
            if (a) {
                var c = b.METHOD_NONE;
                switch (a.toLowerCase()) {
                    case "byattribute":
                        c = b.METHOD_ATTRIBUTE;
                        break;
                    case "center":
                        c = b.METHOD_CENTER;
                        break;
                    case "lockraster":
                        c = b.METHOD_LOCKRASTER;
                        break;
                    case "nadir":
                        c = b.METHOD_NADIR;
                        break;
                    case "northwest":
                        c = b.METHOD_NORTHWEST;
                        break;
                    case "seamline":
                        c = b.METHOD_SEAMLINE;
                        break;
                    case "viewpoint":
                        c = b.METHOD_VIEWPOINT
                }
                return c
            }
        },
        _getOperatorEnum: function(a) {
            if (a) switch (a.toLowerCase()) {
                case "first":
                    return b.OPERATION_FIRST;
                case "last":
                    return b.OPERATION_LAST;
                case "max":
                    return b.OPERATION_MAX;
                case "min":
                    return b.OPERATION_MIN;
                case "blend":
                    return b.OPERATION_BLEND;
                case "mean":
                    return b.OPERATION_MEAN
            }
        }
    });
    d.mixin(b, {
        METHOD_NONE: "esriMosaicNone",
        METHOD_CENTER: "esriMosaicCenter",
        METHOD_NADIR: "esriMosaicNadir",
        METHOD_VIEWPOINT: "esriMosaicViewpoint",
        METHOD_ATTRIBUTE: "esriMosaicAttribute",
        METHOD_LOCKRASTER: "esriMosaicLockRaster",
        METHOD_NORTHWEST: "esriMosaicNorthwest",
        METHOD_SEAMLINE: "esriMosaicSeamline",
        OPERATION_FIRST: "MT_FIRST",
        OPERATION_LAST: "MT_LAST",
        OPERATION_MIN: "MT_MIN",
        OPERATION_MAX: "MT_MAX",
        OPERATION_MEAN: "MT_MEAN",
        OPERATION_BLEND: "MT_BLEND"
    });
    return b
});