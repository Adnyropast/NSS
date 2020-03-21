
/**
 *
 */

class ItemPicker extends Interactor {
    constructor() {
        super();
        this.setId("itemPick");
        
        // this.items = [];
    }
    
    interact(interrecipient) {
        let recipient = interrecipient.getRecipient();
        
        // this.items.push(interrecipient.item);
        // interrecipient.item = null;
        
        let inventory = chapter_getCurrentInventory();
        let items = interrecipient.getItems();
        
        inventory.addItems(items);
        
        return this;
    }
}
