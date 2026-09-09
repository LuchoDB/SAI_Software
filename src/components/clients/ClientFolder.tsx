import React, { useState } from 'react';
import {
  Folder,
  MapPin,
  Compass,
  Plane,
  Disc,
  FileText,
  Cpu,
  ArrowLeft,
  Plus,
  Building,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Client, DocumentStatus } from '../../types/client';
import { WindStudyResult } from '../../types/wind';
import { LadStudy } from '../../types/lad';
import { LadhStudy } from '../../types/ladh';
import { DocumentChecklist } from '../documentation/DocumentChecklist';
import { runMultiAgentAudit } from '../../services/agentsEngine';

interface ClientFolderProps {
  client: Client;
  onBackToList: () => void;
  onUpdateDocumentStatus: (docId: string, status: DocumentStatus, notes?: string) => void;
  windStudies: WindStudyResult[];
  ladStudies: LadStudy[];
  ladhStudies: LadhStudy[];
  onNavigateToStudy: (view: 'wind' | 'lad' | 'ladh', client: Client) => void;
}

export const ClientFolder: React.FC<ClientFolderProps> = ({
  client,
  onBackToList,
  onUpdateDocumentStatus,
  windStudies,
  ladStudies,
  ladhStudies,
  onNavigateToStudy
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'studies' | 'verdict'>(
    'overview'
  );

  // Filtrar estudios del cliente
  const clientWindStudies = windStudies.filter(s => s.clientId === client.id);
  const clientLadStudies = ladStudies.filter(s => s.clientId === client.id);
  const clientLadhStudies = ladhStudies.filter(s => s.clientId === client.id);

  // Ejecutar auditoría del orquestador en tiempo real para este cliente
  const auditVerdict = runMultiAgentAudit({
    client,
    windStudy: clientWindStudies[0],
    ladStudy: clientLadStudies[0],
    ladhStudy: clientLadhStudies[0]
  });

  return (
    <div className="space-y-6">
      {/* Botón de Retorno y Cabecera de Carpeta */}
      <div>
        <button
          onClick={onBackToList}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-3 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver a la lista de clientes</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
              <Folder className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-sky-950 text-sky-400 border border-sky-800">
                  {client.projectType}
                </span>
                <span className="text-xs font-mono text-slate-400">{client.cuit}</span>
              </div>
              <h1 className="text-xl font-bold text-white font-heading mt-1">{client.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>
                  {client.locationName}, {client.province}
                </span>
                <span className="text-slate-600">•</span>
                <span>Elev: {client.elevationMsl}m MSL</span>
              </div>
            </div>
          </div>

          {/* Calificación del Orquestador SAI */}
          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">DICTAMEN SAI</span>
              <span
                className={`text-xs font-bold font-heading ${
                  auditVerdict.globalStatus === 'FAVORABLE'
                    ? 'text-emerald-400'
                    : auditVerdict.globalStatus === 'FAVORABLE_WITH_RESTRICTIONS'
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {auditVerdict.globalStatus === 'FAVORABLE'
                  ? 'FAVORABLE'
                  : auditVerdict.globalStatus === 'FAVORABLE_WITH_RESTRICTIONS'
                    ? 'FAVORABLE CONDICIONADO'
                    : 'NO FAVORABLE'}
              </span>
            </div>
            <div className="text-right pl-3 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">VIABILIDAD</span>
              <span className="text-sm font-bold text-white font-mono">
                {auditVerdict.scorePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas de la Carpeta Informativa */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-1 ${
            activeTab === 'overview'
              ? 'border-sky-500 text-sky-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Ficha Técnica & Ubicación</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-1 ${
            activeTab === 'documents'
              ? 'border-sky-500 text-sky-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Documentación Regulatoria ({client.documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('studies')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-1 ${
            activeTab === 'studies'
              ? 'border-sky-500 text-sky-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>
            Estudios Técnicos (
            {clientWindStudies.length + clientLadStudies.length + clientLadhStudies.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('verdict')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-1 ${
            activeTab === 'verdict'
              ? 'border-sky-500 text-sky-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Dictamen Multi-Agente</span>
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Datos del Cliente y Contacto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="h-4 w-4 text-sky-400" />
                <span>Titularidad y Contacto</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Razón Social</span>
                  <span className="text-slate-100 font-semibold">{client.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CUIT / Identificación Tributaria</span>
                  <span className="text-slate-100 font-mono font-semibold">{client.cuit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Representante Legal</span>
                  <span className="text-slate-100 font-semibold">
                    {client.contactPerson || 'No asignado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Correo Electrónico</span>
                  <span className="text-sky-400 font-mono">
                    {client.email || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Teléfono de Contacto</span>
                  <span className="text-slate-100 font-mono">
                    {client.phone || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha de Alta de Expediente</span>
                  <span className="text-slate-100 font-mono">{client.createdAt}</span>
                </div>
              </div>

              {client.notes && (
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-slate-500 text-xs block mb-1">
                    Memoria de Emplazamiento:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Parámetros Geográficos y de Terreno */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>Parámetros Físicos y Climatológicos</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">COORDENADAS WGS84</span>
                  <span className="text-slate-200 font-mono font-semibold block truncate">
                    {client.coordinates.formatted ||
                      `${client.coordinates.lat}°, ${client.coordinates.lng}°`}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">ELEVACIÓN</span>
                  <span className="text-slate-200 font-mono font-semibold block">
                    {client.elevationMsl} m s.n.m.
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TEMP. REF. ISA</span>
                  <span className="text-slate-200 font-mono font-semibold block">
                    {client.referenceTemperatureC || 31}°C
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TERRENO DISPONIBLE</span>
                  <span className="text-slate-200 font-mono font-semibold block">
                    {client.terrainLengthAvailableM || 0}m x {client.terrainWidthAvailableM || 0}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Lateral: Accesos Directos a Estudios */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Acceso a Estudios Técnicos
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => onNavigateToStudy('wind', client)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-700 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-900/40 text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Orientación & Viento Cruzado
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {clientWindStudies.length > 0
                          ? `${clientWindStudies.length} estudio guardado`
                          : 'Sin estudio de vientos'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                {client.projectType === 'LAD' || client.projectType === 'MIXED' ? (
                  <button
                    onClick={() => onNavigateToStudy('lad', client)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-700 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sky-900/40 text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition">
                        <Plane className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Factibilidad Pista LAD (RAAC 153)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {clientLadStudies.length > 0
                            ? `${clientLadStudies.length} estudio guardado`
                            : 'Configurar pista'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition" />
                  </button>
                ) : null}

                {client.projectType === 'LADH' || client.projectType === 'MIXED' ? (
                  <button
                    onClick={() => onNavigateToStudy('ladh', client)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-900/40 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Disc className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Factibilidad Helipuerto LADH (RAAC 154)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {clientLadhStudies.length > 0
                            ? `${clientLadhStudies.length} estudio guardado`
                            : 'Configurar helipuerto'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Resumen Documental */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Estado Documental
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Completitud Global</span>
                  <span className="text-sky-400 font-mono font-bold">
                    {auditVerdict.documentationProgress.completionPercent}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${auditVerdict.documentationProgress.completionPercent}%` }}
                    className="bg-emerald-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>{auditVerdict.documentationProgress.approved} Aprobados</span>
                  <span>{auditVerdict.documentationProgress.pending} Pendientes</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('documents')}
                className="w-full mt-2 text-center text-xs text-sky-400 hover:text-sky-300 font-semibold py-1.5 border border-slate-800 hover:border-sky-800 rounded-xl transition"
              >
                Abrir Documentación Completa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Documentación Regulatoria */}
      {activeTab === 'documents' && (
        <DocumentChecklist
          documents={client.documents}
          onUpdateDocumentStatus={(docId, status, notes) =>
            onUpdateDocumentStatus(docId, status, notes)
          }
        />
      )}

      {/* Pestaña: Estudios Técnicos */}
      {activeTab === 'studies' && (
        <div className="space-y-6">
          {/* Estudios de Viento */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="h-4 w-4 text-sky-400" />
                <span>Estudios de Orientación y Viento Cruzado</span>
              </h3>
              <button
                onClick={() => onNavigateToStudy('wind', client)}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nuevo Cálculo de Vientos</span>
              </button>
            </div>

            {clientWindStudies.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                Aún no se ha realizado un estudio de orientación y rosa de los vientos para este
                cliente.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clientWindStudies.map(ws => (
                  <div
                    key={ws.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{ws.studyName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{ws.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">DESIGNADOR QFU</span>
                        <span className="text-sky-400 font-bold">{ws.orientation.qfuLabel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">USABILIDAD OACI</span>
                        <span
                          className={`font-bold ${ws.isCompliantOACI ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {ws.usabilityPercent}% {ws.isCompliantOACI ? '(>=95%)' : '(<95%)'}
                        </span>
                      </div>
                    </div>
                    {ws.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1">{ws.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estudios LAD */}
          {(client.projectType === 'LAD' || client.projectType === 'MIXED') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Plane className="h-4 w-4 text-sky-400" />
                  <span>Estudios de Factibilidad Pistas LAD (RAAC 153)</span>
                </h3>
                <button
                  onClick={() => onNavigateToStudy('lad', client)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nuevo Estudio LAD</span>
                </button>
              </div>

              {clientLadStudies.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                  No hay estudios de dimensionamiento de pista guardados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clientLadStudies.map(ls => (
                    <div
                      key={ls.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ls.studyName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ls.overallFeasibility === 'FEASIBLE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : ls.overallFeasibility === 'CONDITIONED'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {ls.overallFeasibility}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        Aeronave:{' '}
                        <span className="font-semibold">
                          {ls.aircraft.manufacturer} {ls.aircraft.model}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 text-[10px]">PISTA REQUERIDA</span>
                          <span className="text-white block">
                            {ls.correctedRunwayLengthRequiredM}m x {ls.runwayWidthRequiredM}m
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">FRANJA SEGURIDAD</span>
                          <span className="text-white block">
                            {ls.stripLengthRequiredM}m x {ls.stripWidthRequiredM}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Estudios LADH */}
          {(client.projectType === 'LADH' || client.projectType === 'MIXED') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Disc className="h-4 w-4 text-emerald-400" />
                  <span>Estudios de Factibilidad Helipuertos LADH (RAAC 154)</span>
                </h3>
                <button
                  onClick={() => onNavigateToStudy('ladh', client)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nuevo Estudio LADH</span>
                </button>
              </div>

              {clientLadhStudies.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                  No hay estudios de dimensionamiento de helipuerto guardados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clientLadhStudies.map(hs => (
                    <div
                      key={hs.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{hs.studyName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            hs.overallFeasibility === 'FEASIBLE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {hs.overallFeasibility}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        Helicóptero:{' '}
                        <span className="font-semibold">
                          {hs.helicopter.manufacturer} {hs.helicopter.model}
                        </span>{' '}
                        (D = {hs.dValueM}m)
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 text-[10px]">TLOF</span>
                          <span className="text-white block">{hs.tlofDimensionRequiredM}m</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">FATO</span>
                          <span className="text-white block">{hs.fatoDimensionRequiredM}m</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">CARGA 1.5x</span>
                          <span className="text-white block">{hs.dynamicLoadDesignKg} kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pestaña: Dictamen Multi-Agente */}
      {activeTab === 'verdict' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500">
                  AUDITORÍA Y VALIDACIÓN CRUZADA
                </span>
                <h3 className="text-lg font-bold text-white font-heading">
                  Dictamen Oficial del Agente Orquestador
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400">Fecha de Evaluación:</span>
                <span className="text-xs text-sky-400 font-bold ml-1">
                  {auditVerdict.evaluatedAt}
                </span>
              </div>
            </div>

            {/* Resumen Ejecutivo */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-xs text-slate-200">
              <span className="text-sky-400 font-semibold block mb-1">
                Resumen Ejecutivo del Proyecto:
              </span>
              {auditVerdict.executiveSummary}
            </div>

            {/* Cumplimiento Legal e Institucional */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">ANAC (RAAC 153/154)</span>
                <span
                  className={`font-bold flex items-center gap-1 mt-1 ${auditVerdict.legalCompliance.anac ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {auditVerdict.legalCompliance.anac ? 'Conforme / En Curso' : 'Pendiente F-501'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">
                  ENACOM (Telecomunicaciones)
                </span>
                <span
                  className={`font-bold flex items-center gap-1 mt-1 ${auditVerdict.legalCompliance.enacom ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {auditVerdict.legalCompliance.enacom
                    ? 'Sin Interferencias'
                    : 'Verificación Pendiente'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">CATASTRO & DOMINIO</span>
                <span
                  className={`font-bold flex items-center gap-1 mt-1 ${auditVerdict.legalCompliance.catastro ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {auditVerdict.legalCompliance.catastro
                    ? 'Título Acreditado'
                    : 'Pendiente Dominio'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">VIENTO CRUZADO (OACI)</span>
                <span
                  className={`font-bold flex items-center gap-1 mt-1 ${auditVerdict.technicalFeasibility.windUsability ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {auditVerdict.technicalFeasibility.windUsability
                    ? 'Usabilidad >= 95%'
                    : 'No Verificado / Bajo'}
                </span>
              </div>
            </div>

            {/* Hallazgos de los Agentes */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Observaciones y Hallazgos Registrados ({auditVerdict.findings.length})
              </h4>
              {auditVerdict.findings.map(f => (
                <div
                  key={f.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                    f.severity === 'CRITICAL'
                      ? 'bg-red-950/40 border-red-800/80 text-red-200'
                      : f.severity === 'WARNING'
                        ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                        : f.severity === 'SUCCESS'
                          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-sky-400">
                        [{f.agent}]
                      </span>
                      <span className="font-semibold text-white">{f.title}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{f.description}</p>
                    {f.actionRequired && (
                      <p className="text-sky-300 text-[11px] mt-1 font-mono">
                        Acción sugerida: {f.actionRequired}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Recomendaciones Operativas del Orquestador */}
            {auditVerdict.recommendations.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Pasos Siguientes Recomendados por SAI Consult:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {auditVerdict.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
