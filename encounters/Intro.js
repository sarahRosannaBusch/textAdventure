"use strict";
/**
 * @file       Intro.js
 * @brief      Encounter: Game intro
 * @author     Sarah Rosanna Busch
 * @version    0
 * @date       31 Aug 2021
 * */

var Intro = (function(){
    var that = {};

    that.start = function() {
        main.writeStory('DM', 'Hi! My name is Sarah, but for this adventure you can call me Dungeon Master. Welcome to my "table." <br><br> Have you played Dungeons and Dragons before?');
        main.createBtnOpts(['Yes', 'No'], [rulesShort, rulesLong]);
    }

    var rulesShort = function() {
        Player.dndNoob = false;
        main.writeStory('DM', "Ok cool, I won't hold your hand through all the basic stuff then. FYI, this campaign is based entirely on the <a href='https://dnd.wizards.com/articles/features/basicrules' target=_'blank'>D&D Basic Rules</a>. You can reference them if you'd like, but you don't need to since the code will take care of all the rules stuff for you.");
        main.createBtnOpts(['Got it.', 'Wait, I want you to hold my hand.'], [textAdventure, function(){rulesLong2("No worries, I got you. ")}])
    }

    var rulesLong = function() {
        Player.dndNoob = true;
        main.writeStory('DM', "That's ok, this game is designed to familiarize you with the rules and language of D&D. You can read the <a href='https://dnd.wizards.com/articles/features/basicrules' target=_'blank'>D&D Basic Rules</a> if you're curious, but it's not necessary to play this text adventure. I'll explain the rules and terms as they come up.");
        main.createBtnOpts(['Got it.', "Don't bother explaining the rules."], [rulesLong2, notANoob]);
    }

    var notANoob = function() {
        Player.dndNoob = false;
        rulesLong2("Got it. No hand-holding for you. ");
    }

    var rulesLong2 = function(extraWords='') {
        main.writeStory('DM', extraWords + "All you really need to know to get started is that I have created a fantasy world full of lively characters, fearsome monsters, and epic adventures. I'll tell you all about it as we go. <br><br> You, the player, will be playing a single character. An adventurer ready to start questing to prove their worth. You get to decide who this character is and what they do, through exploration, social interaction, and combat.");
        main.createBtnOpts(['Go on...'], [textAdventure]);
    }

    var textAdventure = function() {
        main.writeStory('DM', "Normally, in D&D, you would come to the table with a level-one character already decked out in adventuring gear and with a small arsenal of supernatural abilities.<br><br> But where did you find that trinket? How hard was it for you to master those spells? How many hours did it take to become proficient with that sword? Was there a defining moment when you chose good over evil? Law over chaos?");
        main.createBtnOpts(["I'll only slay the evil monsters.", "I'm down to sow a little chaos."], [textAdventure2, textAdventure2]);
    }

    var textAdventure2 = function() {
        main.writeStory('DM', "You can certainly try, we'll see what the dice have to say. For the purposes of this text-adventure, I have created four level-zero characters for you to choose from. You will be picking up their story as they take their very first step towards becoming a hero. Guide them on their journey wisely. Each choice will help determine exactly what kind of hero they will become.");
        main.createBtnOpts(["Let me pick my character!"], [characterPicker]);
    }

    var characterPicker = function() {
        main.writeStory('DM', "Character choices: <br><br> 1. A dwarven acolyte who aspires to channel the power of a god. <br><br> 2. An elven soldier who aims to become a champion on the battlefield. <br><br> 3. A human bookworm itching to test their carefully crafted spells. <br><br> 4. A halfling with sticky fingers and an air of mystery.");
        main.createBtnOpts(["Dwarf<br>Acolyte", "Elf<br>Soldier", "Human<br>Sage", "Halfling<br>Criminal"], [pickDwarf, pickElf, pickHuman, pickHalfling]);
    }

    var pickDwarf = function() {
        Player.characterType = "cleric";
        main.writeStory('DM', "Good choice! You will be playing Travok Ironfist, the hill dwarf acolyte chosen by the gods to become a mighty cleric.");
        confirmCharacter();
    }

    var pickElf = function() {
        Player.characterType = "fighter";
        main.writeStory('DM', "Good choice! You will be playing Rhinn Galanodel, the wood elf soldier training to become an epic fighter.");
        confirmCharacter();
    }

    var pickHuman = function() {
        Player.characterType = "wizard";
        main.writeStory('DM', "Good choice! You will be playing Darvyn Dotsk, the human sage who's studying to become a powerful wizard.");
        confirmCharacter();
    }

    var pickHalfling = function() {
        Player.characterType = "rogue";
        main.writeStory('DM', "Good choice! You will be playing Poe Ungart, the lightfoot halfling criminal who was born to be a sneaky rogue.");
        confirmCharacter();
    }

    function confirmCharacter() {
        main.createBtnOpts(["End demo.", "Choose a different character."], [theEnd, characterPicker]);
    }

    var theEnd = function() {   
        var charName = "";
        switch(Player.characterType) {
            case 'cleric': charName = "Travok"; break;
            case 'fighter': charName = "Rhinn"; break;
            case 'wizard': charName = "Darvyn"; break;
            case 'rogue': charName = "Poe"; break;
        }     
        main.writeStory('DM', "That's it for now. This game is still under development, so come back soon to begin " + charName + "'s story.");
        main.createBtnOpts(["I will!", "I probably won't."],[happyFace, sadFace]);
    }

    function happyFace() {
        main.writeStory('DM', ":)");
    }

    function sadFace() {
        main.writeStory('DM', ":(");
    }

    return that;
}());