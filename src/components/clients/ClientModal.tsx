import React, { useState, useEffect } from 'react';
import { X, Save, Plane, Disc, Building } from 'lucide-react';
import { Client, ProjectType } from '../../types/client';
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
  const [name, setName] = useState('');
  const [cuit, setCuit] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('LAD');
  const [locationName, setLocationName] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [lat, setLat] = useState<number>(-34.6037);
  const [lng, setLng] = useState<number>(-58.3816);
  const [elevationMsl, setElevationMsl] = useState<number>(25);
  const [referenceTemperatureC, setReferenceTemperatureC] = useState<number>(31.0);
  const [terrainLengthAvailableM, setTerrainLengthAvailableM] = useState<number>(900);
  const [terrainWidthAvailableM, setTerrainWidthAvailableM] = useState<number>(100);
  const [notes, setNotes] = useState('');
  const [isFrontierZone, setIsFrontierZone] = useState(false);
  const [isAgroEventual, setIsAgroEventual] = useState(false);

  useEffect(() => {
    if (initialClient) {
      setName(initialClient.name);
      setCuit(initialClient.cuit);
      setContactPerson(initialClient.contactPerson);
      setEmail(initialClient.email);
      setPhone(initialClient.phone);
      setProjectType(initialClient.projectType);
      setLocationName(initialClient.locationName);
      setProvince(initialClient.province);
      setLat(initialClient.coordinates.lat);
      setLng(initialClient.coordinates.lng);
      setElevationMsl(initialClient.elevationMsl);
      setReferenceTemperatureC(initialClient.referenceTemperatureC || 31.0);
      setTerrainLengthAvailableM(initialClient.terrainLengthAvailableM || 900);
      setTerrainWidthAvailableM(initialClient.terrainWidthAvailableM || 100);
      setNotes(initialClient.notes || '');
      setIsFrontierZone(Boolean(initialClient.isFrontierZone));
      setIsAgroEventual(Boolean(initialClient.isAgroEventual));
    } else {
      setName('');
      setCuit('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setProjectType('LAD');
      setLocationName('');
      setProvince('Buenos Aires');
      setLat(-34.6037);
      setLng(-58.3816);
      setElevationMsl(25);
      setReferenceTemperatureC(31.0);
      setTerrainLengthAvailableM(1000);
      setTerrainWidthAvailableM(100);
      setNotes('');
      setIsFrontierZone(false);
      setIsAgroEventual(false);
    }
  }, [initialClient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingrese el nombre del titular o razón social.');
      return;
    }

    const updatedClient: Client = {
      id: initialClient?.id || `cli-${Date.now()}`,
      name: name.trim(),
      cuit: cuit.trim() || '20-00000000-0',
      contactPerson: contactPerson.trim() || name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      projectType,
      locationName: locationName.trim() || 'Emplazamiento Proyectado',
      province,
      coordinates: {
        lat: Number(lat) || -34.6037,
        lng: Number(lng) || -58.3816
      },
      elevationMsl: Number(elevationMsl) || 0,
      referenceTemperatureC: Number(referenceTemperatureC) || 30.0,
      terrainLengthAvailableM: Number(terrainLengthAvailableM) || 500,
      terrainWidthAvailableM: Number(terrainWidthAvailableM) || 50,
      notes: notes.trim(),
      isFrontierZone,
      isAgroEventual,
      documents:
        initialClient?.documents && initialClient.documents.length > 0
          ? initialClient.documents
          : generateInitialChecklist({ projectType, isFrontierZone, isAgroEventual }),
      createdAt: initialClient?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(updatedClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f2942] font-heading">
                {initialClient ? 'Editar Expediente de Cliente' : 'Nuevo Expediente de Cliente'}
              </h2>
              <p className="text-xs text-slate-500">
                Alta de carpeta técnica y documentación regulatoria LAD/LADH
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Tipo de Proyecto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de Proyecto Aeronáutico
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setProjectType('LAD');
                  if (!initialClient) {
                    setTerrainLengthAvailableM(1000);
                    setTerrainWidthAvailableM(100);
                  }
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
                  projectType === 'LAD'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Plane className="h-4 w-4" />
                <span>LAD (Pista)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProjectType('LADH');
                  if (!initialClient) {
                    setTerrainLengthAvailableM(35);
                    setTerrainWidthAvailableM(35);
                  }
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
                  projectType === 'LADH'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Disc className="h-4 w-4" />
                <span>LADH (Helipuerto)</span>
              </button>

              <button
                type="button"
                onClick={() => setProjectType('MIXED')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
                  projectType === 'MIXED'
                    ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Mixto (Pista + Heli)</span>
              </button>
            </div>

            {/* Condiciones Regulatorias Especiales (Frontera y Agro) */}
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="font-semibold text-slate-700 text-xs">
                Condiciones Regulatorias Especiales
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={isFrontierZone}
                  onChange={e => setIsFrontierZone(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <span>
                  <strong>Zona de Frontera:</strong> Emplazado en zona de seguridad de frontera
                  (Aplica Ley 23.554 y Dec-Ley 15.385/44).
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={isAgroEventual}
                  onChange={e => setIsAgroEventual(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <span>
                  <strong>Campo Eventual Agroaéreo:</strong> Denuncia ante DNSO bajo RAAC 137
                  Subparte E-137.41 (reemplaza al registro LAD).
                </span>
              </label>
            </div>
          </div>

          {/* Datos del Titular */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Razón Social / Titular *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. AgroAérea Pergamino S.A."
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                CUIT / Identificación Tributaria
              </label>
              <input
                type="text"
                value={cuit}
                onChange={e => setCuit(e.target.value)}
                placeholder="30-71234567-9"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Ubicación y Coordenadas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Localidad / Emplazamiento
              </label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="Ej. Pergamino / Campo El Trébol"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Provincia</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
              >
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Entre Ríos">Entre Ríos</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Salta">Salta</option>
                <option value="Neuquén">Neuquén</option>
                <option value="Río Negro">Río Negro</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
          </div>

          {/* Elevación y Temperatura */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Elevación MSL (metros)
              </label>
              <input
                type="number"
                value={elevationMsl}
                onChange={e => setElevationMsl(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Temp. Referencia (°C)</label>
              <input
                type="number"
                value={referenceTemperatureC}
                onChange={e => setReferenceTemperatureC(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Dimensiones Disponibles en Predio */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Largo Disponible (m)</label>
              <input
                type="number"
                value={terrainLengthAvailableM}
                onChange={e => setTerrainLengthAvailableM(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Ancho Disponible (m)</label>
              <input
                type="number"
                value={terrainWidthAvailableM}
                onChange={e => setTerrainWidthAvailableM(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-[#1a365d] hover:bg-[#0f2942] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition"
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
