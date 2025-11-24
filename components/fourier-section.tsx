"use client";

import { useState, useMemo } from "react";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { computeFourierCoefficients } from "@/lib/physics-engine";
import { MathFormula } from "./math-formula";

export function FourierSection() {
  const [waveType, setWaveType] = useState<"sawtooth" | "square" | "triangle">(
    "sawtooth"
  );
  const [nHarmonics, setNHarmonics] = useState(10);
  const amplitude = 5;

  const coefficients = useMemo(() => {
    return computeFourierCoefficients(waveType, amplitude, nHarmonics);
  }, [waveType, nHarmonics, amplitude]);

  const chartData = useMemo(() => {
    const data = [];
    const points = 200;
    const period = 1;

    for (let i = 0; i <= points; i++) {
      const t = (i / points) * 2 * period;
      let exact = 0;
      let approx = coefficients.a0;

      if (waveType === "sawtooth") {
        const phase = (t / period) % 1;
        exact = amplitude * (2 * phase - 1);
      } else if (waveType === "square") {
        const phase = (t / period) % 1;
        exact = amplitude * (phase < 0.5 ? 1 : -1);
      } else if (waveType === "triangle") {
        const phase = (t / period) % 1;
        exact = amplitude * (phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase);
      }

      for (let n = 1; n <= nHarmonics; n++) {
        approx +=
          coefficients.an[n - 1] * Math.cos((2 * Math.PI * n * t) / period);
        approx +=
          coefficients.bn[n - 1] * Math.sin((2 * Math.PI * n * t) / period);
      }

      data.push({ t, exact, approx });
    }

    return data;
  }, [waveType, nHarmonics, amplitude, coefficients]);

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
          <h2 className="text-4xl font-bold mb-4">Series de Fourier</h2>
          <p className="text-xl text-muted-foreground">
            Aproximación de fuerzas periódicas mediante series trigonométricas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Tipo de onda y número de armónicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tipo de Onda</Label>
                  <Select
                    value={waveType}
                    onValueChange={(value: any) => setWaveType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sawtooth">Diente de Sierra</SelectItem>
                      <SelectItem value="square">Cuadrada</SelectItem>
                      <SelectItem value="triangle">Triangular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Armónicos</Label>
                    <span className="text-sm font-mono text-muted-foreground">
                      {nHarmonics}
                    </span>
                  </div>
                  <Slider
                    value={[nHarmonics]}
                    onValueChange={([value]) => setNHarmonics(value)}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coeficientes de Fourier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm mb-2 font-semibold flex items-center gap-2">
                    <MathFormula formula="a_0" />
                    <span className="text-muted-foreground text-xs">
                      (término constante)
                    </span>
                  </div>
                  <div className="font-mono text-lg">
                    {coefficients.a0.toFixed(4)}
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-sm font-semibold mb-2">
                    Primeros 5 armónicos:
                  </div>
                  {coefficients.bn.slice(0, 5).map((bn, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-primary/5 rounded">
                        <div className="text-xs text-muted-foreground mb-1">
                          <MathFormula formula={`a_{${i + 1}}`} />
                        </div>
                        <div className="font-mono">
                          {coefficients.an[i]?.toFixed(4) || "0.0000"}
                        </div>
                      </div>
                      <div className="p-2 bg-secondary/5 rounded">
                        <div className="text-xs text-muted-foreground mb-1">
                          <MathFormula formula={`b_{${i + 1}}`} />
                        </div>
                        <div className="font-mono">{bn.toFixed(4)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Función Exacta vs Aproximación de Fourier</CardTitle>
                <CardDescription>
                  Comparación entre la función periódica exacta y su
                  aproximación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="t"
                      label={{
                        value: "Tiempo (s)",
                        position: "insideBottom",
                        offset: -5,
                      }}
                      className="text-xs"
                    />
                    <YAxis
                      label={{
                        value: "F(t)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      className="text-xs"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="exact"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="Exacta"
                    />
                    <Line
                      type="monotone"
                      dataKey="approx"
                      stroke="#c026d3"
                      strokeWidth={2}
                      dot={false}
                      name="Aproximación"
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Series de Fourier</CardTitle>
                <CardDescription>
                  Representación matemática de las ondas periódicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {waveType === "sawtooth" && (
                  <div className="p-4 bg-muted rounded overflow-x-auto">
                    <div className="space-y-2">
                      <MathFormula
                        formula="F(t) = \frac{A}{2} - \frac{A}{\pi}\sum_{n=1}^{\infty} \frac{1}{n}\sin(2\pi n f t)"
                        display
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        Coeficientes: <MathFormula formula="a_0 = A/2" />,{" "}
                        <MathFormula formula="a_n = 0" />,{" "}
                        <MathFormula formula="b_n = -A/(\pi n)" />
                      </div>
                    </div>
                  </div>
                )}
                {waveType === "square" && (
                  <div className="p-4 bg-muted rounded overflow-x-auto">
                    <div className="space-y-2">
                      <MathFormula
                        formula="F(t) = \frac{4A}{\pi}\sum_{n=1,3,5,...}^{\infty} \frac{1}{n}\sin(2\pi n f t)"
                        display
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        Coeficientes: <MathFormula formula="a_0 = 0" />,{" "}
                        <MathFormula formula="a_n = 0" />,{" "}
                        <MathFormula formula="b_n = 4A/(\pi n)" /> para{" "}
                        <MathFormula formula="n" /> impares
                      </div>
                    </div>
                  </div>
                )}
                {waveType === "triangle" && (
                  <div className="p-4 bg-muted rounded overflow-x-auto">
                    <div className="space-y-2">
                      <MathFormula
                        formula="F(t) = \frac{8A}{\pi^2}\sum_{n=1,3,5,...}^{\infty} \frac{(-1)^{(n-1)/2}}{n^2}\sin(2\pi n f t)"
                        display
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        Coeficientes: <MathFormula formula="a_0 = 0" />,{" "}
                        <MathFormula formula="a_n = 0" />,{" "}
                        <MathFormula formula="b_n = 8A(-1)^{(n-1)/2}/(\pi^2 n^2)" />{" "}
                        para <MathFormula formula="n" /> impares
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
