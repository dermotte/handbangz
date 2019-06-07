class PoseDetector {

    constructor(samplerate, videoElement, videoWidth, videoHeight) {

        this.samplerate = samplerate;
        this.videoElement = videoElement;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;

        this.flipHorizontal = false;
        this.outputStride = 16;
        this.maxPoseDetections = 2;
        this.minPoseConfidence = 0.2;
        this.minPartConfidence = 0.5;
        this.nmsRadius = 20.0;
        this.lighterThreshold = 20;

        // controls the required amount of head motion for a bang 
        // (lower value -> more motion required)
        // TODO find good value
        this.bangSensitivity = 50;

        this.fps = 25;
        this.video;
        this.net;

        this.players = {
            player1: new Player("player1"),
            player2: new Player("player2")
        }

        this.debug = false;

        this.loadPoseNet().then(() => {
            // the first pose estimation call takes significantly longer than subsequent ones,
            //  (about 900ms vs. 150ms)
            // so do it once before the actual game starts
            this.estimatePoses().then((poses) => {
                console.log("PoseDetector is ready!");
            });
        });

    }

// ##################
// # INITIALIZATION #
// ##################

    async loadPoseNet() {
        console.log("Load posenet ...")
        // Load the PoseNet model weights for version 1.01
        this.net = await posenet.load();

        try {
            this.video = await this.loadVideo();
        } catch (e) {
            console.error(e);
            return e;
        }

    }

    async loadVideo() {
        console.log("Load video ...")
        let video = await this.bindCamera();
        video.play();

        return video;
    }

    async bindCamera() {
        console.log("Bind camera ...")

        if (!this.videoElement) {
            console.error("Video Element is not defined ....")
            return;
        }

        // Create a camera object.
        const video = this.videoElement;
        video.width = this.videoWidth;
        video.height = this.videoHeight;

        // Get a permission from user to use a camera.
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: {frameRate: {ideal: this.fps, max: this.fps}}, audio: false});

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }

// ##################
// # POSE DETECTION #
// ##################

    // starts the pose detection loop
    async start() {
        console.log("starting pose detection");
        this.stopFlag = false;
        while (!this.stopFlag) {
            await this.performPoseDetection();
            let waittime = this.samplerate - game.soundMachine.getCurrentTime() % 250;
            await this.sleep(waittime);
        }
    }

    stop() {
        this.stopFlag = true;
    }

    clear() {
        this.stop();
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async performPoseDetection() {
        let timestamp = game.soundMachine.getCurrentTime();
        if (this.debug) {
            console.log("pose detection " + timestamp);
        }
        let poses = await this.estimatePoses();
        var playerPoses = this.mapPosesToPlayers(poses);
        for (let player in playerPoses) {
            this.recognizeActions(player, playerPoses[player], timestamp);
        }
    }

    // returns (asynchronously) an array of Pose objects in the following form:
    // {keypoints, score], where keypoints contains an associative array of 17 parts in the form:
    // part -> {part, position, score}
    //  (note: this format is converted from the original posenet format for easier use)
    async estimatePoses() {
        let ts = new Date().getTime();
        let poses = await this.net.estimateMultiplePoses(
                this.video, 0.5, this.flipHorizontal, this.outputStride,
                this.maxPoseDetections, this.minPartConfidence, this.nmsRadius);
        if (this.debug) {
            let ts2 = new Date().getTime();
            console.log("time for pose detection: " + (ts2 - ts) + "ms");
        }
        for (let i = 0; i < poses.length; i++) {
            let keypoints = poses[i].keypoints;
            let keypointMap = {};
            for (let i = 0; i < keypoints.length; i++) {
                keypointMap[keypoints[i].part] = keypoints[i];
            }
            poses[i].keypoints = keypointMap;
        }
        return poses;
    }

    mapPosesToPlayers(poses) {
        // only consider poses with a certain confidence
        poses = poses.filter((pose) => pose.score > this.minPoseConfidence);

        if (poses.length === 0) {
            console.error("no pose detected...");
            return {};
        } else if (poses.length === 1) {  // single player
            return {player1: poses[0]};
        } else {
            // sort poses by confidence and consider the two "best"
            poses = poses.sort((a, b) => b.score - a.score);
            if (poses[0].keypoints.nose.position.x < poses[1].keypoints.nose.position.x) {
                return {
                    player1: poses[1],
                    player2: poses[0]
                }
            } else {
                return {
                    player1: poses[0],
                    player2: poses[1]
                }
            }
        }
    }

    // determines the action(s) of a given pose for one player
    recognizeActions(playerName, pose, timestamp) {

        let player = this.players[playerName];
        let actions = [];

        // quantize nose position to n steps
        let noseY = Math.round(pose.keypoints.nose.position.y / this.videoHeight * this.bangSensitivity);
        player.nosePositions.push({ts: timestamp, pos: noseY});

        // TODO why does it work with negation?? should be the other way round...!!!
        if (!game.soundMachine.isOnBeat(timestamp)) {
            if (player.nosePositions.length > 2) {
                let y_1 = player.nosePositions[player.nosePositions.length - 2].pos;
                let y_2 = player.nosePositions[player.nosePositions.length - 3].pos;

                if (noseY > y_1 && y_1 > y_2) { // moving down
                    if (!player.prevHeadDirection || player.prevHeadDirection === "up") {
                        actions.push("bang");
                    }
                    player.prevHeadDirection = "down";
                } else if (noseY < y_1 && y_1 < y_2) { // moving up
                    if (!player.prevHeadDirection || player.prevHeadDirection === "down") {
                        actions.push("bang");
                    }
                    player.prevHeadDirection = "up";
                }
            }

            // detect horns
            let rightWrist = pose.keypoints.rightWrist.position;
            let leftWrist = pose.keypoints.leftWrist.position;
            let rightShoulder = pose.keypoints.rightShoulder.position;
            let leftShoulder = pose.keypoints.leftShoulder.position;

            if (rightWrist.y < rightShoulder.y && leftWrist.y < leftShoulder.y) {
                actions.push("dHorn");
            } else if (rightWrist.y < rightShoulder.y || leftWrist.y < leftShoulder.y) {
                actions.push("horn");
            }

           // ##### detect lighter #####
            player.rightWristPositions.push(rightWrist);
            player.leftWristPositions.push(leftWrist);
            let isLighter = false;

            // Reset lighter detection if hand is below shoulder
            if (rightWrist.y >= rightShoulder.y) { // Hand is below shoulder
                player.rightWristPositions = []
            }
            if (leftWrist.y >= leftShoulder.y) { // Hand is below shoulder
                player.leftWristPositions = []
            }

            if (rightWrist.y < rightShoulder.y) { // Right hand is up
                
                isLighter = this.checkLighter(player.rightWristPositions);

            } else if (leftWrist.y < leftShoulder.y) { // Right hand is up

                isLighter = this.checkLighter(player.leftWristPositions);

            }

            let result = new PoseDetectorResults(timestamp, playerName, actions, isLighter);
            game.actionDetected(result);
        }
    }

    checkLighter(wristPositions) {
        let isLighter = false;
        // The player should not be penalized when he starts the lighter
        if (wristPositions.length < 3) {
            isLighter = true;
        }

        if (wristPositions.length >= 3) {

            // At least three of the last 5 positions must be strictly monotonically increasing or decreasing
            // 3 of 5 is, because the player sometimes needs to change the direction
            var wristXVector = [];
            wristXVector.push(wristPositions[wristPositions.length - 1].x);
            wristXVector.push(wristPositions[wristPositions.length - 2].x);
            wristXVector.push(wristPositions[wristPositions.length - 3].x);
            if (wristPositions.length >= 4) {
                wristXVector.push(wristPositions[wristPositions.length - 4].x);
            }
            if (wristPositions.length >= 5) {
                wristXVector.push(wristPositions[wristPositions.length - 5].x);
            }

            for (var i = 2; i < wristXVector.length; i++) {
                if (wristXVector[i - 2] < wristXVector[i - 1] && Math.abs(wristXVector[i - 2] - wristXVector[i - 1]) > this.lighterThreshold &&
                    wristXVector[i - 1] < wristXVector[i] && Math.abs(wristXVector[i - 1] - wristXVector[i]) > this.lighterThreshold ||
                    wristXVector[i - 2] > wristXVector[i - 1] && Math.abs(wristXVector[i - 2] - wristXVector[i - 1]) > this.lighterThreshold &&
                    wristXVector[i - 1] > wristXVector[i] && Math.abs(wristXVector[i - 1] - wristXVector[i]) > this.lighterThreshold) {
                    isLighter = true;
                    break;
                }
            }
        }

        return isLighter;
    }

}