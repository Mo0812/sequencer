import Vue from "vue";
import Vuex from "vuex";
import * as Tone from "tone";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        bpm: 90,
        sequencerState: "stop",
        sequencerPosition: 0,
        sequencerPositionInterval: null,
        midi: {
            access: false,
        },
        packageVersion: process.env.PACKAGE_VERSION || "0",
        settings: {
            enableMIDI: true,
        },
    },
    getters: {
        sequencerState: (state) => state.sequencerState,
        sequencerPosition: (state) => state.sequencerPosition,
        bpm: (state) => state.bpm,
        midiAccess: (state) => state.midi.access,
        version: (state) => state.packageVersion,
        settings: (state) => state.settings,
    },
    mutations: {
        START_SEQUENCER: (state) => {
            state.sequencerState = "start";
        },
        STOP_SEQUENCER: (state) => {
            state.sequencerState = "stop";
        },
        SET_SEQUENCER_POSITION_INTERVAL: (state) => {
            const timeInterval = Math.round(((60 / state.bpm) * 1000) / 4);
            state.sequencerPositionInterval = setInterval(function () {
                const pos = Tone.Transport.position;
                const parts = pos.split(":");
                const calc = parseInt(parts[1]) * 4 + Math.ceil(parts[2]);
                if (calc != state.sequencerPosition) {
                    state.sequencerPosition = calc;
                }
            }, timeInterval);
        },
        RESET_SEQUENCER_POSITION_INTERVAL: (state) => {
            state.sequencerPositionInterval = null;
        },
        SET_BPM: (state, payload) => {
            state.bpm = payload;
        },
        SET_MIDI_ACCESS: (state, payload) => {
            state.midi.access = payload;
        },
        SET_SETTINGS: (state, payload) => {
            state.settings = payload;
        },
    },
    actions: {
        startSequencer: (context, payload) => {
            Tone.Transport.start();
            context.commit("START_SEQUENCER");
            context.commit("SET_SEQUENCER_POSITION_INTERVAL");
        },
        stopSequencer: (context, payload) => {
            Tone.Transport.stop();
            context.commit("STOP_SEQUENCER");
            context.commit("RESET_SEQUENCER_POSITION_INTERVAL");
        },
        setBpm: (context, payload) => {
            Tone.Transport.bpm.value = payload;
            context.commit("SET_BPM", payload);
            context.commit("RESET_SEQUENCER_POSITION_INTERVAL");
            context.commit("SET_SEQUENCER_POSITION_INTERVAL");
        },
    },
    modules: {},
});
