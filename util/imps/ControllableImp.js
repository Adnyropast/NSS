
class ControllableImp extends Imp {
    static getGrants() {
        return {
            controllers: new SetArray(),
            
            updateControllers: function updateControllers() {
                for(let i in this.controllers) {
                    this.controllers[i].bind(this)();
                }
                
                return this;
            }
        };
    }
}
