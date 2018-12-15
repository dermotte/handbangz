var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* End of the create scene function ******/

let intro = new Intro();
let instructions = new Instructions();
let menu = new Menu();
let game = new Game();
let end = new TheEnd();

let currentScene = null;

function handlKeyPress(event) {
    console.log(event);

    if (document.querySelector("#userInfo")) document.querySelector("#userInfo").remove();

    if (currentScene) currentScene.dispose();

    switch(event.key)
    {
        case "1":
            currentScene = intro;
            break;
        case "2":
            currentScene = instructions;
            break;
        case "3":
            currentScene = menu;
            break;
        case "4":
            currentScene = game;
            break;
        case "5":
            currentScene = end;
            break;
        default:
            break;
    }

    if (currentScene) {
        currentScene.createScene();
        currentScene.onLoad();
    }
}


engine.runRenderLoop(function () {

    if (currentScene && currentScene.isReady()) {
        currentScene.render();
    }
});


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
