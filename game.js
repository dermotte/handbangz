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

        this.scene;

        // Stats of the current game
        this.playerStats = {
            player1: {
                score: 0,
                hitsInARow: 0,
                onFire: false
            },
            player2: {
                score: 0,
                hitsInARow: 0,
                onFire: false
            }
        }
        this.winScore = 100;
        this.loseScore = 0;
        this.fireWorkScore = 80;
        this.lastHeadUp = new Date().getTime();
        this.startingScore = 50;
        this.gameOver = false;

        // sound
        this.soundMachine = new SoundMachine();
        // this.currentSong = null;

        let videoElement = document.getElementById('videostream');
        this.poseDetector = new PoseDetector(250, videoElement, 640, 360);
        this.poseDetector.loadPoseNet();

    }

    createScene() {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 3 * Math.PI / 8, 10, new BABYLON.Vector3(0, 5, 7), scene);
        // comment the scene to fix the camera
        camera.attachControl(canvas, true);

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
        }, {maxWidth: 256, maxHeight: 256});

        //var videoWallTexture = new BABYLON.VideoTexture("video", ["assets/videos/headbang_boy.mp4"], scene, true, true);
        //videoWallMaterial.diffuseTexture = videoWallTexture;
        //this.videoWall.material = videoWallMaterial;

        this.scene = scene;
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
    }

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
            if (onFinishAnimation) onFinishAnimation();
        });

    }

    setPlayerOneScore(score) {
        this.playerOneScoreLabel.text = "Player 1: " + score;
    }

    setPlayerTwoScore(score) {
        this.playerTwoScoreLabel.text = score + " : Player 2";
    }

    updatePlayerScores() {
        // console.log(this.playerOneScoreLabel);
        if (this.playerOneScoreLabel) this.playerOneScoreLabel.text = "Player 1: " + this.playerStats.player1.score;
        if (this.playerTwoScoreLabel) this.playerTwoScoreLabel.text = this.playerStats.player2.score + " : Player 2";
    }

    // input: "left", "right"
    startFirework(location) {

        console.log(location);

        if (location === "left") {
            if (!this.leftFirework) {
                this.leftFirework = this.fireworkHelper.createParticles(this.scene, {x: 7.5, y: 0, z: 4}, false, 3);
            } else {
                console.log("in here");
                console.log(this.leftFirework);
                this.leftFirework.getEmittedParticleSystems()[0].emitRate = 350;
                this.leftFirework.getEmittedParticleSystems()[1].emitRate = 350;
            }
        }
        else if (location === "right") {
            if (!this.rightFirework) {
                this.rightFirework = this.fireworkHelper.createParticles(this.scene, {x: -7.5, y: 0, z: 4}, false, 3);
            } else {
                this.rightFirework.getEmittedParticleSystems()[0].emitRate = 350;
                this.rightFirework.getEmittedParticleSystems()[1].emitRate = 350;
            }
        }
    }

    // input: "left", "right"
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
    }

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

    headUpTriggered() {
        let currentTime = new Date().getTime();
        let bangInterval = currentTime - this.lastHeadUp;
        console.log(bangInterval + "; last currentTime: " + this.lastHeadUp + "; currentTime: " + currentTime);

        if (bangInterval > 900 && bangInterval < 1100) {
            this.playerStats.player1.score += 1;
        }
        this.lastHeadUp = currentTime;

    }

    actionDetected(action) {
//        console.log("action: " + action);

        if (action != "FAIL") {
            this.playerStats.player1.score++;
        } else {
//            console.log("SHIT");
            this.playerStats.player1.score--;
        }

//        if (this.soundMachine.isOnBeat()) {
////            console.log("HIT");
//            this.setPlayerOneScore(++this.playerStats.player1.score);
//        } else {
////            console.log("SHIT");
//            this.setPlayerOneScore(--this.playerStats.player1.score);
//        }

    }

    onLoad() {
        this.playerStats.player1.score = this.startingScore;
        this.playerStats.player2.score = this.startingScore;
        // preload first song
        let songUrl = this.soundMachine.getRandomPart();
        let curSong = new BABYLON.Sound("current", songUrl, this.scene, null, {autoplay: false, loop: false});
        curSong.songUrl = songUrl;
        this.soundMachine.startCountIn(2, this.scene, () => {
                    this.soundMachine.songChain(curSong, this.scene);
                    this.leftActorVideo.play();
                    this.rightActorVideo.play();
            }
        );

    }

    // YOU DIRTY CHEATER!
    setScore(score) {
        this.playerStats.player1.score = score;
        // this.playerStats.player2.score = score;
    }

    isReady() {
        return (this.scene && this.scene.isReady());
    }

    render() {

        if (this.scene) this.scene.render();

        if (this.gameOver) return;

        this.updatePlayerScores();

        // game over
        if (this.playerStats.player1.score <= this.loseScore || this.playerStats.player2.score <= this.loseScore)
        {
            let msg = "";
            console.log("fool");
            if (this.playerStats.player1.score <= this.loseScore) msg += "Player 1 is a fool!! ";
            if (this.playerStats.player1.score <= this.loseScore) msg += "Player 2 is a fool!! ";
            this.gameOver = true;
            this.showUserMessage(msg, BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM,
                () => {
                    // DON'T DELETE: delay scene disposal due to render issues
                    setTimeout( () => {setNewScene(end);}, 0);
                }
            );

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
        } else if (this.playerStats.player2.score < this.fireWorkScore)  {
            this.stopFirework("right");
            this.playerStats.player2.onFire = false;
        }

    }

    dispose() {
        clearInterval(this.flashlightInterval);
        this.scene.dispose();
    }

}
