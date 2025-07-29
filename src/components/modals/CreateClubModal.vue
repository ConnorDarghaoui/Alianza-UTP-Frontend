<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import ModalOverlay from '@/components/ui/ModalOverlay.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useClubStore } from '@/store/club.store';

import { CLUB_CATEGORIES } from '@/constants';

const emit = defineEmits(['close', 'clubCreated']);

const clubStore = useClubStore();

const form = ref({
  name: '',
  description: '',
  category: 'academic', // Default type
  contact_info: [
    {
      name: 'Email principal',
      type: 'email',
      value: '',
      primary: true
    }
  ]
});

const isLoading = ref(false);
const errorMessage = ref('');

async function createClub() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await clubStore.create(form.value);
    emit('clubCreated');
    emit('close');
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al crear el club.';
  } finally {
    isLoading.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<template>
  <ModalOverlay @close="close">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-darkText">Crear Nuevo Club</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" :size="24" />
        </button>
      </div>

      <form @submit.prevent="createClub" class="space-y-4">
        <BaseInput
          id="clubName"
          label="Nombre del Club"
          v-model="form.name"
          type="text"
          placeholder="Ej. Club de Lectura"
          required
        />
        <BaseInput
          id="clubDescription"
          label="Descripción"
          v-model="form.description"
          type="textarea"
          placeholder="Describe brevemente el propósito del club..."
          required
        />
        <BaseInput
          id="clubType"
          label="Tipo de Club"
          v-model="form.category"
          type="select"
          :options="CLUB_CATEGORIES"
          required
        />

        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <div class="flex justify-end gap-3 mt-6">
          <BaseButton type="button" @click="close" variant="secondary">Cancelar</BaseButton>
          <BaseButton type="submit" :disabled="isLoading">
            {{ isLoading ? 'Creando...' : 'Crear Club' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </ModalOverlay>
</template>

<style scoped>
/* Estilos específicos si son necesarios */
</style>