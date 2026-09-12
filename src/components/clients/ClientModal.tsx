import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plane,
  Building,
  Users,
  User,
  Plus,
  Trash2,
  Compass,
  FileCheck,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import {
  Client,
  ProjectType,
  ExpedienteCategory,
  PistaSubtype,
  OwnershipType,
  SociedadType,
  TitularData,
  AircraftRentalData,
  GestoriaData
} from '../../types/client';
import { generateInitialChecklist } from '../../data/regulatoryRequirements';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  initialClient?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient
}) => {
  // 1. Categoría principal y Subtipo
  const [category, setCategory] = useState<ExpedienteCategory>('Pistas');
  const [pistaSubtype, setPistaSubtype] = useState<PistaSubtype>('LAD');

  // 2. Personería / Titularidad
  const [ownershipType, setOwnershipType] = useState<OwnershipType>('Razon Social');
  const [sociedadType, setSociedadType] = useState<SociedadType>('S.A.');

  // Titular único / Razón Social principal
  const [name, setName] = useState('');
  const [cuit, setCuit] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Titulares varios (lista dinámica)
  const [titulares, setTitulares] = useState<TitularData[]>([
    { id: 'tit-1', nombre: '', dniCuit: '', telefono: '', email: '', porcentajeParticipacion: '50%' },
    { id: 'tit-2', nombre: '', dniCuit: '', telefono: '', email: '', porcentajeParticipacion: '50%' }
  ]);

  // 3. Alquiler de Aeronave
  const [rentalClient, setRentalClient] = useState('');
  const [rentalOwner, setRentalOwner] = useState('');
  const [rentalAircraftType, setRentalAircraftType] = useState('');
  const [rentalDestination, setRentalDestination] = useState('');
  const [rentalHoursOrKm, setRentalHoursOrKm] = useState('');

  // 4. Gestoría
  const [gestoriaApplicant, setGestoriaApplicant] = useState('');
  const [gestoriaCertDominio, setGestoriaCertDominio] = useState(true);
  const [gestoriaCertTransf, setGestoriaCertTransf] = useState(true);
  const [gestoriaMatriculacion, setGestoriaMatriculacion] = useState(false);
  const [gestoriaTransfDominio, setGestoriaTransfDominio] = useState(false);
  const [gestoriaObservaciones, setGestoriaObservaciones] = useState('');

  // 5. Ubicación, Coordenadas y Orientación Magnética
  const [locationName, setLocationName] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [lat, setLat] = useState<number>(-34.6037);
  const [lng, setLng] = useState<number>(-58.3816);
  const [magneticOrientation, setMagneticOrientation] = useState<string>('050° / 230°');
  const [elevationMsl, setElevationMsl] = useState<number>(25);
  const [referenceTemperatureC, setReferenceTemperatureC] = useState<number>(31.0);
  const [terrainLengthAvailableM, setTerrainLengthAvailableM] = useState<number>(1000);
  const [terrainWidthAvailableM, setTerrainWidthAvailableM] = useState<number>(100);

  // 6. Condiciones Regulatorias y Ambientales
  const [isFrontierZone, setIsFrontierZone] = useState(false);
  const [isAgroEventual, setIsAgroEventual] = useState(false);
  const [usoConformeSuelo, setUsoConformeSuelo] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialClient) {
      setCategory(initialClient.category || 'Pistas');
      setPistaSubtype(initialClient.pistaSubtype || 'LAD');
      setOwnershipType(initialClient.ownershipType || 'Razon Social');
      setSociedadType(initialClient.sociedadType || 'S.A.');

      setName(initialClient.name);
      setCuit(initialClient.cuit);
      setContactPerson(initialClient.contactPerson);
      setEmail(initialClient.email);
      setPhone(initialClient.phone);

      if (initialClient.titulares && initialClient.titulares.length > 0) {
        setTitulares(initialClient.titulares);
      }

      if (initialClient.aircraftRentalData) {
        setRentalClient(initialClient.aircraftRentalData.clientName || '');
        setRentalOwner(initialClient.aircraftRentalData.aircraftOwner || '');
        setRentalAircraftType(initialClient.aircraftRentalData.aircraftType || '');
        setRentalDestination(initialClient.aircraftRentalData.destinationOrUse || '');
        setRentalHoursOrKm(initialClient.aircraftRentalData.contractedHoursOrKm || '');
      }

      if (initialClient.gestoriaData) {
        setGestoriaApplicant(initialClient.gestoriaData.applicantName || initialClient.name);
        setGestoriaCertDominio(initialClient.gestoriaData.certificadoDominio);
        setGestoriaCertTransf(initialClient.gestoriaData.certificadoTransferencia);
        setGestoriaMatriculacion(initialClient.gestoriaData.matriculacion);
        setGestoriaTransfDominio(initialClient.gestoriaData.transferenciaDominio);
        setGestoriaObservaciones(initialClient.gestoriaData.observaciones || '');
      }

      setLocationName(initialClient.locationName);
      setProvince(initialClient.province);
      setLat(initialClient.coordinates.lat);
      setLng(initialClient.coordinates.lng);
      setMagneticOrientation(
        initialClient.magneticOrientation ? String(initialClient.magneticOrientation) : '050° / 230°'
      );
      setElevationMsl(initialClient.elevationMsl);
      setReferenceTemperatureC(initialClient.referenceTemperatureC || 31.0);
      setTerrainLengthAvailableM(initialClient.terrainLengthAvailableM || 1000);
      setTerrainWidthAvailableM(initialClient.terrainWidthAvailableM || 100);
      setNotes(initialClient.notes || '');
      setIsFrontierZone(Boolean(initialClient.isFrontierZone));
      setIsAgroEventual(
        Boolean(initialClient.isAgroEventual) ||
          initialClient.pistaSubtype === 'aerodromo privado para uso agroaereo'
      );
      setUsoConformeSuelo(
        initialClient.usoConformeSuelo !== undefined ? initialClient.usoConformeSuelo : true
      );
    } else {
      // Valores por defecto para nuevo expediente
      setCategory('Pistas');
      setPistaSubtype('LAD');
      setOwnershipType('Razon Social');
      setSociedadType('S.A.');

      setName('');
      setCuit('');
      setContactPerson('');
      setEmail('');
      setPhone('');

      setTitulares([
        { id: 'tit-1', nombre: '', dniCuit: '', telefono: '', email: '', porcentajeParticipacion: '50%' },
        { id: 'tit-2', nombre: '', dniCuit: '', telefono: '', email: '', porcentajeParticipacion: '50%' }
      ]);

      setRentalClient('');
      setRentalOwner('');
      setRentalAircraftType('');
      setRentalDestination('');
      setRentalHoursOrKm('');

      setGestoriaApplicant('');
      setGestoriaCertDominio(true);
      setGestoriaCertTransf(true);
      setGestoriaMatriculacion(false);
      setGestoriaTransfDominio(false);
      setGestoriaObservaciones('');

      setLocationName('');
      setProvince('Buenos Aires');
      setLat(-34.6037);
      setLng(-58.3816);
      setMagneticOrientation('050° / 230°');
      setElevationMsl(25);
      setReferenceTemperatureC(31.0);
      setTerrainLengthAvailableM(1000);
      setTerrainWidthAvailableM(100);
      setNotes('');
      setIsFrontierZone(false);
      setIsAgroEventual(false);
      setUsoConformeSuelo(true);
    }
  }, [initialClient, isOpen]);

  if (!isOpen) return null;

  // Manejadores de lista dinámica de titulares
  const handleAddTitular = () => {
    setTitulares(prev => [
      ...prev,
      {
        id: `tit-${Date.now()}`,
        nombre: '',
        dniCuit: '',
        telefono: '',
        email: '',
        porcentajeParticipacion: ''
      }
    ]);
  };

  const handleRemoveTitular = (id: string) => {
    if (titulares.length <= 2) {
      alert('Para la opción "Titulares Varios" se requieren al menos 2 titulares.');
      return;
    }
    setTitulares(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTitular = (id: string, field: keyof TitularData, value: string) => {
    setTitulares(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determinar nombre del expediente según categoría
    let finalName = name.trim();
    if (category === 'Alquiler de Aeronave') {
      finalName = rentalClient.trim() || `Alquiler: ${rentalAircraftType.trim() || 'Aeronave'}`;
    } else if (category === 'Gestoria') {
      finalName = gestoriaApplicant.trim() || name.trim() || 'Gestoría Aeronáutica';
    } else if (ownershipType === 'Titulares Varios') {
      const validTitulares = titulares.filter(t => t.nombre.trim());
      if (validTitulares.length > 0) {
        finalName = validTitulares.map(t => t.nombre.trim()).join(' / ');
      }
    }

    if (!finalName) {
      alert('Por favor ingrese la denominación, razón social o titular del expediente.');
      return;
    }

    // Mapear compatibilidad ProjectType (LAD / LADH)
    const isHeli =
      pistaSubtype === 'LADH' ||
      pistaSubtype === 'Helipuerto Privado' ||
      pistaSubtype === 'helipuerto publico';
    const computedProjectType: ProjectType = isHeli ? 'LADH' : 'LAD';

    const aircraftRentalData: AircraftRentalData | undefined =
      category === 'Alquiler de Aeronave'
        ? {
            clientName: rentalClient.trim() || finalName,
            aircraftOwner: rentalOwner.trim(),
            aircraftType: rentalAircraftType.trim(),
            destinationOrUse: rentalDestination.trim(),
            contractedHoursOrKm: rentalHoursOrKm.trim()
          }
        : undefined;

    const gestoriaData: GestoriaData | undefined =
      category === 'Gestoria'
        ? {
            applicantName: gestoriaApplicant.trim() || finalName,
            certificadoDominio: gestoriaCertDominio,
            certificadoTransferencia: gestoriaCertTransf,
            matriculacion: gestoriaMatriculacion,
            transferenciaDominio: gestoriaTransfDominio,
            observaciones: gestoriaObservaciones.trim()
          }
        : undefined;

    const effectiveIsAgro =
      isAgroEventual || pistaSubtype === 'aerodromo privado para uso agroaereo';

    const updatedClient: Client = {
      id: initialClient?.id || `cli-${Date.now()}`,
      name: finalName,
      cuit: cuit.trim() || '20-00000000-0',
      contactPerson: contactPerson.trim() || finalName,
      email: email.trim(),
      phone: phone.trim(),
      projectType: computedProjectType,

      category,
      pistaSubtype,
      ownershipType,
      sociedadType,
      titulares: ownershipType === 'Titulares Varios' ? titulares : undefined,
      aircraftRentalData,
      gestoriaData,

      locationName: locationName.trim() || 'Emplazamiento Proyectado',
      province,
      coordinates: {
        lat: Number(lat) || -34.6037,
        lng: Number(lng) || -58.3816
      },
      magneticOrientation: magneticOrientation.trim() || '050° / 230°',
      elevationMsl: Number(elevationMsl) || 0,
      referenceTemperatureC: Number(referenceTemperatureC) || 30.0,
      terrainLengthAvailableM: Number(terrainLengthAvailableM) || (isHeli ? 35 : 1000),
      terrainWidthAvailableM: Number(terrainWidthAvailableM) || (isHeli ? 35 : 100),
      notes: notes.trim(),
      isFrontierZone,
      isAgroEventual: effectiveIsAgro,
      usoConformeSuelo,
      isArchived: initialClient?.isArchived || false,

      documents:
        initialClient?.documents && initialClient.documents.length > 0
          ? initialClient.documents
          : generateInitialChecklist({
              category,
              projectType: computedProjectType,
              pistaSubtype,
              ownershipType,
              sociedadType,
              isFrontierZone,
              isAgroEventual: effectiveIsAgro,
              usoConformeSuelo,
              gestoriaData
            }),

      createdAt: initialClient?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(updatedClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-[#1a365d] border border-blue-200">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f2942] font-heading">
                {initialClient ? 'Editar Expediente' : 'Nuevo Expediente de Cliente'}
              </h2>
              <p className="text-xs text-slate-500">
                Pistas, Alquiler de Aeronaves y Gestoría Registral ANAC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* 1. Selector Principal: Pistas, Alquiler de Aeronave, Gestoria */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Tipo de Expediente / Servicio
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setCategory('Pistas')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  category === 'Pistas'
                    ? 'bg-[#1a365d] text-white border-[#1a365d] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Plane className="h-4 w-4" />
                <span>Pistas</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('Alquiler de Aeronave')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  category === 'Alquiler de Aeronave'
                    ? 'bg-[#1a365d] text-white border-[#1a365d] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Navigation className="h-4 w-4" />
                <span>Alquiler de Aeronave</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('Gestoria')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  category === 'Gestoria'
                    ? 'bg-[#1a365d] text-white border-[#1a365d] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileCheck className="h-4 w-4" />
                <span>Gestoría</span>
              </button>
            </div>
          </div>

          {/* 2. Subselector para PISTAS */}
          {category === 'Pistas' && (
            <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  Clasificación de Pista o Helipuerto:
                </span>
                <span className="text-[11px] font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {pistaSubtype}
                </span>
              </div>

              <select
                value={pistaSubtype}
                onChange={e => {
                  const val = e.target.value as PistaSubtype;
                  setPistaSubtype(val);
                  if (val === 'aerodromo privado para uso agroaereo') {
                    setIsAgroEventual(true);
                  }
                  if (val === 'LADH' || val === 'Helipuerto Privado' || val === 'helipuerto publico') {
                    setTerrainLengthAvailableM(35);
                    setTerrainWidthAvailableM(35);
                  } else {
                    setTerrainLengthAvailableM(1000);
                    setTerrainWidthAvailableM(100);
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer text-xs"
              >
                <option value="LAD">LAD (Lugar Apto Denunciado)</option>
                <option value="Aerodromo priv">Aeródromo Privado</option>
                <option value="aerodromo publico">Aeródromo Público</option>
                <option value="aerodromo privado para uso agroaereo">
                  Aeródromo Privado para Uso Agroaéreo (Campo Eventual)
                </option>
                <option value="LADH">LADH (Lugar Apto Denunciado para Helicópteros)</option>
                <option value="Helipuerto Privado">Helipuerto Privado</option>
                <option value="helipuerto publico">Helipuerto Público</option>
              </select>

              {/* Checkboxes de condiciones especiales */}
              <div className="pt-2 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAgroEventual}
                    onChange={e => setIsAgroEventual(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                  />
                  <span>
                    <strong>Campo Eventual</strong> (RAAC 137)
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={usoConformeSuelo}
                    onChange={e => setUsoConformeSuelo(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                  />
                  <span>
                    <strong>Uso Conforme del Suelo</strong>
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFrontierZone}
                    onChange={e => setIsFrontierZone(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                  />
                  <span>
                    <strong>Zona de Frontera</strong> (Ley 23.554)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* 3. Formulario específico para ALQUILER DE AERONAVE */}
          {category === 'Alquiler de Aeronave' && (
            <div className="p-4 bg-purple-50/40 border border-purple-200 rounded-xl space-y-3">
              <div className="font-bold text-[#0f2942] text-xs flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-purple-700" />
                <span>Datos del Alquiler y Operación de Aeronave</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Cliente / Arrendatario *
                  </label>
                  <input
                    type="text"
                    required
                    value={rentalClient}
                    onChange={e => {
                      setRentalClient(e.target.value);
                      if (!name) setName(e.target.value);
                    }}
                    placeholder="Ej. Cabaña Los Robles / Agro Servicios"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Titular de la Aeronave (Propietario) *
                  </label>
                  <input
                    type="text"
                    required
                    value={rentalOwner}
                    onChange={e => setRentalOwner(e.target.value)}
                    placeholder="Ej. AeroTaxi Litoral S.A. / Juan Pérez"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tipo de Aeronave & Matrícula *
                  </label>
                  <input
                    type="text"
                    required
                    value={rentalAircraftType}
                    onChange={e => setRentalAircraftType(e.target.value)}
                    placeholder="Ej. Cessna 182T Skylane (LV-GHI) / R44"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Destino / Uso *</label>
                  <input
                    type="text"
                    required
                    value={rentalDestination}
                    onChange={e => setRentalDestination(e.target.value)}
                    placeholder="Ej. Traslado de personal técnico / Relevamiento aéreo"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-600 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Hs / Km Contratado *
                  </label>
                  <input
                    type="text"
                    required
                    value={rentalHoursOrKm}
                    onChange={e => setRentalHoursOrKm(e.target.value)}
                    placeholder="Ej. 25 Horas de Vuelo / 1.500 Km de ruta"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-600 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Formulario específico para GESTORÍA */}
          {category === 'Gestoria' && (
            <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-3">
              <div className="font-bold text-[#0f2942] text-xs flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-emerald-700" />
                <span>Gestoría Aeronáutica ante Registro Nacional de Aeronaves (RNA)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre del Solicitante / Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={gestoriaApplicant}
                  onChange={e => {
                    setGestoriaApplicant(e.target.value);
                    if (!name) setName(e.target.value);
                  }}
                  placeholder="Ej. Aero Club Paraná / Martín Rodríguez"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Trámites Solicitados (Checklist):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gestoriaCertDominio}
                      onChange={e => setGestoriaCertDominio(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                    />
                    <span>Certificado de dominio</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gestoriaCertTransf}
                      onChange={e => setGestoriaCertTransf(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                    />
                    <span>Certificado de transferencia</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gestoriaMatriculacion}
                      onChange={e => setGestoriaMatriculacion(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                    />
                    <span>Matriculación / Rematriculación</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gestoriaTransfDominio}
                      onChange={e => setGestoriaTransfDominio(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                    />
                    <span>Transferencia de dominio</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Observaciones de la Gestión
                </label>
                <input
                  type="text"
                  value={gestoriaObservaciones}
                  onChange={e => setGestoriaObservaciones(e.target.value)}
                  placeholder="Detalles de matrícula previa, escribano interviniente, número de trámite..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* 5. Selector de Personería / Titularidad */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Personería & Titularidad del Inmueble / Solicitante
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => setOwnershipType('Razon Social')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  ownershipType === 'Razon Social'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Razón Social</span>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipType('Titular Unico')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  ownershipType === 'Titular Unico'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Titular Único</span>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipType('Titulares Varios')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  ownershipType === 'Titulares Varios'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Titulares Varios</span>
              </button>
            </div>

            {/* CASO A: RAZÓN SOCIAL (Sociedad Anónima, SRL, Cooperativas, etc.) */}
            {ownershipType === 'Razon Social' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Tipo de Sociedad *
                    </label>
                    <select
                      value={sociedadType}
                      onChange={e => setSociedadType(e.target.value as SociedadType)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                    >
                      <option value="S.A.">S.A. (Sociedad Anónima)</option>
                      <option value="S.R.L.">S.R.L. (Resp. Limitada)</option>
                      <option value="Cooperativa">Cooperativa (INAES)</option>
                      <option value="S.A.S.">S.A.S. (Acciones Simplificadas)</option>
                      <option value="Fideicomiso">Fideicomiso (Inmobiliario / Agropecuario)</option>
                      <option value="Asociación Civil / Aeroclub">
                        Asociación Civil / Aeroclub
                      </option>
                      <option value="Sociedad de Hecho / Consorcio">
                        Sociedad de Hecho / Consorcio
                      </option>
                      <option value="Otra">Otra Persona Jurídica</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">
                      Razón Social Completa *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={`Ej. AgroAérea Pergamino ${sociedadType}`}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      CUIT de la Sociedad *
                    </label>
                    <input
                      type="text"
                      value={cuit}
                      onChange={e => setCuit(e.target.value)}
                      placeholder="30-71234567-9"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Representante Legal / Presidente / Gerente *
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="Nombre y cargo del apoderado o presidente"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-blue-800 bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                  <ShieldCheck className="h-3.5 w-3.5 inline mr-1 text-blue-700" />
                  <strong>Documentación societaria requerida ({sociedadType}):</strong> Estatuto /
                  Contrato Social inscripto, Acta de designación de autoridades vigentes y
                  Autorización expresa del Directorio, Gerencia o Consejo de Administración.
                </div>
              </div>
            )}

            {/* CASO B: TITULAR ÚNICO */}
            {ownershipType === 'Titular Unico' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Nombre y Apellido del Titular *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ej. Juan Carlos Rossi"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      DNI / CUIT / CUIL *
                    </label>
                    <input
                      type="text"
                      value={cuit}
                      onChange={e => setCuit(e.target.value)}
                      placeholder="20-25894123-4 o DNI 25.894.123"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CASO C: TITULARES VARIOS (Condominio con múltiples titulares) */}
            {ownershipType === 'Titulares Varios' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">
                    Nómina de Cotitulares / Condóminos ({titulares.length}):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddTitular}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-white border border-blue-300 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Agregar Titular</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {titulares.map((tit, index) => (
                    <div
                      key={tit.id}
                      className="bg-white border border-slate-200 p-2.5 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-1 text-center font-mono font-bold text-slate-400 text-xs">
                        #{index + 1}
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          required
                          value={tit.nombre}
                          onChange={e => handleUpdateTitular(tit.id, 'nombre', e.target.value)}
                          placeholder="Nombre y Apellido"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={tit.dniCuit}
                          onChange={e => handleUpdateTitular(tit.id, 'dniCuit', e.target.value)}
                          placeholder="DNI / CUIT"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={tit.porcentajeParticipacion || ''}
                          onChange={e =>
                            handleUpdateTitular(tit.id, 'porcentajeParticipacion', e.target.value)
                          }
                          placeholder="% Parte (ej. 50%)"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveTitular(tit.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                          title="Quitar titular"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 inline mr-1 text-blue-700" />
                  Se incorporará automáticamente el requerimiento notarial de{' '}
                  <strong>Autorización Mancomunada / Poder entre Condóminos</strong>.
                </div>
              </div>
            )}
          </div>

          {/* 6. Datos de Contacto Generales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contacto@empresa.com.ar"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Teléfono de Contacto</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+54 9 343 611-8305"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>

          {/* 7. Ubicación, Coordenadas y Orientación Magnética (Para Pistas y Gestoría) */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-blue-700" />
              <span>Emplazamiento, Coordenadas y Orientación Magnética</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Localidad / Nombre del Predio
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="Ej. Pergamino / Campo El Trébol"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Provincia</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                >
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Salta">Salta</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
            </div>

            {/* Coordenadas WGS-84 y Orientación Magnética */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Latitud WGS-84 (Dec.)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={e => setLat(parseFloat(e.target.value))}
                  placeholder="-34.6037"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Longitud WGS-84 (Dec.)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={e => setLng(parseFloat(e.target.value))}
                  placeholder="-58.3816"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Orientación Magnética (QFU / Rumbo)
                </label>
                <input
                  type="text"
                  value={magneticOrientation}
                  onChange={e => setMagneticOrientation(e.target.value)}
                  placeholder="Ej. 050° / 230° (QFU 05/23)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>
            </div>

            {category === 'Pistas' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Elevación (m MSL)</label>
                  <input
                    type="number"
                    value={elevationMsl}
                    onChange={e => setElevationMsl(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Temp. Ref. (°C)</label>
                  <input
                    type="number"
                    value={referenceTemperatureC}
                    onChange={e => setReferenceTemperatureC(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Largo Disp. (m)</label>
                  <input
                    type="number"
                    value={terrainLengthAvailableM}
                    onChange={e => setTerrainLengthAvailableM(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ancho Disp. (m)</label>
                  <input
                    type="number"
                    value={terrainWidthAvailableM}
                    onChange={e => setTerrainWidthAvailableM(parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observaciones generales */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Observaciones del Expediente
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anotaciones técnicas, cliente pericial, fecha estimada de presentación..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs text-xs"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-[#1a365d] hover:bg-[#0f2942] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Expediente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

