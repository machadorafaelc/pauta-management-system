# Guia de Deploy - Sistema de Pauta

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Supabase
- Conta no Vercel

## 🚀 Deploy no Vercel

### 1. Importar Repositório

Acesse: https://vercel.com/new

Selecione o repositório: `machadorafaelc/pauta-management-system`

### 2. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
VITE_SUPABASE_URL=https://yowqhxzrwwnnomsvchao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd3FoeHpyd3dubm9tc3ZjaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzM3ODYsImV4cCI6MjA3NTY0OTc4Nn0.ldI-O86d5brPIblAooVwKR6PpByhLqKiaPu40UAJ3a4
```

### 3. Deploy

Clique em **"Deploy"**

O Vercel irá automaticamente:
- ✅ Detectar o framework (Vite)
- ✅ Instalar dependências
- ✅ Executar o build
- ✅ Publicar o site

### 4. Deploy Contínuo

Após o primeiro deploy, qualquer push para o branch `master` no GitHub irá automaticamente:
- Criar um novo deploy
- Executar testes (se configurados)
- Publicar a nova versão

## 🗄️ Banco de Dados Supabase

### Informações do Projeto

- **Projeto:** Plataforma Eleições 2026
- **ID:** yowqhxzrwwnnomsvchao
- **Região:** sa-east-1 (São Paulo)
- **Tabela:** `pauta_pedidos_insercao`

### Estrutura da Tabela

A tabela foi criada com prefixo `pauta_` para não conflitar com outras tabelas do projeto.

Campos principais:
- **API VBS (automáticos):** numero_pi, data_emissao, cliente, campanha, periodo, veiculo, valores
- **Manuais - Mídia:** responsavel_midia, observacoes_midia, arquivo_pi_url
- **Manuais - Produção:** responsavel_producao, briefing, material_aprovado
- **Manuais - Checking:** responsavel_checking, comprovante_url, status_checking
- **Manuais - Controle:** status_geral, prioridade
- **Manuais - Faturamento:** numero_ec, numero_pc, status_faturamento

## 🔧 Desenvolvimento Local

### 1. Clonar o repositório

```bash
git clone https://github.com/machadorafaelc/pauta-management-system.git
cd pauta-management-system
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em: http://localhost:3000

### 5. Build para produção

```bash
npm run build
```

Os arquivos de produção estarão em: `build/`

## 📚 Links Úteis

- **Repositório GitHub:** https://github.com/machadorafaelc/pauta-management-system
- **Documentação Supabase:** https://supabase.com/docs
- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Vite:** https://vitejs.dev/

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs de build no Vercel
2. Verifique as variáveis de ambiente
3. Verifique as políticas RLS no Supabase
4. Consulte a documentação oficial
