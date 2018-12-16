class SoundMachine {
    constructor() {
        this.tempo = 120;
        this.beattime = 60000/this.tempo;
        this.bartime = this.beattime * 4;
        this.tolerance = 200;

        this.songBaseUrl = "assets/music/songs/";
        this.songParts = {
            slow: ["Headbangz_song1.mp3", "Headbangz_song2.mp3", "Headbangz_song2a.mp3", "Headbangz_song2b.mp3"],
            fast: ["Headbangz_song1_toms.mp3"],
            silent: ["Headbangz_song1_drums.mp3", "Headbangz_song1_drums_bass.mp3", "Headbangz_song1_lighter.mp3"]
        };

        this.messages = {
            slow:  "Bang!!",
            fast: "Double Bang!!",
            silent: "Show me the light!!"
        }

        this.startTimestamp;
        this.curSong;
        this.countIn = null;
        this.beatInterval = null;
    }

    // type = "slow", "fast", "silent"
    getSpecificPart(type) {
        let songPart = this.songParts[""+type];
        return this.songBaseUrl + songPart[this.generateRandomInteger(songPart.length)];
    }


    getRandomPart() {
        let one = this.songParts.slow;
        let two = one.concat(this.songParts.fast);
        let three = two.concat(this.songParts.silent);
        return this.songBaseUrl + three[this.generateRandomInteger(three.length)];
    }

    generateRandomInteger(max_value) {
        return Math.floor(Math.random() * max_value);
    }

    getUserMessageForSong(song) {

        let ret = "";
        let songName = song.replace(this.songBaseUrl, "");
        // console.log(songName);
        Object.keys(this.songParts).forEach( (key) => {
            if (this.songParts[key].includes(songName)) {
                ret = this.messages[""+key];
                // console.log(ret);
            };

        });

        return ret;
    }

    playCountIn(number, scene, onComplete) {
        if (number == 0) {
            onComplete();
            return;
        };
        number--;
        this.countIn.onended = () => {
            this.playCountIn(number, scene, onComplete);
        };
        this.countIn.play();

    }
    startCountIn(number, scene, onComplete) {
        this.countIn = new BABYLON.Sound("current", "assets/music/fx/drumsticks.wav", scene, () => {this.playCountIn(number, scene, onComplete);}, {autoplay: false, loop: false});
    }


    songChain(curSong, scene) {
        if (!scene) return;

        // console.log("Song: ");
        // console.log(curSong);

        let songUrl = this.getRandomPart();
        let nextSong = new BABYLON.Sound("current", songUrl, scene, null, {autoplay: false, loop: false});
        nextSong.songUrl = songUrl;
        curSong.onended = () => {
            this.songChain(nextSong, scene);
        };

        curSong.play();
//        console.log("part duration: " + (new Date().getTime() - this.startTimestamp));
        this.startTimestamp = new Date().getTime();
//        console.log("Sound Beat: " + this.startTimestamp); // first beats
//        this.beatInterval = setInterval(() =>
//            {
//            let time = new Date().getTime() - this.startTimestamp;
//            console.log("Sound Beat: " + time);
//        }, this.beattime);
        this.curSong = curSong;
        if (game) {
            game.startLightSwitching();
            let curModes = game.switchModes(curSong.songUrl);
            let msg = curModes[0];
            for (let i=1; i< curModes.length; i++) msg += " & " + curModes[i];
            msg += "!!";
            game.showUserMessage(msg, BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_TOP);
            game.gameMode.text = msg;
        }
        // this.currentSong = new BABYLON.Sound("current", curSong, scene, null, {autoplay: true, loop: false});
        // let nextSong = this.getRandomPart();
        // this.currentSong.onended = () => {this.songChain(nextSong, scene);};

    }

    getCurrentTime() {
        return new Date().getTime() - this.startTimestamp;
    } 


    isOnBeat(time) {
        if (!this.curSong) {
            return false;
        }
        let timeOffset = time % this.beattime;
        return timeOffset <= this.tolerance / 2 || timeOffset >= this.beattime - this.tolerance / 2;
    }
    
    isOnBar(time) {
        if (!this.curSong) {
            return false;
        }
        let timeOffset = time % this.bartime;
        return timeOffset <= this.tolerance / 2 || timeOffset >= this.bartime - this.tolerance / 2;
    }

    clear(){
        clearInterval(this.beatInterval);
    }

    startLoop(scene) {
        // console.log(scene);
        // let songUrl = this.getRandomPart();
        // let curSong = new BABYLON.Sound("current", , scene, () => {this.songChain(curSong, scene);}, {autoplay: false, loop: false});
        // curSong.songUrl = songUrl;
    }

}
