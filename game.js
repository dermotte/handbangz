class Game {
    constructor() {
        this.scene;

        // stage objects
        this.floor;
        this.stagebox;
        this.wall;
        this.drumpodest;
        this.speakerRight;
        this.speakerLeft;
        this.centerMonitor;
        this.leftMonitor;
        this.rightMonitor;

        // lights
        this.ambientLight;
        this.drumSpotlight;
        this.leftSpotlight;
        this.rightSpotlight;

        // flashlights
        this.flash1;
        this.flash2;
        this.flash3;
        this.flash4;

        // Fireworks
        this.leftFirework;
        this.rightFirework;

        // Actors
        this.leftActor;
        this.rightActor;

        this.scene;
        this.actionMap = new ActionMap(this);
        this.gamepad = new Gamepad(this);
    }

    createScene () {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 3 * Math.PI / 8, 10, new BABYLON.Vector3(0,5,7), scene);
        // comment the scene to fix the camera
        camera.attachControl(canvas, true);

        // Build stage ----------------------------------------------------------------------------------

        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.maxSimultaneousLights = 8;
        // Floor
        this.floor = BABYLON.MeshBuilder.CreateBox("floor", {height: 0.1, width: 100, depth: 100}, scene);
        this.floor.position.x = 0;
        this.floor.position.z = 0;
        this.floor.material = material;
        //var plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene); // default plane
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {}, scene); //default ground

        // Stage
        this.stagebox = BABYLON.MeshBuilder.CreateBox("stagebox", {height: 1, width: 20, depth: 7}, scene);
        this.stagebox.position.x = 0;
        this.stagebox.position.z = 3.5;
        this.stagebox.position.y = 0.5;
        this.stagebox.material = material;
        this.wall = BABYLON.MeshBuilder.CreateBox("wall", {height: 10, width: 20, depth: 0.1}, scene);
        this.wall.position.x = 0;
        this.wall.position.z = 0;
        this.wall.position.y = 5;
        this.wall.material = material;

        this.drumpodest = BABYLON.MeshBuilder.CreateBox("drumpodest", {height: 0.5, width: 3, depth: 2}, scene);
        this.drumpodest.position.y = 1.25;
        this.drumpodest.position.x = 0;
        this.drumpodest.position.z = 1.5;
        this.drumpodest.material = material;

        let speakerdimension = {height: 2, width: 3, depth: 1};
        this.speakerRight = BABYLON.MeshBuilder.CreateBox("speakerRight", speakerdimension, scene);
        this.speakerRight.position.y = 2;
        this.speakerRight.position.x = -5;
        this.speakerRight.position.z = 1.2;
        this.speakerRight.material = material;

        this.speakerLeft = BABYLON.MeshBuilder.CreateBox("speakerLeft", speakerdimension, scene);
        this.speakerLeft.position.y = 2;
        this.speakerLeft.position.x = 5;
        this.speakerLeft.position.z = 1.2;
        this.speakerLeft.material = material;

        let monitordimension = {height: 1, width: 2, depth: 1};

        this.centerMonitor = BABYLON.MeshBuilder.CreateBox("centermonitor", monitordimension, scene);
        this.centerMonitor.position.y = 1.5;
        this.centerMonitor.position.x = 0;
        this.centerMonitor.position.z = 6;
        this.centerMonitor.material = material;

        this.leftMonitor = BABYLON.MeshBuilder.CreateBox("leftmonitor", monitordimension, scene);
        this.leftMonitor.position.y = 1.5;
        this.leftMonitor.position.x = 5;
        this.leftMonitor.position.z = 6;
        this.leftMonitor.material = material;

        this.rightMonitor = BABYLON.MeshBuilder.CreateBox("rightmonitor", monitordimension, scene);
        this.rightMonitor.position.y = 1.5;
        this.rightMonitor.position.x = -5;
        this.rightMonitor.position.z = 6;
        this.rightMonitor.material = material;


        // Create lighting -------------------------------------------------------------------------------------------

        // Add lights to the scene
        this.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(1, 1, 0), scene);
        this.ambientLight.intensity = 0.2; // Very dim hemispheric light for the case that all spotlights are off

        this.drumSpotlight = new BABYLON.SpotLight("drumSpotlight", new BABYLON.Vector3(0, 10, 7), new BABYLON.Vector3(0, -1, -0.7), Math.PI / 10, 2, scene);
        this.leftSpotlight = new BABYLON.SpotLight("leftSpotlight", new BABYLON.Vector3(3.5, 10, 7), new BABYLON.Vector3(0, -1, -0.3), Math.PI / 10, 2, scene);
        this.rightSpotlight = new BABYLON.SpotLight("rightSpotlight", new BABYLON.Vector3(-3.5, 10, 7), new BABYLON.Vector3(0, -1, -0.3), Math.PI / 10, 2, scene);
        this.leftSpotlight.intensity = 0.8;
        this.rightSpotlight.intensity = 0.8;
        this.drumSpotlight.intensity = 0.8;

        this.flash1 = new BABYLON.SpotLight("flash1", new BABYLON.Vector3(-5.5, 15, 21), new BABYLON.Vector3(0, -0.4, -0.9), Math.PI / 10, 100, scene);
        this.flash2 = new BABYLON.SpotLight("flash2", new BABYLON.Vector3(-2, 15, 21), new BABYLON.Vector3(0, -0.4, -0.8), Math.PI / 10, 100, scene);
        this.flash3 = new BABYLON.SpotLight("flash3", new BABYLON.Vector3(2, 15, 21), new BABYLON.Vector3(0, -0.4, -0.8), Math.PI / 10, 100, scene);
        this.flash4 = new BABYLON.SpotLight("flash4", new BABYLON.Vector3(5.5, 15, 21), new BABYLON.Vector3(0, -0.4, -0.9), Math.PI / 10, 100, scene);
        // this.flash1.intensity = 0;
        // this.flash2.intensity = 0;
        // this.flash3.intensity = 0;
        // this.flash4.intensity = 0;
        //this.flash1.diffuse = new BABYLON.Color3(0.64,0.17,0.05);
        this.flash1.diffuse = new BABYLON.Color3(0.64,0.17,0.05);
        this.flash1.specular = new BABYLON.Color3(0.64,0.17,0.05);

        this.flash4.diffuse = new BABYLON.Color3(0.64,0.17,0.05);
        this.flash4.specular = new BABYLON.Color3(0.64,0.17,0.05);

        this.flash3.diffuse = new BABYLON.Color3(0.22,0.73,0.1);
        this.flash3.specular = new BABYLON.Color3(0.64,0.73,0.1);

        this.flash2.diffuse = new BABYLON.Color3(0.22,0.73,0.1);
        this.flash2.specular = new BABYLON.Color3(0.64,0.73,0.1);

        // Actors
        this.leftActor = BABYLON.MeshBuilder.CreateBox("leftActor", {height: 2, width: 2, depth: 0.01}, scene);
        this.leftActor.position.y = 2;
        this.leftActor.position.x = 3.5;
        this.leftActor.position.z = 4;
        var leftActorMaterial = new BABYLON.StandardMaterial("mat", scene);
        var leftActorTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_boy.mp4"], scene, true, true);
        leftActorMaterial.diffuseTexture = leftActorTexture;
        this.leftActor.material = leftActorMaterial;
        this.rightActor = BABYLON.MeshBuilder.CreateBox("rightActor", {height: 2, width: 2, depth: 0.01}, scene);
        this.rightActor.position.y = 2;
        this.rightActor.position.x = -3.5;
        this.rightActor.position.z = 4;
        var rightActorMaterial = new BABYLON.StandardMaterial("mat", scene);
        var rightActorTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_girl.mp4"], scene, true, true);
        rightActorMaterial.diffuseTexture = rightActorTexture;
        this.rightActor.material = rightActorMaterial;

        this.createFirework();

        this.scene =  scene;
    }

    createFirework() {
        let fireworkHelper = new FireworkHelper();
        this.leftFirework = fireworkHelper.createParticles(this.scene, {x: 7, y: 0, z: 5}, false, 2);
        this.rightFirework = fireworkHelper.createParticles(this.scene, {x: -7, y: 0, z: 5}, false, 2);
    }

    destroyFirework() {
        this.leftFirework.dispose();
        this.rightFirework.dispose();
    }

    onLoad() {
    }

    isReady() {
        return (this.scene && this.scene.isReady());
    }

    render() {
        this.scene.render();
    }

    dispose() {
        this.scene.dispose();
    }

}
