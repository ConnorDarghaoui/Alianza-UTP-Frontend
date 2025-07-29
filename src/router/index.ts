/**
 * @file src/router/index.ts
 * @description Enrutador principal de la aplicación Vue.
 * Define todas las rutas públicas y privadas, y gestiona la
 * protección de rutas mediante un guard de navegación para producción.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/auth.store';
import AdminView from '@/layouts/AdminView.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { PATH_LOGIN, NAME_LOGIN, PATH_REGISTER, NAME_REGISTER, PATH_FORGOT_PASSWORD, NAME_FORGOT_PASSWORD, PATH_VERIFY_CODE, NAME_VERIFY_CODE, PATH_RESET_PASSWORD, NAME_RESET_PASSWORD, PATH_ROOT, NAME_HOME, PATH_CLUBS, NAME_CLUB_LIST, PATH_ACTIVITIES, NAME_ACTIVITY_LIST, PATH_CLUB_DETAIL, NAME_CLUB_DETAIL as NAME_CLUB_DETAIL_ROUTE, PATH_ACTIVITY_DETAIL, NAME_ACTIVITY_DETAIL as NAME_ACTIVITY_DETAIL_ROUTE, PATH_ADMIN_CLUB, NAME_DASHBOARD, NAME_MEMBERS, NAME_ACTIVITIES, NAME_FINANCE, NAME_SETTINGS, PATH_NOT_FOUND } from '@/constants/routes';

// --- SECCIÓN DE CONSTANTES ---
/**
 * @docstring
 * Define las rutas hijas para el panel de administración del club,
 * que se renderizarán dentro del layout AdminView.
 */
const clubChildren: RouteRecordRaw[] = [
  { path: '', name: NAME_DASHBOARD, component: () => import('@/views/club/Dashboard.vue') },
  { path: 'members', name: NAME_MEMBERS, component: () => import('@/views/club/Members.vue') },
  { path: 'activities', name: NAME_ACTIVITIES, component: () => import('@/views/club/Activities.vue') },
  { path: 'finance', name: NAME_FINANCE, component: () => import('@/views/club/FinanceView.vue') },
  { path: 'settings', name: NAME_SETTINGS, component: () => import('@/views/club/Settings.vue') }
];

/**
 * @docstring
 * Arreglo principal que contiene todas las definiciones de rutas de la aplicación.
 */
const routes: RouteRecordRaw[] = [
    // --- Rutas Públicas de Autenticación (Sin layout principal) ---
    {
        path: PATH_ROOT, // La ruta raíz ahora es el login
        name: NAME_LOGIN,
        component: () => import('@/views/auth/LoginView.vue')
    },
    {
        path: PATH_REGISTER,
        name: NAME_REGISTER,
        component: () => import('@/views/auth/RegistrationView.vue')
    },
    {
        path: PATH_FORGOT_PASSWORD,
        name: NAME_FORGOT_PASSWORD,
        component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
        path: PATH_VERIFY_CODE,
        name: NAME_VERIFY_CODE,
        component: () => import('@/views/auth/VerifyCodeView.vue')
    },
    {
        path: PATH_RESET_PASSWORD,
        name: NAME_RESET_PASSWORD,
        component: () => import('@/views/auth/ResetPasswordView.vue'),
        props: true 
    },
    
    // --- Ruta Padre con Layout por Defecto para el Estudiante (Dashboard del Usuario) ---
    {
        path: '/dashboard', // Nueva ruta para el dashboard del usuario
        name: 'UserDashboard', // Nuevo nombre para el dashboard del usuario
        component: DefaultLayout,
        meta: { requiresAuth: true }, // Requiere autenticación
        children: [
            {
                path: '', // Ruta vacía para que /dashboard sea el UserDashboardView
                name: NAME_HOME, // Mantener NAME_HOME para esta ruta
                component: () => import('@/views/user/UserDashboardView.vue'),
            },
            {
                path: PATH_CLUBS, // Ruta para el listado de clubs (/clubs)
                name: NAME_CLUB_LIST,
                component: () => import('@/views/user/ClubListView.vue'),
            },
            {
                path: PATH_ACTIVITIES, // Ruta para el listado de actividades (/activities)
                name: NAME_ACTIVITY_LIST,
                component: () => import('@/views/user/ActivityListView.vue'),
            },
            {
                path: '/clubs/create', // Nueva ruta para crear un club
                name: 'CreateClub',
                component: () => import('@/views/user/CreateClubView.vue'),
            },
            {
                path: PATH_CLUB_DETAIL, // RUTA: para el detalle de un club
                name: NAME_CLUB_DETAIL_ROUTE,
                component: () => import('@/views/user/ClubDetailView.vue'),
                props: true
            },
            {
                path: PATH_ACTIVITY_DETAIL, // RUTA: para el detalle de una actividad
                name: NAME_ACTIVITY_DETAIL_ROUTE,
                component: () => import('@/views/user/ActivityDetailView.vue'),
                props: true
            }
        ]
    },

    // --- Rutas de Administración del Club ---
    {
    path: PATH_ADMIN_CLUB,
    component: AdminView,
    children: clubChildren,
    meta: { requiresAuth: true } 
    },
    // --- Ruta Fallback (404) ---
    {
        path: PATH_NOT_FOUND,
        component: NotFoundView
    }
];

// --- SECCIÓN PRINCIPAL: Creación de la Instancia del Router ---
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * @docstring
 * Guard de navegación global (Navigation Guard). Se ejecuta antes de cada cambio de ruta.
 * Es el mecanismo de seguridad principal del frontend.
 * Verifica si la ruta destino requiere autenticación (`meta.requiresAuth`).
 * Si es así y el usuario no está autenticado, lo redirige forzosamente a la página de Login.
 */
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth = useAuthStore();

    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: NAME_LOGIN, query: { redirect: to.fullPath } });
    }
    // Si el usuario está autenticado y trata de acceder a páginas públicas de autenticación, 
    // redirigir al dashboard excepto para las páginas de restablecimiento de contraseña
    else if (
        (to.name === NAME_LOGIN || to.name === NAME_REGISTER) && 
        auth.isAuthenticated && 
        !to.query.redirect
    ) {
        next({ name: NAME_HOME });
    }
    // Permitir el acceso a todas las demás rutas
    else {
        next();
    }
});