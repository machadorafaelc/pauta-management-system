import { useState } from "react";
import { PedidoInsercao, StatusGeral, StatusFaturamento, ResponsavelChecking } from "../types/pauta";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface PautaNewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (pedido: PedidoInsercao) => void;
}

export function PautaNewDialog({ open, onClose, onSave }: PautaNewDialogProps) {
  const [formData, setFormData] = useState<Partial<PedidoInsercao>>({
    ID_PI: `PI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    DATA_EMISSAO_PI: new Date().toISOString().split('T')[0],
    VALOR_LIQUIDO: 0,
    VALOR_COMISSAO: 0,
    VALOR_BRUTO: 0,
    STATUS_FATURAMENTO: "Não Faturado",
  });

  const handleInputChange = (field: keyof PedidoInsercao, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular valor bruto automaticamente
      if (field === 'VALOR_LIQUIDO' || field === 'VALOR_COMISSAO') {
        const liquido = field === 'VALOR_LIQUIDO' ? parseFloat(value) || 0 : (prev.VALOR_LIQUIDO || 0);
        const comissao = field === 'VALOR_COMISSAO' ? parseFloat(value) || 0 : (prev.VALOR_COMISSAO || 0);
        updated.VALOR_BRUTO = liquido + comissao;
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.CLIENTE || !formData.CAMPANHA || !formData.NUMERO_PI) {
      alert("Por favor, preencha todos os campos obrigatórios (Cliente, Campanha, Número PI)");
      return;
    }

    const newPedido: PedidoInsercao = {
      ID_PI: formData.ID_PI || '',
      CLIENTE: formData.CLIENTE || '',
      CAMPANHA: formData.CAMPANHA || '',
      PERIODO_VEICULACAO: formData.PERIODO_VEICULACAO || '',
      DATA_EMISSAO_PI: formData.DATA_EMISSAO_PI || '',
      NUMERO_PI: formData.NUMERO_PI || '',
      NUMERO_EC: formData.NUMERO_EC || '',
      NUMERO_PC: formData.NUMERO_PC || '',
      MEIO: formData.MEIO || '',
      VEICULO: formData.VEICULO || '',
      PRACA: formData.PRACA || '',
      UF: formData.UF || '',
      FORNECEDOR_PRODUCAO: formData.FORNECEDOR_PRODUCAO || '',
      ITENS_PRODUCAO: formData.ITENS_PRODUCAO || '',
      VALOR_LIQUIDO: formData.VALOR_LIQUIDO || 0,
      VALOR_COMISSAO: formData.VALOR_COMISSAO || 0,
      VALOR_BRUTO: formData.VALOR_BRUTO || 0,
      DOAC: formData.DOAC,
      STATUS_GERAL: formData.STATUS_GERAL,
      STATUS_MIDIA: formData.STATUS_MIDIA,
      STATUS_PRODUCAO: formData.STATUS_PRODUCAO,
      STATUS_FATURAMENTO: formData.STATUS_FATURAMENTO,
      DETALHAMENTO_STATUS: formData.DETALHAMENTO_STATUS,
      RESPONSAVEL_CHECKING: formData.RESPONSAVEL_CHECKING,
      OCORRENCIA_ENVIADA_DIA: formData.OCORRENCIA_ENVIADA_DIA,
      LINK_RELATORIO_COMPROVACAO: formData.LINK_RELATORIO_COMPROVACAO,
      DATA_ENVIO_CONFORMIDADE: formData.DATA_ENVIO_CONFORMIDADE,
      LINK_CONFORMIDADE: formData.LINK_CONFORMIDADE,
      PAGADORIA_NOTA_VBS: formData.PAGADORIA_NOTA_VBS,
      DATA_FATURAMENTO_AGENCIA: formData.DATA_FATURAMENTO_AGENCIA,
      DATA_RECEBIMENTO_AGENCIA: formData.DATA_RECEBIMENTO_AGENCIA,
      DATA_REPASSE_FORNECEDOR: formData.DATA_REPASSE_FORNECEDOR,
    };

    onSave(newPedido);
    onClose();
    
    // Resetar formulário
    setFormData({
      ID_PI: `PI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      DATA_EMISSAO_PI: new Date().toISOString().split('T')[0],
      VALOR_LIQUIDO: 0,
      VALOR_COMISSAO: 0,
      VALOR_BRUTO: 0,
      STATUS_FATURAMENTO: "Não Faturado",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido de Inserção (PI)</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo PI. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="midia">Mídia</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            <TabsTrigger value="controle">Controle</TabsTrigger>
          </TabsList>

          {/* Aba: Dados Gerais */}
          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_pi">ID PI</Label>
                <Input
                  id="id_pi"
                  value={formData.ID_PI}
                  onChange={(e) => handleInputChange('ID_PI', e.target.value)}
                  disabled
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_emissao">Data Emissão *</Label>
                <Input
                  id="data_emissao"
                  type="date"
                  value={formData.DATA_EMISSAO_PI}
                  onChange={(e) => handleInputChange('DATA_EMISSAO_PI', e.target.value)}
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={formData.CLIENTE || ''}
                  onChange={(e) => handleInputChange('CLIENTE', e.target.value)}
                  placeholder="Nome do cliente"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campanha">Campanha *</Label>
                <Input
                  id="campanha"
                  value={formData.CAMPANHA || ''}
                  onChange={(e) => handleInputChange('CAMPANHA', e.target.value)}
                  placeholder="Nome da campanha"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_pi">Número PI *</Label>
                <Input
                  id="numero_pi"
                  value={formData.NUMERO_PI || ''}
                  onChange={(e) => handleInputChange('NUMERO_PI', e.target.value)}
                  placeholder="12345"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Período Veiculação</Label>
                <Input
                  id="periodo"
                  value={formData.PERIODO_VEICULACAO || ''}
                  onChange={(e) => handleInputChange('PERIODO_VEICULACAO', e.target.value)}
                  placeholder="01/01/2025 - 31/01/2025"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_ec">Número EC</Label>
                <Input
                  id="numero_ec"
                  value={formData.NUMERO_EC || ''}
                  onChange={(e) => handleInputChange('NUMERO_EC', e.target.value)}
                  placeholder="EC-001"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_pc">Número PC</Label>
                <Input
                  id="numero_pc"
                  value={formData.NUMERO_PC || ''}
                  onChange={(e) => handleInputChange('NUMERO_PC', e.target.value)}
                  placeholder="PC-001"
                  className="bg-blue-50"
                />
              </div>
            </div>
          </TabsContent>

          {/* Aba: Mídia */}
          <TabsContent value="midia" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meio">Meio</Label>
                <Input
                  id="meio"
                  value={formData.MEIO || ''}
                  onChange={(e) => handleInputChange('MEIO', e.target.value)}
                  placeholder="Internet, TV, Rádio..."
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="veiculo">Veículo</Label>
                <Input
                  id="veiculo"
                  value={formData.VEICULO || ''}
                  onChange={(e) => handleInputChange('VEICULO', e.target.value)}
                  placeholder="Google Ads, Globo..."
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="praca">Praça</Label>
                <Input
                  id="praca"
                  value={formData.PRACA || ''}
                  onChange={(e) => handleInputChange('PRACA', e.target.value)}
                  placeholder="Nacional, São Paulo..."
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={formData.UF || ''}
                  onChange={(e) => handleInputChange('UF', e.target.value)}
                  placeholder="BR, SP, RJ..."
                  className="bg-blue-50"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="fornecedor">Fornecedor Produção</Label>
                <Input
                  id="fornecedor"
                  value={formData.FORNECEDOR_PRODUCAO || ''}
                  onChange={(e) => handleInputChange('FORNECEDOR_PRODUCAO', e.target.value)}
                  placeholder="Nome do fornecedor"
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="itens">Itens Produção</Label>
                <Textarea
                  id="itens"
                  value={formData.ITENS_PRODUCAO || ''}
                  onChange={(e) => handleInputChange('ITENS_PRODUCAO', e.target.value)}
                  placeholder="Descrição dos itens de produção"
                  className="bg-blue-50"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Aba: Valores */}
          <TabsContent value="valores" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_liquido">Valor Líquido (R$)</Label>
                <Input
                  id="valor_liquido"
                  type="number"
                  step="0.01"
                  value={formData.VALOR_LIQUIDO}
                  onChange={(e) => handleInputChange('VALOR_LIQUIDO', parseFloat(e.target.value) || 0)}
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_comissao">Valor Comissão (R$)</Label>
                <Input
                  id="valor_comissao"
                  type="number"
                  step="0.01"
                  value={formData.VALOR_COMISSAO}
                  onChange={(e) => handleInputChange('VALOR_COMISSAO', parseFloat(e.target.value) || 0)}
                  className="bg-blue-50"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="valor_bruto">Valor Bruto (R$)</Label>
                <Input
                  id="valor_bruto"
                  type="number"
                  step="0.01"
                  value={formData.VALOR_BRUTO}
                  disabled
                  className="bg-blue-100 font-semibold"
                />
                <p className="text-xs text-gray-500">Calculado automaticamente (Líquido + Comissão)</p>
              </div>
            </div>
          </TabsContent>

          {/* Aba: Controle */}
          <TabsContent value="controle" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doac">DOAC</Label>
                <Input
                  id="doac"
                  value={formData.DOAC || ''}
                  onChange={(e) => handleInputChange('DOAC', e.target.value)}
                  placeholder="DOAC-2025-XXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status_geral">Status Geral</Label>
                <Select
                  value={formData.STATUS_GERAL}
                  onValueChange={(value) => handleInputChange('STATUS_GERAL', value as StatusGeral)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking: Em Análise">Checking: Em Análise</SelectItem>
                    <SelectItem value="Pendente: Veículo">Pendente: Veículo</SelectItem>
                    <SelectItem value="Pendente: Mídia">Pendente: Mídia</SelectItem>
                    <SelectItem value="Pendente: Fiscalizadora">Pendente: Fiscalizadora</SelectItem>
                    <SelectItem value="Cliente: Aguardando Conformidade">Cliente: Aguardando Conformidade</SelectItem>
                    <SelectItem value="FATURADO">FATURADO</SelectItem>
                    <SelectItem value="PI CANCELADO">PI CANCELADO</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável Checking</Label>
                <Select
                  value={formData.RESPONSAVEL_CHECKING}
                  onValueChange={(value) => handleInputChange('RESPONSAVEL_CHECKING', value as ResponsavelChecking)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                    <SelectItem value="Carlos Mendes">Carlos Mendes</SelectItem>
                    <SelectItem value="Juliana Costa">Juliana Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status_faturamento">Status Faturamento</Label>
                <Select
                  value={formData.STATUS_FATURAMENTO}
                  onValueChange={(value) => handleInputChange('STATUS_FATURAMENTO', value as StatusFaturamento)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Não Faturado">Não Faturado</SelectItem>
                    <SelectItem value="Faturado Parcial">Faturado Parcial</SelectItem>
                    <SelectItem value="Faturado Total">Faturado Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="detalhamento">Detalhamento Status</Label>
                <Textarea
                  id="detalhamento"
                  value={formData.DETALHAMENTO_STATUS || ''}
                  onChange={(e) => handleInputChange('DETALHAMENTO_STATUS', e.target.value)}
                  placeholder="Observações sobre o status atual"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar PI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
