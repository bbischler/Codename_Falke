import { CricketPlayer } from './cricketPlayer';

export class cricketThrowAction {
    point: number;
    amount: number;
    player: CricketPlayer;
    isDone: Boolean = false;
    totalScoreIncrease: number = 0;
    totalNumberOfPointIncreases = 0;



    constructor(point?: number, amount?: number, player?: CricketPlayer) {
        this.point = point;
        this.amount = amount;
        this.player = player;
    }

    public do(): void {
        if (this.isDone)
            return;
        if (this.point > 0) {
            var point = this.player.getPointsByValue(this.point);

            for (var i = 0; i < this.amount; i++) {
                if (point.isClosed && !point.setIsClosed) {
                    this.player.totalScore += point.getValue();
                    this.totalScoreIncrease += point.getValue();
                    point.increaseHit();
                }
                if (!point.isClosed) {
                    point.increaseHit();
                }
            }
        }
        else {
            this.totalScoreIncrease = 0;
            this.player.missCounter++;
        }
        this.player.increaseThrowCount();
        this.totalNumberOfPointIncreases++;
        this.isDone = true;
    }

    public undo(): void {
        if (!this.isDone)
            return;

        if (this.player.roundThrowCount == 0) {
            this.player.roundThrowCount = 3;
        }
        this.player.totalScore -= this.totalScoreIncrease;
        if (this.point > 0) {
            var point = this.player.getPointsByValue(this.point);
            for (var i = 0; i < this.totalNumberOfPointIncreases; i++) {
                point.decreaseHit();
            }
        } else {
            this.player.missCounter--;
        }
        this.player.decreaseThrowCount();
    }

    public setPlayer(p) {
        let tmpPlayer = new CricketPlayer();
        Object.assign(tmpPlayer, {
            "totalScore": p.totalScore,
            "roundThrowCount": p.roundThrowCount,
            "totalThrowCount": p.totalThrowCount,
            "id": p.id,
            "name": p.name
        });
        this.player = tmpPlayer;
    }
}