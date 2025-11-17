import { supabase } from '../lib/supabase';
import type { PedidoInsercao } from '../types/pauta';
import type { Database } from '../types/database';

type DbPedido = Database['public']['Tables']['pauta_pedidos_insercao']['Row'];
type DbPedidoInsert = Database['public']['Tables']['pauta_pedidos_insercao']['Insert'];
type DbPedidoUpdate = Database['public']['Tables']['pauta_pedidos_insercao']['Update'];

// Converter do formato do banco para o formato da aplicação
function dbToApp(dbPedido: DbPedido): PedidoInsercao {
  return {
    ID_PI: dbPedido.id_pi,
    Numero_PI: dbPedido.numero_pi || 0,
    Data_Emissao: dbPedido.data_emissao || '',
    Cliente: dbPedido.cliente || '',
    Campanha: dbPedido.campanha || '',
    Periodo_Inicio: dbPedido.periodo_inicio || '',
    Periodo_Fim: dbPedido.periodo_fim || '',
    Veiculo: dbPedido.veiculo || '',
    Tipo_Midia: dbPedido.tipo_midia || '',
    Formato: dbPedido.formato || '',
    Valor_Bruto: dbPedido.valor_bruto || 0,
    Valor_Liquido: dbPedido.valor_liquido || 0,
    Numero_NF: dbPedido.numero_nf || '',
    Data_NF: dbPedido.data_nf || '',
    Responsavel_Midia: dbPedido.responsavel_midia || '',
    Observacoes_Midia: dbPedido.observacoes_midia || '',
    Arquivo_PI_URL: dbPedido.arquivo_pi_url || '',
    Responsavel_Producao: dbPedido.responsavel_producao || '',
    Briefing: dbPedido.briefing || '',
    Material_Aprovado: dbPedido.material_aprovado || false,
    Data_Aprovacao_Material: dbPedido.data_aprovacao_material || '',
    Observacoes_Producao: dbPedido.observacoes_producao || '',
    Responsavel_Checking: dbPedido.responsavel_checking || '',
    Comprovante_URL: dbPedido.comprovante_url || '',
    Data_Veiculacao_Real: dbPedido.data_veiculacao_real || '',
    Status_Checking: dbPedido.status_checking || '',
    Observacoes_Checking: dbPedido.observacoes_checking || '',
    Status_Geral: dbPedido.status_geral || 'Pendente',
    Prioridade: dbPedido.prioridade || 'Normal',
    Numero_EC: dbPedido.numero_ec || '',
    Numero_PC: dbPedido.numero_pc || '',
    Status_Faturamento: dbPedido.status_faturamento || 'Não definido',
    Data_Faturamento: dbPedido.data_faturamento || '',
  };
}

// Converter do formato da aplicação para o formato do banco
function appToDb(pedido: Partial<PedidoInsercao>): DbPedidoInsert | DbPedidoUpdate {
  return {
    id_pi: pedido.ID_PI || '',
    numero_pi: pedido.Numero_PI,
    data_emissao: pedido.Data_Emissao,
    cliente: pedido.Cliente,
    campanha: pedido.Campanha,
    periodo_inicio: pedido.Periodo_Inicio,
    periodo_fim: pedido.Periodo_Fim,
    veiculo: pedido.Veiculo,
    tipo_midia: pedido.Tipo_Midia,
    formato: pedido.Formato,
    valor_bruto: pedido.Valor_Bruto,
    valor_liquido: pedido.Valor_Liquido,
    numero_nf: pedido.Numero_NF,
    data_nf: pedido.Data_NF,
    responsavel_midia: pedido.Responsavel_Midia,
    observacoes_midia: pedido.Observacoes_Midia,
    arquivo_pi_url: pedido.Arquivo_PI_URL,
    responsavel_producao: pedido.Responsavel_Producao,
    briefing: pedido.Briefing,
    material_aprovado: pedido.Material_Aprovado,
    data_aprovacao_material: pedido.Data_Aprovacao_Material,
    observacoes_producao: pedido.Observacoes_Producao,
    responsavel_checking: pedido.Responsavel_Checking,
    comprovante_url: pedido.Comprovante_URL,
    data_veiculacao_real: pedido.Data_Veiculacao_Real,
    status_checking: pedido.Status_Checking,
    observacoes_checking: pedido.Observacoes_Checking,
    status_geral: pedido.Status_Geral,
    prioridade: pedido.Prioridade,
    numero_ec: pedido.Numero_EC,
    numero_pc: pedido.Numero_PC,
    status_faturamento: pedido.Status_Faturamento,
    data_faturamento: pedido.Data_Faturamento,
  };
}

export const pautaService = {
  // Listar todos os PIs
  async getAll(): Promise<PedidoInsercao[]> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(dbToApp);
  },

  // Buscar PI por ID
  async getById(id: string): Promise<PedidoInsercao | null> {
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .select('*')
      .eq('id_pi', id)
      .single();

    if (error) throw error;
    return data ? dbToApp(data) : null;
  },

  // Criar novo PI
  async create(pedido: PedidoInsercao): Promise<PedidoInsercao> {
    const dbPedido = appToDb(pedido) as DbPedidoInsert;
    
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .insert(dbPedido)
      .select()
      .single();

    if (error) throw error;
    return dbToApp(data);
  },

  // Atualizar PI
  async update(id: string, pedido: Partial<PedidoInsercao>): Promise<PedidoInsercao> {
    const dbPedido = appToDb(pedido) as DbPedidoUpdate;
    
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .update(dbPedido)
      .eq('id_pi', id)
      .select()
      .single();

    if (error) throw error;
    return dbToApp(data);
  },

  // Deletar PI
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pauta_pedidos_insercao')
      .delete()
      .eq('id_pi', id);

    if (error) throw error;
  },

  // Importar múltiplos PIs
  async importMany(pedidos: PedidoInsercao[]): Promise<PedidoInsercao[]> {
    const dbPedidos = pedidos.map(p => appToDb(p) as DbPedidoInsert);
    
    const { data, error } = await supabase
      .from('pauta_pedidos_insercao')
      .insert(dbPedidos)
      .select();

    if (error) throw error;
    return (data || []).map(dbToApp);
  },
};
