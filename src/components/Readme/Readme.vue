<template>
    <div class="readme">
        <div class="readme-content" v-html="renderMarkdown(readme)"></div>
        <div class="link">
            Visit project on GitHub:
            <a href="https://github.com/Mo0812/sequencer"
                >https://github.com/Mo0812/sequencer</a
            >
        </div>
    </div>
</template>

<script>
import marked from "marked";

import "./Readme.scss";

export default {
    name: "Readme",
    data() {
        return {
            readme: "",
        };
    },
    mounted() {
        this.fetchReadme();
    },
    methods: {
        renderMarkdown(text) {
            return marked(text);
        },
        async fetchReadme() {
            console.log("loading readme");
            const response = await fetch(
                "https://raw.githubusercontent.com/Mo0812/sequencer/main/README.md"
            );
            const markdown = await response.text();
            this.readme = markdown;
        },
    },
};
</script>
