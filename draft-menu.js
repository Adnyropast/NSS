
class DirectionalMenu {
    constructor() {
        this.buttons = [];
        this.focus = null;
    }
    
    closestButtonTo(position) {
        let minDistance = Infinity;
        let closest = null;
        
        for(let i = 0; i < this.buttons.length; ++i) {
            let button = this.buttons[i];
            
            let distance = 0;
            let minDim = Math.min(position.length, button.length);
            
            for(let dim = 0; dim < minDim; ++dim) {
                distance += Math.pow(button[dim] - position[dim], 2);
            }
            
            distance = Math.sqrt(distance);
            
            if(distance < minDistance) {
                closest = button;
                minDistance = distance;
            }
        }
        
        return closest;
    }
    
    setPosition(position) {
        this.focus = this.closestButtonTo(position);
        
        return this;
    }
    
    move(vector, approx = Math.PI / 4) {
        const x = vector[0], y = vector[1];
        
        let center = this.focus;
        
        let angle = Math.atan2(y, x);
        let closeAngles = [];
        
        for(let i = 0; i < this.buttons.length; ++i) {
            let button = this.buttons[i];
            
            if(button != center) {
                let a = Math.atan2(button[1] - center[1], button[0] - center[0]);
                
                if(Math.abs(a - angle) % (2*Math.PI) <= approx) {
                    closeAngles.push(button);
                }
            }
        }
        
        if(closeAngles.length > 0) {
            closeAngles.sort(function(a, b) {
                let distA = 0;
                let distB = 0;
                
                const minDimA = Math.min(center.length, a.length);
                const minDimB = Math.min(center.length, b.length);
                
                for(let dim = 0; dim < minDimA; ++dim) {
                    distA += Math.pow(a[dim] - center[dim], 2);
                }
                
                for(let dim = 0; dim < minDimA; ++dim) {
                    distB += Math.pow(b[dim] - center[dim], 2);
                }
                
                distA = Math.sqrt(distA);
                distB = Math.sqrt(distB);
                
                return distA - distB;
            });
            
            this.focus = closeAngles[0];
        }
        
        return this;
    }
    
    addButton(position) {
        let button = position;
        
        this.buttons.push(button);
        
        if(this.focus == null) {
            this.focus = button;
        }
        
        return this;
    }
}

let directionalMenu = new DirectionalMenu();
directionalMenu.addButton([0, 0]);
directionalMenu.addButton([16, 0]);
directionalMenu.addButton([-16, 0]);
directionalMenu.addButton([-16*Math.sqrt(2)/2, -16*Math.sqrt(2)/2]);
directionalMenu.addButton([-16*Math.sqrt(2)/2, +16*Math.sqrt(2)/2]);

class MenuButton extends Array {
    constructor() {
        super();
        
        this.text = "";
        this.color = "black";
        
    }
}
