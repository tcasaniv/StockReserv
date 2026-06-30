/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Equipo, Usuario, UserRole } from "../types";
import { Search, Filter, Plus, Edit2, Trash2, Check, AlertCircle, Wrench, X, Laptop, Monitor, Camera, Tablet, Layers, MapPin } from "lucide-react";

interface InventoryProps {
  equipos: Equipo[];
  onUpdateEquipos: (equipos: Equipo[]) => void;
  currentUser: Usuario | null;
}

export default function Inventory({ equipos, onUpdateEquipos, currentUser }: InventoryProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editEquipo, setEditEquipo] = useState<Partial<Equipo> | null>(null);

  // Stats Counters
  const total = equipos.length;
  const disponibles = equipos.filter((e) => e.estado === "Disponible").length;
  const prestados = equipos.filter((e) => e.estado === "Prestado").length;
  const reservados = equipos.filter((e) => e.estado === "Reservado").length;
  const mantenimientos = equipos.filter((e) => e.estado === "Mantenimiento").length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEquipo?.codigo || !editEquipo?.nombre || !editEquipo?.tipo) return;

    if (editEquipo.id_equipo) {
      // Edit
      const updated = equipos.map((eq) => (eq.id_equipo === editEquipo.id_equipo ? (editEquipo as Equipo) : eq));
      onUpdateEquipos(updated);
    } else {
      // Create new
      const newEq: Equipo = {
        id_equipo: `eq-${Date.now()}`,
        codigo: editEquipo.codigo,
        nombre: editEquipo.nombre,
        tipo: editEquipo.tipo,
        marca: editEquipo.marca || "Genérico",
        modelo: editEquipo.modelo || "N/A",
        serie: editEquipo.serie || "N/A",
        estado: editEquipo.estado as Equipo["estado"] || "Disponible",
        ubicacion: editEquipo.ubicacion || "Almacén Central",
      };
      onUpdateEquipos([...equipos, newEq]);
    }

    setIsEditing(false);
    setEditEquipo(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este equipo tecnológico de la base de datos?")) {
      const updated = equipos.filter((eq) => eq.id_equipo !== id);
      onUpdateEquipos(updated);
    }
  };

  const startEdit = (eq: Equipo) => {
    setEditEquipo(eq);
    setIsEditing(true);
  };

  const startCreate = () => {
    setEditEquipo({
      codigo: `EQ-${Math.floor(100 + Math.random() * 900)}`,
      nombre: "",
      tipo: "Laptop",
      marca: "",
      modelo: "",
      serie: "",
      estado: "Disponible",
      ubicacion: "Laboratorio Central",
    });
    setIsEditing(true);
  };

  // Filter list
  const filteredEquipos = equipos.filter((eq) => {
    const matchesSearch =
      eq.nombre.toLowerCase().includes(search.toLowerCase()) ||
      eq.codigo.toLowerCase().includes(search.toLowerCase()) ||
      eq.serie.toLowerCase().includes(search.toLowerCase()) ||
      eq.marca.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === "All" || eq.tipo === selectedType;
    const matchesStatus = selectedStatus === "All" || eq.estado === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (estado: Equipo["estado"]) => {
    switch (estado) {
      case "Disponible":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Disponible
          </span>
        );
      case "Prestado":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Prestado
          </span>
        );
      case "Reservado":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Reservado
          </span>
        );
      case "Mantenimiento":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Mantenimiento
          </span>
        );
    }
  };

  const getEquipmentIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "laptop":
        return <Laptop className="w-4 h-4 text-slate-500" />;
      case "proyector":
        return <Monitor className="w-4 h-4 text-slate-500" />;
      case "cámara":
      case "camara":
        return <Camera className="w-4 h-4 text-slate-500" />;
      case "tablet":
        return <Tablet className="w-4 h-4 text-slate-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const isUserAdminOrEncargado = currentUser?.rol === UserRole.ADMIN || currentUser?.rol === UserRole.ENCARGADO;

  return (
    <div className="space-y-6" id="inventory-section">
      {/* Real-time stock indicator counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="inventory-stats-grid">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-3xl font-black font-sans text-slate-900 leading-none">{total}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">Total Equipos</div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-3xl font-black font-sans text-emerald-700 leading-none">{disponibles}</div>
          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-2.5">Disponibles</div>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-3xl font-black font-sans text-blue-700 leading-none">{prestados}</div>
          <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-2.5">Prestados</div>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-3xl font-black font-sans text-amber-700 leading-none">{reservados}</div>
          <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-2.5">Reservados</div>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-3xl shadow-sm text-center col-span-2 md:col-span-1">
          <div className="text-3xl font-black font-sans text-rose-700 leading-none">{mantenimientos}</div>
          <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-2.5">Mantenimiento</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm" id="inventory-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="inventory-search-input"
            type="text"
            placeholder="Buscar por código, nombre, serie o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Type */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="filter-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 font-semibold text-xs focus:ring-0 cursor-pointer"
            >
              <option value="All">Todos los Tipos</option>
              <option value="Laptop">Laptops</option>
              <option value="Proyector">Proyectores</option>
              <option value="Cámara">Cámaras</option>
              <option value="Tablet">Tablets</option>
              <option value="Laboratorio Móvil">Laboratorio Móvil</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 font-semibold text-xs focus:ring-0 cursor-pointer"
            >
              <option value="All">Todos los Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
              <option value="Reservado">Reservado</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>

          {/* Add equipment button for Authorized users */}
          {isUserAdminOrEncargado && (
            <button
              id="btn-add-equipment"
              onClick={startCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-100"
            >
              <Plus className="w-4 h-4" /> Registrar Equipo
            </button>
          )}
        </div>
      </div>

      {/* Editor Modal/Drawer (Inline for compatibility and seamless iFrame feel) */}
      {isEditing && editEquipo && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm" id="equipment-editor">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-950">
              {editEquipo.id_equipo ? "Editar Equipo Tecnológico" : "Registrar Nuevo Equipo Tecnológico"}
            </h3>
            <button
              id="btn-close-editor"
              onClick={() => {
                setIsEditing(false);
                setEditEquipo(null);
              }}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4" id="equipment-form">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Código de Activo</label>
              <input
                id="eq-form-code"
                type="text"
                value={editEquipo.codigo || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, codigo: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Descriptivo</label>
              <input
                id="eq-form-name"
                type="text"
                placeholder="Ej. Laptop HP EliteBook"
                value={editEquipo.nombre || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, nombre: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Dispositivo</label>
              <select
                id="eq-form-type"
                value={editEquipo.tipo || "Laptop"}
                onChange={(e) => setEditEquipo({ ...editEquipo, tipo: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              >
                <option value="Laptop">Laptop</option>
                <option value="Proyector">Proyector</option>
                <option value="Cámara">Cámara</option>
                <option value="Tablet">Tablet</option>
                <option value="Laboratorio Móvil">Laboratorio Móvil</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marca</label>
              <input
                id="eq-form-brand"
                type="text"
                placeholder="Dell, Epson, etc."
                value={editEquipo.marca || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, marca: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Modelo</label>
              <input
                id="eq-form-model"
                type="text"
                placeholder="Vostro, PowerLite..."
                value={editEquipo.modelo || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, modelo: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Número de Serie</label>
              <input
                id="eq-form-serial"
                type="text"
                placeholder="MX112233..."
                value={editEquipo.serie || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, serie: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ubicación de Resguardo</label>
              <input
                id="eq-form-location"
                type="text"
                placeholder="Laboratorio A, Biblioteca..."
                value={editEquipo.ubicacion || ""}
                onChange={(e) => setEditEquipo({ ...editEquipo, ubicacion: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Estado de Disponibilidad</label>
              <select
                id="eq-form-status"
                value={editEquipo.estado || "Disponible"}
                onChange={(e) => setEditEquipo({ ...editEquipo, estado: e.target.value as Equipo["estado"] })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              >
                <option value="Disponible">Disponible</option>
                <option value="Prestado">Prestado</option>
                <option value="Reservado">Reservado</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div className="flex items-end justify-end gap-2 md:col-span-3 mt-3">
              <button
                type="button"
                id="btn-eq-form-cancel"
                onClick={() => {
                  setIsEditing(false);
                  setEditEquipo(null);
                }}
                className="text-xs font-bold py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="btn-eq-form-submit"
                className="text-xs font-bold py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 cursor-pointer transition-colors"
              >
                Guardar Equipo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="inventory-grid">
        {filteredEquipos.map((eq) => (
          <div
            key={eq.id_equipo}
            id={`eq-card-${eq.id_equipo}`}
            className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg font-semibold border border-slate-150">
                  {eq.codigo}
                </span>
                {getStatusBadge(eq.estado)}
              </div>

              {/* Title & Type */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  {getEquipmentIcon(eq.tipo)}
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                  {eq.nombre}
                </h4>
              </div>

              {/* Technical details */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                <div>
                  <span className="text-slate-400 font-semibold">Marca/Modelo:</span> {eq.marca} • {eq.modelo}
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">S/N:</span> <span className="font-mono">{eq.serie}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 mt-3 font-normal text-[11px] bg-slate-50 p-2 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{eq.ubicacion}</span>
                </div>
              </div>
            </div>

            {/* Actions panel for Authorized or Admin */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ID: {eq.id_equipo.substring(0, 8)}</span>

              {isUserAdminOrEncargado && (
                <div className="flex items-center gap-1">
                  <button
                    id={`btn-edit-eq-${eq.id_equipo}`}
                    onClick={() => startEdit(eq)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Editar equipo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Only Admin can delete as per criteria 7 */}
                  {currentUser?.rol === UserRole.ADMIN && (
                    <button
                      id={`btn-delete-eq-${eq.id_equipo}`}
                      onClick={() => handleDelete(eq.id_equipo)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar equipo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredEquipos.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm" id="no-inventory-results">
            <AlertCircle className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No se encontraron equipos informáticos</p>
            <p className="text-xs text-slate-400 mt-1">Pruebe limpiando los filtros o realizando otra búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
