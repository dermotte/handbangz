var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* End of the create scene function ******/

let intro = new Intro();
let instructions = new Instructions();
let menu = new Menu();
let game = new Game();
let end = new TheEnd();


function handlKeyPress(event) {
    console.log(event);
    document.querySelector("#userInfo").innerHTML = "";
    switch(event.key)
    {

        case "1":
            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                intro.render();
            });
            break;
        case "2":
            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                instructions.render();
            });
            break;
        case "3":
            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                menu.render();
            });
            break;
        case "4":
            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                game.render();
            });
            break;
        case "5":
            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                end.render();
            });
            break;
        default:
            break;
    }
}


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});