import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PedidoInsercao } from '../types/pauta';

/**
 * Formata valor monetário para exibição em Excel
 */
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Exporta os pedidos para arquivo Excel
 */
export const exportToExcel = (pedidos: PedidoInsercao[], filename: string = 'pauta_export') => {
  // Preparar dados para exportação
  const data = pedidos.map(pedido => ({
    // Dados Gerais (API)
    'ID PI': pedido.ID_PI,
    'Cliente': pedido.CLIENTE,
    'Campanha': pedido.CAMPANHA,
    'Período Veiculação': pedido.PERIODO_VEICULACAO,
    'Data Emissão PI': pedido.DATA_EMISSAO_PI,
    'Número PI': pedido.NUMERO_PI,
    'Número EC': pedido.NUMERO_EC,
    'Número PC': pedido.NUMERO_PC,
    
    // Dados de Mídia (API)
    'Meio': pedido.MEIO,
    'Veículo': pedido.VEICULO,
    'Praça': pedido.PRACA,
    'UF': pedido.UF,
    
    // Dados de Produção (API)
    'Fornecedor Produção': pedido.FORNECEDOR_PRODUCAO,
    'Itens Produção': pedido.ITENS_PRODUCAO,
    
    // Valores (API)
    'Valor Líquido': pedido.VALOR_LIQUIDO,
    'Valor Comissão': pedido.VALOR_COMISSAO,
    'Valor Bruto': pedido.VALOR_BRUTO,
    
    // Status e Controle (Manual)
    'DOAC': pedido.DOAC || '',
    'Status Geral': pedido.STATUS_GERAL || '',
    'Status Mídia': pedido.STATUS_MIDIA || '',
    'Status Produção': pedido.STATUS_PRODUCAO || '',
    'Status Faturamento': pedido.STATUS_FATURAMENTO || '',
    'Detalhamento Status': pedido.DETALHAMENTO_STATUS || '',
    'Responsável Checking': pedido.RESPONSAVEL_CHECKING || '',
    'Ocorrência Enviada Dia': pedido.OCORRENCIA_ENVIADA_DIA || '',
    
    // Comprovação e Conformidade (Manual)
    'Link Relatório Comprovação': pedido.LINK_RELATORIO_COMPROVACAO || '',
    'Data Envio Conformidade': pedido.DATA_ENVIO_CONFORMIDADE || '',
    'Link Conformidade': pedido.LINK_CONFORMIDADE || '',
    
    // Dados Financeiros (Manual)
    'Pagadoria/Nota VBS': pedido.PAGADORIA_NOTA_VBS || '',
    'Data Faturamento Agência': pedido.DATA_FATURAMENTO_AGENCIA || '',
    'Data Recebimento Agência': pedido.DATA_RECEBIMENTO_AGENCIA || '',
    'Data Repasse Fornecedor': pedido.DATA_REPASSE_FORNECEDOR || '',
  }));

  // Criar workbook e worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pauta');

  // Definir larguras das colunas
  const columnWidths = [
    { wch: 15 }, // ID PI
    { wch: 25 }, // Cliente
    { wch: 30 }, // Campanha
    { wch: 25 }, // Período Veiculação
    { wch: 15 }, // Data Emissão PI
    { wch: 12 }, // Número PI
    { wch: 12 }, // Número EC
    { wch: 12 }, // Número PC
    { wch: 15 }, // Meio
    { wch: 20 }, // Veículo
    { wch: 20 }, // Praça
    { wch: 8 },  // UF
    { wch: 25 }, // Fornecedor Produção
    { wch: 30 }, // Itens Produção
    { wch: 15 }, // Valor Líquido
    { wch: 15 }, // Valor Comissão
    { wch: 15 }, // Valor Bruto
    { wch: 18 }, // DOAC
    { wch: 25 }, // Status Geral
    { wch: 20 }, // Status Mídia
    { wch: 20 }, // Status Produção
    { wch: 20 }, // Status Faturamento
    { wch: 40 }, // Detalhamento Status
    { wch: 20 }, // Responsável Checking
    { wch: 18 }, // Ocorrência Enviada Dia
    { wch: 30 }, // Link Relatório Comprovação
    { wch: 20 }, // Data Envio Conformidade
    { wch: 30 }, // Link Conformidade
    { wch: 20 }, // Pagadoria/Nota VBS
    { wch: 22 }, // Data Faturamento Agência
    { wch: 22 }, // Data Recebimento Agência
    { wch: 22 }, // Data Repasse Fornecedor
  ];
  
  worksheet['!cols'] = columnWidths;

  // Gerar arquivo Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Adicionar timestamp ao nome do arquivo
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `${filename}_${timestamp}.xlsx`);
};

/**
 * Exporta template vazio para importação
 */
export const exportTemplate = () => {
  const templateData = [{
    'ID PI': 'PI-2025-XXX',
    'Cliente': 'Nome do Cliente',
    'Campanha': 'Nome da Campanha',
    'Período Veiculação': '01/01/2025 - 31/01/2025',
    'Data Emissão PI': '2025-01-01',
    'Número PI': '12345',
    'Número EC': 'EC-001',
    'Número PC': 'PC-001',
    'Meio': 'Internet',
    'Veículo': 'Google Ads',
    'Praça': 'Nacional',
    'UF': 'BR',
    'Fornecedor Produção': 'Nome do Fornecedor',
    'Itens Produção': 'Descrição dos itens',
    'Valor Líquido': 50000.00,
    'Valor Comissão': 7500.00,
    'Valor Bruto': 57500.00,
    'DOAC': 'DOAC-2025-XXX',
    'Status Geral': 'Checking: Em Análise',
    'Status Mídia': 'Em Planejamento',
    'Status Produção': 'Não Iniciado',
    'Status Faturamento': 'Não Faturado',
    'Detalhamento Status': 'Observações sobre o status',
    'Responsável Checking': 'Ana Silva',
    'Ocorrência Enviada Dia': '2025-01-01',
    'Link Relatório Comprovação': 'https://exemplo.com',
    'Data Envio Conformidade': '2025-01-01',
    'Link Conformidade': 'https://exemplo.com',
    'Pagadoria/Nota VBS': 'NF-2025-XXX',
    'Data Faturamento Agência': '2025-01-01',
    'Data Recebimento Agência': '2025-01-01',
    'Data Repasse Fornecedor': '2025-01-01',
  }];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, 'template_importacao_pauta.xlsx');
};
