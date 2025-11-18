-- Adicionar TODOS os campos faltantes baseado na análise visual da planilha
-- Aba MIDIA tem 28 colunas (A até AB)

-- Campos que já devem existir (verificar):
-- cliente, doac, campanha, tipo_midia (MEIO), praca, uf, veiculo
-- data_emissao, status_faturamento, periodo, periodo_inicio, periodo_fim
-- valor_liquido, valor_comissao, valor_bruto, numero_pi

-- Campos MANUAIS a adicionar/verificar:
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS status TEXT; -- Q: STATUS
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS detalhamento TEXT; -- R: DETALHAMENTO
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS relatorio_comprovacao TEXT; -- S: Relatório de comprovação (INTERNET)
-- ocorrencia_enviada_dia já existe (T)
-- status_midia já existe (U)
-- responsavel_checking já existe (V)
-- data_envio_conformidade já existe (W)
-- link_conformidade já existe (X)
-- nota_vbs já existe (Y)
-- data_faturamento_nf_agencia já existe (Z)
-- data_recebimento_agencia já existe (AA)
ALTER TABLE pauta_pedidos_insercao ADD COLUMN IF NOT EXISTS data_repasse_fornecedor DATE; -- AB: DATA DE REPASSE FORNECEDOR

-- Comentários para documentação
COMMENT ON COLUMN pauta_pedidos_insercao.status IS 'Status geral do PI - MANUAL (coluna Q)';
COMMENT ON COLUMN pauta_pedidos_insercao.detalhamento IS 'Detalhamento do status - MANUAL (coluna R)';
COMMENT ON COLUMN pauta_pedidos_insercao.relatorio_comprovacao IS 'Relatório de comprovação (INTERNET) - MANUAL (coluna S)';
COMMENT ON COLUMN pauta_pedidos_insercao.data_repasse_fornecedor IS 'Data de repasse ao fornecedor - MANUAL (coluna AB)';
