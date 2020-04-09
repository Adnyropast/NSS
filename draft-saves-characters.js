
function updateCurrentCharacter() {
    let entity = PLAYERS[0].entity;
    let characterData = getCurrentCharacterData();
    
    characterData.stats = entity.stats;
    characterData.energy = entity.getEnergy();
}

function getCurrentCharacterData() {
    return getInventoryFromPath(getCurrentChapter().playerIdPath).characterData;
}
