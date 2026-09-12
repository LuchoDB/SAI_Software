import React, { useState } from 'react';
import { CheckCircle2, Circle, Edit2, Check, MessageSquarePlus, X } from 'lucide-react';
import { DocumentItemModel, DocumentStatus } from '../../types/client';

interface DocumentItemProps {
  document: DocumentItemModel;
  onUpdateStatus: (id: string, status: DocumentStatus, notes?: string) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, onUpdateStatus }) => {
  const isCompleted =
    Boolean(document.completed) || document.estado === 'Aprobado' || document.status === 'APPROVED';

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(document.notes || document.observaciones || '');

  const handleToggleCheck = () => {
    const nextStatus: DocumentStatus = isCompleted ? 'Pendiente' : 'Aprobado';
    onUpdateStatus(document.id, nextStatus, notesText);
  };

  const handleSaveNotes = () => {
    const currentStatus: DocumentStatus = isCompleted ? 'Aprobado' : 'Pendiente';
    onUpdateStatus(document.id, currentStatus, notesText);
    setIsEditingNotes(false);
  };

  const isObligatorio = document.categoria === 'Obligatorio' || document.isMandatory === true;

  const organismoBadgeColors: Record<string, string> = {
    ANAC: 'bg-blue-50 text-blue-800 border-blue-200',
    ESCRIBANÍA: 'bg-amber-50 text-amber-900 border-amber-200',
    AMBIENTAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    DEFENSA: 'bg-purple-50 text-purple-800 border-purple-200',
    GESTORÍA: 'bg-teal-50 text-teal-800 border-teal-200',
    LOCACIÓN: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  };

  const badgeColor =
    organismoBadgeColors[document.organismo || 'ANAC'] ||
    'bg-slate-100 text-slate-700 border-slate-200';

  const currentNotes = document.notes || document.observaciones;

  return (
    <div
      className={`border rounded-xl p-4 transition-all shadow-2xs ${
        isCompleted
          ? 'bg-emerald-50/30 border-emerald-300'
          : 'bg-white hover:bg-slate-50/70 border-slate-200'
      }`}
    >
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

          <h4
            onClick={handleToggleCheck}
            className={`font-bold text-sm leading-snug cursor-pointer select-none transition ${
              isCompleted ? 'text-emerald-950' : 'text-slate-900 hover:text-blue-700'
            }`}
          >
            {document.titulo || document.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {document.descripcion || document.description}
          </p>
        </div>

        {/* Botón de Checklist interactivo */}
        <div className="shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={handleToggleCheck}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer select-none shadow-2xs ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Presentado / Listo</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-slate-400" />
                <span>Pendiente</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sección de Observaciones */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {isEditingNotes ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveNotes();
                if (e.key === 'Escape') setIsEditingNotes(false);
              }}
              placeholder="Escribe número de trámite, fecha de turno, expediente o aclaración..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
            <button
              onClick={handleSaveNotes}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Guardar observación"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Guardar</span>
            </button>
            <button
              onClick={() => setIsEditingNotes(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              title="Cancelar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between text-slate-500">
            {currentNotes ? (
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                <span className="font-semibold text-slate-700 text-[11px] shrink-0">
                  Observación:
                </span>
                <span className="truncate italic text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {currentNotes}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 transition cursor-pointer"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                <span>Agregar observación</span>
              </button>
            )}

            {currentNotes && (
              <button
                type="button"
                onClick={() => setIsEditingNotes(true)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
                title="Editar observación"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
