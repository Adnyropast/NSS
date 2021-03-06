
class ItemPickable extends Interrecipient {
    constructor(item) {
        super();
        this.setId("itemPick");
        
        this.item;
    }
    
    oninteraction(interactor) {
        removeEntity(this.getRecipient());
        
        return this;
    }
    
    getItems() {
        let recipient = this.getRecipient();
        let items = [];
        
        const itemClass = itemClass_forName(recipient.itemClassName);
        
        if(itemClass !== Item) {
            items.push(new itemClass());
        }
        
        if(Array.isArray(recipient.items)) {
            for(let i = 0; i < recipient.items.length; ++i) {
                items.push(recipient.items[i]);
            }
        }
        
        return items;
    }
}
