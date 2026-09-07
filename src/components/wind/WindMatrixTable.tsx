import React from 'react';
import { WindSectorData } from '../../types/wind';

interface WindMatrixTableProps {
  distribution: WindSectorData[];
  calmsPercent: number;
}

export const WindMatrixTable: React.FC<WindMatrixTableProps> = ({ distribution, calmsPercent }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Frecuencias de Viento (%) por Sector y Velocidad
        </h4>
        <span className="text-[11px] font-mono text-blue-700">
          Calmas: <span className="font-bold">{calmsPercent}%</span>
        </span>
      </div>

      <table className="w-full text-[11px] font-mono text-left">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
            <th className="py-2 px-2.5 font-semibold">Sector</th>
            <th className="py-2 px-2.5 font-semibold">Rumbo (°)</th>
            <th className="py-2 px-2.5 font-semibold">0 - 5 kt</th>
            <th className="py-2 px-2.5 font-semibold">6 - 10 kt</th>
            <th className="py-2 px-2.5 font-semibold">11 - 15 kt</th>
            <th className="py-2 px-2.5 font-semibold">16 - 20 kt</th>
            <th className="py-2 px-2.5 font-semibold">&gt; 20 kt</th>
            <th className="py-2 px-2.5 font-semibold text-right text-blue-700">Total (%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {distribution.map(sector => (
            <tr key={sector.direction} className="hover:bg-slate-50 transition-colors">
              <td className="py-1.5 px-2.5 font-bold text-slate-800">{sector.direction}</td>
              <td className="py-1.5 px-2.5 text-slate-500">{sector.degrees}°</td>
              <td className="py-1.5 px-2.5 text-slate-600">{sector.brackets.b0_5}%</td>
              <td className="py-1.5 px-2.5 text-slate-600">{sector.brackets.b6_10}%</td>
              <td className="py-1.5 px-2.5 text-slate-600">{sector.brackets.b11_15}%</td>
              <td className="py-1.5 px-2.5 text-slate-600">{sector.brackets.b16_20}%</td>
              <td className="py-1.5 px-2.5 text-slate-600">{sector.brackets.b21_plus}%</td>
              <td className="py-1.5 px-2.5 font-bold text-right text-blue-700">
                {sector.totalFrequencyPercent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
