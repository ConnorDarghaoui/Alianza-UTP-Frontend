/**
 * @file src/constants/api.ts
 * @description Centraliza todos los endpoints de la API en un único objeto jerárquico
 * para mejorar la organización, el autocompletado y la mantenibilidad.
 */

export const API_ENDPOINTS = {
  /**
   * Endpoints de Autenticación y Sesión
   */
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/enroll',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    GET_PROFILE: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_RESET_CODE: '/api/auth/verifyPassResetCode',
    SUBMIT_RESET: '/api/auth/submitPasswordReset',
  },

  /**
   * Endpoints del Perfil de Usuario Autenticado
   */
  USERS: {
    UPDATE_PROFILE: '/api/users/me',
    UPDATE_PHOTO: '/api/users/me/photo',
    CHANGE_PASSWORD: '/api/users/me/change-password',
    GET_MY_ACTIVITIES: '/api/users/me/activities',
    GET_MY_CLUBS: '/api/users/me/groups',
    GET_NOTIFICATIONS: '/api/users/me/notifications',
    UPDATE_NOTIFICATIONS: '/api/users/me/notifications',
    GET_UPCOMING_EVENTS: '/api/users/me/events',
    JOIN_ACTIVITY: (activityId: number | string) => `/api/users/me/activity/${activityId}`,
    LEAVE_ACTIVITY: (activityId: number | string) => `/api/users/me/activity/${activityId}`,
  },

  /**
   * Endpoints de Subida de Imágenes
   */
  IMAGES: {
    UPLOAD: '/api/images/upload',
  },

  /**
   * Endpoints Públicos de Actividades
   */
  ACTIVITIES: {
    GET_ALL: '/api/activities',
    GET_BY_ID: (id: number | string) => `/api/activities/${id}`,
  },

  /**
   * Endpoints Públicos de Clubes/Grupos
   */
  CLUBS: {
    GET_ALL: '/api/groups',
    CREATE: '/api/groups',
    GET_BY_ID: (id: number | string) => `/api/groups/${id}`,
    GET_ACTIVITIES: (id: number | string) => `/api/groups/${id}/activities`,
    REQUEST_TO_JOIN: (id: number | string) => `/api/groups/${id}/join`,
    UPDATE_PHOTO: (id: number | string) => `/api/groups/${id}/photo`,
  },

  /**
   * Endpoints del Panel de Administración
   */
  ADMIN: {
    CLUBS: {
      GET_ACTIVITIES: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities`,
      UPDATE_SETTINGS: (clubId: number | string) => `/api/admin/clubs/${clubId}/settings`,
      DELETE: (clubId: number | string) => `/api/admin/clubs/${clubId}/delete`,
      REACTIVATE: (clubId: number | string) => `/api/admin/clubs/${clubId}/reactivate`,
      GET_MEMBERS_STATS: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/stats`,
      GET_MEMBERS_LIST: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/list`,
      EXPORT_MEMBERS: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/export`,
      GET_JOIN_REQUESTS: (clubId: number | string) => `/api/admin/clubs/${clubId}/join-requests`,
      PROCESS_JOIN_REQUEST: (clubId: number | string, requestId: number | string) => `/api/admin/clubs/${clubId}/join-requests/${requestId}`,
    },
    ACTIVITIES: {
      CREATE: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities`,
      UPDATE: (id: number | string) => `/api/admin/activities/${id}`,
      DELETE: (id: number | string) => `/api/admin/activities/${id}`,
      GET_HEATMAP: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities/weekly-heatmap`,
      GET_ENROLLMENTS: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities/enrollments`,
    },
  },
} as const;