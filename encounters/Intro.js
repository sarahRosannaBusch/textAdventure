"use strict";
/**
 * @file       Intro.js
 * @brief      Encounter: Game Intro
 * @author     Sarah Rosanna Busch
 * @version    0.1
 * @date       9 Feb 2022
 * */

var Intro = (function(){
    var that = {};

    that.start = function() {
        main.writeStory('DM', DM[0][0]);
        //main.createBtnOpts(['Yes', 'Sort of', 'No'], [basicRules0, basicRules1, basicRules2]);
        main.sentenceBuilder(SENTENCE_0, function(result) {
            switch(result) {
                case "Pro": basicRules0(); break;
                case "Mid": basicRules1(); break;
                case "Noob": basicRules2(); break;
                default: console.log('unknown noob lvl: ' + JSON.stringify(result)); break;
            }
        });
    }

    var basicRules0 = function() {
        main.writeStory('DM', DM[1][0]);
        main.createBtnOpts(['Got it.', 'Wait, I want you to hold my hand.'], [function(){confirmNoob("Pro");}, function(){confirmNoob("Noob");}])
    }
    
    var basicRules1 = function() {
        main.writeStory('DM', DM[1][1]);
        main.createBtnOpts(['Got it.', "I don't trust my gut, explain the rules to me.", "Don't bother explaining the rules."], [function(){confirmNoob("Mid");}, function(){confirmNoob("Noob");}, function(){confirmNoob("Pro");}]);
    }

    var basicRules2 = function() {
        Player.dndNoob = true;
        main.writeStory('DM', DM[1][2]);
        main.createBtnOpts(['Got it.', "Don't bother explaining the rules."], [function(){confirmNoob("Noob");}, function(){confirmNoob("Pro");}]);
    }

    var confirmNoob = function(noob) {
        Player.dndNoob = noob;
        concept();
    }

    var concept = function() {
        let extraWords = "";
        switch(Player.dndNoob) {
            case 'Pro': extraWords = DM[2][0]; break;
            case 'Mid': extraWords = DM[2][1]; break;
            case 'Noob': extraWords = DM[2][2]; break;
        }
        main.writeStory('DM', extraWords + "<br><br>" + DM[3][0]);
        main.createBtnOpts(['Go on...'], [textAdventure]);
    }

    var textAdventure = function() {
        main.writeStory('DM', DM[4][0]);
        main.createBtnOpts(["I'll only slay the evil monsters.", "I'm down to sow a little chaos."], [textAdventure2, textAdventure2]);
    }

    var textAdventure2 = function() {
        main.writeStory('DM', DM[5][0]);
        main.createBtnOpts(["Let me pick my character!"], [characterPicker]);
    }

    var characterPicker = function() {
        main.writeStory('DM', DM[6][0]);
        main.createBtnOpts(["Dwarf<br>Acolyte", "Elf<br>Soldier", "Human<br>Sage", "Halfling<br>Criminal"], [pickDwarf, pickElf, pickHuman, pickHalfling]);
    }

    var pickDwarf = function() {
        Player.charName = "Travok";
        main.writeStory('DM', DM[7][0]);
        confirmCharacter();
    }

    var pickElf = function() {
        Player.charName = "Rhinn";
        main.writeStory('DM', DM[7][1]);
        confirmCharacter();
    }

    var pickHuman = function() {
        Player.charaName = "Darvin";
        main.writeStory('DM', DM[7][2]);
        confirmCharacter();
    }

    var pickHalfling = function() {
        Player.charName = "Poe";
        main.writeStory('DM', DM[7][3]);
        confirmCharacter();
    }

    function confirmCharacter() {
        main.createBtnOpts(["End demo.", "Choose a different character."], [theEnd, characterPicker]);
    }

    var theEnd = function() {      
        main.writeStory('DM', "That's it for now. This game is still under development, so come back soon to begin " + Player.charName + "'s story.");
        main.createBtnOpts(["I will!", "I probably won't."],[happyFace, sadFace]);
    }

    function happyFace() {
        main.writeStory('DM', ":)");
    }

    function sadFace() {
        main.writeStory('DM', ":(");
    }

    const DM = [
        [
            'Hi! My name is Sarah, but for this adventure you can call me Dungeon Master. Welcome to my "table." <br><br> Have you played Dungeons and Dragons before?'
        ],
        [
            "Ok cool, I won't hold your hand through all the basic stuff then. FYI, this campaign is based entirely on the <a href='https://dnd.wizards.com/articles/features/basicrules' target='_blank'>D&D 5e Basic Rules</a>. You can reference them if you'd like, but you don't need to since the code will take care of all the rules stuff for you.",
            "Ok great, I'll only explain the important rules to you then. If you want to reference the <a href='https://dnd.wizards.com/articles/features/basicrules' target='_blank'>D&D 5e Basic Rules</a> you can, but it's not necessary to play this text adventure. Go with your gut, all choices lead to adventure.",
            "That's ok, this game is designed to familiarize you with the rules and language of D&D. You can read the <a href='https://dnd.wizards.com/articles/features/basicrules' target='_blank'>D&D 5e Basic Rules</a> if you're curious, but it's not necessary to play this text adventure. I'll explain the rules and terms as they come up."
        ],
        [
            "Good luck!",
            "No worries, I got you.",
            "Got it. No hand-holding for you."
        ],
        [
            "All you really need to know to get started is that I have created a fantasy world full of lively characters, fearsome monsters, and epic adventures. I'll tell you all about it as we go. You, the player, will be playing a single character. An adventurer ready to start questing to prove their worth. You get to decide who this character is and what they do, through exploration, social interaction, and combat."
        ],
        [
            "Normally, in D&D, you would come to the table with a level-one character already decked out in adventuring gear and with a small arsenal of supernatural abilities.But how hard was it for you to master those spells? How many hours did it take to become proficient with that sword? Where the hell did this random trinket come from? Was there a defining moment when you chose good over evil? Law over chaos?"
        ],
        [
            "You can certainly try, we'll see what the dice have to say. For the purposes of this text-adventure, I have created four level-zero characters for you to choose from. You will be picking up their story as they take their very first step towards becoming a hero. Guide them on their journey wisely. Each choice will help determine exactly what kind of hero they will become."
        ],
        [
            "Character choices: <br><br> 1. A dwarven acolyte who aspires to channel the power of a god. <br><br> 2. An elven soldier who aims to become a champion on the battlefield. <br><br> 3. A human bookworm itching to test their carefully crafted spells. <br><br> 4. A halfling with sticky fingers and an air of mystery."
        ],
        [
            "Good choice! You will be playing Travok Ironfist, the hill dwarf acolyte chosen by the gods to become a mighty cleric.",
            "Good choice! You will be playing Rhinn Galanodel, the wood elf soldier training to become an epic fighter.",
            "Good choice! You will be playing Darvyn Dotsk, the human sage who's studying to become a powerful wizard.",
            "Good choice! You will be playing Poe Ungart, the lightfoot halfling criminal who was born to be a sneaky rogue."
        ]
    ];

    const SENTENCE_0 = [
        ["Pro", "Yes", "."],
        ["Pro", "Yes", ", ", "I've played ", "5th edition."],
        ["Mid", "Yes", ", ", "I've played ", "an older version."],
        ["Mid", "Yes", ", ", "I've played ", "other RPGs."],
        ["Noob", "No", "."],
        ["Pro", "No", ", ", "but I ", "know ", "the 5e rules."],
        ["Mid", "No", ", ", "but I ", "know ", "older edition rules."],
        ["Mid", "No", ", ", "but I ", "have ", "watched people play."],
        ["Noob", "No", ", ", "but I ", "have ", "heard of it."]
    ];

    return that;
}());