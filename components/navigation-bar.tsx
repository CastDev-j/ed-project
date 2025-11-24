"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TourGuide, getIsTourActive } from "@/components/tour-guide";
import { Play, Pause, RotateCcw, CuboidIcon } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const sections = [
  { id: "model", label: "Modelo" },
  { id: "visualization", label: "Simulación" },
  { id: "results", label: "Resultados" },
  { id: "laplace", label: "Laplace" },
  { id: "fourier", label: "Fourier" },
  { id: "analysis", label: "Análisis" },
];

export function NavigationBar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const { isRunning, startSimulation, stopSimulation, resetSimulation } =
    useSimulationStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const current = sections.find((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTourActive(getIsTourActive());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-card/95 border-b" : "bg-transparent",
        isTourActive ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                <CuboidIcon />
              </span>
            </div>
            <span className="font-semibold text-lg">Simulador Mecánico</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={isRunning ? "default" : "outline"}
                size="sm"
                onClick={isRunning ? stopSimulation : startSimulation}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" /> Iniciar
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <TourGuide />
          </div>
        </div>
      </div>
    </nav>
  );
}
