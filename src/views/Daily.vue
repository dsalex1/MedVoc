<template>
    <div v-if="!loading">
        <div class="progress mt-2 ">
            <div
                class="progress-bar progress-bar-striped bg-success progress-bar-animated"
                role="progressbar"
                :style="{ width: getGroupProgress() }"
            ></div>
        </div>
        <div v-if="getGroupProgress() != '100%'" style="position:relative">
            <VocCard v-if="nextVoc !== undefined" :voc="nextVoc" />
            <VocCard v-if="nextVoc === undefined && currentVoc !== undefined" :voc="currentVoc" />
            <div style="position:absolute;top:0px;width:calc(100vw - 30px);">
                <transition :name="currentVocAnimation" @after-leave="calcNextVoc">
                    <v-touch
                        v-if="currentVocStatus == null"
                        @swiperight="setCurrentVocStatus('correct')"
                        @swipeleft="setCurrentVocStatus('incorrect')"
                        class="flipper card-bg-white"
                    >
                        <VocCard v-if="currentVoc" :voc="currentVoc" />
                    </v-touch>
                </transition>
            </div>
        </div>
        <div v-else>
            <button class="btn btn-primary" @click="generateNewGroup()">new Group</button>
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

    private currentVocIndex = -1;
    private nextVocIndex = -1;

    private currentVocStatus: "correct" | "incorrect" | null = null;
    private currentVocAnimation: "correct" | "incorrect" = "correct";

    get currentVoc() {
        return this.profile.vocabulary[this.currentVocIndex];
    }
    get nextVoc() {
        return this.profile.vocabulary[this.nextVocIndex];
    }
    get currentGroupVoc() {
        return this.currentGroup.indicies.map(({ id }) => this.profile.vocabulary[id]);
    }

    mounted() {
        this.loading = true;
        this.currentGroup = API.getCurrentGroup();
        this.profile = API.getCurrentProfile();
        if (!this.currentGroup || this.currentGroup.profileId != this.profile.id) {
            this.generateNewGroup();
            return;
        }
        this.currentVocIndex = this.getRemainingIndicies()[0];
        this.nextVocIndex = this.getRemainingIndicies()[0];
        this.loading = false;
    }
    setCurrentVocStatus(s: "correct" | "incorrect" | null) {
        this.currentVocAnimation = s!;
        setTimeout(() => (this.currentVocStatus = s), 0);
        if (s == "correct") this.currentVoc.progress.correctCounter += 1;
        else this.currentVoc.progress.correctCounter = 0;
        API.updateVocProgress(this.currentVocIndex, this.currentVoc.progress);
    }
    getRemainingIndicies() {
        const remaining = this.currentGroup.indicies
            .map(({ id }) => ({ id, v: this.profile.vocabulary[id] }))
            .filter(({ v, id }) => v.progress.correctCounter < TIMES_CORRECT_DONE && id != this.currentVocIndex)
            .map(({ id }) => id);
        console.log("remaining", remaining);
        const shuffle = (a: number[]) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        };
        return shuffle(remaining);
    }
    calcNextVoc() {
        if (this.nextVocIndex !== undefined) {
            this.currentVocIndex = this.nextVocIndex;
            this.nextVocIndex = this.getRemainingIndicies()[0];
        }
        this.currentVocStatus = null;
    }

    getGroupProgress() {
        const progress = this.currentGroupVoc
            .map(v => Math.min(v.progress.correctCounter, TIMES_CORRECT_DONE) / TIMES_CORRECT_DONE)
            .reduce((a, c, _, arr) => a + c / arr.length, 0);

        return Math.round(progress * 100) + "%";
    }

    generateNewGroup() {
        const unfinishedVocs = this.profile.vocabulary
            .map((v, id) => ({ v, id }))
            .filter(({ v }) => v.progress.correctCounter < TIMES_CORRECT_DONE)
            .map(({ id }) => id);
        console.log({
            cov: this.profile.vocabulary,
            unfinishedVocs,
            test: this.profile.vocabulary.filter(v => v.progress.correctCounter < TIMES_CORRECT_DONE)
        });
        const choosenVocs = this.choose(GROUP_SIZE, unfinishedVocs);
        this.currentGroup = { profileId: this.profile.id, indicies: choosenVocs.map(id => ({ id })) };
        API.setCurrentGroup(this.currentGroup);
        this.currentVocIndex = this.getRemainingIndicies()[0];
        this.nextVocIndex = this.getRemainingIndicies()[0];
    }
}
</script>
<style scoped>
.card-bg-white {
    background-color: #fff;
}
.correct-leave-active {
    transition: all 0.2s ease;
}
.correct-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(100vw);
    opacity: 0.5;
    background-color: rgba(0, 179, 0, 1);
}
.incorrect-leave-active {
    transition: all 0.2s ease;
}
.incorrect-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-100vw);
    opacity: 0.5;
    background-color: rgba(255, 0, 0, 1);
}
</style>
