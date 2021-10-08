<template>
    <div class="settings">
        <el-form ref="settings-form" :model="settings">
            <el-form-item>
                <strong>MIDI</strong>
            </el-form-item>
            <el-form-item label="Enable MIDI support">
                <el-switch v-model="settings.enableMIDI"></el-switch>
            </el-form-item>
            <el-form-item><strong>System</strong></el-form-item>
            <el-form-item label="Store settings persistently">
                <el-switch v-model="settings.storePersistently"></el-switch>
            </el-form-item>
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
