var imageScaleFactor = 0.5;
var flipHorizontal = false;
var outputStride = 16;
var maxPoseDetections = 2;
var minPoseConfidence = 0.1;
var minPartConfidence = 0.5;
var nmsRadius = 20.0;

const videoWidth = 600;
const videoHeight = 500;

var playerOne = new Person("Player 1");
var playerTwo = new Person("Player 2");

async function bindCamera() {
    console.log("Bind camera ...")
    // Create a camera object.
    const video = document.getElementById('videostream');
    video.width = videoWidth;
    video.height = videoHeight;

    // Get a permission from user to use a camera.
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    video.srcObject = stream;

    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadVideo() {
    // console.log("Load video ...")
    // const video = await bindCamera();
    // video.play();

    let video = document.getElementById('videostream');
    video.width = videoWidth;
    video.height = videoHeight;
    let source = video.getElementsByTagName('source');

    if(source.length === 0){
        console.log("Load video from camera")
        video = await bindCamera();
        video.play();
    }else{
        console.log("Load video from source")
    }

    return video;
}

async function loadPoseNet() {
    console.log("Load posenet ...")
    // Load the PoseNet model weights for version 1.01
    const net = await posenet.load();

    let video;

    try {
        video = await loadVideo();
    } catch (e) {
        console.error(e);
        return;
    }

    detectPoses(video, net);
}

function detectPoses(video, net) {
    console.log("Detect poses ...")
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    async function poseDetection() {
        let poses = [];
        poses = await net.estimateMultiplePoses(
            video, 0.5, flipHorizontal, outputStride,
            maxPoseDetections, minPartConfidence, nmsRadius);
        //console.log(poses)

        ctx.clearRect(0, 0, videoWidth, videoHeight);

        ctx.save();
        //Enable this, when input is streamed from camera
        //ctx.scale(-1, 1);
        //ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();

        //let text = document.getElementById('text');

        let counter = 0;
        poses.forEach(({score, keypoints}) => {

            //text.innerHTML += "Person " + counter + ":"

            let player = null;
            if (counter == 0) {
                player = playerOne;
                if (score >= minPoseConfidence) {
                    drawKeypoints(keypoints, minPartConfidence, ctx);
                    drawSkeleton(keypoints, minPartConfidence, ctx);
                    recognizePose(keypoints, minPartConfidence, player)
                }

            } else {
                player = playerTwo;
            }
            counter = counter + 1;
        });

        requestAnimationFrame(poseDetection);
    }

    poseDetection();

}

var event_headup = new Event('headup');
var event_headdown = new Event('headdown');

function recognizePose(keypoints, minConfidence, player){
    let type = document.getElementById('type');
    let x = document.getElementById('x');
    let y = document.getElementById('y');

    //let text_leftEye = document.getElementById('text_leftEye');

    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        if(keypoint.part === "nose") {
            player.nosePositions.push([keypoint.position.x, keypoint.position.y]);

            x.innerHTML = keypoint.position.x.toFixed(4);
            y.innerHTML = keypoint.position.y.toFixed(4);

            if (player.nosePositions.length > 3) {

                let correct_movement = true;
                for(let iPos = player.nosePositions.length-3; iPos < player.nosePositions.length; iPos++){
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
                    type.innerHTML = "UP"
                    //console.log("UP");
                    window.dispatchEvent(event_headup)
                }else if (correct_movement && player.state == "UP"){
                    player.state = "DOWN";
                    type.innerHTML = "DOWN"
                    //console.log("DOWN");
                    window.dispatchEvent(event_headdown)
                }
            }
            //text_nose.innerHTML = "Nose: " + keypoint.position.x + ", " + keypoint.position.y
        }
        //
        // if(keypoint.part === "leftEye") {
        //     //text_leftEye.innerHTML = "Left Eye: " + keypoint.position.x + ", " + keypoint.position.y
        // }
    }
}

const color = 'aqua';
const lineWidth = 2;
/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    //console.log("Draw keypoints ...")
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        ctx.beginPath();
        ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(toTuple(keypoints[0].position),
            toTuple(keypoints[1].position), color, scale, ctx);
    });
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function toTuple({ y, x }) {
    return [y, x];
}