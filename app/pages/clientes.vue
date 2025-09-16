<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Estado de carregamento
const isLoading = ref(true)
const { isLoading: authLoading } = useAuth()

// Aguarda a autenticação ser carregada e adiciona um delay mínimo para UX
onMounted(async () => {
  // Aguarda o auth loading terminar
  while (authLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  // Delay reduzido para carregamento mais rápido
  await new Promise(resolve => setTimeout(resolve, 300))
  
  isLoading.value = false
})
</script>

<template>
  <div>
    <!-- Loading enquanto carrega -->
    <AppLoading 
      v-if="isLoading" 
      title="Carregando Clientes"
      description="Preparando a área de clientes..."
    />
    
    <!-- Página de Clientes quando carregado -->
    <div v-else class="space-y-6">
      <!-- Header da página -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Clientes</h1>
          <p class="text-muted-foreground">Gerencie seus clientes e histórico de pedidos</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Futuro: botão para adicionar cliente -->
          <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <font-awesome-icon icon="plus" class="w-4 h-4 mr-2" />
            Novo Cliente
          </button>
        </div>
      </div>

      <!-- Tabela de clientes -->
      <TabelaClientes />
    </div>
  </div>
</template>
