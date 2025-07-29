<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useClubStore } from '@/store/club.store';
import { CLUB_CATEGORIES } from '@/constants';

const router = useRouter();
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
    // After creating the club, redirect to the clubs list
    router.push({ name: 'ClubList' });
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al crear el club.';
  } finally {
    isLoading.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-darkText">Crear Nuevo Club</h1>
      <BaseButton @click="goBack" variant="secondary">Volver</BaseButton>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <form @submit.prevent="createClub" class="space-y-6">
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

        <div class="flex justify-end gap-3">
          <BaseButton type="button" @click="goBack" variant="secondary">Cancelar</BaseButton>
          <BaseButton type="submit" :disabled="isLoading">
            {{ isLoading ? 'Creando...' : 'Crear Club' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>