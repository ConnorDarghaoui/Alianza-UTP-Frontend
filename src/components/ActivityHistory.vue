<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Historial de Actividades</h2>
    
    <div class="mb-4 flex space-x-4">
      <input type="text" v-model="searchQuery" placeholder="Buscar por palabra clave..." class="p-2 border rounded-md w-1/3">
      <input type="date" v-model="startDate" class="p-2 border rounded-md">
      <input type="date" v-model="endDate" class="p-2 border rounded-md">
    </div>

    <div class="bg-white shadow-md rounded-lg p-4">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="text-center">
            <td colspan="3" class="px-6 py-4 whitespace-nowrap text-gray-500">Cargando actividades...</td>
          </tr>
          <tr v-else-if="error" class="text-center">
            <td colspan="3" class="px-6 py-4 whitespace-nowrap text-red-500">{{ error }}</td>
          </tr>
          <tr v-else-if="filteredActivities.length === 0" class="text-center">
            <td colspan="3" class="px-6 py-4 whitespace-nowrap text-gray-500">No hay actividades disponibles</td>
          </tr>
          <tr v-else v-for="activity in filteredActivities" :key="activity.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.activity_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ activity.start_date ? new Date(activity.start_date).toLocaleDateString() : 'Sin fecha' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.activity_type || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { userDAO } from '@/services/dao/user.dao';
import type { Activity } from '@/services/dao/models/activity.model';

const authStore = useAuthStore();

// Estados locales para las actividades del usuario
const activities = ref<Activity[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');

const filteredActivities = computed(() => {
  return activities.value.filter((activity: Activity) => {
    // Usar start_date como fecha principal
    const activityDate = activity.start_date ? 
      new Date(activity.start_date) : null;
    
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    const matchesSearch = activity.activity_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDate = !activityDate || 
      ((!start || activityDate >= start) && (!end || activityDate <= end));

    return matchesSearch && matchesDate;
  });
});

// Función para cargar las actividades del usuario
const fetchUserActivities = async () => {
  if (!authStore.isAuthenticated) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    activities.value = await userDAO.getMyActivities();
  } catch (err: any) {
    error.value = 'Error cargando actividades';
    console.error('Error fetching user activities:', err);
  } finally {
    loading.value = false;
  }
};

// Cargar actividades al montar el componente
onMounted(() => {
  fetchUserActivities();
});
</script>