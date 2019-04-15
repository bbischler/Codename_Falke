import { CricketPlayer } from './cricketPlayer';

export class throwCricketAction {
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

        var point = this.player.getPointsByValue(this.point);

        for (var i = 0; i < this.amount; i++) {
            if (point.isClosed && !point.setIsClosed) {
                this.player.totalScore += point.getValue();
                this.totalScoreIncrease += point.getValue();
            }
            if (!point.isClosed) {
                point.increaseHit();
                this.totalNumberOfPointIncreases += 1;
            }
        }
        this.isDone = true;
    }

    public undo(): void {
        if (!this.isDone)
            return;

        var point = this.player.getPointsByValue(this.point);
        this.player.totalScore -= this.totalScoreIncrease;

        for (var i = 0; i < this.totalNumberOfPointIncreases; i++) {
            point.decreaseHit();
        }
    }
}