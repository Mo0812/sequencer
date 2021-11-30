<template>
    <div class="track">
        <div class="main">
            <aside class="leftbar">
                <section class="track-controls">
                    <h4>Track controls</h4>
                    <div class="track-control-selector-container">
                        <button
                            class="track-control-selector sound"
                            :class="
                                trackControlsActiveTab == 'sound'
                                    ? 'active'
                                    : ''
                            "
                            @click="setTrackControlSelection('sound')"
                        >
                            <font-awesome-icon icon="volume-up" />
                        </button>
                        <button
                            class="track-control-selector effects"
                            :class="
                                trackControlsActiveTab == 'effects'
                                    ? 'active'
                                    : ''
                            "
                            @click="setTrackControlSelection('effects')"
                        >
                            <font-awesome-icon icon="weight" />
                        </button>
                    </div>
                    <div class="track-control-element-container">
                        <div
                            class="track-control-element sound"
                            :class="
                                trackControlsActiveTab == 'sound'
                                    ? 'active'
                                    : ''
                            "
                        >
                            <article class="synth-control">
                                <header>Volume</header>
                                <el-slider
                                    v-model="volume"
                                    :min="0"
                                    :max="100"
                                ></el-slider>
                            </article>
                            <article class="synth-control">
                                <header>Synth model</header>
                                <el-select
                                    v-model="synthModel"
                                    class="synth-model"
                                >
                                    <el-option
                                        key="synth"
                                        value="synth"
                                        label="Synth"
                                        >Synth</el-option
                                    >
                                    <el-option
                                        key="monoSynth"
                                        value="monoSynth"
                                        label="Mono Synth"
                                        >Mono Synth</el-option
                                    >
                                    <el-option
                                        key="sampler"
                                        value="sampler"
                                        label="Sampler"
                                        >Sampler</el-option
                                    >
                                </el-select>
                            </article>
                            <article
                                v-if="synthModel == 'sampler'"
                                class="sample-control sample-management"
                            >
                                <div class="sample-used">
                                    <header>
                                        <span> Used Sample </span>
                                        <button
                                            class="sample-manager no-highlight"
                                            @click="sampleManagerVisible = true"
                                        >
                                            Sample Manager
                                        </button>
                                    </header>
                                    <el-input
                                        v-model="sample"
                                        class="sample-url"
                                    />
                                    <SampleWaveform
                                        :url="sample"
                                        :showControls="false"
                                    />
                                </div>
                            </article>
                            <article
                                v-if="synthModel != 'sampler'"
                                class="synth-control"
                            >
                                <SynthParameters
                                    :model="synthModel"
                                    @synthOptionChange="initializeSynth"
                                />
                            </article>
                        </div>
                        <div
                            class="track-control-element effects"
                            :class="
                                trackControlsActiveTab == 'effects'
                                    ? 'active'
                                    : ''
                            "
                        >
                            <TrackEffects :trackIndex="trackIndex" />
                        </div>
                    </div>
                </section>
                <section class="trigger-controls">
                    <template v-if="selectedDetailTrigger">
                        <article class="trigger-note">
                            <h4>
                                Trigger controls:
                                <u>Trigger {{ selectedDetailTrigger.index }}</u>
                            </h4>
                            <div class="note">
                                <el-select
                                    class="note-value"
                                    v-model="selectedDetailTriggerNoteValue"
                                >
                                    <el-option
                                        v-for="note in notes"
                                        :key="note"
                                        :value="note"
                                    >
                                        {{ note }}
                                    </el-option>
                                </el-select>
                                <el-input
                                    class="note-height"
                                    v-model="selectedDetailTriggerNoteHeight"
                                    controls-position="right"
                                />
                            </div>
                        </article>
                    </template>
                </section>
            </aside>
            <main class="main-part">
                <section class="pattern">
                    <div
                        v-for="i in 16"
                        class="trigger"
                        :class="
                            sequencerPosition == i
                                ? 'current-step'
                                : isActive(i)
                                ? 'active'
                                : isDetail(i)
                                ? 'detail'
                                : ''
                        "
                        :key="i"
                    >
                        <a class="trigger-point" @click="toggleTrigger(i)">{{
                            i
                        }}</a>
                        <a class="settings" @click="setTriggerSettings(i)"
                            ><font-awesome-icon icon="cog"
                        /></a>
                    </div>
                </section>
            </main>
            <aside class="rightbar"></aside>
        </div>

        <el-dialog
            title="Sample Manager"
            :visible.sync="sampleManagerVisible"
            width="75%"
        >
            <SampleManager @useSample="sample = $event" />
            <template slot="footer" class="dialog-footer">
                <el-button @click="sampleManagerVisible = false"
                    >Cancel</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script>
import * as Tone from "tone";

import { EventBus } from "@/utils/event-bus";
import SynthParameters from "@/components/SynthParameters/SynthParameters";
import TrackEffects from "@/components/TrackEffects/TrackEffects";
import SampleManager from "@/components/SampleManager/SampleManager";
import SampleWaveform from "@/components/SampleWaveform/SampleWaveform";

import "./Track.scss";
import { mapGetters } from "vuex";

export default {
    name: "Track",
    props: ["muted", "trackImport", "trigger", "trackIndex"],
    components: {
        SynthParameters,
        TrackEffects,
        SampleManager,
        SampleWaveform,
    },
    data() {
        return {
            sequenceTrigger: [],
            sequence: null,
            showTriggerIndex: null,
            synthModel: "sampler",
            synthLoading: false,
            sample: "https://tonejs.github.io/audio/berklee/gong_1.mp3",
            volume: 100,
            notes: [
                "C",
                "C#",
                "D",
                "D#",
                "E",
                "F",
                "F#",
                "G",
                "G#",
                "A",
                "A#",
                "B",
            ],
            effects: {},
            trackControlsActiveTab: "sound",
            sampleManagerVisible: false,
        };
    },
    created() {
        this.initializeSynth();
    },
    mounted() {
        EventBus.$on("midi.note.on", (val) => {
            console.log("midi.note.on", val);
            this.selectedDetailTriggerNote = val.noteValue;
        });
    },
    beforeUnmount() {
        EventBus.$off("midi.note.on");
    },
    computed: {
        ...mapGetters({
            playState: "sequencerState",
            sequencerPosition: "sequencerPosition",
        }),
        parsedSequenceTrigger() {
            const sequence = [];
            for (var i = 1; i <= 16; i++) {
                const currentTrigger = this.getActive(i);
                if (currentTrigger && currentTrigger.enabled) {
                    sequence.push({
                        time: "0:0:" + (i - 1),
                        note: currentTrigger.note,
                        duration: currentTrigger.duration,
                    });
                }
            }
            return sequence;
        },
        selectedDetailTrigger() {
            return this.getTrigger(this.showTriggerIndex);
        },
        selectedDetailTriggerNoteValue: {
            get() {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    const note = trigger.note;
                    const noteValue = note.substring(0, note.length - 1);
                    return noteValue;
                }
                return null;
            },
            set(newValue) {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    trigger.note =
                        newValue + "" + this.selectedDetailTriggerNoteHeight;
                }
            },
        },
        selectedDetailTriggerNoteHeight: {
            get() {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    const note = trigger.note;
                    const noteHeight = note.slice(-1);
                    return noteHeight;
                }
                return null;
            },
            set(newValue) {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    trigger.note =
                        this.selectedDetailTriggerNoteValue + "" + newValue;
                }
            },
        },
        selectedDetailTriggerNote: {
            get() {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    const note = trigger.note;
                    return note;
                }
                return null;
            },
            set(newValue) {
                const trigger = this.selectedDetailTrigger;
                if (trigger) {
                    trigger.note = newValue;
                }
            },
        },
        volumeInDb() {
            return this.calcVolumeInDb(this.volume);
        },
        trackExport() {
            return {
                sequenceTrigger: this.sequenceTrigger,
                // TODO: Export effects for track
            };
        },
        synth() {
            return this.$store.getters.trackSynth(this.trackIndex);
        },
    },
    watch: {
        playState: {
            handler(val) {
                if (val == "start") {
                    this.startSequence();
                } else {
                    this.stopSequence();
                }
            },
        },
        parsedSequenceTrigger: {
            handler(val, oldVal) {
                if (this.sequence) {
                    // Replace existing trigger
                    val.map((trigger) => {
                        if (this.sequence.at(trigger.time)) {
                            // Replace if changed
                            this.sequence.at(trigger.time, trigger);
                        }
                    });

                    // Detect and add new trigger
                    const newTrigger = val.find(
                        (item) =>
                            !oldVal.some((oldItem) => oldItem.time == item.time)
                    );
                    if (newTrigger) {
                        this.sequence.add(newTrigger.time, newTrigger);
                    }

                    // Detect and remove old trigger
                    const removedTrigger = oldVal.find(
                        (oldItem) =>
                            !val.some((item) => item.time == oldItem.time)
                    );
                    if (removedTrigger) {
                        this.sequence.remove(removedTrigger.time);
                    }
                }
            },
            deep: true,
        },
        synthModel: {
            handler(val, oldVal) {
                if (val !== oldVal) {
                    this.initializeSynth();
                }
            },
        },
        sample: {
            handler(val, oldVal) {
                if (val !== oldVal) {
                    this.initializeSynth();
                }
            },
        },
        volume: {
            handler(val) {
                this.synth.volume.value = this.calcVolumeInDb(val);
            },
        },
        muted: {
            handler(val) {
                if (val) {
                    this.synth.volume.value = -100;
                } else {
                    this.synth.volume.value = this.volumeInDb;
                }
            },
        },
        trackExport: {
            handler(val) {
                this.$emit("exportTrack", val);
            },
            deep: true,
        },
        trigger: {
            handler(val) {
                if (this.trackImport && this.trackImport.sequenceTrigger) {
                    console.log("trigger restore");
                    this.sequenceTrigger = [
                        ...this.trackImport.sequenceTrigger,
                    ];
                }
                // TODO: Apply stored effects on imported track
                /*if (this.trackImport && this.trackImport.effects) {
                    console.log("effect restore");
                    this.effects.distortion.enabled =
                        this.trackImport.effects.distortion.enabled;
                    this.effects.distortion.properties = {
                        ...this.trackImport.effects.distortion.properties,
                    };

                    this.effects.delay.enabled =
                        this.trackImport.effects.delay.enabled;
                    this.effects.delay.properties = {
                        ...this.trackImport.effects.delay.properties,
                    };

                    this.effects.reverb.enabled =
                        this.trackImport.effects.reverb.enabled;
                    this.effects.reverb.properties = {
                        ...this.trackImport.effects.reverb.properties,
                    };
                }*/
            },
        },
    },
    methods: {
        startSequence() {
            this.sequence = new Tone.Part(
                (time, value) => {
                    this.synth.triggerAttackRelease(
                        value.note,
                        value.duration,
                        time,
                        value.velocity
                    );
                },
                this.parsedSequenceTrigger
                /*[
                    { time: "0:0:0", note: "C4", duration: "8n" },
                    { time: "0:0:2", note: "A4", duration: "8n" },
                ]*/
            ).start(0);
            this.sequence.loop = true;
        },
        stopSequence() {
            this.sequence.clear();
        },
        createTrigger(i, enabled = true) {
            this.sequenceTrigger.push({
                index: i,
                note: "C4",
                duration: "16n",
                enabled: enabled,
            });
        },
        toggleTrigger(i) {
            let enabled = true;
            const currentTrigger = this.getTrigger(i);
            if (!currentTrigger) {
                this.createTrigger(i);
            } else {
                enabled = !currentTrigger.enabled;
                currentTrigger.enabled = !currentTrigger.enabled;
            }

            if (enabled) {
                this.showTriggerSettings(i);
            }
        },
        showTriggerSettings(i) {
            this.showTriggerIndex = i;
        },
        setTriggerSettings(i) {
            const existingTrigger = this.getTrigger(i);
            if (!existingTrigger) {
                this.createTrigger(i, false);
            }
            this.showTriggerSettings(i);
        },
        getTrigger(i) {
            return this.sequenceTrigger.find((item) => item.index == i);
        },
        getActive(i) {
            return this.sequenceTrigger.find(
                (item) => item.index == i && item.enabled
            );
        },
        isActive(i) {
            return this.getActive(i);
        },
        isDetail(i) {
            return this.showTriggerIndex == i;
        },
        calcVolumeInDb(volume) {
            return volume - 100;
        },
        setTrackControlSelection(key) {
            this.trackControlsActiveTab = key;
        },
        async initializeSynth(options = {}) {
            let synth = null;
            if (this.synthModel == "monoSynth") {
                synth = new Tone.MonoSynth(options).toDestination();
            } else if (this.synthModel == "sampler") {
                this.synthLoading = true;
                let sample = this.sample;
                if (typeof sample === "string") {
                    sample = {
                        urls: {
                            C4: sample.substring(sample.lastIndexOf("/") + 1),
                        },
                        baseUrl: sample.substring(
                            0,
                            sample.lastIndexOf("/") + 1
                        ),
                    };
                }
                synth = new Tone.Sampler(sample).toDestination();
                await Tone.loaded();
                this.synthLoading = false;
            } else {
                synth = new Tone.Synth().toDestination();
            }

            this.$store.commit("SET_TRACK_SYNTH", {
                id: this.trackIndex,
                synth: synth,
            });

            // TODO: Apply effects on current synth
        },
    },
};
</script>
