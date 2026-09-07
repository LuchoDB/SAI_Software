import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  FolderOpen, 
  Compass, 
  Plane, 
  Disc, 
  CheckSquare, 
  FileText, 
  Edit, 
  Trash2,
  Folder,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onNavigateToStudy: (view: 'checklist' | 'wind' | 'lad' | 'ladh' | 'dossier', client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenNewClientModal,
  onEditClient,
  onDeleteClient,
  onNavigateToStudy
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.cuit.includes(term) ||
        c.locationName.toLowerCase().includes(term) ||
        c.province.toLowerCase().includes(term) ||
        c.projectType.toLowerCase().includes(term)
      );
    });
  }, [clients, searchTerm]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Cabecera idéntica a DentaSoft: Título "Mis expedientes" a la izquierda, Botón "+ Agregar" a la derecha */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading">
          Mis expedientes
        </h1>

        <button
          onClick={onOpenNewClientModal}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-[#0f2942] text-[#0f2942] hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar</span>
        </button>
      </div>

      {/* Buscador idéntico a DentaSoft: Amplio, limpio y con placeholder claro */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, CUIT, ubicación o tipo..."
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all shadow-xs"
        />
      </div>

      {/* Si no hay expedientes registrados o la búsqueda no arroja resultados */}
      {filteredClients.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-3 text-slate-300 flex items-center justify-center">
            <Folder className="w-16 h-16 stroke-[1.2]" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            {clients.length === 0 ? 'No hay expedientes registrados.' : 'No se encontraron expedientes con ese criterio.'}
          </p>
          <p className="text-sm text-slate-400 mt-0.5">
            {clients.length === 0 ? 'Usá "+ Agregar" para comenzar.' : 'Intenta buscar con otro término.'}
          </p>
        </div>
      ) : (
        /* Lista de expedientes clara y limpia */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredClients.map((client) => {
            const isSelected = selectedClientId === client.id;
            const approvedDocs = client.documents.filter(d => d.status === 'APPROVED').length;
            const totalDocs = client.documents.length;
            const percent = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

            return (
              <div
                key={client.id}
                className={`p-4 sm:px-5 sm:py-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected ? 'bg-blue-50/40 border-l-4 border-l-[#1e3a8a]' : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Información del cliente */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                        client.projectType === 'LAD'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : client.projectType === 'LADH'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {client.projectType === 'LAD' ? 'Pista LAD' : client.projectType === 'LADH' ? 'Helipuerto LADH' : 'Mixto'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">CUIT: {client.cuit}</span>
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

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {client.locationName}, {client.province}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Avance documental: <strong className="text-slate-700">{approvedDocs}/{totalDocs} ({percent}%)</strong>
                    </span>
                  </div>
                </div>

                {/* Acciones directas del expediente */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onSelectClient(client)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      isSelected
                        ? 'bg-[#1a365d] text-white border-[#1a365d]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </button>

                  <button
                    onClick={() => onNavigateToStudy('checklist', client)}
                    title="Checklist Documental ANAC / ENACOM"
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onNavigateToStudy('wind', client)}
                    title="Estudio de Vientos y QFU"
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Compass className="h-4 w-4" />
                  </button>

                  {client.projectType === 'LAD' ? (
                    <button
                      onClick={() => onNavigateToStudy('lad', client)}
                      title="Factibilidad Pista LAD"
                      className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Plane className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToStudy('ladh', client)}
                      title="Factibilidad Helipuerto LADH"
                      className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Disc className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onNavigateToStudy('dossier', client)}
                    title="Dossier Técnico Imprimible"
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <FileText className="h-4 w-4" />
                  </button>

                  <div className="h-4 w-px bg-slate-200 mx-0.5" />

                  <button
                    onClick={() => onEditClient(client)}
                    title="Editar datos"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
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
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
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
