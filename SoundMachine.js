class SoundMachine {
    constructor(scene) {
        this.scene = scene;
        this.tempo = 120;
        this.beattime = 60000/this.tempo;
        this.bartime = this.beattime * 4;
        this.tolerance = 200;

        this.songBaseUrl = "assets/music/songs/";
        this.songParts = {
//            slow: ["drumsticks.wav"],
//            slow: ["Headbangz_song1.mp3"],
//            fast: [],
//            silent: []
            slow: ["Headbangz_song1.mp3", "Headbangz_song2.mp3", "Headbangz_song2a.mp3", "Headbangz_song2b.mp3"],
            fast: ["Headbangz_song1_toms.mp3"],
            silent: ["Headbangz_song1_drums.mp3", "Headbangz_song1_drums_bass.mp3"],
            lighter: ["Headbangz_song1_lighter.mp3"]
        };
        
        this.shouts = {
            bang: new BABYLON.Sound("bangShout", "assets/music/shouts/bang.mp3", this.scene, null, {autoplay: false, loop: false}),
            horn: new BABYLON.Sound("bangShout", "assets/music/shouts/horn.mp3", this.scene, null, {autoplay: false, loop: false}),
            dHorn: new BABYLON.Sound("bangShout", "assets/music/shouts/dHorn.mp3", this.scene, null, {autoplay: false, loop: false}),
            light: new BABYLON.Sound("bangShout", "assets/music/shouts/light.mp3", this.scene, null, {autoplay: false, loop: false}),
            gameOver: new BABYLON.Sound("bangShout", "assets/music/shouts/fool.mp3", this.scene, null, {autoplay: false, loop: false, volume: 1.2}),
            gameWon: new BABYLON.Sound("bangShout", "assets/music/shouts/rockstar.mp3", this.scene, null, {autoplay: false, loop: false, volume: 1.2})
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

    getLighterPart() {
        return this.songBaseUrl + this.songParts["lighter"][this.generateRandomInteger(this.songParts["lighter"].length)];
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
     * @param onComplete
     */
    playCountIn(number, onComplete) {
        if (number == 0) {
            onComplete();
            return;
        };
        number--;
        this.countIn.onended = () => {
            this.playCountIn(number, onComplete);
        };
        this.countIn.play();

    }

    /**
     * Start the drumsticks intro before first song starts
     * @param number
     * @param scene
     * @param onComplete
     */
    startCountIn(number, startMode, onComplete) {
        this.countIn = new BABYLON.Sound("current", "assets/music/fx/drumsticks.wav", this.scene, () => {this.playCountIn(number, onComplete);}, {autoplay: false, loop: false});
        // note: drumsticks.wav is played number times (2)!
        setTimeout(() => {
            this.shouts[startMode.key].play();
        }, (number-1) * 2000);
    }

    /**
     * Changes the current song. The next one is already buffered so that it can be played without delay.
     * @param curSong
     * @param scene
     */
    songChain(curSong, curMode) {
        if (!this.scene) return;

        let nextMode = game.getRandomMode(curMode);

        // console.log("Song: ");
        // console.log(curSong);

        let nextSongUrl = this.getRandomPart();
        if (nextMode.key === "light") {
            nextSongUrl = this.getLighterPart();
        }
        let nextSong = new BABYLON.Sound("current", nextSongUrl, this.scene, null, {autoplay: false, loop: false});
           
        curSong.onended = () => {
            this.songChain(nextSong, nextMode);
        };
        
        curSong.onstarted = () => {
            console.log("SONG STARTED");
        }

        curSong.play();
        setTimeout(() => {
            this.shouts[nextMode.key].play();
        }, 14000);  // we know that each song part is 16 seconds (8 bars with 120 bpm) -> TODO make it better
        
        this.startTimestamp = new Date().getTime();

        this.curSong = curSong;        
        if (game) {
            game.currentMode = curMode;
            game.startLightSwitching();            
            let msg = curMode.msg;
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
