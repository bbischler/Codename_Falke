import { x01ThrowAction } from './x01ThrowAction';
import { Player } from './player';

export class X01Player extends Player {
    roundScore: number = 0;
    avg: number = 0;
    toThrow: string[] = [];
    lastThreeScores: number[] = [];
    legs: number = 0;
    sets: number = 0;
    doubleIn: boolean = true;
    doubleOut: boolean = true;

    constructor(id: number, name: string) {
        super(id, name);
        this.toThrow = ["2", "5", "D12"];
    }

    public throw(points: number): void {


        this.roundThrowCount++;
        this.totalThrowCount++;
        this.roundScore += points;
        this.totalScore -= points;
        this.lastThreeScores.push(points);
        this.avg = Math.floor(this.roundScore / this.totalThrowCount);
    }

    public increaseThrowCount(){
        this.roundThrowCount++;
        this.totalThrowCount++;
    }

    public decreaseThrowCount(){
        this.roundThrowCount--;
        this.totalThrowCount--;
    }

    public scorePoints(points: number){
        this.roundScore += points;
        this.totalScore -= points;

        if(points > 0)
            this.lastThreeScores.push(points);
        else
            this.lastThreeScores.pop();

        this.avg = this.totalThrowCount == 0 ? 0 : Math.floor(this.roundScore / this.totalThrowCount);
    }

    public setTotalScore(totalScore: number) {
        this.totalScore = totalScore;
    }

    public resetForTurn(): void {
        this.roundScore = 0;
        this.roundThrowCount = 0;
        this.lastThreeScores = [];
    }
}