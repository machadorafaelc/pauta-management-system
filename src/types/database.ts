export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pauta_pedidos_insercao: {
        Row: {
          id: string
          id_pi: string
          numero_pi: number | null
          data_emissao: string | null
          cliente: string | null
          campanha: string | null
          periodo_inicio: string | null
          periodo_fim: string | null
          veiculo: string | null
          tipo_midia: string | null
          formato: string | null
          valor_bruto: number | null
          valor_liquido: number | null
          numero_nf: string | null
          data_nf: string | null
          responsavel_midia: string | null
          observacoes_midia: string | null
          arquivo_pi_url: string | null
          responsavel_producao: string | null
          briefing: string | null
          material_aprovado: boolean | null
          data_aprovacao_material: string | null
          observacoes_producao: string | null
          responsavel_checking: string | null
          comprovante_url: string | null
          data_veiculacao_real: string | null
          status_checking: string | null
          observacoes_checking: string | null
          status_geral: string | null
          prioridade: string | null
          numero_ec: string | null
          numero_pc: string | null
          status_faturamento: string | null
          data_faturamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          id_pi: string
          numero_pi?: number | null
          data_emissao?: string | null
          cliente?: string | null
          campanha?: string | null
          periodo_inicio?: string | null
          periodo_fim?: string | null
          veiculo?: string | null
          tipo_midia?: string | null
          formato?: string | null
          valor_bruto?: number | null
          valor_liquido?: number | null
          numero_nf?: string | null
          data_nf?: string | null
          responsavel_midia?: string | null
          observacoes_midia?: string | null
          arquivo_pi_url?: string | null
          responsavel_producao?: string | null
          briefing?: string | null
          material_aprovado?: boolean | null
          data_aprovacao_material?: string | null
          observacoes_producao?: string | null
          responsavel_checking?: string | null
          comprovante_url?: string | null
          data_veiculacao_real?: string | null
          status_checking?: string | null
          observacoes_checking?: string | null
          status_geral?: string | null
          prioridade?: string | null
          numero_ec?: string | null
          numero_pc?: string | null
          status_faturamento?: string | null
          data_faturamento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          id_pi?: string
          numero_pi?: number | null
          data_emissao?: string | null
          cliente?: string | null
          campanha?: string | null
          periodo_inicio?: string | null
          periodo_fim?: string | null
          veiculo?: string | null
          tipo_midia?: string | null
          formato?: string | null
          valor_bruto?: number | null
          valor_liquido?: number | null
          numero_nf?: string | null
          data_nf?: string | null
          responsavel_midia?: string | null
          observacoes_midia?: string | null
          arquivo_pi_url?: string | null
          responsavel_producao?: string | null
          briefing?: string | null
          material_aprovado?: boolean | null
          data_aprovacao_material?: string | null
          observacoes_producao?: string | null
          responsavel_checking?: string | null
          comprovante_url?: string | null
          data_veiculacao_real?: string | null
          status_checking?: string | null
          observacoes_checking?: string | null
          status_geral?: string | null
          prioridade?: string | null
          numero_ec?: string | null
          numero_pc?: string | null
          status_faturamento?: string | null
          data_faturamento?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
