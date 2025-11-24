"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/lib/store";
import { RotateCcw, Download } from "lucide-react";
import { AIAnalysisButton } from "@/components/ai-analysis-button";

export function ControlPanel() {
  const {
    parameters,
    force,
    setParameters,
    setForce,
    resetSimulation,
    loadPreset,
  } = useSimulationStore();
  const activePreset = useSimulationStore((s) => s.activePreset);

  const forceDescriptions: Record<string, string> = {
    sine: "Onda continua y suave, ideal para análisis de frecuencia y resonancia",
    step: "Cambio brusco de amplitud, útil para respuesta transitoria",
    sawtooth: "Incremento lineal con caída súbita, simula cargas crecientes",
    square: "Alterna entre dos valores, genera armónicos impares",
    triangle: "Variación lineal simétrica, contenido armónico reducido",
  };

  return (
    <>
      <div className="space-y-4">
        <Card data-tour="control-panel-parameters">
          <CardHeader>
            <CardTitle>Parámetros del Sistema</CardTitle>
            <CardDescription>
              Ajusta las propiedades físicas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary">Masas (kg)</h4>
              {[0, 1, 2].map((i) => (
                <div key={`mass-${i}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>m₁{i === 1 ? "₂" : i === 2 ? "₃" : ""}</Label>
                    <span className="text-sm font-mono text-muted-foreground">
                      {parameters.masses[i].toFixed(2)} kg
                    </span>
                  </div>
                  <Slider
                    value={[parameters.masses[i]]}
                    onValueChange={([value]) => {
                      const newMasses: [number, number, number] = [
                        ...parameters.masses,
                      ];
                      newMasses[i] = value;
                      setParameters({ masses: newMasses });
                    }}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-secondary">
                Resortes (N/m)
              </h4>
              {[0, 1, 2].map((i) => (
                <div key={`spring-${i}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>k₁{i === 1 ? "₂" : i === 2 ? "₃" : ""}</Label>
                    <span className="text-sm font-mono text-muted-foreground">
                      {parameters.springs[i].toFixed(1)} N/m
                    </span>
                  </div>
                  <Slider
                    value={[parameters.springs[i]]}
                    onValueChange={([value]) => {
                      const newSprings: [number, number, number] = [
                        ...parameters.springs,
                      ];
                      newSprings[i] = value;
                      setParameters({ springs: newSprings });
                    }}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-accent">
                Amortiguadores (Ns/m)
              </h4>
              {[0, 1, 2].map((i) => (
                <div key={`damper-${i}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>c₁{i === 1 ? "₂" : i === 2 ? "₃" : ""}</Label>
                    <span className="text-sm font-mono text-muted-foreground">
                      {parameters.dampers[i].toFixed(2)} Ns/m
                    </span>
                  </div>
                  <Slider
                    value={[parameters.dampers[i]]}
                    onValueChange={([value]) => {
                      const newDampers: [number, number, number] = [
                        ...parameters.dampers,
                      ];
                      newDampers[i] = value;
                      setParameters({ dampers: newDampers });
                    }}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-tour="control-panel-force">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Excitación y Presets</CardTitle>
            <CardDescription className="text-sm">
              Configura fuerza externa y selecciona escenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Fuerza Aplicada</h4>
                <div className="space-y-2">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={force.type}
                    onValueChange={(value: any) => setForce({ type: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sine">Sinusoidal</SelectItem>
                      <SelectItem value="step">Escalón</SelectItem>
                      <SelectItem value="sawtooth">Sierra</SelectItem>
                      <SelectItem value="square">Cuadrada</SelectItem>
                      <SelectItem value="triangle">Triangular</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    {forceDescriptions[force.type]}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Amplitud (N)</Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {force.amplitude.toFixed(1)} N
                    </span>
                  </div>
                  <Slider
                    value={[force.amplitude]}
                    onValueChange={([value]) => setForce({ amplitude: value })}
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Frecuencia (Hz)</Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {force.frequency.toFixed(2)} Hz
                    </span>
                  </div>
                  <Slider
                    value={[force.frequency]}
                    onValueChange={([value]) => setForce({ frequency: value })}
                    min={0.1}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={
                      activePreset === "underdamped" ? "default" : "outline"
                    }
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => loadPreset("underdamped")}
                  >
                    Subamort.
                  </Button>
                  <Button
                    variant={
                      activePreset === "critical" ? "default" : "outline"
                    }
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => loadPreset("critical")}
                  >
                    Crítico
                  </Button>
                  <Button
                    variant={
                      activePreset === "overdamped" ? "default" : "outline"
                    }
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => loadPreset("overdamped")}
                  >
                    Sobream.
                  </Button>
                  <Button
                    variant={
                      activePreset === "resonance" ? "default" : "outline"
                    }
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => loadPreset("resonance")}
                  >
                    Resonancia
                  </Button>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9"
                    onClick={resetSimulation}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reiniciar
                  </Button>

                  <AIAnalysisButton />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
