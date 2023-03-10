//>>built
define(["require", "dojo/aspect", "dojo/_base/array", "dojo/_base/lang", "dojo/Deferred", "dojo/when"], function(g, h, k, n, l, m) {
    function b() {
        h.after(this.constructor._meta, "ctor", this._pluginsHandler, !0);
        this._plugins = {}
    }
    b.prototype = {
        addPlugin: function(c, a) {
            var f = this,
                e = this._plugins,
                d = new l;
            try {
                g([c], function(b) {
                    c in e || (e[c] = b, m(b.add(f, a), function() {
                        var a = {
                            id: b.declaredId || c.replace(/\//g, ".")
                        };
                        f.emit("plugin-add", a);
                        d.resolve(a)
                    }, function(a) {
                        d.reject(a)
                    }))
                })
            } catch (b) {
                d.reject(b)
            }
            return d.promise
        },
        removePlugin: function(c) {
            if (c in
                this._plugins) {
                var a = this._plugins[c];
                a.remove(this);
                delete this._plugins[c];
                this.emit("plugin-remove", {
                    id: a.declaredId || c.replace(/\//g, ".")
                })
            }
        },
        _pluginsHandler: function() {
            var c = this;
            k.some(arguments, function(a) {
                if (a && a.plugins && a.plugins instanceof Array) {
                    a = a.plugins;
                    for (var b, e, d = 0; d < a.length; d++) b = a[d], e = b instanceof Object ? b.id : b, c.addPlugin(e, b.options);
                    return !0
                }
            })
        }
    };
    return b
});