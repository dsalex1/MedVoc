<template>
    <div id="app">
        <button @click="add">Add card</button>
        <button @click="remove">Remove card</button>
        <button @click="swing">Swing card</button>
        <vue-swing @throwout="onThrowout" :config="config" ref="vueswing">
            <div class="swing-card">
                <span>1</span>
            </div>
            <div class="swing-card">
                <span>2</span>
            </div>
        </vue-swing>
    </div>
</template>

<script>
import VueSwing from "vue-swing";

export default {
    name: "app",

    components: { VueSwing },

    data() {
        return {
            config: {
                allowedDirections: [VueSwing.Direction.LEFT, VueSwing.Direction.RIGHT],
                minThrowOutDistance: 100,
                maxThrowOutDistance: 1000
            },
            cards: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        };
    },

    methods: {
        add() {
            this.cards.push(`${this.cards.length + 1}`);
        },
        remove() {
            this.swing();
            setTimeout(() => {
                this.cards.pop();
            }, 100);
        },
        swing() {
            const cards = this.$refs.vueswing.cards;
            cards[cards.length - 1].throwOut(Math.random() * 100 - 50, Math.random() * 100 - 50);
        },
        onThrowout({ target, throwDirection }) {
            console.log(`Threw out ${target.textContent}!`);
        }
    }
};
</script>

<style>
body {
    background-color: #444;
    margin: 0;
}

.swing-card {
    align-items: center;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    font-size: 72px;
    height: 200px;
    justify-content: center;
    left: calc(50% - 100px);
    position: absolute;
    top: calc(50% - 100px);
    width: 200px;
}
</style>
