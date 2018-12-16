class PoseDetector {

    constructor(samplerate, videoElement, videoWidth, videoHeight, audioElement, debug) {
        this.samplerate = samplerate;
        this.videoElement = videoElement;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;
        this.audioElement = audioElement;

        this.imageScaleFactor = 0.5;
        this.flipHorizontal = true;
        this.outputStride = 16;
        this.maxPoseDetections = 2;
        this.minPoseConfidence = 0.1;
        this.minPartConfidence = 0.5;
        this.nmsRadius = 20.0;

        this.video;
        this.net;

        this.playerOne = null;
        this.playerTwo = null;

        this.poseInterval = null;
        this.intervalCounter = 0;

        this.color = 'aqua';
        this.colorLowConfidence = 'red';
        this.lineWidth = 2;

        this.debug = debug;


    }

    async bindCamera() {
        console.log("Bind camera ...")

        if (!this.videoElement) {
            console.log("Video Element is not defined ....")
            return;
        }

        // Create a camera object.
        const video = this.videoElement;
        video.width = this.videoWidth;
        video.height = this.videoHeight;

        // Get a permission from user to use a camera.
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: {frameRate: {ideal: 4, max: 4}}, audio: false});

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }

    async loadVideo() {
        console.log("Load video ...")
        let video = await this.bindCamera();
        video.play();

        return video;
    }

    async loadPoseNet() {
        console.log("Load posenet ...")
        // Load the PoseNet model weights for version 1.01
        this.net = await posenet.load();

        try {
            this.video = await this.loadVideo();
        } catch (e) {
            console.error(e);
            return;
        }

        if (this.debug) {

            this.initGameAndCountPlayer();
            //this.detectPoses();
        }
    }

    initGameAndCountPlayer(){
        console.log("Init game and count player ...")

        const canvas = document.getElementById('output');
        const ctx = canvas.getContext('2d');

        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;

        if (this.poseInterval) {
            clearInterval(this.poseInterval);
        }

        let intervalCnt = 0;

        this.poseInterval = setInterval(async () => {
            this.intervalCounter = this.intervalCounter + 1;
            this.countPlayers(ctx);

            intervalCnt++;
            if(intervalCnt === 20){
                clearInterval(this.poseInterval)

                console.log("detected players: " + this.playerOne)
                console.log("detected players: " + this.playerTwo)
            }


        }, this.samplerate);
    }

    async countPlayers(ctx) {
        console.log("Shake your hands ...")

        let poses = [];
        poses = await this.net.estimateMultiplePoses(
            this.video, 0.5, this.flipHorizontal, this.outputStride,
            this.maxPoseDetections, this.minPartConfidence, this.nmsRadius);


        let playerCnt = 0;
        let nosePosX = 0;
        let nosePosY = 0;
        let displayWidth = this.videoWidth;
        let tmpWindow = displayWidth / 3.0;

        for(let iPos = 0; iPos < poses.length; iPos++){

            let keypointMap = {};
            for (let i = 0; i < poses[iPos].keypoints.length; i++) {
                keypointMap[poses[iPos].keypoints[i].part] = poses[iPos].keypoints[i];
            }

            nosePosX = keypointMap["nose"].position.x;
            nosePosY = keypointMap["nose"].position.y;

            if(nosePosX >= (tmpWindow) && nosePosX <= (tmpWindow * 2.0)){
                console.log("One player in the middle")
                if(this.playerOne === null){
                    this.playerOne = new Player("player1")
                    this.playerOne.addNosePosition(nosePosX)
                }
                continue;

            }else if(nosePosX <= (displayWidth / 2.0)){
                console.log("player left")
                if(this.playerOne === null){
                    this.playerOne = new Player("player1")
                    this.playerOne.addNosePosition(nosePosX)
                }

            }else if(nosePosX >= (displayWidth / 2.0)){
                console.log("player right")
                if(this.playerTwo === null){
                    this.playerTwo = new Player("player2")
                    this.playerTwo.addNosePosition(nosePosX)
                }

            }
        }

        if (this.debug) {
            ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);

            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-this.videoWidth, 0);
            ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
            ctx.restore();
        }

    }

    // is called every 250ms
    async poseDetection(ctx) {

        let timestamp = new Date().getTime() - game.soundMachine.startTimestamp;

        let poses = [];
        poses = await this.net.estimateMultiplePoses(
            this.video, 0.5, this.flipHorizontal, this.outputStride,
            this.maxPoseDetections, this.minPartConfidence, this.nmsRadius);

        if (this.debug) {
            ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);

            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-this.videoWidth, 0);
            ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
            ctx.restore();
        }
        //@Todo map player to position

        //There is at least one person
        if (poses.length >= 1) {
            if (this.playerOne == null)
                this.playerOne = new Player("player1");
            //console.log("score:" + poses[0].score + "; confidence: " + detector.minPoseConfidence)

            if (poses[0].score >= this.minPoseConfidence) {
                if(!this.debug){
                    this.recognizePose(poses[0].keypoints, this.minPartConfidence, this.playerOne, timestamp)
                }else{
                    this.drawKeypoints(poses[0].keypoints, this.minPartConfidence, ctx);
                    this.drawSkeleton(poses[0].keypoints, this.minPartConfidence, ctx);
                    this.testRecognizeMultiplePoses(poses[0].keypoints, this.minPartConfidence, this.playerOne)
                }
            }

        }

    }

    detectPoses() {
        console.log("Detect poses ...")
        const canvas = document.getElementById('output');
        const ctx = canvas.getContext('2d');

        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;

        this.timestamp = 0;
        if (this.poseInterval) {
            clearInterval(this.poseInterval);
        }

        this.poseInterval = setInterval(async () => {
            this.intervalCounter = this.intervalCounter + 1;
            this.poseDetection(ctx);

        }, this.samplerate);

    }

    testRecognizeMultiplePoses(keypoints, minConfidence, player){
        console.log("Muliple pose detection started ...")
    }

    recognizePose(keypoints, minConfidence, player, timestamp) {

//        console.log(timestamp % 250);

        let keypointMap = {};
        for (let i = 0; i < keypoints.length; i++) {
            keypointMap[keypoints[i].part] = keypoints[i];
        }

        let nose = keypointMap["nose"];
        let rightWrist = keypointMap["rightWrist"];
        let leftWrist = keypointMap["leftWrist"];
        let rightShoulder = keypointMap["rightShoulder"];
        let leftShoulder = keypointMap["leftShoulder"];

//        if (nose.score > minConfidence) {
        let currentPoint = [nose.position.x, nose.position.y];
        player.nosePositions.push(currentPoint);

        x.innerHTML = nose.position.x.toFixed(4);
        y.innerHTML = nose.position.y.toFixed(4);

        if (player.nosePositions.length > 2) {

            let y_cur = Math.round(currentPoint[1]);
            let y_1 = Math.round(player.nosePositions[player.nosePositions.length - 2][1]);
            let y_2 = Math.round(player.nosePositions[player.nosePositions.length - 3][1]);

            if (y_cur < y_1 && y_1 < y_2) {
                game.actionDetected(timestamp, "banged DOWN");
            } else if (y_cur > y_1 && y_1 > y_2) {
                game.actionDetected(timestamp, "banged UP");
            } else {
                game.actionDetected(timestamp, "FAIL");
//                        console.log("WTFog");
            }

            player.nosePositions = [];
            player.nosePositions.push([nose.position.x, nose.position.y]);
        }
//        }

        if (rightWrist.position.y < rightShoulder.position.y &&
            leftWrist.position.y < leftShoulder.position.y) {
            console.log("Both Hands up");
        } else if (rightWrist.position.y < rightShoulder.position.y) {
            console.log("Right Hand up")
        } else if (leftWrist.position.y < leftShoulder.position.y) {
            console.log("Left Hand up")
        }


        let shoulderSpan = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
        // lighter
        if (rightWrist.position.y < rightShoulder.position.y && rightWrist.score > minConfidence) {
            let currentPoint = [rightWrist.position.x, rightWrist.position.y];
            player.rightWristPositions.push(currentPoint);

            if (player.rightWristPositions.length > 4) {

                let x_cur = Math.round(currentPoint[0]);
                let x_1 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 2][0]);
                let x_2 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 3][0]);
                let x_3 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 4][0]);
                let x_4 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 5][0]);

                if (Math.abs(x_4 - x_cur) >= shoulderSpan) {
                    if (x_cur < x_1 && x_1 < x_2 && x_2 < x_3 && x_3 < x_4) {
                        console.log("lighted left");
                    } else if (x_cur > x_1 && x_1 > x_2 && x_2 > x_3 && x_3 > x_4) {
                        console.log("lighted right");
                    } else {
//                        console.log("WTFog");
                    }
                }
            }
        }

        if (leftWrist.position.y < leftShoulder.position.y && leftWrist.score > minConfidence) {
            let currentPoint = [leftWrist.position.x, leftWrist.position.y];
            player.leftWristPositions.push(currentPoint);

            if (player.leftWristPositions.length > 4) {

                let x_cur = Math.round(currentPoint[0]);
                let x_1 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 2][0]);
                let x_2 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 3][0]);
                let x_3 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 4][0]);
                let x_4 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 5][0]);

                if (Math.abs(x_4 - x_cur) >= shoulderSpan) {
                    if (x_cur < x_1 && x_1 < x_2 && x_2 < x_3 && x_3 < x_4) {
                        console.log("lighted left");
                    } else if (x_cur > x_1 && x_1 > x_2 && x_2 > x_3 && x_3 > x_4) {
                        console.log("lighted right");
                    } else {
//                        console.log("WTFog");
                    }
                }
            }
        }

    }

//    recognizePose(keypoints, minConfidence, player) {
//
//        for (let i = 0; i < keypoints.length; i++) {
//            const keypoint = keypoints[i];
//
//            if (keypoint.score < minConfidence) {
//                continue;
//            }
//
//            if (keypoint.part === "nose") {
//                player.nosePositions.push([keypoint.position.x, keypoint.position.y]);
//
//                x.innerHTML = keypoint.position.x.toFixed(4);
//                y.innerHTML = keypoint.position.y.toFixed(4);
//
//                if (player.nosePositions.length > 2) {
//
//                    let direction_changed = false;
//                    for (let iPos = player.nosePositions.length - 2; iPos < player.nosePositions.length; iPos++) {
//                        let x_cur = Math.round(player.nosePositions[iPos][0] / 10) * 10;
//                        let y_cur = Math.round(player.nosePositions[iPos][1] / 10) * 10;
//
//                        let x_prev = Math.round(player.nosePositions[iPos - 1][0] / 10) * 10;
//                        let y_prev = Math.round(player.nosePositions[iPos - 1][1] / 10) * 10;
//
//                        if(y_cur === y_prev)
//                            //console.log("Listening ...", y_prev, y_cur);
//                            continue;
//
//                        if (player.state === "DOWN") {
//                            if (y_cur >= y_prev) {
//                                direction_changed = true;
//                                player.state = "UP";
//                                console.log("Changed to UP", y_prev, y_cur);
//                            }
//
//                        } else if (player.state === "UP") {
//                            if (y_cur <= y_prev) {
//                                direction_changed = true;
//                                player.state = "DOWN";
//                                console.log("Changed to DOWN", y_prev, y_cur);
//                            }
//                        }
//                    }
//
////                    if (!direction_changed && player.state == "DOWN") {
////                        player.state = "UP";
////                        console.log("UP");
////                        //window.dispatchEvent(event_headup)
////                    } else if (direction_changed && player.state == "UP") {
////                        player.state = "DOWN";
////                        console.log("DOWN");
////                        //window.dispatchEvent(event_headdown)
////                    }
//
//                    player.nosePositions = [];
//                    player.nosePositions.push([keypoint.position.x, keypoint.position.y]);
//                }
//            }
//        }
//    }

    /**
     * Draw pose keypoints onto a canvas
     */
    drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
        //console.log("Draw keypoints ...")
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                ctx.fillStyle = this.colorLowConfidence;
            } else {
                ctx.fillStyle = this.color;
            }

            const {y, x} = keypoint.position;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);

            ctx.fill();
        }
    }

    /**
     * Draws a pose skeleton by looking up all adjacent keypoints/joints
     */
    drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
            keypoints, minConfidence);

        adjacentKeyPoints.forEach((keypoints) => {
            this.drawSegment(this.toTuple(keypoints[0].position),
                this.toTuple(keypoints[1].position), this.color, scale, ctx);
        });
    }

    /**
     * Draws a line on a canvas, i.e. a joint
     */
    drawSegment([ay, ax], [by, bx], color, scale, ctx) {
        ctx.beginPath();
        ctx.moveTo(ax * scale, ay * scale);
        ctx.lineTo(bx * scale, by * scale);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    toTuple( { y, x }) {
        return [y, x];
    }

    clear() {
        clearInterval(this.poseInterval);
    }

}
