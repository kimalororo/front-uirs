<template>
    <div class="navbar"> 
        <div class="navbar__btns">
            <my-button @click="$router.push('/')">Recipe</my-button>
            <my-button @click="$router.push('/user')">Users</my-button>
            <my-button @click="$router.push('/create')">CreateRecipe</my-button>
            <my-button @click="$router.push('/watch')">WatchRecipe</my-button>
            <my-button @click="$router.push('/plan')">MealPlan</my-button>
            <my-button @click="$router.push('/auth')">Authentication</my-button>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.navbar {
    height: 100vh; /* Полная высота экрана */
    width: 20%;
    background-color: gray;
    display: flex;
    flex-direction: column;
}

.navbar__btns {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Занимает всю доступную высоту */
    height: 100%;
}

.navbar__btns > * {
    flex-grow: 1; /* Равномерное распределение между кнопками */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; /* Кнопки растягиваются на всю ширину */
}
</style>
