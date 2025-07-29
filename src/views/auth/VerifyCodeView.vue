<script setup lang="ts">
/**
 * @file src/views/auth/VerifyCodeView.vue
 * @description Vista para verificar el código de restablecimiento enviado por correo.
 * Esta vista es el paso intermedio entre solicitar el código y establecer la nueva contraseña.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { authDAO } from '@/services/dao/auth.dao'
import type { VerifyCodeRequestDTO } from '@/services/dao/models/auth.model'
import StateRenderer from '@/components/ui/StateRenderer.vue'
import Card from '@/components/ui/Card.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

// --- SECCIÓN DE CONSTANTES ---
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const error = ref<string | null>(null)
const verificationCode = ref('')
const email = ref('')

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Extrae el email de los parámetros de la URL al montar el componente.
 */
onMounted(() => {
  const emailParam = route.query.email as string
  if (emailParam) {
    email.value = emailParam
  } else {
    // Si no hay email, redirigir al inicio del proceso
    router.push('/auth/forgot-password')
  }
})

/**
 * @docstring
 * Verifica el código de restablecimiento ingresado por el usuario.
 * Si es válido, redirige a la vista de establecer nueva contraseña.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la verificación se completa.
 */
async function handleVerifyCode(): Promise<void> {
  if (!verificationCode.value.trim() || isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    const payload: VerifyCodeRequestDTO = {
      verificationCode: verificationCode.value.trim()
    }

    const [data, errorObj] = await authDAO.verifyResetCode(payload)
    
    // Si la verificación es exitosa, redirigir a reset password con el código
    router.push({
      path: '/reset-password',
      query: {
        email: email.value,
        token: verificationCode.value.trim()
      }
    })

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Código de verificación inválido o expirado.'
  } finally {
    isLoading.value = false
  }
}

/**
 * @docstring
 * Reenvía el código de verificación al correo del usuario.
 */
async function resendCode(): Promise<void> {
  if (!email.value || isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    const [data, errorObj] = await authDAO.requestPasswordReset(email.value)
    // Mostrar mensaje de confirmación sin error
    alert('Se ha reenviado el código a tu correo electrónico.')
  } catch (err: any) {
    error.value = 'Error al reenviar el código. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card class="p-8">
        <StateRenderer :loading="isLoading" :error="error">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-darkText mb-2">
              Verificar Código
            </h2>
            <p class="text-gray-600">
              Hemos enviado un código de verificación a:
            </p>
            <p class="font-semibold text-primary mt-1">
              {{ email }}
            </p>
          </div>

          <form @submit.prevent="handleVerifyCode" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <BaseInput
                v-model="verificationCode"
                type="text"
                placeholder="Ingresa el código de 6 dígitos"
                required
                maxlength="6"
                class="text-center text-lg tracking-widest"
                autocomplete="one-time-code"
              />
              <p class="text-xs text-gray-500 mt-1">
                Revisa tu bandeja de entrada y spam
              </p>
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :disabled="verificationCode.length < 4"
            >
              Verificar Código
            </BaseButton>
          </form>

          <div class="mt-6 text-center space-y-3">
            <button
              type="button"
              @click="resendCode"
              class="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
              :disabled="isLoading"
            >
              ¿No recibiste el código? Reenviar
            </button>

            <div class="text-xs text-gray-500">
              <RouterLink
                to="/auth/forgot-password"
                class="text-primary hover:text-primary-dark transition-colors"
              >
                ← Volver a solicitar código
              </RouterLink>
            </div>
          </div>
        </StateRenderer>
      </Card>
    </div>
  </main>
</template>

<style scoped>
/* Estilos específicos para el código de verificación */
.text-center input {
  text-align: center;
}
</style>