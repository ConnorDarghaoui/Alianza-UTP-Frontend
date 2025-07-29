<script setup lang="ts">
/**
 * @file src/components/ui/ProfilePictureUpload.vue
 * @description Componente para mostrar la foto de perfil del usuario y permitir su cambio
 * a través de un modal dedicado. Ahora es un componente de visualización y activación.
 */
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import LucideIcon from '@/components/ui/LucideIcon.vue';

// Props
interface Props {
  currentImageUrl?: string | null;
  size?: 'small' | 'medium' | 'large';
  showUploadButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showUploadButton: true
});

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Computed
const displayUrl = computed(() => {
  return props.currentImageUrl || authStore.user?.profile_image_url || null;
});

const avatarSize = computed(() => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };
  return sizes[props.size];
});

const defaultAvatar = computed(() => {
  const userId = authStore.user?.id || 1;
  return `https://i.pravatar.cc/150?u=${userId}`;
});

// Métodos
function openProfilePictureUploadModal() {
  // userStore.openModal('profilePictureUpload'); // No es necesaria si las modales se manejan localmente
}
</script>

<template>
  <div class="relative inline-block">
    <!-- Avatar Display -->
    <div :class="[avatarSize, 'rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 relative']">
      <img 
        v-if="displayUrl"
        :src="displayUrl" 
        :alt="authStore.user?.firstName || 'Usuario'"
        class="w-full h-full object-cover"
        @error="(e) => (e.target as HTMLImageElement).src = defaultAvatar"
      />
      <img 
        v-else
        :src="defaultAvatar" 
        :alt="authStore.user?.firstName || 'Usuario'"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Upload Button -->
    <button 
      v-if="showUploadButton"
      @click="openProfilePictureUploadModal"
      class="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors shadow-lg"
      title="Cambiar foto de perfil"
    >
      <LucideIcon name="camera" :size="16" />
    </button>
  </div>
</template>