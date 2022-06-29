"use strict"

/** 
 * @file main.js
 * @brief  D&D Backstories main functionality
 * @author Sarah Rosanna Busch
 * @version 0.2
 * @date   8 June 2022
 */

var main = (function() {
    var that = {};
    var elem = {};
    var vars = {
        bubbleCount: 0, //number of text bubbles displayed
        diceShowing: false,
        choiceIdx: 0, //which choice is the user on
        choices: [], //chosen choices for current encounter
        diceIdx: 0,
        diceRolls: []
    }  

    var diceRoller = null;

    that.init = function() {
        elem.login = f.html.getElem('login');
        elem.loginError = f.html.getElem('#loginError');
        elem.main = f.html.getElem('main');
        elem.header = f.html.getElem('header');
        elem.storyBody = f.html.getElem('#storyBody');
        elem.storyText = f.html.getElem('#storyText');
        elem.dmTop = f.html.getElem('#dmTop');
        elem.dmBtm = f.html.getElem('#dmBtm');
        elem.sentencePreview = f.html.getElem('#sentencePreview');
        elem.playerSentence = f.html.getElem('#playerSentence');
        elem.undoBtn = f.html.getElem('#undoBtn');
        elem.playerOpts = f.html.getElem('#playerOpts');
        elem.playerMatCover = f.html.getElem('#playerMatCover');
        elem.dmTable = f.html.getElem('#dmTable');
        elem.diceBox = f.html.getElem('#diceBox');
        elem.buttonContainer = f.html.getElem('#buttonContainer');
        elem.dialogs = f.html.getElem('dialogs');
        elem.notebook = f.html.getElem('#notebook');
        elem.characterSheet = f.html.getElem('#characterSheet');
        elem.backstory = f.html.getElem('#backstory');
        elem.notes = f.html.getElem('#bags');
        elem.spells = f.html.getElem('#spells');
        
        diceRoller = new DICE.dice_box(elem.diceBox);
        showDiceBox(false);

        vars.bubbleCount = 0;
    }

    that.login = function(e, username, password) {
        e.preventDefault();
        let str = JSON.stringify({'login':{'username':username, 'password':password}});
        f.ajax.post('users.json', str, function(ack) {
            console.log(ack);
            ack = JSON.parse(ack);
            if(ack.login) {
                Player.setUser(ack.username);
                Player.initData(ack);
                vars.choices = Player.getData('choices');
                vars.diceRolls = Player.getData('diceRolls');
                elem.login.style.display = 'none';
                Intro.start();
            } else {
                elem.loginError.style.display = 'block';
            }
        });
    }

    that.rollDice = function(diceToRoll, callback) {
        if(vars.diceRolls.length >= vars.diceIdx + 1) {
            vars.diceIdx++;
            callback(vars.diceRolls[vars.diceIdx - 1]);
            return;
        }
        disableUI(true);
        showDiceBox(true);
        diceRoller.setDice(diceToRoll);
        diceRoller.start_throw(null, (result) => {
            if(result === -1) {
                elem.buttonContainer.innerText = "Oops, your dice rolled off the table. Refresh your browser and try again."
            } else {
                vars.diceIdx++;
                Player.saveDiceRolls(result);
                disableUI(false);
                callback(result);
            }
        });
    }

    function showDiceBox(show) {
        if(show) {
            vars.diceShowing = true;
            elem.diceBox.style.display = 'block';
        } else {
            vars.diceShowing = false;
            elem.diceBox.style.display = 'none';
        }
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
        if(vars.diceShowing) showDiceBox(false);
        vars.bubbleCount++;
        var bubbleId = "textBubble_" + vars.bubbleCount;
        var speakerClass = (speaker === "You") ? "player" : "dm";
        elem.storyBody.innerHTML += "<div id=" + bubbleId + " class='" + speakerClass + "'><fieldset><legend>" + speaker 
            + "</legend><p></p></fieldset></div>";
        var bubbleId = "textBubble_" + vars.bubbleCount;
        var bubbleElem = f.html.getElem('#' + bubbleId);
        var p = f.html.getElem("p", bubbleElem);
        p.innerHTML = text;
        bubbleElem.scrollIntoView(true); //false to scroll to bottom
        return bubbleElem;
    }

    //param opts = array of strings to be printed in buttons
    //param callbacks -> pass opts idx selected back
    //param excludes (optional) -> indexes of items to exclude from opts
    that.createBtnOpts = function(opts, callback, excludes) {
        if(vars.choices.length >= vars.choiceIdx + 1) {
            vars.choiceIdx++; //doesn't execute if i put it after the callback...
            callback(vars.choices[vars.choiceIdx - 1]);
        } else {
            f.html.empty(elem.buttonContainer);
            var numButtons = opts.length;
            for(var i = 0; i < numButtons; i++) {
                if(excludes && excludes.includes(i)) {
                    continue;
                }
                var btn = f.html.spawn(elem.buttonContainer, 'button', i);
                btn.innerHTML = opts[i];
                btn.className = 'words';
                btn.callback = callback;
                btn.onclick = function() {
                    let choice = JSON.parse(this.id);
                    vars.choiceIdx++;           
                    Player.saveChoice(choice);
                    this.callback(choice);
                }
            }
        }
    }

    that.sentenceBuilder = function(sentenceOpts, callback) {
        if(vars.choices.length >= vars.choiceIdx + 1) {
            vars.choiceIdx++;
            callback(vars.choices[vars.choiceIdx - 1]);
            return;
        }
        elem.sentencePreview.style.display = 'flex';
        let numOpts = sentenceOpts.length;
        let wordIdx = 0; 
        let chosenWords = [];

        //track indices of remaining sentenceOpts
        let possibleResults = []; 
        possibleResults.push([]);
        for(let i = 0; i < numOpts; i++) {
            possibleResults[wordIdx].push(i);
        }
        
        createUserOptions();
        
        //undo last words chosen in sentence Builder
        elem.undoBtn.onclick = function() {
            if(wordIdx === 0) return;
            chosenWords.pop();
            possibleResults.pop();
            wordIdx--;
            let sentence = chosenWords.join('');
            elem.playerSentence.innerHTML = sentence;
            createUserOptions();
        }
        
        function createUserOptions() {           
            //find next word options to show user
            let wordOpts = {};
            for(let i = 0; i < numOpts; i++) {
                if(!possibleResults[wordIdx].includes(i)) continue;
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
                    let lastWords = e.currentTarget.id;
                    let results = e.currentTarget.data;
                    chosenWords.push(lastWords);
                    let sentence = chosenWords.join('');
                    elem.playerSentence.innerHTML = sentence;
                    if(lastWords.endsWith('.') || lastWords.endsWith('!') || lastWords.endsWith('?')) {
                        if(results.length !== 1) {
                            console.error('hmmmm....')
                        }                        
                        vars.choiceIdx++;     
                        Player.saveChoice(results[0]);
                        elem.sentencePreview.style.display = 'none';
                        f.html.empty(elem.playerSentence);
                        callback(results[0]); //should just be one at this point
                    } else {
                        wordIdx++;
                        possibleResults[wordIdx] = e.currentTarget.data;
                        createUserOptions();
                    }
                }
            } 
        }
    }

    return that;
}());