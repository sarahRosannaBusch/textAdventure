"use strict"

/** 
 * @file main.js
 * @brief  D&D Backstories main functionality
 * @author Sarah Rosanna Busch
 * @version 0.1
 * @date   9 Feb 2022
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
        return bubbleElem;
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

    that.sentenceBuilder = function(sentenceOpts, callback) {
        let bubbleElem = null;
        let p = null;
        let numOpts = sentenceOpts.length;
        const RESULT = 0; //result is always first in the array,
        let wordIdx = 1; //followed by the word options
        let chosenWords = [];

        //track indices of remaining sentenceOpts
        let possibleResults = []; 
        for(let i = 0; i < numOpts; i++) {
            possibleResults.push(i);
        }
        
        createUserOptions();
        
        function createUserOptions() {           
            //find next word options to show user
            let wordOpts = {};
            for(let i = 0; i < numOpts; i++) {
                if(!possibleResults.includes(i)) continue;
                let sentence = sentenceOpts[i];
                if(sentence[wordIdx]) { //sentence arrays are not all same length
                    let words = sentence[wordIdx]
                    if(!wordOpts[words]) {
                        wordOpts[words] = [];
                    }
                    wordOpts[words].push(i); //track indices of remaining possibilities
                } else {
                    console.log('how did we get here?');
                }
            }
            
            //create buttons
            f.html.empty(elem.buttonContainer);
            for(let key in wordOpts) {
                var btn = f.html.spawn(elem.buttonContainer, 'button', key);
                btn.className = 'words';
                btn.innerHTML = key;
                btn.data = wordOpts[key];
                btn.onclick = (e) => {
                    if(bubbleElem === null) {
                        bubbleElem = that.writeStory('You', '...');
                        p = f.html.getElem('p', bubbleElem);
                    }
                    let lastWords = e.currentTarget.id;
                    possibleResults = e.currentTarget.data;
                    chosenWords.push(lastWords);
                    p.innerHTML = chosenWords.join('');
                    console.log(JSON.stringify(lastWords));
                    console.log(JSON.stringify(possibleResults));
                    if(lastWords.endsWith('.') || lastWords.endsWith('!') || lastWords.endsWith('?')) {
                        if(possibleResults.length !== 1) {
                            console.error('hmmmm....')
                        }
                        callback(sentenceOpts[possibleResults][RESULT]); //should just be one at this point
                    } else {
                        wordIdx++;
                        createUserOptions();
                    }
                }
            } 
            bubbleElem.scrollIntoView(true);
        }
    }

    return that;
}());