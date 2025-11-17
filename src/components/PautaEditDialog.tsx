import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { PedidoInsercao, StatusGeral, StatusFaturamento, ResponsavelChecking } from "../types/pauta";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";

interface PautaEditDialogProps {
  pedido: PedidoInsercao | null;
  open: boolean;
  onClose: () => void;
  onSave: (pedido: PedidoInsercao) => void;
}

const statusOptions: StatusGeral[] = [
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

const responsavelOptions: ResponsavelChecking[] = [
  "Ana Silva",
  "Carlos Mendes",
  "Juliana Costa"
];

const faturamentoOptions: StatusFaturamento[] = [
  "Não Faturado",
  "Faturado Parcial",
  "Faturado Total"
];

export function PautaEditDialog({ pedido, open, onClose, onSave }: PautaEditDialogProps) {
  const [editedPedido, setEditedPedido] = useState<PedidoInsercao | null>(null);

  useEffect(() => {
    if (pedido) {
      setEditedPedido({ ...pedido });
    }
  }, [pedido]);

  if (!editedPedido) return null;

  const handleSave = () => {
    onSave(editedPedido);
    onClose();
  };

  const updateField = (field: keyof PedidoInsercao, value: any) => {
    setEditedPedido({
      ...editedPedido,
      [field]: value
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Editar {editedPedido.ID_PI}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Campos API são somente leitura
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="controle" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="controle">Controle</TabsTrigger>
            <TabsTrigger value="midia">Mídia</TabsTrigger>
            <TabsTrigger value="producao">Produção</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="controle" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DOAC</Label>
                <Input
                  value={editedPedido.DOAC || ""}
                  onChange={(e) => updateField("DOAC", e.target.value)}
                  placeholder="Número do DOAC"
                />
              </div>

              <div>
                <Label>Status Geral</Label>
                <Select
                  value={editedPedido.STATUS_GERAL}
                  onValueChange={(value) => updateField("STATUS_GERAL", value as StatusGeral)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status Faturamento</Label>
                <Select
                  value={editedPedido.STATUS_FATURAMENTO}
                  onValueChange={(value) => updateField("STATUS_FATURAMENTO", value as StatusFaturamento)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {faturamentoOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Responsável Checking</Label>
                <Select
                  value={editedPedido.RESPONSAVEL_CHECKING}
                  onValueChange={(value) => updateField("RESPONSAVEL_CHECKING", value as ResponsavelChecking)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsavelOptions.map((responsavel) => (
                      <SelectItem key={responsavel} value={responsavel}>
                        {responsavel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ocorrência Enviada Dia</Label>
                <Input
                  type="date"
                  value={editedPedido.OCORRENCIA_ENVIADA_DIA || ""}
                  onChange={(e) => updateField("OCORRENCIA_ENVIADA_DIA", e.target.value)}
                />
              </div>

              <div>
                <Label>Data Envio Conformidade</Label>
                <Input
                  type="date"
                  value={editedPedido.DATA_ENVIO_CONFORMIDADE || ""}
                  onChange={(e) => updateField("DATA_ENVIO_CONFORMIDADE", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label>Detalhamento do Status</Label>
                <Textarea
                  value={editedPedido.DETALHAMENTO_STATUS || ""}
                  onChange={(e) => updateField("DETALHAMENTO_STATUS", e.target.value)}
                  placeholder="Descreva detalhes sobre o status atual..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="midia" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status Mídia</Label>
                <Input
                  value={editedPedido.STATUS_MIDIA || ""}
                  onChange={(e) => updateField("STATUS_MIDIA", e.target.value)}
                  placeholder="Status do time de mídia"
                />
              </div>

              <div>
                <Label>Link Relatório de Comprovação</Label>
                <Input
                  value={editedPedido.LINK_RELATORIO_COMPROVACAO || ""}
                  onChange={(e) => updateField("LINK_RELATORIO_COMPROVACAO", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2">
                <Label>Link Conformidade</Label>
                <Input
                  value={editedPedido.LINK_CONFORMIDADE || ""}
                  onChange={(e) => updateField("LINK_CONFORMIDADE", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">Dados de Mídia (API - Somente Leitura)</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-600">Meio:</span> {editedPedido.MEIO}</div>
                <div><span className="text-gray-600">Veículo:</span> {editedPedido.VEICULO}</div>
                <div><span className="text-gray-600">Praça:</span> {editedPedido.PRACA}</div>
                <div><span className="text-gray-600">UF:</span> {editedPedido.UF}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="producao" className="space-y-4">
            <div>
              <Label>Status Produção</Label>
              <Input
                value={editedPedido.STATUS_PRODUCAO || ""}
                onChange={(e) => updateField("STATUS_PRODUCAO", e.target.value)}
                placeholder="Status do time de produção"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">Dados de Produção (API - Somente Leitura)</div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Fornecedor:</span> {editedPedido.FORNECEDOR_PRODUCAO}</div>
                <div><span className="text-gray-600">Itens:</span> {editedPedido.ITENS_PRODUCAO}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pagadoria Nota VBS</Label>
                <Input
                  value={editedPedido.PAGADORIA_NOTA_VBS || ""}
                  onChange={(e) => updateField("PAGADORIA_NOTA_VBS", e.target.value)}
                  placeholder="Número da nota"
                />
              </div>

              <div>
                <Label>Data Faturamento Agência</Label>
                <Input
                  type="date"
                  value={editedPedido.DATA_FATURAMENTO_AGENCIA || ""}
                  onChange={(e) => updateField("DATA_FATURAMENTO_AGENCIA", e.target.value)}
                />
              </div>

              <div>
                <Label>Data Recebimento Agência</Label>
                <Input
                  type="date"
                  value={editedPedido.DATA_RECEBIMENTO_AGENCIA || ""}
                  onChange={(e) => updateField("DATA_RECEBIMENTO_AGENCIA", e.target.value)}
                />
              </div>

              <div>
                <Label>Data Repasse Fornecedor</Label>
                <Input
                  type="date"
                  value={editedPedido.DATA_REPASSE_FORNECEDOR || ""}
                  onChange={(e) => updateField("DATA_REPASSE_FORNECEDOR", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">Valores (API - Somente Leitura)</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-600 text-sm">Valor Líquido</div>
                  <div>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(editedPedido.VALOR_LIQUIDO)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Comissão</div>
                  <div>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(editedPedido.VALOR_COMISSAO)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Valor Bruto</div>
                  <div>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(editedPedido.VALOR_BRUTO)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
