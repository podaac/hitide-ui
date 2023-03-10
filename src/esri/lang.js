//>>built
define(["dojo/_base/array", "dojo/_base/json", "dojo/_base/kernel", "dojo/_base/lang", "dojo/date", "dojo/has", "dojo/number", "dojo/date/locale", "./kernel"], function(l, p, q, g, r, v, s, t, w) {
    function h(b) {
        return void 0 !== b && null !== b
    }

    function m(b, d, a) {
        var c = a.match(/([^\(]+)(\([^\)]+\))?/i),
            e = g.trim(c[1]);
        a = d[b];
        var c = p.fromJson((c[2] ? g.trim(c[2]) : "()").replace(/^\(/, "({").replace(/\)$/, "})")),
            f = c.utcOffset;
        if (-1 === l.indexOf(u, e)) e = g.getObject(e), g.isFunction(e) && (a = e(a, b, d));
        else if ("number" === typeof a || "string" ===
            typeof a && a && !isNaN(Number(a))) switch (a = Number(a), e) {
            case "NumberFormat":
                return s.format(a, c);
            case "DateString":
                b = new Date(a);
                if (c.local || c.systemLocale) return c.systemLocale ? b.toLocaleDateString() + (c.hideTime ? "" : " " + b.toLocaleTimeString()) : b.toDateString() + (c.hideTime ? "" : " " + b.toTimeString());
                b = b.toUTCString();
                c.hideTime && (b = b.replace(/\s+\d\d\:\d\d\:\d\d\s+(utc|gmt)/i, ""));
                return b;
            case "DateFormat":
                return b = new Date(a), h(f) && (b = r.add(b, "minute", b.getTimezoneOffset() - f)), t.format(b, c)
        }
        return h(a) ?
            a : ""
    }

    function n(b, d) {
        var a;
        if (d)
            for (a in b) b.hasOwnProperty(a) && (void 0 === b[a] || null === b[a] ? delete b[a] : b[a] instanceof Object && n(b[a], !0));
        else
            for (a in b) b.hasOwnProperty(a) && void 0 === b[a] && delete b[a];
        return b
    }
    var u = ["NumberFormat", "DateString", "DateFormat"];
    return {
        valueOf: function(b, d) {
            for (var a in b)
                if (b[a] == d) return a;
            return null
        },
        substitute: function(b, d, a) {
            var c, e, f;
            h(a) && (g.isObject(a) ? (c = a.first, e = a.dateFormat, f = a.numberFormat) : c = a);
            if (!d || "${*}" === d) {
                d = [];
                for (var k in b) {
                    a = b[k];
                    if (e && -1 !==
                        l.indexOf(e.properties || "", k)) a = m(k, b, e.formatter || "DateString");
                    else if (f && -1 !== l.indexOf(f.properties || "", k)) a = m(k, b, f.formatter || "NumberFormat");
                    d.push(k + " \x3d " + (h(a) ? a : "") + "\x3cbr/\x3e");
                    if (c) break
                }
                return d.join("")
            }
            return g.replace(d, g.hitch({
                obj: b
            }, function(b, a) {
                var c = a.split(":");
                return 1 < c.length ? (a = c[0], c.shift(), m(a, this.obj, c.join(":"))) : e && -1 !== l.indexOf(e.properties || "", a) ? m(a, this.obj, e.formatter || "DateString") : f && -1 !== l.indexOf(f.properties || "", a) ? m(a, this.obj, f.formatter || "NumberFormat") :
                    h(this.obj[a]) ? this.obj[a] : ""
            }), /\$\{([^\}]+)\}/g)
        },
        filter: function(b, d, a) {
            d = [g.isString(b) ? b.split("") : b, a || q.global, g.isString(d) ? new Function("item", "index", "array", d) : d];
            a = {};
            var c;
            b = d[0];
            for (c in b) d[2].call(d[c], b[c], c, b) && (a[c] = b[c]);
            return a
        },
        isDefined: h,
        fixJson: n
    }
});