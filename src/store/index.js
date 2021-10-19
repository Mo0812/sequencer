import Vue from "vue";
import Vuex from "vuex";
import * as Tone from "tone";
import VuexPersistence from "vuex-persist";
import shortid from "shortid";
import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    colors,
    animals,
} from "unique-names-generator";

Vue.use(Vuex);

const vuexPersist = new VuexPersistence({
    key: "sequencer",
    storage: localStorage,
    reducer: (state) => ({
        settings: state.settings,
        currentSequence: state.currentSequence,
        storedSequences: state.storedSequences,
    }),
});

const store = new Vuex.Store({
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
        currentSequence: {},
        storedSequences: [],
    },
    getters: {
        sequencerState: (state) => state.sequencerState,
        sequencerPosition: (state) => state.sequencerPosition,
        bpm: (state) => state.bpm,
        midiAccess: (state) => state.midi.access,
        version: (state) => state.packageVersion,
        settings: (state) => state.settings,
        sequence: (state) => state.currentSequence,
        storedSequences: (state) => state.storedSequences,
        storedSequenceById: (state) => (id) => {
            return state.storedSequences.find((seq) => seq.id == id);
        },
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
        STORE_CURRENT_SEQUENCE: (state, payload) => {
            state.currentSequence = payload;
        },
        ADD_STORED_SEQUENCE: (state, payload) => {
            state.storedSequences.push(payload);
        },
        REMOVE_STORED_SEQUENCE: (state, payload) => {
            state.storedSequences = state.storedSequences.filter(
                (seq) => seq.id !== payload.id
            );
        },
        RENAME_STORED_SEQUENCE: (state, payload) => {
            const seq = state.storedSequences.find(
                (seq) => seq.id == payload.id
            );
            seq.name = payload.name;
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
        storeSequence: (context, payload) => {
            context.commit("STORE_CURRENT_SEQUENCE", payload);
        },
        storeSequenceInStoredSequences: (context, payload) => {
            if (payload.selectedSequence) {
                // TODO: Override
                context.commit(
                    "REMOVE_STORED_SEQUENCE",
                    payload.selectedSequence
                );
            }
            // TODO: Save initially
            const date = payload.date ?? Date.now();
            const name =
                payload.name ??
                uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    separator: "-",
                });
            const sequence = payload.sequence ?? {
                ...context.getters.sequence,
            };
            context.commit("ADD_STORED_SEQUENCE", {
                date: date,
                name: name,
                id: shortid.generate(),
                sequence: sequence,
            });
        },
        removeStoredSequenceById: (context, payload) => {
            context.commit("REMOVE_STORED_SEQUENCE", { id: payload });
        },
        duplicateStoredSequenceById: (context, payload) => {
            const duplicate = {
                ...context.getters.storedSequenceById(payload),
            };
            if (duplicate) {
                context.commit("ADD_STORED_SEQUENCE", {
                    date: Date.now(),
                    name: duplicate.name + " (duplicate)",
                    id: shortid.generate(),
                    sequence: duplicate.sequence,
                });
            }
        },
        renameStoredSequenceById: (context, payload) => {
            context.commit("RENAME_STORED_SEQUENCE", payload);
        },
    },
    modules: {},
    plugins: [vuexPersist.plugin],
});

export default store;
