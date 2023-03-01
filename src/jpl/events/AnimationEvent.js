
define(["dojo/_base/declare", "dojo/request"],

    function (declare, request) {
        return declare(null, {
            TOGGLE_ANIMATION: "animtiaon-event/toggle-animaiton",
			PLAY_ANIMATION: "animtiaon-event/play-animation",
			PAUSE_ANIMATION: "animtiaon-event/pause-animaiton",
			STEP_ANIMATION: "animtiaon-event/step-animaiton-forward",
			UPDATE_ANIMATION_SPEED: "animtiaon-event/update-animation-speed",
            UPDATE_ANIMATION_LAYER: "animtiaon-event/update-animation-layer",

            constructor: function () {

            }
        });
    });