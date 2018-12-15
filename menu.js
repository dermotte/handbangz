class Menu {

    constructor() {
        this.scene;
        this.state;
    }

    createScene () {

        // Create the scene space
        let scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        let camera = new BABYLON.UniversalCamera("UniversalCamera",new BABYLON.Vector3(0,-1,-5), scene);
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
        var meshTask = assetsManager.addMeshTask("task01","", "assets/models/", "Play.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, 1, 0);
        };
        meshTask = assetsManager.addMeshTask("task02","", "assets/models/", "Credits.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, 0, 0);
        };
        meshTask = assetsManager.addMeshTask("task03","", "assets/models/", "Instructions.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(-3, -1, 0);
        };
        assetsManager.load();

        this.scene =  scene;
    }

    onLoad() {
        this.state = 1;
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
