class PoseDetectorResults {

    constructor(timestamp, player, gestures, isLighter){
        this.timestamp = timestamp;
        this.player = player;
        this.gestures = gestures;
        this.isLighter = isLighter;
    }

    isPlayerOne() {
        if (this.player === "player1") {
            return true;
        }
    }

}