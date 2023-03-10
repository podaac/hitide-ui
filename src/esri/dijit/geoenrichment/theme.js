//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/Evented", "dojo/dom-class", "dojo/dom-construct", "./dom", "dojo/query", "dojo/Deferred", "../../extend"], function(g, d, k, l, f, m, n, p, q, r) {
    function h(c, a) {
        for (var b in a) try {
            c[b] = a[b].constructor == Object ? h(c[b], a[b]) : a[b]
        } catch (e) {
            c[b] = a[b]
        }
        return c
    }
    var e = "common";
    d = new(d([l], {
        set: function(c, a) {
            if (a && "common" != a) {
                var b = g.toUrl("./themes/" + a + "/main.css");
                p("link").some(function(a) {
                    return -1 < a.href.toLowerCase().indexOf(b)
                }) || m.create("link", {
                    rel: "stylesheet",
                    href: b
                }, n.head())
            }
            this.change(c, e, a);
            e = a;
            this.emit("change")
        },
        get: function() {
            return e
        },
        load: function(c) {
            function a() {
                f && f.remove();
                b.resolve(d)
            }
            var b = new q,
                d = null,
                f = g.on("error", a);
            g(["./themes/common/" + c], function(b) {
                d = k.clone(b);
                !e || "common" == e ? a() : g(["./themes/" + e + "/" + c], function(b) {
                    h(d, b);
                    a()
                })
            });
            return b.promise
        },
        change: function(c, a, b) {
            a && "common" != a && f.remove(c, a);
            b && "common" != b && f.add(c, b)
        }
    }));
    r("esri.dijit.geoenrichment.theme", d);
    return d
});