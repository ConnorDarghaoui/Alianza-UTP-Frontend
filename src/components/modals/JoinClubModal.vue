<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ModalOverlay from '@/components/ui/ModalOverlay.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useClubStore } from '@/store/club.store';
import { useUserStore } from '@/store/user.store';
import { useAuthStore } from '@/store/auth.store';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['close']);

const clubStore = useClubStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const { clubs, isLoadingList } = storeToRefs(clubStore);
const { user } = storeToRefs(authStore);

const searchQuery = ref('');
const errorMessage = ref('');

// Filtrar clubes: no mostrar los que ya son del usuario
const availableClubs = computed(() => {
  if (!clubs.value) return [];
  const userClubIds = new Set(clubs.value.map(c => c.id));

  return clubs.value.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const isNotMyClub = !userClubIds.has(club.id);
    
    return matchesSearch && isNotMyClub;
  });
});

async function requestJoin(clubId: number) {
  errorMessage.value = '';
  try {
    await clubStore.requestToJoinClub(clubId);
    // userStore.showToast('Solicitud enviada con éxito!', 'success'); // No es necesaria si las modales se manejan localmente
    emit('close');
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al enviar solicitud.';
    // userStore.showToast(errorMessage.value, 'error'); // No es necesaria si las modales se manejan localmente
  }
}

function close() {
  emit('close');
}

onMounted(() => {
  clubStore.fetchAllClubs();
  clubStore.fetchAllClubs();
});
</script>

<template>
  <ModalOverlay @close="close">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-darkText">Unirme a un Club</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" :size="24" />
        </button>
      </div>

      <div class="mb-4">
        <BaseInput
          id="clubSearch"
          v-model="searchQuery"
          type="text"
          placeholder="Buscar club por nombre..."
          class="w-full"
        />
      </div>

      <div v-if="isLoadingList" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-500 mt-2">Cargando clubes...</p>
      </div>

      <div v-else-if="availableClubs.length > 0" class="space-y-3 max-h-60 overflow-y-auto pr-2">
        <div v-for="club in availableClubs" :key="club.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <h4 class="font-semibold text-darkText">{{ club.name }}</h4>
            <p class="text-sm text-gray-500">{{ club.description }}</p>
          </div>
          <BaseButton 
            @click="requestJoin(club.id)"
            :loading="isLoadingList"
            :disabled="isLoadingList"
            size="sm"
          >
            Solicitar Unión
          </BaseButton>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <p>No hay clubes disponibles para unirte o ya has enviado una solicitud.</p>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-sm mt-4">{{ errorMessage }}</p>
    </div>
  </ModalOverlay>
</template>