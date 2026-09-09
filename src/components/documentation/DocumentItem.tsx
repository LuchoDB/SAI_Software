import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Edit2, Check } from 'lucide-react';
import { DocumentItemModel, DocumentStatus } from '../../types/client';

interface DocumentItemProps {
  document: DocumentItemModel;
  onUpdateStatus: (id: string, status: DocumentStatus, notes?: string) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, onUpdateStatus }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(document.notes || '');

  const normalizedEstado =
    document.estado === 'Aprobado' || document.status === 'APPROVED'
      ? 'Aprobado'
      : document.estado === 'En trámite' || document.status === 'IN_PROGRESS'
        ? 'En trámite'
        : document.estado === 'Observado' || document.status === 'OBSERVED'
          ? 'Observado'
          : 'Pendiente';

  const statusConfig: Record<
    string,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    Aprobado: {
      label: 'Aprobado',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2
    },
    'En trámite': {
      label: 'En Trámite',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Clock
    },
    Pendiente: {
      label: 'Pendiente',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: Clock
    },
    Observado: {
      label: 'Observado',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: AlertCircle
    }
  };

  const currentStatus = statusConfig[normalizedEstado] || statusConfig['Pendiente'];
  const StatusIcon = currentStatus.icon;

  const handleSaveNotes = () => {
    onUpdateStatus(document.id, normalizedEstado as DocumentStatus, notesText);
    setIsEditingNotes(false);
  };

  const isObligatorio =
    document.categoria === 'Obligatorio' || document.isMandatory === true;

  const organismoBadgeColors: Record<string, string> = {
    ANAC: 'bg-blue-50 text-blue-800 border-blue-200',
    ESCRIBANÍA: 'bg-amber-50 text-amber-900 border-amber-200',
    AMBIENTAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    DEFENSA: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const badgeColor =
    organismoBadgeColors[document.organismo || 'ANAC'] ||
    'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white hover:bg-slate-50/70 border border-slate-200 rounded-xl p-4 transition-colors shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Información del Documento Canónico */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-[#0f2942] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {document.id}
            </span>

            {isObligatorio ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Obligatorio
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                Condicional
              </span>
            )}

            <span
              className={`text-[10px] font-bold border px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}
            >
              {document.organismo}
            </span>

            {document.organismo_dependencia && (
              <span className="text-[11px] text-slate-400 font-mono">
                • {document.organismo_dependencia}
              </span>
            )}
          </div>

          <h4 className="font-bold text-slate-900 text-sm leading-snug">
            {document.titulo || document.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {document.descripcion || document.description}
          </p>
        </div>

        {/* Selector de Estado Canónico */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{currentStatus.label}</span>
          </div>

          <select
            value={normalizedEstado}
            onChange={e =>
              onUpdateStatus(document.id, e.target.value as DocumentStatus, document.notes)
            }
            className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En trámite">En Trámite</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Observado">Observado</option>
          </select>
        </div>
      </div>

      {/* Notas / Observaciones */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {isEditingNotes ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              placeholder="Escribe una observación, número de expediente o trámite..."
              className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSaveNotes}
              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
              title="Guardar notas"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between text-slate-500">
            <span className="truncate italic text-[11px]">
              {document.notes ? `Observación: ${document.notes}` : 'Sin notas u observaciones'}
            </span>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
              title="Editar nota"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

