import React from 'react';
import {
  Users,
  CheckSquare,
  Compass,
  Plane,
  Disc,
  FileText,
  Database,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react';
import { Client } from '../../types/client';
import saiLogoEmblem from '../../assets/sai_logo_emblem.png';

export type MainView =
  'clients' | 'checklist' | 'wind' | 'lad' | 'ladh' | 'dossier' | 'backups' | 'manual';

interface SidebarProps {
  currentView: MainView;
  onViewChange: (view: MainView) => void;
  selectedClient: Client | null;
  onOpenNewClient: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  selectedClient,
  onOpenNewClient
}) => {
  const primaryMenuItems = [
    {
      id: 'clients' as MainView,
      label: 'Expedientes',
      icon: Users,
      iconColor: 'text-[#475569]'
    },
    {
      id: 'checklist' as MainView,
      label: 'Documentación',
      icon: CheckSquare,
      iconColor: 'text-[#0284c7]'
    },
    {
      id: 'wind' as MainView,
      label: 'Viento cruzado',
      icon: Compass,
      iconColor: 'text-[#64748b]'
    },
    {
      id: 'lad' as MainView,
      label: 'Pistas LAD',
      icon: Plane,
      iconColor: 'text-[#6366f1]'
    },
    {
      id: 'ladh' as MainView,
      label: 'Helipuertos LADH',
      icon: Disc,
      iconColor: 'text-[#059669]'
    },
    {
      id: 'dossier' as MainView,
      label: 'Dossier técnico',
      icon: FileText,
      iconColor: 'text-[#0284c7]'
    },
    {
      id: 'backups' as MainView,
      label: 'Exportar / Respaldos',
      icon: Database,
      iconColor: 'text-[#64748b]'
    }
  ];

  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between select-none shrink-0 no-print py-3">
      <div className="space-y-1">
        {/* Cabecera de marca para la versión Web / Online */}
        {!isDesktop && (
          <div className="px-4 pb-3 mb-2 border-b border-slate-100 flex items-center gap-2.5">
            <div className="h-8 w-9 flex items-center justify-center">
              <img
                src={saiLogoEmblem}
                alt="Logo SAI Consult"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-[#0f2942] text-sm font-heading leading-tight">
                SAI Consult
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                Aeronáutica
              </span>
            </div>
          </div>
        )}

        {/* Lista de navegación principal idéntica a DentaSoft */}
        <nav className="space-y-0.5">
          {primaryMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#e8edf5] text-[#0f2942] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#0f2942]' : item.iconColor}`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Botón rápido "+ Nuevo expediente" con estilo DentaSoft (+ en violeta/azul) */}
          <button
            onClick={onOpenNewClient}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Plus className="h-4 w-4 shrink-0 text-[#7c3aed]" />
            <span>Nuevo expediente</span>
          </button>
        </nav>

        {/* Indicador de cliente activo si está seleccionado */}
        {selectedClient && (
          <div className="mx-3 mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Activo
            </div>
            <div className="font-semibold text-slate-800 truncate" title={selectedClient.name}>
              {selectedClient.name}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {selectedClient.projectType} • {selectedClient.province}
            </div>
          </div>
        )}
      </div>

      {/* Enlaces inferiores: Manual y Cerrar sesión */}
      <div className="border-t border-slate-200 pt-3 px-2 space-y-1">
        <button
          onClick={() => onViewChange('manual')}
          className="w-full flex items-center gap-3 px-3 py-2 text-left text-[13px] text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <HelpCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span>Manual</span>
        </button>

        <button
          onClick={() => {
            if (confirm('¿Deseas reiniciar la sesión de trabajo y volver al inicio?')) {
              onViewChange('clients');
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-left text-[13px] text-[#b91c1c] hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="h-4 w-4 text-[#b91c1c] shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
