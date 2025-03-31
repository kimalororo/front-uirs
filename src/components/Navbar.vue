<template>
    <div class="navbar"> 
        <div class="navbar__btns" style="margin-top: 20px;">
            <my-button @click="$router.push('/')">
                <template #icon><img src="./icons/home.png" alt="Главная"></template>
                Главная
            </my-button>
            <my-button @click="$router.push('/user')">
                <template #icon><img src="./icons/recipe.png" alt="Мои"></template>
                Мои рецепты
            </my-button>
            <my-button @click="$router.push('/create')">
                <template #icon><img src="./icons/create.png" alt="Добавить"></template>
                Добавить рецепт
            </my-button>
            <my-button @click="$router.push('/plan')">
                <template #icon><img src="./icons/calendar.png" alt="План"></template>
                Планировщик питания
            </my-button>
            <my-button @click="$router.push('/advice')">
                <template #icon><img src="/auth-icon.png" alt="Советы"></template>
                Советы
            </my-button>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.navbar {
    margin-top: 30px;
    height: 100vh; /* Полная высота экрана */
    width: 20%;
    display: flex;
    flex-direction: column;
}

.navbar__btns {
    display: flex;
    flex-direction: column;
    flex-grow: 0.4;
    margin-left: 20px;
}

.navbar__btns > * {
    margin-top: 15px; 
    flex-grow: 1; 
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Выравниваем контент в кнопке влево */
    width: 100%; /* Кнопки растягиваются на всю ширину */
    margin-bottom: 10px;
}
hr {
    border: none;       /* Убираем стандартный бордер */
    height: 0.4px;        /* Высота линии */
    background: gray;   /* Цвет линии */
    margin: 20px 0;     /* Отступы сверху и снизу */
}

</style>
