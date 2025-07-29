<script setup lang="ts">
/**
 * @file src/components/NotificationPanel.vue
 * @description Panel desplegable que muestra las notificaciones recientes.
 */
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import type { Notification } from '@/services/dao/models/notification.model';

const emit = defineEmits(['notification-clicked']);
const rootElement = ref<HTMLElement | null>(null);
const authStore = useAuthStore();
const userStore = useUserStore();
const readNotificationIds = ref<number[]>([]);

// Obtener notificaciones del usuario autenticado
const notifications = computed((): Notification[] => {
  // Primero intentamos obtener notificaciones del userStore
  if (userStore.notifications && userStore.notifications.length > 0) {
    return userStore.notifications;
  }
  // Fallback a las notificaciones en authStore
  return authStore.user?.notifications || [];
});

function handleClickNotification(notif: Notification) {
  // Marcar como leída localmente
  if (!readNotificationIds.value.includes(notif.id)) {
    readNotificationIds.value.push(notif.id);
    // Emitir evento al componente padre
    emit('notification-clicked', notif.id);
  }
}

// Marcar notificaciones como leídas
async function markNotificationsAsRead() {
  if (readNotificationIds.value.length > 0) {
    try {
      await userStore.markNotificationsAsRead(readNotificationIds.value.map(String));
      // Limpiar la lista de notificaciones leídas
      readNotificationIds.value = [];
    } catch (err: any) {
      console.error('Error marking notifications as read:', err);
    }
  }
}

defineExpose({ rootElement });
</script>

<template>
  <div ref="rootElement" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-xl bg-card ring-1 ring-black ring-opacity-5 focus:outline-none text-darkText" @click.stop>
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-bold text-lg">Notificaciones</h3>
    </div>
    <div class="py-1">
      <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
        <p>No hay notificaciones nuevas</p>
      </div>
      <div v-else v-for="notif in notifications" :key="notif.id" @click="handleClickNotification(notif)" class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer" :class="{ 'bg-blue-50': !readNotificationIds.includes(notif.id) }">
        <p class="font-medium text-darkText">{{ notif.message || 'Notificación sin texto' }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ new Date(notif.created_at).toLocaleDateString() }}</p>
      </div>
    </div>
    <div class="p-2 border-t border-gray-200 text-center">
      <RouterLink to="#" class="text-sm font-semibold text-primary hover:underline">
        Ver todas las notificaciones
      </RouterLink>
    </div>
  </div>
</template>