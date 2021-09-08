<template>
    <div class="sequencer">
        <section class="sequencer-controls">
            <div class="play-controls">
                <el-input-number class="bpm" v-model="bpm" />
                <el-button class="tap" :disabled="true">
                    <font-awesome-icon icon="clock" />
                </el-button>
                <el-button
                    class="play"
                    :class="sequencerState == 'start' ? 'active' : ''"
                    @click="startSequence"
                >
                    <font-awesome-icon icon="play" />
                </el-button>
                <el-button
                    class="stop"
                    :class="sequencerState == 'stop' ? 'active' : ''"
                    @click="stopSequence"
                >
                    <font-awesome-icon icon="stop" />
                </el-button>
            </div>
        </section>
        <section class="sequencer-track-controls" :style="trackStyle">
            <div
                class="track"
                :class="trackIndex == activeTrack ? 'active' : ''"
                v-for="trackIndex in tracks"
                :key="trackIndex"
                @click="setActiveTrack(trackIndex)"
            >
                T{{ trackIndex }}
            </div>
        </section>
        <section class="sequencer-tracks">
            <div
                class="sequencer-track"
                :class="trackIndex == activeTrack ? 'active' : ''"
                v-for="trackIndex in tracks"
                :key="trackIndex"
            >
                <Track :trackIndex="trackIndex" />
            </div>
        </section>
    </div>
</template>

<script>
import Track from "@/views/Track/Track";

import "./Sequencer.scss";
import { mapGetters } from "vuex";

export default {
    name: "Sequencer",
    data() {
        return {
            activeTrack: 1,
            tracks: 4,
        };
    },
    components: {
        Track,
    },
    created() {},
    computed: {
        ...mapGetters({
            sequencerState: "sequencerState",
        }),
        bpm: {
            get() {
                return this.$store.getters.bpm;
            },
            set(value) {
                this.$store.dispatch("setBpm", value);
            },
        },
        trackStyle() {
            const rows = this.tracks / 4;
            return {
                height: `${125 * rows}px`,
                gridTemplate: `repeat(${rows}, 1fr) / repeat(4, 1fr)`,
            };
        },
    },
    watch: {},
    methods: {
        startSequence() {
            this.$store.dispatch("startSequencer");
        },
        stopSequence() {
            this.$store.dispatch("stopSequencer");
        },
        setActiveTrack(trackIndex) {
            this.activeTrack = trackIndex;
        },
    },
};
</script>
