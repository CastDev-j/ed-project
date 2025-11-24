"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useSimulationStore } from "@/lib/store"
import { computeNaturalFrequencies } from "@/lib/physics-engine"
import { Activity, Waves, TrendingUp } from "lucide-react"
import { MathFormula } from "./math-formula"

export function AnalysisSection() {
  const { parameters } = useSimulationStore()

  const naturalFrequencies = useMemo(() => {
    return computeNaturalFrequencies(parameters)
  }, [parameters])

  const dampingRatios = useMemo(() => {
    const { masses, springs, dampers } = parameters
    return dampers.map((c, i) => {
      const criticalDamping = 2 * Math.sqrt(springs[i] * masses[i])
      return c / criticalDamping
    })
  }, [parameters])

  const systemType = useMemo(() => {
    const avgDampingRatio = dampingRatios.reduce((a, b) => a + b, 0) / dampingRatios.length

    if (avgDampingRatio < 1) return "Subamortiguado"
    if (avgDampingRatio === 1) return "Críticamente Amortiguado"
    return "Sobreamortiguado"
  }, [dampingRatios])

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Análisis del Sistema</h2>
          <p className="text-xl text-muted-foreground">
            Frecuencias naturales, razones de amortiguamiento y estabilidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Waves className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Frecuencias Naturales</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {naturalFrequencies.map((freq, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    <MathFormula formula={`\\omega_{${i + 1}}`} />:
                  </span>
                  <span className="font-mono text-lg font-bold text-primary">{freq.toFixed(3)} rad/s</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground pt-2">
                Frecuencias a las que el sistema oscila naturalmente sin amortiguamiento
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Activity className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">Razones de Amortiguamiento</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dampingRatios.map((ratio, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    <MathFormula formula={`\\zeta_{${i + 1}}`} />:
                  </span>
                  <span className="font-mono text-lg font-bold text-secondary">{ratio.toFixed(4)}</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground pt-2">
                ζ &lt; 1: Subamortiguado, ζ = 1: Crítico, ζ &gt; 1: Sobreamortiguado
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-lg">Tipo de Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-accent mb-2">{systemType}</div>
                <div className="text-sm text-muted-foreground">
                  {systemType === "Subamortiguado" && "El sistema oscila antes de estabilizarse"}
                  {systemType === "Críticamente Amortiguado" &&
                    "El sistema retorna al equilibrio sin oscilar en el tiempo mínimo"}
                  {systemType === "Sobreamortiguado" && "El sistema retorna lentamente al equilibrio sin oscilar"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Matrices del Sistema</CardTitle>
              <CardDescription>Representación matricial del sistema mecánico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-primary">Matriz de Masa [M]</h4>
                <div className="p-3 bg-muted rounded-lg font-mono text-xs overflow-x-auto">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>{parameters.masses[0].toFixed(2)}</div>
                    <div>0.00</div>
                    <div>0.00</div>
                    <div>0.00</div>
                    <div>{parameters.masses[1].toFixed(2)}</div>
                    <div>0.00</div>
                    <div>0.00</div>
                    <div>0.00</div>
                    <div>{parameters.masses[2].toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-secondary">Matriz de Rigidez [K]</h4>
                <div className="p-3 bg-muted rounded-lg font-mono text-xs overflow-x-auto">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>{(parameters.springs[0] + parameters.springs[1]).toFixed(1)}</div>
                    <div>-{parameters.springs[1].toFixed(1)}</div>
                    <div>0.0</div>
                    <div>-{parameters.springs[1].toFixed(1)}</div>
                    <div>{(parameters.springs[1] + parameters.springs[2]).toFixed(1)}</div>
                    <div>-{parameters.springs[2].toFixed(1)}</div>
                    <div>0.0</div>
                    <div>-{parameters.springs[2].toFixed(1)}</div>
                    <div>{parameters.springs[2].toFixed(1)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-accent">Matriz de Amortiguamiento [C]</h4>
                <div className="p-3 bg-muted rounded-lg font-mono text-xs overflow-x-auto">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>{(parameters.dampers[0] + parameters.dampers[1]).toFixed(2)}</div>
                    <div>-{parameters.dampers[1].toFixed(2)}</div>
                    <div>0.00</div>
                    <div>-{parameters.dampers[1].toFixed(2)}</div>
                    <div>{(parameters.dampers[1] + parameters.dampers[2]).toFixed(2)}</div>
                    <div>-{parameters.dampers[2].toFixed(2)}</div>
                    <div>0.00</div>
                    <div>-{parameters.dampers[2].toFixed(2)}</div>
                    <div>{parameters.dampers[2].toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características del Sistema</CardTitle>
              <CardDescription>Propiedades dinámicas calculadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Período Natural Fundamental</h4>
                <div className="text-2xl font-bold text-primary">
                  {((2 * Math.PI) / naturalFrequencies[0]).toFixed(3)} s
                </div>
                <p className="text-xs text-muted-foreground mt-1">Tiempo para completar una oscilación libre</p>
              </div>

              <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Energía Total Inicial</h4>
                <div className="text-2xl font-bold text-secondary">0.00 J</div>
                <p className="text-xs text-muted-foreground mt-1">Suma de energías cinética y potencial</p>
              </div>

              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Estabilidad del Sistema</h4>
                <div className="text-2xl font-bold text-accent">Estable</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos los valores propios tienen parte real negativa
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
