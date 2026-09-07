# COMPENDIO NORMATIVO Y REGULATORIO: ANAC, ENACOM Y CATASTRO
> *Ruta: `Docs/NORMATIVA_ANAC_ENACOM.md`*  
> *Marco legal y técnico de aplicación en la República Argentina para la habilitación de LAD y LADH.*

---

## 1. Marco Legal General (Código Aeronáutico Ley 17.285)
- **Artículos 25 al 35**: Régimen legal de los aeródromos y lugares de aterrizaje públicos y privados.
- **Limitaciones al dominio**: Imposición de servidumbres aeronáuticas de despeje para salvaguardar las trayectorias de despegue y aterrizaje. Ninguna edificación, antena o plantación puede vulnerar las Superficies Limitadoras de Obstáculos (SLO).
- **Habilitación de Aeródromos y Helipuertos**: Ningún lugar de aterrizaje puede operar comercial o privadamente de manera regular sin la debida autorización de la autoridad aeronáutica competente (**ANAC**).

---

## 2. ANAC - RAAC Parte 153 (Diseño y Operación de Aeródromos / LAD)
Aplica a los Lugares de Aterrizaje y Aeródromos:
- **Clave de Referencia de Aeródromo**: Determinada por dos elementos:
  - Número de clave (1 a 4): Según la longitud de campo de referencia de la aeronave de diseño.
  - Letra de clave (A a F): Según la envergadura y anchura exterior entre ruedas del tren de aterrizaje principal.
- **Pista y Franja de Seguridad (Runway Strip)**:
  - Todo aeródromo debe contar con una franja nivelada y libre de obstáculos que contenga a la pista.
  - Para pistas de vuelo visual diurno de clave 1 y 2, la franja debe extenderse lateralmente al menos a 30m / 40m a cada lado del eje de pista y al menos 30m a 60m más allá de los extremos de pista.
- **Área de Seguridad de Extremo de Pista (RESA)**:
  - Exigida para absorber salidas de pista y evitar daños a las aeronaves.
- **Superficies Limitadoras de Obstáculos (SLO)**:
  - **Superficie de Aproximación**: Pendiente máxima admisible del 5% al 2.5% según la clave de referencia.
  - **Superficie de Subida en el Despegue**: Pendiente de 5% a 2%.
  - **Superficies de Transición**: Pendientes de 1:5 a 1:7 que ascienden hasta la superficie horizontal interna.
- **Orientación de Pista y Viento Cruzado (OACI Anexo 14 / RAAC 153)**:
  - El coeficiente de utilización del aeródromo **no debe ser inferior al 95%** para las aeronaves previstas.
  - Viento cruzado admisible:
    * 20 kt (37 km/h): Claves 3 y 4 (longitud de campo $\ge 1500$ m).
    * 13 kt (24 km/h): Clave 2 (longitud de campo $1200$ m a $1499$ m).
    * 10 kt (19 km/h): Clave 1 (longitud de campo $< 1200$ m, aviación general ligera, fumigadores, ultralivianos).

---

## 3. ANAC - RAAC Parte 154 (Diseño de Helipuertos / LADH)
Aplica a los Lugares de Aterrizaje para Helicópteros en superficie o elevados:
- **Parámetro "D" de Diseño**: Longitud máxima total del helicóptero de diseño con los rotores girando.
- **RD**: Diámetro del rotor principal.
- **TLOF (Área de Toma de Contacto y Elevación)**:
  - Superficie reforzada capaz de soportar las cargas dinámicas del helicóptero.
  - Dimensión mínima: $0.83D$ o $1.0D$ según la clase de performance del helicóptero.
- **FATO (Área de Aproximación Final y de Despegue)**:
  - Área despejada sobre la cual se completa la maniobra de aproximación o despegue.
  - Dimensión mínima: $1.5D$ para helipuertos a nivel de superficie.
- **Área de Seguridad (Safety Area)**:
  - Rodea a la FATO para mitigar riesgos en caso de maniobras no previstas.
  - Extensión perimetral mínima: $0.25D$ o un mínimo absoluto de 3 metros más allá del borde de la FATO.
- **Resistencia Estructural de Carga**:
  - Helipuertos en superficie o elevados deben calcularse para una carga estática igual al MTOW multiplicada por un factor dinámico de **1.5 (150% del MTOW)**.
- **Sectores de Aproximación y Despegue**:
  - Deben proveerse al menos dos trayectorias de aproximación y despegue separadas preferiblemente por al menos $150^\circ$ para facilitar operaciones contra el viento.
  - Pendiente de aproximación reglamentaria: 8% (1:12.5) para aproximaciones estándar de helicópteros o 4.5% si el entorno lo requiere.

---

## 4. ENACOM (Ente Nacional de Comunicaciones)
- **Certificación de No Afectación Radioeléctrica**:
  - Relevamiento de mástiles, torres de telefonía celular y radioenlaces troncales en un radio de 5 km alrededor del punto de referencia del aeródromo/helipuerto (ARP).
- **Alturas Máximas de Emplazamiento**:
  - Ninguna antena o estructura puede invadir las SLO determinadas por ANAC.
- **Asignación de Frecuencia VHF Aeronáutica**:
  - En caso de requerirse estación aeronáutica terrestre (118.000 a 136.975 MHz), debe tramitarse la correspondiente homologación ante ENACOM y asignación de frecuencia por parte de EANA / ANAC.

---

## 5. Requerimientos Catastrales y Ambientales
- **Título de Propiedad o Comodato**: Acreditación legítima del dominio del predio debidamente inscripto en el Registro de la Propiedad Inmueble.
- **Plano de Mensura Aprobado**: Con determinación precisa de linderos y georreferenciación en coordenadas WGS84 (o POSGAR 07).
- **Certificado Municipal de Zonificación**: Certificación de que el uso de suelo "Aeronáutico / Aeródromo Privado" es compatible con el plan regulador comunal.
- **Declaración de Impacto Ambiental (DIA)**: Evaluación de impacto sonoro y ambiental ante la autoridad provincial correspondiente (ej. OPDS en Bs. As.).
