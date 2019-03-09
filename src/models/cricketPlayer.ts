import { Player } from './player';
import { CricketPoint } from './cricketPoint';
import { PointerEvents } from 'ionic-angular/umd/gestures/pointer-events';

export class CricketPlayer extends Player {
    points: CricketPoint[];

    constructor(id: number, name: string) {
        super(id, name);
        this.points = [
            new CricketPoint(20, this),
            new CricketPoint(19, this),
            new CricketPoint(18, this),
            new CricketPoint(17, this),
            new CricketPoint(16, this),
            new CricketPoint(15, this),
            new CricketPoint(25, this)];
    }

    public getPointsByValue(value: number): CricketPoint {
        for (let point of this.points) {
            if (point.value == value)
                return point
        }
    }

    public throwCricket(point: CricketPoint, throwAmount: number): void {
        console.log(this.name + " throws " + point.value + " " + throwAmount + " times");
        
        for(var i = 0; i < throwAmount; i ++){
            if(point.isClosed && !point.setIsClosed){
                this.totalScore += point.getValue();
            }
            point.increaseHit();
        }
    }
    
    public throw(point: number, throwAmount: number): void {
        for (let cpoint of this.points) {
            if (cpoint.value == point) {
                cpoint.hitCount += throwAmount;
                if (cpoint.hitCount > 3 && !cpoint.isClosed) {
                    this.totalScore += (point * throwAmount);
                }
            }
        }
    }
}