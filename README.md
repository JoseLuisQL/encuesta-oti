# Sistema de Apoyo · Encuesta OTI

Material de apoyo para recopilar toda la información del **cuestionario de gobierno
digital (OTI)** de la **Municipalidad Distrital de Oronccoy**, antes de vaciarla en
la encuesta oficial.

- **128 preguntas** organizadas en **11 secciones** (de las más sencillas a las más
  trabajosas).
- **Base de datos local** (archivo SQLite en `data/encuesta.db`) — no necesita internet
  ni servicios externos.
- **Guardado automático** mientras escribes.
- **Etiqueta de área** en cada pregunta: te dice a quién conviene consultar
  (Gerencia, RRHH, Presupuesto, Abastecimiento, Imagen, Trámite/Archivo o la propia OTI).
  Puedes **filtrar** las preguntas por área dentro de cada sección.
- **Varios registros / borradores**: crea, duplica y elimina formularios (por ejemplo,
  un borrador y una versión final, o distintos años).
- **Exportación**:
  - **Excel** (.xlsx) con una hoja por sección + hoja de resumen.
  - **PDF** completo ordenado por las 11 secciones.
  - **PDF por área** — ideal para imprimir y llevárselo a cada responsable con solo
    las preguntas que le tocan.

## Cómo usarlo

```bash
npm install     # solo la primera vez
npm start       # arranca en http://localhost:5000
```

Abre `http://localhost:5000` en el navegador.

1. Pulsa **+ Nuevo registro** (ya viene precargado el nombre y los datos fijos de la
   entidad: departamento AYACUCHO, provincia LA MAR, distrito ORONCCOY).
2. Recorre las secciones desde el panel lateral izquierdo. El contador `x/y` muestra
   cuántas preguntas llevas respondidas en cada sección.
3. Usa los **filtros de área** para ver solo lo que debe responder cada oficina.
4. Cuando termines (o para consultar a otra área), pulsa **⬇ Exportar** y elige
   Excel o PDF.

## Áreas / responsables sugeridos

| Etiqueta                     | Qué preguntas suele responder                                  |
|------------------------------|----------------------------------------------------------------|
| **OTI / TI**                 | Infraestructura, seguridad, datos, nube, IA, innovación        |
| **Gerencia Municipal**       | TUPA, digitalización de servicios, satisfacción ciudadana      |
| **Recursos Humanos**         | N.º de personal, teletrabajo, formación, incentivos            |
| **Presupuesto / Planeamiento** | Presupuesto para TI, costos de mantenimiento y plataformas   |
| **Abastecimiento / Logística** | Origen y estado de equipos (compras, donaciones)             |
| **Imagen / Comunicaciones**  | Redes sociales                                                 |
| **Trámite / Archivo**        | Gestión documental, casilla electrónica                        |

> Las etiquetas son una **sugerencia**; ajústalas verbalmente según cómo esté
> organizada tu entidad. La responsabilidad final de consolidar la información es
> de la OTI.

## Notas técnicas

- **Backend**: Node.js + Express (`server.js`), base de datos SQLite con `better-sqlite3`.
- **Frontend**: HTML/CSS/JS puro (sin build). Exportación con SheetJS (Excel) y
  jsPDF + AutoTable (PDF), cargados por CDN.
- **Estructura del cuestionario**: `public/questionnaire.js` (128 preguntas con su tipo,
  opciones y área). Es el único archivo a tocar si el cuestionario oficial cambia.
- La base de datos vive en `data/encuesta.db`. Para respaldar tus datos, copia ese archivo.
