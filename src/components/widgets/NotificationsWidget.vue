<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useAuthStore } from '@/store/auth.store';
import { userDAO } from '@/services/dao/user.dao';
import type { Notification } from '@/services/dao/models/notification.model';

const authStore = useAuthStore();
const notifications = ref<Notification[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const readNotificationIds = ref<number[]>([]);

// Obtener notificaciones del usuario autenticado desde la API
const fetchNotifications = async () => {
  if (!authStore.isAuthenticated) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const [data, error] = await userDAO.getNotifications();
    
    // Verificar que la respuesta sea un array
    if (Array.isArray(data)) {
      notifications.value = data.slice(0, 3); // Solo mostrar las 3 más recientes
    } else {
      console.warn('Notifications response is not an array:', data);
      // Si la respuesta es un objeto con un array interno
      if (data && typeof data === 'object') {
        const objectData = data as any;
        const possibleArray = objectData.notifications || objectData.data || objectData.items;
        if (Array.isArray(possibleArray)) {
          notifications.value = possibleArray.slice(0, 3);
        } else {
          // Si no hay notificaciones válidas, usar array vacío
          notifications.value = [];
        }
      } else {
        // Si los datos no son un objeto ni un array, usar array vacío
        notifications.value = [];
      }
    }
  } catch (err: any) {
    error.value = 'Error cargando notificaciones';
    console.error('Error fetching notifications:', err);
    // Fallback a las notificaciones del store si hay error en API
    const userNotifications = authStore.user?.notifications;
    if (Array.isArray(userNotifications)) {
      notifications.value = userNotifications.slice(0, 3);
    } else {
      notifications.value = [];
    }
  } finally {
    loading.value = false;
  }
};

// Marcar notificaciones como leídas
const markNotificationsAsRead = async (ids: number[]) => {
  if (ids.length === 0) return;
  
  try {
    await userDAO.markNotificationsAsRead(ids.map(String));
    // Limpiar la lista de notificaciones leídas
    readNotificationIds.value = [];
  } catch (err: any) {
    console.error('Error marking notifications as read:', err);
  }
};

// Manejar clic en una notificación (marcar como leída)
const handleNotificationClick = (notificationId: number) => {
  if (!readNotificationIds.value.includes(notificationId)) {
    readNotificationIds.value.push(notificationId);
  }
};

// Cargar notificaciones al montar el componente
onMounted(() => {
  fetchNotifications();
});

// Marcar notificaciones como leídas cuando el componente se desmonta o cuando cambian
watch(readNotificationIds, (newIds, oldIds) => {
  // Solo procesar si hay nuevas notificaciones leídas
  if (newIds.length > oldIds.length) {
    const newReadIds = newIds.filter(id => !oldIds.includes(id));
    if (newReadIds.length > 0) {
      markNotificationsAsRead(newReadIds);
    }
  }
});

// Notificaciones computadas con fallback
const displayNotifications = computed(() => {
  if (notifications.value.length > 0) {
    return notifications.value;
  }
  // Fallback a notificaciones del store si están disponibles
  const userNotifications = authStore.user?.notifications;
  
  // Asegurar que sea un array antes de usar slice
  if (Array.isArray(userNotifications)) {
    return userNotifications.slice(0, 3);
  }
  
  return [];
});

// Función para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return 'Sin fecha';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} día${days !== 1 ? 's' : ''}`;
    }
  } catch {
    return dateString;
  }
};
</script>

<template>
  <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="font-bold text-lg text-darkText flex items-center gap-2 mb-4">
      <LucideIcon name="bell" :size="20" class="text-accent"/>
      Notificaciones
    </h3>
    <div class="space-y-3">
      <div v-if="loading" class="text-sm text-gray-500 text-center py-4">
        <p>Cargando notificaciones...</p>
      </div>
      <div v-else-if="error" class="text-sm text-red-500 text-center py-4">
        <p>{{ error }}</p>
      </div>
      <div v-else-if="displayNotifications.length === 0" class="text-sm text-gray-500 text-center py-4">
        <p>No hay notificaciones nuevas</p>
      </div>
      <div 
        v-else 
        v-for="notif in displayNotifications" 
        :key="notif.id" 
        @click="handleNotificationClick(notif.id)"
        class="text-sm border-l-4 border-accent pl-3 cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{ 'bg-blue-50': !readNotificationIds.includes(notif.id) }"
      >
        <p class="font-medium text-darkText">{{ notif.message || 'Notificación sin texto' }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatDate(notif.created_at) || 'Sin fecha' }}</p>
      </div>
    </div>
  </div>
</template>