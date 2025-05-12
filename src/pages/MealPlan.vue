<template>
  <div class="meal-planner">
    <!-- Левая картинка -->
    <div class="image-container">
      <img :src="plateImage" alt="Планировщик питания" />
    </div>

    <!-- Правая часть: заголовок, контролы, календарь, период -->
    <div class="planner">
      <h1>Персональный планировщик питания</h1> 
      <my-button 
        class="planner-create" 
        variant="filled" 
        color="nvb"
        @click="openName"
      >
        Добавить план
      </my-button>
      <div v-if="showName" class="planner-name">
        <my-input
          class="planName"
          placeholder="Введите название плана" 
          :disableScale="true"
          v-model="newPlanName"
        />
        <p class="closeName" @click="closeName">✖</p>
        <my-button 
          class="planner-create" 
          variant="filled" 
          color="nvb"
          @click="createPlan"
        >
          Создать план
        </my-button>
      </div>

      <div class="planner-body">
        <div class="left">
          <!-- Выбор месяца и кнопка -->
          <div class="controls">
            <label>
              Месяц
              <select v-model="selectedMonth">
                <option
                  v-for="m in months"
                  :key="m.value"
                  :value="m.value"
                >{{ m.label }}</option>
              </select>
            </label>
            <my-button variant="filled" color="nvb" @click="generateCalendar">
              Показать
            </my-button>
          </div>

          <!-- Поле выбранного периода -->
          <div class="selected-period">
            <label>Выбранный период</label>
            <input type="text" class="shadow" :value="periodText" readonly />
          </div>
        </div>

        <!-- Календарь -->
        <div class="calendar shadow">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">
              {{ day }}
            </div>
          </div>
          <div class="weeks">
            <div v-for="(week, wIdx) in calendar" :key="wIdx" class="week">
              <div
                v-for="day in week"
                :key="day.date.toISOString()"
                class="day"
                :class="{ 
                  'other-month': !day.isCurrentMonth,
                  'selected': day.isSelected 
                }"
                @click="selectDate(day)"
              >
                {{ day.date.getDate() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
      <!-- Сетка блюд -->
      <div class="meals-grid" v-if="displayDays.length">
        <!-- Шапка: даты -->
        <div class="header-row">
          <div class="corner-cell"></div>
          <div
            v-for="day in displayDays"
            :key="keyOf(day)"
            class="day-cell"
          >
            <div class="date-text">{{ keyOf(day) }}</div>
          </div>
        </div>

        <!-- Ряды блюд №1…4 -->
        <div
          v-for="row in 4"
          :key="row"
          class="meal-row"
        >
          <div class="row-label">
            Блюдо <br /> № {{ row }}
          </div>
          <div
            v-for="day in displayDays"
            :key="keyOf(day)"
            class="meal-cell"
            @mouseenter="() => { hoveredCell.row = row; hoveredCell.key = keyOf(day) }"
            @mouseleave="() => { hoveredCell.row = null; hoveredCell.key = null }"
          >
            <template v-if="meals[row][ keyOf(day) ]">
              <img
                :src="meals[row][ keyOf(day) ].image"
                class="meal-img"
                alt=""
              />
              <div class="meal-title">
                {{ meals[row][ keyOf(day) ].title }}
              </div>
            </template>
            <template v-else>
              <button
                v-if="hoveredCell.row === row && hoveredCell.key === keyOf(day)"
                class="add-btn"
                @click.stop="openFindRecipe(selectedPlanId, keyOf(day), row)"
              >+</button>
            </template>
          </div>
        </div>
      </div>

      <FindRecipe
        v-if="showFindRecipeModal"
        :planId="modalContext.planId"
        :date-key="modalContext.dateKey"
        :order="modalContext.order"
        @close="closeFindRecipe"
      />
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import plateImg from '@/components/icons/sausage.png'
import FindRecipe from '@/components/UI/FindRecipe.vue'
import axios from 'axios'
import MyButton from '@/components/UI/MyButton.vue'
import MyInput from '@/components/UI/MyInput.vue'

// Инициализация тоста
const toast = useToast()

const plateImage = plateImg
const weekdays = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.']

// Планирование месяца
const months = ref([])
const selectedMonth = ref('')
const calendar = ref([])
const startDate = ref(null)
const endDate = ref(null)
const confirmedStart = ref(null)
const confirmedEnd   = ref(null)

// Планы и блюда
const plans = ref([])
const selectedPlanId = ref(null)
const meals = reactive({ 1:{}, 2:{}, 3:{}, 4:{} })
const hoveredCell = reactive({ row: null, key: null })

// Создание нового плана
const showName = ref(false)
const newPlanName = ref('')

// Модалка поиска рецепта
const showFindRecipeModal = ref(false)
const modalContext = reactive({ planId: null, dateKey: '', order: null })

// Отображение периода
const periodText = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} – ${formatDate(endDate.value)}`
  } else if (startDate.value) {
    return formatDate(startDate.value)
  }
  return ''
})

// Массив выбранных дней
async function initializeWeekAndPlans() {
  // 1) Вычисляем текущую неделю
  const today = new Date()
  const offset = (today.getDay() + 6) % 7
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset, 0, 0, 0, 0)
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 0, 0, 0, 0)

  startDate.value = monday
  endDate.value   = sunday
  confirmedStart.value = monday
  confirmedEnd.value   = sunday
  updateSelection()

  // 2) Загружаем планы с сервера
  try {
    const { data } = await api.get('')
    plans.value = data
    if (plans.value.length) {
      selectedPlanId.value = plans.value[0].id
      loadMealsForPlan(plans.value[0])
    }
  } catch (e) {
    console.error('Ошибка при получении планов', e)
  }
}
const selectedDays = computed(() => {
  if (!startDate.value || !endDate.value) return []
  const arr = []
  let d = new Date(startDate.value)
  while (d <= endDate.value) {
    arr.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return arr
})

const displayDays = computed(() => {
  if (!confirmedStart.value || !confirmedEnd.value) return []
  const arr = []
  let d = new Date(confirmedStart.value)
  while (d <= confirmedEnd.value) {
    arr.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return arr
})
// Хелперы
function formatDate(d) {
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  return `${dd}.${mm}`
}
function keyOf(d) {
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  return `${dd}.${mm}`
}
function keyOfDateString(ymd) {
  const [year, month, day] = ymd.split('-')
  return `${day}.${month}`
}
function fullImageUrl(path) {
  return path.startsWith('http')
    ? path
    : `https://mandrikov-ad.ru:8443${path}`
}

// Открыть/закрыть модалку создания плана
function openName() { showName.value = true }
function closeName() { showName.value = false }

const api = axios.create({
  baseURL: 'https://mandrikov-ad.ru:8443/api/v1/mealplan',
  headers: { Authorization: localStorage.getItem('token') }
})

// Создать новый план
async function createPlan() {
  try {
    const { data } = await api.post('', { name: newPlanName.value })
    plans.value.push(data)
    selectedPlanId.value = data.id
    loadMealsForPlan(data)
    closeName()
  } catch (e) {
    console.error('Ошибка создания плана', e)
  }
}

// Загрузить все планы и установить текущую неделю по умолчанию
onMounted(async () => {
  initMonths()
  const now = new Date()
  selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  generateCalendar()
  initializeWeekAndPlans()
})

// При смене плана — обновить блюда
watch(selectedPlanId, id => {
  const plan = plans.value.find(p => p.id === id)
  if (plan) loadMealsForPlan(plan)
})

// Заполнить meals из объекта план→дни→рецепты
function loadMealsForPlan(plan) {
  Object.keys(meals).forEach(r => meals[r] = {})
  plan.days.forEach(day => {
    const key = keyOfDateString(day.date)
    day.recipes.forEach(rec => {
      const row = rec.order
      if (meals[row]) {
        meals[row][key] = {
          image: fullImageUrl(rec.preview),
          title: rec.recipe_title
        }
      }
    })
  })
}

// Календарь
function initMonths() {
  const now = new Date()
  const list = []
  for (let i = -6; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth()+i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = d.toLocaleString('ru-RU',{ month:'long', year:'numeric' })
                 .replace(/^./, s => s.toUpperCase())
    list.push({ value, label })
  }
  months.value = list
}

function generateCalendar() {
  startDate.value = null
  endDate.value = null

  const [year, month] = selectedMonth.value.split('-').map(Number)
  const first = new Date(year, month-1, 1)
  const startWeekday = (first.getDay()+6)%7
  const daysInMonth = new Date(year, month, 0).getDate()
  const prevDays = new Date(year, month-1, 0).getDate()

  const grid = []
  let week = []

  // предыдущие
  for (let i=0; i<startWeekday; i++) {
    const d = new Date(year, month-1, i - startWeekday + 1 + prevDays)
    week.push({ date: d, isCurrentMonth: false, isSelected: false })
  }
  // текущие
  for (let d=1; d<=daysInMonth; d++) {
    const dt = new Date(year, month-1, d)
    week.push({ date: dt, isCurrentMonth: true, isSelected: false })
    if (week.length === 7) {
      grid.push(week); week = []
    }
  }
  // следующие
  let nd = 1
  while (week.length < 7) {
    week.push({ date: new Date(year, month, nd++), isCurrentMonth: false, isSelected: false })
  }
  grid.push(week)

  calendar.value = grid
}

function selectDate(day) {
  if (!day.isCurrentMonth) return
  const dt = day.date

  if (!startDate.value || (startDate.value && endDate.value)) {
    // начинаем новый выбор
    startDate.value = dt
    endDate.value   = null
  }
  else if (!endDate.value) {
    const diff = Math.floor((dt - startDate.value) / (1000*60*60*24))
    if (dt >= startDate.value && diff < 7) {
      endDate.value = dt
      // вот тут мы «подтверждаем» новый интервал:
      confirmedStart.value = startDate.value
      confirmedEnd.value   = endDate.value
    }
    else if (diff >= 7) {
      toast.error('Максимальный период — 7 дней')
      return
    }
    else {
      startDate.value = dt
    }
  }

  updateSelection()
}


function updateSelection() {
  calendar.value.forEach(week =>
    week.forEach(day => {
      const t = day.date.getTime()
      day.isSelected = startDate.value
        ? endDate.value
          ? t>=startDate.value.getTime() && t<=endDate.value.getTime()
          : t===startDate.value.getTime()
        : false
    })
  )
}

// Открыть/закрыть модалку FindRecipe
function openFindRecipe(planId, dayKey, order) {
  modalContext.planId = planId
  modalContext.dateKey = convertDmyToYmd(dayKey)
  modalContext.order = order
  showFindRecipeModal.value = true
}
async function closeFindRecipe() {
  showFindRecipeModal.value = false;
  const { data: freshPlan } = await api.get(`/${selectedPlanId.value}`);
  const idx = plans.value.findIndex(p => p.id === freshPlan.id);
  if (idx !== -1) plans.value[idx] = freshPlan;
  loadMealsForPlan(freshPlan);
}

// Конвертация «dd.MM» → «YYYY-MM-DD»
function convertDmyToYmd(dmy) {
  const [dd, mm] = dmy.split('.')
  const year = selectedMonth.value.split('-')[0]
  return `${year}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`
}
</script>

<style scoped>
.meal-planner 
{ 
  display: flex; 
  gap: 40px; 
  padding: 20px;
  overflow: visible;
}
.image-container img { width: 400px;  border-radius: 8px; }

.planner { flex: 1; display: flex; flex-direction: column; gap: 20px; }
.planner-create 
{  
  font-size: 16px;
  width: 20%; 
  margin-left: 1%;
}
.planner-name { display: flex; align-items: center; }
.planName 
{ width: 50%; 
  height: 40px; 
  border-radius: 10px; 
  padding-left: 18px; 
  background-image: none;
}
.closeName { cursor: pointer; color:red; margin: 0 14px; }

.planner-body { display: flex; gap: 40px; }
.left { width: 30%; overflow: visible;}
.controls 
{ 
  display: flex; 
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  gap: 5px;
  overflow: visible;
}
.controls select { padding: 6px 10px; font-size: 16px; border-radius: 10px; height: 45px; }
.controls button { cursor: pointer; font-size: 16px; width: 90%; margin-top: 10px; }
  .calendar {
    border: 1px solid #333;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    }
.weekdays, .weeks .week { display: grid; grid-template-columns: repeat(7,1fr); }
.weekday { text-align: center; padding: 8px 0; font-weight: bold; background: #f0f0f0; }
.day { text-align: center; padding: 12px 0; cursor: pointer; border: 1px solid #333; font-size: 1.2rem; }
.other-month { opacity: 0.3; }
.selected { 
  background-color: #48825852; 
}

.selected-period
{ 
  margin-top: 24px; 
  overflow: visible;
  justify-content: center;
  margin-left: 5%; 
}
.selected-period input
 { 
  width: 90%; 
  padding: 8px; 
  font-size: 16px;
  border: 1px solid #333;
  border-radius: 10px; 
}

.shadow {
  box-shadow: 0 8px 12px rgba(0,0,0,0.15), 0 3px 4px rgba(0,0,0,0.1);
}
.shadow:hover {
  box-shadow: 0 10px 14px rgba(0,0,0,0.18), 0 5px 6px rgba(0,0,0,0.12);
}

.meals-grid { 
  margin-top: 30px; 
  overflow-x: auto; 
}

.meals-grid .meal-row:nth-of-type(odd) {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.03);
}
.meals-grid .meal-row:nth-of-type(even) {
  background-color: #ffffff7c;
  border-radius: 10px;
}
.meals-grid .meal-row .row-label {
  background-color: #c2c6ac44;
}


.header-row, .meal-row {
  display: grid;
  grid-template-columns: 100px repeat(auto-fit,minmax(80px,1fr));
  gap: 10px; align-items: center; margin-bottom: 10px;
}

.day-cell {
  background: #c2c6ac2b; 
  border: 1px solid rgba(128, 128, 128, 0.267);
  border-radius: 10px;
  height: 80px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.date-text { font-weight: bold; text-decoration: underline; }

.row-label {
  background: #c2c6ac2b;
  border-radius: 10px;
  border: 1px solid #8080802e;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  height: 140px;
  font-weight: bold;
}
.meal-cell 
{ 
  position: relative; 
  height: 130px; 
  width: 70%; 
  max-width: 110px;
  justify-self: center; }
.meal-img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.meal-title {
  position: absolute; bottom: 4px; left: 4px; right: 4px;
  background: rgba(0,0,0,0.5); color: #fff; font-size: 12px;
  text-align: center; border-radius: 2px;
}

.add-btn {
  margin-top: 20%;
  margin-left: 15%;
  width: 100%; 
  height: 100%; 
  max-width: 80px;
  max-height: 80px;
  background: #c2c6ac;
  border: none; 
  border-radius: 50%; 
  font-size: 28px; 
  cursor: pointer;
}
</style>
