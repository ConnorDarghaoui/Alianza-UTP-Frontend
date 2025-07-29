<script setup lang="ts">
/**
 * @file src/components/QuickActions.vue
 * @description Muestra un cabezal de bienvenida y acciones rápidas contextuales.
 * - REDISEÑADO: Ahora es una "Tarjeta de Bienvenida" para anclar visualmente las acciones.
 * - AÑADIDO: Lógica de permisos. El botón "Crear actividad" solo es visible
 * para usuarios con roles de administrador o líder.
 * - MODIFICADO: Incluye foto de perfil del usuario.
 */
import { computed } from 'vue';
import { useUserStore } from '@/store/user.store';
import { useAuthStore } from '@/store/auth.store';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload.vue';
import { RouterLink } from 'vue-router';

const emit = defineEmits(['createActivity', 'joinClub']);

const userStore = useUserStore();
const authStore = useAuthStore();

// Obtenemos el nombre del usuario para el saludo.
const userName = computed((): string => {
  const user = authStore.user;
  if (!user) return 'Usuario';
  return user.firstName || user.username || 'Usuario';
});

// Saludo dinámico basado en el género del usuario
const welcomeMessage = computed((): string => {
  const user = authStore.user;
  const name = user?.firstName || user?.username || 'Usuario';
  
  // Lógica de género: 'Masculino' = masculino, 'Femenino' = femenino, por defecto neutral
  if (user?.gender === 'Masculino') {
    return `¡Bienvenido, ${name}!`;
  } else if (user?.gender === 'Femenino') {
    return `¡Bienvenida, ${name}!`;
  } else {
    // Saludo neutral para casos donde no hay información de género
    return `¡Bienvenido/a, ${name}!`;
  }
});

/**
 * @docstring
 * Propiedad computada que determina si el usuario actual tiene permisos
 * para crear contenido (actividades, clubs, etc.).
 * @returns {boolean}
 */
const userCanCreateContent = computed(() => {
  const userRoles = authStore.user?.roles || [];
  // Ajusta los roles según tu backend (ej. 'ADMIN', 'LEADER')
  return userRoles.includes('ADMIN') || userRoles.includes('LEADER');
});
</script>

<template>
  <div class="mb-10 p-6 bg-card border border-gray-200 rounded-xl shadow-sm">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      
      <div class="flex items-center gap-4">
        <!-- Foto de perfil del usuario -->
        <ProfilePictureUpload 
          :current-image-url="authStore.user?.profile_image_url"
          size="medium"
          :show-upload-button="false"
        />
        
        <div>
          <h2 class="text-2xl font-bold text-darkText">{{ welcomeMessage }}</h2>
          <p class="text-gray-500">¿Qué te gustaría hacer hoy?</p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
        
        <button
          v-if="userCanCreateContent"
          @click="emit('createActivity')"
          class="btn-quick-action bg-accent text-primary border-transparent"
          aria-label="Crear nueva actividad"
        >
          <LucideIcon name="plus-circle" :size="20" />
          <span class="hidden sm:inline">Crear actividad</span>
        </button>

        <button 
          @click="emit('joinClub')"
          class="btn-quick-action bg-white text-darkText border-gray-300"
          aria-label="Unirme a un club existente"
        >
          <LucideIcon name="users" :size="20" />
          <span class="hidden sm:inline">Unirme a club</span>
        </button>

        <RouterLink
          :to="{ name: 'ActivityList' }"
          class="btn-quick-action bg-white text-darkText border-gray-300"
          aria-label="Buscar eventos y actividades"
        >
          <LucideIcon name="search" :size="20" />
          <span class="hidden sm:inline">Buscar eventos</span>
        </RouterLink>

      </div>
    </div>
  </div>
</template>

<!-- Los estilos para .btn-quick-action ahora están centralizados en style.css -->