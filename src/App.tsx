import { useState, useMemo } from "react";
import { PedidoInsercao } from "./types/pauta";
import { mockPedidos } from "./data/mockData";
import { PautaTable } from "./components/PautaTable";
import { PautaFilters } from "./components/PautaFilters";
import { PautaDetailsDialog } from "./components/PautaDetailsDialog";
import { PautaEditDialog } from "./components/PautaEditDialog";
import { StatsCards } from "./components/StatsCards";
import { Button } from "./components/ui/button";
import { Plus, Download, FileSpreadsheet, Upload } from "lucide-react";
import { exportToExcel } from "./utils/excelExport";
import { PautaNewDialog } from "./components/PautaNewDialog";
import { PautaImportDialog } from "./components/PautaImportDialog";
import { toast } from "sonner";

export default function App() {
  const [pedidos, setPedidos] = useState<PedidoInsercao[]>(mockPedidos);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [responsavelFilter, setResponsavelFilter] = useState("all");
  const [faturamentoFilter, setFaturamentoFilter] = useState("all");
  const [selectedPedido, setSelectedPedido] = useState<PedidoInsercao | null>(null);
  const [editingPedido, setEditingPedido] = useState<PedidoInsercao | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      // Filtro de busca
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        pedido.CLIENTE.toLowerCase().includes(searchLower) ||
        pedido.CAMPANHA.toLowerCase().includes(searchLower) ||
        pedido.ID_PI.toLowerCase().includes(searchLower) ||
        pedido.NUMERO_PI.toLowerCase().includes(searchLower) ||
        pedido.VEICULO.toLowerCase().includes(searchLower);

      // Filtro de status
      const matchesStatus = 
        statusFilter === "all" || pedido.STATUS_GERAL === statusFilter;

      // Filtro de responsável
      const matchesResponsavel = 
        responsavelFilter === "all" || pedido.RESPONSAVEL_CHECKING === responsavelFilter;

      // Filtro de faturamento
      const matchesFaturamento = 
        faturamentoFilter === "all" || pedido.STATUS_FATURAMENTO === faturamentoFilter;

      return matchesSearch && matchesStatus && matchesResponsavel && matchesFaturamento;
    });
  }, [pedidos, searchTerm, statusFilter, responsavelFilter, faturamentoFilter]);

  const handleView = (pedido: PedidoInsercao) => {
    setSelectedPedido(pedido);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (pedido: PedidoInsercao) => {
    setEditingPedido(pedido);
    setIsEditDialogOpen(true);
  };

  const handleSave = (updatedPedido: PedidoInsercao) => {
    setPedidos(pedidos.map(p => 
      p.ID_PI === updatedPedido.ID_PI ? updatedPedido : p
    ));
    toast.success("PI atualizado com sucesso!");
  };

  const handleCreate = (newPedido: PedidoInsercao) => {
    setPedidos([newPedido, ...pedidos]);
    toast.success("PI criado com sucesso!");
  };

  const handleImport = (importedPedidos: PedidoInsercao[]) => {
    setPedidos([...importedPedidos, ...pedidos]);
    toast.success(`${importedPedidos.length} PI(s) importado(s) com sucesso!`);
  };

  const handleExport = () => {
    try {
      exportToExcel(filteredPedidos, 'pauta_export');
      toast.success(`${filteredPedidos.length} pedido(s) exportado(s) com sucesso!`);
    } catch (error) {
      toast.error("Erro ao exportar dados");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Gestão de Pauta</h1>
              <p className="text-gray-600">
                Sistema de controle de Pedidos de Inserção (PIs) - Mídia, Produção e Checking
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="size-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="size-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setIsNewDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Novo PI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <StatsCards pedidos={filteredPedidos} />

        {/* Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="size-5 text-blue-700 mt-0.5" />
            <div>
              <h3 className="text-blue-900 mb-1">Legenda de Campos</h3>
              <div className="flex flex-wrap gap-4 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span>Campos API (VBS) - Automáticos e somente leitura</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Campos Manuais - Editáveis pelos times</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <PautaFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          responsavelFilter={responsavelFilter}
          onResponsavelFilterChange={setResponsavelFilter}
          faturamentoFilter={faturamentoFilter}
          onFaturamentoFilterChange={setFaturamentoFilter}
        />

        {/* Table */}
        <PautaTable
          pedidos={filteredPedidos}
          onView={handleView}
          onEdit={handleEdit}
        />

        {/* Showing count */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
        </div>
      </div>

      {/* Dialogs */}
      <PautaDetailsDialog
        pedido={selectedPedido}
        open={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedPedido(null);
        }}
      />

      <PautaEditDialog
        pedido={editingPedido}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingPedido(null);
        }}
        onSave={handleSave}
      />

      <PautaNewDialog
        open={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onSave={handleCreate}
      />

      <PautaImportDialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
