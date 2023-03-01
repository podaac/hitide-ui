define([
    "dojo/dom",
    "dojo/topic",
    "jpl/events/MyDataEvent",
    "jpl/utils/LoginApi",
    "jpl/dijit/ui/HelpDialog"
],function(dom, topic, MyDataEvent, loginApi, HelpDialog){

    var loginButton;
    var loginUsernameSpan;
    var loginButtonIcon;
    var linkToFaqWhyLogin;

    topic.subscribe(MyDataEvent.prototype.LOGIN_STATUS_CHANGE, handleLoginStatusChange);

    function handleLoginStatusChange(user){
        if(user.loggedIn){
            loginButton.innerHTML = "Log Out";
            loginButton.onclick = logoutButtonFunc;
            loginUsernameSpan.innerHTML = user.username;
            loginButtonIcon.classList.remove("fa-sign-in");
            loginButtonIcon.classList.add("fa-user");
        }
        else{
            loginButton.innerHTML = "Log In";
            loginButton.onclick = loginButtonFunc;
            loginUsernameSpan.innerHTML = "Login with Earthdata";
            loginButtonIcon.classList.remove("fa-user");
            loginButtonIcon.classList.add("fa-sign-in");
        }
    }

    function logoutButtonFunc(){
        loginApi.safeLogout();
    }

    function loginButtonFunc(){
        loginApi.safeLogin();
    }
    

    return {
        init: function(){
            loginButton = dom.byId("login-button");
            loginUsernameSpan = dom.byId("login-username-span");
            loginButtonIcon = dom.byId("login-button-icon");
            linkToFaqWhyLogin = dom.byId("link-to-faq-why-login");
            linkToFaqWhyLogin.onclick = function(){
                // Open up FAQ page to 'Why Login?' question, and then disable the link's onclick-default-action
                var helpDialog = new HelpDialog();
                helpDialog.startup();
                helpDialog.setContentPage("helpFaq");
                return false;
            }

            loginButton.innerHTML = "-----";
            loginUsernameSpan.innerHTML = "-----";

            loginApi.initialLoginCheck();
        }
    };
    
});