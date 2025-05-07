<template>
  <select v-model="selectedValue" @change="changeOption">
    <option disabled value="">Выберите из списка</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

function changeOption(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<style scoped>

</style>