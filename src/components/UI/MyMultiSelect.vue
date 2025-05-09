<template>
  <div class="search-multiselect">
    <div class="input-wrapper">
      <input
        ref="inputRef"
        v-model="localSearchQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @focus="changeToVisible"
      />
      <button
          v-if="localSearchQuery"
          class="clear-btn"
          @click.stop="clearSearch"
          aria-label="Очистить поиск"
        >×</button>
    </div>
    <transition name="fade-slide">
      <ul v-show="showResults" ref="resultsRef" @scroll="onScroll" class="items-list">
        <li v-for="item in filteredItems" :key="item[idKey]" class="item">
          <label>
            <input
              type="checkbox"
              :value="item"
              v-model="selectedItems"
            />
            {{ item[labelKey] }}
          </label>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items:       { type: Array, required: true },
  modelValue:  { type: Array, default: () => [] },
  labelKey:    { type: String, default: 'name' },
  idKey:       { type: String, default: 'value' },
  searchQuery: { type: String, default: '' },
  placeholder: { type: String, default: 'Поиск...' }
})

const emit = defineEmits([ 
  'update:modelValue', 
  'update:searchQuery',
  'reachEnd'
])

const showResults = ref(false)
const resultsRef = ref(null)
const inputRef = ref(null)

const changeToVisible = () => {
  showResults.value = true;
}

const onScroll = (e) => {
  const el = e.target
  // если добрались до низа (с запасом 10px)
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    emit('reachEnd')
  }
}

const handleClickOutside = (event) => {
  const clickInInput   = inputRef.value?.contains(event.target);
  const clickInResults = resultsRef.value?.contains(event.target);
  if (!clickInInput && !clickInResults) {
    showResults.value = false;
  }
};

function clearSearch() {
  localSearchQuery.value = ''
  emit('update:searchQuery', '')
  if(showResults.value == false)
  {
    changeToVisible()
  }
  inputRef.value.focus()
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const localSearchQuery = ref(props.searchQuery)
watch(() => props.searchQuery, q => {
  if (q !== localSearchQuery.value) localSearchQuery.value = q
})
watch(localSearchQuery, q => {
  emit('update:searchQuery', q)
})

const filteredItems = computed(() => {
  // копируем массив, чтобы не мутировать props.items
  return props.items.slice().sort((a, b) => {
    const aSel = selectedItems.value.some(
      sel => sel[props.idKey] === a[props.idKey]
    )
    const bSel = selectedItems.value.some(
      sel => sel[props.idKey] === b[props.idKey]
    )
    if (aSel && !bSel) return -1
    if (!aSel && bSel) return 1
    return 0
  })
})

const selectedItems = computed({
  get:  () => props.modelValue,
  set:  val => emit('update:modelValue', val)
})

</script>

<style scoped>
.search-multiselect 
{ 
  max-width: 300px; 
  position: relative; 
}
.input-wrapper {
  position: relative;
}
.search-input {
  width: 100%;
  height: 40px;
  padding-left: 10px;
  padding-right: 2em; 
  border-radius: 10px;
  border: solid light-dark(rgb(118, 118, 118), rgb(133, 133, 133)) 1px;
  font-size: 1rem;   
  text-align: center;
}
.search-input :focus{
  border: solid black 0.2px;
  border-radius: 10px 10px 0 0;
}
.clear-btn {
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 1.2em;
  line-height: 1;
  cursor: pointer;
  color: #999;
}
.clear-btn:hover {
  color: #555;
}
.items-list {
  list-style: none; margin: 0; padding: 0;
  max-height: 200px; overflow-y: auto;
  border: 1px solid #ccc; border-radius: 4px;
}
.item { padding: .3em .5em; }
.item:nth-child(odd) { background: #f9f9f9; }

/* Анимация открытия/закрытия */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
  overflow: hidden;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
  overflow: hidden;
}
</style>
