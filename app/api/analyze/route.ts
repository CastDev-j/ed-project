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

    // Construir el prompt con todos los datos
    const prompt = `Analiza los siguientes resultados de una simulación de un sistema mecánico de 3 grados de libertad (masa-resorte-amortiguador):

PARÁMETROS DEL SISTEMA:
- Masas: m₁=${parameters.masses[0]} kg, m₂=${parameters.masses[1]} kg, m₃=${
      parameters.masses[2]
    } kg
- Constantes de resorte: k₁=${parameters.springs[0]} N/m, k₂=${
      parameters.springs[1]
    } N/m, k₃=${parameters.springs[2]} N/m
- Coeficientes de amortiguamiento: c₁=${parameters.dampers[0]} Ns/m, c₂=${
      parameters.dampers[1]
    } Ns/m, c₃=${parameters.dampers[2]} Ns/m

FUERZA EXTERNA APLICADA:
- Tipo: ${force.type}
- Amplitud: ${force.amplitude} N
- Frecuencia: ${force.frequency} Hz

TIEMPO DE SIMULACIÓN: ${currentTime.toFixed(2)} segundos

RESULTADOS OBTENIDOS:
- Desplazamiento máximo m₁: ${Math.max(
      ...simulationData.positions.x1.map(Math.abs)
    ).toFixed(4)} m
- Desplazamiento máximo m₂: ${Math.max(
      ...simulationData.positions.x2.map(Math.abs)
    ).toFixed(4)} m
- Desplazamiento máximo m₃: ${Math.max(
      ...simulationData.positions.x3.map(Math.abs)
    ).toFixed(4)} m
- Velocidad máxima m₁: ${Math.max(
      ...simulationData.velocities.v1.map(Math.abs)
    ).toFixed(4)} m/s
- Velocidad máxima m₂: ${Math.max(
      ...simulationData.velocities.v2.map(Math.abs)
    ).toFixed(4)} m/s
- Velocidad máxima m₃: ${Math.max(
      ...simulationData.velocities.v3.map(Math.abs)
    ).toFixed(4)} m/s
- Energía cinética final: ${
      simulationData.energies.kinetic[
        simulationData.energies.kinetic.length - 1
      ]?.toFixed(4) || 0
    } J
- Energía potencial final: ${
      simulationData.energies.potential[
        simulationData.energies.potential.length - 1
      ]?.toFixed(4) || 0
    } J
- Energía total final: ${
      simulationData.energies.total[
        simulationData.energies.total.length - 1
      ]?.toFixed(4) || 0
    } J

Proporciona un análisis técnico que incluya:
1. Evaluación de la coherencia física de los resultados
2. Análisis del comportamiento dinámico observado
3. Efecto de los parámetros en la respuesta del sistema
4. Observaciones sobre la disipación de energía
5. Recomendaciones técnicas si aplican

Usa formato markdown con ecuaciones LaTeX cuando sea necesario (usando $ para inline y $$ para bloques). No incluyas saludos, despedidas ni texto introductorio.`;

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
    const analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se pudo generar el análisis";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error en análisis:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
