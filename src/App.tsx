import { useState, useMemo, useEffect } from "react";
import { PedidoInsercao } from "./types/pauta";
import { PedidoCompra } from "./types/pc";
import { pautaService } from "./services/pautaService";
import { pcService } from "./services/pcService";
import { PautaTable } from "./components/PautaTable";
import { PCTable } from "./components/PCTable";
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

type ViewMode = 'pi' | 'pc';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('pi');
  const [pedidos, setPedidos] = useState<PedidoInsercao[]>([]);
  const [pcs, setPcs] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Carregar dados do Supabase
  useEffect(() => {
    loadPedidos();
    loadPCs();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await pautaService.getAll();
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadPCs = async () => {
    try {
      const data = await pcService.getAll();
      setPcs(data);
    } catch (error) {
      console.error('Erro ao carregar PCs:', error);
      toast.error('Erro ao carregar PCs');
    }
  };

  // Dados filtrados conforme o modo
  const currentData = viewMode === 'pi' ? pedidos : pcs as any[];

  const filteredPedidos = useMemo(() => {
    return currentData.filter((pedido: any) => {
      // Filtro de busca
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (pedido.CLIENTE || '').toLowerCase().includes(searchLower) ||
        (pedido.CAMPANHA || '').toLowerCase().includes(searchLower) ||
        (pedido.ID_PI || '').toLowerCase().includes(searchLower) ||
        (pedido.NUMERO_PI?.toString() || '').toLowerCase().includes(searchLower) ||
        (pedido.VEICULO || '').toLowerCase().includes(searchLower);

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
  }, [currentData, searchTerm, statusFilter, responsavelFilter, faturamentoFilter, viewMode]);

  const handleView = (pedido: PedidoInsercao) => {
    setSelectedPedido(pedido);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (pedido: PedidoInsercao) => {
    setEditingPedido(pedido);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (updatedPedido: PedidoInsercao) => {
    try {
      await pautaService.update(updatedPedido.ID_PI, updatedPedido);
      setPedidos(pedidos.map(p => 
        p.ID_PI === updatedPedido.ID_PI ? updatedPedido : p
      ));
      toast.success("PI atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar PI:', error);
      toast.error('Erro ao atualizar PI');
    }
  };

  const handleCreate = async (newPedido: PedidoInsercao) => {
    try {
      const created = await pautaService.create(newPedido);
      setPedidos([created, ...pedidos]);
      toast.success("PI criado com sucesso!");
    } catch (error) {
      console.error('Erro ao criar PI:', error);
      toast.error('Erro ao criar PI');
    }
  };

  const handleImport = async (importedPedidos: PedidoInsercao[]) => {
    try {
      const imported = await pautaService.importMany(importedPedidos);
      setPedidos([...imported, ...pedidos]);
      toast.success(`${imported.length} PI(s) importado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao importar PIs:', error);
      toast.error('Erro ao importar PIs');
    }
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
                Sistema de controle de Pedidos de Inserção (PIs) e Pedidos de Compra (PCs)
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant={viewMode === 'pi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('pi')}
                >
                  📋 PIs - Mídia ({pedidos.length})
                </Button>
                <Button
                  variant={viewMode === 'pc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('pc')}
                >
                  🛒 PCs - Produção ({pcs.length})
                </Button>
              </div>
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
        {viewMode === 'pi' ? (
          <>
            <PautaTable
              pedidos={filteredPedidos}
              onView={handleView}
              onEdit={handleEdit}
              onUpdate={loadData}
            />
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
            </div>
          </>
        ) : (
          <>
            <PCTable
              pedidos={pcs}
              onView={(pc: any) => handleView(pc)}
              onEdit={(pc: any) => handleEdit(pc)}
              onUpdate={loadPCs}
            />
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {pcs.length} pedidos de compra
            </div>
          </>
        )}
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
