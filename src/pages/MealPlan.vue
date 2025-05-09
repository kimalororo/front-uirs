<template>
  <div class="meal-planner">
      <!-- Левая картинка -->
      <div class="image-container">
        <img :src="plateImage" alt="Планировщик питания" />
      </div>

      <!-- Правая часть: заголовок, контролы, календарь, период -->
      <div class="planner">
        <h1>Персональный планировщик питания</h1> 
        <div class="planner-body"> 
            <div class="left">
            <!-- Выбор месяца и кнопка -->
            <div class="controls">
            <label>
                Месяц
                <select class="shadow" v-model="selectedMonth">
                <option
                    v-for="m in months"
                    :key="m.value"
                    :value="m.value"
                >{{ m.label }}</option>
                </select>
            </label>
            <my-button variant="filled" color="nvb" @click="generateCalendar">Показать</my-button>
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
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="weeks">
            <div v-for="(week, wIdx) in calendar" :key="wIdx" class="week">
              <div
                v-for="day in week"
                :key="day.date.toISOString()"
                class="day"
                :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected }"
                @click="selectDate(day)"
              >{{ day.date.getDate() }}</div>
            </div>
          </div>
        </div>
    </div>
</div>
</div>
      <!-- Сетка блюд -->
      <div class="meals-grid" v-if="selectedDays.length">
        <!-- Шапка: даты -->
        <div class="header-row">
          <div class="corner-cell"></div>
          <div
            v-for="day in selectedDays"
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
          <div class="row-label">Блюдо <br> № {{ row }}</div>
          <div
            v-for="day in selectedDays"
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
                @click="addMeal(row, day)"
            >+</button>
            </template>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import plateImg from '../components/icons/sausage.png'

const plateImage = plateImg
const weekdays = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.']
const months = ref([])
const selectedMonth = ref('')
const calendar = ref([])
const startDate = ref(null)
const endDate = ref(null)

// структура для блюд: meals[row][ 'dd.MM' ] = { image, title }
const meals = reactive({ 1: {}, 2: {}, 3: {}, 4: {} })
const hoveredCell = reactive({row: null, key: null})

// отформатированный текст выбранного периода
const periodText = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} – ${formatDate(endDate.value)}`
  } else if (startDate.value) {
    return formatDate(startDate.value)
  }
  return ''
})

// массив дат от startDate до endDate
const selectedDays = computed(() => {
  if (!startDate.value || !endDate.value) return []
  const days = []
  let d = new Date(startDate.value)
  while (d <= endDate.value) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
})

// ключ для словаря вида "dd.MM"
function keyOf(d) {
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  return `${dd}.${mm}`
}

// заглушка: по клику на "+" добавляем пример блюда
function addMeal(row, date) {
  const k = keyOf(date)
  meals[row][k] = {
    image: 'https://via.placeholder.com/80',
    title: 'Пример блюда'
  }
}

// инициализация списка месяцев (±6 от текущего)
function initMonths() {
  const now = new Date()
  const list = []
  for (let i = -6; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth()+i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()+1
    const value = `${year}-${String(month).padStart(2,'0')}`
    let label = d.toLocaleString('ru-RU',{ month:'long', year:'numeric' })
    label = label.charAt(0).toUpperCase() + label.slice(1)
    list.push({ value, label })
  }
  months.value = list
}

// построение сетки календаря
function generateCalendar() {
  startDate.value = null
  endDate.value = null

  const [year, month] = selectedMonth.value.split('-').map(Number)
  const firstDay = new Date(year, month-1, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const prevMonthDays = new Date(year, month-1, 0).getDate()

  const grid = []
  let week = []

  // дни предыдущего месяца
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(year, month-1, i - startWeekday + 1 + prevMonthDays)
    week.push({ date: d, isCurrentMonth: false, isSelected: false })
  }
  // дни текущего
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month-1, d)
    week.push({ date: dt, isCurrentMonth: true, isSelected: false })
    if (week.length === 7) {
      grid.push(week)
      week = []
    }
  }
  // дни следующего месяца
  let nd = 1
  while (week.length < 7) {
    const d = new Date(year, month, nd++)
    week.push({ date: d, isCurrentMonth: false, isSelected: false })
  }
  grid.push(week)

  calendar.value = grid
}

// выбор даты и ограничение периода 7 днями
function selectDate(day) {
  if (!day.isCurrentMonth) return
  const dt = day.date

  if (!startDate.value || (startDate.value && endDate.value)) {
    // начинаем новый выбор
    startDate.value = dt
    endDate.value = null
  }
  else if (!endDate.value) {
    if (dt >= startDate.value) {
      const msPerDay = 1000*60*60*24
      const diff = Math.floor((dt - startDate.value) / msPerDay)
      if (diff < 7) {
        endDate.value = dt
      } else {
        alert('Максимальный период — 7 дней')
        return
      }
    } else {
      // если кликнули раньше — меняем старт
      startDate.value = dt
    }
  }

  updateSelection()
}

// обновляем флаг isSelected у ячеек
function updateSelection() {
  calendar.value.forEach(week =>
    week.forEach(day => {
      const t = day.date.getTime()
      day.isSelected = startDate.value && endDate.value
        ? t >= startDate.value.getTime() && t <= endDate.value.getTime()
        : startDate.value
          ? t === startDate.value.getTime()
          : false
    })
  )
}

// формат "dd.MM"
function formatDate(d) {
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  return `${dd}.${mm}`
}

onMounted(() => {
  initMonths()
  const now = new Date()
  selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  generateCalendar()
})
</script>

<style scoped>
  .meal-planner {
    display: flex;
    gap: 40px;
    padding: 20px;
  }
  .image-container img {
    width: 400px;
    border-radius: 8px;
  }
  
.planner {
    flex: 1;
    display: flex;
    flex-direction: column; /* теперь колонки: сначала заголовок, потом body */
    gap: 20px;              /* расстояние между заголовком и body */
}

.planner-body {
  display: flex;
  gap: 40px; 
  overflow: visible;
}
  .h1 {
    font-size: 28px;
    margin-bottom: 24px;
  }
  .left {
    width: 30%;
  }
  .controls {
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    margin-top: 20px;
    overflow: visible;
  }
  .controls select {
    padding: 6px 10px;
    font-size: 16px;
    border-radius: 10px;
    height: 45px;
    margin-top: 4px;
    margin-bottom: 10px;
}
  .controls button {
    cursor: pointer;
    justify-content: center;
    font-size: 16px;
    margin-top: 14px;
    margin-left: 5%;
    width: 90%;
  }
  
  .calendar {
    border: 1px solid #333;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    }
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #f0f0f0;
  }
  .weekday {
    text-align: center;
    padding: 8px 0;
    font-weight: bold;
  }
  .weeks .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  .day {
    text-align: center;
    padding: 12px 0;
    cursor: pointer;
    border: 1px solid #333;
    font-size: 1.2rem;
  }
  .other-month {
    opacity: 0.3;
  }
  .selected {
    background-color: #48825852;
  }
  
  .selected-period {
    margin-top: 24px;
    overflow: visible;
  }
  .selected-period input {
    width: 160px;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 10px;
    margin-top: 4px;
    width: 100%;
  }
  .shadow {
  box-shadow:
    0 8px 12px rgba(0, 0, 0, 0.15),
    0 3px 4px rgba(0, 0, 0, 0.1);
}
.shadow:hover {
  box-shadow:
    0 10px 14px rgba(0, 0, 0, 0.18),
    0 5px 6px rgba(0, 0, 0, 0.12);
}
/* Сетка блюд */
.meals-grid {
  margin-top: 30px;
  overflow-x: auto;
}
.header-row,
.meal-row {
  display: grid;
  grid-template-columns: 100px repeat(auto-fit, minmax(80px, 1fr));
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.corner-cell {
  /* левая пустая */
}
.day-cell {
  background: #c2c6ac2b;
  border-radius: 10px;
  height: 80px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}
.date-text {
  font-weight: bold;
  text-decoration: underline;
}

.row-label {
  background: #c2c6ac2b;
  border-radius: 10px;
  font-weight: bold;
  height: 80px;
  padding: 0 8px;
}

.meal-cell {
  position: relative;
  width: 80px;
  height: 80px;
  justify-self: center;
}
.meal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.meal-title {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 12px;
  text-align: center;
  border-radius: 2px;
}

.add-btn {
  width: 100%;
  height: 100%;
  background: #c2c6ac;
  border: none;
  border-radius: 50%;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}
</style>
