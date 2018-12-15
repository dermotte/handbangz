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

    handleSceneKeys(event);
    handleActionKeys(event);
}

function handleSceneKeys (event) {
    let newScene = null;

    switch(event.key)
    {
        case "1":
            newScene = intro;
            break;
        case "2":
            newScene = instructions;
            break;
        case "3":
            newScene = menu;
            break;
        case "4":
            newScene = game;
            break;
        case "5":
            newScene = end;
            break;
        default:
            break;
    }

    if (newScene != null) {
        if (currentScene) {
            currentScene.dispose();
        }
        currentScene = newScene;
    }
    if (newScene != null && currentScene) {
        currentScene.createScene();
        currentScene.onLoad();
    }
}

function handleActionKeys (event) {
    if (game != null && game.isReady()) {

        switch(event.key)
        {
            case "a":
                game.startFirework();
                break;
            case "s":
                game.stopFirework();
                break;
            case "d":
                game.switchOnGreen();
                break;
            case "f":
                game.startLightSwitching();
                break;
            default:
                break;
        }

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

window.addEventListener("headup", function () {
    console.log("head up")
});

window.addEventListener("headdown", function () {
    console.log("head down")
});