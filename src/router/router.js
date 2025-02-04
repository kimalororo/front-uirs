import MealPlan from "@/pages/MealPlan.vue";
import Main from "@/pages/Main.vue"
import UserRecipes from "@/pages/UserRecipes.vue";
import CreateRecipe from "@/pages/CreateRecipe.vue";
import WatchRecipe from "@/pages/WatchRecipe.vue";
import Auth from "@/pages/Auth.vue";
import { createRouter, createWebHistory } from "vue-router"


const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/plan',
        component: MealPlan
    },
    {
        path: '/user',
        component: UserRecipes
    },
    {
        path: '/create',
        component: CreateRecipe
    },
    {
        path: '/watch',
        component: WatchRecipe
    },
    {
        path: '/auth',
        component: Auth
    },
]

const router = createRouter( {
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;