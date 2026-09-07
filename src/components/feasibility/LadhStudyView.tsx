import React, { useState, useMemo, useEffect } from 'react';
import { 
  Disc, 
  Ruler, 
  Weight, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Check
} from 'lucide-react';
import { Client } from '../../types/client';
import { LadhStudy, LadhType } from '../../types/ladh';
import { HELICOPTER_DATABASE } from '../../data/helicopterDatabase';
import { calculateLadhStudy } from '../../services/ladhEngine';
import { TechnicalDrawing } from './TechnicalDrawing';

interface LadhStudyViewProps {
  clients: Client[];
  selectedClient: Client | null;
  onSaveStudy: (study: LadhStudy) => void;
  savedStudies: LadhStudy[];
}

export const LadhStudyView: React.FC<LadhStudyViewProps> = ({
  clients,
  selectedClient,
  onSaveStudy,
  savedStudies
}) => {
  const [targetClientId, setTargetClientId] = useState<string>(selectedClient?.id || clients[0]?.id || '');
  const [studyName, setStudyName] = useState('Estudio de Factibilidad Técnica LADH (Helipuerto)');
  const [selectedHelicopterId, setSelectedHelicopterId] = useState<string>('b429');
  const [helipadType, setHelipadType] = useState<LadhType>('SURFACE');
  const [availableLengthM, setAvailableLengthM] = useState<number>(30);
  const [availableWidthM, setAvailableWidthM] = useState<number>(30);
  const [availableLoadBearingKg, setAvailableLoadBearingKg] = useState<number>(6000);
  const [approachSectorsCount, setApproachSectorsCount] = useState<number>(2);
  const [approachSlopePercent, setApproachSlopePercent] = useState<number>(8.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setTargetClientId(selectedClient.id);
      if (selectedClient.terrainLengthAvailableM) setAvailableLengthM(selectedClient.terrainLengthAvailableM);
      if (selectedClient.terrainWidthAvailableM) setAvailableWidthM(selectedClient.terrainWidthAvailableM);
    }
  }, [selectedClient]);

  const selectedHelicopter = useMemo(() => {
    return HELICOPTER_DATABASE.find(h => h.id === selectedHelicopterId) || HELICOPTER_DATABASE[0];
  }, [selectedHelicopterId]);

  // Cálculo en tiempo real según RAAC 154
  const ladhStudyResult = useMemo(() => {
    return calculateLadhStudy({
      clientId: targetClientId,
      studyName,
      helipadType,
      helicopter: selectedHelicopter,
      availableLengthM,
      availableWidthM,
      availableLoadBearingKg,
      approachSectorsCount,
      approachSlopePercent
    });
  }, [
    targetClientId,
    studyName,
    helipadType,
    selectedHelicopter,
    availableLengthM,
    availableWidthM,
    availableLoadBearingKg,
    approachSectorsCount,
    approachSlopePercent
  ]);

  const handleSave = () => {
    onSaveStudy(ladhStudyResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isFeasible = ladhStudyResult.overallFeasibility === 'FEASIBLE';
  const isConditioned = ladhStudyResult.overallFeasibility === 'CONDITIONED';

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
            <Disc className="h-6 w-6 text-emerald-700" />
            <span>Factibilidad de Helipuertos LADH (RAAC 154)</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Dimensionamiento de FATO, TLOF, Área de Seguridad perimetral y cargas dinámicas de impacto
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1a365d] hover:bg-[#0f2942] text-white text-sm font-semibold transition-colors shadow-xs"
        >
          {savedSuccess ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? '¡Guardado!' : 'Guardar en expediente'}</span>
        </button>
      </div>

      {/* Selector de Expediente */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-700">Expediente:</span>
          <select
            value={targetClientId}
            onChange={(e) => setTargetClientId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 font-medium cursor-pointer shadow-xs"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.projectType})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Emplazamiento:</span>
          <select
            value={helipadType}
            onChange={(e) => setHelipadType(e.target.value as LadhType)}
            className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 font-medium cursor-pointer shadow-xs"
          >
            <option value="SURFACE">En Superficie (Terreno)</option>
            <option value="ELEVATED">Elevado (Azotea / Estructura)</option>
            <option value="HOSPITAL">Hospitalario / Sanitario</option>
          </select>
        </div>
      </div>

      {/* Cuadrícula de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Parámetros de Entrada */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selección de Helicóptero */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Helicóptero Crítico de Diseño (Catálogo Común Argentina)
            </label>
            <select
              value={selectedHelicopterId}
              onChange={(e) => setSelectedHelicopterId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-2.5 font-medium focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              {HELICOPTER_DATABASE.map(heli => (
                <option key={heli.id} value={heli.id}>
                  {heli.manufacturer} {heli.model} — D: {heli.overallLengthD}m, MTOW: {heli.mtowKg}kg
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-50 rounded-lg text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Dimensión D</span>
                <span className="font-bold text-slate-800">{selectedHelicopter.overallLengthD} m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Rotor RD</span>
                <span className="font-bold text-slate-800">{selectedHelicopter.rotorDiameterRD} m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">MTOW</span>
                <span className="font-bold text-emerald-700">{selectedHelicopter.mtowKg} kg</span>
              </div>
            </div>
          </div>

          {/* Dimensiones Disponibles y Resistencia */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dimensiones del Predio y Resistencia Estructural
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5 text-blue-700" />
                  <span>Largo Disponible (m)</span>
                </label>
                <input
                  type="number"
                  value={availableLengthM}
                  onChange={(e) => setAvailableLengthM(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5 text-blue-700" />
                  <span>Ancho Disponible (m)</span>
                </label>
                <input
                  type="number"
                  value={availableWidthM}
                  onChange={(e) => setAvailableWidthM(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Capacidad Portante Estructural Soportada (kg)</span>
                </label>
                <input
                  type="number"
                  value={availableLoadBearingKg}
                  onChange={(e) => setAvailableLoadBearingKg(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados de Dimensionamiento y Plano */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card de Dictamen y Dimensiones Calculadas */}
          <div className={`border rounded-xl p-5 shadow-xs ${
            isFeasible ? 'bg-emerald-50/70 border-emerald-200' : isConditioned ? 'bg-amber-50/70 border-amber-200' : 'bg-red-50/70 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dictamen Técnico RAAC 154
              </span>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                isFeasible ? 'bg-white border-emerald-300 text-emerald-800' : isConditioned ? 'bg-white border-amber-300 text-amber-800' : 'bg-white border-red-300 text-red-800'
              }`}>
                {isFeasible ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                <span>{isFeasible ? 'FACTIBLE' : isConditioned ? 'CONDICIONADO' : 'NO FACTIBLE'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">TLOF</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {ladhStudyResult.tlofDimensionRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">FATO (1.5D)</span>
                <span className="text-base font-bold text-blue-700 font-mono">
                  {ladhStudyResult.fatoDimensionRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">SEGURIDAD TOTAL</span>
                <span className="text-base font-black text-emerald-700 font-mono">
                  {ladhStudyResult.totalAreaWithSafetyRequiredM} m
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-600 space-y-1">
              {(ladhStudyResult.feasibilityNotes || []).map((n: string, i: number) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plano Técnico Acotado */}
          <TechnicalDrawing
            type="LADH"
            ladhData={ladhStudyResult}
          />
        </div>
      </div>
    </div>
  );
};
