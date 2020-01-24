// import { CricketPlayer } from './cricketPlayer';

export class CricketPoint {
    value: number;
    displayText: string;
    hitCount: number;
    isClosed: Boolean; // Has this point reached 3 Hits
    setIsClosed: Boolean; // Are all points of this value closed (reached 3 hits)
    onClosedCallback: (value: number, isClosed: Boolean) => void; // Function to be called when this point changes its closed state

    constructor(value: number,
    ) {
        this.value = value;
        this.hitCount = 0;
        this.isClosed = false;
        this.displayText = (this.value == 25 ? "Bull" : this.value.toString());
    }

    // Register callback function for closing event
    public registerOnClosed(x: (value: number, isClosed: Boolean) => void) {
        this.onClosedCallback = x;
    }

    // Increases hitCount, checks for closing/opening
    public increaseHit(): void {
        this.hitCount += 1;
        // this.hitCount = Math.min(3, this.hitCount + 1);
        this.checkForClosed();
    }

    // Decreases hitCount, checks for closing/opening
    public decreaseHit(): void {
        this.hitCount = Math.max(0, this.hitCount - 1);
        this.checkForClosed();
    }

    // Sets isClosed correctly
    private checkForClosed(): void {
        var previousValue = this.isClosed;
        this.isClosed = (this.hitCount >= 3);
        if (previousValue != this.isClosed) {
            this.onClosedCallback(this.value, this.isClosed);
        }
    }

    getValue(): number {
        return this.value;
    }

    prepareRematch() {
        this.hitCount = 0;
        this.isClosed = false;
        this.setIsClosed = false;
    }
}