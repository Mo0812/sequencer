<template>
    <div class="sample-manager">
        <h3>Stored Samples</h3>
        <header></header>
        <main>
            <el-table
                class="stored-samples"
                ref="storedSamples"
                stripe
                :data="storedSamples"
                :default-sort="{ prop: 'name', order: 'asc' }"
            >
                <el-table-column prop="preview" label="">
                    <template slot-scope="scope">
                        <button @click="previewSample(scope.row.url)">
                            <font-awesome-icon icon="play" />
                        </button>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="Name" sortable>
                    <template slot-scope="scope">
                        <el-input
                            placeholder="Sample name"
                            v-model="scope.row.name"
                            size="mini"
                            @input="
                                renameStoredSample(scope.row.id, scope.row.name)
                            "
                        ></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="url" label="URL" sortable>
                    <template slot-scope="scope">
                        <el-input
                            placeholder="Sample URL"
                            v-model="scope.row.url"
                            size="mini"
                            @input="
                                changeStoredSampleUrl(
                                    scope.row.id,
                                    scope.row.url
                                )
                            "
                        ></el-input>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="Actions">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="useStoredSample(scope.row.id)"
                            >Use
                        </el-button>
                        <el-button
                            size="mini"
                            @click="duplicateStoredSample(scope.row.id)"
                            >Duplicate</el-button
                        >
                        <el-button
                            type="danger"
                            size="mini"
                            @click="deleteStoredSample(scope.row.id)"
                            >Delete</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
                <el-button size="mini" @click="addSample()"
                    >Add sample</el-button
                >
            </div>
        </main>
    </div>
</template>

<script>
import * as Tone from "tone";

import { mapGetters } from "vuex";

export default {
    name: "SampleManager",
    data() {
        return {
            samples: [],
            currentRow: null,
        };
    },
    computed: {
        ...mapGetters(["storedSamples", "storedSampleById"]),
    },
    methods: {
        useStoredSample(id) {
            const sample = this.storedSampleById(id);
            this.$emit("useSample", sample.url);
        },
        addSample() {
            this.$store.dispatch("addStoredSample", {});
        },
        duplicateStoredSample(id) {
            this.$store.dispatch("duplicateStoredSampleById", id);
        },
        deleteStoredSample(id) {
            this.$store.dispatch("removeStoredSampleById", id);
        },
        renameStoredSample(id, newName) {
            this.$store.dispatch("renameStoredSampleById", {
                id: id,
                name: newName,
            });
        },
        changeStoredSampleUrl(id, newUrl) {
            this.$store.dispatch("changeStoredSampleUrlById", {
                id: id,
                url: newUrl,
            });
        },
        async handleFileUpload(event) {
            let raw = event.target.files[0];

            let file = await new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = (event) => {
                    resolve(JSON.parse(event.target.result));
                };
                reader.onerror = reject;
                reader.readAsText(raw);
            });

            await this.$store.dispatch("storeSequenceInStoredSamples", file);
        },
        previewSample(url) {
            const player = new Tone.Player(url).toDestination();
            Tone.loaded().then(() => {
                player.start();
            });
        },
    },
};
</script>
