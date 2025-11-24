"use client";

import { useEffect, useRef } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle, X } from "lucide-react";

export function TourGuide() {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  const baseSteps = [
    {
      element: "[data-tour='control-panel-parameters']",
      popover: {
        title: "Parámetros del Sistema",
        description:
          "Ajusta masas, resortes y amortiguadores para modificar la dinámica.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='control-panel-force']",
      popover: {
        title: "Excitación y Presets",
        description:
          "Configura la fuerza externa (tipo, amplitud, frecuencia) o carga escenarios predefinidos.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='visualization-3d']",
      popover: {
        title: "Visualización 3D",
        description:
          "Observa el movimiento en tiempo real y controla ejecución, pausa y reinicio.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "[data-tour='mathematical-model']",
      popover: {
        title: "Modelo Matemático",
        description:
          "Revisa ecuaciones y matrices que gobiernan el sistema 3×3 masa-resorte-amortiguador.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='results-section']",
      popover: {
        title: "Resultados Globales",
        description:
          "Resumen de desplazamientos, velocidades y energías calculadas durante la simulación.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "[data-tour='results-displacement']",
      popover: {
        title: "Gráfica de Desplazamiento",
        description:
          "Posición de cada masa vs tiempo: identifica amplitudes y acoplamientos.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "[data-tour='results-velocity']",
      popover: {
        title: "Gráfica de Velocidad",
        description:
          "Velocidades instantáneas que permiten analizar fases y comportamiento transitorio.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "[data-tour='results-energy']",
      popover: {
        title: "Gráfica de Energía",
        description:
          "Energía cinética, potencial y total: observa disipación y conservación.",
        side: "top",
        align: "start",
      },
    },
  ];

  const startTour = () => {
    try {
      driverRef.current?.destroy();
      const steps = baseSteps.filter((s) => document.querySelector(s.element));
      driverRef.current = driver({
        showProgress: true,
        allowClose: true,
        disableActiveInteraction: false,
        animate: true,
        steps: steps as any,
        onDestroyed: () => {
          driverRef.current = null;
        },
      });
      driverRef.current.drive();
    } catch (e) {
      console.error("Error iniciando tour:", e);
    }
  };

  const closeTour = () => driverRef.current?.destroy();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={startTour}
        className="gap-2"
        id="start-tour-btn"
      >
        <HelpCircle className="h-4 w-4" />
        Tour
      </Button>
      {driverRef.current && (
        <Button
          variant="ghost"
          size="sm"
          onClick={closeTour}
          aria-label="Cerrar tour"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
