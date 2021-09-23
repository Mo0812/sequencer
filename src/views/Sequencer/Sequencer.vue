<template>
    <div class="sequencer">
        <section class="sequencer-controls">
            <div class="play-controls">
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
            </div>
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
            <ul>
                <li>
                    <a
                        href="https://github.com/Mo0812/sequencer"
                        target="_blank"
                        >GitHub</a
                    >
                </li>
                <li><a href="#">Settings</a></li>
                <li>
                    <a href="#" @click="aboutVisible = true">About</a>
                </li>
            </ul>
        </section>
        <section class="sequencer-tracks">
            <div
                class="sequencer-track"
                :class="trackIndex == activeTrack ? 'active' : ''"
                v-for="trackIndex in tracks"
                :key="trackIndex"
            >
                <Track :trackIndex="trackIndex" :muted="isMuted(trackIndex)" />
            </div>
        </section>
        <el-dialog
            title="About"
            :visible.sync="aboutVisible"
            @open="fetchReadme"
        >
            <div class="readme" v-html="renderMarkdown(readme)"></div>
            <hr />
            <div>
                Visit project on GitHub:
                <a href="https://github.com/Mo0812/sequencer"
                    >https://github.com/Mo0812/sequencer</a
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import marked from "marked";

import Track from "@/views/Track/Track";

import "./Sequencer.scss";
import { mapGetters } from "vuex";

export default {
    name: "Sequencer",
    data() {
        return {
            activeTrack: 1,
            tracks: 4,
            trackMute: [],
            aboutVisible: false,
            readme: "",
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
        renderMarkdown(text) {
            return marked(text);
        },
        async fetchReadme() {
            console.log("loading readme");
            const response = await fetch(
                "https://raw.githubusercontent.com/Mo0812/sequencer/main/README.md"
            );
            const markdown = await response.text();
            this.readme = markdown;
        },
    },
};
</script>
