"use strict";
/**
 * @file       dwarf.js
 * @brief      race: hill dwarf
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       11 August 2020
 * */

var Dwarf = (function(){
    var that = {};

    var abilityIncreases = {
        constitution: 2, 
        wisdom: 1 //hill dwarf
    };

    var age = {
        maturity: 15,
        adulthood: 50,
        lifespan: 350
    };

    var size = 'medium';
    var speed = {
        base: 25,
        special: 'not reduced by wearing heavy armor'
    };

    var vision = { 
        'darkvision': 60,
    };

    var resistances = ['poison']; 

    var advantages = {
        savingThrows: ['poison']
    };

    var proficiencies = {
        weapons: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'],
        tools: ["mason's tools"], // | smith's tools | brewer's supplies
        special: ['history of stonework (double proficiency bonus)']
    };

    var hitPointBonus = '+1 per level';

    var languages = ['Common', 'Dwarvish'];

    var notes = "Dwarf kingdoms reside in ancient halls, carved into the stone of the earth, mined for its gems and metals. Long histories and long memories instill deep seeded hatred of goblins and orcs in most dwarves. Respect for tradition and clan, and devotion to the gods of industrious labour, skill in battle, and devotion to the forge, ensures dwarves weather the centuries with stoic endurance and little change. Individual dwarves are determined and loyal, true to their word and decisive in action, sometimes to the point of stubborness. Hill dwarves have keen senses, deep intuition, and remarkable resilience.";

    return that;
}());