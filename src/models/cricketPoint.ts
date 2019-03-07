import { CricketPlayer } from './cricketPlayer';

export class CricketPoint {
    value: number;
    displayText: string;
    hitCount: number;
    isClosed: Boolean;
    player: CricketPlayer;

    constructor(value: number, player: CricketPlayer) {
        this.value = value;
        this.player = player;
        this.hitCount = 0;
        this.isClosed = false;
        this.displayText = (this.value == 25 ? "Bull" : this.value.toString());
    }

    getValue(): number {
        return this.value;
    }
}