<template>
    <div class="sequencer">
        <h2>Sequencer</h2>
        <input v-model="bpm" />
        <input type="button" value="Start Sequence" @click="sequence" />
        <input type="button" value="Stop Sequence" @click="stopSequence" />
        <section class="pattern">
            <div
                v-for="i in 16"
                class="trigger"
                :class="isActive(i) ? 'active' : ''"
                :key="i"
                @click="setTrigger(i)"
            >
                {{ i }}
            </div>
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
        };
    },
    computed: {
        parsedSequenceTrigger() {
            const sequence = [];
            for (var i = 0; i < 16; i++) {
                if (this.isActive(i)) {
                    sequence.push({
                        time: "0:0:" + i,
                        note: "C4",
                        duration: "16n",
                    });
                }
            }
            return sequence;
        },
    },
    watch: {
        bpm: {
            handler(val) {
                Tone.Transport.bpm.value = val;
            },
            immediate: true,
        },
    },
    methods: {
        sequence() {
            const synth = new Tone.Synth().toDestination();
            const seq = new Tone.Part(
                (time, value) => {
                    console.log(time, value);
                    synth.triggerAttackRelease(
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
            seq.loop = true;
            Tone.Transport.start();
        },
        stopSequence() {
            Tone.Transport.stop();
        },
        setTrigger(i) {
            const currentTrigger = this.sequenceTrigger.find(
                (item) => item.index == i
            );
            if (!currentTrigger) {
                this.sequenceTrigger.push({ index: i });
            } else {
                this.sequenceTrigger = this.sequenceTrigger.filter(
                    (item) => item.index != i
                );
            }
        },
        isActive(i) {
            return this.sequenceTrigger.find((item) => item.index == i);
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

            &:hover {
                background-color: #e5e5e5;
            }

            &:active,
            &.active {
                background-color: #d5d5d5;
            }
        }
    }
}
</style>
