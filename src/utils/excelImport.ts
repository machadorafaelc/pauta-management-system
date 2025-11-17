import * as XLSX from 'xlsx';
import { PedidoInsercao } from '../types/pauta';

/**
 * Mapeia os nomes das colunas do Excel para as propriedades do tipo PedidoInsercao
 */
const columnMapping: Record<string, keyof PedidoInsercao> = {
  'ID PI': 'ID_PI',
  'Cliente': 'CLIENTE',
  'Campanha': 'CAMPANHA',
  'Período Veiculação': 'PERIODO_VEICULACAO',
  'Data Emissão PI': 'DATA_EMISSAO_PI',
  'Número PI': 'NUMERO_PI',
  'Número EC': 'NUMERO_EC',
  'Número PC': 'NUMERO_PC',
  'Meio': 'MEIO',
  'Veículo': 'VEICULO',
  'Praça': 'PRACA',
  'UF': 'UF',
  'Fornecedor Produção': 'FORNECEDOR_PRODUCAO',
  'Itens Produção': 'ITENS_PRODUCAO',
  'Valor Líquido': 'VALOR_LIQUIDO',
  'Valor Comissão': 'VALOR_COMISSAO',
  'Valor Bruto': 'VALOR_BRUTO',
  'DOAC': 'DOAC',
  'Status Geral': 'STATUS_GERAL',
  'Status Mídia': 'STATUS_MIDIA',
  'Status Produção': 'STATUS_PRODUCAO',
  'Status Faturamento': 'STATUS_FATURAMENTO',
  'Detalhamento Status': 'DETALHAMENTO_STATUS',
  'Responsável Checking': 'RESPONSAVEL_CHECKING',
  'Ocorrência Enviada Dia': 'OCORRENCIA_ENVIADA_DIA',
  'Link Relatório Comprovação': 'LINK_RELATORIO_COMPROVACAO',
  'Data Envio Conformidade': 'DATA_ENVIO_CONFORMIDADE',
  'Link Conformidade': 'LINK_CONFORMIDADE',
  'Pagadoria/Nota VBS': 'PAGADORIA_NOTA_VBS',
  'Data Faturamento Agência': 'DATA_FATURAMENTO_AGENCIA',
  'Data Recebimento Agência': 'DATA_RECEBIMENTO_AGENCIA',
  'Data Repasse Fornecedor': 'DATA_REPASSE_FORNECEDOR',
};

/**
 * Converte valor de data do Excel para string ISO
 */
const parseExcelDate = (value: any): string => {
  if (!value) return '';
  
  // Se já é uma string de data
  if (typeof value === 'string') {
    // Tentar converter para ISO format
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return value;
  }
  
  // Se é um número (serial date do Excel)
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  return String(value);
};

/**
 * Valida se um pedido tem os campos obrigatórios
 */
const validatePedido = (pedido: Partial<PedidoInsercao>): string[] => {
  const errors: string[] = [];
  const requiredFields: (keyof PedidoInsercao)[] = [
    'ID_PI',
    'CLIENTE',
    'CAMPANHA',
    'PERIODO_VEICULACAO',
    'DATA_EMISSAO_PI',
    'NUMERO_PI',
    'MEIO',
    'VEICULO',
    'VALOR_BRUTO'
  ];

  requiredFields.forEach(field => {
    if (!pedido[field]) {
      errors.push(`Campo obrigatório ausente: ${field}`);
    }
  });

  return errors;
};

/**
 * Importa pedidos de um arquivo Excel
 */
export const importFromExcel = (file: File): Promise<{
  success: boolean;
  pedidos: PedidoInsercao[];
  errors: string[];
}> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Pegar a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        const pedidos: PedidoInsercao[] = [];
        const errors: string[] = [];

        rawData.forEach((row, index) => {
          try {
            const pedido: Partial<PedidoInsercao> = {};

            // Mapear colunas
            Object.keys(row).forEach(excelColumn => {
              const propertyName = columnMapping[excelColumn];
              if (propertyName) {
                const value = row[excelColumn];
                
                // Tratar valores especiais
                if (propertyName.includes('DATA_') || propertyName.includes('OCORRENCIA_')) {
                  pedido[propertyName] = parseExcelDate(value) as any;
                } else if (propertyName.includes('VALOR_')) {
                  pedido[propertyName] = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.-]/g, '')) as any;
                } else {
                  pedido[propertyName] = value as any;
                }
              }
            });

            // Validar pedido
            const validationErrors = validatePedido(pedido);
            if (validationErrors.length > 0) {
              errors.push(`Linha ${index + 2}: ${validationErrors.join(', ')}`);
            } else {
              pedidos.push(pedido as PedidoInsercao);
            }
          } catch (error) {
            errors.push(`Erro ao processar linha ${index + 2}: ${error}`);
          }
        });

        resolve({
          success: errors.length === 0,
          pedidos,
          errors
        });
      } catch (error) {
        resolve({
          success: false,
          pedidos: [],
          errors: [`Erro ao ler arquivo: ${error}`]
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        pedidos: [],
        errors: ['Erro ao ler arquivo']
      });
    };

    reader.readAsBinaryString(file);
  });
};
