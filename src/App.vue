<template>
    <div id="main" style="overflow: hidden">
        <header id="header">
            <nav class="navbar navbar-dark bg-secondary d-flex p-0 fixed-bottom">
                <div class="container px-3 py-2">
                    <router-link to="/" class="navbar-brand align-bottom router-link-active">
                        <div class="nav-brand">
                            <span class>MedVoc</span>
                        </div>
                    </router-link>
                    <router-link to="/weekly" class>
                        <div class="nav-item">
                            <i class="fas fa-tasks"></i>
                            <span class="nav-text">Week Progress</span>
                        </div>
                    </router-link>
                    <router-link to="/" :key="$route.fullPath">
                        <div class="nav-item">
                            <i class="fas fa-language"></i>
                            <span class="nav-text">Daily Vocab</span>
                        </div>
                    </router-link>
                    <router-link to="/settings" class>
                        <div class="nav-item">
                            <i class="fas fa-user"></i>
                            <span class="nav-text">Settings</span>
                        </div>
                    </router-link>
                    <div class="m-n3 ml-n4 p-3 px-4 mr-1 text-white" type="button" @click="$router.go(-1)">
                        <i class="fas fa-lg fa-chevron-left"></i>
                    </div>
                </div>
            </nav>
        </header>
        <div style="padding-left: 15px; padding-right: 15px; display: flex; min-height: calc(100vh - 72px)">
            <router-view style="margin: auto; width: 100%"></router-view>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as API from "./API";
import { updatingScheduledNotifications } from "./util/notifications";

@Component({})
export default class VocCard extends Vue {
    async mounted() {
        if (await API.getNotificationStatus()) updatingScheduledNotifications();
    }
}
</script>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
.nav-item {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    padding-top: 5px;
    font-size: 20px;
    color: white;
}
.fas {
    display: inline;
}
.nav-text {
    display: block;
    font-size: 11px;
}
.navbar-toggler {
    display: none;
}
</style>
