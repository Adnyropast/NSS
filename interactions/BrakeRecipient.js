
class BrakeRecipient extends Interrecipient {
    constructor(brakeExponent = 1) {
        super();
        this.setId("brake");
        
        this.brakeExponent = brakeExponent;
    }
    
    negotiateBrake(brakeValue) {
        return Math.pow(brakeValue, this.brakeExponent)
    }
}
