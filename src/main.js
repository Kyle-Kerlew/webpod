import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import * as VueRouter from "vue-router";
import WebpodApp from "@/components/WebpodApp";
import VueCookies from 'vue-cookies';

const pinia = createPinia();
const app = createApp(App);
const routes = [
    {path: '/', component: WebpodApp},

]
export const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
})
app.use(pinia);
app.use(VueCookies);
app.use(router);
app.mount('#app');
