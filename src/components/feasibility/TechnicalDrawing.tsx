import React from 'react';
import { LadStudy } from '../../types/lad';
import { LadhStudy } from '../../types/ladh';

interface TechnicalDrawingProps {
  type: 'LAD' | 'LADH';
  ladData?: LadStudy;
  ladhData?: LadhStudy;
}

export const TechnicalDrawing: React.FC<TechnicalDrawingProps> = ({
  type,
  ladData,
  ladhData
}) => {
  if (type === 'LAD' && ladData) {
    const svgW = 600;
    const svgH = 260;
    const padding = 40;

    const totalStripLen = ladData.stripLengthRequiredM;
    const rwyLen = ladData.correctedRunwayLengthRequiredM;
    const rwyWidth = ladData.runwayWidthRequiredM;
    const stripWidth = ladData.stripWidthRequiredM;

    const scaleX = (svgW - padding * 2) / (totalStripLen + 40);
    const rwyPixelW = rwyLen * scaleX;
    const stripPixelW = totalStripLen * scaleX;
    const rwyPixelH = Math.max(16, rwyWidth * 1.5);
    const stripPixelH = Math.max(70, stripWidth * 1.2);

    const centerX = svgW / 2;
    const centerY = svgH / 2;

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
          <span className="font-semibold text-slate-800 uppercase">PLANO ACOTADO DE PISTA (RAAC 153)</span>
          <span className="text-blue-700 font-bold">Pista {ladData.runwayQfu}</span>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none bg-slate-50/70 rounded-lg border border-slate-200">
          <defs>
            <pattern id="grid-light" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#grid-light)" />

          {/* Franja de Pista (Strip) */}
          <rect
            x={centerX - stripPixelW / 2}
            y={centerY - stripPixelH / 2}
            width={stripPixelW}
            height={stripPixelH}
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4,4"
            rx="4"
          />
          <text
            x={centerX - stripPixelW / 2 + 10}
            y={centerY - stripPixelH / 2 + 14}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            FRANJA DE PISTA: {totalStripLen}m x {stripWidth}m
          </text>

          {/* Pista Pavimentada / Suelo Compactado */}
          <rect
            x={centerX - rwyPixelW / 2}
            y={centerY - rwyPixelH / 2}
            width={rwyPixelW}
            height={rwyPixelH}
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Eje de pista discontinuo */}
          <line
            x1={centerX - rwyPixelW / 2 + 20}
            y1={centerY}
            x2={centerX + rwyPixelW / 2 - 20}
            y2={centerY}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="10,8"
          />

          {/* Cabecera Izquierda */}
          <rect x={centerX - rwyPixelW / 2} y={centerY - rwyPixelH / 2} width={18} height={rwyPixelH} fill="#1e3a8a" />
          <text
            x={centerX - rwyPixelW / 2 + 9}
            y={centerY + 3}
            fill="#ffffff"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {ladData.runwayQfu.split('/')[0] || '04'}
          </text>

          {/* Cabecera Derecha */}
          <rect x={centerX + rwyPixelW / 2 - 18} y={centerY - rwyPixelH / 2} width={18} height={rwyPixelH} fill="#1e3a8a" />
          <text
            x={centerX + rwyPixelW / 2 - 9}
            y={centerY + 3}
            fill="#ffffff"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {ladData.runwayQfu.split('/')[1] || '22'}
          </text>

          {/* Acotación Longitudinal Superior de Pista */}
          <line
            x1={centerX - rwyPixelW / 2}
            y1={centerY - rwyPixelH / 2 - 14}
            x2={centerX + rwyPixelW / 2}
            y2={centerY - rwyPixelH / 2 - 14}
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <text
            x={centerX}
            y={centerY - rwyPixelH / 2 - 18}
            fill="#1e3a8a"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            LONGITUD CORREGIDA: {rwyLen} m
          </text>
        </svg>

        <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
          <span>Aeronave de Diseño: <strong className="text-slate-700">{ladData.aircraft.manufacturer} {ladData.aircraft.model}</strong></span>
          <span>Clave de Referencia: <strong className="text-slate-700">{ladData.aircraft.categoryCode}</strong></span>
        </div>
      </div>
    );
  }

  if (type === 'LADH' && ladhData) {
    const svgW = 400;
    const svgH = 320;
    const cx = svgW / 2;
    const cy = svgH / 2;

    const totalSafety = ladhData.totalAreaWithSafetyRequiredM;
    const fatoDim = ladhData.fatoDimensionRequiredM;
    const tlofDim = ladhData.tlofDimensionRequiredM;

    const maxM = totalSafety + 6;
    const scale = (svgW - 80) / maxM;

    const rSafety = (totalSafety / 2) * scale;
    const rFato = (fatoDim / 2) * scale;
    const rTlof = (tlofDim / 2) * scale;

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
          <span className="font-semibold text-slate-800 uppercase">PLANO ACOTADO DE HELIPUERTO (RAAC 154)</span>
          <span className="text-emerald-700 font-bold">D = {ladhData.helicopter.overallLengthD}m</span>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none bg-slate-50/70 rounded-lg border border-slate-200">
          <defs>
            <pattern id="grid-heli" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#grid-heli)" />

          {/* Área de Seguridad Perimetral */}
          <circle cx={cx} cy={cy} r={rSafety} fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
          <text x={cx} y={cy - rSafety + 14} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
            ÁREA DE SEGURIDAD (D total = {totalSafety}m)
          </text>

          {/* FATO (Área de Aproximación Final y Despegue) */}
          <circle cx={cx} cy={cy} r={rFato} fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <text x={cx} y={cy - rFato + 14} fill="#0369a1" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            FATO (1.5D = {fatoDim}m)
          </text>

          {/* TLOF (Área de Toma de Contacto) */}
          <circle cx={cx} cy={cy} r={rTlof} fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

          {/* Letra H estándar blanca de helipuerto */}
          <text x={cx} y={cy + 8} fill="#ffffff" fontSize="24" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
            H
          </text>
        </svg>

        <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
          <span>Helicóptero: <strong className="text-slate-700">{ladhData.helicopter.manufacturer} {ladhData.helicopter.model}</strong></span>
          <span>Carga Dinámica (1.5x): <strong className="text-slate-700">{ladhData.dynamicLoadDesignKg} kg</strong></span>
        </div>
      </div>
    );
  }

  return null;
};
