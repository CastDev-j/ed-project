"use client";

import { useState, useEffect } from "react";
import { useSimulationStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function AIAnalysisButton() {
  const { parameters, force, simulationData, currentTime } =
    useSimulationStore();
  const aiAnalysisToken = useSimulationStore((s) => s.aiAnalysisToken);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parameters,
          force,
          simulationData,
          currentTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al analizar");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear AI analysis when inputs change (token increments)
  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }, [aiAnalysisToken]);

  const maxDisplacementX1 = Math.max(
    ...simulationData.positions.x1.map(Math.abs)
  );
  const maxDisplacementX2 = Math.max(
    ...simulationData.positions.x2.map(Math.abs)
  );
  const maxDisplacementX3 = Math.max(
    ...simulationData.positions.x3.map(Math.abs)
  );

  const maxVelocityV1 = Math.max(...simulationData.velocities.v1.map(Math.abs));
  const maxVelocityV2 = Math.max(...simulationData.velocities.v2.map(Math.abs));
  const maxVelocityV3 = Math.max(...simulationData.velocities.v3.map(Math.abs));

  const finalKineticEnergy =
    simulationData.energies.kinetic[
      simulationData.energies.kinetic.length - 1
    ] || 0;
  const finalPotentialEnergy =
    simulationData.energies.potential[
      simulationData.energies.potential.length - 1
    ] || 0;
  const finalTotalEnergy =
    simulationData.energies.total[simulationData.energies.total.length - 1] ||
    0;

  const forceTypeLabels: Record<string, string> = {
    sine: "Sinusoidal",
    step: "Escalón",
    sawtooth: "Sierra",
    square: "Cuadrada",
    triangle: "Triangular",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Análisis IA
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Análisis Inteligente de Resultados</DialogTitle>
          <DialogDescription>
            Interpretación automática mediante Gemini Flash 2.5
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Datos de Entrada */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Parámetros del Sistema
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Masas (kg)</p>
                <p className="font-mono">
                  m₁: {parameters.masses[0].toFixed(2)}
                </p>
                <p className="font-mono">
                  m₂: {parameters.masses[1].toFixed(2)}
                </p>
                <p className="font-mono">
                  m₃: {parameters.masses[2].toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Resortes (N/m)</p>
                <p className="font-mono">
                  k₁: {parameters.springs[0].toFixed(1)}
                </p>
                <p className="font-mono">
                  k₂: {parameters.springs[1].toFixed(1)}
                </p>
                <p className="font-mono">
                  k₃: {parameters.springs[2].toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Amortiguadores (Ns/m)</p>
                <p className="font-mono">
                  c₁: {parameters.dampers[0].toFixed(2)}
                </p>
                <p className="font-mono">
                  c₂: {parameters.dampers[1].toFixed(2)}
                </p>
                <p className="font-mono">
                  c₃: {parameters.dampers[2].toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Fuerza Externa */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg border-b pb-2">
              Fuerza Externa
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">
                  {forceTypeLabels[force.type] || force.type}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Amplitud</p>
                <p className="font-mono">{force.amplitude.toFixed(2)} N</p>
              </div>
              <div>
                <p className="text-muted-foreground">Frecuencia</p>
                <p className="font-mono">{force.frequency.toFixed(2)} Hz</p>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Resultados de Simulación
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                Tiempo simulado:{" "}
                <span className="font-mono text-foreground">
                  {currentTime.toFixed(2)} s
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-2">
                  Desplazamientos Máximos
                </p>
                <p className="font-mono">
                  x₁: {maxDisplacementX1.toFixed(4)} m
                </p>
                <p className="font-mono">
                  x₂: {maxDisplacementX2.toFixed(4)} m
                </p>
                <p className="font-mono">
                  x₃: {maxDisplacementX3.toFixed(4)} m
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">
                  Velocidades Máximas
                </p>
                <p className="font-mono">v₁: {maxVelocityV1.toFixed(4)} m/s</p>
                <p className="font-mono">v₂: {maxVelocityV2.toFixed(4)} m/s</p>
                <p className="font-mono">v₃: {maxVelocityV3.toFixed(4)} m/s</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Energía Cinética Final</p>
                <p className="font-mono">{finalKineticEnergy.toFixed(4)} J</p>
              </div>
              <div>
                <p className="text-muted-foreground">Energía Potencial Final</p>
                <p className="font-mono">{finalPotentialEnergy.toFixed(4)} J</p>
              </div>
              <div>
                <p className="text-muted-foreground">Energía Total Final</p>
                <p className="font-mono">{finalTotalEnergy.toFixed(4)} J</p>
              </div>
            </div>
          </div>

          {/* Botón Analizar */}
          {!analysis && !isLoading && (
            <Button onClick={handleAnalyze} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Generar Análisis con IA
            </Button>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Analizando resultados...
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Análisis */}
          {analysis && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold text-lg">
                  Análisis Técnico Generado
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  className="gap-2"
                >
                  <Sparkles className="h-3 w-3" />
                  Regenerar
                </Button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-semibold mt-5 mb-3"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-3 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 mb-3 space-y-1"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 mb-3 space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono"
                          {...props}
                        />
                      ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-foreground"
                        {...props}
                      />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
