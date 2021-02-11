<template>
    <div style="margin-bottom:80px;margin-top:20px">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h2>Profiles</h2>
                    <div class="d-flex">
                        <button class="btn btn-primary" @click="newProfile"><i class="fas fa-plus"></i> new profile</button>
                        <importProfile @newProfile="refresh" />
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-deck">
                    <div v-for="profile in profiles" class="card mb-4" :class="{ active: profile.id == currentProfileId }" :key="profile.id">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5>#{{ profile.id }}</h5>
                                <div>
                                    <button class="btn btn-success" @click="makeActive(profile.id)"><i class="fas fa-star"></i> use</button>
                                    <button class="btn btn-danger ml-1" @click="deleteProfile(profile.id)">
                                        <i class="fas fa-trash"></i> delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <textarea class="form-control" rows="4" :value="JSON.stringify(profile)"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card.active {
    border: 1px solid #1e8335;
    box-shadow: 0 0 3px 2px #28a745;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as API from "../API";
@Component({})
export default class Daily extends Vue {
    profiles: API.Profile[] = [];
    currentProfileId!: string;

    mounted() {
        this.refresh();
    }

    refresh() {
        this.profiles = API.getProfiles();
        this.currentProfileId = API.getCurrentProfileId();
    }

    newProfile() {
        console.log("new");
        API.newProfile();
        this.refresh();
    }
    makeActive(id: number) {
        API.makeProfileActive(id);
        this.refresh();
    }
    deleteProfile(id: number) {
        if (window.confirm("do you really want to delete #" + id + "?")) API.deleteProfile(id);
        this.refresh();
    }
}
</script>
