import type { CardapioState, Categoria, Produto } from '../../shared/types/cardapio.types'

export const useCardapio = () => {
  // Estado reativo do cardápio
  const cardapioState = useState<CardapioState>('cardapio', () => ({
    categorias: [
      {
        id: '1',
        nome: 'Pizzas',
        descricao: 'Deliciosas pizzas artesanais',
        ordem: 1,
        ativa: true,
        icone: 'pizza-slice'
      },
      {
        id: '2',
        nome: 'Hambúrguers',
        descricao: 'Hambúrguers artesanais e suculentos',
        ordem: 2,
        ativa: true,
        icone: 'hamburger'
      },
      {
        id: '3',
        nome: 'Bebidas',
        descricao: 'Sucos, refrigerantes e bebidas especiais',
        ordem: 3,
        ativa: true,
        icone: 'glass-water'
      },
      {
        id: '4',
        nome: 'Sobremesas',
        descricao: 'Doces e sobremesas irresistíveis',
        ordem: 4,
        ativa: true,
        icone: 'ice-cream'
      }
    ],
    produtos: [
      {
        id: '1',
        nome: 'Pizza Margherita',
        preco: 32.90,
        descricao: 'Pizza clássica com molho de tomate, mussarela e manjericão fresco',
        foto: '/images/pizza-margherita.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Margherita',
            preco: 32.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Manjericão']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '2',
        nome: 'Pizza Calabresa',
        preco: 35.90,
        descricao: 'Pizza saborosa com calabresa, cebola e azeitonas',
        foto: '/images/pizza-calabresa.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Calabresa',
            preco: 35.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Calabresa', 'Cebola', 'Azeitonas']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '3',
        nome: 'Hambúrguer Artesanal',
        preco: 24.50,
        descricao: 'Pão brioche, hambúrguer 180g, queijo, alface, tomate e molho especial',
        foto: '/images/hamburger.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '4',
        nome: 'Suco Natural',
        preco: 8.90,
        descricao: 'Suco natural de frutas frescas',
        foto: '/images/suco.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      }
    ],
    carrinho: []
  }))

  // Getters
  const categorias = computed(() => cardapioState.value.categorias.filter(c => c.ativa).sort((a, b) => a.ordem - b.ordem))
  const produtos = computed(() => cardapioState.value.produtos.filter(p => p.ativo))

  // Funções para categorias
  const adicionarCategoria = (categoria: Omit<Categoria, 'id'>) => {
    const novaCategoria: Categoria = {
      ...categoria,
      id: Date.now().toString()
    }
    cardapioState.value.categorias.push(novaCategoria)
  }

  const editarCategoria = (id: string, dadosAtualizados: Partial<Omit<Categoria, 'id'>>) => {
    const index = cardapioState.value.categorias.findIndex(c => c.id === id)
    if (index !== -1) {
      const categoria = cardapioState.value.categorias[index]
      if (categoria) {
        Object.assign(categoria, dadosAtualizados)
      }
    }
  }

  const removerCategoria = (id: string) => {
    const index = cardapioState.value.categorias.findIndex(c => c.id === id)
    if (index !== -1) {
      cardapioState.value.categorias.splice(index, 1)
    }
  }

  // Funções para produtos
  const adicionarProduto = (produto: Omit<Produto, 'id'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: Date.now().toString()
    }
    cardapioState.value.produtos.push(novoProduto)
  }

  const editarProduto = (id: string, dadosAtualizados: Partial<Omit<Produto, 'id'>>) => {
    const index = cardapioState.value.produtos.findIndex(p => p.id === id)
    if (index !== -1) {
      const produto = cardapioState.value.produtos[index]
      if (produto) {
        Object.assign(produto, dadosAtualizados)
      }
    }
  }

  const removerProduto = (id: string) => {
    const index = cardapioState.value.produtos.findIndex(p => p.id === id)
    if (index !== -1) {
      cardapioState.value.produtos.splice(index, 1)
    }
  }

  // Funções utilitárias
  const produtosPorCategoria = (categoriaId: string) => {
    return produtos.value.filter(p => p.categoriaId === categoriaId)
  }

  const calcularPrecoPizza = (sabores: any[], tamanho: { multiplicador: number }) => {
    if (sabores.length === 0) return 0
    
    // Regra especial: pega o maior preço entre os sabores
    const maiorPreco = Math.max(...sabores.map(s => s.preco))
    return maiorPreco * tamanho.multiplicador
  }

  return {
    // Estado
    categorias,
    produtos,
    
    // Funções de categoria
    adicionarCategoria,
    editarCategoria,
    removerCategoria,
    
    // Funções de produto
    adicionarProduto,
    editarProduto,
    removerProduto,
    
    // Funções utilitárias
    produtosPorCategoria,
    calcularPrecoPizza
  }
}
