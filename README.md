> [!IMPORTANT]
> **AVISO OBLIGATORIO PARA AGENTES DE INTELIGENCIA ARTIFICIAL (AI AGENTS)**:
> Si eres un modelo de lenguaje o agente de IA asistiendo en este proyecto, **NO explores el repositorio archivo por archivo**.
> Debes dirigirte de forma inmediata al documento maestro de mapeo ubicado en:
> 👉 **[`Docs/SYSTEM_MAP.md`](file:///c:/Users/Luciano/Desktop/Proyectos/SAI_Software/Docs/SYSTEM_MAP.md)**
> Allí encontrarás el grafo de arquitectura completo, el índice de una sola línea de cada archivo, los flujos clave de tiempo de ejecución y el inventario de artefactos generados para comprender el 100% del sistema en una sola lectura.

---

# SAI Consult - Software de Ingeniería Aeronáutica & Factibilidad Técnica
### Estudio Integral LAD / LADH, Orientación Magnética & Viento Cruzado y Gestión de Expedientes

Sistema de escritorio / localhost de uso profesional para la consultora aeronáutica **SAI Consult** (Servicios Aeronáuticos Integrales), diseñado para realizar con máxima precisión técnica y rigor normativo:

1. **Gestión de Expedientes y Carpetas Informativas de Clientes**: Seguimiento documental exhaustivo ante **ANAC**, **ENACOM**, Catastro y Medio Ambiente.
2. **Estudio Integral de Factibilidad Técnica LAD (Lugares de Aterrizaje / Pistas)** según **RAAC 153** y Código Aeronáutico Ley 17.285.
3. **Estudio Integral de Factibilidad Técnica LADH (Helipuertos)** según **RAAC 154** y OACI Anexo 14 Vol II.
4. **Estudio de Orientación Magnética y Viento Cruzado**: Cálculo vectorial de rumbos QFU, rosa de vientos interactiva de 16 rumbos y determinación del Factor de Usabilidad OACI ($\ge 95\%$).
5. **Arquitectura Multi-Agente Especializada**:
   - 🎨 Agente de Diseño (Ergonomía visual y esquemas acotados)
   - 📐 Agente de Arquitectura de la Información & Copywriting (Nomenclatura aeronáutica y resúmenes ejecutivos)
   - ⚖️ Agente Legal & Regulatorio (Auditoría de normativas ANAC / ENACOM)
   - 🧠 Agente Orquestador (Validador integral, dictámenes técnicos y emisión de dossier imprimible)

---

## 🚀 Inicio Rápido (Localhost)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en localhost
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`.

---

## 📚 Documentación Técnica

Toda la documentación arquitectónica, normativa y de diseño se encuentra centralizada en la carpeta [`Docs/`](file:///c:/Users/Luciano/Desktop/Proyectos/SAI_Software/Docs/):
- **[`Docs/SYSTEM_MAP.md`](file:///c:/Users/Luciano/Desktop/Proyectos/SAI_Software/Docs/SYSTEM_MAP.md)**: Mapeo integral del sistema, grafo de componentes, flujos y directrices.
- **[`Docs/NORMATIVA_ANAC_ENACOM.md`](file:///c:/Users/Luciano/Desktop/Proyectos/SAI_Software/Docs/NORMATIVA_ANAC_ENACOM.md)**: Referencias normativas RAAC 153/154, Código Aeronáutico y exigencias radioeléctricas ENACOM.
- **[`Docs/CALCULOS_AERONAUTICOS.md`](file:///c:/Users/Luciano/Desktop/Proyectos/SAI_Software/Docs/CALCULOS_AERONAUTICOS.md)**: Fórmulas de corrección de pista, parámetros helipuerto $D$, componentes de viento y usabilidad OACI.
