<template>
    <div class="sequencer">
        <header class="header">
            <h2>Sequencer</h2>
        </header>
        <div class="main">
            <aside class="leftbar">
                <section class="sequence-controls">
                    <h3>Sequence controls</h3>
                    <div class="play-controls">
                        <el-input-number class="bpm" v-model="bpm" />
                        <el-button class="tap" :disabled="true">
                            <font-awesome-icon icon="clock" />
                        </el-button>
                        <el-button
                            class="play"
                            :class="playState == 'start' ? 'active' : ''"
                            @click="startSequence"
                        >
                            <font-awesome-icon icon="play" />
                        </el-button>
                        <el-button
                            class="stop"
                            :class="playState == 'stop' ? 'active' : ''"
                            @click="stopSequence"
                        >
                            <font-awesome-icon icon="stop" />
                        </el-button>
                    </div>
                </section>
                <section class="track-controls">
                    <h3>Track controls</h3>
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
                                            effects.distortion.properties
                                                .distortion
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
                                            effects.delay.properties.delayTime
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
                                            effects.delay.properties.feedback
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
                                            effects.reverb.properties.decay
                                        "
                                        :min="0"
                                        :max="100"
                                    ></el-slider>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </aside>
            <main class="main-part">
                <section class="pattern">
                    <div
                        v-for="i in 16"
                        class="trigger"
                        :class="
                            isActive(i) ? 'active' : isDetail(i) ? 'detail' : ''
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
            <aside class="rightbar">
                <section class="trigger-settings">
                    <template v-if="selectedDetailTrigger">
                        <article class="trigger-note">
                            <h3>
                                Trigger settings:
                                <u>Trigger {{ selectedDetailTrigger.index }}</u>
                            </h3>
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
                                <el-input-number
                                    class="note-height"
                                    v-model="selectedDetailTriggerNoteHeight"
                                    controls-position="right"
                                />
                            </div>
                        </article>
                    </template>
                </section>
            </aside>
        </div>
    </div>
</template>

<script>
import * as Tone from "tone";

import "./Sequencer.scss";

export default {
    name: "Sequencer",
    data() {
        return {
            bpm: 90,
            sequenceTrigger: [],
            sequence: null,
            playState: "stop",
            showTriggerIndex: null,
            synth: null,
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
                        delayTime: 12.5,
                        feedback: 50,
                    },
                    enabled: false,
                },
                reverb: {
                    instance: null,
                    properties: {
                        decay: 0,
                    },
                    enabled: false,
                },
            },
        };
    },
    created() {
        this.synth = new Tone.Synth().toDestination();

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
    computed: {
        parsedSequenceTrigger() {
            const sequence = [];
            for (var i = 0; i < 16; i++) {
                const currentTrigger = this.getActive(i);
                if (currentTrigger && currentTrigger.enabled) {
                    sequence.push({
                        time: "0:0:" + i,
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
    },
    watch: {
        bpm: {
            handler(val) {
                Tone.Transport.bpm.value = val;
            },
            immediate: true,
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
            Tone.Transport.start();
            this.playState = "start";
        },
        stopSequence() {
            this.sequence.clear();
            Tone.Transport.stop();
            this.playState = "stop";
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
    },
};
</script>
