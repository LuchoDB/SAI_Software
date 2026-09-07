import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plane, 
  Ruler, 
  TrendingUp, 
  Thermometer, 
  Mountain, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Check
} from 'lucide-react';
import { Client } from '../../types/client';
import { LadStudy } from '../../types/lad';
import { AIRCRAFT_DATABASE } from '../../data/aircraftDatabase';
import { calculateLadStudy } from '../../services/ladEngine';
import { TechnicalDrawing } from './TechnicalDrawing';

interface LadStudyViewProps {
  clients: Client[];
  selectedClient: Client | null;
  onSaveStudy: (study: LadStudy) => void;
  savedStudies: LadStudy[];
}

export const LadStudyView: React.FC<LadStudyViewProps> = ({
  clients,
  selectedClient,
  onSaveStudy,
  savedStudies
}) => {
  const [targetClientId, setTargetClientId] = useState<string>(selectedClient?.id || clients[0]?.id || '');
  const [studyName, setStudyName] = useState('Estudio de Factibilidad Técnica LAD (Pista)');
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('c182');
  const [runwayQfu, setRunwayQfu] = useState('05 / 23');
  const [elevationMsl, setElevationMsl] = useState<number>(selectedClient?.elevationMsl || 25);
  const [referenceTemperatureC, setReferenceTemperatureC] = useState<number>(selectedClient?.referenceTemperatureC || 32);
  const [longitudinalSlopePercent, setLongitudinalSlopePercent] = useState<number>(0.5);
  const [terrainLengthAvailableM, setTerrainLengthAvailableM] = useState<number>(selectedClient?.terrainLengthAvailableM || 1000);
  const [terrainWidthAvailableM, setTerrainWidthAvailableM] = useState<number>(selectedClient?.terrainWidthAvailableM || 100);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar si cambia el cliente seleccionado
  useEffect(() => {
    if (selectedClient) {
      setTargetClientId(selectedClient.id);
      if (selectedClient.elevationMsl) setElevationMsl(selectedClient.elevationMsl);
      if (selectedClient.referenceTemperatureC) setReferenceTemperatureC(selectedClient.referenceTemperatureC);
      if (selectedClient.terrainLengthAvailableM) setTerrainLengthAvailableM(selectedClient.terrainLengthAvailableM);
      if (selectedClient.terrainWidthAvailableM) setTerrainWidthAvailableM(selectedClient.terrainWidthAvailableM);
    }
  }, [selectedClient]);

  const selectedAircraft = useMemo(() => {
    return AIRCRAFT_DATABASE.find(a => a.id === selectedAircraftId) || AIRCRAFT_DATABASE[0];
  }, [selectedAircraftId]);

  // Cálculo en tiempo real
  const ladStudyResult = useMemo(() => {
    return calculateLadStudy({
      clientId: targetClientId,
      studyName,
      aircraft: selectedAircraft,
      runwayQfu,
      elevationMsl,
      referenceTemperatureC,
      longitudinalSlopePercent,
      terrainLengthAvailableM,
      terrainWidthAvailableM
    });
  }, [
    targetClientId,
    studyName,
    selectedAircraft,
    runwayQfu,
    elevationMsl,
    referenceTemperatureC,
    longitudinalSlopePercent,
    terrainLengthAvailableM,
    terrainWidthAvailableM
  ]);

  const handleSave = () => {
    onSaveStudy(ladStudyResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isFeasible = ladStudyResult.overallFeasibility === 'FEASIBLE';
  const isConditioned = ladStudyResult.overallFeasibility === 'CONDITIONED';

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
            <Plane className="h-6 w-6 text-blue-700" />
            <span>Factibilidad de Pistas LAD (RAAC 153)</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Corrección de longitud básica de pista por elevación MSL, temperatura ISA y pendiente longitudinal
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

      {/* Selector de Cliente y Datos de Cabecera */}
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <span>Rumbo QFU:</span>
            <input
              type="text"
              value={runwayQfu}
              onChange={(e) => setRunwayQfu(e.target.value)}
              className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-mono font-bold text-blue-700 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cuadrícula Principal: Entradas vs Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Parámetros de Entrada */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selección de Aeronave de Diseño */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Aeronave Crítica de Diseño (Catálogo Común Argentina)
            </label>
            <select
              value={selectedAircraftId}
              onChange={(e) => setSelectedAircraftId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-2.5 font-medium focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              {AIRCRAFT_DATABASE.map(acft => (
                <option key={acft.id} value={acft.id}>
                  {acft.manufacturer} {acft.model} — Longitud Base: {acft.referenceFieldLengthM}m (Clave {acft.categoryCode})
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-50 rounded-lg text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Envergadura</span>
                <span className="font-bold text-slate-800">{selectedAircraft.wingspanM} m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">MTOW</span>
                <span className="font-bold text-slate-800">{selectedAircraft.mtowKg} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">V. Cruzado Adm.</span>
                <span className="font-bold text-blue-700">{selectedAircraft.maxDemonstratedCrosswindKt} kt</span>
              </div>
            </div>
          </div>

          {/* Variables Topográficas y Meteorológicas */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Variables del Emplazamiento
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Mountain className="h-3.5 w-3.5 text-blue-700" />
                  <span>Elevación MSL (m)</span>
                </label>
                <input
                  type="number"
                  value={elevationMsl}
                  onChange={(e) => setElevationMsl(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-amber-600" />
                  <span>Temp. Referencia (°C)</span>
                </label>
                <input
                  type="number"
                  value={referenceTemperatureC}
                  onChange={(e) => setReferenceTemperatureC(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                  <span>Pendiente Long. (%)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={longitudinalSlopePercent}
                  onChange={(e) => setLongitudinalSlopePercent(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Largo Predio Disp. (m)</span>
                </label>
                <input
                  type="number"
                  value={terrainLengthAvailableM}
                  onChange={(e) => setTerrainLengthAvailableM(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados de Factibilidad y Plano */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card de Dictamen y Longitud Corregida */}
          <div className={`border rounded-xl p-5 shadow-xs ${
            isFeasible ? 'bg-emerald-50/70 border-emerald-200' : isConditioned ? 'bg-amber-50/70 border-amber-200' : 'bg-red-50/70 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dictamen Técnico RAAC 153
              </span>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                isFeasible ? 'bg-white border-emerald-300 text-emerald-800' : isConditioned ? 'bg-white border-amber-300 text-amber-800' : 'bg-white border-red-300 text-red-800'
              }`}>
                {isFeasible ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                <span>{isFeasible ? 'FACTIBLE' : isConditioned ? 'CONDICIONADO' : 'NO FACTIBLE'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">LONGITUD BÁSICA</span>
                <span className="text-xl font-bold text-slate-700 font-mono">
                  {selectedAircraft.referenceFieldLengthM} m
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">LONGITUD CORREGIDA</span>
                <span className="text-2xl font-black text-blue-700 font-mono">
                  {ladStudyResult.correctedRunwayLengthRequiredM} m
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-600 space-y-1">
              {(ladStudyResult.feasibilityNotes || []).map((n: string, i: number) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plano Técnico Acotado */}
          <TechnicalDrawing
            type="LAD"
            ladData={ladStudyResult}
          />
        </div>
      </div>
    </div>
  );
};
