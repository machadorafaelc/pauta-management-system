export type StatusGeral = 
  | "Checking: Em Análise"
  | "Pendente: Veículo"
  | "Pendente: Mídia"
  | "Pendente: Fiscalizadora"
  | "Cliente: Aguardando Conformidade"
  | "FATURADO"
  | "PI CANCELADO"
  | "Aprovado"
  | "Em Produção";

export type StatusFaturamento = 
  | "Não Faturado"
  | "Faturado Parcial"
  | "Faturado Total";

export type ResponsavelChecking = 
  | "Ana Silva"
  | "Carlos Mendes"
  | "Juliana Costa";

export interface PedidoInsercao {
  // Dados Gerais (API)
  ID_PI: string;
  CLIENTE: string;
  CAMPANHA: string;
  PERIODO_VEICULACAO: string;
  DATA_EMISSAO_PI: string;
  NUMERO_PI: string;
  NUMERO_EC: string;
  NUMERO_PC: string;
  
  // Dados de Mídia (API)
  MEIO: string;
  VEICULO: string;
  PRACA: string;
  UF: string;
  
  // Dados de Produção (API)
  FORNECEDOR_PRODUCAO: string;
  ITENS_PRODUCAO: string;
  
  // Valores (API)
  VALOR_LIQUIDO: number;
  VALOR_COMISSAO: number;
  VALOR_BRUTO: number;
  
  // Status e Controle (Manual)
  DOAC?: string;
  STATUS?: string; // Coluna Q
  STATUS_GERAL?: StatusGeral;
  STATUS_MIDIA?: string;
  STATUS_PRODUCAO?: string;
  STATUS_FATURAMENTO?: StatusFaturamento;
  DETALHAMENTO?: string; // Coluna R
  RESPONSAVEL_CHECKING?: ResponsavelChecking;
  OCORRENCIA_ENVIADA_DIA?: string;
  
  // Comprovação e Conformidade (Manual)
  RELATORIO_COMPROVACAO?: string; // Coluna S
  DATA_ENVIO_CONFORMIDADE?: string;
  LINK_CONFORMIDADE?: string;
  
  // Dados Financeiros (Manual)
  PAGADORIA_NOTA_VBS?: string;
  DATA_FATURAMENTO_AGENCIA?: string;
  DATA_RECEBIMENTO_AGENCIA?: string;
  DATA_REPASSE_FORNECEDOR?: string;
}
