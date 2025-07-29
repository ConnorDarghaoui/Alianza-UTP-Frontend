<script setup lang="ts">
/**
 * @file src/views/HomeView.vue
 * @description Vista principal de la aplicación.
 * Muestra las secciones de acciones rápidas, clubs y actividades del usuario.
 * - MODIFICADO: Ahora usa un único ModalOverlay que se muestra si cualquier
 * modal está activo, y dentro de él se renderiza el modal específico.
 * - MEJORA: Añadida gestión de estado de carga para el objeto 'user' para prevenir
 * errores al acceder a propiedades de 'null' antes de que los datos estén disponibles.
 * - REFACTORIZADO: Implementa un layout de dos columnas para un mejor
 * aprovechamiento del espacio y para mostrar widgets de información útil.
 * - AÑADIDO: Carga automática de datos del usuario al montar el componente.
 */

// Sección de Librerías/Imports
// =============================================================================
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user.store';
import { useAuthStore } from '@/store/auth.store';
import { useClubStore } from '@/store/club.store';
import { useActivityStore } from '@/store/activity.store';
import { useRouter } from 'vue-router';

// Componentes de la vista principal
import QuickActions from '@/components/QuickActions.vue';
import ClubsSection from '@/components/ClubsSection.vue';
import ActivitiesSection from '@/components/ActivitiesSection.vue';

// Componentes de modales
import ViewProfileModal from '@/components/modals/ViewProfileModal.vue';
import EditProfileModal from '@/components/modals/EditProfileModal.vue';
import SecurityModal from '@/components/modals/SecurityModal.vue';
import CreateActivityModal from '@/components/modals/CreateActivityModal.vue';
import ProfilePictureUploadModal from '@/components/modals/ProfilePictureUploadModal.vue';
import JoinClubModal from '@/components/modals/JoinClubModal.vue';

// Componente del nuevo Overlay para modales
import ModalOverlay from '@/components/ui/ModalOverlay.vue';

// Componentes de UI generales
import ToastNotification from '@/components/ui/ToastNotification.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// AÑADIDO: Importamos los nuevos widgets que vamos a crear
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget.vue';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import NotificationsWidget from '@/components/widgets/NotificationsWidget.vue';


// Sección Principal (Script Setup)
// =============================================================================

const userStore = useUserStore();
const authStore = useAuthStore();
const clubStore = useClubStore();
const activityStore = useActivityStore();
const router = useRouter();

// Desestructura las propiedades reactivas del store
const { modals, toast, isAnyModalOpen } = storeToRefs(userStore);

const showCreateClubModal = ref(false);

function openCreateClubView() {
  router.push({ name: 'CreateClub' });
}

// Cargar datos del usuario al montar el componente
onMounted(() => {
  userStore.fetchMyData(); // Load all user data (notifications, activities, clubs, upcoming events)
  
  // También aseguramos que el perfil del usuario esté actualizado
  const authStore = useAuthStore();
  if (authStore.token && !authStore.user) {
    authStore.fetchUserProfile();
  }
});

</script>

<template>
  <ModalOverlay v-if="isAnyModalOpen">
    <ViewProfileModal v-if="modals.viewProfile" />
    <EditProfileModal v-if="modals.editProfile" />
    <SecurityModal    v-if="modals.security"     />
    <CreateActivityModal v-if="modals.createActivity" />
    <ProfilePictureUploadModal :visible="modals.profilePictureUpload" @close="userStore.closeAllModals()" />
    <JoinClubModal v-if="modals.joinClub" @close="userStore.closeAllModals()" />
  </ModalOverlay>

  <ToastNotification v-if="toast.show"
                     :message="toast.message"
                     :type="toast.type" />

  <main class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-screen-xl mx-auto">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-10">
          <QuickActions @create-activity="() => userStore.openModal('createActivity')" @join-club="() => userStore.openModal('joinClub')" />
          <BaseButton @click="openCreateClubView" class="mb-4">Crear Nuevo Club</BaseButton>
          <ClubsSection
              :clubs="clubStore.clubs || []"
          />
          <ActivitiesSection :activities="activityStore.activities || []" />
        </div>

        <div class="lg:col-span-1 space-y-8">
          <UpcomingEventsWidget :activities="activityStore.activities || []" />
          <CalendarWidget :activities="activityStore.activities || []" />
          <NotificationsWidget :notifications="authStore.user?.unread_notifications || []" />
        </div>

      </div>
    </div>
  </main>
</template>