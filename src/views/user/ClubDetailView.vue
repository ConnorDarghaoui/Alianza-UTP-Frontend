<script setup lang="ts">
/**
 * @file src/views/ClubDetailView.vue
 * @description Muestra el perfil completo de un club, incluyendo su
 * información, miembros y actividades.
 */
import { onMounted, computed } from 'vue';
import { useClubStore } from '@/store/club.store';
import { storeToRefs } from 'pinia';

import LucideIcon from '@/components/ui/LucideIcon.vue';

const props = defineProps<{ id: string }>();

const clubStore = useClubStore();

// Hacemos el estado reactivo para la UI
const { selectedClub, isLoadingDetails } = storeToRefs(clubStore);

// Al montar el componente, buscamos toda la información necesaria
onMounted(() => {
  clubStore.fetchClubDetails(props.id);
});

// Busca al propietario dentro de la lista de miembros cargada
const owner = computed(() => {
    if (!selectedClub.value || !selectedClub.value.members) return null;
    // Assuming the backend provides the owner_id in the Club DTO or that the first admin/leader is the owner
    // For now, just a placeholder
    return selectedClub.value.members.find((m: any) => m.role === 'admin' || m.role === 'leader');
});
</script>

<template>
  <div v-if="selectedClub && !isLoadingDetails" class="p-4 sm:p-6 lg:p-8">
    <header class="mb-8">
      <div class="h-40 bg-gray-200 rounded-xl flex items-center justify-center bg-cover bg-center" style="background-image: url('https://via.placeholder.com/1200x200/00205B/FFFFFF?text=Banner+del+Club')">
        </div>
      <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:ml-8 gap-4">
        <div class="w-24 h-24 bg-accent rounded-full border-4 border-white flex items-center justify-center shrink-0">
          <LucideIcon name="users" :size="36" class="text-primary"/>
        </div>
        <div class="flex-grow text-center sm:text-left">
          <h1 class="text-3xl font-bold text-darkText">{{ selectedClub.details.group_name }}</h1>
          <p class="text-gray-500">{{ selectedClub.details.group_category || 'Categoría no especificada' }}</p>
        </div>
        <button class="px-6 py-2 text-white font-semibold bg-primary rounded-lg hover:bg-primary-dark transition shrink-0">
          Unirse al Club
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-3">Acerca de este club</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ selectedClub.details.group_description || 'No hay descripción disponible.' }}</p>
        </div>
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-4">Próximas Actividades del Club</h2>
          <div v-if="selectedClub.activities.length > 0" class="space-y-3">
            <div v-for="act in selectedClub.activities" :key="act.activityId" class="p-3 rounded-md hover:bg-gray-50 flex justify-between items-center cursor-pointer">
              <div>
                <p class="font-semibold">{{ act.name }}</p>
                <p class="text-sm text-gray-500">{{ new Date(act.start_date).toLocaleDateString('es-PA') }}</p>
              </div>
              <LucideIcon name="chevron-right" class="text-gray-400"/>
            </div>
          </div>
          <p v-else class="text-gray-500">Este club no tiene actividades próximas.</p>
        </div>
      </div>
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-card border border-gray-200 p-5 rounded-xl">
          <h3 class="font-bold text-lg mb-3">Miembros ({{ selectedClub.members.length }})</h3>
          <div v-if="selectedClub.members.length > 0" class="flex -space-x-2 overflow-hidden">
            <img v-for="member in selectedClub.members.slice(0, 7)" :key="member.userId" class="inline-block h-10 w-10 rounded-full ring-2 ring-white" :src="member.profile_photo_url || `https://i.pravatar.cc/40?u=${member.userId}`" :alt="member.name">
            <div v-if="selectedClub.members.length > 7" class="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center font-semibold text-sm">+{{ selectedClub.members.length - 7 }}</div>
          </div>
           <p v-else class="text-sm text-gray-500">Sé el primer miembro.</p>
        </div>
        <div class="bg-card border border-gray-200 p-5 rounded-xl space-y-3 text-sm">
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Propietario:</span><span>{{ owner?.name || 'No disponible' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Categoría:</span><span>{{ selectedClub.details.group_category }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Creado en:</span><span>{{ new Date(selectedClub.details.createdAt).toLocaleDateString('es-PA') }}</span></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-16">Cargando detalles del club...</div>
</template>