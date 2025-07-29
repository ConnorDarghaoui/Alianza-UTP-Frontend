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
    UPDATE_PROFILE: '/api/users/me', // PUT
    UPDATE_PHOTO: '/api/users/me/photo', // PUT (multipart)
    CHANGE_PASSWORD: '/api/users/me/change-password', // POST
    GET_MY_ACTIVITIES: '/api/user/me/activities', // GET
    GET_MY_CLUBS: '/api/users/me/groups', // GET
    GET_NOTIFICATIONS: '/api/users/me/notifications', // GET
    UPDATE_NOTIFICATIONS: '/api/users/me/notifications', // PUT
    GET_UPCOMING_EVENTS: '/api/user/me/events', // GET (Corregido de '/api/user/me/events')
    JOIN_ACTIVITY: (activityId: number | string) => `/api/users/me/activity/${activityId}`, // POST (Corregido de '/api/user/me/...')
    LEAVE_ACTIVITY: (activityId: number | string) => `/api/users/me/activity/${activityId}`, // PUT (Corregido de '/api/user/me/...')
  },

  /**
   * Endpoints de Subida de Imágenes
   * Nota: Este endpoint no se encuentra en la colección Postman proporcionada.
   * Si no se usa o no existe en el backend, debería eliminarse.
   */
  IMAGES: {
    UPLOAD: '/api/images/upload',
  },

  /**
   * Endpoints Públicos de Actividades
   */
  ACTIVITIES: {
    GET_ALL: '/api/activities', // GET
    GET_BY_ID: (id: number | string) => `/api/activities/${id}`, // GET
  },

  /**
   * Endpoints Públicos de Clubes/Grupos
   */
  CLUBS: {
    GET_ALL: '/api/groups', // GET
    CREATE: '/api/groups', // POST
    GET_BY_ID: (id: number | string) => `/api/groups/${id}`, // GET
    GET_ACTIVITIES: (id: number | string) => `/api/groups/${id}/activities`, // GET
    REQUEST_TO_JOIN: (id: number | string) => `/api/groups/${id}/join`, // POST
    UPDATE_PHOTO: (id: number | string) => `/api/groups/${id}/photo`, // PUT (multipart)
  },

  /**
   * Endpoints del Panel de Administración
   */
  ADMIN: {
    CLUBS: {
      GET_ACTIVITIES: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities`, // GET
      UPDATE_SETTINGS: (clubId: number | string) => `/api/admin/clubs/${clubId}/settings`, // PUT
      DELETE: (clubId: number | string) => `/api/admin/clubs/${clubId}/delete`, // PUT
      REACTIVATE: (clubId: number | string) => `/api/admin/clubs/${clubId}/reactivate`, // PUT
      GET_MEMBERS_STATS: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/stats`, // GET
      GET_MEMBERS_LIST: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/list`, // GET
      EXPORT_MEMBERS: (clubId: number | string) => `/api/admin/clubs/${clubId}/members/export`, // GET
      GET_JOIN_REQUESTS: (clubId: number | string) => `/api/admin/clubs/${clubId}/join-requests`, // GET
      PROCESS_JOIN_REQUEST: (clubId: number | string, requestId: number | string) => `/api/admin/clubs/${clubId}/join-requests/${requestId}`, // PUT
    },
    ACTIVITIES: {
      CREATE: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities`, // POST
      UPDATE: (id: number | string) => `/api/admin/activities/${id}`, // PUT
      DELETE: (id: number | string) => `/api/admin/activities/${id}`, // DELETE
      GET_HEATMAP: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities/weekly-heatmap`, // GET
      GET_ENROLLMENTS: (clubId: number | string) => `/api/admin/clubs/${clubId}/activities/enrollments`, // GET
    },
  },
} as const;
