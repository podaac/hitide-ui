/**
 * Module that keeps track of Selected tab or other navigation related state
 */
 define([
    "dojo/topic",
    "jpl/events/NavigationEvent"
], function(topic, NavigationEvent){

    var state = { tabID: "Search" };

    topic.subscribe(NavigationEvent.prototype.SWITCH_TAB, handleSwitchTab);

    function handleSwitchTab(message) {
        state.tabID = message.tabID;
    }

    function getState() {
        return state;
    }

    function setState(newState) {
        topic.publish(NavigationEvent.prototype.SWITCH_TAB, {tabID: newState.tabID});
    }

    return {
        getState: getState,
        setState: setState
    };
});
