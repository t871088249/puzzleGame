

export default class AudioManager {

    constructor() {
        this.type = '';
        this.audios = {};
        this.status = true;
        this.audio = null;
    }
    register(key, audio, type = 0) {

        // type 0 音乐  音效

        if (key == undefined) {

            return false;
        }
        this.audios[key] = {
            audio: audio,
            type: type
        };
    }
    set_all_pause() {
        this.status = false;

        for (const key in this.audios) {
            if (Object.hasOwnProperty.call(this.audios, key)) {
                const audio = this.audios[key];
                audio.audio.pause()
            }
        }

    }
    resume_music() {
        this.status = true;
        this.audio.resume()
    }
    play(key, type, loop = false) {
        var audio = this.audios[key]
        if (!audio) {
            console.log('该音频不存在');
            return false;
        }
        if (!this.status) {
            return false;
        }

        if (audio.type == 0) {
            this.stopAll();
            this.audio = audio.audio;
            audio.audio.play()
        } else[
            audio.audio.play()
        ]


    }
    stop(key) {
        if (this.audios[key]) {
            this.audios[key].audio.stop();
        }
    }
    stopAll() {
        Array.from(this.audios).forEach(audio => {
            audio.audio.stop()
        });
    }
    pause(key) {
        if (this.audios[key]) {
            this.audios[key].audio.pause();
        }
    }
    resume(key) {
        if (this.audios[key]) {
            this.audios[key].audio.resume();
        }
    }

}