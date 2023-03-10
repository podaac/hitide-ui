//>>built
define(["require", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dijit/_Widget", "dijit/_Templated", "../kernel", "./_EventedWidget", "dojo/i18n!../nls/jsapi", "dojo/NodeList-dom"], function(r, s, n, m, p, k, A, B, t, h, e, u, q, v, w, C, x, y) {
    var z = 0;
    return s([x, v, w], {
        declaredClass: "esri.dijit._PopupRenderer",
        constructor: function() {
            this._nls = m.mixin({}, y.widgets.popup)
        },
        templateString: "\x3cdiv class\x3d'esriViewPopup'\x3e\x3cdiv class\x3d'mainSection'\x3e\x3cdiv class\x3d'header' dojoAttachPoint\x3d'_title'\x3e\x3c/div\x3e\x3cdiv class\x3d'hzLine'\x3e\x3c/div\x3e\x3cdiv dojoAttachPoint\x3d'_description'\x3e\x3c/div\x3e\x3cdiv class\x3d'break'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'attachmentsSection hidden'\x3e\x3cdiv\x3e${_nls.NLS_attach}:\x3c/div\x3e\x3cul dojoAttachPoint\x3d'_attachmentsList'\x3e\x3c/ul\x3e\x3cdiv class\x3d'break'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'mediaSection hidden'\x3e\x3cdiv class\x3d'header' dojoAttachPoint\x3d'_mediaTitle'\x3e\x3c/div\x3e\x3cdiv class\x3d'hzLine'\x3e\x3c/div\x3e\x3cdiv class\x3d'caption' dojoAttachPoint\x3d'_mediaCaption'\x3e\x3c/div\x3e\x3cdiv class\x3d'gallery' dojoAttachPoint\x3d'_gallery'\x3e\x3cdiv class\x3d'mediaHandle prev' dojoAttachPoint\x3d'_prevMedia' dojoAttachEvent\x3d'onclick: _goToPrevMedia'\x3e\x3c/div\x3e\x3cdiv class\x3d'mediaHandle next' dojoAttachPoint\x3d'_nextMedia' dojoAttachEvent\x3d'onclick: _goToNextMedia'\x3e\x3c/div\x3e\x3cul class\x3d'summary'\x3e\x3cli class\x3d'image mediaCount hidden' dojoAttachPoint\x3d'_imageCount'\x3e0\x3c/li\x3e\x3cli class\x3d'image mediaIcon hidden'\x3e\x3c/li\x3e\x3cli class\x3d'chart mediaCount hidden' dojoAttachPoint\x3d'_chartCount'\x3e0\x3c/li\x3e\x3cli class\x3d'chart mediaIcon hidden'\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv class\x3d'frame' dojoAttachPoint\x3d'_mediaFrame'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'editSummarySection hidden' dojoAttachPoint\x3d'_editSummarySection'\x3e\x3cdiv class\x3d'break'\x3e\x3c/div\x3e\x3cdiv class\x3d'break hidden' dojoAttachPoint\x3d'_mediaBreak'\x3e\x3c/div\x3e\x3cdiv class\x3d'editSummary' dojoAttachPoint\x3d'_editSummary'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
        showTitle: !0,
        startup: function() {
            this.inherited(arguments);
            this.template.getComponents(this.graphic).then(m.hitch(this, this._handleComponentsSuccess), m.hitch(this, this._handleComponentsError))
        },
        destroy: function() {
            this._dfd && this._dfd.cancel();
            this._destroyFrame();
            this.template = this.graphic = this._nls = this._mediaInfos = this._mediaPtr = this._dfd = null;
            this.inherited(arguments)
        },
        _goToPrevMedia: function() {
            0 > this._mediaPtr - 1 || (this._mediaPtr--, this._updateUI(), this._displayMedia())
        },
        _goToNextMedia: function() {
            this._mediaPtr +
                1 !== this._mediaInfos.length && (this._mediaPtr++, this._updateUI(), this._displayMedia())
        },
        _updateUI: function() {
            var c = this._mediaInfos,
                b = c.length,
                a = this.domNode,
                f = this._prevMedia,
                d = this._nextMedia;
            if (1 < b) {
                var g = 0,
                    l = 0;
                p.forEach(c, function(a) {
                    "image" === a.type ? g++ : -1 !== a.type.indexOf("chart") && l++
                });
                g && (h.set(this._imageCount, "innerHTML", g), k.query(".summary .image", a).removeClass("hidden"));
                l && (h.set(this._chartCount, "innerHTML", l), k.query(".summary .chart", a).removeClass("hidden"))
            } else k.query(".summary",
                a).addClass("hidden"), e.add(f, "hidden"), e.add(d, "hidden");
            c = this._mediaPtr;
            0 === c ? e.add(f, "hidden") : e.remove(f, "hidden");
            c === b - 1 ? e.add(d, "hidden") : e.remove(d, "hidden");
            this._destroyFrame()
        },
        _displayMedia: function() {
            var c = this._mediaInfos[this._mediaPtr],
                b = c.title,
                a = c.caption,
                f = k.query(".mediaSection .hzLine", this.domNode)[0];
            h.set(this._mediaTitle, "innerHTML", b);
            e[b ? "remove" : "add"](this._mediaTitle, "hidden");
            h.set(this._mediaCaption, "innerHTML", a);
            e[a ? "remove" : "add"](this._mediaCaption, "hidden");
            e[b &&
                a ? "remove" : "add"](f, "hidden");
            this._rid = null;
            if ("image" === c.type) this._showImage(c.value);
            else {
                var d = this,
                    b = ["dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip"],
                    a = c.value.theme || this.chartTheme;
                m.isString(a) && (a = a.replace(/\./gi, "/"), -1 === a.indexOf("/") && (a = "dojox/charting/themes/" + a));
                a || (a = "./Rainbow");
                b.push(a);
                try {
                    var g = this._rid = z++;
                    r(b, function(a, b, f) {
                        g === d._rid && (d._rid = null, d._showChart(c.type, c.value, a, b, f))
                    })
                } catch (l) {
                    console.log("PopupRenderer: error loading modules")
                }
            }
        },
        _showImage: function(c) {
            e.add(this._mediaFrame,
                "image");
            var b = q.get(this._gallery, "height"),
                a = "\x3cimg class\x3d'esriPopupMediaImage' src\x3d'" + c.sourceURL + "' /\x3e";
            c.linkURL && (a = "\x3ca target\x3d'_blank' href\x3d'" + c.linkURL + "'\x3e" + a + "\x3c/a\x3e");
            h.set(this._mediaFrame, "innerHTML", a);
            var f = k.query(".esriPopupMediaImage", this._mediaFrame)[0],
                d = this,
                g;
            g = n.connect(f, "onload", function() {
                n.disconnect(g);
                g = null;
                d._imageLoaded(f, b)
            })
        },
        _showChart: function(c, b, a, f, d) {
            e.remove(this._mediaFrame, "image");
            a = this._chart = new a(u.create("div", {
                    "class": "chart"
                },
                this._mediaFrame), {
                margins: {
                    l: 4,
                    t: 4,
                    r: 4,
                    b: 4
                }
            });
            d && a.setTheme(d);
            switch (c) {
                case "piechart":
                    a.addPlot("default", {
                        type: "Pie",
                        labels: !1
                    });
                    a.addSeries("Series A", b.fields);
                    break;
                case "linechart":
                    a.addPlot("default", {
                        type: "Markers"
                    });
                    a.addAxis("x", {
                        min: 0,
                        majorTicks: !1,
                        minorTicks: !1,
                        majorLabels: !1,
                        minorLabels: !1
                    });
                    a.addAxis("y", {
                        includeZero: !0,
                        vertical: !0,
                        fixUpper: "minor"
                    });
                    p.forEach(b.fields, function(a, b) {
                        a.x = b + 1
                    });
                    a.addSeries("Series A", b.fields);
                    break;
                case "columnchart":
                    a.addPlot("default", {
                        type: "Columns",
                        gap: 3
                    });
                    a.addAxis("y", {
                        includeZero: !0,
                        vertical: !0,
                        fixUpper: "minor"
                    });
                    a.addSeries("Series A", b.fields);
                    break;
                case "barchart":
                    a.addPlot("default", {
                        type: "Bars",
                        gap: 3
                    }), a.addAxis("x", {
                        includeZero: !0,
                        fixUpper: "minor",
                        minorLabels: !1
                    }), a.addAxis("y", {
                        vertical: !0,
                        majorTicks: !1,
                        minorTicks: !1,
                        majorLabels: !1,
                        minorLabels: !1
                    }), a.addSeries("Series A", b.fields)
            }
            this._action = new f(a);
            a.render()
        },
        _destroyFrame: function() {
            this._rid = null;
            this._chart && (this._chart.destroy(), this._chart = null);
            this._action && (this._action.destroy(),
                this._action = null);
            h.set(this._mediaFrame, "innerHTML", "")
        },
        _imageLoaded: function(c, b) {
            var a = c.height;
            a < b && (a = Math.round((b - a) / 2), q.set(c, "marginTop", a + "px"))
        },
        _attListHandler: function(c, b) {
            if (c === this._dfd) {
                this._dfd = null;
                var a = "";
                !(b instanceof Error) && (b && b.length) && p.forEach(b, function(b) {
                    a += "\x3cli\x3e";
                    a += "\x3ca href\x3d'" + b.url + "' target\x3d'_blank'\x3e" + (b.name || "[No name]") + "\x3c/a\x3e";
                    a += "\x3c/li\x3e"
                });
                h.set(this._attachmentsList, "innerHTML", a || "\x3cli\x3e" + this._nls.NLS_noAttach + "\x3c/li\x3e")
            }
        },
        _handleComponentsSuccess: function(c) {
            if (c) {
                var b = this.showTitle ? c.title : "",
                    a = c.description,
                    f = c.fields,
                    d = c.mediaInfos,
                    g = this.domNode,
                    l = this._nls,
                    n = this.template,
                    q = this.graphic;
                this._prevMedia.title = l.NLS_prevMedia;
                this._nextMedia.title = l.NLS_nextMedia;
                h.set(this._title, "innerHTML", b);
                b || e.add(this._title, "hidden");
                !a && f && (a = "", p.forEach(f, function(b) {
                    a += "\x3ctr valign\x3d'top'\x3e";
                    a += "\x3ctd class\x3d'attrName'\x3e" + b[0] + "\x3c/td\x3e";
                    a += "\x3ctd class\x3d'attrValue'\x3e" + b[1].replace(/^\s*(https?:\/\/[^\s]+)\s*$/i,
                        "\x3ca target\x3d'_blank' href\x3d'$1' title\x3d'$1'\x3e" + l.NLS_moreInfo + "\x3c/a\x3e") + "\x3c/td\x3e";
                    a += "\x3c/tr\x3e"
                }), a && (a = "\x3ctable class\x3d'attrTable' cellpadding\x3d'0px' cellspacing\x3d'0px'\x3e" + a + "\x3c/table\x3e"));
                h.set(this._description, "innerHTML", a);
                a || e.add(this._description, "hidden");
                k.query("a", this._description).forEach(function(a) {
                    h.set(a, "target", "_blank")
                });
                b && a ? k.query(".mainSection .hzLine", g).removeClass("hidden") : b || a ? k.query(".mainSection .hzLine", g).addClass("hidden") :
                    k.query(".mainSection", g).addClass("hidden");
                if (b = this._dfd = n.getAttachments(q)) b.addBoth(m.hitch(this, this._attListHandler, b)), h.set(this._attachmentsList, "innerHTML", "\x3cli\x3e" + l.NLS_searching + "...\x3c/li\x3e"), k.query(".attachmentsSection", g).removeClass("hidden");
                d && d.length && (k.query(".mediaSection", g).removeClass("hidden"), t.setSelectable(this._mediaFrame, !1), this._mediaInfos = d, this._mediaPtr = 0, this._updateUI(), this._displayMedia());
                c.editSummary && (h.set(this._editSummary, "innerHTML", c.editSummary),
                    d && d.length && e.remove(this._mediaBreak, "hidden"), e.remove(this._editSummarySection, "hidden"))
            }
        },
        _handleComponentsError: function(c) {
            console.log("PopupRenderer: error loading template", c)
        }
    })
});