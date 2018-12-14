class Gamepad {

    constructor(game) {
        this.game = game;
        this.actionMap = game.actionMap;
        var gamepadManager = new BABYLON.GamepadManager();

        gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {

            //Handle gamepad types
            if (gamepad instanceof BABYLON.Xbox360Pad) {

                console.log("xbox controller connected");

                //Xbox button down/up events
                gamepad.onButtonDownObservable.add((button, state) => {
                    switch (button) {
                        case 0: // A
                            this.actionMap.bang();
                            break;
                        case 1: // B
                            this.actionMap.doublebang();
                            break;
                        case 2: // X
                            this.actionMap.horns();
                            break;
                        case 3: // Y
                            // ...
                            break;
                    }

                })
                gamepad.onButtonUpObservable.add((button, state) => {
                    //console.log(BABYLON.Xbox360Button[button] + " up");
                })

                //Stick events
                gamepad.onleftstickchanged((values) => {
                    //console.log("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3));
                })
            }
        })
    }

}