var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* End of the create scene function ******/

let intro = new Intro();
let instructions = new Instructions();
let menu = new Menu();
let game = new Game();
let end = new TheEnd();

let currentScene = menu;
menu.createScene();
menu.onLoad();

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

    setNewScene(newScene);
}


function setNewScene(newScene) {
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
    if (game != null && game.isReady() && currentScene === game) {
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
                game.setPlayerOneScore(100);
                game.setPlayerTwoScore(150);
                break;
            default:
                break;
        }
    } else  if (menu != null && menu.isReady() && currentScene === menu) {
        switch(event.key)
        {
            case "ArrowUp":
                menu.state += 2;
                menu.state = menu.state%3;
                break;
            case "ArrowDown":
                menu.state += 1;
                menu.state = menu.state%3;
                break;
            case "Enter":
                // set to the new scene:
                let newScene = null;
                if (menu.state == 0) {
                    newScene = game;
                } else if (menu.state = 1) {
                    newScene = instructions;
                } else if (menu.state == 2)
                    newScene = instructions;
                setNewScene(newScene)
                break;
            default:
                break;

        }
        console.log(menu.state);
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
    console.log("head up");

    if (game != null && game.isReady()) {
        game.headUpTriggered();
    }
});

window.addEventListener("headdown", function () {
    console.log("head down")
});