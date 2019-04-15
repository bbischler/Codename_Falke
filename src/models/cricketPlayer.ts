// import { throwCricketAction } from './throwAction';
import { Player } from './player';
import { CricketPoint } from './cricketPoint';
// import { PointerEvents } from 'ionic-angular/umd/gestures/pointer-events';

export class CricketPlayer extends Player {
    points: CricketPoint[];

    constructor(id: number, name: string) {
        super(id, name);
        this.points = [
            new CricketPoint(20),
            new CricketPoint(19),
            new CricketPoint(18),
            new CricketPoint(17),
            new CricketPoint(16),
            new CricketPoint(15),
            new CricketPoint(25)];
    }

    public getPointsByValue(value: number): CricketPoint {
        for (let point of this.points) {
            if (point.value == value)
                return point
        }
    }

    // public throwCricket(point: CricketPoint, throwAmount: number): throwCricketAction {
    //     var action = new throwCricketAction(point, throwAmount, this);
    //     return action;
    // }

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