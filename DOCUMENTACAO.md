# Documentação do Sistema de Pauta

## 📖 Visão Geral

O **Sistema de Pauta** é uma aplicação web completa para gerenciar Pedidos de Inserção (PIs) entre os times de Mídia, Produção e Checking de uma agência de publicidade.

## 🎯 Funcionalidades Principais

### 1. Gestão de Pedidos de Inserção (PIs)

- **Visualização em tabela** com todos os PIs cadastrados
- **Filtros avançados** por status, responsável e faturamento
- **Busca em tempo real** por cliente, campanha, PI, veículo
- **Visualização detalhada** de cada PI em modal
- **Edição completa** de todos os campos manuais
- **Criação de novos PIs** com formulário organizado em abas

### 2. Importação e Exportação

- **Exportação para Excel** (.xlsx) com todos os dados filtrados
- **Importação de Excel** para adicionar múltiplos PIs de uma vez
- Suporte para o formato da planilha original

### 3. Estatísticas e Dashboards

- **Total de PIs** cadastrados
- **Valor total** de todos os pedidos
- **PIs faturados** (contador)
- **PIs pendentes** (contador)

### 4. Integração com API VBS

Campos preparados para receber dados automaticamente da API VBS:
- Número PI
- Data de emissão
- Cliente
- Campanha
- Período de veiculação
- Veículo e tipo de mídia
- Valores (bruto e líquido)
- Nota fiscal

### 5. Campos Manuais por Time

**Mídia:**
- Responsável
- Observações
- Arquivo do PI (URL)

**Produção:**
- Responsável
- Briefing
- Material aprovado (sim/não)
- Data de aprovação
- Observações

**Checking:**
- Responsável
- Comprovante (URL)
- Data de veiculação real
- Status
- Observações

**Controle Geral:**
- Status geral do PI
- Prioridade

**Faturamento:**
- Número EC
- Número PC
- Status de faturamento
- Data de faturamento

## 🏗️ Arquitetura Técnica

### Frontend

**Framework:** React 18 com TypeScript

**Bibliotecas principais:**
- **Vite** - Build tool e dev server
- **Radix UI** - Componentes de UI acessíveis
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **XLSX** - Manipulação de arquivos Excel
- **date-fns** - Manipulação de datas

**Estrutura de pastas:**
```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI reutilizáveis
│   ├── PautaTable.tsx  # Tabela de PIs
│   ├── PautaFilters.tsx # Filtros
│   ├── PautaDetailsDialog.tsx # Modal de visualização
│   ├── PautaEditDialog.tsx # Modal de edição
│   ├── PautaNewDialog.tsx # Modal de criação
│   └── PautaImportDialog.tsx # Modal de importação
├── services/           # Serviços de API
│   └── pautaService.ts # CRUD do Supabase
├── lib/                # Configurações
│   └── supabase.ts     # Cliente Supabase
├── types/              # Tipos TypeScript
│   ├── pauta.ts        # Tipos da aplicação
│   └── database.ts     # Tipos do banco
├── utils/              # Utilitários
│   ├── excelExport.ts  # Exportação Excel
│   └── excelImport.ts  # Importação Excel
├── data/               # Dados mock (não usado em produção)
└── App.tsx             # Componente principal
```

### Backend

**Plataforma:** Supabase (PostgreSQL + API REST automática)

**Banco de dados:**
- **Tabela:** `pauta_pedidos_insercao`
- **Segurança:** Row Level Security (RLS) habilitado
- **Políticas:** Acesso público para leitura/escrita (ajustável)
- **Índices:** Otimizados para busca por ID, cliente, status e data

**Recursos:**
- API REST automática gerada pelo Supabase
- Autenticação e autorização (preparado para futuro)
- Realtime subscriptions (preparado para futuro)
- Triggers para atualização automática de timestamps

### Infraestrutura

**Controle de versão:** GitHub
- Repositório: `machadorafaelc/pauta-management-system`
- Branch principal: `master`
- Deploy automático via Vercel

**Hospedagem:** Vercel
- Deploy contínuo (CD)
- HTTPS automático
- CDN global
- Variáveis de ambiente seguras

**Banco de dados:** Supabase
- Projeto: Plataforma Eleições 2026
- Região: sa-east-1 (São Paulo)
- Backup automático
- Monitoramento incluído

## 🔐 Segurança

### Variáveis de Ambiente

Credenciais sensíveis armazenadas em variáveis de ambiente:
- `VITE_SUPABASE_URL` - URL da API Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave pública do Supabase

### Row Level Security (RLS)

Políticas de segurança configuradas no Supabase:
- Leitura pública permitida
- Inserção pública permitida
- Atualização pública permitida
- Exclusão pública permitida

**Nota:** Em produção, recomenda-se restringir essas políticas para usuários autenticados.

## 📊 Modelo de Dados

### Tabela: pauta_pedidos_insercao

| Campo | Tipo | Origem | Descrição |
|-------|------|--------|-----------|
| id | UUID | Sistema | ID único (chave primária) |
| id_pi | TEXT | Sistema | ID do PI (formato: PI-2025-XXX) |
| numero_pi | INTEGER | API VBS | Número do PI no sistema VBS |
| data_emissao | DATE | API VBS | Data de emissão do PI |
| cliente | TEXT | API VBS | Nome do cliente |
| campanha | TEXT | API VBS | Nome da campanha |
| periodo_inicio | DATE | API VBS | Início do período de veiculação |
| periodo_fim | DATE | API VBS | Fim do período de veiculação |
| veiculo | TEXT | API VBS | Nome do veículo |
| tipo_midia | TEXT | API VBS | Tipo de mídia (TV, Rádio, Internet) |
| formato | TEXT | API VBS | Formato do anúncio |
| valor_bruto | DECIMAL | API VBS | Valor bruto do PI |
| valor_liquido | DECIMAL | API VBS | Valor líquido do PI |
| numero_nf | TEXT | API VBS | Número da nota fiscal |
| data_nf | DATE | API VBS | Data da nota fiscal |
| responsavel_midia | TEXT | Manual | Responsável no time de mídia |
| observacoes_midia | TEXT | Manual | Observações do time de mídia |
| arquivo_pi_url | TEXT | Manual | URL do arquivo do PI |
| responsavel_producao | TEXT | Manual | Responsável no time de produção |
| briefing | TEXT | Manual | Briefing da produção |
| material_aprovado | BOOLEAN | Manual | Material foi aprovado? |
| data_aprovacao_material | DATE | Manual | Data de aprovação do material |
| observacoes_producao | TEXT | Manual | Observações da produção |
| responsavel_checking | TEXT | Manual | Responsável no time de checking |
| comprovante_url | TEXT | Manual | URL do comprovante |
| data_veiculacao_real | DATE | Manual | Data real de veiculação |
| status_checking | TEXT | Manual | Status do checking |
| observacoes_checking | TEXT | Manual | Observações do checking |
| status_geral | TEXT | Manual | Status geral do PI |
| prioridade | TEXT | Manual | Prioridade (Normal, Alta, Urgente) |
| numero_ec | TEXT | Manual | Número do EC |
| numero_pc | TEXT | Manual | Número do PC |
| status_faturamento | TEXT | Manual | Status do faturamento |
| data_faturamento | DATE | Manual | Data do faturamento |
| created_at | TIMESTAMPTZ | Sistema | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Sistema | Data da última atualização |

## 🚀 Roadmap Futuro

### Fase 2 - Integração com API VBS

- [ ] Implementar autenticação com API VBS
- [ ] Sincronização automática de dados
- [ ] Atualização periódica (cron job)
- [ ] Tratamento de conflitos

### Fase 3 - Autenticação e Permissões

- [ ] Sistema de login
- [ ] Controle de acesso por time (Mídia, Produção, Checking)
- [ ] Permissões granulares por campo
- [ ] Auditoria de alterações

### Fase 4 - Funcionalidades Avançadas

- [ ] Upload de arquivos (PIs, comprovantes)
- [ ] Notificações por email
- [ ] Relatórios personalizados
- [ ] Gráficos e dashboards avançados
- [ ] Histórico de alterações
- [ ] Comentários e discussões por PI

### Fase 5 - Otimizações

- [ ] Cache de dados
- [ ] Paginação server-side
- [ ] Lazy loading de imagens
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

## 📞 Contato e Suporte

Para dúvidas ou suporte técnico, consulte:
- **Repositório GitHub:** https://github.com/machadorafaelc/pauta-management-system
- **Issues:** https://github.com/machadorafaelc/pauta-management-system/issues
- **Documentação Supabase:** https://supabase.com/docs
- **Documentação Vercel:** https://vercel.com/docs

---

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025  
**Desenvolvido com:** ❤️ por Manus AI
