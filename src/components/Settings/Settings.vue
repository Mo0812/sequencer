<template>
    <div class="settings">
        <el-form
            ref="settings-form"
            :model="settings"
            label-position="left"
            label-width="200px"
        >
            <strong>MIDI</strong>
            <el-form-item label="Enable MIDI support">
                <el-switch v-model="settings.enableMIDI"></el-switch>
            </el-form-item>
            <!--<el-form-item><strong>System</strong></el-form-item>
            <p><i>More to come...</i></p>
            -->

            <strong>Sequencer</strong>
            <el-form-item label="Default BPM">
                <el-input v-model="settings.defaultBPM"></el-input>
            </el-form-item>
            <!--<el-form-item><strong>System</strong></el-form-item>
            <p><i>More to come...</i></p>
            -->
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import "./Settings.scss";

export default {
    name: "Settings",
    computed: {
        ...mapGetters(["settings"]),
    },
    watch: {
        settings: {
            handler(val) {
                this.$store.commit("SET_SETTINGS", val);
            },
            deep: true,
        },
    },
};
</script>
