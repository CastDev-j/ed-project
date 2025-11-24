"use client";

import { MathematicalModel } from "@/components/mathematical-model";
import { ControlPanel } from "@/components/control-panel";
import { Visualization3D } from "@/components/visualization-3d";
import { LaplaceSection } from "@/components/laplace-section";
import { FourierSection } from "@/components/fourier-section";
import { ResultsSection } from "@/components/results-section";
import { AnalysisSection } from "@/components/analysis-section";
import { NavigationBar } from "@/components/navigation-bar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NavigationBar />

      <div className="relative pt-16">
        <section id="model" className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <MathematicalModel />
          </div>
        </section>

        <section id="visualization" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold tracking-tight">
                Simulación Interactiva
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Ajusta parámetros y observa el comportamiento dinámico del
                sistema en tiempo real
              </p>
            </div>
            <div className="grid xl:grid-cols-[400px_1fr] gap-8">
              <aside className="xl:sticky xl:top-20 h-fit space-y-6">
                <ControlPanel />
              </aside>
              <div className="min-h-[700px] flex flex-col">
                <Visualization3D />
              </div>
            </div>
          </div>
        </section>

        <section id="laplace" className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <LaplaceSection />
          </div>
        </section>

        <section id="fourier" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <FourierSection />
          </div>
        </section>

        <section id="results" className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <ResultsSection />
          </div>
        </section>

        <section id="analysis" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <AnalysisSection />
          </div>
        </section>
      </div>
    </main>
  );
}
