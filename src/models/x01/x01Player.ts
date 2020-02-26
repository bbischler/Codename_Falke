import { x01ThrowAction } from './x01ThrowAction';
import { Player } from '../player';
import { DataProvider } from '../../providers/data/data';

export class X01Player extends Player {

    roundScore: number = 0;
    avg: number = 0;
    toThrow: string[] = [];
    lastScores: number[] = [];
    legs: number = 0;
    sets: number = 0;
    doubleIn: boolean = true;
    doubleOut: boolean = true;
    totalPointsPerLeg: number[] = [];
    avgPerLeg: number[] = [];
    totalThrowsPerLeg: number[] = [];
    firstNinePerLeg: number[][] = [];
    totalScoreForAllGames: number = 0

    constructor(public data?: DataProvider, id?: number, name?: string) {
        super(id, name);
        this.toThrow = [];
        this.totalPointsPerLeg = [];
        this.totalThrowsPerLeg = [];
    }

    public throw(points: number): void {
        console.log("THROW FUNCTION NEVER USED!!");
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

            if (length > throwLeft) {
                console.log("length != throwleft");
                return;
            }

            if (throwLeft == 3) {
                if (length <= 2)
                    filtered.push(' ');
                if (length < 2)
                    filtered.push(' ');
            }

            if (throwLeft == 2) {
                if (length == 2)
                    filtered.unshift(' ');

                if (length == 1) {
                    filtered.unshift(' ');
                    filtered.push(' ');
                }
            }
            if (throwLeft == 1) {
                filtered.unshift(' ');
                filtered.unshift(' ');
            }
            this.toThrow = filtered;
        } else {
            this.toThrow = [' ', ' ', ' '];
        }
    }


    public increaseLegs() {
        this.legs++;
    }
    public increaseSet() {
        this.sets++;
    }
    public checkLegs(_legs) {
        if (this.legs == _legs) {
            this.legs = 0;
            return true;
        }
        else
            return false;
    }

    public checkSets(_sets) {
        if (this.sets == _sets)
            return true;
        else
            return false;
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
        this.lastScores.push(points);
        this.avg = this.totalThrowCount == 0 ? 0 : Math.floor(this.roundScore / this.totalThrowCount);
        this.setToThrow();
    }

    public decreasePoint(points: number) {
        this.roundScore -= points;
        this.totalScore += points;
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
        this.totalPointsPerLeg = [];
        this.totalThrowsPerLeg = [];
        this.firstNinePerLeg = [];
        this.avgPerLeg = [];
        this.totalScoreForAllGames = 0;
    }

    public prepareRematch(num: number) {
        this.setstats();
        this.roundScore = 0;//
        this.avg = 0;//
        this.toThrow = [];
        this.lastScores = [];
        this.doubleIn = true;
        this.doubleOut = true;
        this.totalScore = num;
        this.roundThrowCount = 0;
        this.totalThrowCount = 0;//
    }
    public setstats() {
        this.totalPointsPerLeg.push(this.roundScore);
        this.totalThrowsPerLeg.push(this.totalThrowCount);
        this.avgPerLeg.push(this.avg);
        this.firstNinePerLeg.push(this.lastScores);
        this.totalScoreForAllGames += this.roundScore;
    }
}