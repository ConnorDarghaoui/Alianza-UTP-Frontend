<script setup lang="ts">
/**
 * @file src/components/modals/EditProfileModal.vue
 * @description Modal para editar la información del usuario.
 * - Utiliza la arquitectura correcta: sin fondo propio y usando acciones del store.
 * - Mantiene el diseño simple con los 3 campos solicitados.
 */
import { reactive } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useAuthStore } from '@/store/auth.store';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// Obtenemos la instancia del store.
const userStore = useUserStore();
const authStore = useAuthStore();

// Creamos un formulario reactivo solo con los campos necesarios.
// Se inicializa con los datos actuales del usuario desde el store.
const form = reactive({
  name: authStore.user?.name || '',
  last_name: authStore.user?.last_name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  about_me: authStore.user?.about_me || '',
  career: authStore.user?.career || ''
});

/**
 * @docstring
 * Guarda los cambios llamando a la acción del store y luego cierra el modal.
 */
function saveChanges() {
  // Usamos la acción para asegurar que el estado se mute correctamente.
  userStore.updateProfile(form);
  userStore.closeAllModals();
}
</script>

<template>
  <div class="bg-white rounded-lg w-full max-w-lg shadow-xl">
    
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="text-lg font-bold">Editar información personal</h3>
      <button 
        @click="userStore.closeAllModals()" 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <LucideIcon name="x" :size="24" />
      </button>
    </div>

    <div class="p-6 space-y-4">
      <BaseInput label="Nombre completo"    v-model="form.name" />
      <BaseInput label="Correo electrónico" v-model="form.email" type="email" />
    </div>

    <div class="p-4 border-t flex justify-end gap-3">
      <BaseButton @click="userStore.closeAllModals()" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="saveChanges">Guardar cambios</BaseButton>
    </div>
  </div>
</template>