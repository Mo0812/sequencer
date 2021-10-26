<template>
    <div class="project-manager">
        <h3>Stored Sequences</h3>
        <header>
            <el-button type="primary" size="mini" @click="storeCurrentSequence">
                <font-awesome-icon icon="save" />
                <template v-if="currentRow == null"> Save </template>
                <template v-else> Override</template> current sequence in
                projects</el-button
            >
            <el-button
                type="primary"
                :disabled="currentRow == null"
                size="mini"
                @click="exportSelectedSequence"
                ><font-awesome-icon icon="file-download" /> Export
                sequence</el-button
            >
            <el-button type="primary" size="mini" @click="importSequence"
                ><font-awesome-icon icon="file-upload" /> Import
                sequence</el-button
            >
            <el-button
                type="primary"
                size="mini"
                :disabled="currentRow == null"
                @click="loadSelectedSequence"
                ><font-awesome-icon icon="file-import" /> Load selected
                sequence</el-button
            >
            <input
                style="display: none"
                type="file"
                id="file"
                ref="file"
                @change="handleFileUpload($event)"
            />
        </header>
        <main>
            <el-table
                class="stored-sequences"
                ref="storedSequences"
                stripe
                :data="storedSequences"
                highlight-current-row
                :default-sort="{ prop: 'date', order: 'descending' }"
                @current-change="handleCurrentRowChange"
            >
                <el-table-column prop="date" label="Date" sortable>
                    <template slot-scope="scope">
                        <font-awesome-icon icon="clock" />
                        <span style="margin-left: 10px">{{
                            moment(scope.row.date).format("L")
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="Name" sortable>
                    <template slot-scope="scope">
                        <el-input
                            placeholder="Sequence name"
                            v-model="scope.row.name"
                            size="mini"
                            @input="
                                renameStoredSequence(
                                    scope.row.id,
                                    scope.row.name
                                )
                            "
                        ></el-input>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="Actions">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="duplicateStoredSequence(scope.row.id)"
                            >Duplicate</el-button
                        >
                        <el-button
                            type="danger"
                            size="mini"
                            @click="deleteStoredSequence(scope.row.id)"
                            >Delete</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
                <el-button size="mini" @click="setCurrentRow()"
                    >Clear selection</el-button
                >
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "ProjectManager",
    props: ["currentSequence"],
    data() {
        return {
            sequences: [],
            currentRow: null,
        };
    },
    computed: {
        ...mapGetters(["storedSequences"]),
    },
    methods: {
        setCurrentRow(row) {
            this.$refs.storedSequences.setCurrentRow(row);
        },
        handleCurrentRowChange(val) {
            this.currentRow = val;
        },
        exportSelectedSequence() {
            const blob = new Blob([JSON.stringify(this.currentRow)], {
                type: "application/json",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none;";
            a.href = url;
            a.download = "sequencer.json";
            a.click();
            window.URL.revokeObjectURL(url);
        },
        storeCurrentSequence() {
            this.$store.dispatch("storeSequenceInStoredSequences", {
                selectedSequence: this.currentRow,
                sequence: this.currentSequence,
            });
        },
        loadSelectedSequence() {
            this.$emit("loadSequence", this.currentRow.sequence);
        },
        duplicateStoredSequence(id) {
            this.$store.dispatch("duplicateStoredSequenceById", id);
        },
        deleteStoredSequence(id) {
            this.$store.dispatch("removeStoredSequenceById", id);
        },
        renameStoredSequence(id, newName) {
            this.$store.dispatch("renameStoredSequenceById", {
                id: id,
                name: newName,
            });
        },
        importSequence() {
            this.$refs.file.click();
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

            await this.$store.dispatch("storeSequenceInStoredSequences", file);
        },
    },
};
</script>
