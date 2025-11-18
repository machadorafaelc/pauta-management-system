import { supabase } from '../lib/supabase';
import type { PedidoInsercao } from '../types/pauta';

// Mapeamento completo: Banco de Dados -> Aplicação
function dbToApp(data: any): PedidoInsercao {
  return {
    // Dados Gerais (API VBS - Colunas A-P)
    ID_PI: data.id_pi,
    CLIENTE: data.cliente || '',
    CAMPANHA: data.campanha || '',
    PERIODO_VEICULACAO: data.periodo || '',
    DATA_EMISSAO_PI: data.data_emissao || '',
    NUMERO_PI: data.numero_pi?.toString() || '',
    NUMERO_EC: data.numero_ec || '',
    NUMERO_PC: data.numero_pc || '',
    
    // Dados de Mídia (API VBS)
    MEIO: data.tipo_midia || '',
    VEICULO: data.veiculo || '',
    PRACA: data.praca || '',
    UF: data.uf || '',
    DOAC: data.doac || '',
    
    // Dados de Produção
    FORNECEDOR_PRODUCAO: data.fornecedor || '',
    ITENS_PRODUCAO: data.itens || '',
    
    // Valores (API VBS - Colunas M, N, O)
    VALOR_LIQUIDO: data.valor_liquido || 0,
    VALOR_COMISSAO: data.valor_comissao || 0,
    VALOR_BRUTO: data.valor_bruto || 0,
    
    // Status e Controle (MANUAL - Colunas Q, R, T, U, V)
    STATUS: data.status || '',
    STATUS_GERAL: data.status_geral || '',
    STATUS_MIDIA: data.status_midia || '',
    STATUS_PRODUCAO: data.status_producao || '',
    STATUS_FATURAMENTO: data.status_faturamento || '',
    DETALHAMENTO: data.detalhamento || '',
    RESPONSAVEL_CHECKING: data.responsavel_checking || '',
    OCORRENCIA_ENVIADA_DIA: data.ocorrencia_enviada_dia || '',
    
    // Comprovação e Conformidade (MANUAL - Colunas S, W, X)
    RELATORIO_COMPROVACAO: data.relatorio_comprovacao || '',
    DATA_ENVIO_CONFORMIDADE: data.data_envio_conformidade || '',
    LINK_CONFORMIDADE: data.link_conformidade || '',
    
    // Dados Financeiros (MANUAL - Colunas Y, Z, AA, AB)
    PAGADORIA_NOTA_VBS: data.nota_vbs || '',
    DATA_FATURAMENTO_AGENCIA: data.data_faturamento_nf_agencia || '',
    DATA_RECEBIMENTO_AGENCIA: data.data_recebimento_agencia || '',
    DATA_REPASSE_FORNECEDOR: data.data_repasse_fornecedor || '',
  };
}

// Mapeamento completo: Aplicação -> Banco de Dados
function appToDb(pedido: Partial<PedidoInsercao>): any {
  return {
    id_pi: pedido.ID_PI,
    cliente: pedido.CLIENTE,
    campanha: pedido.CAMPANHA,
    periodo: pedido.PERIODO_VEICULACAO,
    data_emissao: pedido.DATA_EMISSAO_PI,
    numero_pi: pedido.NUMERO_PI ? parseInt(pedido.NUMERO_PI) : null,
    numero_ec: pedido.NUMERO_EC,
    numero_pc: pedido.NUMERO_PC,
    tipo_midia: pedido.MEIO,
    veiculo: pedido.VEICULO,
    praca: pedido.PRACA,
    uf: pedido.UF,
    doac: pedido.DOAC,
    fornecedor: pedido.FORNECEDOR_PRODUCAO,
    itens: pedido.ITENS_PRODUCAO,
    valor_liquido: pedido.VALOR_LIQUIDO,
    valor_comissao: pedido.VALOR_COMISSAO,
    valor_bruto: pedido.VALOR_BRUTO,
    status: pedido.STATUS,
    status_geral: pedido.STATUS_GERAL,
    status_midia: pedido.STATUS_MIDIA,
    status_producao: pedido.STATUS_PRODUCAO,
    status_faturamento: pedido.STATUS_FATURAMENTO,
    detalhamento: pedido.DETALHAMENTO,
    responsavel_checking: pedido.RESPONSAVEL_CHECKING,
    ocorrencia_enviada_dia: pedido.OCORRENCIA_ENVIADA_DIA,
    relatorio_comprovacao: pedido.RELATORIO_COMPROVACAO,
    data_envio_conformidade: pedido.DATA_ENVIO_CONFORMIDADE,
    link_conformidade: pedido.LINK_CONFORMIDADE,
    nota_vbs: pedido.PAGADORIA_NOTA_VBS,
    data_faturamento_nf_agencia: pedido.DATA_FATURAMENTO_AGENCIA,
    data_recebimento_agencia: pedido.DATA_RECEBIMENTO_AGENCIA,
    data_repasse_fornecedor: pedido.DATA_REPASSE_FORNECEDOR,
  };
}

export const pautaService = {
  async getAll(): Promise<PedidoInsercao[]> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(dbToApp);
  },

  async getById(id: string): Promise<PedidoInsercao | null> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .select('*')
      .eq('id_pi', id)
      .single();

    if (error) throw error;
    return data ? dbToApp(data) : null;
  },

  async create(pedido: PedidoInsercao): Promise<PedidoInsercao> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .insert(appToDb(pedido))
      .select()
      .single();

    if (error) throw error;
    return dbToApp(data);
  },

  async update(id: string, pedido: Partial<PedidoInsercao>): Promise<PedidoInsercao> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .update(appToDb(pedido))
      .eq('id_pi', id)
      .select()
      .single();

    if (error) throw error;
    return dbToApp(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pauta_pedidos_insercao')
      .delete()
      .eq('id_pi', id);

    if (error) throw error;
  },

  async importMany(pedidos: PedidoInsercao[]): Promise<PedidoInsercao[]> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .insert(pedidos.map(appToDb))
      .select();

    if (error) throw error;
    return (data || []).map(dbToApp);
  },
};
