-- Tabela de Pedidos de Compra (PCs) - Aba PRODUCAO
CREATE TABLE IF NOT EXISTS pauta_pedidos_compra (
  -- Campos de identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pc TEXT UNIQUE NOT NULL,
  
  -- Campos da API VBS (automáticos)
  numero_ec INTEGER,
  numero_pc INTEGER NOT NULL,
  cliente TEXT,
  doac TEXT,
  campanha TEXT,
  periodo DATE,
  valor_bruto DECIMAL(12,2),
  status_faturamento TEXT DEFAULT 'Não definido',
  nota_vbs TEXT,
  
  -- Campos manuais - Produção
  itens TEXT,
  fornecedor TEXT,
  status_producao TEXT,
  responsavel_producao TEXT,
  
  -- Campos manuais - Checking
  responsavel_checking TEXT,
  status_geral TEXT DEFAULT 'Não definido',
  detalhamento TEXT,
  ocorrencia_enviada_dia DATE,
  data_envio_conformidade DATE,
  link_conformidade TEXT,
  link_comprovante TEXT,
  
  -- Campos manuais - Financeiro
  data_faturamento_nf_agencia DATE,
  data_recebimento_agencia DATE,
  data_repasse_fornecedor DATE,
  
  -- Campos de controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pauta_pc_numero_pc ON pauta_pedidos_compra(numero_pc);
CREATE INDEX IF NOT EXISTS idx_pauta_pc_cliente ON pauta_pedidos_compra(cliente);
CREATE INDEX IF NOT EXISTS idx_pauta_pc_status ON pauta_pedidos_compra(status_geral);
CREATE INDEX IF NOT EXISTS idx_pauta_pc_periodo ON pauta_pedidos_compra(periodo);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pauta_pedidos_compra_updated_at
  BEFORE UPDATE ON pauta_pedidos_compra
  FOR EACH ROW
  EXECUTE FUNCTION update_pauta_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE pauta_pedidos_compra ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso público (mesmas da tabela de PIs)
CREATE POLICY "Permitir leitura pública de PCs"
  ON pauta_pedidos_compra
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção pública de PCs"
  ON pauta_pedidos_compra
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de PCs"
  ON pauta_pedidos_compra
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão pública de PCs"
  ON pauta_pedidos_compra
  FOR DELETE
  USING (true);

-- Comentários para documentação
COMMENT ON TABLE pauta_pedidos_compra IS 'Pedidos de Compra (PCs) - Aba PRODUCAO';
COMMENT ON COLUMN pauta_pedidos_compra.numero_ec IS 'Número do EC - API VBS';
COMMENT ON COLUMN pauta_pedidos_compra.numero_pc IS 'Número do PC (chave principal) - API VBS';
COMMENT ON COLUMN pauta_pedidos_compra.cliente IS 'Nome do cliente - API VBS';
COMMENT ON COLUMN pauta_pedidos_compra.itens IS 'Itens do pedido - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.fornecedor IS 'Nome do fornecedor - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.status_producao IS 'Status do processo de produção - MANUAL';
