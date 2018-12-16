class Player {

    constructor(name){
        this.name = name;
        this.nosePositions = [];
        this.rightWristPositions = [];
        this.leftWristPositions = [];
//        this.state = "DOWN"
        this.position = [];
        this.avgNosePosition = 0;
    }

    addNosePosition(xCoordinate){
        this.position.push(xCoordinate)

        let sum = 0;
        for(let i = 0; i < this.position.length; i++){
            sum = sum + this.position[i];
        }

        this.avgNosePosition = sum / this.position.length;
        console.log("Avg nose position of player: ", this.name, " : ", this.avgNosePosition)
    }

}

