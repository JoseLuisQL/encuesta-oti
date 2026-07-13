// ============================================================
//  Sistema de Apoyo · Encuesta OTI · App (frontend, sin build)
// ============================================================
"use strict";

const TOTAL_PREGUNTAS = QUESTIONNAIRE.reduce((a, s) => a + s.questions.length, 0);
const ENTIDAD = "MUNICIPALIDAD DISTRITAL DE ORONCCOY";

// Iconos SVG profesionales (estilo Lucide, trazo). Sin emojis.
function svg(paths, size) {
  return `<svg class="icon" width="${size || 16}" height="${size || 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
const ICON = {
  plus: () => svg('<path d="M12 5v14M5 12h14"/>'),
  arrowLeft: () => svg('<path d="M19 12H5M12 19l-7-7 7-7"/>'),
  arrowRight: () => svg('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  download: () => svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>'),
  check: () => svg('<path d="M20 6L9 17l-5-5"/>', 14),
  spinner: () => svg('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>', 14),
  user: () => svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 12),
  sheet: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
  fileText: () => svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>'),
  users: () => svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  open: () => svg('<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>', 14),
  copy: () => svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', 14),
  trash: () => svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>', 14),
};

const state = {
  view: "lista",       // 'lista' | 'editor'
  registros: [],
  actual: null,        // registro cargado en editor
  seccionIdx: 0,
  filtroArea: "TODAS",
  saveTimer: null,
  saveState: "idle",   // idle | saving | saved
};

// ---------- API ----------
const api = {
  async list() { return (await fetch("/api/registros")).json(); },
  async get(id) { return (await fetch(`/api/registros/${id}`)).json(); },
  async create(body) {
    return (await fetch("/api/registros", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  },
  async update(id, body) {
    return (await fetch(`/api/registros/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  },
  async duplicate(id) { return (await fetch(`/api/registros/${id}/duplicar`, { method: "POST" })).json(); },
  async remove(id) { return (await fetch(`/api/registros/${id}`, { method: "DELETE" })).json(); },
};

// ---------- Utilidades ----------
function toast(msg, type = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show " + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.className = "toast " + type), 2600);
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

// ¿Está respondida una pregunta?
function isAnswered(q, val) {
  if (val == null || val === "") return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object") return Object.values(val).some((v) => v !== "" && v != null);
  return true;
}
function seccionProgreso(sec, respuestas) {
  let done = 0;
  sec.questions.forEach((q) => { if (isAnswered(q, respuestas[q.n])) done++; });
  return { done, total: sec.questions.length };
}
function totalRespondidas(respuestas) {
  let done = 0;
  QUESTIONNAIRE.forEach((s) => s.questions.forEach((q) => { if (isAnswered(q, respuestas[q.n])) done++; }));
  return done;
}

// ---------- Guardado con debounce ----------
function scheduleSave() {
  state.saveState = "saving";
  updateSaveIndicator();
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(doSave, 700);
}
async function doSave() {
  if (!state.actual) return;
  try {
    const r = state.actual;
    await api.update(r.id, { nombre: r.nombre, anio: r.anio, estado: r.estado, respuestas: r.respuestas });
    state.saveState = "saved";
    updateSaveIndicator();
  } catch (e) {
    state.saveState = "idle";
    toast("Error al guardar", "error");
  }
}
function updateSaveIndicator() {
  const el = document.getElementById("save-state");
  if (!el) return;
  if (state.saveState === "saving") el.innerHTML = `<span class="spin">${ICON.spinner()}</span> Guardando…`, el.className = "save-state saving";
  else if (state.saveState === "saved") el.innerHTML = `${ICON.check()} Guardado automáticamente`, el.className = "save-state saved";
  else el.innerHTML = "", el.className = "save-state";
}

// ---------- Router simple ----------
async function goLista() {
  state.view = "lista";
  state.actual = null;
  render();
  state.registros = await api.list();
  render();
}
async function openEditor(id) {
  const reg = await api.get(id);
  if (reg.error) { toast("Registro no encontrado", "error"); return goLista(); }
  state.actual = reg;
  state.view = "editor";
  state.seccionIdx = 0;
  state.filtroArea = "TODAS";
  state.saveState = "idle";
  render();
}

// ============================================================
//  RENDER
// ============================================================
function render() {
  const app = document.getElementById("app");
  app.innerHTML = topbar() + (state.view === "lista" ? viewLista() : viewEditor());
  bindGlobal();
  if (state.view === "editor") bindEditor();
}

function topbar() {
  return `
    <div class="topbar">
      <div class="logo">O</div>
      <div>
        <h1>Sistema de Apoyo · Encuesta OTI</h1>
        <div class="sub">${esc(ENTIDAD)}</div>
      </div>
      <div class="spacer"></div>
      ${state.view === "editor" ? `<button class="home-btn" data-action="ir-lista">${ICON.arrowLeft()} Volver a registros</button>` : ""}
    </div>`;
}

// ---------- Vista LISTA ----------
function viewLista() {
  const regs = state.registros || [];
  const cards = regs.length
    ? `<div class="cards">${regs.map(cardRegistro).join("")}</div>`
    : `<div class="empty">
         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>
         <p style="font-weight:600;color:var(--text)">Aún no tienes registros</p>
         <p>Crea tu primer formulario de apoyo para empezar a recopilar la información.</p>
         <button class="btn" data-action="nuevo" style="margin-top:14px">${ICON.plus()} Crear primer registro</button>
       </div>`;

  return `
    <div class="container">
      <div class="hero">
        <h2>Material de apoyo para la Encuesta de Gobierno Digital</h2>
        <p>Recopila y organiza aquí toda la información antes de vaciarla en la encuesta oficial. Cada pregunta indica a qué área conviene consultar (Gerencia, RRHH, Presupuesto, etc.). El sistema guarda automáticamente en una base de datos local y te permite exportar a Excel y PDF.</p>
        <div class="stats">
          <div class="stat"><b>${TOTAL_PREGUNTAS}</b><span>preguntas</span></div>
          <div class="stat"><b>${QUESTIONNAIRE.length}</b><span>secciones</span></div>
          <div class="stat"><b>${regs.length}</b><span>registros guardados</span></div>
        </div>
      </div>
      <div class="section-head">
        <h3>Mis registros</h3>
        <button class="btn" data-action="nuevo">${ICON.plus()} Nuevo registro</button>
      </div>
      ${cards}
    </div>`;
}

function cardRegistro(r) {
  const total = TOTAL_PREGUNTAS;
  const done = r.respondidas || 0;
  const pct = Math.round((done / total) * 100);
  const estadoClass = r.estado === "Completo" ? "completo" : r.estado === "En revisión" ? "revision" : "borrador";
  return `
    <div class="reg-card" data-open="${r.id}">
      <div class="rc-top">
        <div>
          <h4>${esc(r.nombre)}</h4>
          <div class="meta">${r.anio ? "Año " + esc(r.anio) + " · " : ""}Actualizado: ${fecha(r.actualizado)}</div>
        </div>
        <span class="badge ${estadoClass}">${esc(r.estado)}</span>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:5px">
          <span>${done} de ${total} respondidas</span><span>${pct}%</span>
        </div>
        <div class="progress"><div style="width:${pct}%"></div></div>
      </div>
      <div class="rc-actions" data-stop>
        <button class="btn sm" data-open="${r.id}">${ICON.open()} Abrir</button>
        <button class="btn sm secondary" data-dup="${r.id}">${ICON.copy()} Duplicar</button>
        <button class="btn sm secondary" data-del="${r.id}">${ICON.trash()} Eliminar</button>
      </div>
    </div>`;
}

function bindGlobal() {
  document.querySelectorAll("[data-action='ir-lista']").forEach((b) => (b.onclick = goLista));
  document.querySelectorAll("[data-action='nuevo']").forEach((b) => (b.onclick = modalNuevo));
  document.querySelectorAll("[data-open]").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest("[data-stop]") && !e.target.hasAttribute("data-open")) return;
      e.stopPropagation();
      openEditor(el.getAttribute("data-open"));
    };
  });
  document.querySelectorAll("[data-dup]").forEach((b) => (b.onclick = async (e) => {
    e.stopPropagation();
    await api.duplicate(b.getAttribute("data-dup"));
    toast("Registro duplicado", "success");
    goLista();
  }));
  document.querySelectorAll("[data-del]").forEach((b) => (b.onclick = async (e) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    await api.remove(b.getAttribute("data-del"));
    toast("Registro eliminado");
    goLista();
  }));
}

// ---------- Modal nuevo registro ----------
function modalNuevo() {
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  const anio = new Date().getFullYear();
  wrap.innerHTML = `
    <div class="modal">
      <h3>Nuevo registro</h3>
      <p>Crea un formulario de apoyo para recopilar la información.</p>
      <div class="field">
        <label>Nombre del registro</label>
        <input type="text" id="m-nombre" value="Encuesta OTI ${anio}" placeholder="Ej. Encuesta OTI ${anio}" />
      </div>
      <div class="field">
        <label>Año (opcional)</label>
        <input type="text" id="m-anio" value="${anio}" placeholder="${anio}" />
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="m-cancel">Cancelar</button>
        <button class="btn" id="m-ok">Crear registro</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.onclick = (e) => { if (e.target === wrap) close(); };
  wrap.querySelector("#m-cancel").onclick = close;
  wrap.querySelector("#m-nombre").focus();
  wrap.querySelector("#m-ok").onclick = async () => {
    const nombre = wrap.querySelector("#m-nombre").value.trim();
    const anioV = wrap.querySelector("#m-anio").value.trim();
    if (!nombre) { toast("Ingresa un nombre", "error"); return; }
    const reg = await api.create({ nombre, anio: anioV });
    close();
    // precargar valores por defecto (departamento, provincia, distrito, entidad)
    QUESTIONNAIRE.forEach((s) => s.questions.forEach((q) => {
      if (q.default) reg.respuestas[q.n] = q.default;
    }));
    if (Object.keys(reg.respuestas).length) await api.update(reg.id, { respuestas: reg.respuestas });
    toast("Registro creado", "success");
    openEditor(reg.id);
  };
}

// ============================================================
//  Vista EDITOR
// ============================================================
function viewEditor() {
  const r = state.actual;
  if (!r) return `<div class="container">Cargando…</div>`;
  const resp = r.respuestas || {};
  const done = totalRespondidas(resp);
  const pct = Math.round((done / TOTAL_PREGUNTAS) * 100);

  // sidebar de secciones
  const nav = QUESTIONNAIRE.map((s, i) => {
    const p = seccionProgreso(s, resp);
    const complete = p.done === p.total;
    return `<button class="nav-item ${i === state.seccionIdx ? "active" : ""}" data-sec="${i}">
        <span style="display:flex;align-items:center;gap:8px;min-width:0">
          <span class="nav-dot ${complete ? "done" : ""}"></span>
          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(s.id)}. ${esc(s.titulo.replace(/^[IVX]+ - /, ""))}</span>
        </span>
        <span class="count">${p.done}/${p.total}</span>
      </button>`;
  }).join("");

  const sec = QUESTIONNAIRE[state.seccionIdx];
  const secResp = sec.questions.filter((q) => state.filtroArea === "TODAS" || q.area === state.filtroArea);
  const preguntas = secResp.map((q) => renderQuestion(q, resp[q.n])).join("");
  const emptyFiltro = secResp.length === 0
    ? `<div class="empty" style="padding:36px"><p>No hay preguntas de esta área en esta sección.</p></div>` : "";

  // chips de área presentes
  const areasEnSeccion = [...new Set(sec.questions.map((q) => q.area))];
  const chips = `<span class="lbl">Filtrar por área:</span>
    <button class="chip ${state.filtroArea === "TODAS" ? "active" : ""}" data-area="TODAS" style="${state.filtroArea === "TODAS" ? "background:var(--text)" : ""}">Todas</button>` +
    areasEnSeccion.map((a) => {
      const info = AREAS[a] || { label: a, color: "#64748b" };
      const active = state.filtroArea === a;
      return `<button class="chip ${active ? "active" : ""}" data-area="${a}" style="${active ? "background:" + info.color : ""}">
        <span class="dot" style="background:${info.color}"></span>${esc(info.label)}</button>`;
    }).join("");

  return `
    <div class="container">
      <div class="editor-toolbar">
        <div class="title-block">
          <div class="name" contenteditable="false">${esc(r.nombre)}</div>
          <div class="info">${done} de ${TOTAL_PREGUNTAS} respondidas · ${pct}% completado</div>
        </div>
        <div id="save-state" class="save-state"></div>
        <select id="estado-sel" style="width:auto">
          <option value="Borrador" ${r.estado === "Borrador" ? "selected" : ""}>Borrador</option>
          <option value="En revisión" ${r.estado === "En revisión" ? "selected" : ""}>En revisión</option>
          <option value="Completo" ${r.estado === "Completo" ? "selected" : ""}>Completo</option>
        </select>
        <div class="dropdown" id="export-dd">
          <button class="btn success" id="export-btn">${ICON.download()} Exportar</button>
        </div>
      </div>

      <div class="mobile-secnav">
        <label>Sección</label>
        <select id="mobile-sec-sel">
          ${QUESTIONNAIRE.map((s, i) => {
            const p = seccionProgreso(s, resp);
            return `<option value="${i}" ${i === state.seccionIdx ? "selected" : ""}>${esc(s.id)}. ${esc(s.titulo.replace(/^[IVX]+ - /, ""))} (${p.done}/${p.total})</option>`;
          }).join("")}
        </select>
      </div>

      <div class="editor-layout">
        <div class="sidebar">
          <h5>Secciones</h5>
          ${nav}
        </div>
        <div class="editor-main">
          <div class="filter-bar">${chips}</div>
          <div class="q-section-title">${esc(sec.titulo)}</div>
          ${emptyFiltro}
          ${preguntas}
          <div class="editor-footer">
            <button class="btn secondary" data-nav="prev" ${state.seccionIdx === 0 ? "disabled" : ""}>${ICON.arrowLeft()} Sección anterior</button>
            <button class="btn" data-nav="next" ${state.seccionIdx === QUESTIONNAIRE.length - 1 ? "disabled" : ""}>Siguiente sección ${ICON.arrowRight()}</button>
          </div>
        </div>
      </div>
    </div>`;
}

function areaTag(area) {
  const info = AREAS[area] || { label: area, color: "#64748b" };
  return `<span class="area-tag" style="background:${info.color}" title="Conviene consultar a: ${esc(info.label)}">${ICON.user()}${esc(info.label)}</span>`;
}

function renderQuestion(q, val) {
  const answered = isAnswered(q, val);
  let body = "";
  if (q.type === "text") {
    body = `<input type="text" data-q="${q.n}" value="${esc(val || "")}" placeholder="Escriba aquí…" />`;
  } else if (q.type === "number") {
    body = `<input type="number" data-q="${q.n}" value="${esc(val == null ? "" : val)}" placeholder="0" min="0" step="any" />`;
  } else if (q.type === "yesno") {
    body = `<div class="yesno">
      <label class="opt ${val === "Sí" ? "checked" : ""}"><input type="radio" name="q${q.n}" data-q="${q.n}" value="Sí" ${val === "Sí" ? "checked" : ""}/> Sí</label>
      <label class="opt ${val === "No" ? "checked" : ""}"><input type="radio" name="q${q.n}" data-q="${q.n}" value="No" ${val === "No" ? "checked" : ""}/> No</label>
    </div>`;
  } else if (q.type === "single") {
    body = `<div class="opt-list">${q.options.map((o) =>
      `<label class="opt ${val === o ? "checked" : ""}"><input type="radio" name="q${q.n}" data-q="${q.n}" value="${esc(o)}" ${val === o ? "checked" : ""}/> ${esc(o)}</label>`
    ).join("")}</div>`;
  } else if (q.type === "multi") {
    const arr = Array.isArray(val) ? val : [];
    body = `<div class="opt-list">${q.options.map((o) =>
      `<label class="opt ${arr.includes(o) ? "checked" : ""}"><input type="checkbox" data-q="${q.n}" data-multi value="${esc(o)}" ${arr.includes(o) ? "checked" : ""}/> ${esc(o)}</label>`
    ).join("")}</div>`;
  } else if (q.type === "matrix") {
    const obj = (val && typeof val === "object") ? val : {};
    const head = `<tr><th></th>${q.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
    const rows = q.rows.map((rw, ri) => {
      const cells = q.cols.map((c, ci) => {
        const key = ri + "_" + ci;
        return `<td><input type="text" data-q="${q.n}" data-cell="${key}" value="${esc(obj[key] || "")}" placeholder="—" /></td>`;
      }).join("");
      return `<tr><td class="rowlabel">${esc(rw)}</td>${cells}</tr>`;
    }).join("");
    body = `<div class="matrix-wrap"><table class="matrix"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
  }

  return `
    <div class="q-card ${answered ? "answered" : ""}" id="qc-${q.n}">
      <div class="q-head">
        <span class="q-num">${esc(q.n)}</span>
        <div style="flex:1;min-width:0">
          <div class="q-label">${esc(q.label)}</div>
          ${q.help ? `<div class="q-help">${esc(q.help)}</div>` : ""}
        </div>
        ${areaTag(q.area)}
      </div>
      ${body}
    </div>`;
}

// ---------- Bindings del editor ----------
function bindEditor() {
  updateSaveIndicator();

  // navegación de secciones (sidebar)
  document.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => {
    state.seccionIdx = parseInt(b.getAttribute("data-sec"));
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  // navegación de secciones (selector móvil)
  const mobSel = document.getElementById("mobile-sec-sel");
  if (mobSel) mobSel.onchange = () => {
    state.seccionIdx = parseInt(mobSel.value);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // prev / next
  document.querySelectorAll("[data-nav]").forEach((b) => (b.onclick = () => {
    const dir = b.getAttribute("data-nav");
    if (dir === "prev" && state.seccionIdx > 0) state.seccionIdx--;
    if (dir === "next" && state.seccionIdx < QUESTIONNAIRE.length - 1) state.seccionIdx++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  // filtros de área
  document.querySelectorAll("[data-area]").forEach((b) => (b.onclick = () => {
    state.filtroArea = b.getAttribute("data-area");
    render();
  }));
  // estado
  const est = document.getElementById("estado-sel");
  if (est) est.onchange = () => { state.actual.estado = est.value; scheduleSave(); };

  // inputs de texto / número
  document.querySelectorAll("input[type=text][data-q]:not([data-cell]), input[type=number][data-q], textarea[data-q]").forEach((inp) => {
    inp.oninput = () => {
      state.actual.respuestas[inp.getAttribute("data-q")] = inp.value;
      markAnswered(inp);
      scheduleSave();
    };
  });
  // radios (yesno + single)
  document.querySelectorAll("input[type=radio][data-q]").forEach((inp) => {
    inp.onchange = () => {
      state.actual.respuestas[inp.getAttribute("data-q")] = inp.value;
      refreshOptStyles(inp);
      markAnswered(inp);
      scheduleSave();
    };
  });
  // checkboxes (multi)
  document.querySelectorAll("input[type=checkbox][data-multi]").forEach((inp) => {
    inp.onchange = () => {
      const q = inp.getAttribute("data-q");
      const cur = Array.isArray(state.actual.respuestas[q]) ? state.actual.respuestas[q] : [];
      const v = inp.value;
      const next = inp.checked ? [...new Set([...cur, v])] : cur.filter((x) => x !== v);
      state.actual.respuestas[q] = next;
      inp.closest(".opt").classList.toggle("checked", inp.checked);
      markAnswered(inp);
      scheduleSave();
    };
  });
  // celdas de matriz
  document.querySelectorAll("input[data-cell]").forEach((inp) => {
    inp.oninput = () => {
      const q = inp.getAttribute("data-q");
      const cell = inp.getAttribute("data-cell");
      if (typeof state.actual.respuestas[q] !== "object" || Array.isArray(state.actual.respuestas[q]) || !state.actual.respuestas[q])
        state.actual.respuestas[q] = {};
      state.actual.respuestas[q][cell] = inp.value;
      markAnswered(inp);
      scheduleSave();
    };
  });

  bindGlobal();
  bindExport();
}

function refreshOptStyles(inp) {
  const name = inp.getAttribute("name");
  document.querySelectorAll(`input[name="${name}"]`).forEach((r) => r.closest(".opt").classList.toggle("checked", r.checked));
}
function markAnswered(inp) {
  const card = inp.closest(".q-card");
  if (!card) return;
  const q = QUESTIONNAIRE[state.seccionIdx].questions.find((x) => x.n === inp.getAttribute("data-q"));
  if (q) card.classList.toggle("answered", isAnswered(q, state.actual.respuestas[q.n]));
  // actualizar contador del toolbar y sidebar sin re-render completo
  const done = totalRespondidas(state.actual.respuestas);
  const info = document.querySelector(".title-block .info");
  if (info) info.textContent = `${done} de ${TOTAL_PREGUNTAS} respondidas · ${Math.round(done / TOTAL_PREGUNTAS * 100)}% completado`;
}

// ============================================================
//  EXPORTACIÓN
// ============================================================
function bindExport() {
  const dd = document.getElementById("export-dd");
  const btn = document.getElementById("export-btn");
  if (!btn) return;
  btn.onclick = (e) => {
    e.stopPropagation();
    const existing = dd.querySelector(".dropdown-menu");
    if (existing) { existing.remove(); return; }
    const menu = document.createElement("div");
    menu.className = "dropdown-menu";
    menu.innerHTML = `
      <button data-exp="excel">${ICON.sheet()} Exportar a Excel (.xlsx)</button>
      <button data-exp="pdf">${ICON.fileText()} Exportar a PDF</button>
      <button data-exp="pdf-area">${ICON.users()} PDF por área (para consultar)</button>`;
    dd.appendChild(menu);
    menu.querySelector("[data-exp=excel]").onclick = () => { menu.remove(); exportExcel(); };
    menu.querySelector("[data-exp=pdf]").onclick = () => { menu.remove(); exportPDF(false); };
    menu.querySelector("[data-exp=pdf-area]").onclick = () => { menu.remove(); exportPDF(true); };
    setTimeout(() => document.addEventListener("click", function h() { menu.remove(); document.removeEventListener("click", h); }), 0);
  };
}

// Convierte una respuesta a texto legible (para Excel/PDF de una sola celda)
function valorTexto(q, val) {
  if (!isAnswered(q, val)) return "";
  if (q.type === "multi") return (val || []).join("; ");
  if (q.type === "matrix") {
    const obj = val || {};
    const lines = [];
    q.rows.forEach((rw, ri) => {
      const parts = q.cols.map((c, ci) => {
        const v = obj[ri + "_" + ci];
        return v ? `${c}: ${v}` : null;
      }).filter(Boolean);
      if (parts.length) lines.push(`${rw} — ${parts.join(", ")}`);
    });
    return lines.join("\n");
  }
  return String(val);
}

function exportExcel() {
  const r = state.actual, resp = r.respuestas || {};
  const wb = XLSX.utils.book_new();

  // Hoja resumen
  const resumen = [
    ["SISTEMA DE APOYO · ENCUESTA OTI"],
    [ENTIDAD],
    [],
    ["Registro", r.nombre],
    ["Año", r.anio || ""],
    ["Estado", r.estado],
    ["Respondidas", `${totalRespondidas(resp)} de ${TOTAL_PREGUNTAS}`],
    ["Exportado", new Date().toLocaleString("es-PE")],
  ];
  const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
  wsResumen["!cols"] = [{ wch: 20 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

  // Una hoja por sección
  QUESTIONNAIRE.forEach((sec) => {
    const rows = [["N°", "Pregunta", "Área a consultar", "Respuesta"]];
    sec.questions.forEach((q) => {
      const areaLbl = (AREAS[q.area] || {}).label || q.area;
      if (q.type === "matrix") {
        // encabezado de la pregunta
        rows.push([q.n, q.label, areaLbl, ""]);
        const obj = resp[q.n] || {};
        q.rows.forEach((rw, ri) => {
          q.cols.forEach((c, ci) => {
            const v = obj[ri + "_" + ci];
            if (v !== undefined && v !== "") rows.push(["", `   ${rw} · ${c}`, "", v]);
          });
        });
      } else {
        rows.push([q.n, q.label, areaLbl, valorTexto(q, resp[q.n])]);
      }
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 6 }, { wch: 55 }, { wch: 22 }, { wch: 45 }];
    const sheetName = sec.id + "-" + sec.titulo.replace(/^[IVX]+ - /, "").slice(0, 25).replace(/[\\\/\?\*\[\]:]/g, "");
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  });

  XLSX.writeFile(wb, `Encuesta-OTI_${slug(r.nombre)}.xlsx`);
  toast("Excel exportado", "success");
}

function slug(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function exportPDF(porArea) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const r = state.actual, resp = r.respuestas || {};
  const W = doc.internal.pageSize.getWidth();

  // Portada
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, W, 120, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text("Encuesta OTI · Material de Apoyo", 40, 55);
  doc.setFontSize(12); doc.setFont("helvetica", "normal");
  doc.text(ENTIDAD, 40, 78);
  doc.setFontSize(10);
  doc.text(`Registro: ${r.nombre}${r.anio ? "  ·  Año " + r.anio : ""}  ·  Estado: ${r.estado}`, 40, 98);
  doc.setTextColor(30);
  doc.setFontSize(9);
  doc.text(`Respondidas: ${totalRespondidas(resp)} de ${TOTAL_PREGUNTAS}  ·  Exportado: ${new Date().toLocaleString("es-PE")}`, 40, 140);
  if (porArea) doc.text("Modo: agrupado por área a consultar", 40, 155);

  let startY = porArea ? 170 : 155;

  if (!porArea) {
    // Por secciones (orden natural del cuestionario)
    QUESTIONNAIRE.forEach((sec) => {
      const bodyRows = [];
      sec.questions.forEach((q) => {
        bodyRows.push([q.n, q.label + (q.help ? "\n(" + q.help + ")" : ""), (AREAS[q.area] || {}).label || q.area, valorTexto(q, resp[q.n]) || "—"]);
      });
      doc.autoTable({
        startY: startY,
        head: [[{ content: sec.titulo, colSpan: 4, styles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold", halign: "left", fontSize: 11 } }],
               ["N°", "Pregunta", "Área", "Respuesta"]],
        body: bodyRows,
        styles: { fontSize: 8, cellPadding: 4, valign: "top", overflow: "linebreak" },
        headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 240 }, 2: { cellWidth: 90 }, 3: { cellWidth: "auto" } },
        margin: { left: 40, right: 40 },
      });
      startY = doc.lastAutoTable.finalY + 16;
    });
  } else {
    // Agrupado por área
    Object.keys(AREAS).forEach((areaKey) => {
      const qs = [];
      QUESTIONNAIRE.forEach((sec) => sec.questions.forEach((q) => { if (q.area === areaKey) qs.push({ q, secId: sec.id }); }));
      if (!qs.length) return;
      const info = AREAS[areaKey];
      const rgb = hexToRgb(info.color);
      const bodyRows = qs.map(({ q, secId }) => [q.n + " (" + secId + ")", q.label, valorTexto(q, resp[q.n]) || "—"]);
      doc.autoTable({
        startY: startY,
        head: [[{ content: "CONSULTAR A: " + info.label, colSpan: 3, styles: { fillColor: rgb, textColor: 255, fontStyle: "bold", halign: "left", fontSize: 11 } }],
               ["N°", "Pregunta", "Respuesta"]],
        body: bodyRows,
        styles: { fontSize: 8, cellPadding: 4, valign: "top", overflow: "linebreak" },
        headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 300 }, 2: { cellWidth: "auto" } },
        margin: { left: 40, right: 40 },
      });
      startY = doc.lastAutoTable.finalY + 16;
    });
  }

  // pie de página con numeración
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text(`Página ${i} de ${pages}  ·  Material de apoyo – no es la encuesta oficial`, 40, doc.internal.pageSize.getHeight() - 20);
  }

  doc.save(`Encuesta-OTI_${slug(r.nombre)}${porArea ? "_por-area" : ""}.pdf`);
  toast("PDF exportado", "success");
}

function hexToRgb(hex) {
  const m = hex.replace("#", "");
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}

// ---------- Init ----------
goLista();
