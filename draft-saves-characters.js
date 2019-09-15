
let characters = {};

characters[0] = {
    "classId" : "adnyropast",
    "stats" : {
        
    },
    "energy" : 50
};

characters["haple0"] = {
    "classId" : "haple",
    "stats" : {
        
    },
    "energy" : 50
};

function getSavedCharacter(id) {
    try {
        let data = characters[id];
        
        let character = EC[data.classId].fromData();
        
        
    } catch(error) {
        console.error(error);
    }
}

function makeHapleCharacter() {
    return {
        "classId" : "haple",
        "stats" : {
            
        },
        "energy" : 50
    };
}

let currentCharacter = "haple0";
