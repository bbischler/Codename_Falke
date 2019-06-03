import { X01Player } from './x01Player';

export class x01ThrowAction {
    point: number;
    player: X01Player;
    isDone: Boolean = false;

    constructor(point: number, player: X01Player) {
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

        this.player.decreaseThrowCount();
        this.player.scorePoints(this.point * -1) // Same method, negative number ;)
    }
}