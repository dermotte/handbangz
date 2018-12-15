/******* Add the create scene function ******/
class Instructions {

    constructor() {
        this.scene;
        this.video;
        this.particlePath = "assets/images/textures/flare.png";
        this.createScene(); // create the scene function
    }

    createScene() {

        var scene = new BABYLON.Scene(engine);

        // Setup environment
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, 50), scene);
        var light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -20), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 15, new BABYLON.Vector3(0,0,0), scene);

        camera.attachControl(canvas);

        this.createVideo(scene);
        this.createParticles(scene);

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

    createParticles(scene) {

        // Fountain object
        var fountain = BABYLON.MeshBuilder.CreateBox("foutain", {height: 1, width: 1}, scene);
        fountain.position.z = 2;

        this.addFireToFountain(scene, fountain);
        this.addSmokeToFountain(scene, fountain);

        // Ground
        // var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        // ground.position = new BABYLON.Vector3(0, -10, 0);
        // ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        //
        // ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        // ground.material.backFaceCulling = false;
        // ground.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);



        // Fountain's animation
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
    }


    addSmokeToFountain(scene, fountain) {
        //Smoke
        var smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
        smokeSystem.particleTexture = new BABYLON.Texture(this.particlePath, scene);
        smokeSystem.emitter = fountain; // the starting object, the emitter
        smokeSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5); // Starting all from
        smokeSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5); // To...

        smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        smokeSystem.minSize = 0.3;
        smokeSystem.maxSize = 1;

        smokeSystem.minLifeTime = 0.3;
        smokeSystem.maxLifeTime = 1.5;

        smokeSystem.emitRate = 350;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
        smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);

        smokeSystem.minAngularSpeed = 0;
           smokeSystem.maxAngularSpeed = Math.PI;

        smokeSystem.minEmitPower = 0.5;
        smokeSystem.maxEmitPower = 1.5;
        smokeSystem.updateSpeed = 0.005;

        smokeSystem.start();
    }

    addFireToFountain(scene, fountain) {

        // Create a particle system
        var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        //Texture of each particle
        fireSystem.particleTexture = new BABYLON.Texture(this.particlePath, scene);

        // Where the particles come from
        fireSystem.emitter = fountain; // the starting object, the emitter
        fireSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5); // Starting all from
        fireSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5); // To...

        // Colors of all particles
        fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        // Size of each particle (random between...
        fireSystem.minSize = 0.3;
        fireSystem.maxSize = 1;

        // Life time of each particle (random between...
        fireSystem.minLifeTime = 0.2;
        fireSystem.maxLifeTime = 0.7;

        // Emission rate
        fireSystem.emitRate = 600;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        // Direction of each particle after it has been emitted
        fireSystem.direction1 = new BABYLON.Vector3(7, 8, -3);
        fireSystem.direction2 = new BABYLON.Vector3(-7, 8, 3);
        // fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
        // fireSystem.direction2 = new BABYLON.Vector3(0, 7, 0);

        // Angular speed, in radians
        fireSystem.minAngularSpeed = 0;
        fireSystem.maxAngularSpeed = Math.PI;

        // Speed
        fireSystem.minEmitPower = 1;
        fireSystem.maxEmitPower = 3;
        fireSystem.updateSpeed = 0.007;

        // Start the particle system
        fireSystem.start();

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
