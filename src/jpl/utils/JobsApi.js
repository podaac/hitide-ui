define([
    "jpl/utils/LoginApi"
], function(loginApi){

    var SHOULD_SELF_CHECK_USERNAME = true;

    var submitJobUrl = window.hitideConfig.submitJobUrl;
    var getStatusUrl = window.hitideConfig.jobStatusUrl;
    var disableJobUrl = window.hitideConfig.disableJobUrl;
    var getHistoryUrl = window.hitideConfig.jobHistoryUrl;
    
    return {


        submitJob: function(job, callback){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", submitJobUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.responseType = "json";
            if(hitideConfig.crossOriginCookies){
                xhr.withCredentials = true;
            }
            if(SHOULD_SELF_CHECK_USERNAME){
                var username = loginApi.getAppUser().username;
                xhr.setRequestHeader("self-check-username", username);
            }
            xhr.onload = function(){
                callback(xhr.response);
            };
            xhr.onerror = function(){
                callback({error: "XHR_ERROR", errorMessage: xhr.response});
            };
            xhr.send(JSON.stringify(job));
        },


        getJobStatus: function(token, callback){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", getStatusUrl + "?token=" + token);
            xhr.responseType = "json";
            if(hitideConfig.crossOriginCookies){
                xhr.withCredentials = true;
            }
            if(SHOULD_SELF_CHECK_USERNAME){
                var username = loginApi.getAppUser().username;
                xhr.setRequestHeader("self-check-username", username);
            }
            xhr.onload = function(){
                callback(xhr.response);
            };
            xhr.onerror = function(){
                callback({error: "XHR_ERROR", errorMessage: xhr.response});
            };
            xhr.send();
        },

        
        getHistory: function(callback){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", getHistoryUrl);
            xhr.responseType = "json";
            if(hitideConfig.crossOriginCookies){
                xhr.withCredentials = true;
            }
            if(SHOULD_SELF_CHECK_USERNAME){
                var username = loginApi.getAppUser().username;
                xhr.setRequestHeader("self-check-username", username);
            }
            xhr.onload = function(){
                callback(xhr.response);
            };
            xhr.onerror = function(){
                callback({error: "XHR_ERROR", errorMessage: xhr.response});
            };
            xhr.send();
        },


        disableJob: function(job, callback){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", disableJobUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.responseType = "json";
            if(hitideConfig.crossOriginCookies){
                xhr.withCredentials = true;
            }
            if(SHOULD_SELF_CHECK_USERNAME){
                var username = loginApi.getAppUser().username;
                xhr.setRequestHeader("self-check-username", username);
            }
            xhr.onload = function(){
                callback(xhr.response);
            };
            xhr.onerror = function(){
                callback({error: "XHR_ERROR", errorMessage: xhr.response});
            };
            xhr.send(JSON.stringify({token: job.token}));
        }


    };
});