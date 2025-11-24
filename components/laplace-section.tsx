"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useSimulationStore } from "@/lib/store"
import { MathFormula } from "./math-formula"
import { Button } from "./ui/button"

export function LaplaceSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { parameters } = useSimulationStore()

  const steps = [
    {
      title: "Paso 1: Aplicar Transformada de Laplace",
      content: "Aplicando la transformada a cada ecuación con condiciones iniciales cero:",
      equations: [
        "\\mathcal{L}\\{\\ddot{x}\\} = s^2X(s)",
        "\\mathcal{L}\\{\\dot{x}\\} = sX(s)",
        "\\mathcal{L}\\{x\\} = X(s)",
      ],
    },
    {
      title: "Paso 2: Sistema Algebraico en s",
      content: "Las ecuaciones diferenciales se convierten en algebraicas:",
      equations: [
        "(m_1s^2 + (c_1+c_2)s + (k_1+k_2))X_1(s) - (c_2s + k_2)X_2(s) = F(s)",
        "-(c_2s + k_2)X_1(s) + (m_2s^2 + (c_2+c_3)s + (k_2+k_3))X_2(s) - (c_3s + k_3)X_3(s) = 0",
        "-(c_3s + k_3)X_2(s) + (m_3s^2 + c_3s + k_3)X_3(s) = 0",
      ],
    },
    {
      title: "Paso 3: Forma Matricial",
      content: "Representación compacta del sistema:",
      equations: ["[A(s)]\\{X(s)\\} = \\{B(s)\\}", "[A(s)] = [M]s^2 + [C]s + [K]"],
    },
    {
      title: "Paso 4: Solución por Cramer",
      content: "Resolvemos usando determinantes:",
      equations: [
        "X_1(s) = \\frac{\\det([A]_1)}{\\det([A])}",
        "X_2(s) = \\frac{\\det([A]_2)}{\\det([A])}",
        "X_3(s) = \\frac{\\det([A]_3)}{\\det([A])}",
      ],
    },
    {
      title: "Paso 5: Transformada Inversa",
      content: "Aplicamos la transformada inversa para obtener x(t):",
      equations: ["x_i(t) = \\mathcal{L}^{-1}\\{X_i(s)\\}", "x_i(t) = \\sum_{j} A_j e^{s_j t}"],
    },
  ]

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Solución con Transformada de Laplace</h2>
          <p className="text-xl text-muted-foreground">
            Método analítico para resolver el sistema de ecuaciones diferenciales
          </p>
        </div>

        <Card>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pasos de Solución</CardTitle>
                    <CardDescription>5 pasos para resolver el sistema con Laplace</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6 pt-0">
                {steps.map((step, index) => (
                  <div key={index} className="border-l-2 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4">{step.content}</p>
                    <div className="space-y-3">
                      {step.equations.map((eq, eqIndex) => (
                        <div key={eqIndex} className="overflow-x-auto">
                          <MathFormula formula={eq} display />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="mt-8 border-primary/50">
          <CardHeader>
            <CardTitle>Parámetros Actuales del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-primary mb-3">Masas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <MathFormula formula="m_1" />
                    <span className="font-mono">{parameters.masses[0].toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="m_2" />
                    <span className="font-mono">{parameters.masses[1].toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="m_3" />
                    <span className="font-mono">{parameters.masses[2].toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-primary mb-3">Resortes</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <MathFormula formula="k_1" />
                    <span className="font-mono">{parameters.springs[0].toFixed(1)} N/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="k_2" />
                    <span className="font-mono">{parameters.springs[1].toFixed(1)} N/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="k_3" />
                    <span className="font-mono">{parameters.springs[2].toFixed(1)} N/m</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-primary mb-3">Amortiguadores</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <MathFormula formula="c_1" />
                    <span className="font-mono">{parameters.dampers[0].toFixed(2)} Ns/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="c_2" />
                    <span className="font-mono">{parameters.dampers[1].toFixed(2)} Ns/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <MathFormula formula="c_3" />
                    <span className="font-mono">{parameters.dampers[2].toFixed(2)} Ns/m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
