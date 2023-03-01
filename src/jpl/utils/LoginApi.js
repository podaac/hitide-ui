define([
    "dojo/topic",
    "jpl/events/MyDataEvent",
    "jpl/utils/StateSaver"
], function(topic, MyDataEvent, StateSaver){

    var appUser = {
        loggedIn: false,
        username: "",
        email: ""
    };

    var loginUrl = window.hitideConfig.loginUrl;
    var logoutUrl = window.hitideConfig.logoutUrl;
    var getUserUrl = window.hitideConfig.getUserUrl;
    var authCodeUrl = window.hitideConfig.authCodeUrl;

    function extractParamFromUrl(key){
        var searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(key);
    }

    function urlWithoutQueryOrFragment(){
        return window.location.href.split(/(\?|\#)/)[0];
    }

    function removeQueryFromUrl(){
        window.history.pushState({}, "", urlWithoutQueryOrFragment());
    }

    function initialLoginCheck(){
        topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, appUser);

        var state = extractParamFromUrl("state");
        if(state) {
            StateSaver.loadState(state);
            StateSaver.clearOldStates({
                maxAge: 60 * 60 * 1000 // 1 hour
            });
        }

        var code = extractParamFromUrl("code");
        if(code){
            removeQueryFromUrl();
            loginWithAuthCode(code, urlWithoutQueryOrFragment(), function(user){
                if(user.error){
                    /* Handle Error (just log it for now) */
                    console.log("LoginApi.initialLoginCheck() loginWithAuthCode() error: " + user.error);
                }else{
                    appUser.loggedIn = user.loggedIn;
                    appUser.username = user.username;
                    appUser.email = user.email;
                    topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, appUser);
                }
            });
            return;
        }

        getSessionUser(function(user){
            if(user.error){
                /* handle error (for now just log it) */
                console.log("LoginApi.initialLoginCheck() getSessionUser() error: " + user.error);
            }
            else if(user.loggedIn){
                appUser.loggedIn = user.loggedIn;
                appUser.username = user.username;
                appUser.email = user.email;
            }
            topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, appUser);
        });
    }

    function getAuthCode(){
        var clientId = hitideConfig.earthDataAppClientId;
        clientId = encodeURIComponent(clientId);

        var redirectUri = urlWithoutQueryOrFragment();
        redirectUri = encodeURIComponent(redirectUri);

        var stateSaverKey = 'hitide-pre-login-state-' + Date.now();
        StateSaver.saveState(stateSaverKey);
    
        var url = authCodeUrl;
        url += "?client_id=" + clientId;
        url += "&redirect_uri=" + redirectUri;
        url += "&response_type=code";
        url += "&state=" + stateSaverKey;
    
        window.location.href = url;
    }

    function loginWithAuthCode(code, redirectUri, callback){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", loginUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "json";
        if(hitideConfig.crossOriginCookies){
            xhr.withCredentials = true;
        }
        xhr.onload = function(){
            callback(xhr.response);
        };
        xhr.send(JSON.stringify({
            code: code,
            redirect_uri: redirectUri
        }));
    }

    function safeLogin(){
        if(appUser.loggedIn){
            /* This function shouldn't be called if already logged in */
            throw Error("LoginApi.safeLogin() called while already logged in");
        }
        getSessionUser(function(user){
            if(user.error){
                /* handle error (for now just log error) */
                console.log("LoginApi.safeLogin() getSessionUser() error: " + user.error);
            }
            if(!user.loggedIn){
                getAuthCode();
            }
            else if(!user.username){
                /* something is wrong here (for now just log it) */
                console.log("LoginApi.safeLogin() for some reason getSessionUser() has user.loggedIn === true but user.username is falsy");
            }
            else{
                /* appUser is not sync'd but we can just update to most recent login */
                appUser.loggedIn = user.loggedIn;
                appUser.username = user.username;
                appUser.email = user.email;
                topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, user);
            }
        });
    }

    function logout(){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", logoutUrl);
        xhr.responseType = "json";
        if(hitideConfig.crossOriginCookies){
            xhr.withCredentials = true;
        }
        xhr.onload = function(){
            var user = xhr.response;
            if(user.error || typeof user.username !== "string"){
                /* handle error (for right now just log error) */
                console.log("LoginApi.logout() error: " + user.error);
            }
            else{
                appUser.loggedIn = user.loggedIn;
                appUser.username = user.username;
                appUser.email = user.email;
                topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, user);
            }
        };
        xhr.send();
    }

    function safeLogout(){
        if(!appUser.loggedIn){
            /* This function shouldn't be called if already logged out */
            throw Error("LoginApi.safeLogout() called while already logged out");
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", logoutUrl);
        xhr.responseType = "json";
        xhr.setRequestHeader("self-check-username", appUser.username);
        if(hitideConfig.crossOriginCookies){
            xhr.withCredentials = true;
        }
        xhr.onload = function(){
            var user = xhr.response;
            if(user.error === "NOT_LOGGED_IN" || user.error === "NON_MATCHING_USERNAME"){
                /* appUser is not synced, but we can just go ahead and update as logged out */
                appUser.loggedIn = false;
                appUser.username = "";
                appUser.email = "";
                topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, user);
            }
            else{
                /* successful logout */
                appUser.loggedIn = user.loggedIn;
                appUser.username = user.username;
                appUser.email = user.email;
                topic.publish(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, user);
            }
        };
        xhr.send();
    }

    function getSessionUser(callback){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", getUserUrl);
        xhr.responseType = "json";
        if(hitideConfig.crossOriginCookies){
            xhr.withCredentials = true;
        }
        xhr.onload = function(){
            callback(xhr.response);
        };
        xhr.send();
    }

    function getAppUser(){
        return appUser;
    }

    return {
        initialLoginCheck: initialLoginCheck,
        // login: login,
        safeLogin: safeLogin,
        // logout: logout,
        safeLogout: safeLogout,
        getSessionUser: getSessionUser,
        getAppUser: getAppUser
    };
});