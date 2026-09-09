import React, { useState } from 'react';
import {
  ShieldCheck,
  Landmark,
  Leaf,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Plane,
  Info
} from 'lucide-react';
import { DocumentItemModel, DocumentStatus, DocumentCategory } from '../../types/client';
import { DocumentItem } from './DocumentItem';

interface DocumentChecklistProps {
  documents: DocumentItemModel[];
  onUpdateDocumentStatus: (id: string, status: DocumentStatus, notes?: string) => void;
  isFrontierZone?: boolean;
  isAgroEventual?: boolean;
  onToggleFrontierZone?: (value: boolean) => void;
  onToggleAgroEventual?: (value: boolean) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  onUpdateDocumentStatus,
  isFrontierZone,
  isAgroEventual,
  onToggleFrontierZone,
  onToggleAgroEventual
}) => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');

  const categories: Array<{
    id: DocumentCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'ANAC', label: 'ANAC (Aeródromos & Tasas)', icon: ShieldCheck },
    { id: 'ESCRIBANÍA', label: 'Escribanía (Títulos & Planos)', icon: Landmark },
    { id: 'AMBIENTAL', label: 'Medio Ambiente (DJA)', icon: Leaf },
    { id: 'DEFENSA', label: 'Defensa (Frontera)', icon: ShieldCheck }
  ];

  const totalCount = documents.length;
  const approvedCount = documents.filter(
    d => d.status === 'APPROVED' || d.estado === 'Aprobado'
  ).length;
  const inProgressCount = documents.filter(
    d => d.status === 'IN_PROGRESS' || d.estado === 'En trámite'
  ).length;
  const observedCount = documents.filter(
    d => d.status === 'OBSERVED' || d.estado === 'Observado'
  ).length;
  const pendingCount = documents.filter(
    d => d.status === 'PENDING' || d.estado === 'Pendiente'
  ).length;

  // Filtrado de documentos
  const filteredDocuments = documents.filter(doc => {
    const org = doc.organismo || doc.category;
    const matchesCat = activeCategory === 'ALL' || org === activeCategory;

    const normalizedDocStatus =
      doc.estado === 'Aprobado' || doc.status === 'APPROVED'
        ? 'APPROVED'
        : doc.estado === 'En trámite' || doc.status === 'IN_PROGRESS'
          ? 'IN_PROGRESS'
          : doc.estado === 'Observado' || doc.status === 'OBSERVED'
            ? 'OBSERVED'
            : 'PENDING';

    const normalizedFilterStatus =
      statusFilter === 'APPROVED' || statusFilter === 'Aprobado'
        ? 'APPROVED'
        : statusFilter === 'IN_PROGRESS' || statusFilter === 'En trámite'
          ? 'IN_PROGRESS'
          : statusFilter === 'OBSERVED' || statusFilter === 'Observado'
            ? 'OBSERVED'
            : statusFilter === 'PENDING' || statusFilter === 'Pendiente'
              ? 'PENDING'
              : 'ALL';

    const matchesStatus =
      normalizedFilterStatus === 'ALL' || normalizedDocStatus === normalizedFilterStatus;

    return matchesCat && matchesStatus;
  });

  // Orden Canónico Oficial por Organismo:
  // 1. ANAC
  // 2. ESCRIBANÍA
  // 3. AMBIENTAL
  // 4. DEFENSA (solo si frontera)
  // 5. ANAC (DNSO, solo caso agroaéreo)
  const canonicalGroups: Array<{
    id: string;
    organismo: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    filter: (doc: DocumentItemModel) => boolean;
  }> = [
    {
      id: 'group-anac-main',
      organismo: 'ANAC',
      title: 'ANAC — Dirección de Aeródromos / DGIySA / CAD',
      subtitle: 'Trámites de presentación formal, datos técnicos, arancel A.D.1.9 y libros de registro',
      icon: ShieldCheck,
      filter: d =>
        (d.organismo === 'ANAC' || d.category === 'ANAC') && d.id !== 'AGRO-RAAC137'
    },
    {
      id: 'group-escribania',
      organismo: 'ESCRIBANÍA',
      title: 'ESCRIBANÍA — Instrumentos Notariales & Dominiales',
      subtitle: 'Título o contrato certificado, plano de mensura y acreditación de personería jurídica',
      icon: Landmark,
      filter: d => d.organismo === 'ESCRIBANÍA' || d.category === 'ESCRIBANÍA'
    },
    {
      id: 'group-ambiental',
      organismo: 'AMBIENTAL',
      title: 'AMBIENTAL — Autoridad Ambiental Competente',
      subtitle: 'Declaración Jurada Ambiental conforme Ley 25.675 (Art. 11° y 12°)',
      icon: Leaf,
      filter: d => d.organismo === 'AMBIENTAL' || d.category === 'AMBIENTAL'
    },
    {
      id: 'group-defensa',
      organismo: 'DEFENSA',
      title: 'DEFENSA — Zona de Frontera',
      subtitle: 'Aplica a predios en zona de seguridad de frontera (Ley 23.554 y Decreto-Ley 15.385/44)',
      icon: ShieldCheck,
      filter: d =>
        (d.organismo === 'DEFENSA' || d.category === 'DEFENSA') || d.id === 'FRONT-LEY'
    },
    {
      id: 'group-anac-dnso',
      organismo: 'ANAC (DNSO)',
      title: 'ANAC (DNSO) — Explotadores Agroaéreos (RAAC 137)',
      subtitle: 'Denuncia como campo eventual agroaéreo (reemplaza al registro LAD estándar)',
      icon: Plane,
      filter: d => d.id === 'AGRO-RAAC137'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Resumen Superior de Estados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'APPROVED' || statusFilter === 'Aprobado' ? 'ALL' : 'APPROVED'
            )
          }
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'APPROVED' || statusFilter === 'Aprobado'
              ? 'bg-emerald-50 border-emerald-300 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Aprobados</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{approvedCount}</div>
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'IN_PROGRESS' || statusFilter === 'En trámite' ? 'ALL' : 'IN_PROGRESS'
            )
          }
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'IN_PROGRESS' || statusFilter === 'En trámite'
              ? 'bg-blue-50 border-blue-300 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">En Trámite</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1">{inProgressCount}</div>
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'OBSERVED' || statusFilter === 'Observado' ? 'ALL' : 'OBSERVED'
            )
          }
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'OBSERVED' || statusFilter === 'Observado'
              ? 'bg-red-50 border-red-300 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Observados</span>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-700 mt-1">{observedCount}</div>
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'PENDING' || statusFilter === 'Pendiente' ? 'ALL' : 'PENDING'
            )
          }
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'PENDING' || statusFilter === 'Pendiente'
              ? 'bg-slate-100 border-slate-300 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Pendientes</span>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-700 mt-1">{pendingCount}</div>
        </button>
      </div>

      {/* Condicionales del Predio (Frontera y Campo Eventual Agroaéreo) */}
      {(onToggleFrontierZone || onToggleAgroEventual) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-700">Condiciones Específicas del Predio:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {onToggleFrontierZone && (
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(isFrontierZone)}
                  onChange={e => onToggleFrontierZone(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <span>Zona de Frontera (Ley 23.554)</span>
              </label>
            )}

            {onToggleAgroEventual && (
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(isAgroEventual)}
                  onChange={e => onToggleAgroEventual(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <span>Campo Eventual Agroaéreo (RAAC 137)</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Barra de Filtros por Organismo */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition cursor-pointer ${
            activeCategory === 'ALL'
              ? 'bg-[#1a365d] text-white border-[#1a365d]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos ({totalCount})
        </button>

        {categories.map(cat => {
          const Icon = cat.icon;
          const count = documents.filter(
            d => (d.organismo || d.category) === cat.id
          ).length;

          // Si el organismo no tiene documentos aplicables en este cliente (ej. DEFENSA en zona no fronteriza), no mostrar la pestaña
          if (count === 0 && cat.id === 'DEFENSA') return null;

          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#1a365d] text-white border-[#1a365d] font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listado Agrupado en Orden Canónico: ANAC -> ESCRIBANÍA -> AMBIENTAL -> DEFENSA -> ANAC (DNSO) */}
      <div className="space-y-6">
        {canonicalGroups.map(group => {
          const groupDocs = filteredDocuments.filter(group.filter);
          if (groupDocs.length === 0) return null;

          const GroupIcon = group.icon;

          return (
            <div key={group.id} className="space-y-2.5">
              {/* Encabezado del Organismo */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 pt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-100 text-slate-700">
                    <GroupIcon className="h-4 w-4 text-[#0f2942]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f2942] font-heading">
                      {group.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{group.subtitle}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {groupDocs.length} {groupDocs.length === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>

              {/* Lista de Documentos del Organismo */}
              <div className="space-y-2">
                {groupDocs.map(doc => (
                  <DocumentItem
                    key={doc.id}
                    document={doc}
                    onUpdateStatus={onUpdateDocumentStatus}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredDocuments.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron documentos con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Nota Canónica Normativa LAD/LADH */}
      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FileCheck className="h-4 w-4 text-blue-700" />
          <span>Normativa Aplicable al Registro LAD/LADH (Anexo IX ANAC)</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Esta nómina constituye la lista canónica oficial requerida para el registro de Lugares Aptos por Exclusividad (LAD / LADH). Los trámites propios de una habilitación completa de aeródromo o helipuerto público/privado (Memoria Técnica con cálculo de resistencia, Plano SLO perimétrico 360°, Estudio Climatológico, Estudio Geotécnico, Plan SSEI, dictámenes de telecomunicaciones ENACOM, Catastro y Zonificación Municipal) corresponden a un régimen de habilitación independiente (RAAC 153/154) y no forman parte del flujo simplificado LAD/LADH.
        </p>
      </div>
    </div>
  );
};

