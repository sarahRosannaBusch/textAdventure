"use strict";
/**
 * @file       Intro.js
 * @brief      Encounter: Game Intro
 * @author     Sarah Rosanna Busch
 * @version    0.2
 * @date       11 April 2022
 * */

var Intro = (function(){
    var that = {};

    that.start = function() {
        hello();
        //characterPicker();
    }

    function hello() {
        main.writeStory('DM', DM[0][0]);
        //main.createBtnOpts(['Yes', 'Sort of', 'No'], [basicRules0, basicRules1, basicRules2]);
        main.sentenceBuilder(SENTENCE_0, function(result) {
            switch(result) {
                case "pro": basicRules0(); break;
                case "mid": basicRules1(); break;
                case "noob": basicRules2(); break;
                default: console.log('unknown noob lvl: ' + JSON.stringify(result)); break;
            }
        });
    }

    var basicRules0 = function() {
        main.writeStory('DM', DM[1][0]);
        main.createBtnOpts(['Got it.', 'Wait, I want you to hold my hand.'], [function(){confirmNoob("pro");}, function(){confirmNoob("noob");}])
    }
    
    var basicRules1 = function() {
        main.writeStory('DM', DM[1][1]);
        main.createBtnOpts(['Got it.', "I don't trust my gut, explain the rules to me.", "Don't bother explaining the rules."], [function(){confirmNoob("mid");}, function(){confirmNoob("noob");}, function(){confirmNoob("pro");}]);
    }

    var basicRules2 = function() {
        Player.dndNoob = true;
        main.writeStory('DM', DM[1][2]);
        main.createBtnOpts(['Got it.', "Don't bother explaining the rules."], [function(){confirmNoob("noob");}, function(){confirmNoob("pro");}]);
    }

    var confirmNoob = function(noob) {
        Player.dndNoob = noob;
        concept();
    }

    var concept = function() {
        let extraWords = "";
        switch(Player.dndNoob) {
            case 'pro': extraWords = DM[2][2]; break;
            case 'mid': extraWords = DM[2][0]; break;
            case 'noob': extraWords = DM[2][1]; break;
        }
        main.writeStory('DM', extraWords + "<br><br>" + DM[3][0]);
        main.createBtnOpts(['Go on...'], [textAdventure]);
    }

    var textAdventure = function() {
        main.writeStory('DM', DM[4][0]);
        main.sentenceBuilder(SENTENCE_1(), function(result) {
            //console.log(result);
            textAdventure2();
        });
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
        Player.PC.race = 'dwarf';
        Player.PC.class = 'cleric';
        main.writeStory('DM', DM[7][0]);
        confirmCharacter();
    }

    var pickElf = function() {
        Player.charName = "Rhinn";
        Player.PC.race = 'elf';
        Player.PC.class = 'fighter';
        main.writeStory('DM', DM[7][1]);
        confirmCharacter();
    }

    var pickHuman = function() {
        Player.charName = "Darvin";
        Player.PC.race = 'human';
        Player.PC.class = 'wizard';
        main.writeStory('DM', DM[7][2]);
        confirmCharacter();
    }

    var pickHalfling = function() {
        Player.charName = "Poe";
        Player.PC.race = 'halfling';
        Player.PC.class = 'rogue';
        main.writeStory('DM', DM[7][3]);
        confirmCharacter();
    }

    function confirmCharacter() {
        main.createBtnOpts(["Let's roll some dice!", "Choose a different character."], [diceIntro, characterPicker]);
    }

    function diceIntro() {
        let p1 = "";
        switch(Player.dndNoob) {
            case "noob": 
                p1 = DM[8][0];
                break;
            case "mid":
                p1 = DM[8][1];
                break;
            case "pro":
                p1 = DM[8][2];
                break;
            default:
                console.log('unknown dndNoob level: ' + Player.dndNoob);
                break;
        }
        main.writeStory('DM', p1 + "<br><br>" + DM[9]);
        main.createBtnOpts(["Roll for sex."], [rollForSex]);
    }

    function rollForSex() {
        main.rollDice('1d20', function(result) {
            let roll = result.resultTotal;
            console.log(roll);
            main.createBtnOpts(
                ["I rolled a " + roll + '.'], 
                [
                    function() {
                        let p1 = null;
                        if(roll === 1) {
                            Player.sex = 'none';
                            p1 = DM[10][0];
                        } else if(roll === 20) {
                            Player.sex = 'hermaphrodite';
                            p1 = DM[10][3];
                        } else {
                            if(roll % 2 === 0) { //evens
                                Player.sex = 'female';
                                p1 = DM[10][1];
                            } else {
                                Player.sex = 'male';
                                p1 = DM[10][2];
                            }
                        }
                        main.writeStory('DM', p1 + "<br><br>" + DM[11]);
                        main.createBtnOpts([
                            "she/her",
                            "he/him",
                            "they/them",
                            "he/they",
                            "she/they",
                            "any/all"
                        ], [setPronouns]);
                    }
                ]
            );
        });
    }

    function setPronouns(pronouns) {
        Player.PC.pronouns = pronouns;
        rollForSize();
    }

    function rollForSize() {   
        let p1 = DM[12][0];
        p1 = p1.replace("<pronouns>", Player.PC.pronouns);
        let p2 = '';
        let dice = '';
        switch(Player.PC.race) {
            case 'human': 
                p2 = DM[13][0]; 
                dice = '2d10';
                break;
            case 'dwarf': 
                p2 = DM[13][1]; 
                dice = '2d4';
                break;
            case 'elf': 
                p2 = DM[13][2]; 
                dice = '2d10';
                break;
            case 'halfling': 
                p2 = DM[13][3]; 
                dice = '2d4';
                break;
            default: 
                console.log('unknown race: ' + Player.PC.race);
                break;
        }
        main.writeStory('DM', p1 + "<br><br>" + p2);
        main.createBtnOpts(["Roll " + dice + '.'], [
            ()=>{main.rollDice(dice, confirmHeight);}
        ]);
        
        function confirmHeight(result) {
            main.createBtnOpts([result.result[0] + ' + ' + result.result[1] + ' = ' + result.resultTotal], [
                ()=>{rollForWeight(result);}
            ]);
        }
    }


    function rollForWeight(result) {
        let heightMod = result.resultTotal;
        let height = 0;
        let weightDice = '';
        switch(Player.PC.race) {
            case 'human': 
                height = 56 + heightMod;
                weightDice = '2d4';
                break;
            case 'dwarf': 
                height = 44 + heightMod;
                weightDice = '2d6';
                break;
            case 'elf': 
                height = 54 + heightMod;
                weightDice = '1d4';
                break;
            case 'halfling': 
                height = 31 + heightMod;
                break;
            default: 
                console.log('unknown race: ' + Player.PC.race);
                break;
        }
        Player.PC.height = height; //in inches
        let p1 = (Player.PC.race === 'halfling') ? DM[14][1] : DM[14][0];
        p1 = p1.replace('<charName>', Player.charName);
        p1 = p1.replace('<height>', Player.getHeightString());
        main.writeStory('DM', p1);
        if(Player.PC.race === 'halfling') {
            halflingWeight();
        } else {
            main.createBtnOpts(['Roll ' + weightDice + '.'], [
                ()=>{main.rollDice(weightDice, roll2);}
            ]);
        } 

        let firstRoll = 0;
        let secondRoll = 0;

        function roll2(result) {
            firstRoll = result.resultTotal;            
            main.createBtnOpts(['Second roll.'], [
                ()=>{main.rollDice(weightDice, confirmWeight);}
            ]);
        }

        function confirmWeight(result) {
            secondRoll = result.resultTotal;
            let baseWeight = 0;
            switch(Player.PC.race) {
                case 'human': baseWeight = 110; break;
                case 'dwarf': baseWeight = 115; break;
                case 'elf': baseWeight = 100; break;
                case 'halfling': baseWeight = 35; break;
                default: 
                    console.log('unknown race: ' + Player.PC.race);
                    break;
            }
            let weight1 = baseWeight + (heightMod * firstRoll);
            let weight2 = baseWeight + (heightMod * secondRoll);
            let btn1Text = baseWeight + ' lb + (' + heightMod + ' * ' + firstRoll + ') = ' + weight1 + 'lbs';
            let btn2Text = baseWeight + ' lb + (' + heightMod + ' * ' + secondRoll + ') = ' + weight2 + 'lbs';
            main.createBtnOpts([btn1Text, btn2Text], [next]);
        }       

        function halflingWeight() {
            let baseWeight = 35;
            let weight = baseWeight + heightMod;
            let btnText = baseWeight + ' lb + (' + heightMod + ' * 1lb) = ' + weight + 'lbs';
            main.createBtnOpts([btnText], [next]);
        }

        function next() {
            main.writeStory('DM', DM[15]);
            rollForColouring();
        }
    }

    function rollForColouring() {
        if(Player.eyeColour && Player.hairColour && Player.skinColour) {
            let p = DM[16][0];
            p = p.replace("<charName>", Player.charName);
            p = p.replace("<skinColour>", Player.skinColour);
            p = p.replace("<hairColour>", Player.hairColour);
            p = p.replace("<eyeColour>", Player.eyeColour);
            main.writeStory('DM', p);
            main.createBtnOpts(['End demo.'], [theEnd]);
            return;
        }

        let buttonText = [];
        let callbacks = [];
        if(!Player.eyeColour) {
            buttonText.push('Roll for eye colour.');
            callbacks.push(rollForEyes);
        }
        if(!Player.hairColour) {
            buttonText.push('Roll for hair colour.');
            callbacks.push(rollForHair);
        }
        if(!Player.skinColour) {
            buttonText.push('Roll for skin colour.');
            callbacks.push(rollForSkin);
        }

        main.createBtnOpts(buttonText, callbacks);

        let dice = (Player.PC.race === 'halfling') ? '1d4' : '1d6';
        let eyeColours = COLOURS[Player.PC.race].eyes;
        let hairColours = COLOURS[Player.PC.race].hair;
        let skinColours = COLOURS[Player.PC.race].skin;

        function rollForEyes() {            
            main.rollDice(dice, (result)=> {
                let idx = result.resultTotal - 1;
                Player.eyeColour = eyeColours[idx];
                rollForColouring();
            });
        }

        function rollForHair() {
            main.rollDice(dice, (result)=> {
                let idx = result.resultTotal - 1;
                Player.hairColour = hairColours[idx];
                rollForColouring();
            });
        }

        function rollForSkin() {
            main.rollDice(dice, (result)=> {
                let idx = result.resultTotal - 1;
                Player.skinColour = skinColours[idx];
                rollForColouring();
            });
        }
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
            "You're gonna do great.",
            "No worries, I got you.",
            "Alrighty then, no hand-holding for you."
        ],
        [
            "All you really need to know to get started is that I have created a fantasy world full of lively characters, fearsome monsters, and epic adventures. I'll tell you all about it as we go. You, the player, will be playing a single character. An adventurer ready to start questing to prove their worth. You get to decide who this character is and what they do, through exploration, social interaction, and combat."
        ],
        [
            "Normally, in D&D, you would come to the table with a level-one character already decked out in adventuring gear and with a small arsenal of supernatural abilities. But how hard was it for you to master those spells? How many hours did it take to become proficient with that sword? Where the hell did this trinket come from? Was there a defining moment when you chose good over evil? Law over chaos?"
        ],
        [
            "You can certainly try. For the purposes of this text-adventure, I have created four level-zero characters for you to choose from. You will be picking up their story as they take their very first step towards becoming a hero. Guide them on their journey wisely. Each choice will help determine exactly what kind of hero they will become."
        ],
        [
            "Character choices: <br><br> 1. A dwarven acolyte who aspires to channel the power of a god. <br><br> 2. An elven soldier who aims to become a champion on the battlefield. <br><br> 3. A human bookworm itching to test their carefully crafted spells. <br><br> 4. A halfling with sticky fingers and an air of mystery."
        ],
        [
            "Good choice! You will be playing Travok Ironfist, the hill dwarf acolyte chosen by the gods to become a mighty cleric.",
            "Good choice! You will be playing Rhinn Galanodel, the wood elf soldier training to become an epic fighter.",
            "Good choice! You will be playing Darvyn Dotsk, the human sage who's studying to become a powerful wizard.",
            "Good choice! You will be playing Poe Ungart, the lightfoot halfling criminal who was born to be a sneaky rogue."
        ],
        [
            "In D&D, the DM describes the scene then the player describes what their character tries to do. Whenever an outcome is uncertain, we roll dice to see what happens.",
            "As a reminder, in RPGs we roll dice whenever the outcome of an action is uncertain.", 
            "As you know, in D&D we roll dice whenever the outcome of an action is uncertain."
        ],
        [
            "You can think of the dice as fate, chance, the Universe, God, Satan, or whatever works for you. Basically, the dice decide the things that we don't get to decide for ourselves. For example, we don't get to choose the body we are born with. So let's roll a d20 to see what you're working with. Evens for female, odds for male."
        ],
        [
            "Sorry to say this friend, but no sex for you. You're smooth as a Ken doll down there.",
            "Congratulations, you get a vagina!",
            "Congratulations, you get a penis!",
            "Natural 20! I think that means you get both a penis and a vagina!"
        ],
        [
            "Hopefully you're happy with what the dice have given you. But if you're not, you can seek out ways to change it in game. Don't worry though, sex has no bearing on the choices you can make or your ability to become a hero. Common language does tend to be gendered, however, so pick your character's preferred pronouns."
        ],
        [
            "Got it, <pronouns> it is. You'll be able to change this at any time, if you find it doesn't feel right. Next, let's determine your character's size."
        ],
        [
            "Humans vary as widely in height and weight in the world of D&D as they do in real life, standing from under 5 to well over 6 feet tall and weighing between 125 to 250 pounds. Roll 2d10 to see how many inches over 4'8\" your character is.",
            "Though dwarves are all well under 5 feet tall, they are so wide and dense that they can weigh the same as any human. Roll 2d4 to see how many inches over 3'8\" your character is.",
            "Elves are graceful with fine features, and tend to be a bit shorter and more slender than humans. Roll 2d10 to see how many inches over 4'6\" your character is.",
            "Halflings are short and stout and are all pretty much the same size, coming in at about 3 feet and between 40 and 45 pounds. Roll 2d4 to see how many inches over 2'7\" and how many pounds over 35 lbs your character is."
        ],
        [
            "<charName> is <height> tall. You pretty much have to take the height you get. Your weight on the other hand you do have some control over, within a reasonable range for your height and body type. So roll twice for your weight modifier and pick the result you prefer.",
            "<charName> is <height> tall. Since halflings don't vary much in size, we'll just use that roll to determine <possessivePronoun> weight as well."
        ],
        [
            "Alrighty, last but not least, let's roll for your character's colouring."
        ],
        [
            "Beautiful! <charName> has a <skinColour> complexion, with naturally <hairColour> hair, and <eyeColour> eyes. Feel free to add whatever adjectives you like to that as you build your mental picture of this character."
        ]
    ];

    const COLOURS = {
        human: {
            eyes: ["amber", "blue", "brown", "grey", "green", "hazel"],
            hair: ["black", "dark brown", "red", "blond", "dirty blond", "orange"],
            skin: ["ivory", "beige", "light brown", "medium brown", "dark brown", "very dark brown"]
        },
        dwarf: {
            eyes: ["amber", "black", "brown", "grey", "green", "hazel"],
            hair: ["black", "dark grey", "brown", "red", "dark brown", "light grey"],
            skin: ["deep brown", "rosy brown", "light brown", "deep tan", "sienna", "umber"]
        },
        elf: {
            eyes: ["gold", "silver", "amber", "blue", "grey", "green"],
            hair: ["green", "blue", "red", "brown", "black", "blond"],
            skin: ["copper", "bronze", "bluish-white", "light brown", "medium brown", "dark brown"]
        },
        halfling: {
            eyes: ["brown", "hazel", "amber", "grey"],
            hair: ["brown", "sandy brown", "dirty blond", "grey"],
            skin: ["tan", "peaches-and-cream", "light brown", "rosy brown"]
        },
    }

    const SENTENCE_0 = [
        ["pro", "Yes", "."],
        ["pro", "Yes", ", ", "I've played ", "5th edition."],
        ["mid", "Yes", ", ", "I've played ", "an older version."],
        ["noob", "No", "."],
        ["pro", "No", ", ", "but I ", "know ", "the 5e rules."],
        ["mid", "No", ", ", "but I ", "know ", "older edition rules."],
        ["mid", "No", ", ", "but I ", "have ", "watched people play."],
        ["noob", "No", ", ", "but I ", "have ", "heard of it."],
        ["mid", "No", ", ", "but I ", "have ", "played other RPGs."],
    ];

    
    const SENTENCE_1 = function() {
        let sentence = [
            [0, "I'll ", "slay all the ", "monsters."],
            [1, "I'll ", "slay all the ", "beasts."],
            [2, "I'll ", "slay all the ", "dragons."],
            [3, "I'll ", "slay all the ", "zombies."],
            [4, "I'm ", "down to ", "find all the ", "loot."],
            [5, "I'm ", "down to ", "find all the ", "secret doors."],
            [6, "I'm ", "down to ", "find all the ", "traps."],
            [7, "I'm ", "down to ", "sow a little ", "chaos."],
            [8, "I'm ", "down to ", "sow a little ", "kindness."],
            [9, "I'm ", "down to ", "pick some ", "locks."],
            [10, "I'm ", "down to ", "pick some ", "pockets."]
        ];

        let result = 11;

        let goodMonsters = [
            'beasts.',
            'dragons.',
            'fey.',
            'giants.',
            'constructs.',
            'elementals.',
            'humanoids.',
            'celestials.'
        ];

        let evilMonsters = [
            'beasts.',
            'dragons.',
            'fiends.',
            'fey.',
            'giants.',
            'aberrations.',
            'constructs.',
            'elementals.',
            'oozes.',
            'plants.',
            'monstrosities.',
            'humanoids.',
            'undead.'
        ];

        let numGoodMonsters = goodMonsters.length;
        let numEvilMonsters = evilMonsters.length;

        for(let i = 0; i < numGoodMonsters; i++) {
            sentence.push([result, "I'll ", "slay all the ", "good ", goodMonsters[i]]);
            result++;
            sentence.push([result, "I'm ", "down to ", "slay all the ", "good ", goodMonsters[i]]);
            result++;
        }

        for(let i = 0; i < numEvilMonsters; i++) {
            sentence.push([result, "I'll ", "slay all the ", "evil ", evilMonsters[i]]);
            result++;
            sentence.push([result, "I'm ", "down to ", "slay all the ", "evil ", evilMonsters[i]]);
            result++;
        }

        let adjectives = [
            'mightiest ',
            'most powerful ',
            'sneakiest ',
            'most self-righteous ',
            'kindest ',
            'goofiest ',
            'greediest ',
            'sexiest ',
            'most successful ',
            'richest '
        ];

        let nouns = [
            'rogue ',
            'wizard ',
            'cleric ',
            'fighter ',
            'bad-ass ',
            'adventurer '
        ];

        let terminators = [
            'ever!',
            'off all time!',
            'in the world!',
            'in my family!',
            'from my hometown!'
        ];

        let numAdj = adjectives.length;
        let numNouns = nouns.length;
        let numTerm = terminators.length;

        for(let i = 0; i < numAdj; i++) {
            for(let j = 0; j < numNouns; j++) {
                for(let k = 0; k < numTerm; k++) {
                    sentence.push([result, "I'll ", "be the ", adjectives[i], nouns[j], terminators[k]]);
                    result++;
                    sentence.push([result, "I'm ", "gonna ", "be the ", adjectives[i], nouns[j], terminators[k]]);
                    result++;
                }
            }
        }

        return sentence;
    }

    return that;
}());