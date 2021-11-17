<template>
    <div class="sample-waveform">
        <div v-if="showControls" class="controls">
            <button class="control play" @click="previewSample()">
                <font-awesome-icon icon="play" />
            </button>
            <button class="control backward" @click="resetSample()">
                <font-awesome-icon icon="step-backward" />
            </button>
        </div>
        <div id="waveform" class="waveform" :ref="generatedId"></div>
    </div>
</template>

<script>
import shortid from "shortid";

import WaveSurfer from "wavesurfer.js";

import "./SampleWaveform.scss";

export default {
    name: "SampleWaveform",
    props: {
        url: {
            type: String,
        },
        showControls: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            wavesurfer: null,
            generatedId: shortid.generate(),
        };
    },
    mounted() {
        this.loadWavesurfer();
    },
    watch: {
        url: {
            handler() {
                this.loadWavesurfer();
            },
        },
    },
    methods: {
        loadWavesurfer() {
            this.$refs[this.generatedId].innerHTML = "";
            let wavesurfer = WaveSurfer.create({
                container: this.$refs[this.generatedId],
                waveColor: "rgb(120, 201, 177)",
                progressColor: "#46af8f",
                height: 64,
            });
            wavesurfer.load(this.url);
            wavesurfer.on("ready", () => {
                this.wavesurfer = wavesurfer;
            });
        },
        previewSample() {
            if (this.wavesurfer) {
                this.wavesurfer.playPause();
            }
        },
        resetSample() {
            if (this.wavesurfer) {
                this.wavesurfer.stop();
            }
        },
        /*previewSample(url) {
            const player = new Tone.Player(url).toDestination();
            Tone.loaded().then(() => {
                player.start();
            });
        },*/
    },
};
</script>
