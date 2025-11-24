"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";
import { useMemo } from "react";

export function ResultsSection() {
  const simulationData = useSimulationStore((state) => state.simulationData);
  const isRunning = useSimulationStore((state) => state.isRunning);

  const positionData = useMemo(() => {
    if (simulationData.time.length === 0) return [];
    return simulationData.time.map((t, i) => ({
      t: Number(t.toFixed(3)),
      x1: Number(simulationData.positions.x1[i].toFixed(4)),
      x2: Number(simulationData.positions.x2[i].toFixed(4)),
      x3: Number(simulationData.positions.x3[i].toFixed(4)),
    }));
  }, [simulationData.time.length, simulationData.positions]);

  const velocityData = useMemo(() => {
    if (simulationData.time.length === 0) return [];
    return simulationData.time.map((t, i) => ({
      t: Number(t.toFixed(3)),
      v1: Number(simulationData.velocities.v1[i].toFixed(4)),
      v2: Number(simulationData.velocities.v2[i].toFixed(4)),
      v3: Number(simulationData.velocities.v3[i].toFixed(4)),
    }));
  }, [simulationData.time.length, simulationData.velocities]);

  const energyData = useMemo(() => {
    if (simulationData.time.length === 0) return [];
    return simulationData.time.map((t, i) => ({
      t: Number(t.toFixed(3)),
      kinetic: Number(simulationData.energies.kinetic[i].toFixed(4)),
      potential: Number(simulationData.energies.potential[i].toFixed(4)),
      total: Number(simulationData.energies.total[i].toFixed(4)),
    }));
  }, [simulationData.time.length, simulationData.energies]);

  const phaseData1 = useMemo(() => {
    if (simulationData.positions.x1.length === 0) return [];
    return simulationData.positions.x1.map((x, i) => ({
      x: Number(x.toFixed(4)),
      v: Number(simulationData.velocities.v1[i].toFixed(4)),
    }));
  }, [simulationData.positions.x1.length, simulationData.velocities.v1]);

  const phaseData2 = useMemo(() => {
    if (simulationData.positions.x2.length === 0) return [];
    return simulationData.positions.x2.map((x, i) => ({
      x: Number(x.toFixed(4)),
      v: Number(simulationData.velocities.v2[i].toFixed(4)),
    }));
  }, [simulationData.positions.x2.length, simulationData.velocities.v2]);

  const phaseData3 = useMemo(() => {
    if (simulationData.positions.x3.length === 0) return [];
    return simulationData.positions.x3.map((x, i) => ({
      x: Number(x.toFixed(4)),
      v: Number(simulationData.velocities.v3[i].toFixed(4)),
    }));
  }, [simulationData.positions.x3.length, simulationData.velocities.v3]);

  const hasData = simulationData.time.length > 0;

  const phaseCombined1 = phaseData1.map((d) => ({ x: d.x, y: d.v }));
  const phaseCombined2 = phaseData2.map((d) => ({ x: d.x, y: d.v }));
  const phaseCombined3 = phaseData3.map((d) => ({ x: d.x, y: d.v }));

  return (
    <div className="container mx-auto px-4" data-tour="results-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">
            Resultados de la Simulación
          </h2>
          <p className="text-base text-muted-foreground">
            Desplazamientos, velocidades, energías y espacio fase actualizados
            en tiempo real
          </p>
          {isRunning && (
            <p className="text-xs text-primary mt-1">
              Simulación en progreso...
            </p>
          )}
        </div>

        {!hasData ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-sm">
                Inicia la simulación para ver las gráficas de resultados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden" data-tour="results-displacement">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Desplazamiento</CardTitle>
                <CardDescription className="text-xs">
                  Posición de cada masa vs tiempo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={330}>
                  <LineChart
                    data={positionData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="t"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="x1"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="x₁"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="x2"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      name="x₂"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="x3"
                      stroke="#c084fc"
                      strokeWidth={2}
                      dot={false}
                      name="x₃"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-tour="results-velocity">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Velocidad</CardTitle>
                <CardDescription className="text-xs">
                  Velocidad de cada masa vs tiempo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={330}>
                  <LineChart
                    data={velocityData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="t"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="v1"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="v₁"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="v2"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      name="v₂"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="v3"
                      stroke="#c084fc"
                      strokeWidth={2}
                      dot={false}
                      name="v₃"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-tour="results-energy">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energía</CardTitle>
                <CardDescription className="text-xs">
                  Cinética, potencial y total
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={330}>
                  <LineChart
                    data={energyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="t"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="kinetic"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="Cinética"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="potential"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      name="Potencial"
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#c084fc"
                      strokeWidth={2}
                      dot={false}
                      name="Total"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Espacio Fase */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Espacio Fase</CardTitle>
                <CardDescription className="text-xs">
                  Trayectorias v vs x para cada masa
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={330}>
                  <ScatterChart
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="x"
                      name="x"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="y"
                      name="v"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ stroke: "#888" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Scatter
                      name="Masa 1"
                      data={phaseCombined1}
                      fill="#8b5cf6"
                      line
                      lineType="joint"
                    />
                    <Scatter
                      name="Masa 2"
                      data={phaseCombined2}
                      fill="#a855f7"
                      line
                      lineType="joint"
                    />
                    <Scatter
                      name="Masa 3"
                      data={phaseCombined3}
                      fill="#c084fc"
                      line
                      lineType="joint"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
