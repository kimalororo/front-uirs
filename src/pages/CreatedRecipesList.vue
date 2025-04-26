<template>
  <div class="page">
    <h1 class="page-title">Мои рецепты</h1>

    <!-- Панель управления -->
    <div class="controls">
      <MyInput
        v-model="query"
        placeholder="Найти рецепт"
        :disableScale="true"
        class="search"
      />
      <MyButton @click="onSearch" variant="filled" color="nvb">
        Найти
      </MyButton>
      <MySelect
        v-model="selectedSort"
        :options="sortOptions"
        class="select"
      />
    </div>

    <!-- Карточки рецептов -->
    <div v-if="recipes.length" class="cards">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="card"
      >
        <div class="card-image-wrapper">
          <img
            :src="getPhotoUrl(recipe.photo_url)"
            alt="Фото рецепта"
            class="card-img"
          />
        </div>
        <div class="card-content">
          <h2 class="card-title" :title="recipe.title">{{ recipe.title }}</h2>
          <h3 class="card-description">{{ recipe.description }}</h3>
          <div class="flex">
            <div class="stat">
              <img src="../components/icons/timer.png" style="height: 40px;" alt="время приготовления"> 
              <span style="margin-right: 15px;">{{ getTotalTime(recipe.stages)}}</span>
            </div>
            <div class="stat">
                <img v-if="recipe.difficulty === easy" src="../components/icons/easyKnife.png" alt="легко" class="knife"> 
                <img v-else-if="recipe.difficulty === meduim" src="../components/icons/mediumKnife.png" alt="средне" class="knife">
                <img v-else src="../components/icons/hardKnife.png" alt="сложно" class="knife">
                <span style="margin-left: 7px;">{{ getDifficulty(recipe.difficulty)}}</span>
            </div>
            <div class="stat">
              <img src="../components/icons/callories.png" style="height: 30px; margin-left: 15px; margin-right: 7px;" alt="каллорийность">
              <span>{{ recipe.calories}} ККал</span>
            </div>
          </div> 
        </div>
      </div>
    </div>
    <p v-else class="no-results">Вы еше не создвали рецепты.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MyInput  from '@/components/UI/MyInput.vue'
import MySelect from '@/components/UI/MySelect.vue'
import MyButton from '@/components/UI/MyButton.vue'

// Сложности 
const easy = "EASY"
const meduim = "MEDIUM"

// Настройки API
const API_HOST = 'https://mandrikov-ad.ru:8443'
const token = localStorage.getItem('token')
const api = axios.create({
  baseURL: `${API_HOST}/api/v1/recipe/my`,
  headers: { Authorization: token }
})

// Реактивные данные
const query = ref('')
const recipes = ref([])
const selectedSort = ref('')
const sortOptions  = [
  { value: 'true',  name: 'Опубликованные' },
  { value: 'false', name: 'Черновики' }
]
const page  = 1
const limit = 20

// Функция для картинок
function getPhotoUrl(path) {
  return path && !path.startsWith('http')
    ? `${API_HOST}${path}`
    : path || '/fallback.png'
}

// Загрузка рецептов
async function fetchRecipes() {
  let is_published = null
  if (selectedSort.value === 'true')  is_published = true
  if (selectedSort.value === 'false') is_published = false

  try {
    const { data } = await api.get('', {
      params: { is_published, page, limit }
    })
    const q = query.value.trim().toLowerCase()
    recipes.value = data.items.filter(r =>
      r.title.toLowerCase().includes(q)
    )
  } catch (e) {
    console.error(e)
    recipes.value = []
  }
}

function onSearch() {
  fetchRecipes()
}

function getDifficulty(difficulty) {
  if(difficulty === "EASY")
    return "Легко"
  if(difficulty === "MEDIUM")
    return "Средне"
  if(difficulty === "HARD")
    return "Тяжело"
}

function getTotalTime(stages = []) {
  const totalMinutes = stages.reduce((sum, stage) => sum + (stage.minutes || 0), 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours!=0)
    return `${hours} ч ${minutes} мин`
  else
    return `${minutes} мин`
}

onMounted(fetchRecipes)
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
}
.page-title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #333;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  overflow: visible;
}
.flex {
  display: flex;
}
.knife {
  height: 27px;
}
.search {
  flex: 1;
  max-width: 400px;
  height: 50px;
  border-radius: 8px;
}
.select {
  min-width: 180px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;
  overflow: visible;
}
.card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1),
              0 2px 4px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px rgba(0,0,0,0.15),
              0 5px 10px rgba(0,0,0,0.1);
}
.card-image-wrapper {
  position: relative;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.card:hover .card-img {
  transform: scale(1.1);
}
.card-content {
  padding-top: 5px;
  padding-left: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-description {
  font-size: 1rem;
  color: #666;
}
.card-stats {
  display: flex;
  gap: 16px;
}
.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.875rem;
}
.icon {
  width: 16px;
  height: 16px;
  fill: #888;
}
.no-results {
  font-style: italic;
  color: #888;
  text-align: center;
  margin-top: 40px;
}
</style>
