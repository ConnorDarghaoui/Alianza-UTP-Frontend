<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Mis Clubs</h2>
    <div class="bg-white shadow-md rounded-lg p-4">
      <div v-if="clubStore.isLoadingList" class="text-center py-8">
        <p class="text-gray-500">Cargando clubs...</p>
      </div>
      <div v-else-if="clubs.length === 0" class="text-center py-8">
        <p class="text-gray-500">No tienes clubs registrados</p>
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="club in clubs" :key="club.groupId" class="py-4 flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">{{ club.group_name }}</p>
            <p class="text-sm text-gray-500">{{ club.group_category }}</p>
          </div>
          <span :class="club.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ club.status === 'Activo' ? 'Activo' : 'Inactivo' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useClubStore } from '@/store/club.store';
import { useAuthStore } from '@/store/auth.store';

const clubStore = useClubStore();
const authStore = useAuthStore();

// Obtener clubs del usuario desde el store
const clubs = computed(() => clubStore.clubs);

// Cargar clubs al montar el componente
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await clubStore.fetchAllClubs();
    } catch (error) {
      console.error('Error cargando clubs del usuario:', error);
    }
  }
});
</script>