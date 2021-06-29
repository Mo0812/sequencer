<template>
    <div class="sequencer">
        <h2>Sequencer</h2>
        <input type="button" value="Start Sequence" @click="sequence" />
        <section class="pattern">
            <div v-for="i in 16" class="trigger" :key="i" @click="playTone(i)">
                {{ i }}
            </div>
        </section>
    </div>
</template>

<script>
import * as Tone from "tone";

export default {
    name: "Sequencer",
    methods: {
        playTone(triggerIndex) {
            //create a synth and connect it to the main output (your speakers)
            const synth = new Tone.Synth().toDestination();

            //play a middle 'C' for the duration of an 8th note
            synth.triggerAttackRelease("C4", "8n");
        },
        sequence() {
            // create two monophonic synths
            const synthA = new Tone.FMSynth().toDestination();
            const synthB = new Tone.AMSynth().toDestination();
            //play a note every quarter-note
            const loopA = new Tone.Loop((time) => {
                synthA.triggerAttackRelease("C2", "8n", time);
            }, "4n").start(0);
            //play another note every off quarter-note, by starting it "8n"
            const loopB = new Tone.Loop((time) => {
                synthB.triggerAttackRelease("C4", "8n", time);
            }, "4n").start("8n");
            // the loops start when the Transport is started
            Tone.Transport.start();
            // ramp up to 800 bpm over 10 seconds
            // Tone.Transport.bpm.rampTo(800, 10);
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

            &:active {
                background-color: #d5d5d5;
            }
        }
    }
}
</style>
