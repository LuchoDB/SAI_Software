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

## Documentación para colaboradores (humanos e IA)

Este proyecto mantiene su documentación de arquitectura centralizada en `Docs/`,
pensada para que cualquier colaborador —humano o asistente de IA— pueda
orientarse rápido sin depender de explorar archivo por archivo:

- **`Docs/SYSTEM_MAP.md`**: descripción general de la arquitectura, componentes
  principales y flujos de datos del sistema.
- **`Docs/NORMATIVA_ANAC_ENACOM.md`**: referencias normativas (RAAC 153/154,
  Código Aeronáutico, exigencias ENACOM) usadas en los cálculos del sistema.
- **`Docs/CALCULOS_AERONAUTICOS.md`**: fórmulas y parámetros usados para los
  cálculos de factibilidad técnica.

Estos documentos son un punto de partida útil, pero no reemplazan la lectura
del código cuando se trata de cambios específicos.
