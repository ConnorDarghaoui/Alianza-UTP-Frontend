<script setup lang="ts">
/**
 * @file src/components/ui/TimePicker.vue
 * @description Selector de hora con validación de formato.
 */
import { ref, computed, watch } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';

const props = defineProps<{
  modelValue?: string;
  label?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const timeInput = ref(props.modelValue || '');

const isValidTime = computed(() => {
  if (!timeInput.value) return true; // Vacío es válido si no es requerido
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeInput.value);
});

function updateTime(value: string) {
  timeInput.value = value;
  if (isValidTime.value) {
    emit('update:modelValue', value);
  }
}

// Formatear automáticamente cuando el usuario termina de escribir
function formatTime(value: string) {
  if (!value) return '';
  
  // Eliminar caracteres no numéricos
  let numericValue = value.replace(/\D/g, '');
  
  // Limitar a 4 dígitos
  if (numericValue.length > 4) {
    numericValue = numericValue.substring(0, 4);
  }
  
  // Insertar ':' después de los primeros 2 dígitos
  if (numericValue.length >= 3) {
    return `${numericValue.substring(0, 2)}:${numericValue.substring(2)}`;
  }
  
  return numericValue;
}

// Watch para sincronizar con el modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue !== timeInput.value) {
    timeInput.value = newValue || '';
  }
});
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }} {{ required ? '*' : '' }}
    </label>
    <BaseInput
      v-model="timeInput"
      @input="updateTime(formatTime($event.target.value))"
      :placeholder="'HH:MM'"
      :required="required"
      :class="{ 'border-red-500': !isValidTime && timeInput }"
    />
    <p v-if="!isValidTime && timeInput" class="text-xs text-red-500 mt-1">
      Formato inválido. Usa HH:MM (24 horas)
    </p>
  </div>
</template>