/******* Add the create scene function ******/
class Instructions {

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
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 15, new BABYLON.Vector3(0,0,0), scene);

        camera.attachControl(canvas);

        // Video plane
        var videoPlane = BABYLON.MeshBuilder.CreatePlane("Screen", {width: 16, height: 9}, scene);
        videoPlane.position.y = 0;
        videoPlane.position.z = 0;

        // Video material
        var videoMat = new BABYLON.StandardMaterial("textVid", scene);
        videoMat.diffuseTexture = new BABYLON.VideoTexture("video", ["assets/videos/All the Moves of HeadBangZ.mp4"], scene, false);
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


    }

    render() {
        this.scene.render();
        this.scene.executeWhenReady(
            () => {
                this.video.play();
            }
        );
    }
}
