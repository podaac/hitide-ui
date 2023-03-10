//>>built
define(["dojo/Evented", "dojo/_base/declare", "dojo/Deferred", "dojo/_base/lang", "dojo/dom-construct", "../sniff", "../kernel", "../urlUtils", "require"], function(l, p, h, e, r, q, s, k, g) {
    var m = window.Blob || window.webkitBlob || window.mozBlob,
        n = window.URL || window.webkitURL || window.mozURL;
    return p([l], {
        declaredClass: "esri.workers.WorkerClient",
        worker: null,
        returnDeferreds: !1,
        _queue: null,
        constructor: function(a, c) {
            this._isIE = q("ie");
            this.returnDeferreds = !!c;
            this._queue = {};
            this._acceptMessage = e.hitch(this, this._acceptMessage);
            this._errorMessage = e.hitch(this, this._errorMessage);
            a && (this.worker = this.setWorker(a))
        },
        setWorker: function(a) {
            if (a instanceof Array) {
                var c = a;
                a = c.shift()
            }
            a = this._getUrl(a);
            var b = g.isXdUrl(a),
                d;
            if (!1 === a) return console.log("Can not resolve worker path"), !1;
            this.worker && (d = this.worker, d.removeEventListener("message", this._acceptMessage, !1), d.removeEventListener("error", this._errorMessage, !1), d.terminate(), d = null);
            if (b) {
                var f = this._getUrl("./mutableWorker", !0);
                try {
                    var e = g.getText(f, !0);
                    d = new Worker(n.createObjectURL(new m([e], {
                        type: "text/javascript"
                    })))
                } catch (h) {
                    try {
                        f = k.getProxyUrl(f).path + "?" + encodeURI(f), d = new Worker(f), this._useProxy = !0
                    } catch (l) {
                        return console.log("Can not create worker"), !1
                    }
                }
            } else d = new Worker(a);
            d.addEventListener("message", this._acceptMessage, !1);
            d.addEventListener("error", this._errorMessage, !1);
            this.worker = d;
            b && this.importScripts(a);
            c && this.importScripts(c);
            return d
        },
        postMessage: function(a, c) {
            if (a instanceof Array || "object" != typeof a) a = {
                data: a
            };
            var b = Math.floor(64E9 * Math.random()).toString(36);
            a.msgId = b;
            b = this._queue[b] = new h;
            this.worker ? (c ? this.worker.postMessage(a, c) : this.worker.postMessage(a), this.emit("start-message", {
                target: this,
                message: a
            })) : b.reject({
                message: "No worker was set."
            });
            return this.returnDeferreds ? b : b.promise || b
        },
        terminate: function() {
            var a = Object.keys(this._queue);
            this.worker && this.worker.terminate();
            for (var c = a.length - 1; 0 <= c; c--) this._queue[a[c]].cancel("terminated"), delete this._queue[a[c]]
        },
        addWorkerCallback: function(a, c) {
            var b;
            b = this._getUrl(a, !0);
            !1 === b ? (b = new h, b.reject({
                message: "Could not load text from " +
                    a
            })) : (b = this.postMessage({
                action: "add-callback",
                url: b,
                cbName: c || "main"
            }), b.then(e.hitch(this, function(a) {
                a.target = this;
                this.emit("callback-added", a)
            })));
            return b
        },
        importScripts: function(a) {
            Array.isArray(a) || (a = [a]);
            a = a.map(function(a) {
                a = this._getUrl(a, !0);
                this._useProxy && g.isXdUrl(a) && (a = k.getProxyUrl(a).path + "?" + encodeURI(a));
                return a
            }, this);
            a = this.postMessage({
                action: "import-script",
                url: a
            });
            a.then(e.hitch(this, function(a) {
                a.target = this;
                this.emit("scripts-imported", a)
            }));
            return a
        },
        _acceptMessage: function(a) {
            var c =
                a.data,
                b = c.msgId;
            if (c.status && "debug" == c.status) console[c.showAs || "debug"](c);
            else if (b && b in this._queue) {
                var d = this._queue[b];
                "progress" == c.status ? d.progress(a.data) : ("error" == c.status ? d.reject(a.data) : d.resolve(a.data), delete this._queue[b])
            }
            this.emit("message", {
                message: a.data,
                event: a,
                target: this
            })
        },
        _errorMessage: function(a) {
            this.onerror || this.onError ? this.onerror ? this.onerror(a) : this.onError(a) : console.log("Worker Error: " + a.message + "\nIn " + a.filename + " on " + a.lineno)
        },
        _getUrl: function(a, c) {
            var b =
                g.toUrl(a);
            if (b) b.match(/\.js$/) || (b += ".js");
            else return console.error("can not resolve path:", a), !1;
            return c ? k.getAbsoluteUrl(b) : b
        },
        _startBlobWorker: function() {
            var a = this._xdSource;
            a || (a = this._getUrl("./mutableWorker"), a = new m(["if(!self._mutable){importScripts('" + a + "');}"], {
                type: "text/javascript"
            }), a = this._xdSource = n.createObjectURL(a));
            try {
                return new Worker(a)
            } catch (c) {
                return console.log(c.message), !1
            }
        }
    })
});