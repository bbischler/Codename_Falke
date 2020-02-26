
export class X01Settings {
    legbased: boolean;
    legs: number;
    sets: number;
    doubleIn: Boolean;
    doubleOut: Boolean;
    num: number; 

    constructor(legbased: boolean, legs: number, sets: number, doubleIn: boolean, doubleOut: boolean, num: number) {
        this.legbased = legbased;
        this.legs = legs;
        this.sets = sets;
        this.doubleIn = doubleIn;
        this.doubleOut = doubleOut;
        this.num = num;
    }
}