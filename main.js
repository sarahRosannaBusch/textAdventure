"use strict"

/** @brief  d&d game
 *  @author Sarah Rosanna Busch
 *  @date   4 Oct 2021
 */

var main = (function() {
    var that = {};
    var elem = {};
    var pc = null; //selected character
    var encounter = null; //currently loaded encounter or zone    
    var bubbleCount = 0; //number of text bubbles displayed
    
    var sentence = {
        move: '',
        action: '',
        connector: '',
        target: '',
        moveResult: '',
        actionResult: ''
    };

    that.init = function() {
        elem.main = f.html.getElem('main');
        elem.header = f.html.getElem('header');
        elem.storyBody = f.html.getElem('#storyBody');
        elem.storyText = f.html.getElem('#storyText');
        elem.dmTop = f.html.getElem('#dmTop');
        elem.dmBtm = f.html.getElem('#dmBtm');
        elem.playerOpts = f.html.getElem('#playerOpts');
        elem.playerMatCover = f.html.getElem('#playerMatCover');
        elem.sentenceBuilder = f.html.getElem('#sentenceBuilder');
        elem.sentence = f.html.getElem('#sentence');
        elem.wordPicker = f.html.getElem('#wordPicker');
        elem.dmTable = f.html.getElem('#dmTable');
        elem.buttonContainer = f.html.getElem('#buttonContainer');
        elem.dialogs = f.html.getElem('dialogs');
        elem.notebook = f.html.getElem('#notebook');
        elem.characterSheet = f.html.getElem('#characterSheet');
        elem.backstory = f.html.getElem('#backstory');
        elem.notes = f.html.getElem('#bags');
        elem.spells = f.html.getElem('#spells');
        
        // pc = Travok; //TODO: let user select
        // encounter = Travok.getEncounter(); 
        // encounter.start(pc);

        bubbleCount = 0;
        Intro.start();
    }

    //param is bool
    function disableUI(disabled) {
        if(disabled) {
            elem.playerMatCover.style.pointerEvents = "auto"; //no click
        } else {
            elem.playerMatCover.style.pointerEvents = "none"; //click
        }
    }

    that.writeStory = function(speaker, text) {
        bubbleCount++;
        var bubbleId = "textBubble_" + bubbleCount;
        var speakerClass = (speaker === "You") ? "player" : "dm";
        elem.storyBody.innerHTML += "<div id=" + bubbleId + " class='" + speakerClass + "'><fieldset><legend>" + speaker 
            + "</legend><p></p></fieldset></div>";
        var bubbleId = "textBubble_" + bubbleCount;
        var bubbleElem = f.html.getElem('#' + bubbleId);
        var p = f.html.getElem("p", bubbleElem);
        p.innerHTML = text;
        bubbleElem.scrollIntoView(true); //false to scroll to bottom
    }

    that.scroll = function() {
        if(elem.storyText.scrollTop > 25) {
            elem.dmTop.style.display = 'block';
        } else {
            elem.dmTop.style.display = 'none';
        }

        var bottom = elem.storyText.scrollTop + elem.dmTable.offsetHeight;
        if(bottom < elem.storyText.scrollHeight - 25) {
            elem.dmBtm.style.display = 'block';
        } else {
            elem.dmBtm.style.display = 'none';
        }
    }

    //param opts = array of strings to be printed in buttons
    //param callbacks = array of functions
    that.createBtnOpts = function(opts, callbacks) {
        f.html.empty(elem.buttonContainer);
        var numButtons = opts.length;
        for(var i = 0; i < numButtons; i++) {
            var btn = f.html.spawn(elem.buttonContainer, 'button', i);
            btn.innerHTML = opts[i];
            btn.callback = callbacks[i];
            btn.onclick = function() {
                main.writeStory('You', this.innerText);
                this.callback();
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