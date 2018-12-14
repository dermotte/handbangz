class Game {
    constructor() {
        this.scene;
        this.createScene();
    }

    createScene () {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 3 * Math.PI / 8, 10, new BABYLON.Vector3(0,5,7), scene);
        // comment the scene to fix the camera
        camera.attachControl(canvas, true);

        // Build stage

        // Floor
        var floor = BABYLON.MeshBuilder.CreateBox("floor", {height: 0.1, width: 100, depth: 100}, scene);
        floor.position.x = 0;
        floor.position.z = 0;
        //var plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene); // default plane
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {}, scene); //default ground

        // Stage
        var stagebox = BABYLON.MeshBuilder.CreateBox("stagebox", {height: 1, width: 20, depth: 7}, scene);
        stagebox.position.x = 0;
        stagebox.position.z = 3.5;
        stagebox.position.y = 0.5;
        var wall = BABYLON.MeshBuilder.CreateBox("wall", {height: 10, width: 20, depth: 0.1}, scene);
        wall.position.x = 0;
        wall.position.z = 0;
        wall.position.y = 5;

        var drumpodest = BABYLON.MeshBuilder.CreateBox("drumpodest", {height: 0.5, width: 3, depth: 2}, scene);
        drumpodest.position.y = 1.25;
        drumpodest.position.x = 0;
        drumpodest.position.z = 1.5;

        let speakerdimension = {height: 2, width: 3, depth: 1};
        var speakerRight = BABYLON.MeshBuilder.CreateBox("speakerRight", speakerdimension, scene);
        speakerRight.position.y = 2;
        speakerRight.position.x = -5;
        speakerRight.position.z = 1.2;

        var speakerLeft = BABYLON.MeshBuilder.CreateBox("speakerLeft", speakerdimension, scene);
        speakerLeft.position.y = 2;
        speakerLeft.position.x = 5;
        speakerLeft.position.z = 1.2;

        let monitordimension = {height: 1, width: 2, depth: 1};

        var centermonitor = BABYLON.MeshBuilder.CreateBox("centermonitor", monitordimension, scene);
        centermonitor.position.y = 1.5;
        centermonitor.position.x = 0;
        centermonitor.position.z = 6;

        var leftmonitor = BABYLON.MeshBuilder.CreateBox("leftmonitor", monitordimension, scene);
        leftmonitor.position.y = 1.5;
        leftmonitor.position.x = 5;
        leftmonitor.position.z = 6;

        var rightmonitor = BABYLON.MeshBuilder.CreateBox("rightmonitor", monitordimension, scene);
        rightmonitor.position.y = 1.5;
        rightmonitor.position.x = -5;
        rightmonitor.position.z = 6;


        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        this.scene =  scene;
    }

    render() {
        this.scene.render();
    }

}