import { PedidoInsercao } from "../types/pauta";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Eye, Pencil } from "lucide-react";

interface PautaTableProps {
  pedidos: PedidoInsercao[];
  onView: (pedido: PedidoInsercao) => void;
  onEdit: (pedido: PedidoInsercao) => void;
}

export function PautaTable({ pedidos, onView, onEdit }: PautaTableProps) {
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
    }).format(value);
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">ID PI</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Campanha</th>
              <th className="px-4 py-3 text-left">Período</th>
              <th className="px-4 py-3 text-left">Veículo</th>
              <th className="px-4 py-3 text-left">Status Geral</th>
              <th className="px-4 py-3 text-left">Valor Bruto</th>
              <th className="px-4 py-3 text-left">Responsável</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.ID_PI} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                    {pedido.ID_PI}
                  </div>
                </td>
                <td className="px-4 py-3">{pedido.CLIENTE}</td>
                <td className="px-4 py-3">{pedido.CAMPANHA}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">{pedido.PERIODO_VEICULACAO}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{pedido.VEICULO}</div>
                  <div className="text-sm text-gray-500">{pedido.MEIO}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={getStatusColor(pedido.STATUS_GERAL)}>
                    {pedido.STATUS_GERAL || "Não definido"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {formatCurrency(pedido.VALOR_BRUTO)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{pedido.RESPONSAVEL_CHECKING || "-"}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(pedido)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(pedido)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pedidos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum pedido encontrado
        </div>
      )}
    </div>
  );
}
