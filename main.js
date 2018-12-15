var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* End of the create scene function ******/

let intro = new Intro();
let instructions = new Instructions();
let menu = new Menu();
let game = new Game();
let end = new TheEnd();

let currentScene = null;


// var createGUI = function(scene, showScene) {
//     switch (showScene) {
//         case 0:
//             advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene0);
//         break
//         case 1:
//             advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene1);
//         break
//     }
//     var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Scene " + ((clicks + 1) % 2));
//     button.width = 0.2;
//     button.height = "40px";
//     button.color = "white";
//     button.background = "green";
//     button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
//     advancedTexture.addControl(button);
//
//
//     button.onPointerUpObservable.add(function () {
//         clicks++;
//     });
// }
//
// createGUI(scene, showScene);


function handlKeyPress(event) {
    console.log(event);

    if (document.querySelector("#userInfo")) document.querySelector("#userInfo").remove();

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
    currentScene.onLoad();
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
