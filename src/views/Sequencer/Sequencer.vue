<template>
    <div class="sequencer">
        <section class="sequencer-controls sequencer-play-controls">
            <el-input-number class="bpm" v-model="bpm" />
            <button class="tap is-disabled">
                <font-awesome-icon icon="clock" />
            </button>
            <button
                class="play no-highlight"
                :class="sequencerState == 'start' ? 'active' : ''"
                @click="startSequence"
            >
                <font-awesome-icon icon="play" />
            </button>
            <button
                class="stop no-highlight"
                :class="sequencerState == 'stop' ? 'active' : ''"
                @click="stopSequence"
            >
                <font-awesome-icon icon="stop" />
            </button>
        </section>
        <section class="sequencer-controls sequencer-storage-controls">
            <button class="storage store no-highlight" @click="storeSequence">
                <font-awesome-icon icon="save" />
            </button>
            <button
                class="storage restore no-highlight"
                @click="restoreSequence"
            >
                <font-awesome-icon icon="undo" />
            </button>
            <button class="storage import no-highlight">
                <font-awesome-icon icon="file-export" />
            </button>
        </section>
        <section class="sequencer-track-controls" :style="trackStyle">
            <div
                class="track"
                :class="trackClass(trackIndex)"
                v-for="trackIndex in tracks"
                :key="trackIndex"
            >
                <a class="track-point" @click="setActiveTrack(trackIndex)"
                    >T{{ trackIndex }}</a
                >
                <a class="settings" @click="toggleMute(trackIndex)">
                    <template v-if="isMuted(trackIndex)">
                        <font-awesome-icon icon="volume-up" />
                    </template>
                    <template v-else>
                        <font-awesome-icon icon="volume-mute" />
                    </template>
                </a>
            </div>
        </section>
        <section class="sequencer-menu">
            <Navbar />
        </section>
        <section class="sequencer-track-header">
            <header class="header">
                <h2>Track {{ activeTrack }}</h2>
            </header>
        </section>
        <section class="sequencer-tracks">
            <div
                class="sequencer-track"
                :class="trackIndex == activeTrack ? 'active' : ''"
                v-for="trackIndex in tracks"
                :key="trackIndex"
            >
                <Track
                    :trackIndex="trackIndex"
                    :muted="isMuted(trackIndex)"
                    :trackImport="trackImport(trackIndex)"
                    @exportTrack="exportTrack(trackIndex, $event)"
                />
            </div>
        </section>
    </div>
</template>

<script>
import { EventBus } from "@/utils/event-bus";

import Track from "@/views/Track/Track";
import Navbar from "@/components/Navbar/Navbar";

import "./Sequencer.scss";
import { mapGetters } from "vuex";

export default {
    name: "Sequencer",
    data() {
        return {
            activeTrack: 1,
            tracks: 4,
            trackMute: [],
            sequenceExport: {},
            sequenceImport: {},
        };
    },
    components: {
        Track,
        Navbar,
    },
    created() {},
    mounted() {
        EventBus.$on("midi.system.start", (val) => {
            console.log("midi.system.start", val);
            this.startSequence();
        });

        EventBus.$on("midi.system.stop", (val) => {
            console.log("midi.system.stop", val);
            this.stopSequence();
        });
    },
    computed: {
        ...mapGetters({
            sequencerState: "sequencerState",
        }),
        sequence: {
            get() {
                return this.$store.getters.sequence;
            },
            set(value) {
                this.$store.dispatch("storeSequence", value);
            },
        },
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
        toggleMute(trackIndex) {
            if (this.trackMute.includes(trackIndex)) {
                this.trackMute = this.trackMute.filter(
                    (id) => id != trackIndex
                );
            } else {
                this.trackMute.push(trackIndex);
            }
        },
        isMuted(trackIndex) {
            return this.trackMute.includes(trackIndex);
        },
        trackClass(trackIndex) {
            var classStr = "";
            if (trackIndex == this.activeTrack) {
                classStr += "active";
            }
            if (this.isMuted(trackIndex)) {
                classStr += " muted";
            }
            return classStr;
        },
        trackImport(trackIndex) {
            const track = this.sequenceImport[trackIndex];
            return track;
        },
        exportTrack(trackIndex, val) {
            this.sequenceExport[trackIndex] = val;
        },
        storeSequence() {
            console.log("store sequence");
            this.sequence = { ...this.sequenceExport };
        },
        restoreSequence() {
            console.log("restore sequence");
            this.sequenceImport = { ...this.sequence };
        },
    },
};
</script>
