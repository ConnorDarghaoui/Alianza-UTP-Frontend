<template>
  <div class="p-6">
    <div class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-700 mb-4">Módulo de Finanzas</h2>
      <p class="text-gray-600">Este módulo está en desarrollo y estará disponible próximamente.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file: src/views/club/FinanceView.vue
 * @description: Vista para la gestión financiera de un club.
 * TODO: Implementar cuando los tipos y el backend estén disponibles
 */
import { useRoute } from 'vue-router';

const route = useRoute();
const clubId = Number(route.params.id);

// TODO: Implementar toda la funcionalidad de finanzas cuando esté disponible
</script>
