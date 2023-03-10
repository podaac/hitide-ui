//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/Deferred", "dojo/promise/all", "dojo/data/ItemFileWriteStore", "dojo/string", "dojo/Evented", "dojo/_base/kernel", "dojo/Stateful", "../../kernel", "../../lang", "../../request", "../../tasks/Geoprocessor", "dojo/i18n!../../nls/jsapi", "./utils", "../../IdentityManager"], function(r, v, e, h, g, A, B, n, s, w, p, x, y, z, l, k, m, t, q, u) {
    return v([z, x], {
        declaredClass: "esri.dijit.analysis.AnalysisBase",
        isOutputLayerItemUpdated: !1,
        analysisGpServer: null,
        toolName: null,
        portalUrl: null,
        jobParams: null,
        itemParams: null,
        gp: null,
        resultParameter: null,
        signInPromise: null,
        _jobInfo: null,
        _popupInfo: null,
        _toolServiceUrl: null,
        _counter: null,
        constructor: function(a) {
            this.isOutputLayerItemUpdated = !1;
            this._rids = [];
            this._counter = 0;
            this._popupInfo = [];
            a.analysisGpServer ? this._signIn(a.analysisGpServer) : a.portalUrl && (this.portalUrl = a.portalUrl, this._signIn(a.portalUrl, !0))
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            e.mixin(this.i18n, q.common);
            e.mixin(this.i18n, q.analysisTools);
            e.mixin(this.i18n, q.analysisMsgCodes)
        },
        execute: function(a) {
            this.jobParams = a.jobParams;
            this.itemParams = this.jobParams.OutputName ? a.itemParams : null;
            this.signInPromise.then(e.hitch(this, this._checkUser))
        },
        _checkUser: function() {
            var a;
            if (a = l.id.findCredential(this.portalUrl).userId) a = this.portalUrl + "/sharing/community/users/" + a, m({
                url: a,
                content: {
                    f: "json"
                }
            }).then(e.hitch(this, this._handleUserProfileResponse), e.hitch(this, function(a) {
                this.emit("job-fail", {
                    message: a.message +
                        (a.details ? a.details.toString() : ""),
                    jobParams: this.jobParams
                })
            }))
        },
        _handleUserProfileResponse: function(a) {
            a.accountId ? "account_admin" === a.role || "account_publisher" === a.role || "org_admin" === a.role || "org_publisher" === a.role ? this.itemParams ? this._checkServiceName(a.accountId) : (this._submitGpJob(), this.emit("start", this.jobParams)) : this.emit("job-fail", {
                message: this.i18n.pubRoleMsg,
                messageCode: "AB_0001",
                jobParams: this.jobParams
            }) : this.emit("job-fail", {
                message: this.i18n.orgUsrMsg,
                jobParams: this.jobParams
            })
        },
        _checkServiceName: function(a) {
            var b;
            l.id.findCredential(this.portalUrl);
            a = this.portalUrl + "/sharing/portals/" + a + "/isServiceNameAvailable";
            b = {
                name: g.fromJson(this.jobParams.OutputName).serviceProperties.name,
                type: "Feature Service",
                f: "json"
            };
            m({
                url: a,
                content: b
            }).then(e.hitch(this, function(a) {
                a.available ? (this._createService(), this.emit("start", this.jobParams)) : this.emit("job-fail", {
                    message: this.i18n.servNameExists,
                    type: "warning",
                    messageCode: "AB_0002",
                    jobParams: this.jobParams
                })
            }), e.hitch(this, function(a) {
                this.emit("job-fail", {
                    message: a.message + (a.details ? a.details.toString() : ""),
                    jobParams: this.jobParams
                })
            }))
        },
        _createService: function() {
            var a, b, c;
            a = l.id.findCredential(this.portalUrl).userId;
            b = g.fromJson(this.jobParams.OutputName);
            a && (c = this.itemParams.folder, a = this.portalUrl + "/sharing/content/users/" + a + (c && "/" !== c ? "/" + c : "") + "/createService", b = {
                createParameters: g.toJson({
                    currentVersion: 10.2,
                    serviceDescription: "",
                    hasVersionedData: !1,
                    supportsDisconnectedEditing: !1,
                    hasStaticData: !0,
                    maxRecordCount: 2E3,
                    supportedQueryFormats: "JSON",
                    capabilities: "Query",
                    description: "",
                    copyrightText: "",
                    allowGeometryUpdates: !1,
                    syncEnabled: !1,
                    editorTrackingInfo: {
                        enableEditorTracking: !1,
                        enableOwnershipAccessControl: !1,
                        allowOthersToUpdate: !0,
                        allowOthersToDelete: !0
                    },
                    xssPreventionInfo: {
                        xssPreventionEnabled: !0,
                        xssPreventionRule: "InputOnly",
                        xssInputRule: "rejectInvalid"
                    },
                    tables: [],
                    name: b.serviceProperties.name
                }),
                outputType: "featureService",
                f: "json"
            }, m({
                url: a,
                content: b
            }, {
                usePost: !0
            }).then(e.hitch(this, this._submitGpJob), e.hitch(this, this._handleCreateServiceError)))
        },
        _handleCreateServiceError: function(a) {
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _getSelf: function(a) {
            return m({
                url: a + "/sharing/rest/portals/self",
                content: {
                    culture: y.locale,
                    f: "json"
                },
                callbackParamName: "callback",
                timeout: 0
            }, {})
        },
        _submitGpJob: function(a) {
            var b;
            this.itemParams && (this.currentGpItemId = a.itemId, b = g.fromJson(this.jobParams.OutputName), b.serviceProperties && (b.serviceProperties.serviceUrl = a.serviceurl), b.itemProperties = {
                    itemId: a.itemId
                },
                this.jobParams.OutputName = g.toJson(b));
            this.analysisGpServer ? ((!this._toolServiceUrl || !this.gp) && this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName), this.gp.setUpdateDelay(3E3), this.gp.submitJob(this.jobParams, e.hitch(this, this._gpJobComplete), e.hitch(this, this._gpJobStatus), e.hitch(this, this._gpJobFailed)), this.emit("job-submit", this.jobParams)) : this._getSelf(this.portalUrl).then(e.hitch(this, function(a) {
                this.analysisGpServer = a.helperServices.analysis && a.helperServices.analysis.url ?
                    a.helperServices.analysis.url : null;
                this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName);
                this.gp.setUpdateDelay(3E3);
                this.gp.submitJob(this.jobParams, e.hitch(this, this._gpJobComplete), e.hitch(this, this._gpJobStatus), e.hitch(this, this._gpJobFailed));
                this.emit("job-submit", this.jobParams)
            }))
        },
        _updateItem: function() {
            var a, b, c;
            if (a = l.id.findCredential(this.portalUrl).userId) return b = this.itemParams.folder, a = this.portalUrl + "/sharing/content/users/" + a + (b && "/" !== b ? "/" + b : "") + "/items/" + this.currentGpItemId +
                "/update", this.itemParams.typeKeywords = "jobUrl:" + this._toolServiceUrl + "/jobs/" + this._jobInfo.jobId, b = e.mixin({
                    f: "json"
                }, this.itemParams), c = {}, this._popupInfo && 0 < this._popupInfo.length && (c.layers = h.map(this._popupInfo, function(a, b) {
                    a.description = null;
                    return {
                        id: b,
                        popupInfo: a
                    }
                }, this)), b.text = g.toJson(c), a = m({
                    url: a,
                    content: b
                }, {
                    usePost: !0
                }), a.then(e.hitch(this, this._handleItemUpdate), e.hitch(this, this._handleUpdateItemError)), a
        },
        _handleItemUpdate: function(a) {
            this.isOutputLayerItemUpdated = !0
        },
        _handleItemDataUpdate: function(a) {},
        _handleUpdateItemError: function(a) {
            this.isOutputLayerItemUpdated = !0;
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _handleErrorResponse: function(a) {
            this.emit("job-fail", a)
        },
        _refreshItem: function() {
            var a, b;
            if (a = l.id.findCredential(this.portalUrl).userId) return b = this.itemParams.folder, a = this.portalUrl + "/sharing/content/users/" + a + (b && "/" !== b ? "/" + b : "") + "/items/" + this.currentGpItemId + "/refresh", m({
                url: a,
                content: {
                    f: "json"
                }
            }, {
                usePost: !0
            })
        },
        _handleItemRefresh: function(a) {},
        _gpJobStatus: function(a) {
            var b = "",
                c = [],
                d, f;
            a.jobParams = this.jobParams;
            if ("esriJobFailed" === a.jobStatus || "esriJobSucceeded" === a.jobStatus) a.message ? b = a.message : a.messages && (c = h.filter(a.messages, function(a) {
                if (("esriJobMessageTypeError" === a.type || "esriJobMessageTypeWarning" === a.type) && a.description && -1 !== a.description.indexOf("messageCode")) return a.description
            }), 0 < c.length && h.forEach(c, function(c) {
                d = g.fromJson(c.description);
                f = "";
                "esriJobMessageTypeWarning" === c.type && (a.type = "warning");
                d.messageCode ?
                    (f = k.isDefined(this.i18n[d.messageCode]) ? this.i18n[d.messageCode] : d.message, f = k.isDefined(d.params) ? p.substitute(f, d.params) : f, b += f + "\x26nbsp;") : d.error && d.error.messageCode && (f = k.isDefined(this.i18n[d.error.messageCode]) ? this.i18n[d.error.messageCode] : d.message, f = k.isDefined(d.error.params) ? p.substitute(f, d.error.params) : f, b += f + "\x26nbsp;")
            }, this)), a.message = b, "esriJobFailed" === a.jobStatus && this._deleteItem(!1);
            this.emit("job-status", a);
            this._jobInfo = a;
            this.itemParams && !this.isOutputLayerItemUpdated &&
                this._updateItem()
        },
        _updateRefreshItem: function(a) {
            var b = [];
            b.push(this._refreshItem());
            b.push(this._updateItem());
            s(b).then(e.hitch(this, function(b) {
                a.outputLayerName = g.fromJson(this.jobParams.OutputName).serviceProperties.name;
                a.value.itemId = this.currentGpItemId;
                a.analysisInfo = {
                    toolName: this.toolName,
                    jobParams: this.jobParams
                };
                this.emit("job-result", a)
            }), e.hitch(this, this._handleDeleteItemError))
        },
        _gpJobComplete: function(a) {
            var b;
            "esriJobSucceeded" === a.jobStatus && (a.jobParams = this.jobParams, this.emit("job-success",
                a), s(this._getGpResultData(a)).then(e.hitch(this, function(c) {
                c = h.filter(c, function(a) {
                    if (a.value && !a.value.empty) return a
                });
                0 === c.length ? (this.currentGpItemId && this._deleteItem(!1), this.emit("job-fail", {
                    message: this.i18n.emptyResultInfoMsg,
                    type: "warning",
                    jobParams: this.jobParams
                })) : (h.forEach(c, function(a) {
                        if (a.value.featureSet && !a.value.url) a.value.featureSet.spatialReference = a.value.layerDefinition.spatialReference;
                        else if (a.value.url && -1 !== a.value.url.indexOf("/FeatureServer/") && a.value.layerInfo &&
                            a.value.layerInfo.popupInfo) {
                            var b = a.value.url.match(/[0-9]+$/g)[0];
                            this._popupInfo[b] = a.value.layerInfo.popupInfo
                        }
                    }, this), b = c[0], this.jobParams.isProcessInfo ? this.gp.getResultData(a.jobId, "ProcessInfo").then(e.hitch(this, function(a) {
                        var c = [];
                        h.forEach(a.value, function(a) {
                            c.push(g.fromJson(a))
                        }, this);
                        this.currentGpItemId ? (this.itemParams.description = u.buildReport(c), this._updateRefreshItem(b)) : (b.analysisReport = u.buildReport(c), this.emit("job-result", b))
                    })) : this.currentGpItemId ? this._updateRefreshItem(b) :
                    this.emit("job-result", b))
            })))
        },
        _gpJobFailed: function(a) {
            var b = "",
                c = [],
                d, f;
            e.clone(a).jobParams = this.jobParams;
            a.message ? b = a.message : a.messages && (c = h.filter(a.messages, function(a) {
                if (("esriJobMessageTypeError" === a.type || "esriJobMessageTypeWarning" === a.type) && a.description && -1 !== a.description.indexOf("messageCode")) return a.description
            }), 0 < c.length && h.forEach(c, function(a) {
                d = g.fromJson(a.description);
                f = "";
                d.messageCode ? (f = k.isDefined(this.i18n[d.messageCode]) ? this.i18n[d.messageCode] : d.message, f = k.isDefined(d.params) ?
                    p.substitute(f, d.params) : f, b += f + "\x26nbsp;") : d.error && d.error.messageCode && (f = k.isDefined(this.i18n[d.error.messageCode]) ? this.i18n[d.error.messageCode] : d.message, f = k.isDefined(d.params) ? p.substitute(f, d.error.params) : f, b += f + "\x26nbsp;")
            }, this));
            a.message = b;
            this.emit("job-fail", a)
        },
        _getGpResultData: function(a) {
            var b = [],
                c = [];
            "string" === typeof this.resultParameter ? c.push(this.resultParameter) : this.resultParameter instanceof Array && (c = this.resultParameter);
            h.forEach(c, function(c, e) {
                b.push(this.gp.getResultData(a.jobId,
                    c))
            }, this);
            return b
        },
        cancel: function(a) {
            this.gp.cancelJob(a.jobId).then(e.hitch(this, function(a) {
                "esriJobCancelled" === a.jobStatus && (this.itemParams ? this._deleteItem(!0) : this.emit("job-cancel", a))
            }), function(a) {})
        },
        _deleteItem: function(a) {
            var b, c;
            if ((b = l.id.findCredential(this.portalUrl).userId) && this.itemParams) c = k.isDefined(this.itemParams.folder) ? this.itemParams.folder : "", b = this.portalUrl + "/sharing/content/users/" + b + (c && "/" !== c ? "/" + c : "") + "/items/" + this.currentGpItemId + "/delete", m({
                url: b,
                content: {
                    f: "json"
                }
            }, {
                usePost: !0
            }).then(e.hitch(this, this._handleItemDelete, a), e.hitch(this, this._handleDeleteItemError))
        },
        _handleItemDelete: function(a, b) {
            a && this.emit("job-cancel", b)
        },
        _handleDeleteItemError: function(a) {
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _initFolderStore: function(a, b) {
            this._fportal = new a.Portal(this.portalUrl);
            this._fportal.signIn().then(e.hitch(this, function(a) {
                this.portalUser = a;
                this.portalUser.getFolders().then(e.hitch(this, function(a) {
                    var c =
                        new w({
                            data: {
                                identifier: "id",
                                label: "name",
                                items: []
                            }
                        });
                    c.newItem({
                        name: this.portalUser.username,
                        id: ""
                    });
                    h.forEach(a, function(a) {
                        c.newItem({
                            name: a.title,
                            id: a.id
                        })
                    });
                    b.resolve(c)
                }))
            }))
        },
        getFolderStore: function() {
            var a = new n,
                b, c, d, f;
            this.signInPromise.then(e.hitch(this, function(e) {
                l.id.findCredential(this.portalUrl);
                b = ["../../arcgis/Portal"];
                c = this._counter++;
                d = this;
                this._rids && this._rids.push(c);
                r(b, function(b) {
                    f = d._rids ? h.indexOf(d._rids, c) : -1; - 1 !== f && (d._rids.splice(f, 1), d._initFolderStore(b, a))
                })
            }));
            return a
        },
        _checkToolUrl: function() {
            var a = new n;
            this.analysisGpServer ? ((!this._toolServiceUrl || !this.gp) && this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName), a.resolve({
                success: !0
            })) : this._getSelf(this.portalUrl).then(e.hitch(this, function(b) {
                (this.analysisGpServer = b.helperServices.analysis && b.helperServices.analysis.url ? b.helperServices.analysis.url : null) && this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName);
                a.resolve({
                    success: !0
                })
            }));
            return a
        },
        getCreditsEstimate: function(a,
            b) {
            var c, d, f, h, g;
            d = new n;
            this._checkToolUrl().then(e.hitch(this, function(l) {
                this._toolServiceUrl ? g = this._toolServiceUrl : (h = this.portalUrl && -1 !== this.portalUrl.indexOf("dev") ? "dev" : this.portalUrl && -1 !== this.portalUrl.indexOf("qa") ? "qa" : "", g = "http://analysis" + h + ".arcgis.com/arcgis/rest/services/tasks/GPServer/" + this.toolName);
                c = g.replace("/" + a, "/exts/Estimate/" + a);
                f = e.mixin({
                    f: "json"
                }, b);
                m({
                    url: c,
                    content: f
                }, {
                    usePost: !0
                }).then(function(a) {
                    d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                })
            }));
            return d
        },
        _signIn: function(a,
            b) {
            var c, d, f, g, k;
            this.signInPromise = new n;
            b ? (c = ["../../arcgis/Portal"], d = this._counter++, f = this, this._rids && this._rids.push(d), r(c, e.hitch(this, function(b) {
                g = f._rids ? h.indexOf(f._rids, d) : -1; - 1 !== g && (f._rids.splice(g, 1), this._portal = new b.Portal(a), this._portal.signIn().then(e.hitch(this, function(a) {
                    this._portal.helperServices && this._portal.helperServices.analysis && this._portal.helperServices.analysis.url ? (this.analysisGpServer = this._portal.helperServices.analysis.url, m({
                        url: this.analysisGpServer,
                        content: {
                            f: "json"
                        },
                        callbackParamName: "callback"
                    }).then(e.hitch(this, function(a) {
                        k = l.id.findCredential(this.analysisGpServer);
                        this.signInPromise.resolve(k)
                    }), e.hitch(this, function(a) {
                        this.signInPromise.reject(a)
                    }))) : this.signInPromise.resolve(a)
                }), e.hitch(this, function(a) {
                    this.signInPromise.reject(a)
                })))
            }))) : m({
                url: a,
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }).then(e.hitch(this, function(b) {
                    b = l.id.findCredential(a);
                    this.portalUrl = l.id.findServerInfo(this._toolServiceUrl).owningSystemUrl;
                    this.signInPromise.resolve(b)
                }),
                e.hitch(this, function(a) {
                    this.signInPromise.reject(a)
                }));
            return this.signInPromise
        },
        _toolServiceUrlSetter: function(a) {
            this._toolServiceUrl = a;
            this.gp = new t(a)
        },
        _setToolServiceUrlAttr: function(a) {
            this._toolServiceUrl = a;
            this.gp = new t(a)
        }
    })
});