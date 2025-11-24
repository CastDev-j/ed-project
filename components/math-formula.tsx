"use client"

import { useEffect, useRef } from "react"

export function MathFormula({ formula, display = false }: { formula: string; display?: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const renderMath = async () => {
      if (containerRef.current && typeof window !== "undefined") {
        try {
          // Dynamically import katex only on client
          const katex = (await import("katex")).default

          // Clean formula string - remove $$ delimiters if present
          const cleanFormula = formula.replace(/^\$\$|\$\$/g, "").trim()

          katex.render(cleanFormula, containerRef.current, {
            throwOnError: false,
            displayMode: display,
          })
        } catch (error) {
          console.error("[v0] KaTeX rendering error:", error)
          // Fallback to showing raw formula
          if (containerRef.current) {
            containerRef.current.textContent = formula
          }
        }
      }
    }

    renderMath()
  }, [formula, display])

  return <span ref={containerRef} className={display ? "block my-2" : "inline"} />
}
