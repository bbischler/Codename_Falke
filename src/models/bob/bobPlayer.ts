// import { throwCricketAction } from './throwAction';
import { Player } from '../player';

export class bobPlayer extends Player {
    avg: number = 0;
    pointCounter: number[] = [];
    pointCounterPerGame: number[][] = [];
    avgPerGame: number[] = [];
    counterWonGames: number = 0;
    toThrow: number = 1;
    hitCounter: number = 0;
    totalScoresPerGame: number[] = [];

    constructor(id?: number, name?: string) {
        super(id, name);
        this.totalScore = 27;
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
        if (points == 0) {
            this.pointCounter[this.toThrow - 1]++;
        } else {
            this.totalScore += this.toThrow == 21 ? 50 : this.toThrow * 2;
            this.hitCounter++;
        }

        if (this.roundThrowCount == 3) {
            if (this.pointCounter[this.toThrow - 1] == 3 && points == 0) {
                this.totalScore -= this.toThrow == 21 ? 50 : this.toThrow * 2;
            }

            this.toThrow++;
        }

        let tmpAvg = this.hitCounter == 0 ? "0" : ((this.hitCounter / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }

    public decreasePoint(points: number) {
        if (this.roundThrowCount == 2) {
            this.toThrow--;
            if (this.pointCounter[this.toThrow - 1] == 3 && points == 0) {
                this.totalScore += this.toThrow == 21 ? 50 : this.toThrow * 2;
            }
        }

        if (points == 0) {
            this.pointCounter[this.toThrow - 1]--;
        } else {
            this.hitCounter--;
            this.totalScore -= this.toThrow == 21 ? 50 : this.toThrow * 2;
        }

        let tmpAvg = this.hitCounter == 0 ? "0" : ((this.hitCounter / this.totalThrowCount) * 100).toFixed(1);
        this.avg = parseFloat(tmpAvg);
    }

    public prepareRematch() {
        this.setStats();
        this.totalScore = 27;
        this.totalThrowCount = 0;
        this.roundThrowCount = 0;
        this.avg = 0;
        this.pointCounter = [];
        this.toThrow = 1;
        this.hitCounter = 0;
        this.deletePointCounter();
    }
    public setStats() {
        this.pointCounterPerGame.push(this.pointCounter);
        this.avgPerGame.push(this.avg);
        this.totalScoresPerGame.push(this.totalScore);
    }

    public fillPointsGameOver() {
        for (let i = this.toThrow - 1 ; i <= 21; i++) {
            this.pointCounter[i] = 3;
        }
    }
}