import { Player } from './player';
import { CricketPoint } from './cricketPoint';

export class CricketPlayer extends Player {
    points: CricketPoint[];

    constructor(id: number, name: string) {
        super(id, name);
        this.points = [
            new CricketPoint(20, this),
            new CricketPoint(19, this),
            new CricketPoint(18, this),
            new CricketPoint(17, this),
            new CricketPoint(16, this),
            new CricketPoint(15, this),
            new CricketPoint(25, this)];
    }

    public throw(points: number) : void{
        this.totalScore += points;
    }
}