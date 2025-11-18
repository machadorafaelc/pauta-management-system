import React, { useState, useRef } from "react";
import { PedidoCompra } from "../types/pc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, Pencil, Save, X } from "lucide-react";
import { pcService } from "../services/pcService";
import { DoubleScrollbar } from "./DoubleScrollbar";


interface PCTableProps {
  pedidos: PedidoCompra[];
  onView: (pedido: PedidoCompra) => void;
  onEdit: (pedido: PedidoCompra) => void;
  onUpdate?: () => void;
}

export function PCTable({ pedidos, onView, onEdit, onUpdate }: PCTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PedidoCompra>>({});
  const [statusProducaoFilter, setStatusProducaoFilter] = useState<string>("all");

  // Filtrar pedidos por Status Produção
  const filteredPedidos = pedidos.filter(pedido => {
    if (statusProducaoFilter === "all") return true;
    return pedido.STATUS_PRODUCAO === statusProducaoFilter;
  });


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

  const startEditing = (pedido: PedidoCompra) => {
    setEditingId(pedido.ID_PC);
    setEditingData(pedido);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const saveEditing = async () => {
    if (!editingId || !editingData) return;
    
    try {
      await pcService.update(editingId, editingData);
      setEditingId(null);
      setEditingData({});
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const updateField = (field: keyof PedidoCompra, value: any) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableCell = (pedido: PedidoCompra, field: keyof PedidoCompra, isEditing: boolean) => {
    if (!isEditing) {
      return <span>{(pedido[field] as any) || '-'}</span>;
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
          <thead className="bg-gray-50 border-b sticky top-0">
            <tr>
              {/* Ações */}
              <th className="px-3 py-2 text-left sticky left-0 bg-gray-50 z-10 border-r">Ações</th>
              
              {/* COLUNAS A-J: API VBS (AZUL - Somente Leitura) */}
              <th className="px-3 py-2 text-left bg-blue-100">Cliente</th>
              <th className="px-3 py-2 text-left bg-blue-100">DOAC</th>
              <th className="px-3 py-2 text-left bg-blue-100">Campanha</th>
              <th className="px-3 py-2 text-left bg-blue-100">Itens</th>
              <th className="px-3 py-2 text-left bg-blue-100">Fornecedor</th>
              <th className="px-3 py-2 text-left bg-blue-100">Status Faturamento</th>
              <th className="px-3 py-2 text-left bg-blue-100">Período</th>
              <th className="px-3 py-2 text-left bg-blue-100">Valor Bruto</th>
              <th className="px-3 py-2 text-left bg-blue-100">Nº EC</th>
              <th className="px-3 py-2 text-left bg-blue-100">Nº PC</th>
              
              {/* COLUNAS K-V: MANUAL (BRANCO - Editável) */}
              <th className="px-3 py-2 text-left bg-gray-50">Status</th>
              <th className="px-3 py-2 text-left bg-gray-50">Detalhamento</th>
              <th className="px-3 py-2 text-left bg-gray-50">Ocorrência Enviada</th>
              <th className="px-3 py-2 text-left bg-gray-50">
                <div className="flex items-center gap-2">
                  <span>Status Produção</span>
                  <select
                    value={statusProducaoFilter}
                    onChange={(e) => setStatusProducaoFilter(e.target.value)}
                    className="text-xs border rounded px-1 py-0.5 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">Todos</option>
                    <option value="Em Produção">Em Produção</option>
                    <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </th>
              <th className="px-3 py-2 text-left bg-gray-50">Responsável Checking</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Envio Conformidade</th>
              <th className="px-3 py-2 text-left bg-gray-50">Link Conformidade</th>
              <th className="px-3 py-2 text-left bg-gray-50">Link Comprovante</th>
              <th className="px-3 py-2 text-left bg-gray-50">Pagadoria/Nota VBS</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Faturamento Agência</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Recebimento Agência</th>
              <th className="px-3 py-2 text-left bg-gray-50">Data Repasse Fornecedor</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido) => {
              const isEditing = editingId === pedido.ID_PC;
              
              return (
                <tr key={pedido.ID_PC} className="border-b hover:bg-gray-50 transition-colors">
                  {/* Ações */}
                  <td className="px-3 py-2 sticky left-0 bg-white z-10 border-r">
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
                  
                  {/* COLUNAS A-J: API VBS (Somente Leitura) */}
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.CLIENTE)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.DOAC)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.CAMPANHA)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.ITENS)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.FORNECEDOR)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.STATUS_FATURAMENTO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.PERIODO)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(formatCurrency(pedido.VALOR_BRUTO || 0))}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.NUMERO_EC)}</td>
                  <td className="px-3 py-2 bg-blue-50">{renderReadOnlyCell(pedido.NUMERO_PC)}</td>
                  
                  {/* COLUNAS K-V: MANUAL (Editável) */}
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'STATUS', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DETALHAMENTO', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'OCORRENCIA_ENVIADA_DIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'STATUS_PRODUCAO', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'RESPONSAVEL_CHECKING', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_ENVIO_CONFORMIDADE', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'LINK_CONFORMIDADE', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'LINK_COMPROVANTE', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'PAGADORIA_NOTA_VBS', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_FATURAMENTO_AGENCIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_RECEBIMENTO_AGENCIA', isEditing)}</td>
                  <td className="px-3 py-2">{renderEditableCell(pedido, 'DATA_REPASSE_FORNECEDOR', isEditing)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPedidos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum pedido encontrado
          </div>
        )}
      </DoubleScrollbar>
    </div>
  );
}
