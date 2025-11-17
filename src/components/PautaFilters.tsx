import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter } from "lucide-react";
import { StatusGeral, StatusFaturamento, ResponsavelChecking } from "../types/pauta";

interface PautaFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  responsavelFilter: string;
  onResponsavelFilterChange: (value: string) => void;
  faturamentoFilter: string;
  onFaturamentoFilterChange: (value: string) => void;
}

const statusOptions: (StatusGeral | "all")[] = [
  "all",
  "Checking: Em Análise",
  "Pendente: Veículo",
  "Pendente: Mídia",
  "Pendente: Fiscalizadora",
  "Cliente: Aguardando Conformidade",
  "FATURADO",
  "PI CANCELADO",
  "Aprovado",
  "Em Produção"
];

const responsavelOptions: (ResponsavelChecking | "all")[] = [
  "all",
  "Ana Silva",
  "Carlos Mendes",
  "Juliana Costa"
];

const faturamentoOptions: (StatusFaturamento | "all")[] = [
  "all",
  "Não Faturado",
  "Faturado Parcial",
  "Faturado Total"
];

export function PautaFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  responsavelFilter,
  onResponsavelFilterChange,
  faturamentoFilter,
  onFaturamentoFilterChange,
}: PautaFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-5 text-gray-600" />
        <h3>Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, campanha, PI..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status Geral" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            {statusOptions.filter(s => s !== "all").map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={responsavelFilter} onValueChange={onResponsavelFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Responsáveis</SelectItem>
            {responsavelOptions.filter(r => r !== "all").map((responsavel) => (
              <SelectItem key={responsavel} value={responsavel}>
                {responsavel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={faturamentoFilter} onValueChange={onFaturamentoFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Faturamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {faturamentoOptions.filter(f => f !== "all").map((faturamento) => (
              <SelectItem key={faturamento} value={faturamento}>
                {faturamento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
