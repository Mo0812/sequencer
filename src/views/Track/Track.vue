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
                                <el-select v-model="synthModel">
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
                                </el-select>
                            </article>
                            <article class="synth-control">
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
                            <article class="effect distortion">
                                <header>
                                    Distortion
                                    <el-switch
                                        v-model="effects.distortion.enabled"
                                    ></el-switch>
                                </header>
                                <div class="controls">
                                    <div class="control">
                                        <p class="label">Amount</p>
                                        <div class="value">
                                            <el-slider
                                                v-model="
                                                    effects.distortion
                                                        .properties.distortion
                                                "
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
                                    <el-switch
                                        v-model="effects.delay.enabled"
                                    ></el-switch>
                                </header>
                                <div class="controls">
                                    <div class="control">
                                        <p class="label">Time</p>
                                        <div class="value">
                                            <el-slider
                                                v-model="
                                                    effects.delay.properties
                                                        .delayTime
                                                "
                                                :min="0"
                                                :max="100"
                                            ></el-slider>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <p class="label">Feedback</p>
                                        <div class="value">
                                            <el-slider
                                                v-model="
                                                    effects.delay.properties
                                                        .feedback
                                                "
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
                                    <el-switch
                                        v-model="effects.reverb.enabled"
                                    ></el-switch>
                                </header>
                                <div class="controls">
                                    <div class="control">
                                        <p class="label">Decay</p>
                                        <div class="value">
                                            <el-slider
                                                v-model="
                                                    effects.reverb.properties
                                                        .decay
                                                "
                                                :min="0"
                                                :max="100"
                                            ></el-slider>
                                        </div>
                                    </div>
                                </div>
                            </article>
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
    </div>
</template>

<script>
import * as Tone from "tone";

import { EventBus } from "@/utils/event-bus";
import SynthParameters from "@/components/SynthParameters/SynthParameters";

import "./Track.scss";
import { mapGetters } from "vuex";

export default {
    name: "Track",
    props: ["muted"],
    components: {
        SynthParameters,
    },
    data() {
        return {
            sequenceTrigger: [],
            sequence: null,
            showTriggerIndex: null,
            synth: null,
            synthModel: "synth",
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
            trackControlsActiveTab: "effects",
        };
    },
    created() {
        this.initializeEffects();
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
                effects: {
                    distortion: {
                        enabled: this.effects.distortion.enabled,
                        properties: this.effects.distortion.properties,
                    },
                    delay: {
                        enabled: this.effects.delay.enabled,
                        properties: this.effects.delay.properties,
                    },
                    reverb: {
                        enabled: this.effects.reverb.enabled,
                        properties: this.effects.reverb.properties,
                    },
                },
                sequenceTrigger: this.sequenceTrigger,
            };
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
        "effects.distortion.enabled": {
            handler(val) {
                if (val) {
                    this.synth.connect(this.effects.distortion.instance);
                } else {
                    this.synth.disconnect(this.effects.distortion.instance);
                }
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
                if (val) {
                    this.synth.connect(this.effects.delay.instance);
                } else {
                    this.synth.disconnect(this.effects.delay.instance);
                }
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
                if (val) {
                    this.synth.connect(this.effects.reverb.instance);
                } else {
                    this.synth.disconnect(this.effects.reverb.instance);
                }
            },
        },
        "effects.reverb.properties": {
            handler(val) {
                console.log("setting reverb to: ", val);
                this.effects.reverb.instance.set(val);
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
        initializeSynth(options = {}) {
            if (this.synthModel == "monoSynth") {
                this.synth = new Tone.MonoSynth(options).toDestination();
            } else {
                this.synth = new Tone.Synth().toDestination();
            }

            if (this.effects.distortion.enabled) {
                this.synth.connect(this.effects.distortion.instance);
            }
            if (this.effects.delay.enabled) {
                this.synth.connect(this.effects.delay.instance);
            }
            if (this.effects.reverb.enabled) {
                this.synth.connect(this.effects.reverb.instance);
            }
        },
    },
};
</script>
