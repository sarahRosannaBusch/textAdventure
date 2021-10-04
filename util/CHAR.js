"use strict";
/**
 * @file       CHAR.js
 * @brief      calculates character stats
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       17 August 2020
 * */

var CHAR = (function(){
    var that = {};

    that.getAbilityMods = function(abilityScores) {
        let mods = {};
        for(let ability in abilityScores) {
            let mod = (abilityScores[ability] - 10) / 2;
            mod = Math.floor(mod);
            switch(ability) {
                case 'strength': mods.STR = mod; break;
                case 'dexterity': mods.DEX = mod; break;
                case 'constitution': mods.CON = mod; break;
                case 'intelligence': mods.INT = mod; break;
                case 'wisdom': mods.WIS = mod; break;
                case 'charisma': mods.CHA = mod; break;
                default: 
                    console.warn('unknown ability: ' + ability); 
                    break;
            }
        }
        return mods;
    }

    that.getProficiencyBonus = function(level) {
        let prof = 2;
        if(level > 4) { prof = 3 }
        if(level > 8) { prof = 4 }
        if(level > 12) { prof = 5 }
        if(level > 16) { prof = 6 }
        return prof;
    }

    return that;
}());