<template>
    <div style="margin-left: 40px;">
      <h1 style="font-size: 40px;">
        Самое просматриваемое блюдо <span>✽</span>
      </h1>
      <br>
      <!--Карточка Блюда (СЫРНИКА С ФОТКОЙ КАРТОШКИ ХD)-->
      <div class="bg-white rounded-lg  container">
        <!-- Изображение блюда -->
        <img
          src="../components/icons/food.png"
          alt="Блюдо"
          class="rounded-lg object-cover image"
        />
        <!-- Описание блюда -->
        <div class="description">
          <h1 class="text-pre-gray" style="min-height:10% ;max-height: 13%; margin-top: 5px;">{{ mostViewed.title }}</h1>
          <br>
          <p class="dishDescr" style="min-height: 10%;max-height:20% ;">{{ mostViewed.description }}</p>
          <br>
          <div class="text-pre-gray" style="font-size: 20px;min-height: 10%; max-height: 17%;"><semibold>Тэги</semibold>: {{ mostViewed.tags }}</div>
          <br>
          <div class="space-y-1 text-pre-gray" style="max-height: 50%;">
            <p><strong>Время приготовления:</strong> {{ mostViewed.time }}</p>
            <p><strong>Калорийность:</strong> {{ mostViewed.calories }}</p>
            <p><strong>Сложность:</strong> {{ mostViewed.difficulty }}</p>
            <p><strong>Количество просмотров:</strong> {{ mostViewed.views }}</p>
            <p><strong>Рейтинг:</strong> {{ mostViewed.rating }}</p>
          </div>
        </div>
      </div>
      <br>
      <!--Сезонные блюда-->
      <h1 style="font-size: 40px;">
      Сезонные блюда <span class="ml-2">❄️☀️</span>
      </h1>
      <br>
      <div class="season">
        <div
          v-for="dish in seasonalDishes"
          :key="dish.id"
          class="season-dish bg-white rounded-lg overflow-hidden"
          :style = "{ backgroundImage: `url(${dish.image})`}"
        >
        <h1 class="dish-title" style="color: white;"> {{ dish.title }} </h1>
        <div class=" bg-opacity-50 dish-time" style="color:white">
          {{ dish.time }} ⏳
        </div>
      </div>
    </div>
    <br>
  </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const mostViewed = ref({
    title: "Сырники на рисовой муке",
    description: "Простой и быстрый рецепт для вкусного завтрака или десерта, который идеально сочетается со сметаной, ягодами или медом.",
    tags: "#завтрак, #пп, #десерт, #творог, #сладкое",
    time: "43 мин.",
    calories: "999 Ккал🔥",
    difficulty: "легко 🚀",
    views: "23k 👀",
    rating: "5/5 ⭐",
  });
  
  const seasonalDishes = ref([
    {
      id: 1,
      title: "Фаршированные перцы",
      time: "60 мин.",
      image: "//i.pinimg.com/736x/d5/d4/bb/d5d4bb7e8a83e3cc20f3383e4ca3e5c7.jpg"
    },
    {
      id: 2,
      title: "Грибной крем-суп",
      time: "45 мин.",
      image: "//i.pinimg.com/736x/d5/d4/bb/d5d4bb7e8a83e3cc20f3383e4ca3e5c7.jpg"
    },
  ]);
  </script>
  
  <style scoped>
  .bg-white{
  background: #FFFFFF;
  border-radius: 20px;
  }
  .text-pre-gray {
    color: #2d3748;
  }
  .rounded-lg {
    border-radius: 0.75rem;
  }
  .rounded-lg img{
    border-radius: 0.75rem;
    box-shadow: 12px 11px 36px rgba(0, 0, 0, 0.1);
  }
  .object-cover {
    object-fit: cover;
  }
  .space-y-1 > * + * {
    margin-top: 0.25rem;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .image{
    min-width: 50%;
    max-width: 55%;
    min-height: 400px;
    max-height: 470px;
  }
  .container{
    display: flex;
    box-shadow: 16px 17px 14px rgba(0, 0, 0, 0.01), 17px 19px 8px rgba(0, 0, 0, 0.05), 12px 4px 5px rgba(0, 0, 0, 0.09), 12px 11px 36px rgba(0, 0, 0, 0.1);
    width: 90%;
  }
  .description{
    margin-left: 20px;
  }
  .description h1{
    font-size: 2.5rem;
  }
  .description p{
    font-size: 1.4rem;
  }
  .dishDescr{
    color: gray;
  }
  .season{
    width: 90%;
    height:600px;
    display:flex;
    gap: 10%;
  }
  .season-dish{
    width: 45%;
    height:500px ;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 16px 17px 14px rgba(0, 0, 0, 0.01), 17px 19px 8px rgba(0, 0, 0, 0.05), 12px 4px 5px rgba(0, 0, 0, 0.09), 12px 11px 36px rgba(0, 0, 0, 0.1);
  }
  .dish-title {
  top: 10px;
  left: 10px;
  right: 10px;
  background: linear-gradient(5.83deg, rgba(0, 0, 0, 0) 4.91%, 
              rgba(0, 0, 0, 0.12) 16.69%, 
              rgba(0, 0, 0, 0.12) 102.37%);
  backdrop-filter: blur(1px);
  border-radius: 20px 20px 0px 0px;
  color: white;
  padding: 10px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
}



/* Время приготовления (внизу) */
.dish-time {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
}
  </style>
  