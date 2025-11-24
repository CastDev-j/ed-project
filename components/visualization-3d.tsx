"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MechanicalSystem3D } from "./mechanical-system-3d";
import { SimulationHUD } from "./simulation-hud";
import { Loader2, Play, Pause, RotateCcw } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import React, { Component, type ErrorInfo, type ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-background p-4">
          <div className="text-center text-destructive">
            <p className="font-bold">Error en la visualización 3D</p>
            <p className="text-sm mt-2">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Visualization3D() {
  const {
    isRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    currentTime,
  } = useSimulationStore();

  return (
    <Card className="h-[700px]" data-tour="visualization-3d">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visualización 3D</CardTitle>
            <CardDescription>
              Sistema masa-resorte-amortiguador interactivo en tiempo real
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              t = {currentTime.toFixed(2)}s
            </span>
            <Button
              size="sm"
              variant={isRunning ? "default" : "outline"}
              onClick={isRunning ? stopSimulation : startSimulation}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={resetSimulation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="w-full h-full bg-white border border-border rounded relative overflow-hidden">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                dpr={[1, 1.5]}
                className="w-full h-full"
                performance={{ min: 0.5 }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  alpha: false,
                  stencil: false,
                  depth: true,
                }}
                onCreated={({ scene }) => {
                  scene.background = new THREE.Color("#ffffff");
                }}
              >
                <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
                <OrbitControls
                  enablePan
                  enableZoom
                  enableRotate
                  minDistance={5}
                  maxDistance={18}
                  target={[0, 0.2, 0]}
                  makeDefault
                />

                <Grid
                  args={[14, 14]}
                  cellSize={1}
                  cellThickness={0.4}
                  cellColor="#525252"
                  sectionSize={7}
                  sectionThickness={0.8}
                  sectionColor="#6d6d6d"
                  fadeDistance={18}
                  fadeStrength={0.8}
                  position={[0, -2.05, 0]}
                />

                <MechanicalSystem3D />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
          <div className="absolute top-2 left-2 z-10">
            <SimulationHUD />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Cargando visualización 3D...
        </p>
      </div>
    </div>
  );
}
