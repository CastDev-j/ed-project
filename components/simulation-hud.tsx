"use client";

import { useSimulationStore } from "@/lib/store";
import { getForceFunction } from "@/lib/physics-engine";

export function SimulationHUD() {
  const { force, parameters, currentTime, currentState, isRunning } =
    useSimulationStore();

  const F = getForceFunction(force)(currentTime);

  return (
    <div className="pointer-events-none select-none text-[11px] leading-tight font-mono space-y-1 bg-background/70 backdrop-blur-sm border border-border rounded-md p-2 shadow-sm">
      <div className="flex justify-between">
        <span className="font-semibold">t:</span>
        <span>{currentTime.toFixed(2)} s</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">F(t):</span>
        <span>{F.toFixed(2)} N</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {parameters.masses.map((m, i) => (
          <div key={i} className="text-center">
            m{i + 1}: {m.toFixed(2)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {parameters.springs.map((k, i) => (
          <div key={i} className="text-center">
            k{i + 1}: {k.toFixed(0)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {parameters.dampers.map((c, i) => (
          <div key={i} className="text-center">
            c{i + 1}: {c.toFixed(2)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div>x1: {currentState.x1.toFixed(3)}</div>
        <div>x2: {currentState.x2.toFixed(3)}</div>
        <div>x3: {currentState.x3.toFixed(3)}</div>
      </div>
      <div className="text-center text-[10px] mt-1 opacity-70">
        {isRunning ? "Simulando..." : "Pausado"}
      </div>
    </div>
  );
}
