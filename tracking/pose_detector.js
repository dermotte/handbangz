class PoseDetector {

    constructor(samplerate, videoElement, videoWidth, videoHeight, audioElement, debug) {
//        this.samplerate = samplerate;
//        this.videoElement = videoElement;
//        this.videoWidth = videoWidth;
//        this.videoHeight = videoHeight;
//        this.audioElement = audioElement;
//
//        this.imageScaleFactor = 0.5;
//        this.flipHorizontal = false;
//        this.outputStride = 16;
//        this.maxPoseDetections = 2;
//        this.minPoseConfidence = 0.1;
//        this.minPartConfidence = 0.5;
//        this.nmsRadius = 20.0;
//
//        this.fps = 25;
//        this.video;
//        this.net;


    }


    detectPoses() {
          // is called every 250ms
        async function poseDetection(detector) {          
     
            let timestamp = new Date().getTime() - game.soundMachine.startTimestamp;
            console.log("pose detect", timestamp);
            
            let poses = [];
            poses = await detector.net.estimateMultiplePoses(
                    detector.video, 0.5, detector.flipHorizontal, detector.outputStride,
                    detector.maxPoseDetections, detector.minPartConfidence, detector.nmsRadius);

            //There is at least one person
            if (poses.length >= 1) {
                if (detector.playerOne == null)
                    detector.playerOne = new Player("player1");
                //console.log("score:" + poses[0].score + "; confidence: " + detector.minPoseConfidence)

                if (poses[0].score >= detector.minPoseConfidence) {
                    if(!detector.debug){
                        detector.recognizePose(poses[0].keypoints, detector.minPartConfidence, detector.playerOne, timestamp)
//                    }else{
                        detector.drawKeypoints(poses[0].keypoints, detector.minPartConfidence, ctx);
                        detector.drawSkeleton(poses[0].keypoints, detector.minPartConfidence, ctx);
//                        detector.testRecognizeMultiplePoses(poses[0].keypoints, detector.minPartConfidence, detector.playerOne)
                    }
                } else {
                    console.error("too low confidence");
                }

            } else {
                console.error("no pose found. where are u?");
            }
        }

//        this.poseInterval = setInterval(async () => {

//
//            console.log("POSE");

//            let ts = new Date().getTime();
//            let time = ts - this.timestamp;
//            this.timestamp = ts;
//            console.log(time);

//            this.audioElement.play();
//            if (this.intervalCounter % 2 == 0) {
//                console.log("Head");
//            document.getElementById("arrow")
//fas fa-arrow-down
//            } else {
//                console.log("NOT Head")
//            }
//            this.intervalCounter = this.intervalCounter + 1;
//            poseDetection(this);

//        }, this.samplerate);

    }

    testRecognizeMultiplePoses(keypoints, minConfidence, player){

        let keypointMap = {};
        for (let i = 0; i < keypoints.length; i++) {
            keypointMap[keypoints[i].part] = keypoints[i];
        }

        let nose = keypointMap["nose"];
        let rightWrist = keypointMap["rightWrist"];
        let leftWrist = keypointMap["leftWrist"];
        let rightShoulder = keypointMap["rightShoulder"];
        let leftShoulder = keypointMap["leftShoulder"];

        if (nose.score > minConfidence) {
            let currentPoint = [nose.position.x, nose.position.y];
            player.nosePositions.push(currentPoint);

            x.innerHTML = nose.position.x.toFixed(4);
            y.innerHTML = nose.position.y.toFixed(4);

            if (player.nosePositions.length > 2) {

                let y_cur = Math.round(currentPoint[1]);
                let y_1 = Math.round(player.nosePositions[player.nosePositions.length - 2][1]);
                let y_2 = Math.round(player.nosePositions[player.nosePositions.length - 3][1]);

                if (y_cur < y_1 && y_1 < y_2) {
                    console.log("banged DOWN");
                } else if (y_cur > y_1 && y_1 > y_2) {
                    console.log("banged UP");
                } else {
                    console.log("FAIL");
//                        console.log("WTFog");
                }

                player.nosePositions = [];
                player.nosePositions.push([nose.position.x, nose.position.y]);
            }
        }

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

    recognizePose(keypoints, minConfidence, player, timestamp) {

//        console.log(timestamp, game.soundMachine.isOnBeat(timestamp));

        
        let actions = [];

        let nose = keypointMap["nose"];
        let rightWrist = keypointMap["rightWrist"];
        let leftWrist = keypointMap["leftWrist"];
        let rightShoulder = keypointMap["rightShoulder"];
        let leftShoulder = keypointMap["leftShoulder"];


//        if (nose.score > minConfidence) {
            let currentPoint = [nose.position.x, Math.round(nose.position.y / 5) * 5];
            player.nosePositions.push(currentPoint);

            console.log("recognize pose", timestamp, currentPoint[1], game.soundMachine.isOnBeat(timestamp), player.nosePositions.length);

            if (player.nosePositions.length > 2 && game.soundMachine.isOnBeat(timestamp)) {
                
                

                let y_cur = currentPoint[1];
                let y_1 = Math.round(player.nosePositions[player.nosePositions.length - 2][1]);
                let y_2 = Math.round(player.nosePositions[player.nosePositions.length - 3][1]);

                if (y_cur < y_1 && y_1 < y_2) {
                    actions.push("bang");
                    console.log(y_cur, y_1, y_2);
                } else if (y_cur > y_1 && y_1 > y_2) {
                    actions.push("bang");
                    console.log(y_cur, y_1, y_2);
                } else {
//                    game.actionDetected(timestamp, "fail");
//                        console.log("WTFog");
                    console.error(y_cur, y_1, y_2);
                }
               

                player.nosePositions = [];
                player.nosePositions.push([nose.position.x, currentPoint[1]]);
            }
//        }

//        if (game.soundMachine.isOnBar(timestamp)) {
//        if (game.soundMachine.isOnBeat(timestamp)) {
//            if (rightWrist.position.y < rightShoulder.position.y &&
//                    leftWrist.position.y < leftShoulder.position.y) {
//                actions.push("dHorn");
//            } else if (rightWrist.position.y < rightShoulder.position.y) {
//                actions.push("horn");
//            } else if (leftWrist.position.y < leftShoulder.position.y) {
//                actions.push("horn");
//            }
//        }
//

//        let shoulderSpan = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
//         //lighter
//        if (rightWrist.position.y < rightShoulder.position.y && rightWrist.score > minConfidence) {
//            let currentPoint = [rightWrist.position.x, rightWrist.position.y];
//            player.rightWristPositions.push(currentPoint);
//
//            if (player.rightWristPositions.length > 4) {
//
//                let x_cur = Math.round(currentPoint[0]);
//                let x_1 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 2][0]);
//                let x_2 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 3][0]);
//                let x_3 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 4][0]);
//                let x_4 = Math.round(player.rightWristPositions[player.rightWristPositions.length - 5][0]);
//
//                if (Math.abs(x_4 - x_cur) >= shoulderSpan) {
//                    if (x_cur < x_1 && x_1 < x_2 && x_2 < x_3 && x_3 < x_4) {
//                        actions.push("light");
//                    } else if (x_cur > x_1 && x_1 > x_2 && x_2 > x_3 && x_3 > x_4) {
//                        actions.push("light");
//                    } else {
////                        console.log("WTFog");
//                    }
//                }
//            }
//        }

//        if (leftWrist.position.y < leftShoulder.position.y && leftWrist.score > minConfidence) {
//            let currentPoint = [leftWrist.position.x, leftWrist.position.y];
//            player.leftWristPositions.push(currentPoint);
//
//            if (player.leftWristPositions.length > 4) {
//
//                let x_cur = Math.round(currentPoint[0]);
//                let x_1 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 2][0]);
//                let x_2 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 3][0]);
//                let x_3 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 4][0]);
//                let x_4 = Math.round(player.leftWristPositions[player.leftWristPositions.length - 5][0]);
//
//                if (Math.abs(x_4 - x_cur) >= shoulderSpan) {
//                    if (x_cur < x_1 && x_1 < x_2 && x_2 < x_3 && x_3 < x_4) {
//                        actions.push("light");
//                    } else if (x_cur > x_1 && x_1 > x_2 && x_2 > x_3 && x_3 > x_4) {
//                        actions.push("light");
//                    } else {
////                        console.log("WTFog");
//                    }
//                }
//            }
//        }
        if (game.soundMachine.isOnBeat(timestamp)) {
            game.actionDetected(timestamp, actions);
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

}