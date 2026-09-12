import React, { useState } from 'react';
import {
  ShieldCheck,
  Landmark,
  Leaf,
  CheckCircle2,
  Circle,
  FileCheck,
  Plane,
  Navigation,
  Info,
  CheckCheck,
  RotateCcw
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');

  const categories: Array<{
    id: DocumentCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'ANAC', label: 'ANAC (Aeródromos & Tasas)', icon: ShieldCheck },
    { id: 'ESCRIBANÍA', label: 'Escribanía & Personería', icon: Landmark },
    { id: 'AMBIENTAL', label: 'Medio Ambiente & Suelo', icon: Leaf },
    { id: 'DEFENSA', label: 'Defensa (Frontera)', icon: ShieldCheck },
    { id: 'GESTORÍA', label: 'Gestoría (RNA)', icon: FileCheck },
    { id: 'LOCACIÓN', label: 'Alquiler de Aeronaves', icon: Navigation }
  ];

  const totalCount = documents.length;
  const completedCount = documents.filter(
    d => d.completed || d.status === 'APPROVED' || d.estado === 'Aprobado'
  ).length;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Acciones en lote: Marcar todos o desmarcar todos
  const handleMarkAll = (completed: boolean) => {
    const targetStatus: DocumentStatus = completed ? 'Aprobado' : 'Pendiente';
    documents.forEach(doc => {
      onUpdateDocumentStatus(doc.id, targetStatus, doc.notes || doc.observaciones);
    });
  };

  // Filtrado de documentos
  const filteredDocuments = documents.filter(doc => {
    const org = doc.organismo || doc.category;
    const matchesCat = activeCategory === 'ALL' || org === activeCategory;

    const isDocCompleted =
      Boolean(doc.completed) || doc.estado === 'Aprobado' || doc.status === 'APPROVED';

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'COMPLETED' && isDocCompleted) ||
      (statusFilter === 'PENDING' && !isDocCompleted);

    return matchesCat && matchesStatus;
  });

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
      subtitle:
        'Nota de presentación, formulario oficial unificado (Anexo IX), arancel CAD y registro de movimientos',
      icon: ShieldCheck,
      filter: d =>
        (d.organismo === 'ANAC' || d.category === 'ANAC') &&
        d.id !== 'AGRO-FORM-DENUNCIA' &&
        d.id !== 'AGRO-CROQUIS-COORD'
    },
    {
      id: 'group-agro-dnso',
      organismo: 'ANAC (DNSO)',
      title: 'ANAC (DNSO) — Campo Eventual Agroaéreo (RAAC 137)',
      subtitle:
        'Única documentación requerida para la denuncia de campo eventual agroaéreo ante DNSO',
      icon: Plane,
      filter: d => d.id === 'AGRO-FORM-DENUNCIA' || d.id === 'AGRO-CROQUIS-COORD'
    },
    {
      id: 'group-escribania',
      organismo: 'ESCRIBANÍA',
      title: 'ESCRIBANÍA & PERSONERÍA — Instrumentos Notariales & Dominiales',
      subtitle:
        'Título/contrato de locación, plano georreferenciado, estatutos societarios o poderes condomiales',
      icon: Landmark,
      filter: d => d.organismo === 'ESCRIBANÍA' || d.category === 'ESCRIBANÍA'
    },
    {
      id: 'group-ambiental',
      organismo: 'AMBIENTAL',
      title: 'AMBIENTAL & TERRITORIAL — Declaración Jurada y Zonificación',
      subtitle:
        'Declaración Jurada Ambiental Ley 25.675 y Certificado de Uso Conforme del Suelo municipal',
      icon: Leaf,
      filter: d => d.organismo === 'AMBIENTAL' || d.category === 'AMBIENTAL'
    },
    {
      id: 'group-defensa',
      organismo: 'DEFENSA',
      title: 'DEFENSA — Zona de Seguridad de Fronteras',
      subtitle: 'Aplica a predios en zona fronteriza (Ley 23.554 y Decreto-Ley 15.385/44)',
      icon: ShieldCheck,
      filter: d => d.organismo === 'DEFENSA' || d.category === 'DEFENSA' || d.id === 'FRONT-LEY'
    },
    {
      id: 'group-gestoria',
      organismo: 'GESTORÍA',
      title: 'GESTORÍA AERONÁUTICA — Registro Nacional de Aeronaves',
      subtitle: 'Dominio, transferencia, matriculación y titularidad de aeronaves',
      icon: FileCheck,
      filter: d => d.organismo === 'GESTORÍA' || d.category === 'GESTORÍA'
    },
    {
      id: 'group-locacion',
      organismo: 'LOCACIÓN',
      title: 'LOCACIÓN & OPERACIÓN — Alquiler de Aeronaves',
      subtitle: 'Contrato de locación, seguros vigentes, aeronavegabilidad y licencias de vuelo',
      icon: Navigation,
      filter: d => d.organismo === 'LOCACIÓN' || d.category === 'LOCACIÓN'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Panel Superior de Checklist y Avance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0f2942] font-heading">
                Checklist de Presentación de Documentación
              </h2>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  percent === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'
                }`}
              >
                {percent}% listo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Los documentos se presentan todos en un único trámite. Marca cada documento a medida
              que se encuentre adjunto y listo.
            </p>
          </div>

          {/* Botones de acción masiva */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => handleMarkAll(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Marcar todos</span>
            </button>

            <button
              onClick={() => handleMarkAll(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Desmarcar todos</span>
            </button>
          </div>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>
              Estado de la Carpeta:{' '}
              <strong className="text-slate-800">
                {completedCount} de {totalCount} documentos listos
              </strong>
            </span>
            <span className="font-bold text-slate-800 font-mono">{percent}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percent === 100 ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Filtro Rápido de Estado */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 text-[11px]">Ver:</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Listos ({completedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              statusFilter === 'PENDING'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Circle className="h-3 w-3" />
            <span>Pendientes ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Condicionales del Predio (Frontera y Campo Eventual Agroaéreo) */}
      {(onToggleFrontierZone || onToggleAgroEventual) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-700">
              Condiciones Específicas del Trámite:
            </span>
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

      {/* Barra de Filtros por Organismo / Categoría */}
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
          const count = documents.filter(d => (d.organismo || d.category) === cat.id).length;

          if (count === 0) return null;

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
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listado Agrupado en Orden Canónico */}
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
                    <h3 className="text-sm font-bold text-[#0f2942] font-heading">{group.title}</h3>
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

      {/* Nota Normativa de Presentación */}
      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FileCheck className="h-4 w-4 text-blue-700" />
          <span>Presentación de Documentación y Requisitos Normativos</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Toda la documentación debe presentarse de forma simultánea ante mesa de entradas de ANAC o
          vía Trámites a Distancia (TAD). En caso de campos eventuales agroaéreos (RAAC 137),
          únicamente se presentan el formulario de denuncia, la autorización del predio, el croquis
          operacional y la conformidad del suelo, sin necesidad de trámites arancelarios ni libros
          de aeródromo.
        </p>
      </div>
    </div>
  );
};
