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
          @click="$router.push('/user')"
          class="height"
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
  </script>
  
  <style scoped>
  .navbar {
    margin-top: 30px;
    height: 100vh;
    width: 20%;
    display: flex;
    flex-direction: column;
    overflow: visible;
    
  }
  
  .navbar__btns {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    margin-top: 20px;
    row-gap: 40px;
    overflow: visible;
  }
  
  .height{
    height: 100px;
  }
  </style>
  