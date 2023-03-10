//>>built
define(["../../declare", "dojo/_base/array", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/sniff", "dojo/on", "dojo/Deferred"], function(m, r, n, d, s, g, p, q) {
    var k, l;
    l = 29 <= g("chrome") || 23 <= g("ff") || 6 <= g("safari") || 10 <= g("ie");
    k = function(a, e) {
        for (var c = function(a) {
            var c = a.type;
            k = c;
            for (var d in b) d !== c && (b[d].remove(), delete b[d]);
            e.apply(this, arguments)
        }, b = {}, d = ["animationend", "webkitAnimationEnd"], f = 0; f < d.length; f++) b[d[f]] = p(a, d[f], c);
        return {
            remove: function() {
                for (var a in b) b[a].remove()
            }
        }
    };
    var t =
        m(null, {
            _oldNode: null,
            _targets: null,
            _deferred: null,
            start: function(a, e) {
                this._oldNode = e;
                this._deferred = new q;
                if (!l) return this.finish(), this._deferred.promise;
                this._targets = a;
                p.once(a[0].node, k, n.hitch(this, this.finish));
                for (var c = 0; c < a.length; c++) {
                    var b = a[c];
                    d.add(b.node, b.classes);
                    d.add(b.node, "Anim_Common")
                }
                return this._deferred.promise
            },
            finish: function() {
                if (this._targets) {
                    for (var a = 0; a < this._targets.length; a++) {
                        var e = this._targets[a];
                        d.remove(e.node, e.classes);
                        d.remove(e.node, "Anim_Common")
                    }
                    this._targets =
                        null
                }
                this._oldNode && (s.destroy(this._oldNode), this._oldNode = null);
                this._deferred.resolve()
            }
        });
    return m(null, {
        progress: null,
        _items: null,
        _flySurfaceNode: null,
        constructor: function(a) {
            this._flySurfaceNode = a;
            this._items = []
        },
        start: function(a, d) {
            var c = new t;
            this._items.push(c);
            this.progress || (this.progress = new q);
            return c.start(a, d).then(n.hitch(this, this._onItemFinished, c))
        },
        _onItemFinished: function(a) {
            a = r.indexOf(this._items, a);
            0 <= a && (this._items.splice(a, 1), 0 === this._items.length && this.progress && (this.progress.resolve(),
                this.progress = null))
        },
        finish: function() {
            for (var a = this._items; 0 < a.length;) a[a.length - 1].finish()
        },
        fly: function(a, e, c) {
            var b = a.cloneNode(!0);
            c || (c = ["top", "left"]);
            if (!l) return b;
            a = a.getBoundingClientRect();
            var g = this._flySurfaceNode.getBoundingClientRect();
            d.add(b, "Anim_FlyingObj");
            for (var f = 0; f < c.length; f++) {
                var h = c[f];
                b.style[h] = ("right" === h || "bottom" === h ? -1 : 1) * (a[h] - g[h]) + "px"
            }
            this._flySurfaceNode.appendChild(b);
            this.start([{
                node: b,
                classes: [e]
            }], b);
            return b
        }
    })
});