"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { MathFormula } from "./math-formula";

export function MathematicalModel() {
  return (
    <div className="container mx-auto px-4" data-tour="mathematical-model">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Modelado Matemático
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sistema de ecuaciones diferenciales acopladas 3×3
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Ecuaciones del Sistema</CardTitle>
              <CardDescription>
                Formulación física de las tres masas acopladas con resortes y
                amortiguadores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 sm:p-4 bg-muted rounded border overflow-x-auto scrollbar-thin">
                <div className="min-w-[340px] sm:min-w-0 space-y-4">
                  <div>
                    <MathFormula
                      formula="m_1\ddot{x}_1 = -k_1x_1 - c_1\dot{x}_1 + k_2(x_2 - x_1) + c_2(\dot{x}_2 - \dot{x}_1) + F(t)"
                      display
                    />
                  </div>
                  <div>
                    <MathFormula
                      formula="m_2\ddot{x}_2 = -k_2(x_2 - x_1) - c_2(\dot{x}_2 - \dot{x}_1) + k_3(x_3 - x_2) + c_3(\dot{x}_3 - \dot{x}_2)"
                      display
                    />
                  </div>
                  <div>
                    <MathFormula
                      formula="m_3\ddot{x}_3 = -k_3(x_3 - x_2) - c_3(\dot{x}_3 - \dot{x}_2)"
                      display
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 border border-primary/20 rounded">
                  <h4 className="font-semibold text-primary mb-2">Masas (m)</h4>
                  <p className="text-sm text-muted-foreground">
                    Inercia del sistema. Mayor masa = mayor resistencia al
                    cambio de movimiento.
                  </p>
                </div>
                <div className="p-4 border border-primary/20 rounded">
                  <h4 className="font-semibold text-primary mb-2">
                    Resortes (k)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Rigidez del sistema. Mayor k = mayor fuerza restauradora y
                    frecuencia natural.
                  </p>
                </div>
                <div className="p-4 border border-primary/20 rounded">
                  <h4 className="font-semibold text-primary mb-2">
                    Amortiguadores (c)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Disipación de energía. Mayor c = menor amplitud y
                    decaimiento más rápido.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Forma Matricial</CardTitle>
              <CardDescription>
                Representación compacta para análisis y solución numérica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 sm:p-4 bg-muted rounded border overflow-x-auto scrollbar-thin">
                <div className="min-w-[360px] sm:min-w-0">
                  <div className="mb-8">
                    <MathFormula
                      formula="[M]\{\ddot{X}\} + [C]\{\dot{X}\} + [K]\{X\} = \{F\}"
                      display
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <div className="font-semibold mb-2 text-sm">
                        Matriz de Masa [M]:
                      </div>
                      <MathFormula
                        formula="[M] = \begin{bmatrix} m_1 & 0 & 0 \\ 0 & m_2 & 0 \\ 0 & 0 & m_3 \end{bmatrix}"
                        display
                      />
                    </div>
                    <div>
                      <div className="font-semibold mb-2 text-sm">
                        Matriz de Amortiguamiento [C]:
                      </div>
                      <MathFormula
                        formula="[C] = \begin{bmatrix} c_1+c_2 & -c_2 & 0 \\ -c_2 & c_2+c_3 & -c_3 \\ 0 & -c_3 & c_3 \end{bmatrix}"
                        display
                      />
                    </div>
                    <div>
                      <div className="font-semibold mb-2 text-sm">
                        Matriz de Rigidez [K]:
                      </div>
                      <MathFormula
                        formula="[K] = \begin{bmatrix} k_1+k_2 & -k_2 & 0 \\ -k_2 & k_2+k_3 & -k_3 \\ 0 & -k_3 & k_3 \end{bmatrix}"
                        display
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
