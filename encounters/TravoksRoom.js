"use strict";
/**
 * @file       TravoksRoom.js
 * @brief      Encounter: Travok's starting area
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       19 August 2020
 * */

var TravoksRoom = (function(){
    var that = {};

    that.start = function() {
        main.writeStory('DM', story.intro);
        main.startSentence();
    }

    that.getTargets = function() {
        return targets;
    }

    that.playResult = function() {

    }

    var story = {
        intro: "You awaken in your room at the temple from a dream so vivid you wonder for a moment if it could have been real. In it, Ilmater, the god of healing and endurance, spoke to you as you repaired the stone wall of a small cottage that you didn't recognize.",
        eyesOpen: "As you open your eyes you see dim light start to come through the window, getting a little brighter every few seconds, as someone outside clicks on each of each street lamps, in turn.",
        masonsTools: "This is nobel work you do, Travok. Nothing is more important in ensuring that every life has a solid foundation on which to grow. I see a vibrant positive energy within you that strengthens with each stone you lay. Meditate on this energy, as I believe you will find the capacity to use it to extraordinary effect."
    };

    var targets = {
        "room": {
            isDiscovered: true,
            if: {
                lastChoice: ['around the']
            }
        },
        "bed": {
            isDiscovered: true,
            if: {
                lastChoice: ['the', 'on the', 'over to the', 'under the', 'at the']
            }
        }, 
        "dresser": {
            isDiscovered: false,
            if: {
                lastChoice: ['the', 'on the', 'over to the', 'under the', 'at the']
            }
        }, 
        "table": {
            isDiscovered: false,
            if: {
                lastChoice: ['the', 'on the', 'over to the', 'under the', 'at the']
            }
        }, 
        "window": {
            isDiscovered: false,
            if: {
                lastChoice: ['the', 'over to the', 'out the', 'at the']
            }
        }, 
        "door": {
            isDiscovered: false,
            if: {
                lastChoice: ['the','over to the']
            }
        }, 
        "carpet": {
            isDiscovered: false,
            if: {
                lastChoice: ['the', 'on the', 'at the']
            }
        }, 
        "mirror": {
            isDiscovered: false,
            if: {
                lastChoice: ['the', 'into the', 'at the']
            }
        }
    }

    return that;
}());