<template>
    <div class="midi-indicator">
        <template v-if="settings.enableMIDI">
            <el-tooltip effect="dark" :content="midiContent" placement="bottom">
                <span :class="midiClass" class="custom-label">MIDI</span>
            </el-tooltip>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { EventBus } from "@/utils/event-bus";

export default {
    name: "MIDIIndicator",
    data() {
        return {
            midiInput: null,
            midiClassAddition: "",
        };
    },
    computed: {
        ...mapGetters(["midiAccess", "settings"]),
        midiClass() {
            var classStr = "midi ";
            classStr += this.midiClassAddition + " ";
            classStr += this.midiAccess ? "" : "disabled";
            return classStr;
        },
        midiContent() {
            return this.midiAccess ? "MIDI enabled" : "No MIDI support";
        },
    },
    mounted() {
        EventBus.$on("midi.input", (val) => {
            this.midiInput = val;
        });
    },
    beforeUnmount() {
        EventBus.$off("midi.input");
    },
    watch: {
        midiInput: {
            handler(val) {
                setTimeout(() => {
                    this.midiClassAddition = "highlight";
                }, 100);
            },
        },
    },
};
</script>
