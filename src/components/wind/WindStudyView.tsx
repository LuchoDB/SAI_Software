import React, { useState, useMemo } from 'react';
import { Compass, Wind, CheckCircle2, AlertTriangle, Save, Check, Sliders } from 'lucide-react';
import { Client } from '../../types/client';
import { WindStudyResult } from '../../types/wind';
import { WindRoseChart } from './WindRoseChart';
import { WindMatrixTable } from './WindMatrixTable';
import {
  calculateRunwayOrientation,
  calculateOACIUsability,
  getDefaultArgentineWindDistribution,
  calculateWindComponents
} from '../../services/windEngine';

interface WindStudyViewProps {
  clients: Client[];
  selectedClient: Client | null;
  onSaveStudy: (study: WindStudyResult) => void;
  savedStudies: WindStudyResult[];
}

export const WindStudyView: React.FC<WindStudyViewProps> = ({
  clients,
  selectedClient,
  onSaveStudy,
  savedStudies: _savedStudies
}) => {
  const [targetClientId, setTargetClientId] = useState<string>(
    selectedClient?.id || clients[0]?.id || ''
  );
  const [studyName, setStudyName] = useState('Estudio de Orientación de Pista & Viento Cruzado');
  const [trueHeading, setTrueHeading] = useState<number>(45);
  const [magneticDeclination, setMagneticDeclination] = useState<number>(-8.2); // Típico Argentina (-8.2° W)
  const [admissibleCrosswindKt, setAdmissibleCrosswindKt] = useState<10 | 13 | 20>(10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Viento de prueba en vivo
  const [testWindDir, setTestWindDir] = useState<number>(90);
  const [testWindSpeed, setTestWindSpeed] = useState<number>(15);

  const { distribution, calmsPercent } = useMemo(() => getDefaultArgentineWindDistribution(), []);

  // Cálculo en tiempo real de orientación
  const orientation = useMemo(() => {
    return calculateRunwayOrientation(trueHeading, magneticDeclination);
  }, [trueHeading, magneticDeclination]);

  // Cálculo en tiempo real de usabilidad
  const usabilityAnalysis = useMemo(() => {
    return calculateOACIUsability(orientation, distribution, calmsPercent, admissibleCrosswindKt);
  }, [orientation, distribution, calmsPercent, admissibleCrosswindKt]);

  // Cálculo de componentes para el viento de prueba
  const liveComponents = useMemo(() => {
    return calculateWindComponents(testWindDir, testWindSpeed, orientation.magneticHeading);
  }, [testWindDir, testWindSpeed, orientation]);

  const handleSave = () => {
    const study: WindStudyResult = {
      id: `ws-${Date.now()}`,
      clientId: targetClientId,
      studyName: studyName.trim() || `Estudio QFU ${orientation.qfuLabel}`,
      orientation,
      admissibleCrosswindKt,
      usabilityPercent: usabilityAnalysis.usabilityPercent,
      isCompliantOACI: usabilityAnalysis.isCompliantOACI,
      calmsPercent,
      windDistribution: distribution,
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Orientación magnética ${orientation.magneticHeading}° (${orientation.qfuLabel}) con usabilidad del ${usabilityAnalysis.usabilityPercent}%. Cumple OACI Anexo 14: ${usabilityAnalysis.isCompliantOACI ? 'SÍ' : 'NO'}.`
    };

    onSaveStudy(study);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
            <Compass className="h-6 w-6 text-blue-700" />
            <span>Orientación & Viento Cruzado</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Cálculo de QFU, rosa de vientos vectorial y factor de utilización según OACI Anexo 14 y
            RAAC 153
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1a365d] hover:bg-[#0f2942] text-white text-sm font-semibold transition-colors shadow-xs"
        >
          {savedSuccess ? (
            <Check className="h-4 w-4 text-emerald-300" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{savedSuccess ? '¡Guardado!' : 'Guardar en expediente'}</span>
        </button>
      </div>

      {/* Selector de Expediente y Nombre */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-700">Expediente:</span>
          <select
            value={targetClientId}
            onChange={e => setTargetClientId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 font-medium cursor-pointer shadow-xs"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.projectType})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={studyName}
            onChange={e => setStudyName(e.target.value)}
            placeholder="Título del estudio..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-xs"
          />
        </div>
      </div>

      {/* Cuadrícula Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Parámetros y Cálculos */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card de Cabeceras QFU Resultantes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                DESIGNADOR OFICIAL DE CABECERAS (QFU)
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                OACI DOC 9157
              </span>
            </div>

            <div className="flex items-center justify-around py-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-center">
                <span className="text-[11px] text-slate-500 block font-mono">CABECERA 1</span>
                <span className="text-3xl font-extrabold text-blue-700 font-mono tracking-wider">
                  {orientation.qfuPrimary}
                </span>
                <span className="text-xs text-slate-500 font-mono block">
                  {orientation.magneticHeading}° MAG
                </span>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div className="text-center">
                <span className="text-[11px] text-slate-500 block font-mono">DESIGNACIÓN</span>
                <span className="text-2xl font-black text-[#0f2942] font-mono tracking-widest">
                  {orientation.qfuLabel}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  Eje Bipodal
                </span>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div className="text-center">
                <span className="text-[11px] text-slate-500 block font-mono">CABECERA 2</span>
                <span className="text-3xl font-extrabold text-blue-700 font-mono tracking-wider">
                  {orientation.qfuSecondary}
                </span>
                <span className="text-xs text-slate-500 font-mono block">
                  {orientation.reciprocalHeading}° MAG
                </span>
              </div>
            </div>
          </div>

          {/* Ajuste de Orientación y Declinación Magnética */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-700" />
              <span>Rumbos y Declinación Magnética (WMM)</span>
            </h3>

            {/* Slider Rumbo Verdadero */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-medium">
                  Rumbo Geográfico Verdadero (True Heading)
                </label>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    min="0"
                    max="359"
                    value={trueHeading}
                    onChange={e => setTrueHeading(Number(e.target.value))}
                    className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-right font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-500">°</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={trueHeading}
                onChange={e => setTrueHeading(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
            </div>

            {/* Slider Declinación Magnética */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-medium">
                  Declinación Magnética Local (Negativo = Oeste 'W')
                </label>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    step="0.1"
                    min="-25"
                    max="25"
                    value={magneticDeclination}
                    onChange={e => setMagneticDeclination(parseFloat(e.target.value))}
                    className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-right font-bold text-blue-700 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-500">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="0.1"
                value={magneticDeclination}
                onChange={e => setMagneticDeclination(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
            </div>

            {/* Selector Viento Cruzado Admisible */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-medium text-slate-700 block mb-1.5">
                Viento Cruzado Admisible de la Aeronave de Diseño:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 13, 20].map(kt => (
                  <button
                    key={kt}
                    type="button"
                    onClick={() => setAdmissibleCrosswindKt(kt as 10 | 13 | 20)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                      admissibleCrosswindKt === kt
                        ? 'bg-[#1a365d] text-white border-[#1a365d] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {kt} nudos (kt)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resultado de Usabilidad OACI */}
          <div
            className={`border rounded-xl p-4 shadow-xs ${
              usabilityAnalysis.isCompliantOACI
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Factor de Utilización OACI Anexo 14
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-3xl font-extrabold font-mono ${
                      usabilityAnalysis.isCompliantOACI ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {usabilityAnalysis.usabilityPercent}%
                  </span>
                  <span className="text-xs text-slate-500">Mínimo reglamentario: 95.0%</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                  usabilityAnalysis.isCompliantOACI
                    ? 'bg-white border-emerald-300 text-emerald-800'
                    : 'bg-white border-amber-300 text-amber-800'
                }`}
              >
                {usabilityAnalysis.isCompliantOACI ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>CUMPLE OACI</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>REQUIERE PISTA SECUNDARIA</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Rosa de los Vientos Vectorial */}
        <div className="lg:col-span-5 space-y-4">
          <WindRoseChart
            orientation={orientation}
            windDistribution={distribution}
            admissibleCrosswindKt={admissibleCrosswindKt}
            calmsPercent={calmsPercent}
          />

          {/* Descomposición en Vivo para Viento de Prueba */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-blue-700" />
              <span>Simulación de Viento Instantáneo</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Procedencia (°)</label>
                <input
                  type="number"
                  min="0"
                  max="359"
                  value={testWindDir}
                  onChange={e => setTestWindDir(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Velocidad (kt)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={testWindSpeed}
                  onChange={e => setTestWindSpeed(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 font-mono text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-500 block">V. Cruzado</span>
                <span
                  className={`font-bold text-sm ${liveComponents.crosswind > admissibleCrosswindKt ? 'text-red-600' : 'text-slate-800'}`}
                >
                  {liveComponents.crosswind} kt
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-500 block">De Frente</span>
                <span className="font-bold text-sm text-emerald-700">
                  {liveComponents.headwind} kt
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-500 block">De Cola</span>
                <span className="font-bold text-sm text-amber-700">
                  {liveComponents.tailwind} kt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz Completa de Vientos */}
      <WindMatrixTable distribution={distribution} calmsPercent={calmsPercent} />
    </div>
  );
};
