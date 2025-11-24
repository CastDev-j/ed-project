"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useSimulationStore } from "@/lib/store";
import { rk4Step, getForceFunction } from "@/lib/physics-engine";
import * as THREE from "three";

export function MechanicalSystem3D() {
  const {
    currentState,
    parameters,
    force,
    isRunning,
    timeStep,
    currentTime,
    updateSimulation,
  } = useSimulationStore();

  const frameCountRef = useRef(0);
  const storeEveryNFrames = 5;

  useFrame(() => {
    if (isRunning) {
      const forceFunction = getForceFunction(force);
      const newState = rk4Step(
        currentState,
        parameters,
        forceFunction,
        timeStep,
        currentTime
      );
      const newTime = currentTime + timeStep;

      frameCountRef.current++;
      if (frameCountRef.current >= storeEveryNFrames) {
        updateSimulation(newState, newTime);
        frameCountRef.current = 0;
      } else {
        useSimulationStore.setState({
          currentState: newState,
          currentTime: newTime,
        });
      }
    }
  });

  const { x1, x2, x3 } = currentState;

  // Base positions centrados alrededor del origen
  const basePositions = [-2.5, 0, 2.5] as const;
  const wallX = -4.2;
  const scale = 0.9; // factor para desplazamientos

  const p1: [number, number, number] = [basePositions[0] + x1 * scale, 0, 0];
  const p2: [number, number, number] = [basePositions[1] + x2 * scale, 0, 0];
  const p3: [number, number, number] = [basePositions[2] + x3 * scale, 0, 0];

  return (
    <group position={[0, 0, 0]}>
      {/* Pared / Soporte fijo */}
      <mesh position={[wallX, 0, 0]}>
        <boxGeometry args={[0.5, 4, 2]} />
        <meshBasicMaterial color="#6d28d9" />
      </mesh>

      {/* Masa 1 */}
      <Mass
        position={p1}
        label="m₁"
        value={parameters.masses[0]}
        color="#8b5cf6"
      />
      {/* Módulo conexión pared - masa1 */}
      <ConnectionModule
        start={[wallX + 0.55, 0, 0]}
        end={[p1[0] - 0.7, 0, 0]}
        colorSpring="#a78bfa"
        colorPiston="#64748b"
      />

      {/* Masa 2 */}
      <Mass
        position={p2}
        label="m₂"
        value={parameters.masses[1]}
        color="#a855f7"
      />
      {/* Módulo conexión masa1 - masa2 */}
      <ConnectionModule
        start={[p1[0] + 0.7, 0, 0]}
        end={[p2[0] - 0.7, 0, 0]}
        colorSpring="#c084fc"
        colorPiston="#64748b"
      />

      {/* Masa 3 */}
      <Mass
        position={p3}
        label="m₃"
        value={parameters.masses[2]}
        color="#c026d3"
      />
      {/* Módulo conexión masa2 - masa3 */}
      <ConnectionModule
        start={[p2[0] + 0.7, 0, 0]}
        end={[p3[0] - 0.7, 0, 0]}
        colorSpring="#d8b4fe"
        colorPiston="#64748b"
      />
    </group>
  );
}

function Mass({
  position,
  label,
  value,
  color,
}: {
  position: [number, number, number];
  label: string;
  value: number;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html position={[0, 0, 0.65]} center>
        <div className="text-white font-bold text-2xl pointer-events-none">
          {label}
        </div>
      </Html>
      <Html position={[0, -0.9, 0]} center>
        <div
          className="font-mono text-sm pointer-events-none"
          style={{ color }}
        >
          {value.toFixed(1)} kg
        </div>
      </Html>
    </group>
  );
}

function ConnectionModule({
  start,
  end,
  colorSpring,
  colorPiston,
}: {
  start: [number, number, number];
  end: [number, number, number];
  colorSpring: string;
  colorPiston: string;
}) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const dir = new THREE.Vector3().subVectors(endVec, startVec);
  const length = dir.length();
  if (length < 0.001) return null;

  // Spring simplified geometry (fewer points)
  const coils = 6;
  const radius = 0.18;
  const points: THREE.Vector3[] = [];
  const samples = coils * 16;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = t * coils * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        t * length,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
      )
    );
  }
  const curve = new THREE.CatmullRomCurve3(points);

  // Piston dimensions
  const pistonOuterRadius = 0.12;
  const pistonInnerRadius = 0.06;
  const housingLength = length * 0.45;
  const rodLength = length * 0.45;

  // Rotation to align with start-end
  const rotY = Math.atan2(dir.z, dir.x);
  const rotZ = Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));

  return (
    <group position={start} rotation={[0, rotY, rotZ]}>
      {/* Spring */}
      <mesh position={[0, 0, 0]}>
        <tubeGeometry args={[curve, samples, 0.035, 6, false]} />
        <meshBasicMaterial color={colorSpring} />
      </mesh>
      {/* Housing (left) */}
      <mesh position={[length * 0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[pistonOuterRadius, pistonOuterRadius, housingLength, 12]}
        />
        <meshBasicMaterial color={colorPiston} />
      </mesh>
      {/* Rod (right) */}
      <mesh position={[length * 0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[pistonInnerRadius, pistonInnerRadius, rodLength, 10]}
        />
        <meshBasicMaterial color={colorPiston} />
      </mesh>
    </group>
  );
}
