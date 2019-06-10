class Game {
    constructor() {
        this.scene;
        // stage objects
        this.floor;
        this.stagebox;
        this.wall;
        this.drumpodest;
        this.speakerRight;
        this.speakerLeft;
        this.centerMonitor;
        this.leftMonitor;
        this.rightMonitor;

        // lights
        this.ambientLight;
        this.drumSpotlight;
        this.leftSpotlight;
        this.rightSpotlight;

        // flashlights
        this.flash1;
        this.flash2;
        this.flash3;
        this.flash4;
        this.flashlightInterval;

        // Fireworks
        this.fireworkHelper = new FireworkHelper();
        this.leftFirework = null;
        this.rightFirework = null;

        // Actors
        this.leftActor;
        this.rightActor;

        // hud for score and such things
        this.hud;
        this.playerOneScoreLabel;
        this.playerTwoScoreLabel;

        this.videoWall;

        this.leftEye;
        this.rightEye;

        this.scene;

        // Stats of the current game
        this.playerStats = {
            player1: {
                score: 0,
                hitsInARow: 0,
                onFire: false,
                bangNotification: null,
                streakNotification: null,
                won: false
            },
            player2: {
                score: 0,
                hitsInARow: 0,
                onFire: false,
                bangNotification: null,
                streakNotification: null,
                won: false
            },
            wonNotificaiton: false,
            gameStartTime: null,
            gameEndTime: null
        }
        this.winScore = 150;
        this.loseScore = 0;
        this.fireWorkScore = 80;
        this.lastHeadUp = new Date().getTime();
        this.startingScore = 50;
        this.gameOver = false;
        this.modes = {
            bang: {key: "bang", msg: "Bang", actions: ["bang"], actionMsg: "Bang"},
            horn: {key: "horn", msg: "Bang & Evil Horns", actions: ["horn", "bang"], actionMsg: "Evil Horn"},
            dHorn: {key: "dHorn", msg: "Bang & Very Evil Horns", actions: ["dHorn", "bang"], actionMsg: "Very Evil Horn"},
            light: {key: "light", msg: "Show me the light", actions: ["light"], actionMsg: "Lighter"}
        };
        this.currentMode;

        // sound
        this.soundMachine;
        // this.currentSong = null;

        let videoElement = document.getElementById('videostream');
        let samplerate = 250; // this.soundMachine.beattime / 2;
        this.poseDetector = new PoseDetector(samplerate, videoElement, 640, 360);
    }

    /**
     * Builds the stage and all it's components
     */
    createScene() {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        this.soundMachine = new SoundMachine(scene);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 3 * Math.PI / 8, 10, new BABYLON.Vector3(0, 5, 7), scene);
        // Uncomment this to enable mouse control of the camera
        //camera.attachControl(canvas, true);

        // Build stage ----------------------------------------------------------------------------------

        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.maxSimultaneousLights = 8;
        // Floor
        this.floor = BABYLON.MeshBuilder.CreateBox("floor", {height: 0.1, width: 100, depth: 100}, scene);
        this.floor.position.x = 0;
        this.floor.position.z = 0;
        this.floor.material = material;
        //var plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene); // default plane
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {}, scene); //default ground

        // Stage
        this.stagebox = BABYLON.MeshBuilder.CreateBox("stagebox", {height: 1, width: 20, depth: 7}, scene);
        this.stagebox.position.x = 0;
        this.stagebox.position.z = 3.5;
        this.stagebox.position.y = 0.5;
        this.stagebox.material = material;
        this.wall = BABYLON.MeshBuilder.CreateBox("wall", {height: 10, width: 20, depth: 0.1}, scene);
        this.wall.position.x = 0;
        this.wall.position.z = 0;
        this.wall.position.y = 5;
        this.wall.material = material;

        this.drumpodest = BABYLON.MeshBuilder.CreateBox("drumpodest", {height: 0.5, width: 3, depth: 2}, scene);
        this.drumpodest.position.y = 1.25;
        this.drumpodest.position.x = 0;
        this.drumpodest.position.z = 1.5;
        this.drumpodest.material = material;

        let speakerdimension = {height: 2, width: 3, depth: 1};
        this.speakerRight = BABYLON.MeshBuilder.CreateBox("speakerRight", speakerdimension, scene);
        this.speakerRight.position.y = 2;
        this.speakerRight.position.x = -7;
        this.speakerRight.position.z = 1.2;
        this.speakerRight.material = material;

        this.speakerLeft = BABYLON.MeshBuilder.CreateBox("speakerLeft", speakerdimension, scene);
        this.speakerLeft.position.y = 2;
        this.speakerLeft.position.x = 7;
        this.speakerLeft.position.z = 1.2;
        this.speakerLeft.material = material;

        // Meshes on the stage:
        let assetsManager = new BABYLON.AssetsManager(scene);
        let meshTask = assetsManager.addMeshTask("task01", "", "assets/models/", "speaker_floor.obj");
        meshTask.onSuccess = function (task) {

            task.loadedMeshes[0].position = new BABYLON.Vector3(-4, 1, 6);
            task.loadedMeshes[1].position = new BABYLON.Vector3(-4, 1, 6);
            task.loadedMeshes[0].material.maxSimultaneousLights = 8;
            task.loadedMeshes[1].material.maxSimultaneousLights = 8;
            let bb1 = task.loadedMeshes[0].clone();
            let bb2 = task.loadedMeshes[1].clone();

            bb1.position = new BABYLON.Vector3(4, 1, 6);
            bb2.position = new BABYLON.Vector3(4, 1, 6);
            bb1.material.maxSimultaneousLights = 8;
            bb2.material.maxSimultaneousLights = 8;

            let bm1 = task.loadedMeshes[0].clone();
            let bm2 = task.loadedMeshes[1].clone();

            bm1.position = new BABYLON.Vector3(0, 1, 6);
            bm2.position = new BABYLON.Vector3(0, 1, 6);
            bm1.material.maxSimultaneousLights = 8;
            bm2.material.maxSimultaneousLights = 8;
        };
        meshTask = assetsManager.addMeshTask("task02", "", "assets/models/", "speaker_tower.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(-8, 1, 6);
            task.loadedMeshes[1].position = new BABYLON.Vector3(-8, 1, 6);
            task.loadedMeshes[0].material.maxSimultaneousLights = 8;
            task.loadedMeshes[1].material.maxSimultaneousLights = 8;

            let bb1 = task.loadedMeshes[0].clone();
            let bb2 = task.loadedMeshes[1].clone();

            bb1.position = new BABYLON.Vector3(8, 1, 6);
            bb2.position = new BABYLON.Vector3(8, 1, 6);
            bb1.material.maxSimultaneousLights = 8;
            bb2.material.maxSimultaneousLights = 8;
        };
        meshTask = assetsManager.addMeshTask("task03", "", "assets/models/", "helmet_horns.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 1.5, 2);
            task.loadedMeshes[1].position = new BABYLON.Vector3(0, 1.5, 2);
        };
        meshTask = assetsManager.addMeshTask("task04", "", "assets/models/", "speaker_bent.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(-7, 4, 1);
            task.loadedMeshes[1].position = new BABYLON.Vector3(-7, 4, 1);

            task.loadedMeshes[0].material.maxSimultaneousLights = 8;
            task.loadedMeshes[1].material.maxSimultaneousLights = 8;

            let bb1 = task.loadedMeshes[0].clone();
            let bb2 = task.loadedMeshes[1].clone();

            bb1.position = new BABYLON.Vector3(7, 4, 1);
            bb2.position = new BABYLON.Vector3(7, 4, 1);

            bb1.material.maxSimultaneousLights = 8;
            bb2.material.maxSimultaneousLights = 8;

        };
        meshTask = assetsManager.addMeshTask("task05", "", "assets/models/", "hb_logo.obj");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 8, 2);
            task.loadedMeshes[1].position = new BABYLON.Vector3(0, 8, 2);
            task.loadedMeshes[2].position = new BABYLON.Vector3(0, 8, 2);
            task.loadedMeshes[2].rotation.y = Math.PI / 2;
            task.loadedMeshes[0].rotation.y = Math.PI;

            task.loadedMeshes[0].material.maxSimultaneousLights = 8;
            task.loadedMeshes[1].material.maxSimultaneousLights = 8;
            task.loadedMeshes[2].material.maxSimultaneousLights = 8;

        };
        assetsManager.load();


        // Create lighting -------------------------------------------------------------------------------------------

        // Add lights to the scene
        this.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(1, 1, 0), scene);
        this.ambientLight.intensity = 0.22; // Very dim hemispheric light for the case that all spotlights are off

        this.drumSpotlight = new BABYLON.SpotLight("drumSpotlight", new BABYLON.Vector3(0, 10, 8), new BABYLON.Vector3(0, -1, -0.7), Math.PI / 4, 80, scene);
        this.leftSpotlight = new BABYLON.SpotLight("leftSpotlight", new BABYLON.Vector3(4.5, 10, 10), new BABYLON.Vector3(0, -1, -0.7), Math.PI / 4, 60, scene);
        this.rightSpotlight = new BABYLON.SpotLight("rightSpotlight", new BABYLON.Vector3(-4.5, 10, 10), new BABYLON.Vector3(0, -1, -0.7), Math.PI / 4, 60, scene);
        this.leftSpotlight.diffuse = new BABYLON.Color3(1, 1, 1);
        this.leftSpotlight.specular = new BABYLON.Color3(1, 1, 0);
        this.leftSpotlight.intensity = 0.8;
        this.rightSpotlight.intensity = 0.8;
        this.drumSpotlight.intensity = 0.8;

        this.flash1 = new BABYLON.SpotLight("flash1", new BABYLON.Vector3(-5.5, 15, 21), new BABYLON.Vector3(0, -0.4, -0.9), Math.PI / 4, 100, scene);
        this.flash2 = new BABYLON.SpotLight("flash2", new BABYLON.Vector3(-2, 15, 21), new BABYLON.Vector3(0, -0.4, -0.8), Math.PI / 4, 100, scene);
        this.flash3 = new BABYLON.SpotLight("flash3", new BABYLON.Vector3(2, 15, 21), new BABYLON.Vector3(0, -0.4, -0.8), Math.PI / 4, 100, scene);
        this.flash4 = new BABYLON.SpotLight("flash4", new BABYLON.Vector3(5.5, 15, 21), new BABYLON.Vector3(0, -0.4, -0.9), Math.PI / 4, 100, scene);
        // this.flash1.intensity = 0;
        // this.flash2.intensity = 0;
        // this.flash3.intensity = 0;
        // this.flash4.intensity = 0;
        //this.flash1.diffuse = new BABYLON.Color3(0.64,0.17,0.05);
        this.flash1.diffuse = new BABYLON.Color3(0.64, 0.17, 0.05);
        this.flash1.specular = new BABYLON.Color3(0.64, 0.17, 0.05);

        this.flash4.diffuse = new BABYLON.Color3(0.64, 0.17, 0.05);
        this.flash4.specular = new BABYLON.Color3(0.64, 0.17, 0.05);

        this.flash3.diffuse = new BABYLON.Color3(0.22, 0.73, 0.1);
        this.flash3.specular = new BABYLON.Color3(0.64, 0.73, 0.1);

        this.flash2.diffuse = new BABYLON.Color3(0.22, 0.73, 0.1);
        this.flash2.specular = new BABYLON.Color3(0.64, 0.73, 0.1);

        // Actors
        this.leftActor = BABYLON.MeshBuilder.CreateBox("leftActor", {height: 2, width: 2, depth: 0.01}, scene);
        this.leftActor.position.y = 2;
        this.leftActor.position.x = 4.5;
        this.leftActor.position.z = 4;
        var leftActorMaterial = new BABYLON.StandardMaterial("mat", scene);
        var leftActorTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_boy_256.mp4"], scene, true, true);
        leftActorMaterial.diffuseTexture = leftActorTexture;
        this.leftActor.material = leftActorMaterial;
        this.leftActorVideo = leftActorMaterial.diffuseTexture.video;
        this.leftActorVideo.currentTime = 1;
        this.leftActorVideo.pause();

        this.rightActor = BABYLON.MeshBuilder.CreateBox("rightActor", {height: 2, width: 2, depth: 0.01}, scene);
        this.rightActor.position.y = 2;
        this.rightActor.position.x = -4.5;
        this.rightActor.position.z = 4;
        var rightActorMaterial = new BABYLON.StandardMaterial("mat", scene);
        var rightActorTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_girl_256.mp4"], scene, true, true);
        rightActorMaterial.diffuseTexture = rightActorTexture;
        this.rightActor.material = rightActorMaterial;
        this.rightActorVideo = rightActorMaterial.diffuseTexture.video;
        this.rightActorVideo.currentTime = 1.3;
        this.rightActorVideo.pause();

        //this.createFirework();
        this.switchOffGreen();
        this.switchOffRed();

        this.addHUD();

        // Player video wall
        // Actors
        this.videoWall = BABYLON.MeshBuilder.CreateBox("videoWall", {height: 6, width: 9, depth: 0.01}, scene);
        this.videoWall.position.y = 5;
        this.videoWall.position.x = 0;
        this.videoWall.position.z = 0.1;
        var videoWallMaterial = new BABYLON.StandardMaterial("mat", scene);

        var plane = this.videoWall;
        BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
            videoWallMaterial.emissiveTexture = videoTexture;
            plane.material = videoWallMaterial;
        }, {});


        // Eyes for the scull
        this.leftEye = BABYLON.MeshBuilder.CreateSphere("leftEye", {diameter: 0.4}, scene);
        this.leftEye.position.x = 0.30
        this.leftEye.position.y = 1.6;
        this.leftEye.position.z = 2;
        var leftEyeMat = new BABYLON.StandardMaterial("leftEyeMat", scene);
        leftEyeMat.specularColor = new BABYLON.Color3(0, 0, 0);
        leftEyeMat.maxSimultaneousLights = 1;
        this.leftEye.material = leftEyeMat;
        this.rightEye = BABYLON.MeshBuilder.CreateSphere("rightEye", {diameter: 0.4}, scene);
        this.rightEye.position.x = -0.23;
        this.rightEye.position.y = 1.6;
        this.rightEye.position.z = 2;
        var rightEyeMat = new BABYLON.StandardMaterial("rightEyeMat", scene);
        rightEyeMat.specularColor = new BABYLON.Color3(0, 0, 0);
        rightEyeMat.maxSimultaneousLights = 1;
        this.rightEye.material = rightEyeMat;

        //var videoWallTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_boy.mp4"], scene, true, true);
        //videoWallMaterial.diffuseTexture = videoWallTexture;
        //this.videoWall.material = videoWallMaterial;

        this.scene = scene;

        console.log("START");

    }

    addHUD() {
        // GUI
        this.hud = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var playerTwoScore = new BABYLON.GUI.TextBlock("playerTwoScore");
        playerTwoScore.text = "";
        playerTwoScore.fontSize = 50;
        playerTwoScore.color = '#A5400C';
        playerTwoScore.fontFamily = 'New Rocker';
        playerTwoScore.shadowBlur = 3;
        playerTwoScore.shadowColor = "#000";
        playerTwoScore.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_TOP;
        playerTwoScore.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        playerTwoScore.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        playerTwoScore.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        playerTwoScore.paddingRight = "50px";
        playerTwoScore.paddingTop = "50px";
        this.playerTwoScoreLabel = playerTwoScore;
        this.hud.addControl(playerTwoScore);

        var playerOneScore = new BABYLON.GUI.TextBlock("playerOneScore");
        playerOneScore.text = "";
        playerOneScore.fontSize = 50;
        playerOneScore.color = '#A5400C';
        playerOneScore.fontFamily = 'New Rocker';
        playerOneScore.shadowBlur = 3;
        playerOneScore.shadowColor = "#000";
        playerOneScore.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_TOP;
        playerOneScore.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        playerOneScore.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        playerOneScore.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        playerOneScore.paddingLeft = "50px";
        playerOneScore.paddingTop = "50px";
        this.playerOneScoreLabel = playerOneScore;
        this.hud.addControl(playerOneScore);

        var gameMode = new BABYLON.GUI.TextBlock("playerOneScore");
        gameMode.text = "";
        gameMode.fontSize = 50;
        gameMode.color = '#A5400C';
        gameMode.fontFamily = 'New Rocker';
        gameMode.shadowBlur = 3;
        gameMode.shadowColor = "#000";
        gameMode.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        gameMode.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        gameMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        gameMode.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameMode.paddingLeft = "50px";
        gameMode.paddingBottom = "30px";
        this.gameMode = gameMode;
        this.hud.addControl(gameMode);

        var playerOneAction = new BABYLON.GUI.TextBlock("playerOneAction");
        playerOneAction.text = "";
        playerOneAction.hasAlpha = true;
        playerOneAction.alpha = 1.0;
        playerOneAction.fontSize = 35;
        playerOneAction.color = '#A5400C';
        playerOneAction.fontFamily = 'New Rocker';
        playerOneAction.shadowBlur = 3;
        playerOneAction.shadowColor = "#000";
        playerOneAction.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        playerOneAction.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        playerOneAction.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        playerOneAction.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        playerOneAction.paddingLeft = "200px";
        playerOneAction.paddingBottom = "200px";
        this.playerOneActionLabel = playerOneAction;
        this.hud.addControl(playerOneAction);

        var playerTwoAction = new BABYLON.GUI.TextBlock("playerTwoAction");
        playerTwoAction.text = "";
        playerTwoAction.hasAlpha = true;
        playerTwoAction.alpha = 1.0;
        playerTwoAction.fontSize = 35;
        playerTwoAction.color = '#A5400C';
        playerTwoAction.fontFamily = 'New Rocker';
        playerTwoAction.shadowBlur = 3;
        playerTwoAction.shadowColor = "#000";
        playerTwoAction.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        playerTwoAction.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        playerTwoAction.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        playerTwoAction.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        playerTwoAction.paddingRight = "200px";
        playerTwoAction.paddingBottom = "200px";
        this.playerTwoActionLabel = playerTwoAction;
        this.hud.addControl(playerTwoAction);
    }

    /**
     * Displays messages like the game over message, the game won message and streak messages.
     * @param msg
     * @param location
     * @param onFinishAnimation
     */
    showUserMessage(msg, location = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM, onFinishAnimation = null) {

        let myTempHud = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let tempMessage = new BABYLON.GUI.TextBlock("user_message");
        tempMessage.text = msg;
        tempMessage.fontSize = 50;
        tempMessage.color = '#FFF';
        tempMessage.shadowBlur = 3;
        tempMessage.shadowColor = "#000";
        tempMessage.fontFamily = 'New Rocker';
        tempMessage.textVerticalAlignment = location;
        tempMessage.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        tempMessage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        tempMessage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        tempMessage.paddingRight = "50px";
        tempMessage.paddingTop = "50px";
        myTempHud.addControl(tempMessage);

        let animationHideText = new BABYLON.Animation("fade_me_message", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let keys = [];

        keys.push({
            frame: 0,
            value: 1
        });

        keys.push({
            frame: 50,
            value: 1
        });

        keys.push({
            frame: 100,
            value: 0
        });

        animationHideText.setKeys(keys);
        tempMessage.animations = [];
        tempMessage.animations.push(animationHideText);
        this.scene.beginAnimation(tempMessage, 0, 100, false, 1,
                () => {
            tempMessage.dispose();
            myTempHud.dispose();
            if (onFinishAnimation)
                onFinishAnimation();
        });

    }

    /**
     * Is used to update the score of player 1
     * @param score
     */
    setPlayerOneScore(score) {
        this.playerOneScoreLabel.text = "Player 1: " + score;
    }

    /**
     * Is used to update the score of player 2
     * @param score
     */
    setPlayerTwoScore(score) {
        this.playerTwoScoreLabel.text = score + " : Player 2";
    }

    /**
     * Updates the scores of both players
     */
    updatePlayerScores() {
        // console.log(this.playerOneScoreLabel);
        if (this.playerOneScoreLabel)
            this.playerOneScoreLabel.text = "Player 1: " + this.playerStats.player1.score;
        if (this.playerTwoScoreLabel)
            this.playerTwoScoreLabel.text = this.playerStats.player2.score + " : Player 2";
    }

    /**
     * Start the firework animation on the given location ("left", or "right")
     * @param location "left", or "right"
     */
    startFirework(location) {

        if (location === "left") {
            if (!this.leftFirework) {
                this.leftFirework = this.fireworkHelper.createParticles(this.scene, {x: 7.5, y: 0, z: 4}, false, 3);
            } else {
                this.leftFirework.getEmittedParticleSystems()[0].emitRate = 350;
                this.leftFirework.getEmittedParticleSystems()[1].emitRate = 350;
            }
        } else if (location === "right") {
            if (!this.rightFirework) {
                this.rightFirework = this.fireworkHelper.createParticles(this.scene, {x: -7.5, y: 0, z: 4}, false, 3);
            } else {
                this.rightFirework.getEmittedParticleSystems()[0].emitRate = 350;
                this.rightFirework.getEmittedParticleSystems()[1].emitRate = 350;
            }
        }
    }

    /**
     * Stops the firework animation on the given location ("left", or "right")
     * @param location "left", or "right"
     */
    stopFirework(location) {

        if (location === "left" && this.leftFirework) {
            this.leftFirework.getEmittedParticleSystems()[0].emitRate = 0;
            this.leftFirework.getEmittedParticleSystems()[1].emitRate = 0;
        }

        if (location === "right" && this.rightFirework) {
            this.rightFirework.getEmittedParticleSystems()[0].emitRate = 0;
            this.rightFirework.getEmittedParticleSystems()[1].emitRate = 0;
        }
    }

    startLightSwitching() {
        if (this.flashlightInterval)
            clearInterval(this.flashlightInterval);
        // Interval
        this.flashlightInterval = setInterval(() => {
            this.toggleGreenRed();
        }, 500);
        this.toggleGreenRed();
    }

    /**
     * Toggles lighting from left to right and vice versa
     */
    toggleGreenRed() {
        if (this.flash3.intensity == 1) {
            this.switchOffGreen();
            this.switchOnRed();
        } else {
            this.switchOffRed();
            this.switchOnGreen();
        }
    }

    switchOnGreen() {
        this.flash3.intensity = 1;
        this.flash4.intensity = 1;
    }

    switchOffGreen() {
        this.flash3.intensity = 0;
        this.flash4.intensity = 0;
    }

    switchOnRed() {
        this.flash1.intensity = 1;
        this.flash2.intensity = 1;
    }

    switchOffRed() {
        this.flash1.intensity = 0;
        this.flash2.intensity = 0;
    }

    /**
     * Is called each beat by the pose detector. This is where all the score is calculated.
     * @param timestamp
     * @param action
     */
    actionDetected(poseDetectorResult, timestamp, actions, playerName) {
//        console.log("action: " + action + ", timestamp: " + timestamp);

        let points = 0;
        let correct = true;

        // exactly the required actions of the current mode have to be fulfilled, 
        // otherwise the move is considered incorrect
        let performedActions = poseDetectorResult.gestures.sort();
        let requiredActions = this.currentMode.actions.sort();
        
        console.log(poseDetectorResult.player, performedActions, requiredActions);

        // Check if all performed actions were correct
        if (performedActions.length === requiredActions.length) {
            for (let i = 0; i < performedActions.length; i++) {
                if (performedActions[i] !== requiredActions[i]) {
                    correct = false;
                    break;
                }
            }
        } else {
            correct = false;
        }

        // Check lighter if lighter action required
        if (requiredActions.length == 1 && requiredActions[0] == "light") {
            if (poseDetectorResult.isLighter) {
                performedActions = ["light"];
                correct = true;
            }
        }

        // Check streaks and increase/decrease score
        let playerObject = (poseDetectorResult.isPlayerOne() ? this.playerStats.player1 : this.playerStats.player2);
        if (correct) {
            points = 1;
            playerObject.bangNotification = "CORRECT";
            playerObject.hitsInARow++;

            // Check if streak is 5, 10 or 20
            if (playerObject.hitsInARow == 5 ||
                playerObject.hitsInARow == 10 ||
                playerObject.hitsInARow == 20) {
                playerObject.score += 10;
                playerObject.streakNotification = true;
            }

        } else {
            points = -1;
            playerObject.bangNotification = "INCORRECT";
            playerObject.hitsInARow = 0;
        }
        playerObject.score += points;

        // Show the performed action
        let actionLabel = (poseDetectorResult.isPlayerOne() ? this.playerOneActionLabel : this.playerTwoActionLabel);
        this.performedActionFading(actionLabel, performedActions);
    }

    performedActionFading(label, performedActions) {
        console.log(performedActions);
        var actionsLbls = [];
        for (var i = 0; i < performedActions.length; i++) {
            actionsLbls.push(this.modes[performedActions[i]].actionMsg);
        }

        let actionString = actionsLbls.join();

        let actionFadeAnimation = new BABYLON.Animation("actionFadeAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let keys = [];
        keys.push({
            frame: 0,
            value: 1
        });
        keys.push({
            frame: 5,
            value: 0.7
        });
        keys.push({
            frame: 10,
            value: 0.0
        });
        actionFadeAnimation.setKeys(keys);
        label.animations = [];
        label.animations.push(actionFadeAnimation);
        label.alpha = 1;
        label.text = actionString;
        this.scene.beginAnimation(label, 0, 10, false);
    }

    /**
     * Is triggered to start the game when the scene is loaded
     */
    onLoad() {
        this.playerStats.player1.score = this.startingScore;
        this.playerStats.player2.score = this.startingScore;
        // preload first song
        let songUrl = this.soundMachine.getRandomPart();
        let startSong = new BABYLON.Sound("current", songUrl, this.scene, null, {autoplay: false, loop: false});
        let startMode = this.modes["bang"];
        this.soundMachine.startCountIn(2, startMode, () => {
            this.soundMachine.songChain(startSong, startMode);
            this.leftActorVideo.play();
            this.rightActorVideo.play();
            this.poseDetector.start();
            this.playerStats.gameStartTime = new Date().getTime();
        }
        );

    }

    // YOU DIRTY CHEATER!
    /**
     * Just a test method, when + is pressed
     * @param score
     */
    setScore(score) {
        this.playerStats.player1.score = score;
        // this.playerStats.player2.score = score;
    }

    /**
     * Just a test method, when + is pressed
     * @param score
     */
    addToStreak(score) {
        this.playerStats.player1.hitsInARow += score;
    }

    /**
     * Does the eye flashing
     * @param player
     * @param corrrect
     */
    notifyBang(player, corrrect) {
        //console.log("Bang notification for player " + player + " is " + corrrect);
        let eye = player == 1 ? this.leftEye : this.rightEye;

        let color = corrrect ? new BABYLON.Color3(0.22, 0.73, 0.1) : new BABYLON.Color3(0.64, 0.17, 0.05);
        //eye.material.emissiveColor = color;

        var eyeAnimation = new BABYLON.Animation("eyeAnimation", "material.emissiveColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = [];

        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: color
        });

        //At the animation key 20, the value of scaling is "0.2"
        keys.push({
            frame: 10,
            value: new BABYLON.Color3(0, 0, 0)
        });

        eyeAnimation.setKeys(keys);
        eye.animations = [];
        eye.animations.push(eyeAnimation);

        this.scene.beginAnimation(eye, 0, 10, false);

    }

    /**
     * Is a check for switching scenes. Scene switching should only be done if scene is ready.
     * @returns {*}
     */
    isReady() {
        return (this.scene && this.scene.isReady());
    }

    render() {

        if (this.scene)
            this.scene.render();

        if (this.gameOver)
            return;

        this.updatePlayerScores();

        let onFinishAnimation = () => {
            this.soundMachine.clear();
            this.poseDetector.stop();
            // DON'T DELETE: delay scene disposal due to render issues
            setTimeout(() => {
                setNewScene(end);
            }, 0);
        };


        // game over
        if (this.playerStats.player1.score <= this.loseScore || this.playerStats.player2.score <= this.loseScore)
        {
            let msg = "";
            console.log("fool");
            if (this.playerStats.player1.score <= this.loseScore)
                msg += "Player 1 is a fool!! ";
            if (this.playerStats.player2.score <= this.loseScore)
                msg += "Player 2 is a fool!! ";
            end.playerOneScore = this.playerStats.player1.score;
            end.playerTwoScore = this.playerStats.player2.score;
            end.displayMessage = msg;
            end.rockstar = false;
            this.gameOver = true;
            this.showUserMessage(msg, BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM,
                    onFinishAnimation
                    );

//            this.soundMachine.shouts["gameOver"].play();

        }

        // start fire

        if (this.playerStats.player1.score >= this.fireWorkScore && !this.playerStats.player1.onFire) {
            this.playerStats.player1.onFire = true;
            this.startFirework("left");
            this.showUserMessage("Player 1 is on fire!");
        } else if (this.playerStats.player1.score < this.fireWorkScore) {
            this.stopFirework("left");
            this.playerStats.player1.onFire = false;
        }
        if (this.playerStats.player2.score >= this.fireWorkScore && !this.playerStats.player2.onFire) {
            this.playerStats.player2.onFire = true;
            this.startFirework("right");
            this.showUserMessage("Player 2 is on fire!");
        } else if (this.playerStats.player2.score < this.fireWorkScore) {
            this.stopFirework("right");
            this.playerStats.player2.onFire = false;
        }

        // Bang notification
        if (this.playerStats.player1.bangNotification != null) {
            this.notifyBang(1, this.playerStats.player1.bangNotification == "CORRECT");
            this.playerStats.player1.bangNotification = null;
        }
        if (this.playerStats.player2.bangNotification != null) {
            this.notifyBang(2, this.playerStats.player2.bangNotification == "CORRECT");
            this.playerStats.player2.bangNotification = null;
        }

        // Notifications about streaks
        if (this.playerStats.player1.streakNotification != null) {
            this.playerStats.player1.streakNotification = null;
            this.showUserMessage("Player 1 has a streak! " + this.playerStats.player1.hitsInARow + " Bangs!");
        }
        if (this.playerStats.player2.streakNotification != null) {
            this.playerStats.player2.streakNotification = null;
            this.showUserMessage("Player 2 has a streak! " + this.playerStats.player2.hitsInARow + " Bangs!");
        }

        // Check if a player has won
        if (!this.playerStats.wonNotificaiton && !this.playerStats.player1.won && !this.playerStats.player2.won) {
            if (this.playerStats.player1.score >= this.winScore) {
                this.playerStats.player1.won = true;
                if (this.playerStats.gameEndTime == null) {
                    this.playerStats.gameEndTime = new Date().getTime();
                }
            }
            if (this.playerStats.player2.score >= this.winScore) {
                this.playerStats.player2.won = true;

                if (this.playerStats.gameEndTime == null) {
                    this.playerStats.gameEndTime = new Date().getTime();
                }
            }
        }
        if (!this.playerStats.wonNotificaiton && (this.playerStats.player1.won || this.playerStats.player2.won)) {
            let displayMessage = "";
            if (this.playerStats.player1.won && !this.playerStats.player2.won) {
                displayMessage = "Player 1 is the ROCKSTAR!";
            } else if (!this.playerStats.player1.won && this.playerStats.player2.won) {
                displayMessage = "Player 2 is the ROCKSTAR!";
            } else {
                displayMessage = "DRAW! Both players are ROCKSTARS!";
            }
            this.showUserMessage(displayMessage, BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM, onFinishAnimation);
            end.playerOneScore = this.playerStats.player1.score;
            end.playerTwoScore = this.playerStats.player2.score;
            end.displayMessage = displayMessage;
            end.gameTime = (this.playerStats.gameEndTime - this.playerStats.gameStartTime);
            end.rockstar = true;
            this.playerStats.wonNotificaiton = true;

//            this.soundMachine.shouts["gameWon"].play();
        }


    }

    /**
     * Returns a next game mode from the available game modes, excluding the previous mode to prevent boring games.
     * @param previousMode
     * @returns {*}
     */
    getRandomMode(previousMode) {
        let modeKeys = Object.keys(this.modes);

        // Remove current mode from modeKeys, if the remaing list is not empty
        if (previousMode !== undefined && modeKeys.length > 1) {
            var modeIndex = modeKeys.indexOf(previousMode.key);
            if (modeIndex !== -1) {
                modeKeys.splice(modeIndex, 1);
            }
        }

        let randomKey = modeKeys[Math.floor(Math.random() * modeKeys.length)];
        return this.modes[randomKey];
    }

    /**
     * Cleanup which should be called when scene is dispatched
     */
    dispose() {
        clearInterval(this.flashlightInterval);
        this.soundMachine.clear();
        this.poseDetector.clear();
        this.scene.dispose();
    }

}
