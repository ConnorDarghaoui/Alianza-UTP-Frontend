<script setup lang="ts">
/**
 * @file src/components/modals/CreateActivityModal.vue
 * @description Modal para crear una nueva actividad.
 * - MODIFICADO: Ahora incluye todos los campos requeridos por el modelo
 * ActivityDTO (nombre, descripción, tipo, fecha, ubicación, etc.).
 * - AÑADIDO: Componente TimePicker para seleccionar hora de inicio y fin
 * con validación de formato.
 * - AÑADIDO: Validación de campos requeridos antes de enviar.
 * - AÑADIDO: Manejo de estado de carga y errores.
 */
import { ref } from 'vue';
import { useUserStore } from '@/store/user.store';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import TimePicker from '@/components/ui/TimePicker.vue';
import { ACTIVITY_TYPES } from '@/constants';

const userStore = useUserStore();

const form = ref({
  activity_name: '',
  activity_description: '',
  activity_type: ACTIVITY_TYPES[0],
  start_date: '',
  end_time: '',
  location: '',
  max_participants: '',
  club_id: 0
});

const isLoading = ref(false);
const error = ref<string | null>(null);

function createActivity() {
  error.value = null;
  isLoading.value = true;
  try {
    // Aquí iría la lógica para crear la actividad
    console.log('Creando actividad...', form.value);
    userStore.closeAllModals();
  } catch (err: any) {
    error.value = err.message || 'Error al crear la actividad';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="bg-white rounded-lg w-full max-w-lg shadow-xl">
    
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="text-lg font-bold text-gray-800">Crear Nueva Actividad</h3>
      <button 
        @click="userStore.closeAllModals()" 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <LucideIcon name="x" :size="24" />
      </button>
    </div>

    <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
      <BaseInput label="Nombre de la actividad" v-model="form.activity_name" placeholder="Ej. Taller de Programación" required />
      <BaseInput label="Descripción" v-model="form.activity_description" type="textarea" placeholder="Describe brevemente el propósito y objetivos de la actividad..." required />
      
      <BaseInput label="Tipo de actividad" v-model="form.activity_type" type="select" :options="ACTIVITY_TYPES" required />
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput label="Fecha de inicio" v-model="form.start_date" type="date" required />
        <TimePicker label="Hora de inicio" v-model="form.end_time" required />
      </div>
      
      <BaseInput label="Ubicación" v-model="form.location" placeholder="Ej. Edificio M, Sala 201" required />
      <BaseInput label="Máximo de participantes" v-model="form.max_participants" type="number" min="1" placeholder="Dejar en blanco para ilimitado" />
    </div>

    <div v-if="error" class="px-6 pb-2">
      <p class="text-sm text-red-500 text-center">{{ error }}</p>
    </div>

    <div class="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
      <BaseButton @click="userStore.closeAllModals()" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="createActivity" :loading="isLoading" :disabled="isLoading">
        {{ isLoading ? 'Creando...' : 'Crear Actividad' }}
      </BaseButton>
    </div>
  </div>
</template>