"use strict";
/**
 * @file       PlayerWords.js
 * @brief      Standard conditions and results for player word choices
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       29 August 2020
 * */

var PlayerWords = (function(){
    var that = {};

    that.getWords = function(type) {
        let ret = {};
        switch(type) {
            case 'move': ret = moves; break;
            case 'action': ret = actions; break;
            case 'connector': ret = connectors; break;
            default: break;
        }
        return ret;
    } 

    that.getResult = function(words, type) {
        let ret = '';
        let group = type === 'move' ? moves : actions;
        if(type === 'move') {
            if(group[words].result) {
                ret = moves[words].result;
            }
        }
        return ret;
    }

    var moves = {
        "sits up": {
            if: {
                posture: ['prone', 'lying down'],
            },
            result: 'change posture'
        },
        "stands": { 
            if: {
                posture: ['sitting', 'prone', 'lying down'],
            },
            result: 'change posture'            
        },
        "falls prone": {
            if: {
                posture: ['standing'],
            },
            result: 'change posture'            
        },
        "sits down": {
            if: {
                posture: ['standing'],
            },
            result: 'change position'            
        },
        "lies down": {
            if: {
                posture: ['sitting', 'standing'],
            },
            result: 'change posture'            
        },
        "walks": {
            if: {
                posture: ['standing'],
            },
            xif: {
                condition: ['grappled']
            },
            result: 'change position'            
        },
        "crawls": {
            if: {
                posture: ['prone'],
            },
            xif: {
                condition: ['grappled']
            },
            result: 'change position'            
        }
    };

    var actions = {
        "looks": {
            if: {
                posture: 'any',
            },
            xif: {
                condition: ['blinded']
            },
            result: 'describe' 
        },
        "sings": {
            if: {
                posture: ['sitting', 'standing'],
            },
            result: 'performace check' 
        },
        "stretches": {
            if: {
                posture: ['sitting', 'standing'],
            },
            result: 'constitution check' 
        }, 
        "meditates": {
            if: {
                posture: ['sitting'],
            },
            result: 'story' 
        }, 
        "inspects": {
            if: {
                posture: 'any',
            },
            xif: {
                zeroTargets: ['visible']
            },
            result: 'investigation check' 
        }, 
        "opens": {
            if: {
                posture: ['standing'],
            },
            xif: {
                zeroTargets: ['openable']
            },
            result: 'try it' 
        }, 
        "picks up": {
            if: {
                posture: 'any',
            },
            xif: {
                condition: ['hands full'],
                zeroTargets: ['holdable']
            },
            result: 'hold' 
        }, 
        "closes": {
            if: {
                posture: ['standing'],
            },
            xif: {
                zeroTargets: ['openable']
            },
            result: 'try it' 
        }, 
        "drops": {
            if: {
                posture: 'any',
            },
            xif: {
                zeroTargets: ['held']
            },
            result: 'drop' 
        }, 
        "does pushups": {
            if: {
                posture: ['prone'],
            },
            result: 'strength check' 
        }
    };

    var connectors = {
        ".": {
            if: {
                lastChoice: ['sits up', 'stands', 'falls prone', 'sings', 'stretches', 'meditates', 'does pushups']
            }
        },
        "and": {
            if: {
                lastChoice: ['sits up', 'stands', 'falls prone', 'sits down']
            }
        },
        "on the": {
            if: {
                lastChoice: ['sits down, lies down', 'drops']
            }
        },
        "over to the": {
            if: {
                lastChoice: ['walks', 'crawls']
            }
        },
        "the": {
            if: {
                lastChoice: ['inspects', 'opens', 'picks up', 'closes', 'drops']
            }
        },
        "under the": {
            if: {
                lastChoice: ['looks']
            }
        },
        "out the": {
            if: {
                lastChoice: ['looks']
            }
        },
        "into the": {
            if: {
                lastChoice: ['looks']
            }
        },
        "at the": {
            if: {
                lastChoice: ['looks']
            }
        },
        "around the": {
            if: {
                lastChoice: ['looks']
            }
        }
    }

    return that;
}());