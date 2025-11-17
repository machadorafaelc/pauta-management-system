-- Tabela de Pedidos de Inserção (PIs)
CREATE TABLE IF NOT EXISTS pauta_pedidos_insercao (
  -- Campos de identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pi TEXT UNIQUE NOT NULL,
  
  -- Campos da API VBS (automáticos)
  numero_pi INTEGER,
  data_emissao DATE,
  cliente TEXT,
  campanha TEXT,
  periodo_inicio DATE,
  periodo_fim DATE,
  veiculo TEXT,
  tipo_midia TEXT,
  formato TEXT,
  valor_bruto DECIMAL(12,2),
  valor_liquido DECIMAL(12,2),
  numero_nf TEXT,
  data_nf DATE,
  
  -- Campos manuais - Mídia
  responsavel_midia TEXT,
  observacoes_midia TEXT,
  arquivo_pi_url TEXT,
  
  -- Campos manuais - Produção
  responsavel_producao TEXT,
  briefing TEXT,
  material_aprovado BOOLEAN DEFAULT FALSE,
  data_aprovacao_material DATE,
  observacoes_producao TEXT,
  
  -- Campos manuais - Checking
  responsavel_checking TEXT,
  comprovante_url TEXT,
  data_veiculacao_real DATE,
  status_checking TEXT,
  observacoes_checking TEXT,
  
  -- Campos manuais - Controle
  status_geral TEXT DEFAULT 'Pendente',
  prioridade TEXT DEFAULT 'Normal',
  
  -- Campos manuais - Faturamento
  numero_ec TEXT,
  numero_pc TEXT,
  status_faturamento TEXT DEFAULT 'Não definido',
  data_faturamento DATE,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pauta_pi_id_pi ON pauta_pedidos_insercao(id_pi);
CREATE INDEX IF NOT EXISTS idx_pauta_pi_cliente ON pauta_pedidos_insercao(cliente);
CREATE INDEX IF NOT EXISTS idx_pauta_pi_status ON pauta_pedidos_insercao(status_geral);
CREATE INDEX IF NOT EXISTS idx_pauta_pi_data_emissao ON pauta_pedidos_insercao(data_emissao);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_pauta_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pauta_pedidos_insercao_updated_at
  BEFORE UPDATE ON pauta_pedidos_insercao
  FOR EACH ROW
  EXECUTE FUNCTION update_pauta_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE pauta_pedidos_insercao ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (ajuste conforme necessário)
CREATE POLICY "Permitir leitura pública de PIs"
  ON pauta_pedidos_insercao
  FOR SELECT
  USING (true);

-- Política para permitir inserção pública (ajuste conforme necessário)
CREATE POLICY "Permitir inserção pública de PIs"
  ON pauta_pedidos_insercao
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir atualização pública (ajuste conforme necessário)
CREATE POLICY "Permitir atualização pública de PIs"
  ON pauta_pedidos_insercao
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política para permitir exclusão pública (ajuste conforme necessário)
CREATE POLICY "Permitir exclusão pública de PIs"
  ON pauta_pedidos_insercao
  FOR DELETE
  USING (true);
