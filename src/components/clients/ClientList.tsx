import React, { useState, useMemo } from 'react';
import {
  Plus,
  Compass,
  Plane,
  Disc,
  CheckSquare,
  FileText,
  Edit,
  Trash2,
  Folder,
  MapPin,
  CheckCircle2,
  Archive,
  ArchiveRestore,
  Navigation,
  FileCheck,
  Building,
  Users,
  User
} from 'lucide-react';
import { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onToggleArchiveClient: (client: Client) => void;
  onNavigateToStudy: (
    view: 'checklist' | 'wind' | 'lad' | 'ladh' | 'dossier' | 'presentationNote',
    client: Client
  ) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenNewClientModal,
  onEditClient,
  onDeleteClient,
  onToggleArchiveClient,
  onNavigateToStudy
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'archived'>('pending');

  const pendingClientsCount = useMemo(() => clients.filter(c => !c.isArchived).length, [clients]);
  const archivedClientsCount = useMemo(
    () => clients.filter(c => Boolean(c.isArchived)).length,
    [clients]
  );

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const isMatchArchived = activeTab === 'archived' ? Boolean(c.isArchived) : !c.isArchived;
      if (!isMatchArchived) return false;

      const term = searchTerm.toLowerCase();
      const cat = (c.category || 'Pistas').toLowerCase();
      const subtype = (c.pistaSubtype || '').toLowerCase();
      const ownership = (c.ownershipType || '').toLowerCase();

      return (
        c.name.toLowerCase().includes(term) ||
        c.cuit.includes(term) ||
        c.locationName.toLowerCase().includes(term) ||
        c.province.toLowerCase().includes(term) ||
        c.projectType.toLowerCase().includes(term) ||
        cat.includes(term) ||
        subtype.includes(term) ||
        ownership.includes(term)
      );
    });
  }, [clients, searchTerm, activeTab]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading">
            Mis expedientes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión técnica integral de habilitaciones, alquiler de aeronaves y trámites ANAC
          </p>
        </div>

        <button
          onClick={onOpenNewClientModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a365d] hover:bg-[#0f2942] text-white text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Expediente</span>
        </button>
      </div>

      {/* Selector de Vistas: Trabajos Pendientes vs Finalizados */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-blue-50 text-[#1a365d] border border-blue-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <span>Trabajos Pendientes</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'pending' ? 'bg-[#1a365d] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {pendingClientsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'archived'
                ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Finalizados / Archivados</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'archived' ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {archivedClientsCount}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {activeTab === 'pending'
            ? 'Expedientes activos en proceso de tramitación'
            : 'Expedientes concluidos o archivados para consulta histórica'}
        </span>
      </div>

      {/* Buscador Rápido */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por titular, CUIT, ubicación, servicio (Pistas, Alquiler, Gestoría) o tipo..."
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all shadow-2xs"
        />
      </div>

      {/* Si no hay expedientes registrados o la búsqueda no arroja resultados */}
      {filteredClients.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 mb-2 text-slate-300 flex items-center justify-center">
            {activeTab === 'archived' ? (
              <Archive className="w-12 h-12 stroke-[1.2]" />
            ) : (
              <Folder className="w-12 h-12 stroke-[1.2]" />
            )}
          </div>
          <p className="text-sm font-bold text-slate-700">
            {activeTab === 'archived'
              ? 'No hay expedientes archivados.'
              : 'No hay expedientes pendientes de trámite.'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {activeTab === 'archived'
              ? 'Puedes finalizar y archivar expedientes desde el botón de archivo de cada fila.'
              : 'Utiliza el botón "+ Nuevo Expediente" para dar de alta una nueva carpeta técnica.'}
          </p>
        </div>
      ) : (
        /* Lista de expedientes clara y limpia */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredClients.map(client => {
            const isSelected = selectedClientId === client.id;
            const completedDocs = client.documents.filter(
              d => d.completed || d.status === 'APPROVED' || d.estado === 'Aprobado'
            ).length;
            const totalDocs = client.documents.length;
            const percent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

            const categoryName = client.category || 'Pistas';
            const isGestoria = categoryName === 'Gestoria';
            const isRental = categoryName === 'Alquiler de Aeronave';

            return (
              <div
                key={client.id}
                className={`p-4 sm:px-5 sm:py-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-50/40 border-l-4 border-l-[#1e3a8a]'
                    : client.isArchived
                      ? 'bg-amber-50/20 hover:bg-amber-50/30'
                      : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Información del cliente y metadatos */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {/* Badge de Categoría Principal */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        isRental
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : isGestoria
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-[#1a365d] border-blue-200'
                      }`}
                    >
                      {isRental ? (
                        <Navigation className="h-3 w-3" />
                      ) : isGestoria ? (
                        <FileCheck className="h-3 w-3" />
                      ) : (
                        <Plane className="h-3 w-3" />
                      )}
                      <span>{categoryName}</span>
                    </span>

                    {/* Subtipo de Pista si aplica */}
                    {client.category === 'Pistas' && client.pistaSubtype && (
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        {client.pistaSubtype}
                      </span>
                    )}

                    {/* Personería / Tipo societario */}
                    {client.ownershipType && (
                      <span className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        {client.ownershipType === 'Razon Social' ? (
                          <Building className="h-3 w-3 text-slate-500" />
                        ) : client.ownershipType === 'Titulares Varios' ? (
                          <Users className="h-3 w-3 text-slate-500" />
                        ) : (
                          <User className="h-3 w-3 text-slate-500" />
                        )}
                        <span>
                          {client.ownershipType === 'Razon Social' && client.sociedadType
                            ? `${client.sociedadType}`
                            : client.ownershipType}
                        </span>
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-mono">CUIT: {client.cuit}</span>

                    {client.isArchived && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        Archivado
                      </span>
                    )}

                    {isSelected && (
                      <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Activo</span>
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectClient(client)}
                    className="font-bold text-[#0f2942] text-base hover:text-blue-700 cursor-pointer truncate"
                  >
                    {client.name}
                  </h3>

                  {/* Metadatos de ubicación, orientación y avance */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        {client.locationName}, {client.province}
                      </span>
                    </span>

                    {client.magneticOrientation && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-blue-700">
                        <Compass className="h-3.5 w-3.5 shrink-0" />
                        <span>Rumbo: {client.magneticOrientation}</span>
                      </span>
                    )}

                    <span className="text-slate-300">•</span>

                    <span>
                      Checklist:{' '}
                      <strong className="text-slate-700">
                        {completedDocs}/{totalDocs} ({percent}%)
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Acciones directas del expediente */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onSelectClient(client)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a365d] text-white border-[#1a365d]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </button>

                  <button
                    onClick={() => onNavigateToStudy('checklist', client)}
                    title="Checklist Documental Regulatorio"
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onNavigateToStudy('presentationNote', client)}
                    title="Nota de Presentación ANAC"
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <FileText className="h-4 w-4" />
                  </button>

                  {client.category === 'Pistas' && (
                    <>
                      <button
                        onClick={() => onNavigateToStudy('wind', client)}
                        title="Estudio de Vientos y QFU"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Compass className="h-4 w-4" />
                      </button>

                      {client.projectType === 'LAD' ? (
                        <button
                          onClick={() => onNavigateToStudy('lad', client)}
                          title="Factibilidad Pista LAD"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Plane className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigateToStudy('ladh', client)}
                          title="Factibilidad Helipuerto LADH"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Disc className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => onNavigateToStudy('dossier', client)}
                    title="Dossier Técnico Imprimible"
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                  </button>

                  <div className="h-4 w-px bg-slate-200 mx-0.5" />

                  {/* Botón para Archivar / Reactivar */}
                  <button
                    onClick={() => onToggleArchiveClient(client)}
                    title={
                      client.isArchived
                        ? 'Reactivar expediente (Mover a Pendientes)'
                        : 'Archivar expediente finalizado'
                    }
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      client.isArchived
                        ? 'text-amber-700 hover:bg-amber-100'
                        : 'text-slate-400 hover:text-amber-700 hover:bg-slate-100'
                    }`}
                  >
                    {client.isArchived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onEditClient(client)}
                    title="Editar datos"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar el expediente de "${client.name}"?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    title="Eliminar expediente"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
