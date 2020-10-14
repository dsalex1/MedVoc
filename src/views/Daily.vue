<template>
    <div v-if="!loading">
        <div class="progress mt-2 ">
            <div
                class="progress-bar progress-bar-striped bg-success progress-bar-animated"
                role="progressbar"
                :style="{ width: getGroupProgress() }"
            ></div>
        </div>
        <div class="home">this is a daily page</div>
        #
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as API from "../API";

const GROUP_SIZE = 5;
const TIMES_CORRECT_DONE = 3;
@Component({})
export default class Daily extends Vue {
    private loading = true;
    private currentGroup!: API.Group;
    private profile!: API.Profile;

    mounted() {
        this.loading = true;
        this.currentGroup = API.getCurrentGroup();
        this.profile = API.getCurrentProfile();
        if (!this.currentGroup || this.currentGroup.profileId != this.profile.id) {
            this.generateNewGroup(GROUP_SIZE);
        }
        this.loading = false;
    }

    getGroupProgress() {
        const vocs = this.currentGroup.indicies.map(({ id }) => this.profile.vocabulary[id]);
        const progress = vocs
            .map(v => Math.max(v.progress.correctCounter, TIMES_CORRECT_DONE) / TIMES_CORRECT_DONE)
            .reduce((a, c, _, arr) => c + a / arr.length);

        return Math.round(progress * 100) + "%";
    }
    generateNewGroup(size: number) {
        const unfinishedVocs = this.profile.vocabulary.filter(v => v.progress.correctCounter < TIMES_CORRECT_DONE).map((_, i) => i);
        const choosenVocs = this.choose(5, unfinishedVocs);
        this.currentGroup = { profileId: this.profile.id, indicies: choosenVocs.map(id => ({ id })) };
        API.setCurrentGroup(this.currentGroup);
    }

    choose<T>(n: number, arr: Array<T>) {
        if (arr.length < n) return [...arr];
        const choosen: T[] = [];
        const choosenIds: number[] = [];
        while (choosen.length < n) {
            const idx = Math.floor(Math.random() * arr.length);
            if (!choosenIds.some(id => id == idx)) {
                choosen.push(arr[idx]);
                choosenIds.push(idx);
            }
        }
        return choosen;
    }
}
</script>
