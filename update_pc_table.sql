-- Adicionar campos faltantes na tabela pauta_pedidos_compra
-- Baseado nas 22 colunas da aba PRODUCAO

-- Verificar campos existentes e adicionar os que faltam
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS detalhamento TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS ocorrencia_enviada_dia DATE;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS status_producao TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS responsavel_checking TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS data_envio_conformidade DATE;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS link_conformidade TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS link_comprovante TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS pagadoria_nota_vbs TEXT;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS data_faturamento_agencia DATE;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS data_recebimento_agencia DATE;
ALTER TABLE pauta_pedidos_compra ADD COLUMN IF NOT EXISTS data_repasse_fornecedor DATE;

-- Comentários para documentação
COMMENT ON COLUMN pauta_pedidos_compra.status IS 'Status do PC - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.detalhamento IS 'Detalhamento do processo - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.ocorrencia_enviada_dia IS 'Data de envio da ocorrência - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.status_producao IS 'Status da produção - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.responsavel_checking IS 'Responsável pelo checking - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.data_envio_conformidade IS 'Data de envio para conformidade - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.link_conformidade IS 'Link do documento de conformidade - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.link_comprovante IS 'Link do comprovante - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.pagadoria_nota_vbs IS 'Pagadoria/Nota VBS - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.data_faturamento_agencia IS 'Data de faturamento da agência - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.data_recebimento_agencia IS 'Data de recebimento pela agência - MANUAL';
COMMENT ON COLUMN pauta_pedidos_compra.data_repasse_fornecedor IS 'Data de repasse ao fornecedor - MANUAL';
