<template>
    <div class="sequencer">
        <header class="header">
            <h2>Sequencer</h2>
        </header>
        <section class="controls">
            <div class="play-controls">
                <input class="bpm" v-model="bpm" />
                <div
                    class="play"
                    :class="playState == 'start' ? 'active' : ''"
                    @click="startSequence"
                >
                    <font-awesome-icon icon="play" />
                </div>
                <div
                    class="stop"
                    :class="playState == 'stop' ? 'active' : ''"
                    @click="stopSequence"
                >
                    <font-awesome-icon icon="stop" />
                </div>
            </div>
        </section>
        <section class="pattern">
            <div
                v-for="i in 16"
                class="trigger"
                :class="isActive(i) ? 'active' : ''"
                :key="i"
            >
                <a class="trigger-point" @click="setTrigger(i)">{{ i }}</a>
                <a
                    class="settings"
                    v-if="isActive(i)"
                    @click="showTriggerSettings(i)"
                    ><font-awesome-icon icon="cog"
                /></a>
            </div>
        </section>
        <section class="trigger-settings">
            <template v-if="selectedActiveTrigger">
                <h5>Trigger {{ selectedActiveTrigger.index }}</h5>
                <select v-model="selectedActiveNoteValue">
                    <option v-for="note in notes" :key="note" :value="note">
                        {{ note }}
                    </option>
                </select>
                <input type="number" v-model="selectedActiveNoteHeight" />
            </template>
        </section>
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
        };
    },
    created() {
        this.synth = new Tone.Synth().toDestination();
    },
    computed: {
        parsedSequenceTrigger() {
            const sequence = [];
            for (var i = 0; i < 16; i++) {
                const currentTrigger = this.getActive(i);
                if (currentTrigger) {
                    sequence.push({
                        time: "0:0:" + i,
                        note: currentTrigger.note,
                        duration: currentTrigger.duration,
                    });
                }
            }
            return sequence;
        },
        selectedActiveTrigger() {
            return this.getActive(this.showTriggerIndex);
        },
        selectedActiveNoteValue: {
            get() {
                const trigger = this.selectedActiveTrigger;
                if (trigger) {
                    const note = trigger.note;
                    const noteValue = note.substring(0, note.length - 1);
                    return noteValue;
                }
                return null;
            },
            set(newValue) {
                const trigger = this.selectedActiveTrigger;
                if (trigger) {
                    trigger.note =
                        newValue + "" + this.selectedActiveNoteHeight;
                }
            },
        },
        selectedActiveNoteHeight: {
            get() {
                const trigger = this.selectedActiveTrigger;
                if (trigger) {
                    const note = trigger.note;
                    const noteHeight = note.slice(-1);
                    return noteHeight;
                }
                return null;
            },
            set(newValue) {
                const trigger = this.selectedActiveTrigger;
                if (trigger) {
                    trigger.note = this.selectedActiveNoteValue + "" + newValue;
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
        setTrigger(i) {
            const currentTrigger = this.sequenceTrigger.find(
                (item) => item.index == i
            );
            if (!currentTrigger) {
                this.sequenceTrigger.push({
                    index: i,
                    note: "C4",
                    duration: "16n",
                });
            } else {
                this.sequenceTrigger = this.sequenceTrigger.filter(
                    (item) => item.index != i
                );
            }
        },
        showTriggerSettings(i) {
            this.showTriggerIndex = i;
        },
        getActive(i) {
            return this.sequenceTrigger.find((item) => item.index == i);
        },
        isActive(i) {
            return this.getActive(i);
        },
    },
};
</script>
