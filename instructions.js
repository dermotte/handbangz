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

        // // Fountain object
        // var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
        //
        // // Ground
        // var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        // ground.position = new BABYLON.Vector3(0, -10, 0);
        // ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        //
        // ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        // ground.material.backFaceCulling = false;
        // ground.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);
        //
        // // Create a particle system
        // var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        //
        // //Texture of each particle
        // particleSystem.particleTexture = new BABYLON.Texture("assets/images/textures/flare.png", scene);
        //
        // // Where the particles come from
        // particleSystem.emitter = fountain; // the starting object, the emitter
        // particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        // particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
        //
        // // Colors of all particles
        // particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        // particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        // particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        //
        // // Size of each particle (random between...
        // particleSystem.minSize = 0.1;
        // particleSystem.maxSize = 0.5;
        //
        // // Life time of each particle (random between...
        // particleSystem.minLifeTime = 0.3;
        // particleSystem.maxLifeTime = 1.5;
        //
        // // Emission rate
        // particleSystem.emitRate = 1500;
        //
        // // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        //
        // // Set the gravity of all particles
        // particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        //
        // // Direction of each particle after it has been emitted
        // particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        // particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
        //
        // // Angular speed, in radians
        // particleSystem.minAngularSpeed = 0;
        // particleSystem.maxAngularSpeed = Math.PI;
        //
        // // Speed
        // particleSystem.minEmitPower = 1;
        // particleSystem.maxEmitPower = 3;
        // particleSystem.updateSpeed = 0.005;
        //
        // // Start the particle system
        // particleSystem.start();
        //
        // // Fountain's animation
        // var keys = [];
        // var animation = new BABYLON.Animation("animation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        //                                                                 BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // // At the animation key 0, the value of scaling is "1"
        // keys.push({
        //     frame: 0,
        //     value: 0
        // });
        //
        // // At the animation key 50, the value of scaling is "0.2"
        // keys.push({
        //     frame: 50,
        //     value: Math.PI
        // });
        //
        // // At the animation key 100, the value of scaling is "1"
        // keys.push({
        //     frame: 100,
        //     value: 0
        // });
        //
        // // Launch animation
        // animation.setKeys(keys);
        // fountain.animations.push(animation);
        // scene.beginAnimation(fountain, 0, 100, true);


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

    dispose() {
        this.scene.dispose();
    }
}
