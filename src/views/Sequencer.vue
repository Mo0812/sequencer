<template>
    <div class="sequencer">
        <h2>Sequencer</h2>
        <section class="controls">
            <input v-model="bpm" />
            <input
                :class="playState == 'start' ? 'active' : ''"
                type="button"
                value="Start Sequence"
                @click="startSequence"
            />
            <input
                :class="playState == 'stop' ? 'active' : ''"
                type="button"
                value="Stop Sequence"
                @click="stopSequence"
            />
        </section>
        <section class="pattern">
            <div
                v-for="i in 16"
                class="trigger"
                :class="isActive(i) ? 'active' : ''"
                :key="i"
                @click="setTrigger(i)"
            >
                {{ i }}
                <a class="settings" href="#" @click="showTriggerSettings(i)"
                    >Settings</a
                >
            </div>
        </section>
        <section class="trigger-settings">
            {{ currentTrigger }}
        </section>
    </div>
</template>

<script>
import * as Tone from "tone";

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
        currentTrigger() {
            return this.getActive(this.showTriggerIndex);
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

<style lang="scss">
.sequencer {
    .pattern {
        width: 500px;
        height: 500px;
        margin: 0 auto;
        display: grid;
        grid-template: repeat(4, 25%) / repeat(4, 25%);
        column-gap: 10px;
        row-gap: 10px;

        .trigger {
            cursor: pointer;

            background-color: #f0f0f0;
            padding: 10px;

            display: flex;
            justify-content: center;
            align-items: center;

            position: relative;

            &:hover {
                background-color: #e5e5e5;
            }

            &:active,
            &.active {
                background-color: #d5d5d5;
            }

            & > .settings {
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
}
</style>
