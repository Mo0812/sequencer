<template>
    <div class="navbar">
        <ul class="navbar-items">
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
        };
    },
};
</script>
