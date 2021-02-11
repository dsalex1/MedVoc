<template>
    <div>
        <div class="progress mt-2 ">
            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" :style="{ width: progress }"></div>
        </div>
        <div v-if="progress != '100%'" style="position:relative">
            <VocCard v-if="nextVoc !== undefined" :voc="nextVoc" :inverted="false" />
            <VocCard v-if="nextVoc === undefined && currentVoc !== undefined" :voc="currentVoc" :inverted="false" />
            <div style="position:absolute;top:0px;width:calc(100vw - 30px);">
                <transition :name="currentVocAnimation" @after-leave="calcNextVoc">
                    <v-touch
                        v-if="currentVocStatus == null"
                        @swiperight="setCurrentVocStatus('correct')"
                        @swipeleft="setCurrentVocStatus('incorrect')"
                        class="flipper card-bg-white"
                    >
                        <VocCard v-if="currentVoc" :voc="currentVoc" :inverted="false" />
                    </v-touch>
                </transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as API from "../API";

const TIMES_CORRECT_DONE = 3;
@Component({})
export default class VocCardDeck extends Vue {
    private loading = true;

    @Prop()
    private currentGroup!: API.Group;
    @Prop()
    private profile!: API.Profile;
    @Prop()
    private progress!: string;
    @Prop()
    private isRemaining!: (v: any) => boolean;

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

    mounted() {
        this.currentVocIndex = this.getRemainingIndicies()[0];
        this.nextVocIndex = this.getRemainingIndicies()[0];
    }
    setCurrentVocStatus(s: "correct" | "incorrect" | null) {
        this.currentVocAnimation = s!;
        setTimeout(() => (this.currentVocStatus = s), 0);

        this.$emit("progress", { vocIndex: this.currentVocIndex, correct: s == "correct" });
    }
    getRemainingIndicies() {
        const remaining = this.currentGroup.indicies
            .map(({ id }) => ({ id, v: this.profile.vocabulary[id] }))
            .filter(({ v, id }) => this.isRemaining(v) && id != this.currentVocIndex)
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
