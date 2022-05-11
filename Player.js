"use strict";
/**
 * @file       Player.js
 * @brief      Player data
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       7 April 2022
 * */

var Player = (function(){
    var that = {
        dndNoob: "noob",
        charName: '',
        race: '',
        class: '',
        pronouns: "",
        height: 0, //inches
        weight: 0, //pounds
    };

    var vars = {
        curEncounter: "Intro",
        playerChoices: []
    }

    that.saveChoice = function(choice) {
        vars.playerChoices.push(choice);
        console.log('player choices: ' + vars.playerChoices);
        let saveData = JSON.stringify(vars);
        f.ajax.post('user/_user.json', saveData, ()=>{});
    }

    that.getSubjectivePronoun = function() {
        let pronoun = that.pronouns.split('/')[0];
        if(pronoun === 'any') {
            let rnd = Math.floor((Math.random() * 3) + 1);
            switch(rnd) {
                case 1: pronoun = 'he'; break;
                case 2: pronoun = 'she'; break;
                case 3: pronoun = 'they'; break;
            }
        }
        return pronoun;
    }

    that.getObjectivePronoun = function() {
        let pronoun = that.pronouns.split('/')[1];
        if(pronoun === 'all') {
            let rnd = Math.floor((Math.random() * 3) + 1);
            switch(rnd) {
                case 1: pronoun = 'him'; break;
                case 2: pronoun = 'her'; break;
                case 3: pronoun = 'them'; break;
            }
        }
        return pronoun;
    }

    that.getPossessivePronoun = function() {
        let pronoun = that.pronouns.split('/')[0];
        if(pronoun === 'any') {
            let rnd = Math.floor((Math.random() * 3) + 1);
            switch(rnd) {
                case 1: pronoun = 'his'; break;
                case 2: pronoun = 'hers'; break;
                case 3: pronoun = 'theirs'; break;
            }
        } else if(pronoun === 'he') {
            pronoun = 'his';
        } else {
            pronoun = 'hers';
        }
        return pronoun;
    }

    that.getHeightString = function() {
        let height = Player.height;
        let feet = Math.floor(height / 12);
        let inches = height % 12;
        return feet + "'" + inches + '"'; 
    }

    return that;
}());