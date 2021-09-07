<template>
    <div class="sequencer">
        <section class="sequence-controls">
            <h3>Sequence controls</h3>
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
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Track 1" name="track1">
                <Track trackIndex="1" />
            </el-tab-pane>
            <el-tab-pane label="Track 2" name="track2">
                <Track trackIndex="2" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import * as Tone from "tone";

import Track from "@/views/Track/Track";

import "./Sequencer.scss";
import { mapGetters } from "vuex";

export default {
    name: "Sequencer",
    data() {
        return {
            activeTab: "track1",
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
                this.$store.commit("SET_BPM", value);
            },
        },
    },
    watch: {},
    methods: {
        startSequence() {
            this.$store.commit("START_SEQUENCER");
        },
        stopSequence() {
            this.$store.commit("STOP_SEQUENCER");
        },
    },
};
</script>
