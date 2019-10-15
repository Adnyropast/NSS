
let playerClassId = "haple";

function getPlayerClass() {
    if(EC.hasOwnProperty(playerClassId)) {
        return EC[playerClassId];
    }
    
    return PlayableCharacter;
}

function setPlayerClassId(id) {
    playerClassId = id;
}

let hitsCount = 0;

let playerPositionM = new Vector(0, 0);

let characters = {};

characters[0] = makeCharacter("adnyropast");

characters["haple0"] = makeHapleCharacter();
characters["haple1"] = makeHapleCharacter();
characters["haple1"].stats["regeneration"] = 2;
characters["haple2"] = makeHapleCharacter();
characters["haple2"].energy = 1;
characters["haple2"].stats["realEnergy"] = 1;

characters["ten0"] = makeCharacter("ten");

function getSavedCharacter(id = currentCharacter) {
    try {
        let data = characters[id];
        
        let character = EC[data.classId].fromData(data);
        
        character.setStats(data.stats);
        character.setEnergy(data.energy);
        
        return character;
    } catch(error) {
        console.error(error);
    }
}

function makeHapleCharacter() {
    return {
        "classId" : "haple",
        "stats" : {
            "walk-speed" : 0.5,
            "walk-speed-tired" : 0.25,
            "air-speed" : 0.5,
            "swim-speed" : 0.5,
            
            "climb-speed" : 0.25,
            "jump-force" : 1.5,
            "regeneration" : 0.0625,
            
            "walljump-angle" : 0.2617993877991494,
            "walljump-force" : 1.9375,
            
            "midairJump-count" : 1
        },
        "energy" : 50
    };
}

let currentCharacter = "haple0";

function updateSavedCharacter(id = currentCharacter, entity = PLAYER) {
    characters[id].classId;
    characters[id].stats = entity.stats;
    characters[id].energy = entity.getEnergy();
}

function makeCharacter(classId) {
    if(classId === "adnyropast") {return {
        "classId" : "adnyropast",
        "stats" : {
            
        },
        "energy" : 50
    };}
    if(classId === "haple") {return makeHapleCharacter();}
    if(classId === "ten") {return {
        "classId" : "ten",
        "stats" : {},
        "energy" : 200
    };}
    
    return {
        classId : classId,
        stats : {},
        energy : 1
    };
}
