
const inventories = {"classId" : "inventory", "id" : "0", "displayWidth" : 16, "items" : [
    {"classId" : "inventory", "id" : "0", "displayWidth" : 16, "items" : [
        {"classId" : "apple", "id" : "0"},
        {"classId" : "apple", "id" : "1"},
        {"classId" : "apple", "id" : "2"},
        {"classId" : "apple", "id" : "3"},
        {"classId" : "apple", "id" : "4"},
        {"classId" : "inventory", "id" : "5", "displayWidth" : 16, "items" : []},
    ]},
    {"classId" : "inventory", "id" : "1", "displayWidth" : 16, "items" : []},
    {"classId" : "inventory", "id" : "2", "displayWidth" : 16, "items" : []}
]};

function getInventoryFromPath(path) {
    let inventory = inventories;
    let idList = path.split("/");
    
    for(let i = 0; i < idList.length; ++i) {
        let items = inventory.items;
        
        if(Array.isArray(items)) {
            let next = items.find(function(item) {return item.id === idList[i];});
            
            if(typeof next != "undefined") {
                inventory = next;
            } else {
                return inventory;
            }
        } else {
            return inventory;
        }
    }
    
    return inventory;
}
