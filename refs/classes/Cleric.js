"use strict";
/**
 * @file       cleric.js
 * @brief      class: cleric
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       13 August 2020
 * */

var Cleric = (function(){
    var that = {};

    var hitDice = '1d8';
    var hitPoints = {
        firstLevel: '8 + CON',
        levelUps: '1d8 + CON'
    };

    var proficiencies = {
        armor: ['light armor', 'medium armor', 'shields'],
        weapons: ['simple weapons'],
        savingThrows: ['WIS', 'CHA'],
        skills: ['history', 'medicine'] // | insight | persuasion | religion
    };

    var spellcastingAbility = 'WIS';
    var preparedSpellMax = 'WIS + level'
    var spellSaveDC = '8 + proficiency bonus + WIS';
    var spellAttack = 'proficiency bonus + WIS';

    var levels = {
        '1st': {
            proficiencyBonus: 2,
            cantrips: 3,
            spellSlots: {
                '1st': 2
            }
        }
    };

    //TODO: domain stuff

    var notes = "Clerics are priestly champions who weild divine magic in service of a higher power. They are intermediaries between the mortal world and the distant planes of the gods. Gods will send their clerics out to adventure to protect their worshippers, and further their agendas.";

    return that;
}());