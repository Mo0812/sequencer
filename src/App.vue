<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import midi from "./utils/midi";

export default {
    name: "App",
    computed: {
        ...mapGetters(["settings"]),
    },
    watch: {
        settings: {
            handler(val) {
                if (val.enableMIDI) {
                    // MIDI Part
                    midi.initMidiAccess();
                }
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>
