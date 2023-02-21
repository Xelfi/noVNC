export default class PCMPlayer {
    constructor() {
        this.option = {
            encoding: "16bitInt",
            channels: 1,
            sampleRate: 44100
        },
        this.samples = new Float32Array,
        this.maxValue = 32768,
        this.typedArray = Int16Array,
        this.audioCtx = new(window.AudioContext || window.webkitAudioContext),
        this.audioCtx.resume(),
        this.gainNode = this.audioCtx.createGain(),
        this.gainNode.gain.value = 1,
        this.gainNode.connect(this.audioCtx.destination),
        this.startTime = this.audioCtx.currentTime
    }

    feed (t) {
        //t = this.getFormatedValue(t);
        var e = new Float32Array(this.samples.length + t.length);
        
        if (e.set(this.samples, 0), e.set(t, this.samples.length), this.samples = e, this.samples.length) {
            
            var i,
                s,
                a,
                n,
                o,
                h = this.audioCtx.createBufferSource(),
                r = this.samples.length / this.option.channels,
                l = this.audioCtx.createBuffer(this.option.channels, r, this.option.sampleRate);
            
            /*for (s = 0; s < this.option.channels; s++) 
                for (n = 0, i = l.getChannelData(s), a = s, o = 50; n < r; n++) 
                    i[n] = this.samples[a],
                    a += this.option.channels;
            */
            l.copyToChannel(this.samples, 0);

            this.startTime < this.audioCtx.currentTime && (this.startTime = this.audioCtx.currentTime),
            h.buffer = l,
            h.connect(this.gainNode),
            h.start(this.startTime),
            this.startTime += l.duration,
            this.samples = new Float32Array
        }
    }

    getFormatedValue(t) {
        var e,
            t = new this.typedArray(t.buffer),
            i = new Float32Array(t.length);
        for (e = 0; e < t.length; e++) 
            i[e] = t[e] / this.maxValue;
        
        return i
    }

    volume(t) {
        this.gainNode.gain.value = t
    }

    destroy() {
        this.interval && clearInterval(this.interval),
        this.samples = null,
        this.audioCtx.close(),
        this.audioCtx = null
    }
}
