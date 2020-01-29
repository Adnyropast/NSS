
/**
 *
 */

class CameraReplaceActor extends Interactor {
    constructor() {
        super();
        this.setId("cameraReplace");
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        
        let loc = actor.locate(recipient);
        actor.replace(recipient, loc);
        
        // console.log(directionsToWords(getDD(loc)));
        
        /**/
        
        let replaceState = recipient.findState("replace");
        
        if(replaceState === undefined) {
            replaceState = {name : "replace", value : [], countdown : 1};
            
            recipient.addStateObject(replaceState);
        }
        
        let dimension = 0, sign = -1;
        
        while(loc > 0) {
            if(loc & 1) {
                let position = Vector.from(actor.getPositionM()).add(dimension, sign * actor.getSize(dimension)/2);
                
                // interrecipient.replaced.push({"dimension" : dimension, "sign" : sign, "position" : position});
                replaceState.value.push({"dimension" : dimension, "sign" : sign, "position" : position});
                
                // let replaced = interrecipient.replaced.find(function(replaced) {
                    // return replaced.dimension == dimension && replaced.sign == -sign;
                // });
                
                let replaced = replaceState.value.find(function(replaced) {
                    return replaced.dimension == dimension && replaced.sign == -sign;
                });
                
                if(typeof replaced != "undefined") {
                    let proportions = [16, 9, 16];
                    let distance = Math.abs(replaced.position[dimension] - position[dimension]);
                    distance /= proportions[dimension]
                    
                    recipient.setSizeM(Vector.multiplication(proportions, distance));
                }
            }
            
            sign *= -1;
            
            if(sign < 0) {++dimension;}
            
            loc >>= 1;
        }
        
        /**/
        
        return this;
    }
}
