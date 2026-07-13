// Servidor del Sistema de Apoyo - Encuesta OTI
// Base de datos LOCAL en archivo SQLite (data/encuesta.db).
// No requiere servicios externos ni internet: todo corre en la máquina.

const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "encuesta.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    anio TEXT,
    estado TEXT NOT NULL DEFAULT 'Borrador',
    respuestas TEXT NOT NULL DEFAULT '{}',
    creado TEXT NOT NULL,
    actualizado TEXT NOT NULL
  );
`);

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

const now = () => new Date().toISOString();

// Listar registros (sin respuestas, para la lista)
app.get("/api/registros", (_req, res) => {
  const rows = db
    .prepare("SELECT id, nombre, anio, estado, creado, actualizado FROM registros ORDER BY actualizado DESC")
    .all();
  // progreso: contar respuestas por registro
  const withProgress = rows.map((r) => {
    const full = db.prepare("SELECT respuestas FROM registros WHERE id = ?").get(r.id);
    let count = 0;
    try {
      const obj = JSON.parse(full.respuestas || "{}");
      count = Object.keys(obj).filter((k) => {
        const v = obj[k];
        if (v == null || v === "") return false;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") return Object.values(v).some((x) => x !== "" && x != null);
        return true;
      }).length;
    } catch (e) {}
    return { ...r, respondidas: count };
  });
  res.json(withProgress);
});

// Obtener un registro completo
app.get("/api/registros/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM registros WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "No encontrado" });
  row.respuestas = JSON.parse(row.respuestas || "{}");
  res.json(row);
});

// Crear registro
app.post("/api/registros", (req, res) => {
  const { nombre, anio } = req.body || {};
  if (!nombre || !String(nombre).trim())
    return res.status(400).json({ error: "El nombre es obligatorio" });
  const ts = now();
  const info = db
    .prepare("INSERT INTO registros (nombre, anio, estado, respuestas, creado, actualizado) VALUES (?,?,?,?,?,?)")
    .run(String(nombre).trim(), anio || "", "Borrador", "{}", ts, ts);
  const row = db.prepare("SELECT * FROM registros WHERE id = ?").get(info.lastInsertRowid);
  row.respuestas = {};
  res.status(201).json(row);
});

// Actualizar respuestas / metadatos
app.put("/api/registros/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM registros WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "No encontrado" });
  const { nombre, anio, estado, respuestas } = req.body || {};
  const nuevoNombre = nombre != null ? String(nombre).trim() : row.nombre;
  const nuevoAnio = anio != null ? anio : row.anio;
  const nuevoEstado = estado != null ? estado : row.estado;
  const nuevasResp = respuestas != null ? JSON.stringify(respuestas) : row.respuestas;
  db.prepare(
    "UPDATE registros SET nombre=?, anio=?, estado=?, respuestas=?, actualizado=? WHERE id=?"
  ).run(nuevoNombre, nuevoAnio, nuevoEstado, nuevasResp, now(), req.params.id);
  const updated = db.prepare("SELECT * FROM registros WHERE id = ?").get(req.params.id);
  updated.respuestas = JSON.parse(updated.respuestas || "{}");
  res.json(updated);
});

// Duplicar registro
app.post("/api/registros/:id/duplicar", (req, res) => {
  const row = db.prepare("SELECT * FROM registros WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "No encontrado" });
  const ts = now();
  const info = db
    .prepare("INSERT INTO registros (nombre, anio, estado, respuestas, creado, actualizado) VALUES (?,?,?,?,?,?)")
    .run(row.nombre + " (copia)", row.anio, "Borrador", row.respuestas, ts, ts);
  const nuevo = db.prepare("SELECT * FROM registros WHERE id = ?").get(info.lastInsertRowid);
  nuevo.respuestas = JSON.parse(nuevo.respuestas || "{}");
  res.status(201).json(nuevo);
});

// Eliminar registro
app.delete("/api/registros/:id", (req, res) => {
  db.prepare("DELETE FROM registros WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sistema de Apoyo Encuesta OTI corriendo en http://localhost:${PORT}`);
});
