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

        this.scene;
        this.actionMap = new ActionMap(this);
        this.gamepad = new Gamepad(this);
        this.createScene();
    }

    createScene () {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 3 * Math.PI / 8, 10, new BABYLON.Vector3(0,5,7), scene);
        // comment the scene to fix the camera
        camera.attachControl(canvas, true);

        // Build stage ----------------------------------------------------------------------------------

        // Floor
        this.floor = BABYLON.MeshBuilder.CreateBox("floor", {height: 0.1, width: 100, depth: 100}, scene);
        this.floor.position.x = 0;
        this.floor.position.z = 0;
        //var plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene); // default plane
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {}, scene); //default ground

        // Stage
        this.stagebox = BABYLON.MeshBuilder.CreateBox("stagebox", {height: 1, width: 20, depth: 7}, scene);
        this.stagebox.position.x = 0;
        this.stagebox.position.z = 3.5;
        this.stagebox.position.y = 0.5;
        this.wall = BABYLON.MeshBuilder.CreateBox("wall", {height: 10, width: 20, depth: 0.1}, scene);
        this.wall.position.x = 0;
        this.wall.position.z = 0;
        this.wall.position.y = 5;

        this.drumpodest = BABYLON.MeshBuilder.CreateBox("drumpodest", {height: 0.5, width: 3, depth: 2}, scene);
        this.drumpodest.position.y = 1.25;
        this.drumpodest.position.x = 0;
        this.drumpodest.position.z = 1.5;

        let speakerdimension = {height: 2, width: 3, depth: 1};
        this.speakerRight = BABYLON.MeshBuilder.CreateBox("speakerRight", speakerdimension, scene);
        this.speakerRight.position.y = 2;
        this.speakerRight.position.x = -5;
        this.speakerRight.position.z = 1.2;

        this.speakerLeft = BABYLON.MeshBuilder.CreateBox("speakerLeft", speakerdimension, scene);
        this.speakerLeft.position.y = 2;
        this.speakerLeft.position.x = 5;
        this.speakerLeft.position.z = 1.2;

        let monitordimension = {height: 1, width: 2, depth: 1};

        this.centerMonitor = BABYLON.MeshBuilder.CreateBox("centermonitor", monitordimension, scene);
        this.centerMonitor.position.y = 1.5;
        this.centerMonitor.position.x = 0;
        this.centerMonitor.position.z = 6;

        this.leftMonitor = BABYLON.MeshBuilder.CreateBox("leftmonitor", monitordimension, scene);
        this.leftMonitor.position.y = 1.5;
        this.leftMonitor.position.x = 5;
        this.leftMonitor.position.z = 6;

        this.rightMonitor = BABYLON.MeshBuilder.CreateBox("rightmonitor", monitordimension, scene);
        this.rightMonitor.position.y = 1.5;
        this.rightMonitor.position.x = -5;
        this.rightMonitor.position.z = 6;


        // Create lighting -------------------------------------------------------------------------------------------

        // Add lights to the scene
        this.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(1, 1, 0), scene);
        this.ambientLight.intensity = 0.2; // Very dim hemispheric light for the case that all spotlights are off

        this.drumSpotlight = new BABYLON.SpotLight("drumSpotlight", new BABYLON.Vector3(0, 10, 7), new BABYLON.Vector3(0, -1, -0.7), Math.PI / 10, 2, scene);
        this.leftSpotlight = new BABYLON.SpotLight("leftSpotlight", new BABYLON.Vector3(3.5, 10, 7), new BABYLON.Vector3(0, -1, -0.3), Math.PI / 10, 2, scene);
        this.rightSpotlight = new BABYLON.SpotLight("rightSpotlight", new BABYLON.Vector3(-3.5, 10, 7), new BABYLON.Vector3(0, -1, -0.3), Math.PI / 10, 2, scene);

        //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        this.scene =  scene;
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
