<template>
    <div class="settings">
        <el-form ref="settings-form" :model="settings">
            <el-form-item label="Enable MIDI">
                <el-switch v-model="settings.enableMIDI"></el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
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
