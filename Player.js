"use strict";
/**
 * @file       Player.js
 * @brief      Player data
 * @author     Sarah Rosanna Busch
 * @version    0.1
 * @date       16 May 2022
 * */

var Player = (function(){
    var that = {}; //public methods

    let data = { //this gets overwritten by data from server
        dndNoob: "",
        charName: '',
        encounter: "",
        choices: [], //for the current encounter
        diceRolls: [],
        race: '',
        class: '',
        sex: '',
        pronouns: "",
        height: 0, //inches
        weight: 0, //pounds
        eyeColour: '',
        hairColour: '',
        skinColour: ''
    };

    let username = '';

    that.setUser = function(user) {
        username = user;
    }

    that.initData = function(d) {
        data = d.userData;
    }

    that.getData = function(key) {
        return data[key];
    }

    that.setData = function(key, value) {
        data[key] = value;        
        console.log('player data: ' + key + ' = ' + value);
        //save to server
        let pd = {
            'username': username,
            'playerData': {}
        };
        pd.playerData[key] = value;
        let str = JSON.stringify(pd);
        f.ajax.post('playerData', str, function(ack) {
            console.log(ack);
        }); 
    }

    // track each player choice in an array
    that.saveChoice = function(choice) {
        data.choices.push(choice); //save locally
        console.log('player choices: ' + data.choices);
        //save to server
        let str = JSON.stringify({
            'username': username,
            'playerChoices': data.choices
        });
        f.ajax.post('playerChoices', str, function(ack) {
            console.log(ack);
        }); 
    }

    that.saveDiceRolls = function(results) {
        data.diceRolls.push(results);
        console.log('dice rolls: ' + JSON.stringify(data.diceRolls));
        let str = JSON.stringify({
            'username': username,
            'diceRolls': data.diceRolls
        });
        f.ajax.post('diceRolls', str, function(ack) {
            console.log(ack);
        }); 
    }

    that.getSubjectivePronoun = function() {
        let pronoun = data.pronouns.split('/')[0];
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
        let pronoun = data.pronouns.split('/')[1];
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
        let pronoun = data.pronouns.split('/')[0];
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
        let height = data.height;
        let feet = Math.floor(height / 12);
        let inches = height % 12;
        return feet + "'" + inches + '"'; 
    }

    return that;
}());