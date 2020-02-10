
/**
 * Returns specific relevant data to save on playable characters.
 * (Doesn't give the position or size, for example)
 */

function getCharacterData(character) {
    return {
        classId : entity_getClassId(character),
        stats : character.stats,
        energy : character.getEnergy()
    };
}

function updateCurrentCharacter() {
    let entity = PLAYERS[0].entity;
    let characterData = getCurrentCharacterData();
    
    characterData.classId;
    characterData.stats = entity.stats;
    characterData.energy = entity.getEnergy();
}

function getCurrentCharacter() {
    let characterData = getInventoryFromPath(getCurrentSave().playerIdPath).characterData;
    
    return EC[characterData.classId].fromData(characterData);
}

function getCurrentCharacterData() {
    return getInventoryFromPath(getCurrentSave().playerIdPath).characterData;
}
