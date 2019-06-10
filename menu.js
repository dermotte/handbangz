class Menu {

    STATE_GAME = 0;
    STATE_CREDITS = 1;
    STATE_INSTRUCTIONS = 2;

    constructor() {
        this.scene;
        this.state;
        this.play;
        this.intro;
        this.credits;
    }

    createScene() {

        // Create the scene space
        let scene = new BABYLON.Scene(engine);
        
        this.introSong = new BABYLON.Sound("bangShout", "assets/music/intro.mp3", scene, null, {autoplay: true, loop: true});

        // Add a camera to the scene and attach it to the canvas
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -6), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        // camera.attachControl(canvas, true);

        // Add lights to the scene
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        // Add and manipulate meshes in the scene
        // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

        // BABYLON.SceneLoader.Append("assets/models/", "Credits.obj", function (scene) {
        //     scene.meshes[0].position.y = 2
        // });
        // BABYLON.SceneLoader.Append("assets/models/", "Play.obj", scene);
        // BABYLON.SceneLoader.Append("assets/models/", "Instructions.obj", scene);
        // console.log(scene);

        // scene.meshes[2].position.y = -2
        let assetsManager = new BABYLON.AssetsManager(scene);
        let self = this;
        let meshTask = assetsManager.addMeshTask("task01", "", "assets/models/", "Play.obj");
        meshTask.onSuccess = function (task) {
            self.play = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, 0, 2);
        };
        meshTask = assetsManager.addMeshTask("task02", "", "assets/models/", "Credits.obj");
        meshTask.onSuccess = function (task) {
            self.credits = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, -1, 2);
        };
        meshTask = assetsManager.addMeshTask("task03", "", "assets/models/", "Instructions.obj");
        meshTask.onSuccess = function (task) {
            self.intro = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, -2, 2);
        };
        meshTask = assetsManager.addMeshTask("task05", "", "assets/models/", "hb_logo.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 1.5, 2);
            task.loadedMeshes[1].position = new BABYLON.Vector3(0, 1.5, 2);
            task.loadedMeshes[2].position = new BABYLON.Vector3(0, 1.5, 2);
            //task.loadedMeshes[2].rotation.y= Math.PI/2;
            //task.loadedMeshes[0].rotation.y= Math.PI;
            task.loadedMeshes[1].rotation.y= Math.PI;

            task.loadedMeshes[0].material.maxSimultaneousLights = 8;
            task.loadedMeshes[1].material.maxSimultaneousLights = 8;
            task.loadedMeshes[2].material.maxSimultaneousLights = 8;

        };
        assetsManager.load();

        this.scene = scene;
    }

    onLoad() {
        this.state = 0;        
    }

    isReady() {
        return (this.scene && this.scene.isReady());
    }

    render() {

        let playMeshPos = (this.state === this.STATE_GAME) ? 0 : 2;
        if (this.play) {
            this.play.position.z = playMeshPos;
        }

        let creditsMeshPos = (this.state === this.STATE_CREDITS) ? 0 : 2;
        if (this.credits) {
            this.credits.position.z = creditsMeshPos;
        }

        let instructionsMeshPos = (this.state === this.STATE_INSTRUCTIONS) ? 0 : 2;
        if (this.intro) {
            this.intro.position.z = instructionsMeshPos;
        }

        this.scene.render();
    }

    dispose() {
        this.scene.dispose();
    }

}
