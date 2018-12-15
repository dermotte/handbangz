class PoseDetector {

    constructor(samplerate, videoElement, videoWidth, videoHeight) {
        this.samplerate = samplerate;
        this.videoElement = videoElement;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;

        this.imageScaleFactor = 0.5;
        this.flipHorizontal = false;
        this.outputStride = 16;
        this.maxPoseDetections = 2;
        this.minPoseConfidence = 0.1;
        this.minPartConfidence = 0.5;
        this.nmsRadius = 20.0;

        this.playerOne = null;
        this.playerTwo = null;

        this.poseIntervall = null;
        this.intervallCounter = 0;

        this.color = 'aqua';
        this.lineWidth = 2;

    }

    async bindCamera() {
        console.log("Bind camera ...")

        if (this.videoElement)
            console.log("Video Element is not defined ....")

        // Create a camera object.
        const video = this.videoElement;
        video.width = this.videoWidth;
        video.height = this.videoHeight;

        // Get a permission from user to use a camera.
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});

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
        const net = await posenet.load();

        let video;

        try {
            video = await this.loadVideo();
        } catch (e) {
            console.error(e);
            return;
        }

        this.detectPoses(video, net);
    }

    detectPoses(video, net) {
        console.log("Detect poses ...")
        const canvas = document.getElementById('output');
        const ctx = canvas.getContext('2d');

        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;

        async function poseDetection(detector) {
            let poses = [];
            poses = await net.estimateMultiplePoses(
                video, 0.5, detector.flipHorizontal, detector.outputStride,
                detector.maxPoseDetections, detector.minPartConfidence, detector.nmsRadius);

            ctx.clearRect(0, 0, detector.videoWidth, detector.videoHeight);

            ctx.save();
            //ctx.scale(-1, 1);
            //ctx.translate(-detector.videoWidth, 0);
            ctx.drawImage(video, 0, 0, detector.videoWidth, detector.videoHeight);
            ctx.restore();

            //@Todo map player to position

            //There is at least one person
            if(poses.length >= 1){
                if(detector.playerOne == null)
                    detector.playerOne = new Player("player1");
                //console.log("score:" + poses[0].score + "; confidence: " + detector.minPoseConfidence)

                if (poses[0].score >= detector.minPoseConfidence) {

                    detector.recognizePose(poses[0].keypoints, detector.minPartConfidence, detector.playerOne)
                    detector.drawKeypoints(poses[0].keypoints, detector.minPartConfidence, ctx);
                    detector.drawSkeleton(poses[0].keypoints, detector.minPartConfidence, ctx);
                }

            }

        }

        this.poseIntervall = setInterval(async () => {

            if(this.intervallCounter % 2 == 0){
                console.log("Head")
                console.log("")
            }
            this.intervallCounter = this.intervallCounter + 1
            await poseDetection(this)


        }, this.samplerate);

    }

    recognizePose(keypoints, minConfidence, player){

        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                continue;
            }

            if(keypoint.part === "nose") {
                player.nosePositions.push([keypoint.position.x, keypoint.position.y]);

                x.innerHTML = keypoint.position.x.toFixed(4);
                y.innerHTML = keypoint.position.y.toFixed(4);

                if (player.nosePositions.length > 2) {

                    let correct_movement = true;
                    for(let iPos = player.nosePositions.length-2; iPos < player.nosePositions.length; iPos++){
                        let x_cur = Math.round(player.nosePositions[iPos][0] / 10) * 10;
                        let y_cur = Math.round(player.nosePositions[iPos][1] / 10) * 10;

                        let x_prev = Math.round(player.nosePositions[iPos-1][0] / 10) * 10;
                        let y_prev = Math.round(player.nosePositions[iPos-1][1] / 10) * 10;

                        if (player.state === "DOWN") {
                            if (y_cur >= y_prev) {
                                correct_movement = false;
                            }

                        }else if(player.state === "UP"){
                            if (y_cur <= y_prev) {
                                correct_movement = false;
                            }
                        }

                    }
                    if (correct_movement && player.state == "DOWN") {
                        player.state = "UP";
                        console.log("UP");
                        //window.dispatchEvent(event_headup)
                    }else if (correct_movement && player.state == "UP"){
                        player.state = "DOWN";
                        console.log("DOWN");
                        //window.dispatchEvent(event_headdown)
                    }

                    player.nosePositions = [];
                    player.nosePositions.push([keypoint.position.x, keypoint.position.y]);
                }
            }
        }
    }


    /**
     * Draw pose keypoints onto a canvas
     */
    drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
        //console.log("Draw keypoints ...")
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                continue;
            }

            const {y, x} = keypoint.position;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
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

    toTuple({ y, x }) {
        return [y, x];
    }

}