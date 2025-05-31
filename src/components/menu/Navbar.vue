<template>
    <div class="navbar">
      <div class="navbar__btns">
        <MyButton
          variant="filled"
          color="nvb"
          @click="$router.push('/')"
          class="height"
          >
          <template #icon>
            <img src="../icons/home.png" alt="Главная" />
          </template>
          Главная
        </MyButton>
  
        <MyButton
          variant="filled"
          color="nvb"
          @click="$router.push('/userInfo')"
          class="height"
          v-if="token"
        >
          <template #icon>
            <img src="../icons/recipe.png" alt="Мои рецепты" />
          </template>
          Мои рецепты
        </MyButton>
  
        <MyButton
          variant="filled"
          color="nvb"
          @click="$router.push('/create')"
          class="height"
        >
          <template #icon>
            <img src="../icons/create.png" alt="Добавить рецепт" />
          </template>
          Добавить рецепт
        </MyButton>
  
        <MyButton
          variant="filled"
          color="nvb"
          @click="$router.push('/plan')"
          class="height"
          v-if="token"
        >
          <template #icon>
            <img src="../icons/calendar.png" alt="Планировщик питания" />
          </template>
          Планировщик питания
        </MyButton>
  
        <MyButton
          variant="filled"
          color="nvb"
          @click="$router.push('/advice')"
          class="height"
        >
          <template #icon>
            <img src="../icons/calendar.png" alt="Советы" />
          </template>
          Советы
        </MyButton>
      </div>
    </div>
  </template>
  
  <script setup>
  const token = localStorage.getItem('token')
  </script>
  
<style scoped>
.navbar {
  width: clamp(200px, 20%, 100%);
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.navbar__btns {
  display: flex;
  flex-direction: column;
  margin: 20px;
  row-gap: 30px;
  overflow: visible;
}

.height {
  height: clamp(60px, 10vh, 120px);
}
</style>
