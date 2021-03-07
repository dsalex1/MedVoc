import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Daily from "../views/Daily.vue";
import Settings from "../views/Settings.vue";
import Weekly from "../views/Weekly.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Daily
    },
    {
        path: "/daily",
        name: "Daily",
        component: Daily
    },
    {
        path: "/settings",
        name: "Settings",
        component: Settings
    },
    {
        path: "/weekly",
        name: "Weekly",
        component: Weekly
    }
];

const router = new VueRouter({
    routes
});

export default router;
