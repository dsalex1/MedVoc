import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Daily from "../views/Daily.vue";
import Profiles from "../views/Profiles.vue";
import Weekly from "../views/Weekly.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Daily,
  },
  {
    path: "/profiles",
    name: "Profiles",
    component: Profiles,
  },
  {
    path: "/weekly",
    name: "Weekly",
    component: Weekly,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
