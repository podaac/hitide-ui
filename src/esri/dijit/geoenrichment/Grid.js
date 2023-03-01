//>>built
define(["../../declare", "dojo/dom-class", "dojo/dom-geometry", "dojo/dom-construct", "dijit/layout/_LayoutWidget"], function(l, h, m, n, p) {
    var f = l("esri.dijit.geoenrichment.Grid", [p], {
        _placeholder: null,
        layout: function() {
            for (var k = this.getChildren(), e = [], b = 0; b < this.rows.length; b++) e.push(0);
            h.add(this.domNode, "Grid_Measure");
            for (var c = [], b = 0; b < k.length; b++) {
                var a = k[b],
                    d = a.row,
                    a = a.domNode;
                a.style.position = "absolute";
                h.add(a, "GridCell_Measure");
                var l = a.scrollHeight;
                h.remove(a, "GridCell_Measure");
                a = l;
                c.push(a);
                a > e[d] && (e[d] = a)
            }
            d = m.getContentBox(this.domNode).h;
            h.remove(this.domNode, "Grid_Measure");
            b = this.rows;
            for (a = c = 0; a < e.length; a++) switch (b[a]) {
                case f.AUTO:
                    d -= e[a];
                    break;
                case f.STRETCH:
                case f.STACK:
                    c++
            }
            if (1 < c) throw Error("Multiple rows with flexible heights are not supported");
            c = [0];
            for (a = 0; a < e.length; a++) {
                var g;
                switch (b[a]) {
                    case f.AUTO:
                        g = e[a];
                        break;
                    case f.STRETCH:
                        g = d;
                        break;
                    case f.STACK:
                        g = Math.min(d, e[a])
                }
                c.push(c[a] + g)
            }
            for (b = 0; b < k.length; b++) a = k[b], d = a.row, e = c[d + 1] - c[d], g = a.domNode.style, g.top = c[d] + "px",
                g.height = e + "px";
            this._placeholder || (this._placeholder = n.create("div", null, this.domNode));
            this._placeholder.style.height = c[c.length - 1] + "px"
        }
    });
    f.AUTO = "auto";
    f.STRETCH = "stretch";
    f.STACK = "stack";
    return f
});