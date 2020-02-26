import { atwPlayer } from './atwPlayer';

export class Atwstats {
    id: number;
    date: Date = new Date();
    players: atwPlayer[] = [];
    constructor(id: number) { this.id = id; }
}

