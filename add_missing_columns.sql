-- Adicionar campos faltantes na tabela pauta_pedidos_insercao
-- Baseado na planilha original MODELO_Pauta_Faturamento_Checking_Produção.xlsx

-- Campos da API VBS (aba MIDIA)
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS doac TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS praca TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS uf TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS periodo TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS valor_comissao DECIMAL(12,2);
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS nota_vbs TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS status_midia TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS data_envio_conformidade DATE;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS link_conformidade TEXT;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS data_faturamento_nf_agencia DATE;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS data_recebimento_agencia DATE;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS data_repasse_fornecedor DATE;
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS ocorrencia_enviada_dia DATE;

-- Comentários para documentação
COMMENT ON COLUMN pauta_pedidos_insercao.doac IS 'Código DOAC - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.praca IS 'Praça de veiculação - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.uf IS 'Estado - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.periodo IS 'Período de veiculação - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.valor_comissao IS 'Valor da comissão - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.nota_vbs IS 'Número da nota fiscal no VBS - API VBS';
COMMENT ON COLUMN pauta_pedidos_insercao.status_midia IS 'Status do processo de mídia - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.data_envio_conformidade IS 'Data de envio para conformidade - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.link_conformidade IS 'Link do documento de conformidade - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.data_faturamento_nf_agencia IS 'Data da NF da agência - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.data_recebimento_agencia IS 'Data de recebimento pela agência - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.data_repasse_fornecedor IS 'Data de repasse ao fornecedor - MANUAL';
COMMENT ON COLUMN pauta_pedidos_insercao.ocorrencia_enviada_dia IS 'Data de envio da ocorrência - MANUAL';
