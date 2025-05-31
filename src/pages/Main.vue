<template>
  <div class="page">
    <h1 class="page-title">Найти рецепт</h1>

    <!-- Панель фильтров -->
    <div class="controls">
      <MyInput
        v-model="filters.title"
        placeholder="Поиск по названию"
        :disableScale="true"
        class="search"
      />

      <MySelect
        v-model="filters.difficulty"
        :options="difficultyOptions"
        placeholder="Сложность"
        class="select"
      />

      <MySelect
        v-model="sort.by"
        :options="sortByOptions"
        placeholder="Сортировать по"
        class="select"
      />

      <MySelect
        v-model="sort.order"
        :options="sortOrderOptions"
        placeholder="Порядок"
        class="select"
      />

      <MyButton @click="onSearch" variant="filled" color="nvb">
        Применить
      </MyButton>
    </div>
    <div class="controls">
      <MyMultiSelect
        v-model="selectedTags"
        v-model:searchQuery="tagQuery"
        :items="filteredTags"
        labelKey="name"
        idKey="value"
        placeholder="Найти тег"
        class="multiselect"
        @reachEnd="loadMoreTags"
      />

      <MyMultiSelect
        v-model="selectedIngrids"
        v-model:searchQuery="ingridQuery"
        :items="filteredIngrids"
        labelKey="name"
        idKey="value"
        placeholder="Найти ингредиенты"
        class="multiselect"
        @reachEnd="loadMoreIngrids"
      />
    </div>

    <!-- Карточки рецептов -->
    <div v-if="recipes.length" class="cards">
      <div
        v-for="r in recipes"
        :key="r.id"
        class="card"
        @click="$router.push(`/watch/${r.id}`)"
      >
        <div class="card-image-wrapper">
          <img
            :src="getPhotoUrl(r.photo_url)"
            alt="Фото рецепта"
            class="card-img"
          />
        </div>
        <div class="card-content">
          <h2 class="card-title" :title="r.title">{{ r.title }}</h2>
          <h3 class="card-description">{{ r.description }}</h3>
          <div class="flex">
            <div class="stat">
              <img
                src="../components/icons/timer.png"
                alt="время приготовления"
                class="icon"
              />
              <span>{{ getTotalTime(r.stages) }}</span>
            </div>
            <div class="stat">
              <img
                v-if="r.difficulty === 'EASY'"
                src="../components/icons/easyKnife.png"
                alt="легко"
                class="knife"
              />
              <img
                v-else-if="r.difficulty === 'MEDIUM'"
                src="../components/icons/mediumKnife.png"
                alt="средне"
                class="knife"
              />
              <img
                v-else
                src="../components/icons/hardKnife.png"
                alt="сложно"
                class="knife"
              />
              <span>{{ getDifficultyLabel(r.difficulty) }}</span>
            </div>
            <div class="stat">
              <img
                src="../components/icons/callories.png"
                alt="калорийность"
                class="icon"
              />
              <span>{{ r.calories }} ККал</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Маячок для бесконечной подгрузки -->
    <div ref="sentinel"></div>

    <p v-if="!recipes.length && !loading" class="no-results">
      Рецептов не найдено.
    </p>
    <div v-if="loading" class="loading-indicator">
      Загрузка...
    </div>
  </div>
</template>

<script setup>
import qs from 'qs'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'

import MyInput       from '@/components/UI/MyInput.vue'
import MySelect      from '@/components/UI/MySelect.vue'
import MyButton      from '@/components/UI/MyButton.vue'
import MyMultiSelect from '@/components/UI/MyMultiSelect.vue'

// API setup
const API_HOST = 'https://mandrikov-ad.ru:8443'
const token = localStorage.getItem('token')
const api = axios.create({
  baseURL: `${API_HOST}/api/v1/recipe`,
  headers:    { Authorization: token },
  paramsSerializer: params =>
    qs.stringify(params, { arrayFormat: 'repeat' })
})

// Состояние рецептов
const recipes    = ref([])
const page       = ref(1)
const limit      = ref(6)
const totalPages = ref(1)
const loading    = ref(false)

// Фильтры и сортировка
const filters = ref({ title: '', difficulty: null })
const sort    = ref({ by: 'date', order: 'desc' })

// Опции
const difficultyOptions = [
  { value: 'EASY',   name: 'Легко' },
  { value: 'MEDIUM', name: 'Средне' },
  { value: 'HARD',   name: 'Сложно' }
]
const sortByOptions = [
  { value: 'date',     name: 'Дата' },
  { value: 'calories', name: 'Калории' }
]
const sortOrderOptions = [
  { value: 'asc',  name: 'По возрастанию' },
  { value: 'desc', name: 'По убыванию' }
]

// Теги
const filteredTags   = ref([])
const selectedTags   = ref([])
const tagQuery       = ref('')
const tagPage        = ref(1)
const tagHasMore     = ref(true)
const tagIsLoading   = ref(false)

async function fetchTags(q, pageNum = 1) {
  if (tagIsLoading.value) return
  tagIsLoading.value = true
  try {
    const { data = {} } = await axios.get(`${API_HOST}/api/v1/tag`, {
      params: { q, page: pageNum, limit: 10 }
    })
    const list = (data.items || data.tags || [])
      .map(t => ({ value: t.id, name: t.title }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

    if (pageNum === 1) filteredTags.value = list
    else filteredTags.value.push(...list)
    tagHasMore.value = pageNum < (data.total_pages || 1)
  } catch (e) {
    console.error('Ошибка при получении тегов:', e)
  } finally {
    tagIsLoading.value = false
  }
}

function loadMoreTags() {
  if (!tagHasMore.value || tagIsLoading.value) return
  tagPage.value++
  fetchTags(tagQuery.value, tagPage.value)
}

// Ингредиенты
const selectedIngrids = ref([])
const filteredIngrids = ref([])
const ingridQuery     = ref('')
const ingridPage      = ref(1)
const ingridHasMore   = ref(true)
const ingridIsLoading = ref(false)

async function fetchIngrids(q, pageNum = 1) {
  if (ingridIsLoading.value) return
  ingridIsLoading.value = true
  try {
    const { data = {} } = await axios.get(`${API_HOST}/api/v1/ingredient`, {
      params: { q, page: pageNum, limit: 10 }
    })
    const list = (data.items || data.ingredients || [])
      .map(i => ({ value: i.id, name: i.name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

    if (pageNum === 1) filteredIngrids.value = list
    else filteredIngrids.value.push(...list)
    ingridHasMore.value = pageNum < (data.total_pages || 1)
  } catch (e) {
    console.error('Ошибка при получении ингредиентов:', e)
  } finally {
    ingridIsLoading.value = false
  }
}

function loadMoreIngrids() {
  if (!ingridHasMore.value || ingridIsLoading.value) return
  ingridPage.value++
  fetchIngrids(ingridQuery.value, ingridPage.value)
}

// Помощники
const getPhotoUrl = path =>
  path && !path.startsWith('http') ? `${API_HOST}${path}` : path || '/fallback.png'
const getDifficultyLabel = d => ({ EASY: 'Легко', MEDIUM: 'Средне', HARD: 'Сложно' }[d] || '')
const getTotalTime = stages => {
  const total = (stages || []).reduce((s, x) => s + (x.minutes || 0), 0)
  const h = Math.floor(total / 60)
  const m = total % 60
  return h ? `${h} ч ${m} мин` : `${m} мин`
}

// Наблюдатель
const sentinel = ref(null)
let observer = null

async function fetchRecipes() {
  if (loading.value || page.value > totalPages.value) return
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      sort_by: sort.value.by,
      sort_order: sort.value.order,
      tag_ids: selectedTags.value.map(t => t.value),
      ingredient_ids: selectedIngrids.value.map(i => i.value),
      ...(filters.value.title && { title: filters.value.title }),
      ...(filters.value.difficulty && { difficulty: filters.value.difficulty })
    }
    const { data } = await api.get('', { params })
    const items = data.items || []
    totalPages.value = data.total_pages || 1
    if (page.value === 1) recipes.value = items
    else recipes.value.push(...items)
    page.value++
  } catch (e) {
    console.error('Ошибка при загрузке рецептов', e)
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetchRecipes()
}

onMounted(() => {
  fetchTags('', 1)
  fetchIngrids('', 1)
  fetchRecipes()

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fetchRecipes()
        }
      })
    },
    { rootMargin: '200px' }
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value)
})

// Наблюдение за изменениями в запросах
watch(tagQuery, q => { tagPage.value = 1; fetchTags(q, 1) })
watch(ingridQuery, q => { ingridPage.value = 1; fetchIngrids(q, 1) })
</script>

<style scoped>
.page { max-width: 1200px; margin: 20px auto; padding: 0 16px; }
.page-title { font-size: 2rem; margin-bottom: 16px; color: #333; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 24px; }
.search { flex: 1; max-width: 400px; height: 50px; border-radius: 10px; margin-top: 0; }
.select { min-width: 140px; height: 50px; border-radius: 10px; padding-left: 10px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 20px; }
.card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; display: flex; flex-direction: column; transition: transform .2s, box-shadow .2s; }
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
.card-image-wrapper { overflow: hidden; }
.card-img { width: 100%; height: 200px; object-fit: cover; transition: transform .5s; }
.card:hover .card-img { transform: scale(1.1); }
.card-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.card-title { font-size: 1.2rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-description { font-size: 0.95rem; color: #666; flex: 1; }       
.flex { display: flex; gap: 12px; align-items: center; }
.stat { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #555; }
.icon { width: 20px; height: 20px; }
.knife { width: 24px; height: 24px; }
.no-results { text-align: center; color: #888; font-style: italic; margin: 40px 0; }
.loading-indicator { text-align: center; padding: 1rem; font-size: 1rem; color: #666; }
</style>
