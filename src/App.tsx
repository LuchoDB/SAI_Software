import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, MainView } from './components/layout/Sidebar';
import { ClientList } from './components/clients/ClientList';
import { ClientModal } from './components/clients/ClientModal';
import { DocumentChecklist } from './components/documentation/DocumentChecklist';
import { WindStudyView } from './components/wind/WindStudyView';
import { LadStudyView } from './components/feasibility/LadStudyView';
import { LadhStudyView } from './components/feasibility/LadhStudyView';
import { PrintableDossier } from './components/reports/PrintableDossier';
import { WelcomeSplash } from './components/welcome/WelcomeSplash';

import { Client, DocumentStatus } from './types/client';
import { WindStudyResult } from './types/wind';
import { LadStudy } from './types/lad';
import { LadhStudy } from './types/ladh';
import { generateCanonicalDocumentation } from './data/regulatoryRequirements';

import { StorageService } from './services/storageService';
import {
  CheckSquare,
  AlertCircle,
  ArrowRight,
  Database,
  Download,
  Upload,
  HelpCircle,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentView, setCurrentView] = useState<MainView>('clients');

  const [windStudies, setWindStudies] = useState<WindStudyResult[]>([]);
  const [ladStudies, setLadStudies] = useState<LadStudy[]>([]);
  const [ladhStudies, setLadhStudies] = useState<LadhStudy[]>([]);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [showWelcomeSplash, setShowWelcomeSplash] = useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadAllData = useCallback(() => {
    const loadedClients = StorageService.getClients();
    const loadedWind = StorageService.getWindStudies();
    const loadedLad = StorageService.getLadStudies();
    const loadedLadh = StorageService.getLadhStudies();

    setClients(loadedClients);
    setWindStudies(loadedWind);
    setLadStudies(loadedLad);
    setLadhStudies(loadedLadh);

    setSelectedClient(prev => {
      if (prev) {
        const stillExists = loadedClients.find(c => c.id === prev.id);
        if (stillExists) return stillExists;
      }
      return loadedClients.length > 0 ? loadedClients[0] : null;
    });
  }, []);

  // Inicialización de datos locales
  useEffect(() => {
    StorageService.initialize();
    loadAllData();
  }, [loadAllData]);

  // Guardar o modificar cliente
  const handleSaveClient = (client: Client) => {
    const saved = StorageService.saveClient(client);
    loadAllData();
    setSelectedClient(saved);
  };

  // Eliminar cliente
  const handleDeleteClient = (id: string) => {
    StorageService.deleteClient(id);
    loadAllData();
  };

  // Actualizar estado de un documento del checklist
  const handleUpdateDocumentStatus = (docId: string, status: DocumentStatus, notes?: string) => {
    if (!selectedClient) return;
    const updated = StorageService.updateClientDocumentStatus(
      selectedClient.id,
      docId,
      status,
      notes
    );
    if (updated) {
      setSelectedClient(updated);
      setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    }
  };

  const handleToggleFrontierZone = (isFrontier: boolean) => {
    if (!selectedClient) return;
    const newDocs = generateCanonicalDocumentation({
      projectType: selectedClient.projectType,
      isFrontierZone: isFrontier,
      isAgroEventual: selectedClient.isAgroEventual
    });
    const oldMap = new Map(selectedClient.documents.map(d => [d.id, d]));
    const mergedDocs = newDocs.map(nd => {
      const old = oldMap.get(nd.id);
      if (old) {
        return {
          ...nd,
          status: old.status,
          estado: old.estado,
          notes: old.notes,
          submittedDate: old.submittedDate,
          approvalDate: old.approvalDate
        };
      }
      return nd;
    });
    const updatedClient: Client = {
      ...selectedClient,
      isFrontierZone: isFrontier,
      documents: mergedDocs
    };
    StorageService.saveClient(updatedClient);
    setSelectedClient(updatedClient);
    setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const handleToggleAgroEventual = (isAgro: boolean) => {
    if (!selectedClient) return;
    const newDocs = generateCanonicalDocumentation({
      projectType: selectedClient.projectType,
      isFrontierZone: selectedClient.isFrontierZone,
      isAgroEventual: isAgro
    });
    const oldMap = new Map(selectedClient.documents.map(d => [d.id, d]));
    const mergedDocs = newDocs.map(nd => {
      const old = oldMap.get(nd.id);
      if (old) {
        return {
          ...nd,
          status: old.status,
          estado: old.estado,
          notes: old.notes,
          submittedDate: old.submittedDate,
          approvalDate: old.approvalDate
        };
      }
      return nd;
    });
    const updatedClient: Client = {
      ...selectedClient,
      isAgroEventual: isAgro,
      documents: mergedDocs
    };
    StorageService.saveClient(updatedClient);
    setSelectedClient(updatedClient);
    setClients(prev => prev.map(c => (c.id === updatedClient.id ? updatedClient : c)));
  };

  // Guardar estudio de vientos
  const handleSaveWindStudy = (study: WindStudyResult) => {
    StorageService.saveWindStudy(study);
    loadAllData();
  };

  // Guardar estudio LAD
  const handleSaveLadStudy = (study: LadStudy) => {
    StorageService.saveLadStudy(study);
    loadAllData();
  };

  // Guardar estudio LADH
  const handleSaveLadhStudy = (study: LadhStudy) => {
    StorageService.saveLadhStudy(study);
    loadAllData();
  };

  // Exportar e Importar Respaldo JSON
  const handleExportBackup = () => {
    const json = StorageService.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAI_Consult_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text && StorageService.importFullBackup(text)) {
        loadAllData();
        alert('Copia de seguridad restaurada correctamente.');
      } else {
        alert('Error: el archivo no tiene un formato válido de respaldo de SAI Consult.');
      }
    };
    reader.readAsText(file);
  };

  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  return (
    <div className="h-screen min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Animación Cinematográfica de Bienvenida */}
      {showWelcomeSplash && <WelcomeSplash onFinish={() => setShowWelcomeSplash(false)} />}

      {/* Barra Superior estilo Desktop App (Ventana + Logo) - Solo en versión Desktop */}
      {isDesktop && <Navbar />}

      {/* Contenedor Principal: Menú Lateral + Área de Trabajo */}
      <div className="flex-1 flex overflow-hidden">
        {/* Menú Lateral estilo DentaSoft */}
        <Sidebar
          currentView={currentView}
          onViewChange={view => setCurrentView(view)}
          selectedClient={selectedClient}
          onOpenNewClient={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
        />

        {/* Área de Trabajo Limpia */}
        <main className="flex-1 bg-white overflow-y-auto p-6 md:p-8">
          {/* Vista 1: Expedientes */}
          {currentView === 'clients' && (
            <ClientList
              clients={clients}
              selectedClientId={selectedClient?.id}
              onSelectClient={c => setSelectedClient(c)}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onEditClient={c => {
                setClientToEdit(c);
                setIsClientModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onNavigateToStudy={(view, client) => {
                setSelectedClient(client);
                setCurrentView(view);
              }}
            />
          )}

          {/* Vista 2: Documentación */}
          {currentView === 'checklist' &&
            (selectedClient ? (
              <div className="max-w-5xl mx-auto space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
                      <CheckSquare className="h-6 w-6 text-blue-700" />
                      <span>Documentación regulatoria: {selectedClient.name}</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Nómina canónica oficial ANAC, Escribanía, Ambiental y Defensa (
                      {selectedClient.projectType})
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('dossier')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0f2942] text-[#0f2942] hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                  >
                    <span>Ver en Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <DocumentChecklist
                  documents={selectedClient.documents}
                  onUpdateDocumentStatus={handleUpdateDocumentStatus}
                  isFrontierZone={selectedClient.isFrontierZone}
                  isAgroEventual={selectedClient.isAgroEventual}
                  onToggleFrontierZone={handleToggleFrontierZone}
                  onToggleAgroEventual={handleToggleAgroEventual}
                />
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700 mb-1">
                  Sin Expediente Seleccionado
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Selecciona un expediente en la sección de Expedientes para revisar y actualizar
                  sus trámites regulatorios.
                </p>
                <button
                  onClick={() => setCurrentView('clients')}
                  className="px-4 py-2 bg-[#1a365d] text-white text-xs font-semibold rounded-lg hover:bg-[#0f2942] transition"
                >
                  Ir a Expedientes
                </button>
              </div>
            ))}

          {/* Vista 3: Orientación & Viento Cruzado */}
          {currentView === 'wind' && (
            <WindStudyView
              clients={clients}
              selectedClient={selectedClient}
              onSaveStudy={handleSaveWindStudy}
              savedStudies={windStudies}
            />
          )}

          {/* Vista 4: Factibilidad Pistas (LAD - RAAC 153) */}
          {currentView === 'lad' && (
            <LadStudyView
              clients={clients}
              selectedClient={selectedClient}
              onSaveStudy={handleSaveLadStudy}
              savedStudies={ladStudies}
            />
          )}

          {/* Vista 5: Factibilidad Helipuertos (LADH - RAAC 154) */}
          {currentView === 'ladh' && (
            <LadhStudyView
              clients={clients}
              selectedClient={selectedClient}
              onSaveStudy={handleSaveLadhStudy}
              savedStudies={ladhStudies}
            />
          )}

          {/* Vista 6: Dossier Técnico Imprimible */}
          {currentView === 'dossier' &&
            (selectedClient ? (
              <PrintableDossier
                client={selectedClient}
                onBack={() => setCurrentView('clients')}
                windStudies={windStudies}
                ladStudies={ladStudies}
                ladhStudies={ladhStudies}
              />
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700 mb-1">
                  Sin Expediente Seleccionado
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Selecciona un expediente para generar e imprimir su informe técnico formal.
                </p>
                <button
                  onClick={() => setCurrentView('clients')}
                  className="px-4 py-2 bg-[#1a365d] text-white text-xs font-semibold rounded-lg hover:bg-[#0f2942] transition"
                >
                  Ir a Expedientes
                </button>
              </div>
            ))}

          {/* Vista 7: Exportar / Respaldos */}
          {currentView === 'backups' && (
            <div className="max-w-2xl mx-auto space-y-6 pt-4">
              <div>
                <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-700" />
                  <span>Exportar Datos & Respaldos</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Guarda una copia completa de todos los expedientes, estudios y documentación en
                  formato JSON para transferir entre equipos o salvaguardar la información.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exportar */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                      <Download className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Exportar Copia de Seguridad
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Descarga un archivo JSON con todos los expedientes cargados ({clients.length}{' '}
                      clientes).
                    </p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="mt-4 w-full py-2 bg-[#1a365d] hover:bg-[#0f2942] text-white text-xs font-semibold rounded-lg transition"
                  >
                    Descargar Respaldo JSON
                  </button>
                </div>

                {/* Importar */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                      <Upload className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Restaurar Copia de Seguridad
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Carga un archivo de respaldo JSON generado previamente en SAI Consult.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    Seleccionar Archivo JSON
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportBackup}
                    accept=".json"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vista 8: Manual & Normativa */}
          {currentView === 'manual' && (
            <div className="max-w-3xl mx-auto space-y-6 pt-4">
              <div>
                <h1 className="text-2xl font-bold text-[#0f2942] tracking-tight font-heading flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-red-500" />
                  <span>Manual de Usuario & Normativa Aplicable</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Guía técnica sobre los cálculos reglamentarios de la República Argentina y
                  estándares OACI.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-700" />
                    <span>RAAC Parte 153 (Diseño de Aeródromos y Pistas LAD)</span>
                  </h3>
                  <p>
                    Aplica para la habilitación de pistas agrícolas, ejecutivas y privadas. La
                    longitud básica de campo de referencia de la aeronave crítica de diseño se
                    corrige sucesivamente por:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                    <li>
                      <strong>Elevación</strong>: +7% por cada 300 metros sobre el nivel medio del
                      mar (MSL).
                    </li>
                    <li>
                      <strong>Temperatura</strong>: +1% por cada 1°C que la temperatura media máxima
                      exceda a la atmósfera estándar ISA.
                    </li>
                    <li>
                      <strong>Pendiente</strong>: +10% por cada 1% de pendiente longitudinal
                      ascendente.
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>RAAC Parte 154 (Diseño de Helipuertos LADH)</span>
                  </h3>
                  <p>
                    Aplica para helipuertos en superficie, elevados o sanitarios. Se rige por la
                    dimensión mayor del helicóptero con rotores en movimiento (parámetro{' '}
                    <strong>D</strong>):
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                    <li>
                      <strong>TLOF</strong> (Toma de Contacto): Mínimo 0.83D (monomotor) o 1.0D
                      (elevado/bimotor).
                    </li>
                    <li>
                      <strong>FATO</strong> (Aproximación Final): Mínimo 1.5D en superficie.
                    </li>
                    <li>
                      <strong>Área de Seguridad</strong>: Borde exterior de FATO + 0.25D (mínimo
                      absoluto de 3 metros).
                    </li>
                    <li>
                      <strong>Carga Dinámica Estructural</strong>: 1.5 veces el MTOW.
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-700" />
                    <span>Orientación QFU y Viento Cruzado (OACI Anexo 14)</span>
                  </h3>
                  <p>
                    El designador de pista (QFU) se obtiene redondeando a la decena el rumbo
                    magnético corregido por declinación. El factor de utilización debe ser como
                    mínimo del <strong>95%</strong> para el viento cruzado demostrado de la aeronave
                    prevista (10 kt, 13 kt o 20 kt).
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Alta y Edición de Cliente */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        initialClient={clientToEdit}
      />
    </div>
  );
};

export default App;
