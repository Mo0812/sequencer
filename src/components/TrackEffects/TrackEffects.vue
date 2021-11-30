<template>
    <div class="track-effects">
        <article class="effect distortion">
            <header>
                Distortion
                <el-switch v-model="effects.distortion.enabled"></el-switch>
            </header>
            <div class="controls">
                <div class="control">
                    <p class="label">Amount</p>
                    <div class="value">
                        <el-slider
                            v-model="effects.distortion.properties.distortion"
                            :min="0"
                            :max="100"
                        ></el-slider>
                    </div>
                </div>
            </div>
        </article>
        <article class="effect delay">
            <header>
                Delay
                <el-switch v-model="effects.delay.enabled"></el-switch>
            </header>
            <div class="controls">
                <div class="control">
                    <p class="label">Time</p>
                    <div class="value">
                        <el-slider
                            v-model="effects.delay.properties.delayTime"
                            :min="0"
                            :max="100"
                        ></el-slider>
                    </div>
                </div>
                <div class="control">
                    <p class="label">Feedback</p>
                    <div class="value">
                        <el-slider
                            v-model="effects.delay.properties.feedback"
                            :min="0"
                            :max="100"
                        ></el-slider>
                    </div>
                </div>
            </div>
        </article>
        <article class="effect reverb">
            <header>
                Reverb
                <el-switch v-model="effects.reverb.enabled"></el-switch>
            </header>
            <div class="controls">
                <div class="control">
                    <p class="label">Decay</p>
                    <div class="value">
                        <el-slider
                            v-model="effects.reverb.properties.decay"
                            :min="0"
                            :max="100"
                        ></el-slider>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import * as Tone from "tone";

import "./TrackEffects.scss";

export default {
    name: "TrackEffects",
    props: ["trackIndex"],
    data() {
        return {
            effects: {
                distortion: {
                    instance: null,
                    properties: {
                        distortion: 40,
                    },
                    enabled: false,
                },
                delay: {
                    instance: null,
                    properties: {
                        delayTime: 12,
                        feedback: 50,
                    },
                    enabled: false,
                },
                reverb: {
                    instance: null,
                    properties: {
                        decay: 1,
                    },
                    enabled: false,
                },
            },
        };
    },
    created() {
        this.initializeEffects();
    },
    computed: {
        synth() {
            return this.$store.getters.trackSynth(this.trackIndex);
        },
    },
    watch: {
        "effects.distortion.enabled": {
            handler(val) {
                this.emitEffectChange("distortion", val);
            },
        },
        "effects.distortion.properties": {
            handler(val) {
                console.log("setting distortion to: ", val);
                this.effects.distortion.instance.set({
                    distortion: val.distortion / 100,
                });
            },
            deep: true,
        },
        "effects.delay.enabled": {
            handler(val) {
                this.emitEffectChange("delay", val);
            },
        },
        "effects.delay.properties": {
            handler(val) {
                console.log("setting delay settings to: ", val);
                this.effects.delay.instance.set({
                    delayTime: val.delayTime / 100,
                    feedback: val.feedback / 100,
                });
            },
            deep: true,
        },
        "effects.reverb.enabled": {
            handler(val) {
                this.emitEffectChange("reverb", val);
            },
        },
        "effects.reverb.properties": {
            handler(val) {
                console.log("setting reverb to: ", val);
                this.effects.reverb.instance.set(val);
            },
            deep: true,
        },
    },
    methods: {
        initializeEffects() {
            this.effects.distortion.instance = new Tone.Distortion(
                this.effects.distortion.properties.distortion / 100
            ).toDestination();

            this.effects.delay.instance = new Tone.FeedbackDelay(
                this.effects.delay.properties.delayTime / 100,
                this.effects.delay.properties.feedback / 100
            ).toDestination();

            this.effects.reverb.instance = new Tone.Reverb(
                this.effects.reverb.properties.decay
            ).toDestination();
        },
        emitEffectChange(type, enabled) {
            if (enabled && this.synth && this.effects[type].instance) {
                this.synth.connect(this.effects[type].instance);
            } else {
                this.synth.disconnect(this.effects[type].instance);
            }
        },
    },
};
</script>
