import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/assets/scss/base.scss";

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
