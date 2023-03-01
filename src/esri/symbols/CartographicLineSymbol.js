//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "./SimpleLineSymbol"], function(b, d, m, p, e, q, f, n) {
    var c = {
            STYLE_SOLID: "solid",
            STYLE_DASH: "dash",
            STYLE_DOT: "dot",
            STYLE_DASHDOT: "dashdot",
            STYLE_DASHDOTDOT: "longdashdotdot",
            STYLE_NULL: "none",
            STYLE_INSIDE_FRAME: "insideframe",
            STYLE_SHORTDASH: "shortdash",
            STYLE_SHORTDOT: "shortdot",
            STYLE_SHORTDASHDOT: "shortdashdot",
            STYLE_SHORTDASHDOTDOT: "shortdashdotdot",
            STYLE_LONGDASH: "longdash",
            STYLE_LONGDASHDOT: "longdashdot",
            CAP_BUTT: "butt",
            CAP_ROUND: "round",
            CAP_SQUARE: "square",
            JOIN_MITER: "miter",
            JOIN_ROUND: "round",
            JOIN_BEVEL: "bevel"
        },
        g = {
            color: [0, 0, 0, 1],
            style: c.STYLE_SOLID,
            width: 1,
            cap: c.CAP_BUTT,
            join: c.JOIN_MITER,
            miterLimit: 10
        };
    b = b(n, {
        declaredClass: "esri.symbol.CartographicLineSymbol",
        type: "cartographiclinesymbol",
        _caps: {
            butt: "esriLCSButt",
            round: "esriLCSRound",
            square: "esriLCSSquare"
        },
        _joins: {
            miter: "esriLJSMiter",
            round: "esriLJSRound",
            bevel: "esriLJSBevel"
        },
        constructor: function(a, b, c, h, k, l) {
            a ? d.isString(a) ? (this.style = a,
                b && (this.color = b), void 0 !== c && (this.width = c), h && (this.cap = h), k && (this.join = k), void 0 !== l && (this.miterLimit = l)) : (this.cap = f.valueOf(this._caps, a.cap), this.join = f.valueOf(this._joins, a.join), this.width = e.pt2px(a.width), this.miterLimit = e.pt2px(a.miterLimit)) : (d.mixin(this, g), this.color = new m(this.color), this.width = e.pt2px(this.width), this.miterLimit = e.pt2px(this.miterLimit))
        },
        setCap: function(a) {
            this.cap = a;
            return this
        },
        setJoin: function(a) {
            this.join = a;
            return this
        },
        setMiterLimit: function(a) {
            this.miterLimit =
                a;
            return this
        },
        getStroke: function() {
            return d.mixin(this.inherited("getStroke", arguments), {
                cap: this.cap,
                join: this.join === c.JOIN_MITER ? this.miterLimit : this.join
            })
        },
        getFill: function() {
            return null
        },
        getShapeDescriptors: function() {
            return {
                defaultShape: {
                    type: "path",
                    path: "M -15,0 L 15,0 E"
                },
                fill: null,
                stroke: this.getStroke()
            }
        },
        toJson: function() {
            var a = e.px2pt(this.miterLimit),
                a = isNaN(a) ? void 0 : a;
            return f.fixJson(d.mixin(this.inherited("toJson", arguments), {
                type: "esriCLS",
                cap: this._caps[this.cap],
                join: this._joins[this.join],
                miterLimit: a
            }))
        }
    });
    d.mixin(b, c);
    b.defaultProps = g;
    return b
});