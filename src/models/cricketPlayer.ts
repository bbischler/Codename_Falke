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
        return this.points.filter(p => p.value == value)[0];
    }

    public throw(point: number, throwAmount: number): void {
        throw new Error("Should never reach method throw on CircketPoint!")
    }
}