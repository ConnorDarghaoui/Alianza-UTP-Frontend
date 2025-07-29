<script setup lang="ts">
/**
 * @file: src/views/club/Settings.vue
 * @description: Vista para la configuración de un club.
 * - INTEGRA: El diseño de UI completo con la lógica de stores y modales.
 */
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useClubStore } from '@/store/club.store';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { Club } from '@/services/dao/models/club.model';

const route = useRoute();
const clubStore = useClubStore();
const { selectedClub } = storeToRefs(clubStore);
const clubDetails = computed(() => selectedClub.value?.details);
const clubId = Number(route.params.id);

// --- ESTADO LOCAL DEL FORMULARIO ---
const form = ref<Partial<Club>>({});
const logoPreview = ref<string | null>(null);
const showDangerModal = ref(false);
const dangerActionType = ref<'transfer' | 'archive' | 'delete' | null>(null);
const confirmationText = ref('');

// --- LÓGICA DE SINCRONIZACIÓN ---
watch(clubDetails, (newDetails) => {
  if (newDetails) {
    form.value = {
      name: newDetails.name,
      description: newDetails.description,
      category: newDetails.category,
      logo_url: newDetails.logo_url,
      status: newDetails.status
    };
    logoPreview.value = newDetails.logo_url || null;
  }
}, { immediate: true });

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) logoPreview.value = URL.createObjectURL(file);
}

function saveChanges() {
  // clubStore.updateClubSettings(clubId, form.value);
}

// --- LÓGICA PARA ZONA PELIGROSA ---
const dangerDetails = {
  transfer: { title: "Transferir Liderazgo", msg: "Esta acción es irreversible." },
  archive: { title: "Archivar Club", msg: "El club no será visible públicamente." },
  delete: { title: "Eliminar Club", msg: "¡Peligro! Se eliminarán todos los datos." }
};
function openDangerModal(action: 'transfer' | 'archive' | 'delete') {
  dangerActionType.value = action;
  showDangerModal.value = true;
}
function closeDangerModal() {
  showDangerModal.value = false;
  confirmationText.value = '';
  dangerActionType.value = null;
}
function executeDangerAction() {
    if (confirmationText.value !== clubDetails.value?.name) return;
    console.log(`Ejecutando acción: ${dangerActionType.value}`);
    // Aquí se debería llamar a la acción del store correspondiente
    if (dangerActionType.value === 'transfer') {
      // clubStore.transferLeadership(clubId, newLeaderId);
    } else if (dangerActionType.value === 'archive') {
      // clubStore.archiveClub(clubId);
    } else if (dangerActionType.value === 'delete') {
      // clubStore.deleteClub(clubId);
    }
    closeDangerModal();
}

// --- CICLO DE VIDA ---
onMounted(() => { clubStore.fetchClubDetails(clubId); });
</script>

<template>
  <div v-if="clubDetails" class="space-y-8">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Información del Club</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
            <label class="block text-sm font-medium text-gray-700">Nombre del Club</label>
            <input type="text" v-model="form.name" class="input-focus-effect w-full" />
            
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea v-model="form.description" rows="5" class="input-focus-effect w-full"></textarea>
            
            <label class="block text-sm font-medium text-gray-700">Categoría</label>
            <input type="text" v-model="form.category" class="input-focus-effect w-full" />
            
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <select v-model="form.status" class="input-focus-effect w-full">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
        </div>
        <div class="md:col-span-1">
          <img :src="logoPreview || 'https://via.placeholder.com/150'" alt="Logo" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md mx-auto">
          <input id="file-upload" type="file" @change="handleFileChange" class="hidden" accept="image/*"/>
          <label for="file-upload" class="cursor-pointer mt-4 block text-center text-sm font-semibold text-primary hover:underline">Cambiar logo</label>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
        <BaseButton @click="saveChanges" :disabled="clubStore.isLoadingDetails">
            Guardar Cambios
        </BaseButton>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Permisos del Club</h3>
      <p class="text-gray-600">Aquí se gestionarán los roles y accesos de los miembros del club por módulo.</p>
      <!-- TODO: Implementar la matriz de chequeo de permisos (RF5.4.3) -->
      <div class="mt-4 p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
        <p>Sección de Permisos en construcción.</p>
        <p>Aquí irá la matriz de chequeo para asignar roles y accesos.</p>
      </div>
    </div>

    <div class="p-6 rounded-xl border-2 border-dashed border-red-400 bg-red-50">
        <h3 class="text-lg font-bold text-red-800">Zona Peligrosa</h3>
        <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Transferir Liderazgo</h4><p class="text-sm text-red-600">Asigna a otro miembro como administrador.</p></div>
                <BaseButton @click="openDangerModal('transfer')" variant="danger">Transferir</BaseButton>
            </div>
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Archivar Club</h4><p class="text-sm text-red-600">El club no será visible públicamente.</p></div>
                <BaseButton @click="openDangerModal('archive')" variant="danger">Archivar</BaseButton>
            </div>
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Eliminar Club</h4><p class="text-sm text-red-600">Esta acción no se puede deshacer.</p></div>
                <BaseButton @click="openDangerModal('delete')" variant="danger">Eliminar</BaseButton>
            </div>
        </div>
    </div>
    
    <div v-if="showDangerModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-red-800">{{ dangerDetails[dangerActionType!]?.title }}</h3>
            <p class="text-gray-600 mt-2">{{ dangerDetails[dangerActionType!]?.msg }}</p>
            <p class="mt-4 text-sm text-gray-700">Para confirmar, escribe: <strong class="text-primary">{{ clubDetails?.name }}</strong></p>
            <input v-model="confirmationText" type="text" class="input-focus-effect w-full mt-2" />
          </div>
          <div class="bg-gray-50 p-4 flex justify-end gap-3">
            <BaseButton @click="closeDangerModal" variant="secondary">Cancelar</BaseButton>
            <BaseButton @click="executeDangerAction" :disabled="confirmationText !== clubDetails?.name" variant="danger">Confirmar</BaseButton>
          </div>
      </div>
    </div>
  </div>
</template>