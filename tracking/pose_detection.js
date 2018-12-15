var imageScaleFactor = 0.5;
var flipHorizontal = true;
var outputStride = 16;
var maxPoseDetections = 2;
var minPoseConfidence = 0.1;
var minPartConfidence = 0.5;
var nmsRadius = 20.0;

var imageElement = document.getElementById('cat');

const videoWidth = 600;
const videoHeight = 500;

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
    console.log("Load video ...")
    const video = await bindCamera();
    video.play();

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
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();

        poses.forEach(({score, keypoints}) => {
            if (score >= minPoseConfidence) {
                drawKeypoints(keypoints, minPartConfidence, ctx);
                drawSkeleton(keypoints, minPartConfidence, ctx);
            }
        });



        requestAnimationFrame(poseDetection);
    }

    poseDetection();

}
const color = 'aqua';
const lineWidth = 2;
/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    console.log("Draw keypoints ...")
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