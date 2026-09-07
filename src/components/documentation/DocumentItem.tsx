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

  const statusConfig: Record<
    DocumentStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    APPROVED: {
      label: 'Aprobado / Presentado',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2
    },
    IN_PROGRESS: {
      label: 'En Trámite',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Clock
    },
    PENDING: {
      label: 'Pendiente',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: Clock
    },
    OBSERVED: {
      label: 'Observado',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: AlertCircle
    }
  };

  const currentStatus = statusConfig[document.status];
  const StatusIcon = currentStatus.icon;

  const handleSaveNotes = () => {
    onUpdateStatus(document.id, document.status, notesText);
    setIsEditingNotes(false);
  };

  return (
    <div className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 transition-colors shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Información del Documento */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {document.code}
            </span>
            {document.isMandatory ? (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Obligatorio
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium">Condicional</span>
            )}
            <span className="text-[11px] text-slate-500 font-mono">{document.category}</span>
          </div>

          <h4 className="font-semibold text-slate-900 text-sm">{document.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{document.description}</p>
        </div>

        {/* Selector de Estado */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{currentStatus.label}</span>
          </div>

          <select
            value={document.status}
            onChange={e =>
              onUpdateStatus(document.id, e.target.value as DocumentStatus, document.notes)
            }
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-slate-400 cursor-pointer shadow-xs"
          >
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Trámite</option>
            <option value="APPROVED">Aprobado</option>
            <option value="OBSERVED">Observado</option>
          </select>
        </div>
      </div>

      {/* Notas / Observaciones */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        {isEditingNotes ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              placeholder="Escribe una observación o número de expediente..."
              className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
            <span className="truncate italic">
              {document.notes ? `Nota: ${document.notes}` : 'Sin notas u observaciones'}
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
