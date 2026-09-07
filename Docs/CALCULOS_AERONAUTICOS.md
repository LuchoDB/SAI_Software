# FORMULACIÓN Y CÁLCULOS TÉCNICOS AERONÁUTICOS

> _Ruta: `Docs/CALCULOS_AERONAUTICOS.md`_  
> _Base matemática y física para los motores de cálculo del sistema SAI Consult._

---

## 1. Orientación Magnética y Designación de Pistas (QFU)

### Declinación Magnética ($\text{Decl}$)

Dado un rumbo geográfico verdadero $TH$ (True Heading) y una declinación magnética local $Decl$ (positiva para Este, negativa para Oeste):
$$MH = TH - Decl$$
Si $MH < 0^\circ \implies MH = MH + 360^\circ$
Si $MH \ge 360^\circ \implies MH = MH - 360^\circ$

### Designador de Cabecera (QFU)

La cabecera principal se obtiene dividiendo el rumbo magnético $MH$ por 10 y redondeando al entero más próximo (con dos dígitos numéricos, ej. 04):
$$QFU_1 = \text{round}(MH / 10)$$
Si $QFU_1 = 0 \implies QFU_1 = 36$
La cabecera recíproca se ubica a $180^\circ$ de diferencia:
$$MH_{recip} = (MH + 180^\circ) \pmod{360^\circ}$$
$$QFU_2 = \text{round}(MH_{recip} / 10)$$
Si $QFU_2 = 0 \implies QFU_2 = 36$

_Ejemplo_: Rumbo verdadero $042^\circ$, declinación $-8^\circ$ (W) $\implies MH = 042 - (-8) = 050^\circ \implies QFU = 05 / 23$.

---

## 2. Componentes Vectoriales de Viento

Para una dirección de viento observada $\theta_{v}$ (grados) y velocidad $V$ (en nudos $\text{kt}$), respecto al eje de pista orientado a $\theta_p$:
$$\Delta\theta = |\theta_v - \theta_p|$$

- **Componente Longitudinal**:
  $$V_{long} = V \cdot \cos(\Delta\theta)$$
  - Si $V_{long} > 0 \implies$ **Viento de Frente (Headwind)**
  - Si $V_{long} < 0 \implies$ **Viento de Cola (Tailwind)**
- **Componente Transversal (Viento Cruzado / Crosswind)**:
  $$V_{cross} = V \cdot |\sin(\Delta\theta)|$$

---

## 3. Coeficiente de Usabilidad de Pista (OACI Anexo 14)

Dada una matriz histórica de distribución de frecuencias de viento porcentuales $f_i$ para cada una de las 16 direcciones cardinales y rangos de velocidad:

- Para cada dirección de la pista (y su recíproca, ya que los despegues y aterrizajes se efectúan contra el viento):
- Se determina si para esa celda meteorológica el viento cruzado mínimo $V_{cross} \le V_{max\_admisible}$ (típicamente 10 kt, 13 kt o 20 kt).
- El **Factor de Utilización Total** $U$ es la suma de las frecuencias de tiempo en que las condiciones de viento cruzado son iguales o inferiores al límite admisible:
  $$U = \sum f_i \quad \forall i \text{ donde } \min(V_{cross\_c1}, V_{cross\_c2}) \le V_{max}$$
- **Criterio de Aceptación OACI/ANAC**: $U \ge 95.0\%$.

---

## 4. Correcciones de Longitud Básica de Pista (RAAC 153)

Dada la longitud de campo de referencia de la aeronave de diseño a nivel del mar y atmósfera estándar $L_0$:

### Corrección por Elevación ($C_e$)

Aumenta un 7% por cada 300 metros de elevación sobre el nivel medio del mar (MSL):
$$L_1 = L_0 \cdot \left(1 + 0.07 \cdot \frac{\text{Elevación [m]}}{300}\right)$$

### Corrección por Temperatura de Referencia ($C_t$)

La temperatura estándar ISA a la elevación $h$ [m] es:
$$T_{ISA} = 15 - 0.0065 \cdot h \quad [^\circ\text{C}]$$
Si la temperatura media máxima del mes más caluroso $T_{ref} > T_{ISA}$:
Aumenta un 1% por cada grado Celsius de exceso:
$$L_2 = L_1 \cdot \left(1 + 0.01 \cdot (T_{ref} - T_{ISA})\right)$$

### Corrección por Pendiente Longitudinal Efectiva ($C_s$)

Aumenta un 10% por cada 1% de pendiente longitudinal efectiva ascendente:
$$L_{final} = L_2 \cdot \left(1 + 0.10 \cdot \text{Pendiente [\%]}\right)$$

---

## 5. Dimensionamiento de Helipuertos LADH (RAAC 154)

A partir del parámetro fundamental **D** (dimensión mayor del helicóptero con rotores en movimiento, en metros) y el peso máximo de despegue **MTOW** (en kg):

- **Área de Toma de Contacto y Elevación (TLOF)**:
  $$\text{TLOF}_{min} = 0.83 \cdot D \quad \text{(Helipuerto en superficie, helicóptero mono-motor)}$$
  $$\text{TLOF}_{min} = 1.0 \cdot D \quad \text{(Helipuerto elevado o helicóptero multi-motor / Clase 1)}$$
- **Área de Aproximación Final y Despegue (FATO)**:
  $$\text{FATO}_{min} = 1.5 \cdot D \quad \text{(En superficie)}$$
- **Área de Seguridad (Safety Area)**:
  Borde exterior = $\text{FATO} + 2 \times \max(0.25 \cdot D, 3.0 \text{ m})$
- **Carga Estructural Dinámica de Diseño**:
  $$P_{diseño} = 1.50 \cdot \text{MTOW} \quad [\text{kg}]$$
