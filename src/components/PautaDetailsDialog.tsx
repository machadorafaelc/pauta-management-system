import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { PedidoInsercao } from "../types/pauta";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface PautaDetailsDialogProps {
  pedido: PedidoInsercao | null;
  open: boolean;
  onClose: () => void;
}

export function PautaDetailsDialog({ pedido, open, onClose }: PautaDetailsDialogProps) {
  if (!pedido) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const InfoField = ({ label, value, isApi = false }: { label: string; value: string | number | undefined; isApi?: boolean }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm text-gray-600">{label}</label>
        {isApi && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            API
          </Badge>
        )}
      </div>
      <div className={isApi ? "bg-blue-50 p-2 rounded" : ""}>
        {value || "-"}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{pedido.ID_PI}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {pedido.STATUS_GERAL || "Sem status"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="midia">Mídia</TabsTrigger>
            <TabsTrigger value="producao">Produção</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            <TabsTrigger value="controle">Controle</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Cliente" value={pedido.CLIENTE} isApi />
              <InfoField label="Campanha" value={pedido.CAMPANHA} isApi />
              <InfoField label="Período de Veiculação" value={pedido.PERIODO_VEICULACAO} isApi />
              <InfoField label="Data de Emissão" value={formatDate(pedido.DATA_EMISSAO_PI)} isApi />
              <InfoField label="Número PI" value={pedido.NUMERO_PI} isApi />
              <InfoField label="Número EC" value={pedido.NUMERO_EC} isApi />
              <InfoField label="Número PC" value={pedido.NUMERO_PC} isApi />
              <InfoField label="DOAC" value={pedido.DOAC} />
            </div>
          </TabsContent>

          <TabsContent value="midia" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Meio" value={pedido.MEIO} isApi />
              <InfoField label="Veículo" value={pedido.VEICULO} isApi />
              <InfoField label="Praça" value={pedido.PRACA} isApi />
              <InfoField label="UF" value={pedido.UF} isApi />
              <InfoField label="Status Mídia" value={pedido.STATUS_MIDIA} />
              {pedido.LINK_RELATORIO_COMPROVACAO && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Link Relatório de Comprovação</label>
                  <Button variant="outline" size="sm" asChild>
                    <a href={pedido.LINK_RELATORIO_COMPROVACAO} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4 mr-2" />
                      Acessar Relatório
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="producao" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <InfoField label="Fornecedor de Produção" value={pedido.FORNECEDOR_PRODUCAO} isApi />
              <InfoField label="Itens de Produção" value={pedido.ITENS_PRODUCAO} isApi />
              <InfoField label="Status Produção" value={pedido.STATUS_PRODUCAO} />
            </div>
          </TabsContent>

          <TabsContent value="valores" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Valor Líquido</div>
                <div className="text-blue-900">{formatCurrency(pedido.VALOR_LIQUIDO)}</div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mt-2">
                  API
                </Badge>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Comissão</div>
                <div className="text-blue-900">{formatCurrency(pedido.VALOR_COMISSAO)}</div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mt-2">
                  API
                </Badge>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Valor Bruto</div>
                <div className="text-blue-900">{formatCurrency(pedido.VALOR_BRUTO)}</div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mt-2">
                  API
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <InfoField label="Pagadoria Nota VBS" value={pedido.PAGADORIA_NOTA_VBS} />
              <InfoField label="Data Faturamento Agência" value={formatDate(pedido.DATA_FATURAMENTO_AGENCIA)} />
              <InfoField label="Data Recebimento Agência" value={formatDate(pedido.DATA_RECEBIMENTO_AGENCIA)} />
              <InfoField label="Data Repasse Fornecedor" value={formatDate(pedido.DATA_REPASSE_FORNECEDOR)} />
            </div>
          </TabsContent>

          <TabsContent value="controle" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Status Geral" value={pedido.STATUS_GERAL} />
              <InfoField label="Status Faturamento" value={pedido.STATUS_FATURAMENTO} />
              <InfoField label="Responsável Checking" value={pedido.RESPONSAVEL_CHECKING} />
              <InfoField label="Ocorrência Enviada Dia" value={formatDate(pedido.OCORRENCIA_ENVIADA_DIA)} />
              <InfoField label="Data Envio Conformidade" value={formatDate(pedido.DATA_ENVIO_CONFORMIDADE)} />
            </div>

            {pedido.LINK_CONFORMIDADE && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Link Conformidade</label>
                <Button variant="outline" size="sm" asChild>
                  <a href={pedido.LINK_CONFORMIDADE} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4 mr-2" />
                    Acessar Conformidade
                  </a>
                </Button>
              </div>
            )}

            {pedido.DETALHAMENTO_STATUS && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Detalhamento do Status</label>
                <div className="bg-gray-50 p-3 rounded border">
                  {pedido.DETALHAMENTO_STATUS}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
