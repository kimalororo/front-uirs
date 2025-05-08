<template>
  <div v-if="recipe" class="recipe-container">
    <!-- Верхняя карточка -->
    <article class="card">
      <img
        class="card__image"
        :src="getPhotoUrl(recipe.photo_url)"
        alt="Фото рецепта"
      />
      <div class="card__body">
        <h2 class="card__title">{{ recipe.title }}</h2>
        <p class="card__description">{{ recipe.description }}</p>
        <div class="card__tags">
          <span
            v-for="tag in recipe.tags"
            :key="tag.id"
            class="card__tag"
          >#{{ tag.name }}</span>
        </div>
        <ul class="card__info-list">
          <li class="plus_icn">
            Время приготовления – {{ totalTime }} мин.
            <img
              src="../components/icons/timer.png"
              class="icons_clr"
              alt="clock"
            />
          </li>
          <li class="plus_icn">
            Калорийность – {{ recipe.calories }} Ккал
            <img
              src="../components/icons/callories.png"
              class="icons_clr"
              alt="callories"
            />
          </li>
          <li class="plus_icn">
            Сложность – {{ difficultyMap[recipe.difficulty] }}
            <img
              v-if="recipe.difficulty === 'EASY'"
              src="../components/icons/easyKnife.png"
              class="icons_clr"
              alt="easy"
            />
            <img
              v-else-if="recipe.difficulty === 'MEDIUM'"
              src="../components/icons/mediumKnife.png"
              class="icons_clr"
              alt="medium"
            />
            <img
              v-else
              src="../components/icons/hardKnife.png"
              class="icons_clr"
              alt="hard"
            />
          </li>
          <li class="plus_icn">
            Количество лайков – {{ recipe.likes_count }}
            <img
              src="../components/icons/heart.png"
              class="icons_clr"
              alt="heart"
            />
          </li>
          <li v-if="recipe.rating !== undefined">
            Рейтинг – {{ recipe.rating }}/5 ⭐
          </li>
        </ul>
        <div class="card_footer">
          <p class="card__link">Ник создателя</p>
          <p class="date">
            Дата создания: {{ normalizeDate(recipe.published_at) }}
          </p>
        </div>
      </div>
    </article>

    <!-- Ингредиенты -->
    <section class="ingredients">
      <h2 class="section-title">Ингредиенты</h2>
      <h3 class="section-portions">Количество порций</h3>
      <div class="servings-control">
        <button @click="decreaseServings" class="servings-btn">–</button>
        <span class="servings-count">{{ servings }}</span>
        <button @click="increaseServings" class="servings-btn">+</button>
      </div>
      <ul class="ingredients-list">
        <li
          v-for="item in adjustedIngredients"
          :key="item.id"
          class="ingredient-item"
        >
          <span class="name">{{ item.ingredient.name }}</span>
          <img class="image_clr" :src="getPhotoUrl(item.icon_url)" height="32px" width="32px" alt="ingridIcon">
          <span class="dots"></span>
          <span class="quantity">
            {{ item.adjustedQuantity }} {{ item.unit.name }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Этапы приготовления -->
    <section class="stages">
      <h2 class="section-title">Процесс приготовления</h2>
      <div
        v-for="(stage, index) in sortedStages"
        :key="stage.order_index"
        class="stage-item"
      >
        <img
          :src="getPhotoUrl(stage.photo_url)"
          alt="Фото этапа"
          class="stage-photo"
        />
        <div class="stage-desc">
          <div class="stage-header">
            <span class="stage-index">
              Этап {{ index + 1 }}/{{ sortedStages.length }},
            </span>
            <span class="stage-time">({{ stage.minutes }} мин.)</span>
          </div>
          <h3 class="stage-title">{{ stage.title }}</h3>
          <p class="stage-description">{{ stage.description }}</p>
        </div>
      </div>
    </section>
    <section id="commentsBlock">
      <RecipeComments :recipeId="recipe.id" />
    </section>
  </div>
  
  <div v-else class="loading">Загрузка рецепта...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import defaultIcon from '@/components/icons/defaultIngredient.png'
import RecipeComments from '@/components/menu/RecipeComments.vue'

const route = useRoute()
const id = route.params.id
const recipe = ref(null)
const servings = ref(3)
const API_HOST = 'https://mandrikov-ad.ru:8443'
const api = axios.create({
  baseURL: `${API_HOST}/api/v1/recipe`
})

function getPhotoUrl(path) {
  if (!path) return defaultIcon
  if (path.startsWith('http')) return path
  const normalizedPath = path.startsWith('/') ? path : '/' + path
  return `${API_HOST}${normalizedPath}`
}

const difficultyMap = {
  EASY: 'легко',
  MEDIUM: 'средне',
  HARD: 'сложно'
}

async function getRecipe() {
  try {
    const { data } = await api.get(`/${id}`)
    recipe.value = data
  } catch (err) {
    console.error(err)
  }
}

onMounted(getRecipe)

const totalTime = computed(
  () =>
    recipe.value?.stages.reduce((sum, s) => sum + s.minutes, 0) || 0
)

function normalizeDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU')
}

const toggleLike = async () => {
  if (!recipe.value) return
  try {
    const action = recipe.value.is_liked_by_me ? 'unlike' : 'like'
    await api.post(`/${id}/${action}`)
    recipe.value.is_liked_by_me = !recipe.value.is_liked_by_me
    recipe.value.likes_count +=
      recipe.value.is_liked_by_me ? 1 : -1
  } catch (err) {
    console.error(err)
  }
}

const sortedStages = computed(() =>
  recipe.value?.stages
    .slice()
    .sort((a, b) => a.order_index - b.order_index) || []
)

const increaseServings = () => {
  servings.value++
}
const decreaseServings = () => {
  if (servings.value > 1) servings.value--
}

const adjustedIngredients = computed(() => {
  if (!recipe.value) return []
  const factor = servings.value / 3 //Это чё??
  return recipe.value.ingredients.map(item => ({
    ...item,
    adjustedQuantity: (item.quantity * factor).toFixed(1)
  }))
})
</script>

<style scoped>
.recipe-container {
  max-width: 90%;
  margin: auto;
  padding: 16px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
}

/* Карточка рецепта */
.card {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card__image {
  width: 50%;
  height: 450px;
  border-radius: 12px;
  object-fit: cover;
}

.card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card__title {
  font-size: 2rem;
  margin: 0;
}

.card__description {
  font-size: 1.3rem;
  color: #555;
}

.card__tags {
  font-size: 1.2rem;
}

.card__tag {
  margin-right: 8px;
  color: #0066cc;
}

.card__info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  color: #444;
}

.card__info-list li.plus_icn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.icons_clr {
  width: 24px;
  height: auto;
}

.card_footer {
  margin-top: auto;
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  align-items: center;
}

.card__link {
  text-decoration: underline;
  color: #000;
}

.date {
  font-size: 0.9rem;
  color: #444;
}

/* Ингредиенты */
.ingredients {
  margin-bottom: 32px;
  width: 50%;
}

.section-title {
  font-size: 24px;
  margin-bottom: 12px;
}

.section-portions {
  font-size: 20px;
  margin-bottom: 14px;
}

.servings-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.servings-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: none;
  font-size: 20px;
  cursor: pointer;
}

.servings-count {
  font-size: 18px;
}

/* Новый стиль списка ингредиентов */
.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
}

.ingredient-item .name,
.ingredient-item .quantity {
  flex-shrink: 0;
  font-size: 1.2rem;
  color: black;
}
.ingredient-item .quantity {
  color: #333333b1;
}
.ingredient-item .dots {
  flex-grow: 1;
  border-bottom: 1px dashed #9c9c9c;
  margin: 0 12px;
}

/* Этапы приготовления */
.stages {
  margin-bottom: 32px;
}

.stage-item {
  display: flex;
  margin-bottom: 24px;
}

.stage-photo {
  min-width: 40%;
  max-height: 400px;
  border-radius: 8px;
  margin-right: 20px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stage-desc {
  flex: 1;
}

.stage-header {
  display: flex;
  gap: 10px;
  color: #666;
  margin-bottom: 4px;
}

.stage-title {
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.stage-description {
  font-size: 1.3rem;
  color: #555;
}

/* Загрузка */
.loading {
  text-align: center;
  color: #888;
  padding: 16px;
}
</style>
