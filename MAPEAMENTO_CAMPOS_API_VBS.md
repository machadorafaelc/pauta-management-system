# Mapeamento de Campos - Sistema de Pauta

## 📘 Legenda de Cores da Planilha Original

- **🔵 AZUL (fundo azul claro)** = Campos que virão **automaticamente da API VBS** (sistema ERP)
- **⚫ PRETO/BRANCO** = Campos que serão **preenchidos manualmente** pelos usuários

---

## 🔵 CAMPOS DA API VBS (Automáticos)

### Dados Gerais do PI
| Campo | Descrição | Tipo |
|-------|-----------|------|
| `CLIENTE` | Nome do cliente | String |
| `DOAC` | Código DOAC | String |
| `CAMPANHA` | Nome da campanha | String |
| `Nº PI` | Número do Pedido de Inserção | Integer |
| `DATA EMISSÃO PI` | Data de emissão do PI | Date |

### Dados de Mídia
| Campo | Descrição | Tipo |
|-------|-----------|------|
| `MEIO` | Tipo de mídia (TV, Rádio, Internet, etc) | String |
| `PRAÇA` | Praça de veiculação | String |
| `UF` | Estado | String |
| `VEÍCULO` | Nome do veículo de comunicação | String |

### Período e Datas
| Campo | Descrição | Tipo |
|-------|-----------|------|
| `PERÍODO` | Período completo de veiculação | String |
| `DT. INÍCIO VEIC.` | Data de início da veiculação | Date |
| `DT. FIM VEIC.` | Data de fim da veiculação | Date |

### Valores Financeiros
| Campo | Descrição | Tipo |
|-------|-----------|------|
| `LÍQUIDO` | Valor líquido | Decimal |
| `COMISSÃO` | Valor da comissão | Decimal |
| `BRUTO` | Valor bruto | Decimal |

### Status e Faturamento
| Campo | Descrição | Tipo |
|-------|-----------|------|
| `STATUS FATURAMENTO` | Status do faturamento no VBS | String |
| `PAGADORIA / NOTA VBS` | Número da nota fiscal no VBS | String |

---

## ⚫ CAMPOS MANUAIS (Preenchidos pelos Usuários)

### Checking e Comprovação
| Campo | Descrição | Responsável | Tipo |
|-------|-----------|-------------|------|
| `STATUS` | Status geral do PI | Checking | Dropdown |
| `RESPONSÁVEL CHECKING` | Nome do responsável | Checking | Dropdown |
| `DETALHAMENTO` | Observações e detalhes | Checking | Text |
| `Relatório de comprovação (INTERNET)` | Link do relatório | Checking | URL |
| `OCORRÊNCIA ENVIADA DIA` | Data de envio da ocorrência | Checking | Date |

### Mídia
| Campo | Descrição | Responsável | Tipo |
|-------|-----------|-------------|------|
| `STATUS MIDIA` | Status do processo de mídia | Mídia | Dropdown |

### Conformidade e Documentação
| Campo | Descrição | Responsável | Tipo |
|-------|-----------|-------------|------|
| `DATA ENVIO PARA CONFORMIDADE` | Data de envio | Conformidade | Date |
| `LINK - CONFORMIDADE` | Link do documento | Conformidade | URL |

### Datas de Controle Financeiro
| Campo | Descrição | Responsável | Tipo |
|-------|-----------|-------------|------|
| `DATA DE FATURAMENTO (NF AGÊNCIA)` | Data da NF da agência | Financeiro | Date |
| `DATA DE RECEBIMENTO AGÊNCIA` | Data de recebimento | Financeiro | Date |
| `DATA DE REPASSE FORNECEDOR` | Data de repasse | Financeiro | Date |

---

## 🎯 OPÇÕES PARA FILTROS (Aba FERRAMENTAS)

### Status Geral
- Pendente
- Em Andamento
- Aguardando Aprovação
- Aprovado
- Faturado
- Cancelado

### Responsáveis Checking
- Ana Silva
- Carlos Santos
- Maria Oliveira
- João Costa
- (Lista completa a ser definida)

### Status Faturamento
- Não definido
- Aguardando Faturamento
- Faturado
- Pago
- Cancelado

### Status Mídia
- Aguardando Briefing
- Em Produção
- Aguardando Aprovação
- Aprovado
- Veiculado

### Meios de Comunicação
- TV
- Rádio
- Internet
- Jornal
- Revista
- OOH (Out of Home)
- Cinema

---

## 🔗 INTEGRAÇÃO COM API VBS

### Endpoint Sugerido
```
GET /api/vbs/pedidos-insercao
```

### Parâmetros
- `data_inicio`: Data inicial para filtro
- `data_fim`: Data final para filtro
- `cliente_id`: ID do cliente (opcional)
- `status`: Status do faturamento (opcional)

### Resposta Esperada (JSON)
```json
{
  "pedidos": [
    {
      "numero_pi": 12345,
      "cliente": "Coca-Cola Brasil",
      "doac": "DOAC-001",
      "campanha": "Verão 2025",
      "meio": "TV",
      "praca": "São Paulo",
      "uf": "SP",
      "veiculo": "TV Globo",
      "data_emissao": "2025-01-15",
      "status_faturamento": "Faturado",
      "periodo": "Janeiro 2025",
      "data_inicio_veiculacao": "2025-01-20",
      "data_fim_veiculacao": "2025-01-31",
      "valor_liquido": 50000.00,
      "valor_comissao": 7500.00,
      "valor_bruto": 57500.00,
      "nota_vbs": "NF-2025-001"
    }
  ]
}
```

### Frequência de Sincronização
- **Automática**: A cada 1 hora (via cron job)
- **Manual**: Botão "Sincronizar com VBS" na interface

### Regras de Atualização
1. **Novos PIs**: Criar automaticamente no Supabase
2. **PIs existentes**: Atualizar apenas os campos da API VBS
3. **Campos manuais**: Nunca sobrescrever (preservar dados inseridos pelos usuários)
4. **Conflitos**: Registrar log e notificar administrador

---

## 📋 PRÓXIMOS PASSOS

### 1. Configurar Credenciais VBS
- [ ] Obter URL base da API VBS
- [ ] Obter chave de API (API Key)
- [ ] Testar autenticação

### 2. Implementar Sincronização
- [ ] Criar serviço de integração no backend
- [ ] Implementar mapeamento de campos VBS → Supabase
- [ ] Criar job de sincronização automática
- [ ] Adicionar botão manual de sincronização

### 3. Validação e Testes
- [ ] Testar com dados reais do VBS
- [ ] Validar mapeamento de todos os campos
- [ ] Verificar tratamento de erros
- [ ] Testar sincronização incremental

### 4. Monitoramento
- [ ] Criar dashboard de status de sincronização
- [ ] Implementar logs de auditoria
- [ ] Configurar alertas de falhas

---

## 🔐 Segurança

- Credenciais da API VBS armazenadas em variáveis de ambiente
- Comunicação via HTTPS
- Validação de dados recebidos
- Rate limiting para evitar sobrecarga

---

**Última atualização**: 18/11/2025
