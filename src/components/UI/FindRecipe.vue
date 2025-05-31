<template>
  <div class="modal-overlay" @click.self="emitClose">
    <div class="modal-window" ref="modalWindow">
        <h1 class="page-title">
          {{ exRecipeId ? 'Заменить рецепт' : 'Добавить рецепт' }} на день {{ dateKey }}
        </h1>
        <!-- Панель фильтров -->
        <div class="controls">
        <MyInput
            v-model="filters.title"
            placeholder="Поиск по названию"
            :disableScale="true"
            class="search"
        />
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
        <div class="controls">
            <MyButton @click="onSearch" variant="filled" color="nvb">
                Применить
            </MyButton>
        </div>
        <!-- Карточки рецептов -->
        <div v-if="recipes.length" class="cards">
        <div
            v-for="r in recipes"
            :key="r.id"
            class="card"
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
            <h5 class="card-description">{{ r.description }}</h5>
            <div class="flex">
                <div class="stat">
                <img
                    src="../icons/timer.png"
                    alt="время приготовления"
                    class="icon"
                />
                <span>{{ getTotalTime(r.stages) }}</span>
                </div>
                <div class="stat">
                <img
                    v-if="r.difficulty === 'EASY'"
                    src="../icons/easyKnife.png"
                    alt="легко"
                    class="knife"
                />
                <img
                    v-else-if="r.difficulty === 'MEDIUM'"
                    src="../icons/mediumKnife.png"
                    alt="средне"
                    class="knife"
                />
                <img
                    v-else
                    src="../icons/hardKnife.png"
                    alt="сложно"
                    class="knife"
                />
                <span>{{ getDifficultyLabel(r.difficulty) }}</span>
                </div>
                <div class="stat">
                <img
                    src="../icons/callories.png"
                    alt="калорийность"
                    class="icon"
                />
                <span>{{ r.calories }} ККал</span>
                </div>
            </div>
            <my-button 
            class="add" variant="filled" color="nvb"
            @click="saveRecipe(r.id)">
              {{ exRecipeId ? 'Заменить' : 'Добавить' }}
            </my-button>
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
</div>
</template>

<script setup>
import qs from 'qs'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import MyButton from './MyButton.vue'
import MySelect from './MySelect.vue'
import MyMultiSelect from './MyMultiSelect.vue'
import MyInput from './MyInput.vue'

const props = defineProps({
  planId:{
    type: Number,
    default: null
  },
  dateKey: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: null
  },
  exRecipeId: {
    type: Number,
    default: null
  }
})

// опишем событие закрытия
function emitClose() {
  emit('close')
}

// API setup
const API_HOST = 'https://mandrikov-ad.ru:8443'
const token    = localStorage.getItem('token')
const api = axios.create({
  baseURL: `${API_HOST}/api/v1/recipe`,
  headers:    { Authorization: token },
  paramsSerializer: params =>
    qs.stringify(params, { arrayFormat: 'repeat' })
})

const apiMeal = axios.create({
  baseURL: `${API_HOST}/api/v1/mealplan`,
  headers: {Authorization:token}
})

const emit = defineEmits(['close'])

 const saveRecipe = async (recipeId) => {
   try {
     if (props.exRecipeId) {
       await apiMeal.patch(
        `/${props.planId}/recipes/${props.exRecipeId}`,
        {
           recipe_id: recipeId,
           order:       props.order
        }
      )} 
      else {
       await apiMeal.post(
         `/${props.planId}/days/${props.dateKey}/recipes`,
         {
          recipe_id: recipeId,
           order:       props.order
         }
       )
      }
     emitClose()
   } catch (err) {
     console.error("Ошибка при сохранении рецепта в план", err)
   }
 }

// Состояние рецептов
const recipes    = ref([])
const page       = ref(1)
const limit      = ref(6)
const totalPages = ref(1)
const loading    = ref(false)

// Фильтры и сортировка
const filters = ref({ title: '', difficulty: null })
const sort    = ref({ by: 'date', order: 'desc' })

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
/* Фон-оверлей */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; 
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(0,0,0,0.5);
}

/* Окно модалки */
.modal-window {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Заголовок */
.page-title {
  font-size: 1.75rem;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

/* Кнопка закрытия (×) */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}

/* Секция фильтров */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  overflow: visible;
}
.controls button{
    height: 40px;
    font-size: 1rem;
    justify-content: center;
    width: 100%;
}

/* Поле поиска по названию */
.search {
  flex: 1 1 200px;
  min-width: 180px;
  height: 40px;
  border-radius: 8px;
}

/* Селекты */
.select {
  flex: 0 1 140px;
  min-width: 120px;
  height: 48px;
  border-radius: 8px;
  padding-left: 10px;
}

/* Мультиселекты */
.multiselect {
  flex: 1 1 220px;
  min-width: 200px;
  height: auto;
}

/* Карточки рецептов */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.card {
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.card-image-wrapper {
  overflow: hidden;
  flex-shrink: 0;
}
.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform .4s;
}
.card:hover .card-img {
  transform: scale(1.05);
}

.card-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-description {
  font-size: 0.85rem;
  color: #666;
  flex-grow: 1;
  margin-bottom: 8px;
}

/* Статистика (время, уровень, калории) */
.flex {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  color: #555;
}
.icon, .knife {
  height: 18px;
  margin-bottom: 2px;
  margin-right: 2px;
}
.add {
margin-top: 10px;
border-radius: 7px;
height: 20px;
width: 40%;
font-size: 0.8rem;
border-color: none;
border: 1px rgba(11, 139, 11, 0.288) solid;
}
/* Плейсхолдер бесконечной прокрутки */
.loading-indicator,
.no-results {
  text-align: center;
  font-size: 1rem;
  color: #888;
  margin: 16px 0;
}

/* Адаптив */
@media (max-width: 480px) {
  .modal-window {
    padding: 16px;
  }
  .controls {
    flex-direction: column;
  }
  .search, .select, .multiselect {
    width: 100%;
  }
  .card-img {
    height: 120px;
  }
}
</style>