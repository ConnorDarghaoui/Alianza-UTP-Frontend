import { defineStore } from 'pinia';
import apiClient from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';

export const useImageStore = defineStore('image', {
  state: () => ({
    uploading: false,
    uploadProgress: 0,
    error: null as string | null,
  }),

  actions: {
    clearError() {
      this.error = null;
    },

    validateImageFile(file: File) {
      const MAX_SIZE_MB = 5;
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (!file) {
        return { valid: false, message: 'No se seleccionó ningún archivo.' };
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, message: `Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${ALLOWED_TYPES.join(', ')}` };
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return { valid: false, message: `El archivo es demasiado grande. Máximo ${MAX_SIZE_MB}MB.` };
      }

      return { valid: true, message: '' };
    },

    async fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },

    async uploadImageFile(file: File, title?: string, description?: string): Promise<{ imageUrl: string }> {
      this.uploading = true;
      this.uploadProgress = 0;
      this.error = null;

      const formData = new FormData();
      formData.append('image', file);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      try {
        // Simulación de progreso de subida
        const config = {
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.uploadProgress = percentCompleted;
          },
        };

        // Asumiendo que tienes un endpoint para subir imágenes generales
        const response = await apiClient.post(API_ENDPOINTS.IMAGES.UPLOAD, formData, config);
        return { imageUrl: response.data.url };
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al subir la imagen.';
        throw err;
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },

    async updateProfilePhotoFile(file: File): Promise<string> {
      this.uploading = true;
      this.uploadProgress = 0;
      this.error = null;

      const formData = new FormData();
      formData.append('photo', file);

      try {
        const config = {
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.uploadProgress = percentCompleted;
          },
        };
        
        // Endpoint específico para foto de perfil
        const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PHOTO, formData, config);
        return response.data.url; // Asumiendo que la API devuelve la URL de la nueva foto
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al actualizar la foto de perfil.';
        throw err;
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
  },
});
