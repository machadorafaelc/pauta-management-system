import React, { useState, useEffect, useRef } from "react";
import { PedidoInsercao } from "../types/pauta";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Eye, Pencil, Save, X } from "lucide-react";
import { pautaService } from "../services/pautaService";
import { DoubleScrollbar } from "./DoubleScrollbar";


interface PautaTableProps {
  pedidos: PedidoInsercao[];
  onView: (pedido: PedidoInsercao) => void;
  onEdit: (pedido: PedidoInsercao) => void;
  onUpdate?: () => void;
}

export function PautaTable({ pedidos, onView, onEdit, onUpdate }: PautaTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PedidoInsercao>>({});
  const editingDataRef = useRef<Partial<PedidoInsercao>>({});

  
  // Manter ref sincronizada com o estado
  useEffect(() => {
    editingDataRef.current = editingData;
  }, [editingData]);

  const getStatusColor = (status?: string) => {
    if (!status) return "default";
    
    const statusMap: Record<string, string> = {
      "FATURADO": "bg-green-100 text-green-800 border-green-200",
      "Checking: Em Análise": "bg-blue-100 text-blue-800 border-blue-200",
      "Pendente: Veículo": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Pendente: Mídia": "bg-orange-100 text-orange-800 border-orange-200",
      "Pendente: Fiscalizadora": "bg-purple-100 text-purple-800 border-purple-200",
      "Cliente: Aguardando Conformidade": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "PI CANCELADO": "bg-red-100 text-red-800 border-red-200",
      "Aprovado": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Em Produção": "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    
    return statusMap[status] || "default";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return date;
    }
  };

  const startEditing = (pedido: PedidoInsercao) => {
    setEditingId(pedido.ID_PI);
    setEditingData(pedido);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const saveEditing = async () => {
    if (!editingId) return;
    
    // Usar ref para pegar o valor mais recente
    const dataToSave = editingDataRef.current;
    
    if (!dataToSave || Object.keys(dataToSave).length === 0) return;
    
    try {
      await pautaService.update(editingId, dataToSave);
      setEditingId(null);
      setEditingData({});
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const updateField = (field: keyof PedidoInsercao, value: any) => {
    // Atualizar ref diretamente usando Object.assign
    const newData = Object.assign({}, editingDataRef.current);
    newData[field] = value;
    editingDataRef.current = newData;
    
    // Atualizar estado para re-render
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableCell = (pedido: PedidoInsercao, field: keyof PedidoInsercao, isEditing: boolean) => {
    if (!isEditing) {
      return <span>{(pedido[field] as any) || '-'}</span>;
    }
    
    // Dropdown para Status Mídia
    if (field === 'STATUS_MIDIA') {
      return (
        <select
          value={(editingData[field] as any) || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className="h-8 text-sm border rounded px-2 w-full"
        >
          <option value="">Selecione...</option>
          <option value="Checking: Em Análise">Checking: Em Análise</option>
          <option value="Pendente: Veículo">Pendente: Veículo</option>
          <option value="Pendente: Mídia">Pendente: Mídia</option>
          <option value="Pendente: Fiscalizadora">Pendente: Fiscalizadora</option>
          <option value="Cliente: Aguardando Conformidade">Cliente: Aguardando Conformidade</option>
          <option value="FATURADO">FATURADO</option>
          <option value="PI CANCELADO">PI CANCELADO</option>
          <option value="Aprovado">Aprovado</option>
        </select>
      );
    }
    
    return (
      <Input
        value={(editingData[field] as any) || ''}
        onChange={(e) => updateField(field, e.target.value)}
        className="h-8 text-sm"
      />
    );
  };

  const renderReadOnlyCell = (value: any, className = "") => {
    return (
      <div className={`bg-blue-50 px-2 py-1 rounded text-sm ${className}`}>
        {value || '-'}
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden relative">
      <DoubleScrollbar>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b sticky top-0 z-20">
            <tr>
              {/* Ações */}
              <th className="px-3 py-2 text-left sticky left-0 bg-gray-50 z-30 border-r">Ações</th>
              
              {/* COLUNAS A-P: API VBS (AZUL - Somente Leitura) */}
              <th className="px-3 py-2 text-left bg-blue-100">Cliente</th>
              <th className="px-3 py-2 text-left bg-blue-100">DOAC</th>
              <th className="px-3 py-2 text-left bg-blue-100">Campanha</th>
              <th className="px-3 py-2 text-left bg-blue-100">Meio</th>
              <th className="px-3 py-2 text-left bg-blue-100">Praça</th>
              <th className="px-3 py-2 text-left bg-blue-100">UF</th>
              <th className="px-3 py-2 text-left bg-blue-100">Veículo</th>
              <th className="px-3 py-2 text-left bg-blue-100">Data Emissão</th>
              <th className="px-3 py-2 text-left bg-blue-100">Status Faturamento</th>
              <th className="px-3 py-2 text-left bg-blue-100">Período</th>
              <th className="px-3 py-2 text-left bg-blue-100">Dt. Início Veic.</th>
              <th className="px-3 py-2 text-left bg-blue-100">Dt. Fim Veic.</th>
              <th className="px-3 py-2 text-left bg-blue-100">Líquido</th>
              <th className="px-3 py-2 text-left bg-blue-100">Comissão</th>
              <th className="px-3 py-2 text-left bg-blue-100">Bruto</th>
              <th className="px-3 py-2 text-left bg-blue-100">Nº PI</th>
              
              {/* COLUNAS Q-AB: MANUAL (BRANCO - Editável) */}
              <th className="px-3 py-2 text-left bg-gray-50">Status</th>
              <th className="px-3 py-2 text-left bg-gray-50">Detalhamento</th>
              <th className="px-3 py-2 text-left bg-gray-50">Relatório Comprovação</th>
              <th className="px-3 py-2 text-left bg-gray-50">Ocorrência Enviada</th>
<th className="px-3 py-2 text-left bg-gray-50">Status Mídia</th>
              <th className="px-3 py-2 text-left bg-gray-50">Responsável Checking</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Envio Conformidade</th>
              <th className="px-3 py-2 text-left bg-gray-50">Link Conformidade</th>
              <th className="px-3 py-2 text-left bg-gray-50">Pagadoria/Nota VBS</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Faturamento Agência</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Recebimento Agência</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Repasse Fornecedor</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const isEditing = editingId === pedido.ID_PI;
              
              return (
                <tr key={pedido.ID_PI} className="border-b hover:bg-gray-50 transition-colors">
                  {/* Ações */}
                  <td className="px-3 py-2 sticky left-0 bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={saveEditing}>
                          <Save className="size-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          <X className="size-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(pedido)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => startEditing(pedido)}>
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                  
                  {/* COLUNAS A-P: API VBS (Somente Leitura) */}
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.CLIENTE)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.DOAC)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.CAMPANHA)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.MEIO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.PRACA)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.UF)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.VEICULO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatDate(pedido.DATA_EMISSAO_PI))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.STATUS_FATURAMENTO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.PERIODO_VEICULACAO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatDate(pedido.PERIODO_VEICULACAO))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatDate(pedido.PERIODO_VEICULACAO))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatCurrency(pedido.VALOR_LIQUIDO))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatCurrency(pedido.VALOR_COMISSAO))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatCurrency(pedido.VALOR_BRUTO))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.NUMERO_PI)}</td>
                  
                  {/* COLUNAS Q-AB: MANUAL (Editável) */}
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'STATUS', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DETALHAMENTO', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'RELATORIO_COMPROVACAO', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'OCORRENCIA_ENVIADA_DIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'STATUS_MIDIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'RESPONSAVEL_CHECKING', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_ENVIO_CONFORMIDADE', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'LINK_CONFORMIDADE', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'PAGADORIA_NOTA_VBS', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_FATURAMENTO_AGENCIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_RECEBIMENTO_AGENCIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_REPASSE_FORNECEDOR', isEditing)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pedidos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum pedido encontrado
          </div>
        )}
      </DoubleScrollbar>
    </div>
  );
}
