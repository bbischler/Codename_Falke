import { CricketPlayer } from './cricketPlayer';

export class Cricketstats {
    id: number;
    date: Date = new Date();
    players: CricketPlayer[] = [];
    constructor(id: number) { this.id = id; }
}

