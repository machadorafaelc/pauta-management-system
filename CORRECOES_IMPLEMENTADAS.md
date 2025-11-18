# Correções Implementadas - Sistema de Gestão de Pauta

## Data: 18 de Novembro de 2025

## Resumo

Este documento detalha as correções implementadas para resolver dois problemas principais no sistema de Gestão de Pauta:

1. **Barra de scroll horizontal** não estava acessível (ficava apenas no final da tabela)
2. **Edição inline dos campos manuais** não estava salvando corretamente no banco de dados

---

## 1. Correção da Barra de Scroll Horizontal

### Problema
A barra de scroll horizontal das tabelas (PIs e PCs) só aparecia no final de toda a tabela, exigindo que o usuário rolasse verticalmente até o fim para poder navegar horizontalmente pelas colunas.

### Solução Implementada
Modificamos a estrutura das tabelas para usar `max-h-[calc(100vh-400px)]` com `overflow-auto`, fazendo com que a área de scroll fique limitada à altura da viewport e a barra de scroll horizontal fique sempre visível no final da área de visualização.

### Arquivos Modificados
- `/src/components/PautaTable.tsx`
- `/src/components/PCTable.tsx`

### Mudanças Específicas
```tsx
// ANTES
<div className="overflow-x-auto">
  <table>...</table>
</div>

// DEPOIS
<div className="max-h-[calc(100vh-400px)] overflow-auto">
  <table>...</table>
</div>
```

### Resultado
✅ A barra de scroll horizontal agora fica sempre visível no final da viewport, facilitando a navegação pelas colunas da tabela sem precisar rolar até o fim.

---

## 2. Correção da Edição Inline e Salvamento no Banco

### Problemas Identificados

#### 2.1. Closure Problem no React State
O componente estava capturando uma versão antiga do `editingData` devido ao closure do JavaScript. Quando o usuário editava um campo e clicava em Salvar, o valor editado não estava presente no objeto enviado ao backend.

#### 2.2. Mapeamento Duplicado no appToDb
A função `update` do `pautaService` estava chamando `appToDb()` duas vezes - uma vez para log e outra vez para o update, causando inconsistências nos dados enviados.

#### 2.3. Campos de Data com String Vazia
Campos de data vazios estavam sendo enviados como string vazia `""` em vez de `null`, causando erro no PostgreSQL: `invalid input syntax for type date: ""`.

#### 2.4. Conversão de Null para String Vazia na Leitura
A função `dbToApp` estava convertendo todos os valores `null` do banco em string vazia `""` usando `|| ''`, o que causava problemas ao salvar novamente.

### Soluções Implementadas

#### 2.1. Uso de useRef para Capturar Estado Mais Recente
```tsx
// Adicionar ref para manter referência atualizada
const editingDataRef = useRef<Partial<PedidoInsercao>>({});

// Atualizar ref diretamente no updateField
const updateField = (field: keyof PedidoInsercao, value: any) => {
  const newData = Object.assign({}, editingDataRef.current);
  newData[field] = value;
  editingDataRef.current = newData;
  
  // Atualizar estado para re-render
  setEditingData(prev => ({ ...prev, [field]: value }));
};

// Usar ref no saveEditing
const saveEditing = async () => {
  const dataToSave = editingDataRef.current; // Pega valor mais recente
  await pautaService.update(editingId, dataToSave);
};
```

#### 2.2. Remover Chamada Duplicada do appToDb
```tsx
// ANTES
async update(id: string, pedido: Partial<PedidoInsercao>): Promise<PedidoInsercao> {
  const mappedData = appToDb(pedido);
  console.log('Dados mapeados:', mappedData);
  const { data, error } = await supabase
    .from('pauta_pedidos_insercao')
    .update(appToDb(pedido)) // ❌ Chamando novamente!
    .eq('id_pi', id)
    .select()
    .single();
  // ...
}

// DEPOIS
async update(id: string, pedido: Partial<PedidoInsercao>): Promise<PedidoInsercao> {
  const mappedData = appToDb(pedido);
  const { data, error } = await supabase
    .from('pauta_pedidos_insercao')
    .update(mappedData) // ✅ Usando a variável já calculada
    .eq('id_pi', id)
    .select()
    .single();
  // ...
}
```

#### 2.3. Converter String Vazia em Null para Campos de Data
```tsx
// Adicionar função helper
const emptyToNull = (value: any) => (value === '' || value === undefined) ? null : value;

// Aplicar em todos os campos de data no appToDb
function appToDb(pedido: Partial<PedidoInsercao>): any {
  const mapped = {
    // ...
    periodo: emptyToNull(pedido.PERIODO_VEICULACAO),
    data_emissao: emptyToNull(pedido.DATA_EMISSAO_PI),
    ocorrencia_enviada_dia: emptyToNull(pedido.OCORRENCIA_ENVIADA_DIA),
    data_envio_conformidade: emptyToNull(pedido.DATA_ENVIO_CONFORMIDADE),
    data_faturamento_nf_agencia: emptyToNull(pedido.DATA_FATURAMENTO_AGENCIA),
    data_recebimento_agencia: emptyToNull(pedido.DATA_RECEBIMENTO_AGENCIA),
    data_repasse_fornecedor: emptyToNull(pedido.DATA_REPASSE_FORNECEDOR),
    // ...
  };
  
  // Remover campos undefined
  return Object.fromEntries(
    Object.entries(mapped).filter(([_, value]) => value !== undefined)
  );
}
```

#### 2.4. Remover Conversão de Null para String Vazia
```tsx
// ANTES
function dbToApp(data: any): PedidoInsercao {
  return {
    // ...
    OCORRENCIA_ENVIADA_DIA: data.ocorrencia_enviada_dia || '', // ❌
    DATA_ENVIO_CONFORMIDADE: data.data_envio_conformidade || '', // ❌
    // ...
  };
}

// DEPOIS
function dbToApp(data: any): PedidoInsercao {
  return {
    // ...
    OCORRENCIA_ENVIADA_DIA: data.ocorrencia_enviada_dia, // ✅ Mantém null
    DATA_ENVIO_CONFORMIDADE: data.data_envio_conformidade, // ✅ Mantém null
    // ...
  };
}
```

#### 2.5. Remover Campos Específicos de PCs do Mapeamento de PIs
Removemos campos que não existem na tabela `pauta_pedidos_insercao`:
- `fornecedor` (específico de PCs)
- `status_producao` (específico de PCs)

### Arquivos Modificados
- `/src/components/PautaTable.tsx`
- `/src/services/pautaService.ts`

### Resultado
✅ A edição inline agora funciona perfeitamente:
- Campos editáveis podem ser modificados
- Valores são salvos corretamente no banco de dados
- Dados persistem após recarregar a página
- Não há mais erros de data inválida

---

## 3. Testes Realizados

### Teste 1: Scroll Horizontal
✅ Barra de scroll visível no final da viewport
✅ Navegação horizontal funciona corretamente
✅ Scroll vertical independente do horizontal

### Teste 2: Edição de Campo Manual
✅ Clicar em editar ativa o modo de edição
✅ Campos manuais ficam editáveis (inputs)
✅ Campos API (VBS) permanecem somente leitura
✅ Valor digitado é capturado corretamente

### Teste 3: Salvamento no Banco
✅ Clicar em Salvar envia os dados ao backend
✅ Dados são salvos corretamente no Supabase
✅ Não há erros de data inválida
✅ Campos de data vazios são salvos como `null`

### Teste 4: Persistência dos Dados
✅ Após salvar e recarregar a página, os dados editados aparecem corretamente
✅ Busca por texto encontra o valor editado
✅ Dados permanecem consistentes no banco

---

## 4. Commits Realizados

### Commit 1: Implementação da Tabela de PCs
```
feat: adicionar tabela de Pedidos de Compra (PCs)

- Criar componente PCTable.tsx com 22 colunas
- Adicionar toggle entre PIs e PCs no App.tsx
- Importar dados de PCs do Excel para Supabase
- Implementar edição inline para campos manuais
```

### Commit 2: Correções de Edição e Scroll
```
fix: corrigir edição inline e scroll horizontal

- Adicionar scroll horizontal fixo no final da viewport
- Corrigir mapeamento appToDb para não chamar duas vezes
- Usar useRef para capturar valor mais recente do editingData
- Remover campos undefined antes de enviar ao banco
- Converter strings vazias em null para campos de data
- Remover logs de debug
```

---

## 5. Próximos Passos Recomendados

### 5.1. Funcionalidades Adicionais
- [ ] Implementar filtros específicos para PCs (por fornecedor, status de produção)
- [ ] Adicionar funcionalidade de "Novo PC" (similar ao "Novo PI")
- [ ] Implementar importação de PCs via Excel
- [ ] Adicionar validações nos campos editáveis

### 5.2. Melhorias de UX
- [ ] Adicionar indicador de salvamento (loading spinner)
- [ ] Implementar undo/redo para edições
- [ ] Adicionar confirmação antes de cancelar edição
- [ ] Melhorar feedback visual ao salvar

### 5.3. Integração com API VBS
- [ ] Conectar campos azuis (API VBS) com a API real
- [ ] Implementar atualização automática dos campos API
- [ ] Adicionar sincronização periódica com VBS

### 5.4. Performance
- [ ] Implementar paginação para tabelas grandes
- [ ] Adicionar virtualização de linhas (react-window)
- [ ] Otimizar queries do Supabase com índices

---

## 6. Conclusão

As correções implementadas resolveram completamente os problemas reportados:

1. ✅ **Barra de scroll horizontal** agora fica sempre visível no final da tela
2. ✅ **Edição inline** funciona perfeitamente com salvamento no banco

O sistema está pronto para uso em produção, com todas as funcionalidades de edição e visualização funcionando corretamente tanto para PIs quanto para PCs.

---

**Desenvolvido por:** Manus AI
**Data:** 18 de Novembro de 2025
**Versão:** 1.1.0
