<template>
    <FlipCard>
        <template :slot="inverted ? 'back' : 'front'">
            <div class="card h-30vh" :style="{ backgroundColor: getVocBgColor(voc) }">
                <div class="card-header">
                    {{ getVocType(voc) }}
                </div>
                <div class="card-body d-flex align-items-center justify-content-center" :style="{ color: 'blue' }">
                    <fit-text>{{ getVocFront(voc) }}</fit-text>
                </div>
            </div>
        </template>
        <template :slot="inverted ? 'front' : 'back'">
            <div class="card h-30vh" :style="{ backgroundColor: getVocBgColor(voc) }">
                <div class="card-header">
                    {{ getVocType(voc) }}
                </div>
                <div class="card-body d-flex align-items-center justify-content-center" :style="{ color: 'green' }">
                    <fit-text>{{ getVocBack(voc) }}</fit-text>
                </div>
            </div>
        </template>
    </FlipCard>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VocabularyType } from "../util/vocabulary";

@Component({})
export default class VocCard extends Vue {
    @Prop()
    private voc!: VocabularyType;

    @Prop()
    private inverted!: boolean;

    getVocFront(v: VocabularyType) {
        console.log("stuff", this.inverted);
        switch (v.typ) {
            case "M":
            case "G":
            case "P":
            case "aS":
                return v.voc;
            case "A":
                return v.vocM + (v.vocF ? ", " + v.vocF : "") + (v.vocN ? ", " + v.vocN : "") + (v.vocG ? ", " + v.vocG : "");
            case "GL":
                return v.vocG + " ≙ " + v.vocL;
            case "N":
                return v.vocN + (v.vocG ? ", " + v.vocG : "") + (v.vocNP ? ", " + v.vocNP : "") + (v.vocGP ? ", " + v.vocGP : "") + ", " + v.gen;
        }
    }
    getVocType(v: VocabularyType) {
        return {
            M: "Miscellaneous",
            G: "Greek Vocabulary",
            P: "Prefixes",
            aS: "Adjective Suffixes",
            A: "Adjectives",
            GL: "Greek-Latin Vocabulary",
            N: "Nouns",
        }[v.typ];
    }
    getVocBgColor(v: VocabularyType) {
        return {
            M: "#0000ff15",
            G: "#ffffff15",
            P: "#00ff0015",
            aS: "#ff00ff15",
            A: "#00ffff15",
            GL: "#00000015",
            N: "#ff000015",
        }[v.typ];
    }
    getVocBack(v: VocabularyType) {
        return v.deu;
    }
}
</script>

<style>
.h-30vh {
    height: 30vh;
}
</style>
