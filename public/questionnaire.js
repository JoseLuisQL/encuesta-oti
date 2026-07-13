// Estructura completa del cuestionario OTI - Municipalidad Distrital de Oronccoy
// Tipos de pregunta:
//   yesno      -> Sí / No
//   single     -> una sola opción (radio) con lista options[]
//   text       -> texto libre
//   number     -> número
//   multi      -> selección múltiple (checkboxes) con lista options[]
//   matrix     -> tabla: rows[] x cols[] (cada celda un número/texto)
// area: quién debería responder (OTI, Gerencia, RRHH, Presupuesto, Imagen, etc.)

const AREAS = {
  OTI: { label: "OTI / TI", color: "#2563eb" },
  GERENCIA: { label: "Gerencia Municipal", color: "#7c3aed" },
  RRHH: { label: "Recursos Humanos", color: "#059669" },
  PRESUP: { label: "Presupuesto / Planeamiento", color: "#d97706" },
  ABAST: { label: "Abastecimiento / Logística", color: "#dc2626" },
  IMAGEN: { label: "Imagen / Comunicaciones", color: "#db2777" },
  ARCHIVO: { label: "Trámite / Archivo", color: "#0891b2" },
};

const QUESTIONNAIRE = [
  {
    id: "I",
    titulo: "I - Información General",
    questions: [
      { n: "1", type: "text", area: "OTI", label: "Nombre completo de la entidad pública", default: "MUNICIPALIDAD DISTRITAL DE ORONCCOY" },
      { n: "2", type: "text", area: "OTI", label: "RUC de la entidad", help: "Ingrese los 11 dígitos, sin espacios ni guiones" },
      { n: "3", type: "text", area: "OTI", label: "Departamento", default: "AYACUCHO" },
      { n: "4", type: "text", area: "OTI", label: "Provincia", default: "LA MAR" },
      { n: "5", type: "text", area: "OTI", label: "Distrito", default: "ORONCCOY" },
      { n: "6", type: "text", area: "OTI", label: "Teléfono" },
      { n: "7", type: "text", area: "OTI", label: "Correo electrónico" },
      { n: "8", type: "yesno", area: "OTI", label: "¿Su entidad cuenta con activos digitales?" },
      { n: "9", type: "text", area: "OTI", label: "¿Cuál es su rol o cargo en la entidad?" }
    ]
  },
  {
    id: "II",
    titulo: "II - Información Institucional",
    questions: [
      { n: "10", type: "single", area: "RRHH", label: "Número aproximado de personas de la entidad al 31/12/2025", help: "Incluye personal nombrado, CAS y otros regímenes laborales", options: ["Hasta 100 personas", "De 101 a 500 personas", "De 501 a 1000 personas", "Más de 1000 personas"] },
      { n: "11", type: "single", area: "RRHH", label: "¿La entidad cuenta con personal en modalidad de teletrabajo o trabajo remoto?", options: ["No", "Sí, menos del 10% del total de colaboradores", "Sí, entre el 10% y el 25% del total del personal", "Sí, entre el 25% y el 50% del total del personal", "Sí, más del 50% del total del personal"] },
      { n: "12", type: "yesno", area: "PRESUP", label: "¿La entidad cuenta con presupuesto asignado específicamente para proyectos de innovación tecnológica y transformación digital?" },
      { n: "13", type: "single", area: "PRESUP", label: "¿Qué porcentaje aproximado del presupuesto total se destina a innovación tecnológica y transformación digital?", options: ["Menos del 0.1%", "Desde 0.1% hasta menos del 0.5%", "Desde 0.5% hasta menos del 1%", "Desde 1% hasta el 5%", "Más del 5%", "No se ha asignado presupuesto"] }
    ]
  },
  {
    id: "III",
    titulo: "III - Infraestructura Digital",
    questions: [
      { n: "14", type: "matrix", area: "OTI", label: "Cantidad de computadoras de escritorio operativas (Windows/Linux) según procesador", help: "Si no cuenta con el dato exacto, puede consignar una estimación.", cols: ["Windows", "Linux"], rows: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9", "Intel Xeon (Workstation)", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "AMD Raven Ridge", "AMD Ryzen Threadripper", "Otro (especifique)"] },
      { n: "15", type: "matrix", area: "OTI", label: "Cantidad de computadoras de escritorio Mac operativas según procesador", help: "Si no cuenta con el dato exacto, puede consignar una estimación.", cols: ["Cantidad"], rows: ["Apple M1", "Apple M1 Pro / M1 Max / M1 Ultra", "Apple M2", "Apple M2 Pro / M2 Max / M2 Ultra", "Apple M3", "Apple M3 Pro / M3 Max", "Apple M4", "Apple M4 Pro / M4 Max", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Xeon (Mac Pro)", "Otro (especifique)"] },
      { n: "16", type: "matrix", area: "OTI", label: "Cantidad de computadoras portátiles operativas (Windows/Linux) según procesador", help: "Si no cuenta con el dato exacto, puede consignar una estimación.", cols: ["Windows", "Linux"], rows: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9", "Intel Xeon (Mobile Workstation)", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Otro (especifique)"] },
      { n: "17", type: "matrix", area: "OTI", label: "Cantidad aproximada de computadoras portátiles Mac operativas según procesador", help: "Si no cuenta con el dato exacto, puede consignar una estimación.", cols: ["Cantidad"], rows: ["Apple M1", "Apple M1 Pro / M1 Max", "Apple M2", "Apple M2 Pro / M2 Max", "Apple M3", "Apple M3 Pro / M3 Max", "Apple M4", "Apple M4 Pro / M4 Max", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Otro (especifique)"] },
      { n: "18", type: "matrix", area: "OTI", label: "Cantidad de tablets operativas según sistema operativo", cols: ["Cantidad"], rows: ["Windows", "Android", "iOS", "Otro (especifique)"] },
      { n: "19", type: "matrix", area: "OTI", label: "Cantidad de equipos o dispositivos disponibles según su origen", help: "Considere como 'externos' los equipos provistos por terceros (alquiler, comodato o servicios tercerizados).", cols: ["Comprados", "Donados", "Externos", "Total"], rows: ["Computadoras de escritorio", "Computadoras portátiles", "Impresoras", "Tablets", "Teléfono móvil institucional", "Escáneres", "Servidores físicos", "Servidores virtuales"] },
      { n: "20", type: "matrix", area: "OTI", label: "Cantidad aproximada de equipos o dispositivos disponibles según su estado", help: "Si no cuenta con el dato exacto, puede consignar una estimación.", cols: ["Operativos en uso", "Antigüedad promedio (años)", "Operativos sin uso", "No operativo"], rows: ["Computadoras de escritorio", "Computadoras portátiles", "Impresoras", "Tablets", "Teléfono móvil institucional", "Escáneres", "Servidores físicos"] },
      { n: "21", type: "matrix", area: "OTI", label: "Cantidad de equipos de red y comunicación", cols: ["Cantidad"], rows: ["Módems", "Balanceadores de carga", "Switch de acceso", "Switch de distribución", "Switch Core", "Switch de acceso PoE", "Switch de distribución PoE", "Switch core PoE", "Router", "Access point (puntos de acceso inalámbrico)", "Firewall físico (NGFW)", "Otro (especifique)"] },
      { n: "22", type: "single", area: "OTI", label: "Modalidad de mantenimiento de los equipos de TI", help: "Marque la opción que mejor represente la práctica principal.", options: ["Interno", "Externo"] },
      { n: "23", type: "number", area: "PRESUP", label: "Costo del mantenimiento de equipamiento informático y conectividad realizado el año anterior (en soles)" },
      { n: "24", type: "matrix", area: "OTI", label: "Cantidad de impresoras que tiene la entidad", cols: ["Cantidad"], rows: ["Impresora matricial (80 col)", "Impresora matricial (240 col)", "Impresora de inyección", "Impresora láser", "Impresora térmica", "Equipo multifuncional", "Plotter", "Fotocopiadora", "Otro (especifique)"] },
      { n: "25", type: "yesno", area: "OTI", label: "¿La entidad cuenta con tecnologías de asistencia para personas con discapacidad?", help: "Por ejemplo: lectores de pantalla, subtítulos, teclados adaptados, etc." },
      { n: "26", type: "multi", area: "OTI", label: "¿Qué tecnologías de asistencia tiene implementadas?", help: "Marque todas las que correspondan.", options: ["Lectores de pantalla", "Software de reconocimiento de voz", "Teclados adaptados", "Lupas digitales o ampliadores de pantalla", "Hardware de seguimiento ocular", "Conversores de texto a Braille", "Sistemas de navegación accesible en plataformas web", "Subtítulos automáticos en videos o transmisiones", "Intérpretes de lengua de señas (presenciales o virtuales)", "Otras (especifique)"] },
      { n: "27", type: "yesno", area: "ARCHIVO", label: "¿La entidad utiliza un Modelo de Gestión Documental (MGD)?" },
      { n: "28", type: "yesno", area: "ARCHIVO", label: "¿La entidad utiliza un Sistema de Gestión Documental orientado a gestión digital (cero papel)?" },
      { n: "29", type: "multi", area: "ARCHIVO", label: "¿Qué Sistema(s) de Gestión Documental utiliza la entidad?", help: "Marque todas las que correspondan.", options: ["SGD PCM (ONPE) v4.7", "SGD ONPE", "SGD Proinversión", "SGD UNI", "SGD ONPE v5.1", "Otro (especifique)"] },
      { n: "30", type: "multi", area: "OTI", label: "¿La entidad utiliza herramientas o sistemas digitales para las siguientes funciones?", help: "Marque todas las que correspondan.", options: ["Gestión documental", "Repositorio digital de archivos", "Gestión de inventarios y activos fijos", "Gestión de recursos humanos", "Gestión financiera (recaudación, tesorería, contabilidad)", "Gestión de compras y adquisiciones", "Digitalización de procesos (BPMS)", "Ofimática", "Intranet", "Otros (especifique)"] },
      { n: "31", type: "matrix", area: "OTI", label: "Cantidad de licencias vigentes de software al cierre 2025 según tipo", cols: ["Suscripción", "Licencia"], rows: ["Sistema operativo", "Lenguaje de programación", "Base de datos", "GIS", "Software de oficina (Word, Excel, etc.)", "Diseño gráfico", "Software de seguridad", "Virtualización (VMware, otros)", "Copias de seguridad (Backup)", "Antivirus", "Soluciones EDR o anti-ransomware", "Inteligencia artificial"] },
      { n: "32", type: "yesno", area: "OTI", label: "¿La entidad cuenta con aplicaciones móviles dirigidas a la ciudadanía?" },
      { n: "33", type: "matrix", area: "OTI", label: "¿Cuántas aplicaciones móviles tiene disponibles para la ciudadanía según tienda?", cols: ["Cantidad"], rows: ["Google Play", "Apple Store", "Microsoft Store", "Huawei AppGallery"] },
      { n: "34", type: "number", area: "OTI", label: "Cantidad de sedes que tiene la entidad" },
      { n: "35", type: "yesno", area: "OTI", label: "¿Las sedes de la entidad están centralizadas en una sola sede principal?" },
      { n: "36", type: "single", area: "OTI", label: "¿En cuántas sedes se cuenta con conectividad a internet de manera regular?", help: "Considere solo sedes donde la conectividad está disponible de forma habitual.", options: ["En menos del 50% de las sedes", "Entre 50% y 75% de las sedes", "En más del 75% de las sedes", "En el 100% de las sedes"] },
      { n: "37", type: "multi", area: "OTI", label: "¿Qué limitaciones enfrenta la entidad en conectividad a internet?", help: "Marque todas las que correspondan.", options: ["Limitaciones de infraestructura física", "Presupuesto insuficiente", "Falta de proveedores de conectividad en la zona", "No se identifican limitaciones", "Otra información (especifique)"] },
      { n: "38", type: "multi", area: "OTI", label: "¿Qué tipos de conectividad a internet están disponibles?", help: "Marque todas las que correspondan.", options: ["Red Nacional del Estado Peruano (REDNACE)", "Fibra óptica", "Conexión móvil (EDGE, 3G, 4G, 5G)", "Red WiFi", "Radioenlace", "Conexión satelital (especifique)", "Otro tipo (especifique)"] },
      { n: "39", type: "number", area: "OTI", label: "Ancho de banda contratado para internet (en Mbps)" },
      { n: "40", type: "yesno", area: "OTI", label: "¿La entidad cuenta con centros de datos?" },
      { n: "41", type: "matrix", area: "OTI", label: "Cantidad de centros de datos según su tipo", cols: ["Cantidad"], rows: ["Modalidad propia", "Housing", "Outsourcing", "Externo", "Externo en contingencia", "Otro (especifique)"] },
      { n: "42", type: "yesno", area: "OTI", label: "¿La entidad cuenta con servicios de nube?" },
      { n: "43", type: "matrix", area: "OTI", label: "Cantidad de cuentas de servicios de nube según proveedor", cols: ["Cantidad"], rows: ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "Oracle Cloud", "Huawei Cloud", "Red Hat Cloud / IBM Cloud", "Nube privada: PNGD"] },
      { n: "44", type: "matrix", area: "OTI", label: "Cantidad de servicios de nube según su tipo", cols: ["Cantidad"], rows: ["Plataforma como Servicio (PaaS)", "Software como Servicio (SaaS)", "Infraestructura como Servicio (IaaS)", "PNGD (IaaS)", "PNGD (PaaS)"] },
      { n: "45", type: "number", area: "OTI", label: "Cantidad de equipos informáticos con direcciones IPv4" },
      { n: "46", type: "yesno", area: "OTI", label: "¿La entidad cuenta con un plan definido para la transición a IPv6?" },
      { n: "47", type: "number", area: "OTI", label: "Cantidad de equipos informáticos con direcciones IPv6" },
      { n: "48", type: "yesno", area: "OTI", label: "¿La entidad permite conexiones remotas al personal para acceso a sistemas internos?" },
      { n: "49", type: "single", area: "OTI", label: "¿Existen problemas recurrentes de conectividad que afectan la operación?", options: ["Sí, afectan de forma significativa", "Sí, afectan ocasionalmente", "No, no existen problemas recurrentes", "No lo sé"] },
      { n: "50", type: "number", area: "OTI", label: "Cantidad de dominios de internet (ej. entidad.gob.pe)" },
      { n: "51", type: "number", area: "OTI", label: "Cantidad de subdominios que tiene la entidad" },
      { n: "52", type: "text", area: "OTI", label: "Indique los subdominios con los que cuenta la entidad" },
      { n: "53", type: "text", area: "OTI", label: "Costo aproximado del servicio de hosting que utiliza la entidad" },
      { n: "54", type: "multi", area: "IMAGEN", label: "¿Qué redes sociales utiliza la entidad?", help: "Marque todas las que correspondan.", options: ["Facebook", "Threads", "Instagram", "LinkedIn", "WhatsApp / WhatsApp Business", "X (antes Twitter)", "YouTube", "TikTok", "Otro (especifique)"] }
    ]
  },
  {
    id: "IV",
    titulo: "IV - Seguridad y Confianza Digital",
    questions: [
      { n: "55", type: "matrix", area: "OTI", label: "¿Qué soluciones de seguridad digital tiene implementadas? Indique la cantidad por tipo", cols: ["Cantidad"], rows: ["Firewalls físicos", "Firewalls virtuales", "Sistemas de detección de intrusiones (IDS)", "Sistemas de prevención de intrusiones (IPS)", "Enrutadores seguros", "Conmutadores seguros", "Estaciones de trabajo seguras", "Servidores seguros", "Dispositivos de autenticación de dos factores", "Otros (especifique)"] },
      { n: "56", type: "multi", area: "OTI", label: "¿Qué software de seguridad digital tiene implementado?", help: "Marque todas las que correspondan.", options: ["Antivirus tradicional", "Protección avanzada de equipos (EDR/XDR)", "Firewall de aplicaciones web (WAF)", "Sistemas de detección de intrusiones (IDS)", "Sistemas de prevención de intrusiones (IPS)", "Software de encriptación / Cifrado de datos", "Software de gestión de identidades y acceso (IAM / PAM)", "Seguridad de correo electrónico (Anti-spam/Anti-phishing)", "Prevención de fuga de información (DLP)", "Software de seguridad de punto final", "Otros (especifique)"] },
      { n: "57", type: "yesno", area: "OTI", label: "¿La entidad ha implementado un Sistema de Gestión de Seguridad de la Información (SGSI)?" },
      { n: "58", type: "multi", area: "OTI", label: "¿Qué políticas de seguridad tiene implementadas?", help: "Marque todas las que correspondan.", options: ["Política de almacenamiento en equipos de trabajo", "Política de uso aceptable", "Política de almacenamiento en la red corporativa", "Política de relación con proveedores", "Política de contraseñas", "Política de aplicaciones permitidas", "Política de uso de dispositivos móviles", "Política de acceso remoto", "Política de copias de seguridad", "Política de uso y buenas prácticas en redes sociales", "Política en gestión de registros (logs)", "Política de uso de técnicas criptográficas (cifrado)", "Política de gestión de riesgos", "Política de continuidad de negocio", "Política de transferencia de información y datos", "Política de respuesta a incidentes", "Política de control de acceso", "Política de almacenamiento en la nube", "Política de clasificación de la información", "Política de uso de Internet", "Política de concientización y capacitación en seguridad", "Política de actualizaciones de software", "Política de instalación de software", "Política de auditoría de sistemas", "Política de seguridad de la red", "Política de medios extraíbles", "Política de equipos de comunicaciones", "Política de correo electrónico", "Política de escritorio limpio", "Política de teletrabajo o trabajo remoto seguro", "Política de uso ético y seguro de IA", "Ninguna", "Otro (especifique)"] },
      { n: "59", type: "yesno", area: "OTI", label: "¿La entidad utiliza una Red Privada Virtual (VPN) para acceso remoto?" },
      { n: "60", type: "single", area: "OTI", label: "¿La entidad ha realizado difusión y/o capacitación en seguridad de la información?", options: ["Sí, para menos del 30% del personal", "Sí, entre el 30% y menos del 49% del personal", "Sí, para entre el 50% y el 79% del personal", "Sí, para el 80% o más del personal", "No se han realizado actividades"] },
      { n: "61", type: "single", area: "OTI", label: "¿Con qué frecuencia realizó difusión o capacitación en seguridad de la información?", options: ["Mensualmente", "Trimestralmente", "Semestralmente", "Anualmente", "No se han realizado actividades"] },
      { n: "62", type: "multi", area: "OTI", label: "¿Quiénes brindaron la capacitación en seguridad de la información?", options: ["Oficial de Seguridad y Confianza Digital", "Centro Nacional de Seguridad Digital (CNSD)", "Área/responsable de TI de la entidad", "Proveedor externo o consultor especializado", "Otro (especifique)"] },
      { n: "63", type: "single", area: "OTI", label: "¿Con qué frecuencia realizó escaneos de vulnerabilidades al 31/12/2025?", options: ["Mensualmente", "Trimestralmente", "Semestralmente", "Anualmente", "No se han realizado escaneos"] },
      { n: "64", type: "single", area: "OTI", label: "¿Cuántos incidentes de seguridad digital reportó al CNSD durante 2025?", options: ["Ninguno", "De 1 a 5", "De 6 a 10", "De 11 a 20", "Más de 20"] },
      { n: "65", type: "multi", area: "OTI", label: "¿Qué tipos de incidentes de ciberseguridad ha experimentado?", help: "Marque todas las que correspondan.", options: ["Phishing", "Acceso no autorizado a sistemas o sitios web", "Ataque de ingeniería social", "Instalación de software no autorizado (Shadow IT)", "Suplantación de identidad", "Ataques a aplicaciones web (XSS, SQL Injection, etc.)", "Ataques dirigidos (APT)", "Virus informático", "Incidentes relacionados con la privacidad", "Ransomware", "Fraude electrónico", "Denegación de servicio (DoS y DDoS)", "Fuga de información", "Robo de hardware", "Pérdida de integridad de la información", "Espionaje", "Robo de datos", "Monitoreo no autorizado", "Deepfakes o suplantación con IA", "Otro (especifique)"] },
      { n: "66", type: "multi", area: "OTI", label: "¿Qué servicios ha solicitado al Centro Nacional de Seguridad Digital (CNSD)?", options: ["Asesoría técnica de seguridad digital", "Análisis de vulnerabilidades (caja negra)", "Análisis informático forense digital", "Inducción o capacitación", "Monitoreo de seguridad (NOC/SOC)", "Hacking ético", "Servicios de respuesta a incidentes (CSIRT virtual)", "Ninguno de los anteriores"] }
    ]
  },
  {
    id: "V",
    titulo: "V - Gobierno de Datos",
    questions: [
      { n: "67", type: "yesno", area: "OTI", label: "¿La entidad cuenta con un Oficial de Gobierno de Datos designado formalmente?" },
      { n: "68", type: "yesno", area: "OTI", label: "¿La entidad ha desarrollado un Modelo de Referencia de Datos?", help: "Define la estructura, relaciones y estándares de los datos de la entidad." },
      { n: "69", type: "yesno", area: "OTI", label: "¿La entidad ha identificado y mantiene sus datos maestros, atributos y relaciones?", help: "Datos maestros: personas, organizaciones, servicios o ubicaciones." },
      { n: "70", type: "yesno", area: "OTI", label: "¿La entidad mantiene un inventario de los datos de su competencia?" },
      { n: "71", type: "multi", area: "OTI", label: "¿Qué acciones se han realizado para asegurar calidad e integridad de datos?", options: ["Elaboración de una política de calidad de datos", "Implementación de puntos de control de calidad", "Definición de roles y responsabilidades", "Auditorías internas para verificar calidad", "Definición de criterios mínimos de calidad", "Elaboración y mantenimiento del diccionario de datos", "Implementación de un Catálogo de Datos Institucional", "Ninguna", "Otro (especifique)"] },
      { n: "72", type: "yesno", area: "OTI", label: "¿La entidad cuenta con un Oficial de Datos Personales designado formalmente?" },
      { n: "73", type: "multi", area: "OTI", label: "¿Qué medidas técnicas ha implementado para proteger la identidad digital de la ciudadanía?", help: "Marque todas las que correspondan.", options: ["Autenticación multifactor (MFA)", "Protocolos de cifrado (TLS/SSL)", "Integración con ID Gob.pe", "Ninguno", "Otro (especifique)"] },
      { n: "74", type: "yesno", area: "OTI", label: "¿La entidad desarrolla o tiene previsto desarrollar proyectos de analítica de datos?" },
      { n: "75", type: "multi", area: "OTI", label: "¿Cómo analiza la entidad sus datos?", help: "Marque todas las que correspondan.", options: ["Análisis manual (sin herramientas automatizadas)", "Uso de hojas de cálculo (Excel, Google Sheets)", "Herramientas de análisis estadístico (SPSS, R, Stata, SAS)", "Herramientas de inteligencia de negocios (Power BI, Tableau, Looker, Qlik)", "Scripts o programación (Python, SQL)", "Plataformas de big data / Lakehouse (Databricks, Snowflake, BigQuery, Spark)", "Técnicas de minería de datos", "Modelos de aprendizaje automático (machine learning)", "IA generativa o predictiva (LLMs, GPT, Copilot, Gemini)", "Otro (especifique)"] },
      { n: "76", type: "number", area: "OTI", label: "¿Cuántos datasets tiene publicados en la Plataforma Nacional de Datos Abiertos (PNDA)?", help: "Si no tiene, registre 0. Puede consignar una estimación." },
      { n: "77", type: "number", area: "OTI", label: "¿Cuántos datasets consume/utiliza desde la PNDA?", help: "Si no consume, registre 0." },
      { n: "78", type: "number", area: "OTI", label: "¿Cuántas capas geográficas tiene publicadas en Geo Perú?" },
      { n: "79", type: "number", area: "OTI", label: "¿Cuántas capas geográficas consume/utiliza desde Geo Perú?" },
      { n: "80", type: "yesno", area: "OTI", label: "¿La entidad registra sus metadatos en el Catálogo Nacional de Metadatos de Información Geográfica?" }
    ]
  },
  {
    id: "VI",
    titulo: "VI - Identidad Digital",
    questions: [
      { n: "81", type: "yesno", area: "ARCHIVO", label: "¿La entidad cuenta con una casilla electrónica?" },
      { n: "82", type: "number", area: "ARCHIVO", label: "Total de personas usuarias registradas en la casilla electrónica" },
      { n: "83", type: "multi", area: "OTI", label: "¿Qué componentes de interoperabilidad utiliza para la gestión de identidad digital?", help: "Marque todas las que correspondan.", options: ["APIs REST o SOAP", "Federación de identidades (SAML)", "OAuth 2.0 / OpenID Connect (OIDC)", "Plataforma de Interoperabilidad del Estado (PIDE)", "Ninguno", "Otro (especifique)"] },
      { n: "84", type: "single", area: "OTI", label: "¿La entidad cuenta con software para la gestión de firmas digitales?", options: ["Sí, es un desarrollo propio", "Sí, provisto por una empresa privada", "Sí, reutilizado o compartido", "No, la entidad no utiliza"] },
      { n: "85", type: "multi", area: "OTI", label: "¿Qué software o herramienta de firma digital utiliza?", help: "Marque todas las que correspondan.", options: ["Software de la Contraloría General de la República", "Software de la ONPE", "ReFirma (RENIEC)", "Firma Perú (PCM)", "Soluciones privadas (Adobe Sign, DocuSign)", "Desarrollo propio", "Otro (especifique)"] },
      { n: "86", type: "multi", area: "OTI", label: "¿En qué sistemas está integrada la firma digital?", help: "Marque todas las que correspondan.", options: ["Sistema de trámite documentario", "Sistema de recursos humanos", "Sistema contable y/o tesorería", "Sistema Integrado o ERP institucional", "Otro (especifique)"] }
    ]
  },
  {
    id: "VII",
    titulo: "VII - Digitalización de Servicios y Procesos",
    questions: [
      { n: "87", type: "number", area: "GERENCIA", label: "¿Cuántos servicios y procesos tiene registrados en su TUPA?" },
      { n: "88", type: "matrix", area: "GERENCIA", label: "Los dos servicios/procesos con mayor demanda ciudadana", help: "Para cada uno indique si está en el TUPA y su nivel de digitalización.", cols: ["Servicio / Proceso 1", "Servicio / Proceso 2"], rows: ["Nombre del servicio o proceso", "¿Está incluido en el TUPA? (Sí/No)", "Nivel de digitalización (Total / Parcial / Proceso / No digitalizado)"] },
      { n: "89", type: "single", area: "GERENCIA", label: "¿Qué porcentaje de los servicios/procesos del TUPA está digitalizado?", help: "Considere digitalizados los total o parcialmente digitalizados.", options: ["Hasta el 33%", "Entre el 34% y el 66%", "Más del 66%"] },
      { n: "90", type: "multi", area: "GERENCIA", label: "Principales dificultades para digitalizar servicios y procesos", help: "Seleccione como máximo dos opciones.", options: ["Falta de conectividad o equipamiento", "Limitadas capacidades o falta de personal especializado", "Insuficientes recursos financieros", "Resistencia al cambio o cultura organizacional", "Limitaciones normativas o legales", "Falta de liderazgo o apoyo de la Alta Dirección", "Otro (especifique)"] },
      { n: "91", type: "multi", area: "GERENCIA", label: "Principales beneficios de la digitalización de servicios y procesos", help: "Marque todas las que correspondan.", options: ["Reducción de tiempos de atención", "Mayor satisfacción de la ciudadanía", "Incremento en la resolución de solicitudes", "Disminución de costos operativos", "Mejora en la calidad y precisión de los datos", "Reducción de errores humanos", "Ninguno", "Otros (especifique)"] },
      { n: "92", type: "yesno", area: "GERENCIA", label: "¿La entidad mide el nivel de satisfacción de la ciudadanía respecto a servicios digitales?" },
      { n: "93", type: "multi", area: "GERENCIA", label: "¿Cómo se mide el nivel de satisfacción de los servicios digitales?", help: "Marque todas las que correspondan.", options: ["Formularios/encuestas en línea (Google Forms, Microsoft Forms, etc.)", "Facilita Perú", "Aplicaciones móviles de la entidad", "Redes sociales", "Herramienta NPS de la SGTD", "Otro (especifique)"] }
    ]
  },
  {
    id: "VIII",
    titulo: "VIII - Aplicaciones y Plataformas Digitales",
    questions: [
      { n: "94", type: "multi", area: "OTI", label: "¿Qué plataformas transversales utiliza su entidad?", help: "Marque todas las que correspondan.", options: ["Gob.Pe (Plataforma Digital Única del Estado)", "Plataforma de Registro de Visitas", "Libro de Reclamaciones", "Plataforma de Denuncias", "Plataforma de Debida Diligencia", "Plataforma Nacional de Software Público", "GeoPerú", "PNDA (Datos Abiertos)", "IDEP (Infraestructura de datos espaciales)", "Plataforma de Territorios Digitales", "PNGD (Gobierno Digital)", "PIDE (Interoperabilidad)", "Facilita Perú", "Plataforma de Gestión Documental", "Centro Nacional de Datos", "Participa Perú", "Ninguna", "Otra plataforma (especifique)"] },
      { n: "95", type: "number", area: "PRESUP", label: "Costo anual destinado a mantenimiento y actualización de aplicaciones y plataformas (en soles)", help: "Puede consignar una estimación." },
      { n: "96", type: "yesno", area: "OTI", label: "¿La entidad utiliza protocolos seguros (HTTPS u otros) para el acceso a sus aplicaciones?" },
      { n: "97", type: "multi", area: "OTI", label: "¿Cómo asegura la interoperabilidad entre sus aplicaciones y plataformas?", help: "Marque todas las que correspondan.", options: ["Implementación de APIs", "Servicios web bajo estándares (SOAP, REST, GraphQL)", "Middleware o bus de servicios empresariales (ESB)", "Gestión de identidades federadas", "Arquitectura SOA / microservicios", "Ninguna", "Otro (especifique)"] },
      { n: "98", type: "single", area: "OTI", label: "Estado de implementación de accesibilidad digital en servicios/plataformas propias", help: "Según Resolución SGTD N.º 001-2025-PCM/SGTD.", options: ["No se ha iniciado la implementación", "En etapa de diagnóstico", "En proceso de adecuación", "Implementado parcialmente", "Implementado totalmente (nivel AA)", "Implementado totalmente (nivel AAA)", "No lo sé"] },
      { n: "99", type: "single", area: "OTI", label: "¿Los servicios/plataformas propias ofrecen contenido o funcionalidades en lenguas originarias?", options: ["No, solo en español", "Sí, a nivel informativo (contenido estático)", "Sí, con funcionalidades transaccionales", "Sí, con asistencia multilingüe en tiempo real (chat o video)"] }
    ]
  },
  {
    id: "IX",
    titulo: "IX - Talento Digital",
    questions: [
      { n: "100", type: "yesno", area: "OTI", label: "¿La entidad cuenta con un área o función responsable de informática o tecnología?" },
      { n: "101", type: "single", area: "RRHH", label: "Cantidad de personal que cumple funciones de informática o tecnología", options: ["De 1 a 5", "De 6 a 15", "De 16 a 30", "De 31 a 50", "Más de 50"] },
      { n: "102", type: "multi", area: "OTI", label: "Roles vinculados a la transformación digital que existen actualmente", help: "Marque todas las que correspondan.", options: ["Ciberseguridad", "Arquitectura empresarial", "Ciencia de datos y analítica", "Desarrollo de software", "Infraestructura en la nube (cloud)", "Gestión de proyectos", "IA y aprendizaje automático", "Gestión de servicios tecnológicos (ITIL, COBIT)", "Automatización de procesos (RPA)", "Experiencia de usuario e interfaces (UX/UI)", "DevOps / SRE", "Coordinación o gestión en accesibilidad digital", "Otro (especifique)"] },
      { n: "103", type: "matrix", area: "RRHH", label: "Cantidad de personal vinculado a transformación digital según formación académica", cols: ["Cantidad"], rows: ["Secundaria", "Formación técnica básica (1-2 años)", "Formación técnica superior (3-4 años)", "Universitario (egresado)", "Bachiller", "Título universitario", "Magíster", "Doctorado"] },
      { n: "104", type: "multi", area: "OTI", label: "Capacitaciones que ha recibido el personal de informática o áreas afines", help: "Marque todas las que correspondan.", options: ["IA y Aprendizaje Automático", "IoT y Big Data", "Automatización y Robótica (RPA)", "Cloud Computing y Seguridad", "Blockchain", "Accesibilidad digital", "Desarrollo seguro de software (DevSecOps)", "Otras (especifique)"] },
      { n: "105", type: "multi", area: "OTI", label: "Temas de interés para recibir capacitaciones (personal de transformación digital)", options: ["Transformación digital", "Digitalización de servicios", "Gestión de proyectos", "Innovación digital en el sector público", "Ciberseguridad", "Datos abiertos", "IA y aprendizaje automático", "Accesibilidad digital", "Otros (especifique)"] },
      { n: "106", type: "multi", area: "OTI", label: "Programas de capacitación en tecnologías digitales que ofrece a todo su personal", help: "Marque todas las que correspondan.", options: ["Inteligencia artificial", "Analítica de datos", "Gobierno digital", "Transformación digital", "Seguridad y confianza digital", "Seguridad de la información", "Otras (especifique)"] },
      { n: "107", type: "multi", area: "OTI", label: "Herramientas para compartir conocimientos y experiencias entre el personal", help: "Marque todas las que correspondan.", options: ["Intranet corporativa", "Plataformas de colaboración (Teams u otros)", "Repositorios de documentos (SharePoint, Google Drive)", "Plataformas de aprendizaje en línea (LMS)", "Reuniones virtuales (Zoom, Teams, Meet)", "Otras (especifique)"] },
      { n: "108", type: "multi", area: "OTI", label: "Iniciativas de innovación/validación tecnológica en entornos de pruebas (sandbox)", help: "Marque todas las que correspondan.", options: ["Pruebas de concepto (PoC) de nuevas arquitecturas", "Entrenamiento y validación de modelos de IA", "Simulaciones de ciberataques (Red/Blue Teaming)", "Pruebas de interoperabilidad e integración (APIs)", "Experimentación con blockchain / DLT", "Validación de automatización (RPA) antes de producción", "No cuenta con entornos sandbox", "Otro (especifique)"] }
    ]
  },
  {
    id: "X",
    titulo: "X - Innovación Digital",
    questions: [
      { n: "109", type: "yesno", area: "OTI", label: "¿Existen iniciativas de innovación en servicios digitales en su entidad?", help: "Considere proyectos, pilotos o mejoras en cualquier etapa." },
      { n: "110", type: "number", area: "OTI", label: "¿Cuántos proyectos de innovación digital ha desarrollado en 2025?", help: "Concluidos, en ejecución o en etapa piloto." },
      { n: "111", type: "single", area: "OTI", label: "¿La entidad colabora con otras instituciones públicas en innovación digital?", options: ["Sí, de forma activa", "Ocasionalmente", "No colabora", "No lo sé"] },
      { n: "112", type: "yesno", area: "OTI", label: "¿Cuenta con personal que forma parte de la Red Nacional de Innovadores Digitales?" },
      { n: "113", type: "single", area: "OTI", label: "¿La entidad colabora con instituciones privadas en innovación digital?", options: ["Sí, de forma activa", "Ocasionalmente", "No colabora", "No lo sé"] },
      { n: "114", type: "multi", area: "OTI", label: "Tecnologías emergentes que se están implementando o utilizando", help: "Marque todas las que correspondan.", options: ["IA generativa (LLMs, generación de contenido)", "IA analítica y aprendizaje automático (modelos predictivos, deep learning)", "Hiperautomatización y RPA", "Internet de las cosas (IoT)", "Blockchain y DLT", "Realidad extendida (XR)", "Gemelos digitales", "Otras (computación cuántica, nanotecnología, etc.)"] },
      { n: "115", type: "single", area: "OTI", label: "¿Cuántas personas se dedican exclusivamente a proyectos de innovación digital?", options: ["Ninguna", "De 1 a 5", "De 6 a 15", "Más de 15"] },
      { n: "116", type: "single", area: "RRHH", label: "¿Existen programas de incentivos para equipos que proponen innovaciones?", options: ["Sí, con programas formales", "Reconocimiento no monetario", "No existen incentivos", "No lo sé"] },
      { n: "117", type: "multi", area: "OTI", label: "Principales barreras para innovar digitalmente", help: "Marque todas las que correspondan.", options: ["Presupuesto insuficiente", "Falta de personal especializado", "Cultura organizacional o resistencia al cambio", "Limitaciones normativas", "Falta de apoyo de la Alta Dirección", "No existen barreras", "Otros (especifique)"] },
      { n: "118", type: "single", area: "OTI", label: "¿La entidad utiliza metodologías ágiles para proyectos de innovación digital?", options: ["Sí, en todos los proyectos", "Sí, en algunos proyectos", "No se utilizan metodologías ágiles", "No lo sé"] },
      { n: "119", type: "single", area: "OTI", label: "¿La entidad cuenta con un laboratorio de innovación?", options: ["Sí", "No, pero está en planificación", "No"] },
      { n: "120", type: "number", area: "OTI", label: "¿Cuántos proyectos de innovación digital se ejecutaron/ejecutan en el laboratorio de innovación?" }
    ]
  },
  {
    id: "XI",
    titulo: "XI - Inteligencia Artificial",
    questions: [
      { n: "121", type: "yesno", area: "OTI", label: "¿La entidad está implementando actualmente el uso de inteligencia artificial?" },
      { n: "122", type: "multi", area: "OTI", label: "¿Qué tipo de soluciones/tecnologías de IA está implementando?", help: "Marque todas las que correspondan.", options: ["IA para análisis de datos", "IA para automatización de procesos", "IA para chatbots o asistentes virtuales", "IA para ciberseguridad", "Otros (especifique)"] },
      { n: "123", type: "yesno", area: "OTI", label: "¿Utiliza IA para mejorar la experiencia de las personas usuarias en sus servicios digitales?" },
      { n: "124", type: "single", area: "OTI", label: "¿El personal recibe capacitación sobre uso y aplicación de la IA?", options: ["Sí, de forma regular", "Sí, de forma ocasional", "No reciben capacitación"] },
      { n: "125", type: "multi", area: "OTI", label: "El uso de IA en la entidad corresponde a:", help: "Marque todas las que correspondan.", options: ["Herramientas de IA a nivel usuario (ChatGPT, Gemini, Copilot, DeepSeek, etc.)", "Soluciones desarrolladas con IA integradas a procesos institucionales", "Otro tipo de uso (especifique)"] },
      { n: "126", type: "single", area: "OTI", label: "Nivel de uso de soluciones desarrolladas con IA en la entidad", options: ["Desconocimiento sobre el uso de soluciones de IA", "Investigación o evaluación de posibles soluciones", "Desarrollo de soluciones de IA", "Implementación de soluciones de IA", "Operación regular de soluciones de IA"] },
      { n: "127", type: "single", area: "OTI", label: "Situación de la IA respecto al Plan de Gobierno Digital (PGD)", options: ["Tiene proyectos de IA en el PGD, aún no implementados", "Tiene proyectos de IA del PGD en fase piloto", "Tiene proyectos de IA del PGD implementados u operativos", "No ha incorporado proyectos de IA en el PGD"] },
      { n: "128", type: "single", area: "OTI", label: "¿El personal recibe capacitación sobre estándares éticos para desarrollo y uso de IA?", options: ["Sí, de forma regular", "Sí, de forma ocasional", "No reciben capacitación"] }
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONNAIRE, AREAS };
}
