import { EventBus } from "@/utils/event-bus";
import store from "../store";

function transformMIDINoteValue(midiNoteNumber) {
    // See https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
    const midiNoteDict = {
        49: "C#3",
        50: "D3",
        51: "D#3",
        52: "E3",
        53: "F3",
        54: "F#3",
        55: "G3",
        56: "G#3",
        57: "A3",
        58: "A#3",
        59: "B3",
        60: "C4",
        61: "C#4",
        62: "D4",
        63: "D#4",
        64: "E4",
        65: "F4",
        66: "F#4",
        67: "G4",
        68: "G#4",
        69: "A4",
        70: "A#4",
        71: "B4",
    };
    return midiNoteDict[midiNoteNumber];
}

function checkMidiAccess() {
    if (navigator.requestMIDIAccess) {
        const midiAccess = navigator.requestMIDIAccess();
        if (midiAccess) {
            console.log("MIDI Support");
            return true;
        }
    }
    console.log("No MIDI Support");
    return false;
}

function initMidiAccess() {
    if (checkMidiAccess()) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
        store.commit("SET_MIDI_ACCESS", true);
        return;
    }
    store.commit("SET_MIDI_ACCESS", false);
}

function onMIDISuccess(midiAccess) {
    console.log("MIDIAccess", midiAccess);

    const inputs = midiAccess.inputs;
    const outputs = midiAccess.outputs;

    for (var input of inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    console.log("No MIDI Support");
}

function getMIDIMessage(midiMessage) {
    var command = midiMessage.data[0];
    var note = midiMessage.data[1];
    var velocity = midiMessage.data.length > 2 ? midiMessage.data[2] : 0;

    // Sort out clock
    if (command !== 248) {
        const data = {
            command,
            note,
            velocity,
        };
        console.log(command, note, velocity);

        EventBus.$emit("midi.input", data);

        // Note on command, depending on channel between 144-159 https://computermusicresource.com/MIDI.Commands.html
        if (command >= 144 && command <= 159) {
            data.noteValue = transformMIDINoteValue(note);
            EventBus.$emit("midi.note.on", data);
        }

        // Note of command, depending on channel between 144-159 https://computermusicresource.com/MIDI.Commands.html
        if (command >= 128 && command <= 143) {
            data.noteValue = transformMIDINoteValue(note);
            EventBus.$emit("midi.note.off", data);
        }

        // Sequencer start, see https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
        if (command == 250) {
            EventBus.$emit("midi.system.start");
        }

        // Sequencer pause
        if (command == 251) {
            EventBus.$emit("midi.system.resume");
        }

        // Sequencer stop
        if (command == 252) {
            EventBus.$emit("midi.system.stop");
        }
    }
}

export default {
    checkMidiAccess,
    initMidiAccess,
};
