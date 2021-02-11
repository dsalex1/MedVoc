<template>
    <div v-if="!loading">
        <div v-if="profile">
            <VocCardDeck
                :currentGroup="currentGroup"
                :profile="profile"
                :key="JSON.stringify(currentGroup)"
                :progress="getGroupProgress()"
                :isRemaining="v => isRemaining(v)"
                @progress="onProgress($event)"
            />
            <div v-if="getGroupProgress() == '100%'">
                <div class="alert alert-success mt-3">yay! all done for today 😄</div>
                <button class="btn btn-primary float-right" @click="startNewGroup()">start new group</button>
            </div>
        </div>
        <div v-else>
            <div class="alert alert-danger mt-3">
                No active Profile, go to Profile to make a profile active, or to create a new one.
            </div>
        </div>
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

    private currentGroup: API.Group = {} as API.Group;
    private profile: API.Profile = {} as API.Profile;

    mounted() {
        this.loading = true;
        this.currentGroup = API.getCurrentGroup();
        this.profile = API.getCurrentProfile();
        if (!this.profile) {
            this.loading = false;
            return;
        }
        if (!this.currentGroup || this.currentGroup.profileId != this.profile.id) {
            API.setCurrentGroup(null as any);
            API.setCurrentWeek(null as any);
            this.generateNewGroup();
            this.loading = false;
            return;
        }
        this.loading = false;
    }

    onProgress({ correct, vocIndex }: { correct: boolean; vocIndex: number }) {
        if (correct) this.profile.vocabulary[vocIndex].progress.correctCounter += 1;
        else this.profile.vocabulary[vocIndex].progress.correctCounter = 0;
        API.updateVocProgress(vocIndex, this.profile.vocabulary[vocIndex].progress);
        if (this.getGroupProgress() == "100%") {
            const currentWeek = API.getCurrentWeek() ?? { profileId: this.profile.id, indicies: [] };
            currentWeek.indicies = [...currentWeek.indicies, ...this.currentGroup.indicies];
            API.setCurrentWeek(currentWeek);
        }
    }
    startNewGroup() {
        this.generateNewGroup();
    }
    generateNewGroup() {
        const unfinishedVocs = this.profile.vocabulary
            .map((v, id) => ({ v, id }))
            .filter(({ v }) => v.progress.correctCounter < TIMES_CORRECT_DONE)
            .map(({ id }) => id);

        const choosenVocs = this.choose(GROUP_SIZE, unfinishedVocs);

        this.currentGroup = { profileId: this.profile.id, indicies: choosenVocs.map(id => ({ id })) };
        API.setCurrentGroup(this.currentGroup);
    }

    get currentGroupVoc() {
        return this.currentGroup.indicies.map(({ id }) => this.profile.vocabulary[id]);
    }
    getGroupProgress() {
        const progress =
            this.currentGroupVoc.map(v => Math.min(v.progress.correctCounter, TIMES_CORRECT_DONE)).reduce((a, c) => a + c, 0) /
            (TIMES_CORRECT_DONE * this.currentGroupVoc.length);

        return Math.round(progress * 100) + "%";
    }
    isRemaining = (v: any) => v.progress.correctCounter < TIMES_CORRECT_DONE;
}
</script>
