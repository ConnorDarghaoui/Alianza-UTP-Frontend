<script setup lang="ts">
/**
 * @file src/components/AppNavbar.vue
 * @description Barra de navegación principal de la aplicación.
 * - MODIFICADO: Ahora usa directamente las funciones del store en lugar de
 * métodos del store para manejar el estado de los menús desplegables.
 * - MEJORA: Simplificada la lógica de eventos de clic para manejar
 * correctamente el cierre de menús desplegables.
 * - AÑADIDO: Soporte para menú móvil responsive.
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user.store';
import { useAuthStore } from '@/store/auth.store';
import { useClubStore } from '@/store/club.store';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import { 
  NAME_LOGIN, 
  NAME_HOME, 
  NAME_CLUB_LIST, 
  NAME_ACTIVITY_LIST, 
  PATH_ADMIN_CLUB 
} from '@/constants/routes';

// --- SECCIÓN DE STORES Y ROUTER ---
const userStore = useUserStore();
const authStore = useAuthStore();
const clubStore = useClubStore();
const router = useRouter();

// --- SECCIÓN DE ESTADO LOCAL ---
const isMobileMenuOpen = ref(false);
const isProfileDropdownOpen = ref(false);
const isNotificationPanelOpenLocal = ref(false);
const userMenuButton = ref<HTMLElement | null>(null);
const userMenuDropdown = ref<HTMLElement | null>(null);
const notificationButton = ref<HTMLElement | null>(null);
const notificationPanelDropdown = ref<HTMLElement | null>(null);

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
const userName = computed((): string => authStore.user?.name || authStore.user?.username || 'Usuario');
const userPhoto = computed((): string | undefined => authStore.user?.profile_photo_url || undefined);
const isUserMenuOpen = computed(() => isProfileDropdownOpen.value);
const isNotificationPanelOpen = computed(() => isNotificationPanelOpenLocal.value);

const showAdminButton = computed(() => {
  const user = authStore.user;
  if (!user || !user.role) return false;
  
  const isAdminOrLeader = user.role.includes('ADMIN') || user.role.includes('LEADER');
  const hasClubs = clubStore.clubs && clubStore.clubs.length > 0;

  return isAdminOrLeader && hasClubs;
});

const adminClubId = computed(() => {
  if (showAdminButton.value && clubStore.clubs && clubStore.clubs.length > 0) {
    return clubStore.clubs[0].groupId;
  }
  return null;
});

// --- SECCIÓN DE FUNCIONES ---
function handleLogout(): void {
  authStore.logout();
  router.push({ name: NAME_LOGIN });
}

function handleOpenModalAndCloseMenu(
  modalName: 'viewProfile' | 'security',
  menuType: 'desktop' | 'mobile'
): void {
  userStore.openModal(modalName);
  if (menuType === 'desktop') {
    isProfileDropdownOpen.value = false;
  } else {
    isMobileMenuOpen.value = false;
  }
}

function handleClickOutside(event: MouseEvent) {
  if (isProfileDropdownOpen.value && userMenuDropdown.value && userMenuButton.value &&
      !userMenuDropdown.value.contains(event.target as Node) &&
      !userMenuButton.value.contains(event.target as Node)) {
    isProfileDropdownOpen.value = false;
  }

  if (isNotificationPanelOpen.value && notificationPanelDropdown.value && notificationButton.value) {
    const clickedElement = event.target as Node;
    const panelElement = (notificationPanelDropdown.value as any).rootElement.value;

    if (panelElement && !panelElement.contains(clickedElement) && !notificationButton.value.contains(clickedElement)) {
      isNotificationPanelOpenLocal.value = false;
    }
  }
}

const readNotificationIds = ref<number[]>([]);

function handleNotificationClick(notificationId: number) {
  if (!readNotificationIds.value.includes(notificationId)) {
    readNotificationIds.value.push(notificationId);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  clubStore.fetchAllClubs();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(router.currentRoute, (newRoute, oldRoute) => {
  if (newRoute.fullPath !== oldRoute.fullPath) {
    isNotificationPanelOpenLocal.value = false;
  }
});

watch(isNotificationPanelOpen, (newValue) => {
  if (!newValue && readNotificationIds.value.length > 0) {
    userStore.markNotificationsAsRead(readNotificationIds.value.map(String));
    readNotificationIds.value = [];
  }
});
</script>

<template>
  <nav class="bg-primary text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center">
          <RouterLink :to="{ name: NAME_HOME }" class="flex-shrink-0 flex items-center gap-2">
            <img src="@/assets/stroke_logo.svg" alt="Logo Alianza UTP" class="h-8 w-auto">
            <span class="text-xl font-bold">Alianza UTP</span>
          </RouterLink>
          
          <div class="hidden md:block md:ml-10">
            <div class="flex items-baseline space-x-4">
              <RouterLink :to="{ name: NAME_HOME }" class="nav-link" exact-active-class="nav-link-active">Inicio</RouterLink>
              <RouterLink :to="{ name: NAME_CLUB_LIST }" class="nav-link" exact-active-class="nav-link-active">Clubs</RouterLink>
              <RouterLink :to="{ name: NAME_ACTIVITY_LIST }" class="nav-link" exact-active-class="nav-link-active">Actividades</RouterLink>
            </div>
          </div>
        </div>

        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 gap-4">
            <div class="relative">
              <button ref="notificationButton" @click="isNotificationPanelOpenLocal = !isNotificationPanelOpenLocal" class="relative p-1 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Ver notificaciones">
                <LucideIcon name="bell" :size="24" />
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-primary"></span>
              </button>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <NotificationPanel ref="notificationPanelDropdown" v-if="isNotificationPanelOpenLocal" @notification-clicked="handleNotificationClick" />
              </transition>
            </div>

            <div class="relative">
              <button ref="userMenuButton" @click="isProfileDropdownOpen = !isProfileDropdownOpen" class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white">
                <span class="sr-only">Abrir menú de usuario</span>
                <img v-if="userPhoto" class="h-8 w-8 rounded-full object-cover" :src="userPhoto" alt="Foto de perfil">
                <div v-else class="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-primary">{{ userName.charAt(0) }}</div>
                <LucideIcon name="chevron-down" :size="16" class="hidden lg:block transition-transform" :class="{ 'rotate-180': isProfileDropdownOpen }" />
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div ref="userMenuDropdown" v-if="isProfileDropdownOpen" @click.stop class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                      <img v-if="authStore.user?.profile_photo_url" class="h-10 w-10 rounded-full object-cover" :src="authStore.user.profile_photo_url" alt="Foto de perfil">
                      <div v-else class="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-lg">{{ userName.charAt(0) }}</div>
                      <div>
                        <p class="text-sm font-semibold text-darkText">{{ userName }}</p>
                        <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="py-1">
                    <a href="#" @click.prevent="handleOpenModalAndCloseMenu('viewProfile', 'desktop')" class="user-menu-item">Mi Perfil</a>
                    <a href="#" @click.prevent="handleOpenModalAndCloseMenu('security', 'desktop')" class="user-menu-item">Seguridad</a>
                    
                    <RouterLink 
                      v-if="showAdminButton && adminClubId"
                      :to="{ name: 'Dashboard', params: { id: adminClubId } }"
                      class="user-menu-item"
                      @click="isProfileDropdownOpen = false"
                    >
                      Panel de Administración
                    </RouterLink>

                    <a href="#" @click.prevent="handleLogout" class="user-menu-item">Cerrar Sesión</a>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="-mr-2 flex md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Abrir menú principal">
            <LucideIcon v-if="!isMobileMenuOpen" name="menu" :size="24" />
            <LucideIcon v-else name="x" :size="24" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink :to="{ name: NAME_HOME }" @click="isMobileMenuOpen = false" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">Inicio</RouterLink>
        <RouterLink :to="{ name: NAME_CLUB_LIST }" @click="isMobileMenuOpen = false" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">Clubs</RouterLink>
        <RouterLink :to="{ name: NAME_ACTIVITY_LIST }" @click="isMobileMenuOpen = false" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">Actividades</RouterLink>
      </div>
      <div class="pt-4 pb-3 border-t border-primary-dark">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
             <img v-if="userPhoto" class="h-10 w-10 rounded-full object-cover" :src="userPhoto" alt="Foto de perfil">
             <div v-else class="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-xl">{{ userName.charAt(0) }}</div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium">{{ userName }}</div>
            <div class="text-sm font-medium text-gray-300">{{ authStore.user?.email }}</div>
          </div>
           <button @click="isNotificationPanelOpenLocal = !isNotificationPanelOpenLocal; isMobileMenuOpen = false" class="relative ml-auto flex-shrink-0 p-1 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Ver notificaciones">
            <LucideIcon name="bell" :size="24" />
          </button>
        </div>
        <div class="mt-3 px-2 space-y-1">
          <a href="#" @click.prevent="handleOpenModalAndCloseMenu('viewProfile', 'mobile')" class="user-menu-item-mobile">Mi Perfil</a>
          <a href="#" @click.prevent="handleOpenModalAndCloseMenu('security', 'mobile')" class="user-menu-item-mobile">Seguridad</a>
          
          <RouterLink 
            v-if="showAdminButton && adminClubId"
            :to="{ name: 'Dashboard', params: { id: adminClubId } }"
            class="user-menu-item-mobile"
            @click="isMobileMenuOpen = false"
          >
            Panel de Administración
          </RouterLink>

          <a href="#" @click.prevent="handleLogout" class="user-menu-item-mobile">Cerrar Sesión</a>
        </div>
      </div>
    </div>
  </nav>
</template>