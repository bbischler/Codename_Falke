// import { throwCricketAction } from './throwAction';
import { Player } from '../player';
import { CricketPoint } from './cricketPoint';
// import { PointerEvents } from 'ionic-angular/umd/gestures/pointer-events';

export class CricketPlayer extends Player {
    points: CricketPoint[];
    totalScoresPerGame: number[] = [];
    pointsPerGame: CricketPoint[][] = [];
    avg: number = 0;
    avgPerGame: number[] = [];
    missCounter: number = 0;

    constructor(id?: number, name?: string) {
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

    resetForTurn() {
        this.roundThrowCount = 0;
    }
    public increaseThrowCount() {
        this.roundThrowCount++;
        this.totalThrowCount++;
        let score = this.totalThrowCount - this.missCounter;
        let tmpAvg = score == 0 ? "0" : ((score / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }
    public decreaseThrowCount() {
        this.roundThrowCount--;
        this.totalThrowCount--;
        let score = this.totalThrowCount - this.missCounter;
        let tmpAvg = score == 0 ? "0" : ((score / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }

    setPoints(points) {
        this.points = [];
        for (let p of points) {
            let tmpPoint = new CricketPoint(p.value);
            Object.assign(tmpPoint, {
                "hitCount": p.hitCount,
                "isClosed": p.isClosed,
                "setIsClosed": p.setIsClosed
            });
            this.points.push(tmpPoint);
        }
    }

    prepareRematch() {
        this.setStats();
        this.totalScore = 0;
        this.roundThrowCount = 0;
        this.totalThrowCount = 0;
        this.missCounter = 0;
        this.avg = 0;
        this.fillCricketpoints();
        // this.points.forEach(function (p) {
        //     p.prepareRematch();
        // });
    }

    public setStats() {
        this.pointsPerGame.push(this.points);
        this.totalScoresPerGame.push(this.totalScore);
        this.avgPerGame.push(this.avg);
    }

    fillCricketpoints() {
        this.points = [];
        this.points = [
            new CricketPoint(20),
            new CricketPoint(19),
            new CricketPoint(18),
            new CricketPoint(17),
            new CricketPoint(16),
            new CricketPoint(15),
            new CricketPoint(25)];
    }

}