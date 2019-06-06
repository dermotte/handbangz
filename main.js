var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* End of the create scene function ******/

let intro = new Intro();
let instructions = new Instructions();
let credits = new Credits();
let menu = new Menu();
let game = new Game();
let end = new TheEnd();

let currentScene = null;
setNewScene(menu);

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
        case "Escape":
            newScene = menu;
            break;
        default:
            break;
    }

    setNewScene(newScene);
}


function setNewScene(newScene) {
    console.log(newScene);
    if (newScene != null) {
        if (currentScene) {
            currentScene.dispose();
        }
        currentScene = newScene;
        currentScene.createScene();
        currentScene.onLoad();
    }
}

function handleActionKeys (event) {
    if (currentScene === game && game.isReady()) {
        switch(event.key)
        {
            case "a":
                game.startFirework("left");
                game.startFirework("right");
                break;
            case "s":
                game.stopFirework("left");
                game.stopFirework("left");
                break;
            case "d":
                game.switchOnGreen();
                break;
            case "f":
                game.startLightSwitching();
                game.setPlayerOneScore(100);
                game.setPlayerTwoScore(150);
                break;
            case "+":
                game.setScore(game.playerStats.player1.score + 5);
                game.addToStreak(4);
                break;
            case "-":
                game.setScore(game.playerStats.player1.score - 5);
                break;
            default:
                break;
        }
    } else if (currentScene === menu &&  menu.isReady()) {
        switch(event.key)
        {
            case "ArrowUp":
                menu.state += 2;
                menu.state = menu.state % 3;
                break;
            case "ArrowDown":
                menu.state += 1;
                menu.state = menu.state % 3;
                break;
            case "Enter":
                // set to the new scene:
                let newScene = null;
                if (menu.state === menu.STATE_GAME) {
                    newScene = game;
                } else if (menu.state === menu.STATE_CREDITS) {
                    newScene = credits;
                } else if (menu.state === menu.STATE_INSTRUCTIONS) {
                    newScene = instructions;
                }
                setNewScene(newScene);
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

