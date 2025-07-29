<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import AppNavbar from '@/components/AppNavbar.vue'
import { RouterView } from 'vue-router'

const userStore = useUserStore()

</script>

<template>
  <AppNavbar />

  <!-- Contenido principal de la aplicación -->
  <main class="bg-gray-50 min-h-screen">
    <div class="pt-16">
      <RouterView />
    </div>
  </main>
</template>