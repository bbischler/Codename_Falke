export abstract class Player {
    id: number;
    name: string;
    totalScore: number = 0;
    roundThrowCount: number = 0;
    totalThrowCount: number = 0;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public abstract throw(points: number) : void;   
}

