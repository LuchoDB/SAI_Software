import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Radio, 
  Landmark, 
  Building2, 
  Leaf, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { DocumentItemModel, DocumentStatus, DocumentCategory } from '../../types/client';
import { DocumentItem } from './DocumentItem';

interface DocumentChecklistProps {
  documents: DocumentItemModel[];
  onUpdateDocumentStatus: (id: string, status: DocumentStatus, notes?: string) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  onUpdateDocumentStatus
}) => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');

  const categories: Array<{ id: DocumentCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'ANAC', label: 'ANAC (Infraestructura)', icon: ShieldCheck },
    { id: 'ENACOM', label: 'ENACOM (Radioenlaces)', icon: Radio },
    { id: 'CATASTRO', label: 'Catastro & Jurídico', icon: Landmark },
    { id: 'MUNICIPAL', label: 'Municipal / Zonificación', icon: Building2 },
    { id: 'AMBIENTAL', label: 'Medio Ambiente', icon: Leaf }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCat = activeCategory === 'ALL' || doc.category === activeCategory;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const totalCount = documents.length;
  const approvedCount = documents.filter(d => d.status === 'APPROVED').length;
  const inProgressCount = documents.filter(d => d.status === 'IN_PROGRESS').length;
  const observedCount = documents.filter(d => d.status === 'OBSERVED').length;
  const pendingCount = documents.filter(d => d.status === 'PENDING').length;

  return (
    <div className="space-y-4">
      {/* Resumen Superior de Estados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setStatusFilter(statusFilter === 'APPROVED' ? 'ALL' : 'APPROVED')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'APPROVED'
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
          onClick={() => setStatusFilter(statusFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'IN_PROGRESS'
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
          onClick={() => setStatusFilter(statusFilter === 'OBSERVED' ? 'ALL' : 'OBSERVED')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'OBSERVED'
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
          onClick={() => setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'PENDING'
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

      {/* Barra de Filtros por Organismo */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition ${
            activeCategory === 'ALL'
              ? 'bg-[#1a365d] text-white border-[#1a365d]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos ({totalCount})
        </button>

        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = documents.filter(d => d.category === cat.id).length;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#1a365d] text-white border-[#1a365d] font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de Documentos Filtrados */}
      <div className="space-y-2">
        {filteredDocuments.map(doc => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onUpdateStatus={onUpdateDocumentStatus}
          />
        ))}
      </div>
    </div>
  );
};
