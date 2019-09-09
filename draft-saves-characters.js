
let characters = {};

characters[0] = {
    "classId" : "adnyropast",
    
};



function getSavedCharacter(id) {
    try {
        let data = characters[id];
        
        let character = EC[data.classId].fromData();
        
        
    } catch(error) {
        console.error(error);
    }
}
