// import { throwCricketAction } from './throwAction';
import { Player } from '../player';
import { CricketPoint } from '../cricket/cricketPoint';
// import { PointerEvents } from 'ionic-angular/umd/gestures/pointer-events';

export class atwPlayer extends Player {
    avg: number = 0;
    pointCounter: number[] = [];
    pointCounterPerGame: number[][] = [];
    avgPerGame: number[] = [];
    counterWonGames: number = 0;
    constructor(id?: number, name?: string) {
        super(id, name);
        this.totalScore = 1;
        this.deletePointCounter();
    }

    throw() { }

    public resetForTurn(): void {
        this.roundThrowCount = 0;
    }


    public increaseThrowCount() {
        this.roundThrowCount++;
        this.totalThrowCount++;
    }

    public deletePointCounter() {
        for (let i = 0; i < 21; i++) {
            this.pointCounter[i] = 0;
        }
    }

    public decreaseThrowCount() {
        this.roundThrowCount--;
        this.totalThrowCount--;
    }

    public scorePoints(points: number) {
        this.pointCounter[this.totalScore - 1]++;
        this.totalScore += points;
        let score = this.totalScore - 1;
        let tmpAvg = score == 0 ? "0" : ((score / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }

    public decreasePoint(points: number) {
        this.pointCounter[this.totalScore - (1 + points)]--;
        this.totalScore -= points;
        let score = this.totalScore - 1;
        let tmpAvg = score == 0 ? "0" : ((score / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }

    public prepareRematch() {
        this.setStats();
        this.totalScore = 1;
        this.roundThrowCount = 0;
        this.avg = 0;
        this.totalThrowCount = 0;
        this.pointCounter = [];
        this.deletePointCounter();
    }
    public setStats() {
        this.pointCounterPerGame.push(this.pointCounter);
        this.avgPerGame.push(this.avg);
    }
}