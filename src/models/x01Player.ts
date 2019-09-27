import { x01ThrowAction } from './x01ThrowAction';
import { Player } from './player';
import { DataProvider } from '../providers/data/data';

export class X01Player extends Player {
    roundScore: number = 0;
    avg: number = 0;
    toThrow: string[] = [];
    lastScores: number[] = [];
    legs: number = 0;
    sets: number = 0;
    doubleIn: boolean = true;
    doubleOut: boolean = true;


    constructor(public data?: DataProvider, id?: number, name?: string) {
        super(id, name);
        this.toThrow = [];
    }

    public throw(points: number): void {
        console.log("THROW FUNCTION NEVER USED!!");
        this.roundThrowCount++;
        this.totalThrowCount++;
        this.roundScore += points;
        this.totalScore -= points;
        this.lastScores.push(points);
        this.avg = Math.floor(this.roundScore / this.totalThrowCount);
    }

    setToThrow() {
        let throwLeft = 3 - this.roundThrowCount
        console.log("throwleft: " + throwLeft);
        this.toThrow = [];
        let _toThrow = this.data.getCheckOut(this.totalScore);


        if (_toThrow) {
            var filtered = _toThrow.filter(function (el) {
                return el != null;
            });
            let length = filtered.length;
            console.log("length: " + length);

            if (length != throwLeft) {
                console.log("length != throwleft");
                return;
            }
            if (length < 3)
                filtered.unshift(' ');

            if (length < 2)
                filtered.unshift(' ');

            this.toThrow = filtered;
        }
    }

    public increaseThrowCount() {
        this.roundThrowCount++;
        this.totalThrowCount++;
    }

    public decreaseThrowCount() {
        this.roundThrowCount--;
        this.totalThrowCount--;
    }

    public scorePoints(points: number) {
        this.roundScore += points;
        this.totalScore -= points;
        // if (this.totalScore <= 0)
        //     this.totalScore = 0;


        if (points >= 0)
            this.lastScores.push(points);
        else
            this.lastScores.pop();

        this.avg = this.totalThrowCount == 0 ? 0 : Math.floor(this.roundScore / this.totalThrowCount);


        this.setToThrow();

    }

    public setTotalScore(totalScore: number) {
        this.totalScore = totalScore;
    }

    public resetForTurn(): void {
        this.roundThrowCount = 0;
        this.setToThrow();
    }

    public resetAll() {
        this.roundScore = 0;
        this.avg = 0;
        this.toThrow = [];
        this.lastScores = [];
        this.legs = 0;
        this.sets = 0;
        this.doubleIn = true;
        this.doubleOut = true;
        this.totalScore = 0;
        this.roundThrowCount = 0;
        this.totalThrowCount = 0;
    }
}