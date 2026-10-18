import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2, ShieldCheck } from "lucide-react";
import { safeStorage } from "../utils/storage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[DesplugaTEA ErrorBoundary] Erro capturado na renderização:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleResetAndReload = (): void => {
    safeStorage.clear();
    window.location.href = window.location.origin;
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#18181b] text-[#f4f4f5] flex items-center justify-center p-4 selection:bg-teal-500/20 font-sans">
          <div className="max-w-md w-full bg-[#27272a] border border-[#3f3f46] rounded-2xl p-6 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                DesplugaTEA — Recuperação Segura
              </h1>
              <p className="text-sm text-[#d4d4d8] leading-relaxed">
                O aplicativo detectou um comportamento inesperado e evitou o fechamento abrupto da interface.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-xs font-mono text-zinc-300 max-h-36 overflow-y-auto">
                <p className="font-semibold text-rose-300 mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-zinc-400 whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2dd4bf] text-[#09090b] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20b2aa] transition-colors cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="py-3 px-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-750 text-zinc-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Limpa configurações salvas localmente e recarrega"
              >
                <Trash2 className="w-4 h-4" />
                Redefinir Dados
              </button>
            </div>

            <p className="text-[11px] text-[#a1a1aa] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Seus dados nunca saem do seu navegador.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
