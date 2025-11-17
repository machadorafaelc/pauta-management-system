import { useState, useRef } from "react";
import { PedidoInsercao } from "../types/pauta";
import { importFromExcel } from "../utils/excelImport";
import { exportTemplate } from "../utils/excelExport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";

interface PautaImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (pedidos: PedidoInsercao[]) => void;
}

export function PautaImportDialog({ open, onClose, onImport }: PautaImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    pedidos: PedidoInsercao[];
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const importResult = await importFromExcel(file);
      setResult(importResult);

      if (importResult.success && importResult.pedidos.length > 0) {
        // Aguardar um pouco para mostrar o resultado
        setTimeout(() => {
          onImport(importResult.pedidos);
          handleClose();
        }, 1500);
      }
    } catch (error) {
      setResult({
        success: false,
        pedidos: [],
        errors: [`Erro ao importar: ${error}`]
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    exportTemplate();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Pedidos de Inserção</DialogTitle>
          <DialogDescription>
            Importe múltiplos PIs de uma planilha Excel. Use o template para garantir a formatação correta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Botão para baixar template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="size-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-blue-900 font-medium mb-1">Template de Importação</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Baixe o template Excel com as colunas corretas e um exemplo de preenchimento.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="size-4 mr-2" />
                  Baixar Template
                </Button>
              </div>
            </div>
          </div>

          {/* Área de upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">
                {file ? file.name : "Clique para selecionar um arquivo"}
              </p>
              <p className="text-sm text-gray-500">
                Arquivos Excel (.xlsx, .xls)
              </p>
            </label>
          </div>

          {/* Resultado da importação */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="size-5 text-green-600" />
                ) : (
                  <AlertCircle className="size-5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    {result.success ? (
                      <div>
                        <p className="font-medium text-green-900 mb-1">
                          Importação concluída com sucesso!
                        </p>
                        <p className="text-sm text-green-700">
                          {result.pedidos.length} pedido(s) importado(s).
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium mb-2">Erros encontrados:</p>
                        <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                          {result.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Instruções */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Instruções:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Baixe o template Excel clicando no botão acima</li>
              <li>Preencha os dados dos PIs seguindo o formato do exemplo</li>
              <li>Salve o arquivo e faça o upload aqui</li>
              <li>Campos obrigatórios: ID PI, Cliente, Campanha, Número PI, Meio, Veículo, Valor Bruto</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || importing}>
            {importing ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
