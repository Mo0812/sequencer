<template>
    <div class="synth-parameters">
        {{ synthOptions }}
        <article class="control-container">
            <div class="controls">
                <div class="control">
                    <el-slider :min="0" :max="100"></el-slider>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import "./SynthParameters.scss";

export default {
    name: "SynthParameters",
    props: ["model"],
    data() {
        return {
            currentSynthOptions: {},
            synths: {
                monoSynth: {
                    default: {
                        oscillator: {
                            type: "square",
                        },
                        envelope: {
                            attack: 0.1,
                        },
                    },
                },
                synth: {
                    default: {},
                },
            },
        };
    },
    computed: {
        synthOptions() {
            const currentModel = this.model;
            return this.synths[currentModel].default;
        },
    },
    watch: {
        synthOptions: {
            handler(val) {
                this.$emit("synthOptionChange", val);
            },
        },
    },
};
</script>
