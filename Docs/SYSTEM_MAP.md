# MAPA INTEGRAL DEL SISTEMA: SOFTWARE DE FACTIBILIDAD AERONÁUTICA (SAI CONSULT)
> **GUÍA DE ORIENTACIÓN OBLIGATORIA PARA AGENTES DE IA Y DESARROLLADORES**  
> *Ruta del archivo: `Docs/SYSTEM_MAP.md`*  
> *Propósito: Brindar una comprensión arquitectónica, normativa y operativa del 100% de la aplicación en una sola lectura sin necesidad de explorar el código archivo por archivo.*

---

## 1. Grafo de Arquitectura de la Aplicación

El sistema está estructurado bajo una arquitectura desacoplada y reactiva en TypeScript/React, modularizada en capas: Presentación UI (Cockpit & Ergonomía), Motores de Dominio Aeronáutico (Cálculos RAAC 153/154, OACI Anexo 14), Subsistema Multi-Agente (Diseño, Copywriting, Legal, Orquestador) y Capa de Persistencia Local.

```mermaid
graph TD
    subgraph UI_Presentation ["Capa de Presentación UI / Cockpit Workstation"]
        NAV["Navbar: Branding SAI, Reloj UTC/Local, Estado de Agentes, Backups"]
        SIDE["Sidebar: Navegación por Módulos"]
        CLI_LIST["ClientList: Grilla de Clientes, Búsqueda, Filtros y Métricas"]
        CLI_FOLD["ClientFolder: Expediente Integral por Cliente"]
        DOC_CHK["DocumentChecklist: Matriz Documental ANAC / ENACOM / Catastro"]
        WIND_VIEW["WindStudyView: Orientación QFU, Componentes y Usabilidad"]
        WIND_CHART["WindRoseChart: Rosa de los Vientos SVG Interactiva 16 Rumbos"]
        LAD_VIEW["LadStudyView: Factibilidad Técnica de Pistas (RAAC 153)"]
        LADH_VIEW["LadhStudyView: Factibilidad Técnica de Helipuertos (RAAC 154)"]
        TECH_DRAW["TechnicalDrawing: Esquemas Técnicos Acotados SVG (Pista / FATO / TLOF)"]
        PRINT_VIEW["PrintableDossier: Vista de Impresión Formal para Dictámenes SAI"]
    end

    subgraph Agents_Layer ["Arquitectura Multi-Agente Especializada"]
        AG_DESIGN["🎨 Agente de Diseño: Ergonomía visual, esquemas acotados y vistas técnicas"]
        AG_COPY["📐 Agente Copywriting & Info: Nomenclatura aeronáutica, resúmenes ejecutivos"]
        AG_LEGAL["⚖️ Agente Legal: Auditoría RAAC 153/154, Código Aeronáutico Ley 17.285, ENACOM"]
        AG_ORCH["🧠 Agente Orquestador: Validación cruzada de datos, semáforo de viabilidad y dictámenes"]
    end

    subgraph Engine_Layer ["Motores de Cálculo de Ingeniería Aeronáutica"]
        ENG_WIND["windEngine: Rumbo magnético, declinación WMM, QFU, Headwind/Crosswind, Factor Usabilidad OACI"]
        ENG_LAD["ladEngine: Pistas, corrección por elevación MSL, temperatura ISA, pendiente y SLO"]
        ENG_LADH["ladhEngine: Helipuertos, parámetro D, TLOF, FATO, Safety Area, cargas dinámicas 1.5x MTOW"]
    end

    subgraph Data_Persistence ["Persistencia y Bases de Datos de Referencia"]
        STORE["storageService: Persistencia LocalStorage reactiva, exportación/importación JSON"]
        DB_ACFT["aircraftDatabase: Aeronaves de diseño (C172, B200, Pawnee, PC-12, etc.)"]
        DB_HELI["helicopterDatabase: Helicópteros de diseño (R44, EC130, Bell 429, S-76, etc.)"]
        DB_REQS["regulatoryRequirements: Requisitos y matrices ANAC, ENACOM, Catastro y Ambiente"]
    end

    UI_Presentation --> Agents_Layer
    UI_Presentation --> Engine_Layer
    Engine_Layer --> Data_Persistence
    Agents_Layer --> Engine_Layer
    Agents_Layer --> Data_Persistence
    CLI_FOLD --> DOC_CHK
    CLI_FOLD --> WIND_VIEW
    CLI_FOLD --> LAD_VIEW
    CLI_FOLD --> LADH_VIEW
    CLI_FOLD --> PRINT_VIEW
```

---

## 2. Índice de Una Sola Línea por Archivo

- `README.md`: Portada del proyecto con advertencia superior obligatoria para redirigir a agentes de IA hacia este mapa.
- `.gitignore`: Configuración de exclusión para control de versiones Git (node_modules, dist, logs y temporales).
- `package.json`: Manifiesto de dependencias (React 19, Lucide-React, TypeScript, Vite, TailwindCSS).
- `vite.config.ts`: Configuración del empaquetador Vite con plugin de React y alias de rutas.
- `tsconfig.json`: Configuración de TypeScript con soporte JSX y tipado estricto.
- `tailwind.config.js`: Tokens de diseño aeronáutico (colores cockpit, navy, cyan avionics, slate técnicos).
- `index.html`: Punto de entrada HTML5 con tipografías Inter/Outfit y metaetiquetas de ingeniería (Tailwind v4 integrado vía `@tailwindcss/vite` en `vite.config.ts`).
- `Docs/SYSTEM_MAP.md`: Este archivo maestro; mapa integral de componentes, flujos e índice para agentes y humanos.
- `Docs/NORMATIVA_ANAC_ENACOM.md`: Compendio normativo detallado (RAAC 153, RAAC 154, Ley 17.285, requerimientos ENACOM).
- `Docs/CALCULOS_AERONAUTICOS.md`: Fórmulas matemáticas y aerodinámicas de corrección de pistas, vientos y helipuertos.
- `src/main.tsx`: Punto de montaje raíz de React en el DOM con manejo de errores.
- `src/App.tsx`: Orquestador de vistas principales, estados de navegación, notificaciones y llamadas a agentes.
- `src/index.css`: Estilos globales, variables de color de aviónica, utilidades de impresión (@media print) y scrollbars.
- `src/types/client.ts`: Interfaces TypeScript para Clientes, Expedientes, Contactos y Documentación regulatoria.
- `src/types/wind.ts`: Interfaces para rosas de vientos de 16 sectores, componentes de viento, rumbos y usabilidad OACI.
- `src/types/lad.ts`: Interfaces para estudios de aeródromos/LAD, aeronaves de diseño, distancias y SLO.
- `src/types/ladh.ts`: Interfaces para estudios de helipuertos/LADH, helicópteros de diseño, FATO, TLOF y cargas.
- `src/types/agents.ts`: Definición de agentes especializados, estados de auditoría, sugerencias y dictamen final.
- `src/data/aircraftDatabase.ts`: Catálogo de aeronaves de diseño comunes en Argentina con parámetros de pista y viento.
- `src/data/helicopterDatabase.ts`: Catálogo de helicópteros de diseño con dimensiones D, RD y pesos MTOW.
- `src/data/regulatoryRequirements.ts`: Lista maestra de requisitos documentales clasificados por organismo oficial.
- `src/data/sampleData.ts`: Semillas de demostración con 2 clientes reales de SAI Consult (LAD Agrícola/Ejecutivo y LADH Hospitalario).
- `src/services/storageService.ts`: Gestor de almacenamiento local con persistencia, carga inicial y backup/restore JSON.
- `src/services/windEngine.ts`: Algoritmos trigonométricos de viento de frente, cola y cruzado, y usabilidad histórica.
- `src/services/ladEngine.ts`: Fórmulas de corrección de longitud de pista según RAAC 153 por elevación, temperatura y pendiente.
- `src/services/ladhEngine.ts`: Fórmulas de dimensionamiento de helipuertos FATO/TLOF/Safety Area y cargas según RAAC 154.
- `src/services/agentsEngine.ts`: Lógica de evaluación y dictámenes de los 4 agentes (Diseño, Copywriting, Legal, Orquestador).
- `src/components/layout/Navbar.tsx`: Barra superior con logotipo institucional SAI, hora dual UTC/Local, estado de agentes y backup.
- `src/components/layout/Sidebar.tsx`: Menú lateral colapsable con accesos a Clientes, Vientos, LAD, LADH, Auditoría y Dossier.
- `src/components/clients/ClientList.tsx`: Tablero de clientes con tarjetas de resumen, estados de expediente y botón de nuevo cliente.
- `src/components/clients/ClientModal.tsx`: Modal interactivo para crear o modificar clientes con validación de datos.
- `src/components/clients/ClientFolder.tsx`: Carpeta informativa de cliente con pestañas (Resumen, Documentación, Estudios, Dictamen).
- `src/components/documentation/DocumentChecklist.tsx`: Grilla de seguimiento documental con filtros por organismo y cambio de estado ágil.
- `src/components/documentation/DocumentItem.tsx`: Ficha individual de documento con fecha de presentación, notas y alertas.
- `src/components/wind/WindStudyView.tsx`: Formulario de estudio de vientos, declinación, QFU y resumen de usabilidad OACI.
- `src/components/wind/WindRoseChart.tsx`: Gráfico vectorial interactivo (SVG) de la Rosa de los Vientos con pista y vectores.
- `src/components/wind/WindMatrixTable.tsx`: Matriz tabular de frecuencias de vientos por cuadrante y velocidad en nudos.
- `src/components/feasibility/LadStudyView.tsx`: Entorno de cálculo y evaluación de factibilidad para pistas de aterrizaje LAD.
- `src/components/feasibility/LadhStudyView.tsx`: Entorno de cálculo y evaluación de factibilidad para helipuertos LADH.
- `src/components/feasibility/TechnicalDrawing.tsx`: Diagrama técnico acotado SVG de la infraestructura aeronáutica proyectada.
- `src/components/reports/PrintableDossier.tsx`: Expediente técnico imprimible formal con membrete de SAI Consult y firmas.

---

## 3. Flujos Clave de Tiempo de Ejecución (Runtime Flows)

### Flujo 1: Alta y Configuración de Expediente de Cliente
1. El usuario hace clic en "Nuevo Cliente" en `ClientList.tsx`.
2. Se abre `ClientModal.tsx` solicitando datos del titular, coordenadas WGS84, elevación MSL y tipo de emplazamiento proyectado.
3. Al guardar, `storageService.ts` persiste el cliente e inicializa automáticamente su matriz documental con requisitos ANAC, ENACOM, Catastro y Ambiente desde `regulatoryRequirements.ts`.
4. El usuario accede a la **Carpeta Informativa (`ClientFolder.tsx`)** donde puede actualizar el estado de cada documento (Pendiente -> En trámite -> Presentado / Aprobado).

### Flujo 2: Cálculo de Orientación Magnética y Viento Cruzado
1. En `WindStudyView.tsx`, el usuario ingresa o ajusta el Rumbo Geográfico Verdadero y la Declinación Magnética local.
2. `windEngine.ts` calcula el Rumbo Magnético y la designación de cabeceras de pista (**QFU** redondeado a la decena, ej: $042^\circ \to$ Cabecera 04 / 22).
3. Se evalúa la matriz de frecuencias de viento (16 rumbos x rangos de nudos).
4. Para cada sector, se descomponen trigonométricamente las componentes de viento cruzado ($V_{cross} = V \cdot \sin|\theta_{viento} - \theta_{pista}|$) y viento en cara/cola.
5. Se calcula el **Factor de Usabilidad OACI (%)** frente al viento cruzado admisible de la aeronave de diseño (10 kt, 13 kt o 20 kt).
6. Si la usabilidad es $\ge 95\%$, el sistema y el Agente Legal marcan cumplimiento normativo. `WindRoseChart.tsx` renderiza la rosa vectorial dinámica.

### Flujo 3: Estudio de Factibilidad Técnica LAD (Pistas)
1. En `LadStudyView.tsx`, se selecciona la aeronave de diseño de `aircraftDatabase.ts` o se personalizan sus especificaciones.
2. `ladEngine.ts` aplica las correcciones reglamentarias de la **RAAC 153**:
   - Corrección por elevación ($+7\%$ cada 300 m s.n.m.).
   - Corrección por temperatura ($+1\%$ por cada $1^\circ\text{C}$ sobre atmósfera estándar ISA).
   - Corrección por pendiente longitudinal ($+10\%$ por cada $1\%$ de pendiente efectiva).
3. Se contrastan las dimensiones mínimas requeridas con el terreno disponible del cliente.
4. Se verifica el despeje de la Franja de Pista y Superficies Limitadoras de Obstáculos (SLO).

### Flujo 4: Estudio de Factibilidad Técnica LADH (Helipuertos)
1. En `LadhStudyView.tsx`, se selecciona el helicóptero de diseño de `helicopterDatabase.ts` obteniendo su parámetro **D** (dimensión máxima con rotor girando) y MTOW.
2. `ladhEngine.ts` aplica los coeficientes de la **RAAC 154**:
   - $\text{TLOF} \ge 0.83D$ o $1.0D$ (según clase de performance).
   - $\text{FATO} \ge 1.5D$ en superficie.
   - Área de Seguridad perimetral $\ge 0.25D$ (mínimo 3 m).
   - Carga dinámica estructural $\ge 1.5 \times \text{MTOW}$.
3. Se proyectan las trayectorias de aproximación/despegue (pendientes del $8\%$ o $4.5\%$).

### Flujo 5: Validación Cruzada del Agente Orquestador y Emisión de Dossier
1. El usuario ejecuta la auditoría del Orquestador desde la barra de agentes o el expediente.
2. `agentsEngine.ts` consulta el estado de la documentación (Agente Legal), la consistencia de los textos (Agente Copywriting), la viabilidad geométrica (Agente Diseño) y los cálculos de vientos y pista.
3. El Orquestador emite un dictamen: **FAVORABLE**, **FAVORABLE CONDICIONADO** o **NO FACTIBLE**, con lista priorizada de acciones pendientes.
4. El usuario puede abrir `PrintableDossier.tsx` y generar un informe técnico profesional en PDF con membrete institucional de **SAI Consult**.

---

## 4. Inventario de Artefactos Generados

1. **Expedientes Persistidos en Almacenamiento Local (`localStorage`)**:
   - Clave `sai_consult_clients`: Colección completa de clientes, estados de documentación y estudios vinculados.
2. **Archivos de Respaldo JSON (`.json`)**:
   - Exportables desde la barra de navegación para salvaguarda de datos entre puestos de trabajo o reinstalaciones.
3. **Dossiers Técnicos Imprimibles / PDF**:
   - Vistas optimizadas para impresión en hoja A4 con membrete formal de SAI Consult, marcas de agua aeronáuticas, tablas vectorizadas y firmas de peritaje técnico.

---

## 5. Directrices de Trabajo para Agentes de IA

Si eres un agente de Inteligencia Artificial que necesita agregar o modificar funcionalidades:
1. **Rigor Normativo**: No alterar los coeficientes de la RAAC 153/154 ni las exigencias de OACI Anexo 14 (usabilidad $\ge 95\%$, FATO $\ge 1.5D$, etc.) sin respaldo en los documentos de `Docs/`.
2. **Consistencia Visual**: Mantener la estética aeronáutica de precisión definida en los tokens de diseño (colores navy, slate y acentos cian/ámbar).
3. **Persistencia Reactiva**: Cualquier modificación en clientes o estudios debe propagarse a través de `storageService.ts` para garantizar la persistencia local.
4. **Mantenimiento de este Mapa**: Si agregas, renombras o eliminas un archivo en el proyecto, **es mandatorio actualizar su entrada de una sola línea en la Sección 2 de este archivo (`Docs/SYSTEM_MAP.md`)**.
