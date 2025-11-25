import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parameters, force, simulationData, currentTime } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada" },
        { status: 500 }
      );
    }

    const prompt = `Interpreta técnicamente los siguientes RESULTADOS de una simulación masa-resorte-amortiguador de 3 grados de libertad. Limítate a analizar coherencia física, patrones dinámicos (transitorio / estacionario / posible resonancia), disipación de energía y recomendaciones breves. NO describas el modelo ni repitas instrucciones. NO incluyas saludos ni despedidas.

PARÁMETROS:
m = [${parameters.masses[0]}, ${parameters.masses[1]}, ${
      parameters.masses[2]
    }] kg
k = [${parameters.springs[0]}, ${parameters.springs[1]}, ${
      parameters.springs[2]
    }] N/m
c = [${parameters.dampers[0]}, ${parameters.dampers[1]}, ${
      parameters.dampers[2]
    }] Ns/m
fuerza: tipo=${force.type}, amplitud=${force.amplitude} N, frecuencia=${
      force.frequency
    } Hz
tiempo_simulado=${currentTime.toFixed(2)} s

EXTREMOS:
max|x1|=${Math.max(...simulationData.positions.x1.map(Math.abs)).toFixed(4)} m
max|x2|=${Math.max(...simulationData.positions.x2.map(Math.abs)).toFixed(4)} m
max|x3|=${Math.max(...simulationData.positions.x3.map(Math.abs)).toFixed(4)} m
max|v1|=${Math.max(...simulationData.velocities.v1.map(Math.abs)).toFixed(
      4
    )} m/s
max|v2|=${Math.max(...simulationData.velocities.v2.map(Math.abs)).toFixed(
      4
    )} m/s
max|v3|=${Math.max(...simulationData.velocities.v3.map(Math.abs)).toFixed(
      4
    )} m/s
E_final_cin=${(simulationData.energies.kinetic.at(-1) ?? 0).toFixed(4)} J
E_final_pot=${(simulationData.energies.potential.at(-1) ?? 0).toFixed(4)} J
E_final_tot=${(simulationData.energies.total.at(-1) ?? 0).toFixed(4)} J

Devuelve sólo un bloque markdown estructurado con secciones: Coherencia, Dinámica, Energía, Recomendaciones. Usa LaTeX solo si aporta claridad (p.ej. $E=K+U$). No agregues título general.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Error al comunicarse con Gemini API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se pudo generar el análisis";

    // Limpiar marcadores de bloque de código si existen
    analysis = analysis
      .replace(/^```markdown\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "");

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error en análisis:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
