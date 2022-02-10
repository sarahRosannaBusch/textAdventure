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

    

    that.startSentence = function() { 
        sentence = {
            move: '',
            action: '',
            connector: '',
            target: '',
            moveResult: '',
            actionResult: ''
        };
        elem.wordPicker.style.display = 'inline-block';
        elem.sentence.innerHTML = pc.getName('first');
        let textOpts = _getNextWordOpts('', '');
        _showOptions(textOpts);
    }

    //populate word selector with next possible options
    function _showOptions(textOpts) {   
        elem.wordPicker.innerHTML = '';
        let opt = f.html.spawn(elem.wordPicker, 'option');
        opt.value = opt.innerText = '';
        let numOpts = 0;
        let choice = '';
        let choiceType = '';
        for(let text in textOpts) {
            opt = f.html.spawn(elem.wordPicker, 'option');
            opt.value = opt.innerText = choice = text;
            choiceType = textOpts[text];
            opt.setAttribute("data-type", choiceType);
            numOpts++;
        }
        if(numOpts === 1) {
            _writeWords(choice, choiceType);
        }
        elem.wordPicker.onchange = function() {
            let idx = this.selectedIndex;
            let selectedType = this.options[idx].getAttribute('data-type');
            _writeWords(this.value, selectedType);
        }
    }

    //event handler for when user selects from word options
    //params are words and type chosen
    function _writeWords(words, type) {
        if(words === '.' || type === 'target') {
            if(type === 'target') {
                elem.sentence.innerHTML += ' ' + words;
            }
            elem.sentence.innerHTML += '.';
            elem.wordPicker.style.display = 'none';
            encounter.playResult();
        } else {                   
            elem.sentence.innerHTML += ' ' + words;
            sentence[type] = words;
            if(type === 'move' || type === 'action') {
                sentence[type + 'Result'] = PlayerWords.getResult(words, type);
            }
            if(type === 'move' && sentence.moveResult === 'change posture') {
                pc.changePosture(words);
            }
            let nextWordOpts = _getNextWordOpts(words, type);
            _showOptions(nextWordOpts);
        }
    }

    //determines next word choices
    //returns object list in form 'choice':'type'
    function _getNextWordOpts(lastChoice, lastType) {
        let ret = {};

        if(lastChoice === "") {
            let moves = PlayerWords.getWords('move');
            let actions = PlayerWords.getWords('action');
            _addToList(moves, 'move');
            _addToList(actions, 'action');
        } else {
            switch(lastType) {
                case 'action':
                    //TODO: combat?
                    //no break
                case 'move': 
                    let connectors = PlayerWords.getWords('connector');
                    _addToList(connectors, 'connector');
                    break;
                case 'connector':             
                    if(sentence.connector === 'and') {       
                        let actions = PlayerWords.getWords('action');
                        _addToList(actions, 'action');
                    }
                    let targets = encounter.getTargets();
                    _addToList(targets, 'target');
                    break;
                default: break;
            }
        }
        
        function _addToList(words, type) {
            for(let key in words) {
                let choice = words[key];
                let include = false;
                //first include
                if(choice.if) {
                    let posture = pc.getPosture();
                    if(choice.if.posture && choice.if.posture.includes(posture)) {
                        include = true;
                    }
                    if(choice.if.lastChoice && choice.if.lastChoice.includes(lastChoice)) {
                        include = true;
                    }
                }
                //then exclude
                if(include && choice.xif) {
                    if(choice.xif.condition) {
                        let conditions = pc.getConditions();
                        for(let i = 0; i < conditions.length; i++) {
                            let c = conditions[i];
                            if(choice.xif.condition.includes(c)) {
                                include = false;
                                continue;
                            }
                        }
                    }
                    if(choice.xif.zeroTargets) {
                        //TODO: get num targets
                    }
                }
                if(include) {
                    ret[key] = type;
                }
            }
        }

        return ret;
    }    

    return that;
}());