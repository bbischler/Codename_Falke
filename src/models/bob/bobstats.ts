import { bobPlayer } from './bobPlayer';

export class Bobstats {
    id: number;
    date: Date = new Date();
    players: bobPlayer[] = [];
    constructor(id: number) { this.id = id; }
}

