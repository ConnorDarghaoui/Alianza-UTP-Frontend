<script setup lang="ts">
/**
 * @file src/components/ClubsSection.vue
 * @description Muestra una vista previa de los clubs del usuario.
 * - MODIFICADO: Las tarjetas de club ahora son RouterLink funcionales
 * para navegar a la página de detalles del club.
 * - (Otros MODIFICADOS/AÑADIDOS previos sin cambios)
 */
import { RouterLink, useRouter } from 'vue-router';
import type { Club } from '@/services/dao/models/club.model';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useUserStore } from '@/store/user.store';

const props = defineProps<{
  clubs: Club[] | undefined;
}>();

const userStore = useUserStore();
const router = useRouter();

function handleViewAllClubs() {
  router.push({ name: 'ClubList' });
}
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-darkText flex items-center gap-3">
        <LucideIcon name="users" class="text-accent" />
        Mis Clubs
      </h2>
      <button
        @click="handleViewAllClubs()"
        class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        aria-label="Ver todos los clubs"
      >
        Ver todos &rarr;
      </button>
    </div>

    <div v-if="clubs && clubs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="club in clubs"
        :key="club.id"
        :to="{ name: 'ClubDetail', params: { id: club.id } }"
        class="block bg-card border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        aria-label="Ver detalles del club"
      >
        <h3 class="font-bold text-primary truncate">{{ club.name }}</h3>
        <p class="text-sm text-gray-500 mt-1 truncate">{{ club.description || 'Sin descripción' }}</p>
      </RouterLink>
    </div>

    <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 mb-2">Aún no eres miembro de ningún club.</p>
      <RouterLink :to="{ name: 'ClubList' }" class="mt-2 inline-block text-primary font-semibold hover:underline">
        Explorar clubs &rarr;
      </RouterLink>
    </div>
  </section>
</template>