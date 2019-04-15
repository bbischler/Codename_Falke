import { CricketPlayer } from './cricketPlayer';
// import { CricketPoint } from './cricketPoint';

export class throwCricketAction {
    // point: CricketPoint;
    point: number;

    amount: number;
    player: CricketPlayer;
    isDone: Boolean = false;
    totalScoreIncrease: number = 0;
    totalNumberOfPointIncreases = 0;

    constructor(point: number, amount: number, player: CricketPlayer) {
        this.point = point;
        this.amount = amount;
        this.player = player;
    }

    public do(): void {
        if (this.isDone)
            return;

        console.log("DO: " + this.player.name + " throws " + this.player.getPointsByValue(this.point).value + " " + this.amount + " times");

        for (var i = 0; i < this.amount; i++) {
            if (this.player.getPointsByValue(this.point).isClosed && !this.player.getPointsByValue(this.point).setIsClosed) {
                this.player.totalScore += this.player.getPointsByValue(this.point).getValue();
                this.totalScoreIncrease += this.player.getPointsByValue(this.point).getValue();
            }
            if (!this.player.getPointsByValue(this.point).isClosed) {
                this.player.getPointsByValue(this.point).increaseHit();
                console.log("Hit increase: Counter is: " + this.player.getPointsByValue(this.point).hitCount + " isClosed: " + 
                this.player.getPointsByValue(this.point).isClosed + " setIsClosed: " + this.player.getPointsByValue(this.point).setIsClosed);
                this.totalNumberOfPointIncreases += 1;
            }
        }
        this.isDone = true;
    }

    public undo(): void {
        if (!this.isDone)
            return;

        console.log("UNDO: " + this.player.name + " throws " + this.player.getPointsByValue(this.point).value + 
        " " + this.amount + " times");
        console.log("Decreasing Playerscore");
        this.player.totalScore -= this.totalScoreIncrease;

        for (var i = 0; i < this.totalNumberOfPointIncreases; i++) {
            this.player.getPointsByValue(this.point).decreaseHit();
            console.log("Hit decrease: Counter is: " + this.player.getPointsByValue(this.point).hitCount + 
            " isClosed: " + this.player.getPointsByValue(this.point).isClosed + 
            " setIsClosed: " + this.player.getPointsByValue(this.point).setIsClosed);
        }
    }
}