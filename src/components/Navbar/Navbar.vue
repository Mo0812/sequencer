<template>
    <div class="navbar">
        <ul class="navbar-items">
            <li>
                <el-tooltip
                    effect="dark"
                    :content="midiContent"
                    placement="bottom"
                >
                    <span :class="midiClass" class="custom-label">MIDI</span>
                </el-tooltip>
            </li>
            <li>
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="GitHub"
                    placement="bottom"
                >
                    <a
                        href="https://github.com/Mo0812/sequencer"
                        target="_blank"
                        ><font-awesome-icon :icon="['fab', 'github']" size="lg"
                    /></a>
                </el-tooltip>
            </li>
            <li>
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="Settings"
                    placement="bottom"
                >
                    <a href="#"><font-awesome-icon icon="cog" size="lg" /></a>
                </el-tooltip>
            </li>
            <li>
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="About"
                    placement="bottom-end"
                >
                    <a href="#" @click="aboutVisible = true">
                        <font-awesome-icon icon="question-circle" size="lg" />
                    </a>
                </el-tooltip>
            </li>
        </ul>
        <el-dialog :visible.sync="aboutVisible" width="75%">
            <Readme />
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { EventBus } from "@/utils/event-bus";

import Readme from "@/components/Readme/Readme";

import "./Navbar.scss";

export default {
    name: "Navbar",
    components: {
        Readme,
    },
    data() {
        return {
            aboutVisible: false,
            midiInput: null,
            midiClassAddition: "",
        };
    },
    computed: {
        ...mapGetters(["midiAccess"]),
        midiClass() {
            var classStr = "midi ";
            classStr += this.midiClassAddition + " ";
            classStr += this.midiAccess ? "" : "disabled";
            return classStr;
        },
        midiContent() {
            return this.midiAccess ? "MIDI enabled" : "MIDI disabled";
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
