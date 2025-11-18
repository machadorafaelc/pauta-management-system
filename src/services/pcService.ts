import { supabase } from '../lib/supabase';
import { PedidoCompra } from '../types/pc';

// Mapeamento de campos do banco para o tipo TypeScript
const mapPCFromDB = (data: any): PedidoCompra => ({
  ID: data.id,
  ID_PC: data.id_pc,
  NUMERO_EC: data.numero_ec,
  NUMERO_PC: data.numero_pc,
  CLIENTE: data.cliente,
  DOAC: data.doac,
  CAMPANHA: data.campanha,
  PERIODO: data.periodo,
  VALOR_BRUTO: data.valor_bruto,
  STATUS_FATURAMENTO: data.status_faturamento,
  NOTA_VBS: data.nota_vbs,
  ITENS: data.itens,
  FORNECEDOR: data.fornecedor,
  STATUS_PRODUCAO: data.status_producao,
  RESPONSAVEL_CHECKING: data.responsavel_checking,
  STATUS: data.status,
  DETALHAMENTO: data.detalhamento,
  OCORRENCIA_ENVIADA_DIA: data.ocorrencia_enviada_dia,
  DATA_ENVIO_CONFORMIDADE: data.data_envio_conformidade,
  LINK_CONFORMIDADE: data.link_conformidade,
  LINK_COMPROVANTE: data.link_comprovante,
  PAGADORIA_NOTA_VBS: data.pagadoria_nota_vbs,
  DATA_FATURAMENTO_AGENCIA: data.data_faturamento_agencia,
  DATA_RECEBIMENTO_AGENCIA: data.data_recebimento_agencia,
  DATA_REPASSE_FORNECEDOR: data.data_repasse_fornecedor,
  CREATED_AT: data.created_at,
  UPDATED_AT: data.updated_at,
});

const mapPCToDB = (pc: PedidoCompra) => ({
  id_pc: pc.ID_PC,
  numero_ec: pc.NUMERO_EC,
  numero_pc: pc.NUMERO_PC,
  cliente: pc.CLIENTE,
  doac: pc.DOAC,
  campanha: pc.CAMPANHA,
  periodo: pc.PERIODO,
  valor_bruto: pc.VALOR_BRUTO,
  status_faturamento: pc.STATUS_FATURAMENTO,
  nota_vbs: pc.NOTA_VBS,
  itens: pc.ITENS,
  fornecedor: pc.FORNECEDOR,
  status_producao: pc.STATUS_PRODUCAO,
  responsavel_checking: pc.RESPONSAVEL_CHECKING,
  status: pc.STATUS,
  detalhamento: pc.DETALHAMENTO,
  ocorrencia_enviada_dia: pc.OCORRENCIA_ENVIADA_DIA,
  data_envio_conformidade: pc.DATA_ENVIO_CONFORMIDADE,
  link_conformidade: pc.LINK_CONFORMIDADE,
  link_comprovante: pc.LINK_COMPROVANTE,
  pagadoria_nota_vbs: pc.PAGADORIA_NOTA_VBS,
  data_faturamento_agencia: pc.DATA_FATURAMENTO_AGENCIA,
  data_recebimento_agencia: pc.DATA_RECEBIMENTO_AGENCIA,
  data_repasse_fornecedor: pc.DATA_REPASSE_FORNECEDOR,
});

export const pcService = {
  async getAll(): Promise<PedidoCompra[]> {
    const { data, error } = await supabase
      .from('pauta_pedidos_compra')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapPCFromDB);
  },

  async getById(id: string): Promise<PedidoCompra | null> {
    const { data, error } = await supabase
      .from('pauta_pedidos_compra')
      .select('*')
      .eq('id_pc', id)
      .single();

    if (error) throw error;
    return data ? mapPCFromDB(data) : null;
  },

  async create(pc: PedidoCompra): Promise<PedidoCompra> {
    const { data, error } = await supabase
      .from('pauta_pedidos_compra')
      .insert(mapPCToDB(pc))
      .select()
      .single();

    if (error) throw error;
    return mapPCFromDB(data);
  },

  async update(id: string, pc: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const { data, error } = await supabase
      .from('pauta_pedidos_compra')
      .update(mapPCToDB(pc as PedidoCompra))
      .eq('id_pc', id)
      .select()
      .single();

    if (error) throw error;
    return mapPCFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pauta_pedidos_compra')
      .delete()
      .eq('id_pc', id);

    if (error) throw error;
  },

  async importMany(pcs: PedidoCompra[]): Promise<PedidoCompra[]> {
    const { data, error } = await supabase
      .from('pauta_pedidos_compra')
      .insert(pcs.map(mapPCToDB))
      .select();

    if (error) throw error;
    return (data || []).map(mapPCFromDB);
  },
};
