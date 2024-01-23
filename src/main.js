import './assets/main.css'
import { createRouter, createWebHistory } from "vue-router";
import { vue3Debounce } from "vue-debounce";

import { createApp } from 'vue'
import App from './App.vue'
import BestSlopeView from "@/views/BestSlopeView.vue";
import LinearRegressionView from "@/views/LinearRegressionView.vue";
import PerceptronView from "@/views/PerceptronView.vue";
import LearningView from "@/views/LearningView.vue";
import BaseView from "@/views/BaseView.vue";
import BackpropView from "@/views/BackpropView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: BaseView},
        { path: "/learn", component: LearningView },
        { path: "/best_slope", component: BestSlopeView },
        { path: "/linear_regression", component: LinearRegressionView },
        { path: "/mlp", component: PerceptronView },
        { path: "/backprop", component: BackpropView }
    ]
})

createApp(App)
    .use(router)
    .directive('debounce', vue3Debounce({ lock: true }))
    .mount('#app')
