// Tipo para Pedidos de Compra (PCs) - Aba PRODUCAO
export interface PedidoCompra {
  // Campos de identificação
  ID: string;
  ID_PC: string;
  
  // Campos da API VBS (automáticos)
  NUMERO_EC?: number;
  NUMERO_PC: number;
  CLIENTE?: string;
  DOAC?: string;
  CAMPANHA?: string;
  PERIODO?: string;
  VALOR_BRUTO?: number;
  STATUS_FATURAMENTO?: string;
  NOTA_VBS?: string;
  
  // Campos manuais - Produção
  ITENS?: string;
  FORNECEDOR?: string;
  STATUS_PRODUCAO?: string;
  RESPONSAVEL_PRODUCAO?: string;
  
  // Campos manuais - Checking
  RESPONSAVEL_CHECKING?: string;
  STATUS_GERAL?: string;
  DETALHAMENTO?: string;
  OCORRENCIA_ENVIADA_DIA?: string;
  DATA_ENVIO_CONFORMIDADE?: string;
  LINK_CONFORMIDADE?: string;
  LINK_COMPROVANTE?: string;
  
  // Campos manuais - Financeiro
  DATA_FATURAMENTO_NF_AGENCIA?: string;
  DATA_RECEBIMENTO_AGENCIA?: string;
  DATA_REPASSE_FORNECEDOR?: string;
  
  // Campos de controle
  CREATED_AT?: string;
  UPDATED_AT?: string;
}
