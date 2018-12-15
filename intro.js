/******* Add the create scene function ******/
class Intro {

    constructor() {
        this.scene;
        this.video;
        this.createScene(); // create the scene function
    }

    createScene() {

        var scene = new BABYLON.Scene(engine);

        // Setup environment
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, 50), scene);
        var light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -20), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", -1, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);

        // Video plane
        var videoPlane = BABYLON.Mesh.CreatePlane("Screen", 50, scene);
        videoPlane.position.y = 10;
        videoPlane.position.z = 30;

        // Video material
        var videoMat = new BABYLON.StandardMaterial("textVid", scene);
        videoMat.diffuseTexture = new BABYLON.VideoTexture("video", ["assets/videos/s1.mp4", "assets/videos/s2.mp4"], scene, false);
        videoMat.backFaceCulling = false;

        //Applying materials
        videoPlane.material = videoMat;

        let htmlVideo = videoMat.diffuseTexture.video; // reflections

        var playing = false;

        this.video = htmlVideo;

        // scene.onPointerUp = function () {
        //     if (htmlVideo.paused) {
        //         htmlVideo.play();
        //     } else {
        //         htmlVideo.pause();
        //     }
        // }


        this.scene =  scene;
        console.log("created");


    }

    render() {
        this.scene.render();
        this.scene.executeWhenReady(
            () => {
                this.video.play();
            }
        );
    }

    dispose() {
        this.scene.dispose();
    }
}
