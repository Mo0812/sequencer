<template>
    <div class="navbar">
        <ul class="navbar-items">
            <li>
                <span class="custom-label">{{ version }}</span>
            </li>
            <li>
                <MIDIIndicator />
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
                    <a href="#" @click="settingsVisible = true"
                        ><font-awesome-icon icon="cog" size="lg"
                    /></a>
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
        <el-dialog
            class="readme-dialog"
            title="sequencer"
            :visible.sync="aboutVisible"
            width="75%"
        >
            <Readme />
        </el-dialog>

        <el-dialog
            class="settings-dialog"
            title="Settings"
            :visible.sync="settingsVisible"
            width="75%"
        >
            <Settings />
        </el-dialog>
    </div>
</template>

<script>
import Readme from "@/components/Readme/Readme";
import Settings from "@/components/Settings/Settings";
import MIDIIndicator from "@/components/MIDIIndicator/MIDIIndicator";

import "./Navbar.scss";
import { mapGetters } from "vuex";

export default {
    name: "Navbar",
    components: {
        Readme,
        Settings,
        MIDIIndicator,
    },
    data() {
        return {
            aboutVisible: false,
            settingsVisible: false,
        };
    },
    computed: {
        ...mapGetters(["version"]),
    },
};
</script>
