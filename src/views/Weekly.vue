<template>
    <div v-if="!loading">
        <div v-if="profile">
            <div class="alert alert-info mt-3">{{ getWeekVocDone().length }}/{{ currentWeekVoc.length }} Checked</div>
            <VocCardDeck
                :currentGroup="currentWeek"
                :profile="profile"
                :key="JSON.stringify(currentWeek)"
                :progress="getWeekProgress()"
                @progress="onProgress($event)"
                :isRemaining="v => isRemaining(v)"
            />
            <div v-if="getWeekProgress() == '100%'">
                <div class="alert alert-success mt-3">yay! all checked 😄</div>
            </div>
            <div v-if="getWeekVocDone().length == currentWeekVoc.length">
                <div class="card mt-3 mb-5">
                    <div class="card-header">
                        Overall Progress
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <tbody>
                                <tr v-for="vocType in vocTypes" :key="vocType[1]">
                                    <th scope="row">{{ vocType[1] }}</th>
                                    <td>{{ getTypeCount(vocType[0], true) }}</td>
                                    <td>/</td>
                                    <td>{{ getTypeCount(vocType[0], false) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
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

const TIMES_CHECKED_DONE = 2;
@Component({})
export default class Weekly extends Vue {
    private loading = true;

    private currentWeek: API.Group = {} as API.Group;
    private profile: API.Profile = {} as API.Profile;

    private getTypeCount(typ: any, completed: boolean) {
        return this.profile.vocabulary.filter(v => v.typ == typ && (v.progress.checkedCounter >= TIMES_CHECKED_DONE || !completed)).length;
    }
    private vocTypes = Object.entries({
        N: "Nouns",
        A: "Adjectives",
        P: "Prefixes",
        aS: "Adjective Suffixes",
        G: "Greek Vocabulary",
        GL: "Greek-Latin Vocabulary",
        M: "Miscellaneous"
    });

    mounted() {
        this.loading = true;
        this.currentWeek = API.getCurrentWeek() ?? { profileId: this.profile.id, indicies: [] };
        this.profile = API.getCurrentProfile();
        if (!this.profile) {
            this.loading = false;
            return;
        }
        if (!this.currentWeek || this.currentWeek.profileId != this.profile.id) {
            API.setCurrentWeek(null as any);
            this.loading = false;
            return;
        }
        this.loading = false;
    }

    onProgress({ correct, vocIndex }: { correct: boolean; vocIndex: number }) {
        if (correct) this.profile.vocabulary[vocIndex].progress.checkedCounter += 1;
        else this.profile.vocabulary[vocIndex].progress.checkedCounter = 0;
        API.updateVocProgress(vocIndex, this.profile.vocabulary[vocIndex].progress);

        if (this.getWeekVocDone().length == this.currentWeekVoc.length) {
            API.setCurrentWeek({ ...this.currentWeek, indicies: [] });
        }
    }

    get currentWeekVoc() {
        return this.currentWeek.indicies.map(({ id }) => this.profile.vocabulary[id]);
    }
    getWeekVocDone() {
        return this.currentWeekVoc.filter(v => v.progress.checkedCounter >= TIMES_CHECKED_DONE);
    }
    getWeekProgress() {
        const progress =
            this.currentWeekVoc.map(v => Math.min(v.progress.checkedCounter, TIMES_CHECKED_DONE)).reduce((a, c) => a + c, 0) /
            (TIMES_CHECKED_DONE * this.currentWeekVoc.length);

        return Math.round(progress * 100) + "%";
    }
    isRemaining = (v: any) => v.progress.checkedCounter < TIMES_CHECKED_DONE;
}
</script>
