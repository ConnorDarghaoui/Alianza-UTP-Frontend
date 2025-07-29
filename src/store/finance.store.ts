import { defineStore } from 'pinia';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    summary: null as any,
    hasFunds: false,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSummary(clubId: string | number) {
      this.isLoading = true;
      this.error = null;
      try {
        // Aquí iría la lógica para llamar a la API de finanzas
        // Por ahora, simulamos una respuesta
        this.summary = { totalIncome: 1000, totalExpenses: 500, balance: 500 };
        this.hasFunds = true;
      } catch (err: any) {
        this.error = err.message || 'Error al cargar el resumen financiero';
      } finally {
        this.isLoading = false;
      }
    },
  },
});