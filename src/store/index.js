import Vue from "vue";
import Vuex from "vuex";
import * as Tone from "tone";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        bpm: 90,
        sequencerState: "stop",
    },
    getters: {
        sequencerState: (state) => state.sequencerState,
        bpm: (state) => state.bpm,
    },
    mutations: {
        START_SEQUENCER: (state) => {
            Tone.Transport.start();
            state.sequencerState = "start";
        },
        STOP_SEQUENCER: (state) => {
            Tone.Transport.stop();
            state.sequencerState = "stop";
        },
        SET_BPM: (state, payload) => {
            Tone.Transport.bpm.value = payload;
            state.bpm = payload;
        },
    },
    actions: {},
    modules: {},
});
