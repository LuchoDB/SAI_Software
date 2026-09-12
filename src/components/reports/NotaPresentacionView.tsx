import React, { useState, useMemo } from 'react';
import { Printer, Copy, Check, Edit3, RotateCcw, Send } from 'lucide-react';
import saiLogoEmblem from '../../assets/sai_logo_emblem.png';
import { Client } from '../../types/client';

interface NotaPresentacionViewProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export const NotaPresentacionView: React.FC<NotaPresentacionViewProps> = ({
  clients,
  selectedClient,
  onSelectClient
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState<string | null>(null);

  // Fecha formal en castellano
  const currentDateFormatted = useMemo(() => {
    const today = new Date();
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ];
    return `${today.getDate()} de ${meses[today.getMonth()]} de ${today.getFullYear()}`;
  }, []);

  // Generador dinámico del texto formal de la nota
  const generatedText = useMemo(() => {
    if (!selectedClient) return '';

    const c = selectedClient;
    const ownership = c.ownershipType || 'Razon Social';
    const socType = c.sociedadType || 'S.A.';
    const isAgro =
      Boolean(c.isAgroEventual) || c.pistaSubtype === 'aerodromo privado para uso agroaereo';
    const isGestoria = c.category === 'Gestoria';
    const isRental = c.category === 'Alquiler de Aeronave';

    // 1. Organismo Destinatario
    let organoDestinatario: string;
    if (isAgro) {
      organoDestinatario = `A la Administración Nacional de Aviación Civil (ANAC)
Dirección Nacional de Seguridad Operacional (DNSO)
Subparte E - RAAC 137 (Operaciones y Campos Eventuales Agroaéreos)
Balcarce 290, Ciudad Autónoma de Buenos Aires`;
    } else if (isGestoria) {
      organoDestinatario = `A la Administración Nacional de Aviación Civil (ANAC)
Dirección Nacional de Seguridad Operacional / Registro Nacional de Aeronaves (RNA)
Balcarce 290, Ciudad Autónoma de Buenos Aires`;
    } else if (isRental) {
      organoDestinatario = `A la Administración Nacional de Aviación Civil (ANAC)
Dirección de Operaciones Aéreas / Habilitaciones de Vuelo
Balcarce 290, Ciudad Autónoma de Buenos Aires`;
    } else {
      organoDestinatario = `A la Administración Nacional de Aviación Civil (ANAC)
Dirección General de Infraestructura y Servicios Aeroportuarios (DGIySA)
Dirección de Aeródromos / Casillero Aeronáutico Digital (CAD)
Balcarce 290, Ciudad Autónoma de Buenos Aires`;
    }

    // 2. Encabezado de Sujeto (Concordancia gramatical: El que suscribe / Los que suscriben / La firma)
    let encabezadoSujeto: string;
    let petitorioPlural: string;

    if (ownership === 'Razon Social') {
      const representante = c.contactPerson || 'Representante Legal';
      encabezadoSujeto = `La firma ${c.name}, CUIT Nº ${c.cuit}, legalmente constituida como ${socType}, con domicilio en la localidad de ${c.locationName}, Provincia de ${c.province}, representada en este acto por su representante legal y/o presidente ${representante}, acreditando personería legal y facultades vigentes mediante los instrumentos notariales adjuntos, respetuosamente se presenta ante esa autoridad aeronáutica nacional y expone:`;
      petitorioPlural = 'la firma peticiona y solicita a esa autoridad';
    } else if (ownership === 'Titulares Varios') {
      const listaTitulares =
        c.titulares && c.titulares.length > 0
          ? c.titulares.map(t => `${t.nombre} (DNI/CUIT Nº ${t.dniCuit})`).join(', ')
          : c.name;
      const calidadSujeto = isGestoria
        ? 'de la aeronave individualizada en la presente actuación'
        : 'del predio / lugar de emplazamiento individualizado en la presente actuación';
      const acreditacion = isGestoria
        ? 'acreditando derecho sobre la aeronave mediante título de propiedad y autorización mancomunada notarial adjunta'
        : 'acreditando derecho sobre el predio mediante título dominial y autorización mancomunada notarial adjunta';
      encabezadoSujeto = `Los que suscriben, ${listaTitulares}, en nuestro carácter de cotitulares y condóminos ${calidadSujeto}, con domicilio constituido en ${c.locationName}, Provincia de ${c.province}, ${acreditacion}, nos dirigimos respetuosamente a esa autoridad aeronáutica nacional y manifestamos:`;
      petitorioPlural = 'los presentantes solicitamos respetuosamente a esa autoridad';
    } else {
      // Titular Único
      const calidadSujeto = isRental
        ? 'locatario y titular del contrato de alquiler de la aeronave'
        : isGestoria
          ? 'titular de la aeronave / solicitante'
          : 'titular de la pista / solicitante';
      encabezadoSujeto = `El que suscribe, ${c.name}, DNI / CUIT Nº ${c.cuit}, con domicilio real y legal en ${c.locationName}, Provincia de ${c.province}, en mi carácter de ${calidadSujeto}, ante esa autoridad aeronáutica nacional me presento respetuosamente y manifiesto:`;
      petitorioPlural = 'el presentante solicita respetuosamente a esa autoridad';
    }

    // 3. Objeto de la presentación
    let objetoFormal: string;
    if (isAgro) {
      objetoFormal = `OBJETO: Denuncia formal de Campo Eventual para Operaciones Agroaéreas conforme a la RAAC Parte 137 Subparte E (Sección 137.41) en el predio denominado "${c.locationName}".`;
    } else if (isGestoria) {
      objetoFormal = `OBJETO: Solicitud de trámite registral de Gestoría Aeronáutica ante el Registro Nacional de Aeronaves para la aeronave individualizada a nombre de ${c.name}.`;
    } else if (isRental) {
      objetoFormal = `OBJETO: Notificación y registro de Contrato de Locación / Alquiler de Aeronave para operaciones de vuelo programadas.`;
    } else {
      const tipoPista = c.pistaSubtype || c.projectType;
      objetoFormal = `OBJETO: Solicitud formal de Registro y Habilitación de ${tipoPista} en los términos del Código Aeronáutico de la Nación (Ley 17.285) y normativa técnica aplicable.`;
    }

    // 4. Especificaciones Técnicas y Emplazamiento
    const orientacionMag = c.magneticOrientation || '050° / 230° (QFU 05/23)';
    const coordsStr = `Latitud: ${c.coordinates.lat.toFixed(5)}° S, Longitud: ${c.coordinates.lng.toFixed(5)}° W`;

    const seccionTecnica = isRental
      ? `I. DATOS DE LA OPERACIÓN Y AERONAVE LOCADA:
   • Cliente / Arrendatario: "${c.aircraftRentalData?.clientName || c.name}"
   • Titular de la Aeronave: ${c.aircraftRentalData?.aircraftOwner || 'Según Contrato'}
   • Aeronave y Matrícula: ${c.aircraftRentalData?.aircraftType || 'Aeronave designada'}
   • Destino / Uso operativo: ${c.aircraftRentalData?.destinationOrUse || c.locationName}
   • Horas / Kilómetros contratados: ${c.aircraftRentalData?.contractedHoursOrKm || 'Según contrato'}`
      : `I. DATOS DE EMPLAZAMIENTO Y CARACTERÍSTICAS TÉCNICAS:
   • Denominación propuesta del lugar: "${c.locationName || c.name}"
   • Ubicación territorial: ${c.locationName}, Provincia de ${c.province}
   • Coordenadas Geográficas (WGS-84): ${coordsStr}
   • Elevación sobre el nivel del mar: ${c.elevationMsl} metros MSL
   • Orientación Magnética / Designador de Pista: ${orientacionMag}
   • Dimensiones disponibles en predio: ${c.terrainLengthAvailableM || 1000} m de longitud x ${c.terrainWidthAvailableM || 100} m de franja
   • Conformidad territorial y ambiental: Acreditada mediante Certificado de Uso Conforme del Suelo municipal y Declaración Jurada Ambiental Ley 25.675.`;

    // 5. Listado de Documentación Acompañada
    const docsLines = c.documents.map((d, index) => {
      const obs = d.notes || d.observaciones ? ` (Ref: ${d.notes || d.observaciones})` : '';
      return `   ${index + 1}. [${d.id}] ${d.titulo || d.title} - ${d.organismo_dependencia || d.organismo}${obs}`;
    });

    return `LUGAR Y FECHA: Ciudad de ${c.locationName || 'Paraná'}, ${c.province}, ${currentDateFormatted}

SEÑOR DIRECTOR:
${organoDestinatario}

${objetoFormal}

DE NUESTRA MAYOR CONSIDERACIÓN:

${encabezadoSujeto}

${seccionTecnica}

II. NÓMINA DE DOCUMENTACIÓN INTEGRAL ADJUNTA:
Que a fin de dar cabal cumplimiento a las exigencias normativas vigentes, se acompaña en legal forma la siguiente documentación canónica:
${docsLines.join('\n')}

III. DOMICILIO CONSTITUIDO Y DATOS DE CONTACTO:
A todos los efectos derivados de la presente tramitación y eventuales notificaciones electrónicas o presenciales, se constituye domicilio en:
   • Domicilio procesal: ${c.locationName}, Provincia de ${c.province}
   • Correo electrónico oficial de contacto: ${c.email || 'No declarado'}
   • Teléfono de contacto / emergencias: ${c.phone || 'No declarado'}

IV. PETITORIO:
Por todo lo expuesto, ${petitorioPlural}:
   1. Se tenga por presentada la solicitud en legal tiempo y debida forma.
   2. Se tenga por acompañada y cotejada la totalidad de la documentación técnica, jurídica, notarial y ambiental que se adjunta.
   3. Oportunamente y previo dictamen de las áreas competentes, se sirva emitir el acto resolutivo correspondiente.

Sin otro particular, saludamos a Ud. con nuestra más atenta y distinguida consideración.




___________________________________________
FIRMA Y ACLARACIÓN DEL RESPONSABLE
${c.contactPerson || c.name}
${c.ownershipType === 'Razon Social' ? `${c.sociedadType} - ${c.name}` : `DNI / CUIT: ${c.cuit}`}
`;
  }, [selectedClient, currentDateFormatted]);

  const displayedText = customText !== null ? customText : generatedText;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetText = () => {
    setCustomText(null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barra de Controles y Selector de Expediente */}
      <div className="no-print bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold font-heading">Nota de Presentación Normativa</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generador oficial de nota formal con concordancia gramatical (el / los / la firma) ante
            ANAC / DNSO
          </p>
        </div>

        {/* Selector de Cliente / Expediente */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs text-slate-400 font-medium">Expediente:</label>
          <select
            value={selectedClient?.id || ''}
            onChange={e => {
              const found = clients.find(cl => cl.id === e.target.value);
              if (found) {
                onSelectClient(found);
                setCustomText(null);
                setIsEditing(false);
              }
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            {clients.map(cl => (
              <option key={cl.id} value={cl.id}>
                {cl.name} ({cl.category || 'Pistas'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barra de Acciones: Copiar, Imprimir, Editar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs ${
              copied ? 'bg-emerald-600 text-white' : 'bg-[#1a365d] hover:bg-[#0f2942] text-white'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Nota'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition cursor-pointer shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Imprimir / Guardar PDF</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition cursor-pointer shadow-2xs"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>{isEditing ? 'Vista Previa' : 'Personalizar Texto'}</span>
          </button>
        </div>

        {customText !== null && (
          <button
            onClick={handleResetText}
            className="flex items-center gap-1 text-slate-500 hover:text-red-700 transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Restablecer plantilla original</span>
          </button>
        )}
      </div>

      {/* Hoja Formal de la Nota de Presentación (A4 Ready) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto font-sans leading-normal border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Membrete Oficial Superior */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-11 flex items-center justify-center">
              <img
                src={saiLogoEmblem}
                alt="Logo SAI Consult"
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 font-heading">
                SAI CONSULT
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Servicios Aeronáuticos Integrales • Paraná, Entre Ríos
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 font-mono">
            <div>Formulario Oficial ANAC / DNSO</div>
            <div className="font-bold text-slate-800">
              EXPTE: {selectedClient?.id || 'SAI-2026'}
            </div>
          </div>
        </div>

        {/* Contenido de la Nota */}
        {isEditing ? (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Edición directa de la Nota de Presentación:
            </label>
            <textarea
              rows={26}
              value={displayedText}
              onChange={e => setCustomText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-serif text-[13px] text-slate-900 leading-relaxed select-text">
            {displayedText}
          </div>
        )}

        {/* Pie de Página Oficial SAI Consult */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>SAI Consult • Consultora de Ingeniería y Peritajes Aeronáuticos</span>
          <span>Contacto: +54 9 343 611-8305 • saiconsult@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
