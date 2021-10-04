"use strict";
/**
 * @file       travok.js
 * @brief      Player character: Travok Ironfist
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       4 August 2020
 * */

var Travok = (function(){
    var that = {};

    var char = {
        name: 'Travok Ironfist',
        race: Dwarf,
        class: Cleric,
        background: Acolyte,
        level: 1,
        age: 200
    };

    var abilityScores = {
        strength: 14,
        dexterity: 8,
        constitution: 12,
        intelligence: 13,
        wisdom: 16,
        charisma: 12
    };

    var abilityMods = CHAR.getAbilityMods(abilityScores);

    var position = {
        //map: StoneTemple,
        encounter: TravoksRoom,
        posture: 'lying down',
        position: '3-10'
    };

    var maxHitPoints = 8 + abilityMods.CON;
    var hitPoints = maxHitPoints; //to start

    var proficiencyBonus = CHAR.getProficiencyBonus(char.level);

    var conditions = [];

    var backstory = "Most of Travok's clan work in the mines and forges, proudly adding to the kingdom's collection of gold, which was used to adorn the temples and palace. Travok always had a deeper admiration for the plain stone that was left over after extracting the riches it had held for so long. Stone is really the foundation of the Dwarven empire, so Travok apprenticed as a mason in his youth. Once he'd mastered his craft, he felt compelled to use it to support the common people, and to serve the gods. A year or so after he'd begun his service at the Temple of Ilmater, a horde of orcs invaded and barricaded the tunnels connecting the temple to the rest of the dwarven civilization."

    that.getEncounter = function() {
        return position.encounter;
    }

    //opts = 'first', 'last', 'full'
    that.getName = function(n) {
        let ret = char.name;
        let fullName = char.name.split(' ');
        switch(n) {
            case 'first': ret = fullName[0]; break;
            case 'last': ret = fullName[1]; break;
            default: break; //default to full name
        }
        return ret;
    }

    that.getPosture = function() {
        return position.posture;
    }

    that.getConditions = function() {
        return conditions;
    }

    that.changePosture = function(move) {
        switch(move) {
            case 'sits up': position.posture = 'sitting'; break;
            case 'stands': position.posture = 'standing'; break;
            case 'falls prone': position.posture = 'prone'; break;
            case 'sits down': position.posture = 'sitting'; break;
            case 'lies down': position.posture = 'lying down'; break;
        }
    }

    return that;
}());