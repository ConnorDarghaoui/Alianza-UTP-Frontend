<script setup lang="ts">
/**
 * @file: src/views/club/Dashboard.vue
 * @description: Dashboard principal para administradores de club.
 * - CORREGIDO: Se ajusta la sintaxis de importación de useFinanceStore
 * para que coincida con su exportación nombrada.
 */
import { computed, onMounted, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import StatCard from '@/components/ui/StatCard.vue';
import BaseChart from '@/components/ui/BaseChart.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useActivityStore } from '@/store/activity.store';
import { useClubStore } from '@/store/club.store';
import { useFinanceStore } from '@/store/finance.store';
import { storeToRefs } from 'pinia';
import type { Activity } from '@/services/dao/models/activity.model';

// --- STORES Y ROUTER ---
const route = useRoute();
const clubId = computed(() => Number(route.params.id));
const activityStore = useActivityStore();
const clubStore = useClubStore();
const financeStore = useFinanceStore();

// --- ESTADO REACTIVO ---
const { 
  selectedClub,
  isLoadingDetails: clubLoading 
} = storeToRefs(clubStore);

const { 
  activities,
  isLoading: activityLoading,
} = storeToRefs(activityStore);

const enrollmentStats = computed(() => selectedClub.value?.stats?.enrollmentStats || []);

const { 
  // summary: financeSummary,
  // hasFunds 
} = storeToRefs(financeStore);

// TODO: Descomentar cuando los tipos estén disponibles
const financeSummary = ref(null);
const hasFunds = ref(false);

// --- ESTADO LOCAL PARA FILTROS DE EVENTOS ---
const eventFilters = ref({
  keyword: '',
  type: 'all',
  status: 'all',
  startDate: '',
  endDate: '',
});

// --- KPIs COMPUTADOS ---
const activeKpi = computed(() => selectedClub.value?.stats?.active_members ?? 0);
const upcomingKpi = computed(() => activities.value.length); // Simplificado por ahora
// TODO: Implementar cuando el módulo de finanzas esté disponible
const totalIncome = computed(() => 0);
const totalBalance = computed(() => 0);

const filteredUpcomingActivities = computed(() => {
  return activities.value.filter((a: Activity) => {
    const activityDate = new Date(a.start_date || '');
    const start = eventFilters.value.startDate ? new Date(eventFilters.value.startDate) : null;
    const end = eventFilters.value.endDate ? new Date(eventFilters.value.endDate) : null;

    const keywordMatch = eventFilters.value.keyword.trim() === '' || a.name.toLowerCase().includes(eventFilters.value.keyword.toLowerCase());
    const typeMatch = eventFilters.value.type === 'all' || a.status === eventFilters.value.type;
    const dateMatch = (!start || activityDate >= start) && (!end || activityDate <= end);

    return keywordMatch && typeMatch && dateMatch;
  });
});

// --- OPCIONES DE GRÁFICAS ---
const memberFlowChartOption = computed(() => ({
  title: { text: 'Altas vs. Bajas de Miembros', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Altas', 'Bajas'], top: 30 },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Altas', type: 'line', data: [5, 8, 4, 10, 6, 12] },
    { name: 'Bajas', type: 'line', data: [1, 2, 1, 3, 2, 1] }
  ]
}));

const financeChartOption = computed(() => ({
  title: { text: 'Ingresos vs. Egresos', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Ingresos', 'Egresos'], top: 30 },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Ingresos', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, data: [120, 150, 100, 180, 200, 170] },
    { name: 'Egresos', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, data: [80, 70, 60, 90, 110, 80] }
  ]
}));

const enrollmentChartOption = computed(() => ({
  title: { text: 'Inscripciones vs. Tiempo', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: Array.isArray(selectedClub.value?.stats?.enrollmentStats) ? selectedClub.value.stats.enrollmentStats.map((s: { activityId: string }) => s.activityId) : [] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Inscripciones', type: 'line', data: Array.isArray(selectedClub.value?.stats?.enrollmentStats) ? selectedClub.value.stats.enrollmentStats.map((s: { enroll_count: number }) => s.enroll_count) : [] }
  ]
}));

const heatmapChartOption = computed(() => {
    const data = selectedClub.value?.stats?.weeklyActivityHeatmap ? Object.entries(selectedClub.value.stats.weeklyActivityHeatmap).map(([date, count]) => {
        const d = new Date(date);
        return [d.getUTCDay(), d.getUTCHours(), count];
    }) : [];

    return {
        title: { text: 'Actividad Semanal (Heatmap)', left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { position: 'top' },
        grid: { height: '50%', top: '10%' },
        xAxis: { type: 'category', data: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] },
        yAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%'
        },
        series: [
            {
                name: 'Actividades',
                type: 'heatmap',
                data: data,
                label: { show: false },
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }
        ]
    };
});

// --- CICLO DE VIDA ---
onMounted(() => {
  if (clubId.value) {
    clubStore.fetchClubDetails(clubId.value);
    activityStore.adminFetchActivitiesByClub(String(clubId.value));
    // activityStore.fetchEnrollmentStats(clubId.value); // No existe esta acción
    // clubStore.fetchWeeklyActivityHeatmap(clubId.value); // No existe esta acción
    // TODO: Descomentar cuando el módulo de finanzas esté disponible
    // if (hasFunds.value) {
    //   financeStore.fetchSummary(clubId.value);
    // }
  }
});
</script>

<template>
  <div>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Miembros Activos" :value="activeKpi" icon="users" color="text-blue-500" />
      <StatCard label="Eventos Próximos" :value="upcomingKpi" icon="calendar-check" color="text-purple-500" />
      <StatCard v-if="hasFunds" label="Recaudo del Mes" :value="`${totalIncome.toFixed(2)}`" icon="trending-up" color="text-green-500" />
      <StatCard v-if="hasFunds" label="Saldo Disponible" :value="`${totalBalance.toFixed(2)}`" icon="dollar-sign" color="text-yellow-500" />
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border h-80 flex-grow">
        <BaseChart :option="memberFlowChartOption" />
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border h-80 flex-grow">
        <BaseChart :option="enrollmentChartOption" />
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border h-80 flex-grow">
        <BaseChart :option="heatmapChartOption" />
      </div>
      <div v-if="hasFunds" class="bg-white p-6 rounded-xl shadow-sm border h-80 flex flex-col items-center justify-center text-center text-gray-500">
        <LucideIcon name="piggy-bank" :size="40" class="mb-4"/>
        <h4 class="font-semibold text-lg">Módulo Financiero</h4>
        <p class="text-sm">Este club no maneja fondos actualmente.</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-darkText">Próximos Eventos</h3>
            <RouterLink :to="{ name: 'Activities', params: { id: clubId } }" class="text-sm font-semibold text-primary hover:underline">
                Ver todo &rarr;
            </RouterLink>
        </div>
        <div class="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" v-model="eventFilters.keyword" placeholder="Buscar evento..." class="input-focus-effect md:col-span-2" />
            <select v-model="eventFilters.type" class="input-focus-effect">
                <option value="all">Todos los tipos</option>
                <option>Reunión</option><option>Taller</option><option>Torneo</option>
            </select>
            <select v-model="eventFilters.status" class="input-focus-effect">
                <option value="all">Todos los estados</option>
                <option>Programada</option><option>Realizada</option><option>Cancelada</option>
            </select>
            <input type="date" v-model="eventFilters.startDate" class="input-focus-effect" />
            <input type="date" v-model="eventFilters.endDate" class="input-focus-effect" />
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cupo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="activityLoading"><td colspan="4" class="text-center py-8">Cargando...</td></tr>
                    <tr v-else-if="filteredUpcomingActivities.length === 0"><td colspan="4" class="text-center py-8">No hay eventos próximos.</td></tr>
                    <tr v-else v-for="activity in filteredUpcomingActivities" :key="activity.activityId" class="hover:bg-soft">
                        <td class="px-6 py-4 font-medium">{{ activity.name }}</td>
                        <td class="px-6 py-4">{{ new Date(activity.start_date).toLocaleDateString('es-PA') }}</td>
                        <td class="px-6 py-4">{{ activity.max_participants }}</td>
                        <td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{{ activity.status }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
  </div>
</template>
