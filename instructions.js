/******* Add the create scene function ******/
class Instructions {

    constructor() {
        this.scene;
        this.video;
    }

    createScene() {

        var scene = new BABYLON.Scene(engine);

        // Setup environment
        var light = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(-10, -10, -10), scene);
        //var light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -20), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 15, new BABYLON.Vector3(0,0,0), scene);

        camera.attachControl(canvas);

        this.createVideo(scene);

        let fireworkHelper = new FireworkHelper();
        fireworkHelper.createParticles(scene, {x: 0, y: 0, z: 2}, true);
        fireworkHelper.createParticles(scene, {x: 5, y: 0, z: 2}, true);
        fireworkHelper.createParticles(scene, {x: -5, y: 0, z: 2}, true);

        this.scene = scene;

        this.scene.executeOnceBeforeRender(
            () => {
                this.video.play();
            }
        );

    }

    createVideo(scene) {
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
    }


    isReady() {
        return (this.scene && this.scene.isReady());
    }

    onLoad() {
        this.video.currentTime = 0;
    }

    render() {
        this.scene.render();
    }

    dispose() {
        this.scene.dispose();
    }
}
