import React, { useState } from 'react';
import { RunwayOrientation, WindSectorData } from '../../types/wind';
import { isSectorFavorable } from '../../calculations/windCalculations';

interface WindRoseChartProps {
  orientation: RunwayOrientation;
  windDistribution: WindSectorData[];
  admissibleCrosswindKt: 10 | 13 | 20;
  calmsPercent: number;
}

export const WindRoseChart: React.FC<WindRoseChartProps> = ({
  orientation,
  windDistribution,
  admissibleCrosswindKt,
  calmsPercent
}) => {
  const [hoveredSector, setHoveredSector] = useState<WindSectorData | null>(null);

  const cx = 200;
  const cy = 200;
  const maxRadius = 150;
  const maxScalePercent = 15; // 15% en el círculo exterior

  // Helper para convertir polar a cartesiano (0° es Norte / Arriba)
  const polarToCartesian = (degrees: number, radius: number) => {
    const rad = ((degrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Ángulo de la pista respecto al norte geográfico
  const runwayAngleDeg = orientation.trueHeading;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center relative shadow-xs">
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-semibold text-slate-800">ROSA DE LOS VIENTOS (OACI)</span>
        <span className="font-mono text-blue-700 font-bold text-[11px]">
          Pista {orientation.qfuLabel} ({orientation.magneticHeading}°)
        </span>
      </div>

      <svg viewBox="0 0 400 400" className="w-full max-w-[360px] h-auto aspect-square select-none">
        {/* Círculos de escala concéntricos (5%, 10%, 15%) */}
        {[5, 10, 15].map(percent => {
          const r = (percent / maxScalePercent) * maxRadius;
          return (
            <g key={percent}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text x={cx + 3} y={cy - r + 10} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {percent}%
              </text>
            </g>
          );
        })}

        {/* Ejes cardinales principales */}
        <line
          x1={cx}
          y1={cy - maxRadius - 10}
          x2={cx}
          y2={cy + maxRadius + 10}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <line
          x1={cx - maxRadius - 10}
          y1={cy}
          x2={cx + maxRadius + 10}
          y2={cy}
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Sectores de Viento (16 rumbos) */}
        {windDistribution.map(sector => {
          const r =
            (Math.min(sector.totalFrequencyPercent, maxScalePercent) / maxScalePercent) * maxRadius;
          const halfAngle = 360 / 32; // 11.25° a cada lado
          const startAngle = sector.degrees - halfAngle;
          const endAngle = sector.degrees + halfAngle;

          const p1 = polarToCartesian(startAngle, r);
          const p2 = polarToCartesian(endAngle, r);

          // Determinar si el viento cruzado para este sector supera el límite usando la función pura
          const isFavorable = isSectorFavorable(
            sector.degrees,
            orientation.magneticHeading,
            orientation.reciprocalHeading,
            15,
            admissibleCrosswindKt
          );

          const pathData = `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;

          return (
            <path
              key={sector.direction}
              d={pathData}
              fill={isFavorable ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)'}
              stroke={isFavorable ? '#2563eb' : '#dc2626'}
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseEnter={() => setHoveredSector(sector)}
              onMouseLeave={() => setHoveredSector(null)}
            />
          );
        })}

        {/* Eje y Representación de la Pista (Rotada al Rumbo) */}
        <g transform={`rotate(${runwayAngleDeg}, ${cx}, ${cy})`}>
          {/* Pista pavimentada */}
          <rect
            x={cx - 8}
            y={cy - maxRadius + 15}
            width={16}
            height={(maxRadius - 15) * 2}
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Línea de centro de pista (discontinua blanca) */}
          <line
            x1={cx}
            y1={cy - maxRadius + 25}
            x2={cx}
            y2={cy + maxRadius - 25}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="8,6"
          />
          {/* Cabecera 1 (Arriba según rotación) */}
          <rect x={cx - 10} y={cy - maxRadius + 15} width={20} height={14} fill="#1e3a8a" rx="2" />
          <text
            x={cx}
            y={cy - maxRadius + 26}
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {orientation.qfuPrimary}
          </text>

          {/* Cabecera 2 (Abajo según rotación) */}
          <rect x={cx - 10} y={cy + maxRadius - 29} width={20} height={14} fill="#1e3a8a" rx="2" />
          <text
            x={cx}
            y={cy + maxRadius - 18}
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            transform={`rotate(180, ${cx}, ${cy + maxRadius - 22})`}
          >
            {orientation.qfuSecondary}
          </text>
        </g>

        {/* Rótulos Cardinales Externos */}
        {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map(point => {
          const degMap: Record<string, number> = {
            N: 0,
            NE: 45,
            E: 90,
            SE: 135,
            S: 180,
            SW: 225,
            W: 270,
            NW: 315
          };
          const deg = degMap[point];
          const pos = polarToCartesian(deg, maxRadius + 18);
          const isCard = ['N', 'E', 'S', 'W'].includes(point);

          return (
            <text
              key={point}
              x={pos.x}
              y={pos.y + 4}
              fill={point === 'N' ? '#1e3a8a' : isCard ? '#334155' : '#94a3b8'}
              fontSize={isCard ? '12' : '10'}
              fontWeight={isCard ? 'bold' : 'normal'}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {point}
            </text>
          );
        })}

        {/* Círculo central con calma meteorológica */}
        <circle cx={cx} cy={cy} r={18} fill="#ffffff" stroke="#1e3a8a" strokeWidth="1.5" />
        <text
          x={cx}
          y={cy + 3}
          fill="#1e3a8a"
          fontSize="8"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
        >
          {calmsPercent}%
        </text>
      </svg>

      {/* Leyenda y Tooltip Flotante */}
      <div className="w-full mt-2 pt-2 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500/80 inline-block" />
            <span>Operable (&le;{admissibleCrosswindKt}kt)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500/80 inline-block" />
            <span>Límite excedido</span>
          </div>
        </div>

        {hoveredSector ? (
          <div className="font-mono text-blue-700 font-semibold">
            Sector {hoveredSector.direction} ({hoveredSector.degrees}°):{' '}
            {hoveredSector.totalFrequencyPercent}%
          </div>
        ) : (
          <div className="font-mono text-slate-400 text-[10px]">Pasa el cursor sobre un sector</div>
        )}
      </div>
    </div>
  );
};
