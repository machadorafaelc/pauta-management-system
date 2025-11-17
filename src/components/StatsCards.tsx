import { PedidoInsercao } from "../types/pauta";
import { FileText, DollarSign, CheckCircle2, Clock } from "lucide-react";

interface StatsCardsProps {
  pedidos: PedidoInsercao[];
}

export function StatsCards({ pedidos }: StatsCardsProps) {
  const totalPedidos = pedidos.length;
  
  const totalValor = pedidos.reduce((acc, p) => acc + p.VALOR_BRUTO, 0);
  
  const faturados = pedidos.filter(p => p.STATUS_GERAL === "FATURADO").length;
  
  const pendentes = pedidos.filter(p => 
    p.STATUS_GERAL?.includes("Pendente") || 
    p.STATUS_GERAL === "Checking: Em Análise"
  ).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const cards = [
    {
      title: "Total de PIs",
      value: totalPedidos,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Valor Total",
      value: formatCurrency(totalValor),
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Faturados",
      value: faturados,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Pendentes",
      value: pendentes,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-2xl ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="size-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
