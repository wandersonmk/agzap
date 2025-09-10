<template>
  <div class="space-y-4">
    <div v-if="categorias.length === 0" class="text-center py-8 text-muted-foreground">
      <font-awesome-icon icon="folder-open" class="text-4xl mb-4" />
      <p>Nenhuma categoria cadastrada</p>
    </div>
    
    <div v-else>
      <div 
        v-for="categoria in categorias" 
        :key="categoria.id"
        class="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
      >
        <!-- Header da Categoria -->
        <div 
          class="p-4 bg-muted/30 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
          @click="toggleCategoria(categoria.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <font-awesome-icon 
                :icon="categoriasAbertas.has(categoria.id) ? 'chevron-down' : 'chevron-right'"
                class="transition-transform duration-200 text-muted-foreground"
              />
              <h3 class="font-semibold text-lg text-foreground">{{ categoria.nome }}</h3>
              <span class="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ getProdutosPorCategoria(categoria.id).length }} produtos
              </span>
            </div>
            
            <!-- Ações da Categoria -->
            <div class="flex items-center space-x-2">
              <button
                class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Editar categoria"
                @click.stop="abrirModalEdicao(categoria)"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructiveSurface rounded-lg transition-colors"
                title="Excluir categoria"
                @click.stop="abrirModalExclusao(categoria)"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Lista de Produtos (Expandível) -->
        <div 
          v-if="categoriasAbertas.has(categoria.id)"
          class="p-4"
        >
          <div v-if="getProdutosPorCategoria(categoria.id).length === 0" class="text-center py-6 text-muted-foreground">
            <font-awesome-icon icon="box-open" class="text-2xl mb-2" />
            <p class="text-sm">Nenhum produto nesta categoria</p>
          </div>
          
          <div v-else class="grid gap-3">
            <div 
              v-for="produto in getProdutosPorCategoria(categoria.id)" 
              :key="produto.id"
              class="bg-muted/20 rounded-lg p-4 border border-border"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-foreground mb-1">{{ produto.nome }}</h4>
                  <p v-if="produto.descricao" class="text-sm text-muted-foreground mb-2">{{ produto.descricao }}</p>
                  <div class="flex items-center space-x-4">
                    <span class="text-lg font-bold text-primary">
                      R$ {{ produto.preco.toFixed(2).replace('.', ',') }}
                    </span>
                    <span 
                      class="text-xs px-2 py-1 rounded-full"
                      :class="produto.ativo ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'"
                    >
                      {{ produto.ativo ? 'Disponível' : 'Indisponível' }}
                    </span>
                  </div>
                </div>
                
                <!-- Ações do Produto -->
                <div class="flex items-center space-x-1 ml-4">
                  <button
                    class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Editar produto"
                    @click="editarProduto(produto)"
                  >
                    <font-awesome-icon icon="edit" class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructiveSurface rounded-lg transition-colors"
                    title="Excluir produto"
                    @click="excluirProduto(produto)"
                  >
                    <font-awesome-icon icon="trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Categoria -->
    <div 
      v-if="categoriaEditando"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="fecharModalEdicao"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-foreground mb-4">Editar Categoria</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Nome da Categoria</label>
            <input
              v-model="nomeEdicao"
              type="text"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite o nome da categoria"
            />
          </div>
        </div>
        
        <div class="flex items-center gap-3 justify-end mt-6">
          <button
            @click="fecharModalEdicao"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="salvarEdicao"
            :disabled="!nomeEdicao.trim()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div 
      v-if="categoriaExcluindo"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="fecharModalExclusao"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="exclamation-triangle" class="text-2xl text-destructive" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground mb-2">Confirmar Exclusão</h3>
            
            <div v-if="produtosNaCategoria.length > 0" class="space-y-3">
              <p class="text-muted-foreground">
                A categoria <strong class="text-foreground">"{{ categoriaExcluindo.nome }}"</strong> contém 
                <strong class="text-destructive">{{ produtosNaCategoria.length }} produto(s)</strong>.
              </p>
              
              <div class="bg-destructiveSurface rounded-lg p-3 border border-destructive/20">
                <p class="text-sm text-destructive font-medium mb-2">⚠️ Atenção:</p>
                <p class="text-sm text-muted-foreground">
                  Ao excluir esta categoria, <strong>TODOS os produtos dentro dela também serão removidos permanentemente</strong>. 
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div class="bg-muted/20 rounded-lg p-3">
                <p class="text-sm font-medium text-foreground mb-2">Produtos que serão excluídos:</p>
                <ul class="space-y-1">
                  <li 
                    v-for="produto in produtosNaCategoria.slice(0, 3)" 
                    :key="produto.id"
                    class="text-sm text-muted-foreground flex items-center"
                  >
                    <font-awesome-icon icon="times" class="text-destructive text-xs mr-2" />
                    {{ produto.nome }} - R$ {{ produto.preco.toFixed(2).replace('.', ',') }}
                  </li>
                  <li 
                    v-if="produtosNaCategoria.length > 3"
                    class="text-sm text-muted-foreground"
                  >
                    <font-awesome-icon icon="ellipsis-h" class="text-xs mr-2" />
                    +{{ produtosNaCategoria.length - 3 }} outros produtos...
                  </li>
                </ul>
              </div>
            </div>
            
            <div v-else>
              <p class="text-muted-foreground">
                Tem certeza que deseja excluir a categoria <strong class="text-foreground">"{{ categoriaExcluindo.nome }}"</strong>?
              </p>
              <p class="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3 justify-end mt-6">
          <button
            @click="fecharModalExclusao"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarExclusao"
            class="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <font-awesome-icon icon="trash" class="mr-2" />
            {{ produtosNaCategoria.length > 0 ? `Excluir Categoria e ${produtosNaCategoria.length} Produto(s)` : 'Excluir Categoria' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Categoria, Produto } from '../../shared/types/cardapio.types'

interface Props {
  categorias: Categoria[]
  produtos: Produto[]
}

const props = defineProps<Props>()

// Estado para controlar quais categorias estão abertas/expandidas
const categoriasAbertas = ref<Set<string>>(new Set())

// Estados dos modais
const categoriaEditando = ref<Categoria | null>(null)
const categoriaExcluindo = ref<Categoria | null>(null)
const nomeEdicao = ref('')

// Função para alternar estado da categoria (abrir/fechar)
const toggleCategoria = (categoriaId: string) => {
  if (categoriasAbertas.value.has(categoriaId)) {
    categoriasAbertas.value.delete(categoriaId)
  } else {
    categoriasAbertas.value.add(categoriaId)
  }
}

// Função para buscar produtos de uma categoria específica
const getProdutosPorCategoria = (categoriaId: string): Produto[] => {
  return props.produtos.filter(produto => produto.categoriaId === categoriaId)
}

// Computed para produtos na categoria sendo excluída
const produtosNaCategoria = computed(() => {
  if (!categoriaExcluindo.value) return []
  return getProdutosPorCategoria(categoriaExcluindo.value.id)
})

// Funções do modal de edição
const abrirModalEdicao = (categoria: Categoria) => {
  categoriaEditando.value = categoria
  nomeEdicao.value = categoria.nome
}

const fecharModalEdicao = () => {
  categoriaEditando.value = null
  nomeEdicao.value = ''
}

const salvarEdicao = () => {
  if (!categoriaEditando.value || !nomeEdicao.value.trim()) return
  
  // TODO: Implementar a edição da categoria
  console.log('Editando categoria:', categoriaEditando.value.id, 'Novo nome:', nomeEdicao.value.trim())
  
  fecharModalEdicao()
}

// Funções do modal de exclusão
const abrirModalExclusao = (categoria: Categoria) => {
  categoriaExcluindo.value = categoria
}

const fecharModalExclusao = () => {
  categoriaExcluindo.value = null
}

const confirmarExclusao = () => {
  if (!categoriaExcluindo.value) return
  
  // TODO: Implementar a exclusão da categoria e produtos
  console.log('Excluindo categoria:', categoriaExcluindo.value.id)
  console.log('Produtos que serão excluídos:', produtosNaCategoria.value.length)
  
  fecharModalExclusao()
}

// Funções para produtos (placeholder por enquanto)
const editarProduto = (produto: Produto) => {
  // TODO: Implementar edição de produto
  console.log('Editar produto:', produto.id, produto.nome)
}

const excluirProduto = (produto: Produto) => {
  // TODO: Implementar exclusão de produto
  console.log('Excluir produto:', produto.id, produto.nome)
}
</script>
