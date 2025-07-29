<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authDAO } from '@/services/dao/auth.dao'
import StateRenderer from '@/components/ui/StateRenderer.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  if (!email.value || isLoading.value) return
  
  isLoading.value = true;
  error.value = null;
  try {
    const [response, errorObj] = await authDAO.requestPasswordReset(email.value);
    console.log('Respuesta forgotPassword:', response)
    
    router.push({
      path: '/verify-code',
      query: { email: email.value }
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al enviar la solicitud. Verifica tu correo electrónico.'
    console.error("Forgot password error:", err)
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card class="p-8"> 
        <StateRenderer :loading="isLoading" :error="error">
          <div>
            <h2 class="text-2xl font-bold text-darkText">Recuperar Contraseña</h2>
            <p class="text-gray-600 mt-2 mb-6">
              Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
            </p>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <input
                v-model="email"
                type="email"
                required
                placeholder="correo@utp.ac.pa"
                class="input-focus-effect w-full"
              />
              <div class="flex items-center justify-end gap-3 pt-4">
                <RouterLink :to="{ name: 'Login' }" class="px-5 py-2.5 rounded-lg border hover:bg-gray-100">
                  Cancelar
                </RouterLink>
                <button
                  type="submit"
                  :disabled="!email || isLoading"
                  class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                  :class="{ 'opacity-50 cursor-not-allowed': !email || isLoading }"
                >
                  Enviar código
                </button>
              </div>
            </form>
          </div>
        </StateRenderer>
      </Card>
    </div>
  </main>
</template>

<style scoped>
.input-focus-effect {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
}

.input-focus-effect:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}
</style>
