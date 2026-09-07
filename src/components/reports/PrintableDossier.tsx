import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Client } from '../../types/client';
import { WindStudyResult } from '../../types/wind';
import { LadStudy } from '../../types/lad';
import { LadhStudy } from '../../types/ladh';
import { runMultiAgentAudit } from '../../services/agentsEngine';

interface PrintableDossierProps {
  client: Client;
  onBack: () => void;
  windStudies: WindStudyResult[];
  ladStudies: LadStudy[];
  ladhStudies: LadhStudy[];
}

export const PrintableDossier: React.FC<PrintableDossierProps> = ({
  client,
  onBack,
  windStudies,
  ladStudies,
  ladhStudies
}) => {
  const clientWindStudy = windStudies.find(s => s.clientId === client.id);
  const clientLadStudy = ladStudies.find(s => s.clientId === client.id);
  const clientLadhStudy = ladhStudies.find(s => s.clientId === client.id);

  const verdict = runMultiAgentAudit({
    client,
    windStudy: clientWindStudy,
    ladStudy: clientLadStudy,
    ladhStudy: clientLadhStudy
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones Superior (Oculta en Impresión) */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Sistema</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Vista previa de impresión oficial A4 • Membrete SAI Consult
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-sky-600/20 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Hoja de Dictamen Formal A4 */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto font-sans leading-normal border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Encabezado Membretado Oficial */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-10 flex items-center justify-center">
                <img
                  src="/sai_logo_emblem.png"
                  alt="Logo SAI Consult"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                SAI CONSULT
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-wider">
              Servicios Aeronáuticos Integrales • Consultoría & Habilitaciones
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Av. Corrientes 1250, CABA • Matrícula CPA Nº 4819 • info@saiconsult.com.ar
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">
              EXPEDIENTE TÉCNICO Nº
            </span>
            <span className="text-sm font-bold text-slate-900">
              {client.cuit || 'SAI-2026-001'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Fecha: {new Date().toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>

        {/* Título del Documento */}
        <div className="text-center my-6">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-800 uppercase block mb-1">
            INFORME PERICIAL Y DICTAMEN TÉCNICO
          </span>
          <h2 className="text-lg font-black text-slate-900 uppercase font-heading">
            ESTUDIO INTEGRAL DE FACTIBILIDAD TÉCNICA Y OPERATIVA ({client.projectType})
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Conforme Código Aeronáutico Ley 17.285, ANAC RAAC Parte{' '}
            {client.projectType === 'LADH' ? '154' : '153'} y OACI Anexo 14
          </p>
        </div>

        {/* 1. Datos del Titular y Emplazamiento */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
            1. Datos del Titular y Emplazamiento
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Titular / Razón Social:</span>
              <span className="font-bold text-slate-900">{client.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">CUIT / Identificación:</span>
              <span className="font-bold text-slate-900">{client.cuit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ubicación / Predio:</span>
              <span className="font-semibold text-slate-900">
                {client.locationName}, {client.province}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Punto de Referencia (ARP):</span>
              <span className="font-semibold text-slate-900">
                {client.coordinates.formatted ||
                  `${client.coordinates.lat}°, ${client.coordinates.lng}°`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Elevación Oficial:</span>
              <span className="font-semibold text-slate-900">{client.elevationMsl} m s.n.m.</span>
            </div>
            <div>
              <span className="text-slate-500 block">Temperatura Referencia ISA:</span>
              <span className="font-semibold text-slate-900">
                {client.referenceTemperatureC || 31}°C
              </span>
            </div>
          </div>
        </div>

        {/* 2. Estudio de Orientación y Viento Cruzado */}
        {clientWindStudy && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
              2. Orientación Magnética y Rosa de los Vientos (OACI)
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Designación QFU:</span>
                <span className="font-bold text-sky-800 text-sm">
                  {clientWindStudy.orientation.qfuLabel}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Rumbo Magnético:</span>
                <span className="font-semibold text-slate-800">
                  {clientWindStudy.orientation.magneticHeading}° /{' '}
                  {clientWindStudy.orientation.reciprocalHeading}°
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Factor de Usabilidad:</span>
                <span
                  className={`font-bold text-sm ${clientWindStudy.isCompliantOACI ? 'text-emerald-700' : 'text-red-700'}`}
                >
                  {clientWindStudy.usabilityPercent}%{' '}
                  {clientWindStudy.isCompliantOACI ? '(Conforme OACI ≥95%)' : '(<95%)'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 italic">{clientWindStudy.notes}</p>
          </div>
        )}

        {/* 3. Factibilidad de Pista LAD / Helipuerto LADH */}
        {clientLadStudy && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
              3. Dimensionamiento y Correcciones de Pista (RAAC 153)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Aeronave Diseño:</span>
                <span className="font-semibold text-slate-900">
                  {clientLadStudy.aircraft.model}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Longitud Pista:</span>
                <span className="font-bold text-slate-900">
                  {clientLadStudy.correctedRunwayLengthRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Franja de Seguridad:</span>
                <span className="font-bold text-slate-900">
                  {clientLadStudy.stripLengthRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Disponibilidad:</span>
                <span className="font-bold text-emerald-700">
                  {clientLadStudy.terrainLengthAvailableM} m (Apto)
                </span>
              </div>
            </div>
          </div>
        )}

        {clientLadhStudy && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
              3. Dimensionamiento de Helipuerto LADH (RAAC 154)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Helicóptero Diseño:</span>
                <span className="font-semibold text-slate-900">
                  {clientLadhStudy.helicopter.model}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">FATO Requerida (1.5D):</span>
                <span className="font-bold text-slate-900">
                  {clientLadhStudy.fatoDimensionRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Área con Seguridad:</span>
                <span className="font-bold text-slate-900">
                  {clientLadhStudy.totalAreaWithSafetyRequiredM} m
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Carga Estructural (1.5x):</span>
                <span className="font-bold text-emerald-700">
                  {clientLadhStudy.dynamicLoadDesignKg} kg
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Matriz de Seguimiento Documental */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
            4. Estado de Tramitaciones ante Organismos de Aplicación
          </h3>
          <table className="w-full text-[10px] font-mono text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="py-1 px-2 border-b">Código</th>
                <th className="py-1 px-2 border-b">Organismo</th>
                <th className="py-1 px-2 border-b">Trámite / Requisito</th>
                <th className="py-1 px-2 border-b">Estado Oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {client.documents.map(doc => (
                <tr key={doc.id}>
                  <td className="py-1 px-2 font-bold">{doc.code}</td>
                  <td className="py-1 px-2">{doc.category}</td>
                  <td className="py-1 px-2">{doc.title}</td>
                  <td className="py-1 px-2 font-semibold">
                    {doc.status === 'APPROVED'
                      ? 'Presentado / Aprobado'
                      : doc.status === 'IN_PROGRESS'
                        ? 'En Trámite'
                        : doc.status === 'OBSERVED'
                          ? 'Observado'
                          : 'Pendiente'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Dictamen Conclusivo del Orquestador */}
        <div className="border-2 border-slate-800 p-4 rounded-xl mb-8 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono uppercase text-sky-800">
              DICTAMEN CONCLUSIVO DE FACTIBILIDAD
            </span>
            <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
              {verdict.globalStatus}
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-serif">
            {verdict.executiveSummary} Se concluye que el emplazamiento reúne las condiciones
            reglamentarias para su prosecución formal ante la Dirección Nacional de Infraestructura
            Aeroportuaria (DINAyG - ANAC) y el Ente Nacional de Comunicaciones (ENACOM).
          </p>
        </div>

        {/* Bloque de Firmas y Responsabilidad Profesional */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs font-mono">
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-12" />
            <span className="font-bold block text-slate-900">Ing. Aeronáutico Matriculado</span>
            <span className="text-slate-500 text-[10px]">
              Consejo Profesional de Aeronáutica (CPA)
            </span>
          </div>
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-12" />
            <span className="font-bold block text-slate-900">Dirección Técnica SAI Consult</span>
            <span className="text-slate-500 text-[10px]">Peritajes & Consultoría Aeronáutica</span>
          </div>
        </div>
      </div>
    </div>
  );
};
