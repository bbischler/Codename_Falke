import { X01Player } from './x01Player';

export class x01ThrowAction {
    point: number;
    player: X01Player;
    isDone: Boolean = false;

    constructor(point?: number, player?: X01Player) {
        this.point = point;
        this.player = player;
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
        this.player.scorePoints(this.point * -1) // Same method, negative number ;)
    }

    public setPlayer(p) {
        let tmpPlayer = new X01Player();
        Object.assign(tmpPlayer, {
            "roundScore": p.roundScore,
            "avg": p.avg,
            "toThrow": p.toThrow,
            "lastThreeScores": p.lastThreeScores,
            "legs": p.legs,
            "sets": p.sets,
            "doubleIn": p.doubleIn,
            "doubleOut": p.doubleIn,
            "id": p.id,
            "name": p.name
        });
        this.player = tmpPlayer;
    }
}