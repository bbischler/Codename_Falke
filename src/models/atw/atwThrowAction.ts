import { atwPlayer } from './atwPlayer';

export class atwThrowAction {
    // amount: number;
    player: atwPlayer;
    isDone: Boolean = false;
    // totalScoreIncrease: number = 0;
    // totalNumberOfPointIncreases = 0;
    point: number;


    constructor(point?: number, player?: atwPlayer) {
        this.player = player;
        this.point = point;
    }


    public do(): void {
        if (this.isDone)
            return;
        this.player.increaseThrowCount();
        this.player.scorePoints(this.point)
        this.isDone = true;
    }

    public undo(): void {
        if (!this.isDone)
            return;
        if (this.player.roundThrowCount == 0) {
            this.player.roundThrowCount = 3;
        }
        this.player.decreaseThrowCount();
        this.player.decreasePoint(this.point)

    }

    public setPlayer(p) {
        let tmpPlayer = new atwPlayer();
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