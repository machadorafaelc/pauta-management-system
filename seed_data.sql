-- Inserir dados de teste na tabela pauta_pedidos_insercao

INSERT INTO pauta_pedidos_insercao (
  id_pi, numero_pi, data_emissao, cliente, campanha,
  periodo_inicio, periodo_fim, veiculo, tipo_midia, formato,
  valor_bruto, valor_liquido, responsavel_midia, responsavel_checking,
  status_geral, status_faturamento
) VALUES
(
  'PI-2025-001', 1001, '2025-01-15', 'Coca-Cola Brasil', 'Verão 2025',
  '2025-01-01', '2025-01-31', 'Google Ads', 'Internet', 'Banner 300x250',
  57500.00, 51750.00, 'Ana Silva', 'Ana Silva',
  'Checking: Em Análise', 'Não definido'
),
(
  'PI-2025-002', 1002, '2025-02-10', 'Ambev', 'Carnaval 2025',
  '2025-02-15', '2025-02-28', 'Globo', 'TV', 'VT 30s',
  172500.00, 155250.00, 'Carlos Mendes', 'Carlos Mendes',
  'FATURADO', 'Faturado'
),
(
  'PI-2025-003', 1003, '2025-02-20', 'Nubank', 'Conta Digital',
  '2025-03-01', '2025-03-31', 'Meta Ads', 'Internet', 'Stories',
  92000.00, 82800.00, 'Juliana Costa', 'Juliana Costa',
  'Pendente: Mídia', 'Não definido'
),
(
  'PI-2025-004', 1004, '2025-11-01', 'Magazine Luiza', 'Black Friday 2025',
  '2025-11-20', '2025-11-30', 'Spotify', 'Rádio', 'Spot 15s',
  40250.00, 36225.00, 'Ana Silva', 'Ana Silva',
  'Aprovado', 'Não definido'
),
(
  'PI-2025-005', 1005, '2025-03-15', 'Itaú', 'Investimentos 2025',
  '2025-04-01', '2025-04-30', 'LinkedIn Ads', 'Internet', 'Carousel',
  51750.00, 46575.00, 'Carlos Mendes', 'Carlos Mendes',
  'Pendente: Veículo', 'Não definido'
);
