class SoundMachine {
    constructor() {
        this.tempo = 120;
        this.beattime = 60000/this.tempo;
        this.bartime = this.beattime * 4;
        this.tolerance = 200;

        this.songBaseUrl = "assets/music/songs/";
        this.songParts = {
//            slow: ["drumsticks.wav"],
            slow: ["Headbangz_song1.mp3"],
            fast: [],
            silent: []
//            slow: ["Headbangz_song1.mp3", "Headbangz_song2.mp3", "Headbangz_song2a.mp3", "Headbangz_song2b.mp3"],
//            fast: ["Headbangz_song1_toms.mp3"],
//            silent: ["Headbangz_song1_drums.mp3", "Headbangz_song1_drums_bass.mp3", "Headbangz_song1_lighter.mp3"]
        };

        this.startTimestamp;
        this.curSong;
        this.countIn = null;
    }

    /**
     * Get a random song part from "slow", "fast" or "silent".
     * @param type "slow", "fast" or "silent"
     * @returns {string}
     */
    getSpecificPart(type) {
        let songPart = this.songParts[""+type];
        return this.songBaseUrl + songPart[this.generateRandomInteger(songPart.length)];
    }

    /**
     * Get a random song part out of all song parts.
     * @returns {string}
     */
    getRandomPart() {
        var allSongs = this.songParts.slow;
        allSongs = allSongs.concat(this.songParts.fast);
        allSongs = allSongs.concat(this.songParts.silent);
        return this.songBaseUrl + allSongs[this.generateRandomInteger(allSongs.length)];
    }

    generateRandomInteger(max_value) {
        return Math.floor(Math.random() * max_value);
    }

    /**
     * Plays the count in file (drumsticks before music starts) <code>number</code> times.
     *
     * Playing it once means 4 beats -- 1 bar.
     *
     * @param number
     * @param scene
     * @param onComplete
     */
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

    /**
     * Start the drumsticks intro before first song starts
     * @param number
     * @param scene
     * @param onComplete
     */
    startCountIn(number, scene, onComplete) {
        this.countIn = new BABYLON.Sound("current", "assets/music/fx/drumsticks.wav", scene, () => {this.playCountIn(number, scene, onComplete);}, {autoplay: false, loop: false});
    }

    /**
     * Changes the current song. The next one is already buffered so that it can be played without delay.
     * @param curSong
     * @param scene
     */
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
        
        curSong.onstarted = () => {
            console.log("SONG STARTED");
        }

        curSong.play();
        
        this.startTimestamp = new Date().getTime();

        this.curSong = curSong;
        if (game) {
            game.startLightSwitching();
            let curModes = game.switchModes(curSong.songUrl);
            let msg = curModes[0];
            for (let i=1; i< curModes.length; i++) msg += " & " + curModes[i];
            msg += "!!";
            game.showUserMessage(msg, BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_TOP);
            if (game.isReady()) game.gameMode.text = msg;
        }

    }

    /**
     * Get time since start
     * @returns {number}
     */
    getCurrentTime() {
        return new Date().getTime() - this.startTimestamp;
    }

    /**
     * Checks if the given timestamp is on a beat +-tolerance.
     * @param time
     * @returns {boolean}
     */
    isOnBeat(time) {
        if (!this.curSong) {
            return false;
        }
        let timeOffset = time % this.beattime;
        return timeOffset <= this.tolerance / 2 || timeOffset >= this.beattime - this.tolerance / 2;
    }

    /**
     * Checks if the given timestamp is on a bar +-tolerance
     *
     * Unused!!
     *
     * @param time
     * @returns {boolean}
     */
    isOnBar(time) {
        if (!this.curSong) {
            return false;
        }
        let timeOffset = time % this.bartime;
        return timeOffset <= this.tolerance / 2 || timeOffset >= this.bartime - this.tolerance / 2;
    }

    clear(){
    }

}
