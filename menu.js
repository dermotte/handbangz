class Menu {

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

        // Add a camera to the scene and attach it to the canvas
        let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -5), scene);
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
        var assetsManager = new BABYLON.AssetsManager(scene);
        var meshTask = assetsManager.addMeshTask("task01", "", "assets/models/", "Play.obj");
        meshTask.onSuccess = function (task) {
            this.play = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, 1, 2);
        };
        meshTask = assetsManager.addMeshTask("task02", "", "assets/models/", "Credits.obj");
        meshTask.onSuccess = function (task) {
            this.credits = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, 0, 2);
        };
        meshTask = assetsManager.addMeshTask("task03", "", "assets/models/", "Instructions.obj");
        meshTask.onSuccess = function (task) {
            this.intro = task.loadedMeshes[0];
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, -1, 2);
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
        if (this.state == 0)
            this.scene.meshes[0].position.z = 0;
        else
            this.scene.meshes[0].position.z = 2;
        if (this.state == 1)
            this.scene.meshes[1].position.z = 0;
        else
            this.scene.meshes[1].position.z = 2;
        if (this.state == 2)
            this.scene.meshes[2].position.z = 0;
        else
            this.scene.meshes[2].position.z = 2;
        this.scene.render();
    }

    dispose() {
        this.scene.dispose();
    }

}
