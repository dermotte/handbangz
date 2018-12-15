class SoundMachine {
    constructor() {
        this.songBaseUrl = "assets/music/songs/";
        this.songParts = {
            slow: ["Headbangz_song1.mp3", "Headbangz_song2.mp3", "Headbangz_song2a.mp3", "Headbangz_song2b.mp3"],
            fast: ["Headbangz_song1_toms.mp3"],
            silent: ["Headbangz_song1_drums.mp3", "Headbangz_song1_drums_bass.mp3", "Headbangz_song1_lighter.mp3"]
        };

        this.countIn = null;
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

        console.log("Song: ");
        console.log(curSong);

        let nextSong = new BABYLON.Sound("current", this.getRandomPart(), scene, null, {autoplay: false, loop: false});
        curSong.onended = () => {
            this.songChain(nextSong, scene);
        };
        curSong.play();
        // this.currentSong = new BABYLON.Sound("current", curSong, scene, null, {autoplay: true, loop: false});
        // let nextSong = this.getRandomPart();
        // this.currentSong.onended = () => {this.songChain(nextSong, scene);};

    }

    startLoop(scene) {
        // console.log(scene);
        // let curSong = new BABYLON.Sound("current", this.getRandomPart(), scene, () => {this.songChain(curSong, scene);}, {autoplay: false, loop: false});
    }

}
