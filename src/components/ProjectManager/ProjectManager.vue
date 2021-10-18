<template>
    <div class="project-manager">
        <header>
            <el-button type="primary" @click="storeCurrentSequence">
                <font-awesome-icon icon="save" />
                <template v-if="currentRow == null"> Save </template>
                <template v-else> Override</template> current sequence in
                projects</el-button
            >
            <el-button type="primary" :disabled="currentRow == null"
                ><font-awesome-icon icon="file-download" /> Export
                sequence</el-button
            >
            <el-button type="primary"
                ><font-awesome-icon icon="file-upload" /> Import
                sequence</el-button
            >
            <el-button type="primary" :disabled="currentRow == null"
                ><font-awesome-icon icon="file-import" /> Load selected
                sequence</el-button
            >
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
                            scope.row.date
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="Name" sortable>
                </el-table-column>
                <el-table-column fixed="right" label="Actions">
                    <template>
                        <el-button size="mini">Duplicate</el-button>
                        <el-button type="danger" size="mini">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
                <el-button @click="setCurrentRow()">Clear selection</el-button>
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "ProjectManager",
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
        exportSequence() {
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
                name: "Test",
            });
        },
    },
};
</script>
