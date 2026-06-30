/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Prestamo, Reserva, Equipo, Usuario, UserRole } from "../types";
import { ClipboardList, PlayCircle, Archive, AlertCircle, Wrench, CheckCircle, Info, RefreshCcw } from "lucide-react";

interface LoansProps {
  prestamos: Prestamo[];
  reservas: Reserva[];
  equipos: Equipo[];
  usuarios: Usuario[];
  currentUser: Usuario | null;
  onUpdatePrestamos: (prestamos: Prestamo[]) => void;
  onUpdateEquipos: (equipos: Equipo[]) => void;
  onUpdateReservas: (reservas: Reserva[]) => void;
}

export default function Loans({
  prestamos,
  reservas,
  equipos,
  usuarios,
  currentUser,
  onUpdatePrestamos,
  onUpdateEquipos,
  onUpdateReservas
}: LoansProps) {
  // Return form state
  const [selectedPrestamoId, setSelectedPrestamoId] = useState("");
  const [isTardio, setIsTardio] = useState(false);
  const [reportDamage, setReportDamage] = useState(false);
  const [observations, setObservations] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Check role authorization
  const isAuthorized =
    currentUser?.rol === UserRole.ADMIN || currentUser?.rol === UserRole.ENCARGADO;

  const getUsuarioName = (usrId: string) => {
    const usr = usuarios.find((u) => u.id_usuario === usrId);
    return usr ? `${usr.nombres} ${usr.apellidos}` : "Usuario Desconocido";
  };

  const getEquipoName = (eqId: string) => {
    const eq = equipos.find((e) => e.id_equipo === eqId);
    return eq ? `${eq.nombre} (${eq.codigo})` : "Equipo Desconocido";
  };

  // Find approved reservations that don't have a dispatch yet
  const readyToDispatch = reservas.filter((res) => {
    if (res.estado !== "Aprobada") return false;
    // Check if a physical loan already exists for this reservation
    return !prestamos.some((p) => p.reserva_id === res.id_reserva);
  });

  // Handle loan dispatch (despacho de equipo)
  const handleDispatch = (resId: string) => {
    setSuccessMsg("");
    const res = reservas.find((r) => r.id_reserva === resId);
    if (!res) return;

    // Create physical loan
    const newLoan: Prestamo = {
      id_prestamo: `lp-${Date.now()}`,
      reserva_id: resId,
      fecha_prestamo: "2026-06-29 19:54", // current mocked system time
      estado: "Activo"
    };

    // Set equipment status to Prestado
    const updatedEquipos = equipos.map((eq) =>
      eq.id_equipo === res.equipo_id ? { ...eq, estado: "Prestado" as const } : eq
    );

    onUpdatePrestamos([...prestamos, newLoan]);
    onUpdateEquipos(updatedEquipos);
    setSuccessMsg(`Préstamo registrado con éxito. El equipo ${getEquipoName(res.equipo_id)} ha sido entregado.`);
  };

  // Handle return registration (devolución)
  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const loan = prestamos.find((p) => p.id_prestamo === selectedPrestamoId);
    if (!loan) return;

    const res = reservas.find((r) => r.id_reserva === loan.reserva_id);
    if (!res) return;

    // Create modified loan
    const updatedPrestamos = prestamos.map((p) => {
      if (p.id_prestamo === selectedPrestamoId) {
        return {
          ...p,
          fecha_devolucion: "2026-06-29 20:15",
          observaciones: `${isTardio ? "[DEVOLUCIÓN TARDÍA] " : ""}${reportDamage ? "[REPORTE DE DAÑO] " : ""}${observations}`,
          estado: isTardio ? ("Tardio" as const) : ("Devuelto" as const)
        };
      }
      return p;
    });

    // Update equipment state: if damage is reported, send to Mantenimiento. Else restore to Disponible.
    const updatedEquipos = equipos.map((eq) => {
      if (eq.id_equipo === res.equipo_id) {
        return {
          ...eq,
          estado: reportDamage ? ("Mantenimiento" as const) : ("Disponible" as const)
        };
      }
      return eq;
    });

    onUpdatePrestamos(updatedPrestamos);
    onUpdateEquipos(updatedEquipos);
    setSuccessMsg(
      `Devolución registrada correctamente para el préstamo ${selectedPrestamoId}. ${
        reportDamage ? "El equipo fue enviado a mantenimiento por reporte de daños." : "El equipo se encuentra nuevamente Disponible."
      }`
    );

    // Reset Form
    setSelectedPrestamoId("");
    setIsTardio(false);
    setReportDamage(false);
    setObservations("");
  };

  if (!isAuthorized) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm" id="unauthorized-loans">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-sm font-bold text-slate-900">Acceso Restringido</h3>
        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium">
          Este módulo de Préstamos y Devoluciones está diseñado exclusivamente para el <strong>Encargado de Laboratorio</strong> o el <strong>Administrador</strong> del sistema.
        </p>
        <p className="text-[11px] text-indigo-600 mt-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 font-semibold">
          Tip: Utiliza el panel <strong>"Acceso Rápido para Pruebas"</strong> en la pantalla de ingreso para alternar a la sesión de <strong>Javier Ignacio (Encargado)</strong> o <strong>Terry Joel (Administrador)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="loans-section">
      {/* Ready to Dispatch & Active Loans (Left) */}
      <div className="lg:col-span-2 space-y-6">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs rounded-r-xl flex items-center gap-2 shadow-xs" id="loans-success">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dispatch Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-fade-in" id="dispatch-card">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <PlayCircle className="w-4.5 h-4.5 text-indigo-500" />
            Reservas Aprobadas Listas para Despacho (Entrega de Equipos)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="dispatch-grid">
            {readyToDispatch.map((res) => (
              <div
                key={res.id_reserva}
                id={`dispatch-card-${res.id_reserva}`}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all hover:bg-white hover:shadow-xs group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
                    <span>RES: {res.id_reserva.substring(0, 8)}</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">APROBADA</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{getEquipoName(res.equipo_id)}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Solicita: <strong className="text-slate-700">{getUsuarioName(res.usuario_id)}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Fecha: {res.fecha} | Rango: {res.hora_inicio} - {res.hora_fin}
                  </p>
                </div>

                <button
                  id={`btn-dispatch-${res.id_reserva}`}
                  onClick={() => handleDispatch(res.id_reserva)}
                  className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl cursor-pointer transition-colors shadow-md shadow-indigo-100"
                >
                  Confirmar Entrega (Préstamo)
                </button>
              </div>
            ))}

            {readyToDispatch.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-semibold" id="no-dispatch-results">
                No hay reservas aprobadas pendientes por despacho físico.
              </div>
            )}
          </div>
        </div>

        {/* Active Physical Loans List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="active-loans-card">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <ClipboardList className="w-4.5 h-4.5 text-slate-700" />
            Registro de Préstamos Activos (En posesión de docentes/estudiantes)
          </h3>

          <div className="overflow-x-auto" id="active-loans-table-container">
            <table className="w-full text-xs text-left border-collapse" id="active-loans-table">
              <thead>
                <tr className="border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                  <th className="p-3 rounded-l-xl">Cód. Préstamo</th>
                  <th className="p-3">Equipo</th>
                  <th className="p-3">Usuario Responsable</th>
                  <th className="p-3">Hora Despacho</th>
                  <th className="p-3 rounded-r-xl">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prestamos.filter((p) => p.estado === "Activo").map((loan) => {
                  const res = reservas.find((r) => r.id_reserva === loan.reserva_id);
                  if (!res) return null;

                  return (
                    <tr key={loan.id_prestamo} className="hover:bg-slate-50/50 transition-colors" id={`loan-row-${loan.id_prestamo}`}>
                      <td className="p-3 font-bold font-mono text-slate-900">{loan.id_prestamo.substring(0, 8)}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{getEquipoName(res.equipo_id)}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-600">{getUsuarioName(res.usuario_id)}</td>
                      <td className="p-3 font-mono text-slate-500 font-medium">{loan.fecha_prestamo}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-amber-100">
                          En Uso
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {prestamos.filter((p) => p.estado === "Activo").length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold" id="no-active-loans">
                      No se encuentran equipos prestados en este momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Return Registration Sidebar (Right) */}
      <div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-4" id="return-form-card">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-700" />
            Registrar Devolución
          </h3>

          <form onSubmit={handleReturn} className="space-y-4" id="return-form">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Préstamo Activo</label>
              <select
                id="return-loan-id"
                value={selectedPrestamoId}
                onChange={(e) => setSelectedPrestamoId(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              >
                <option value="">-- Seleccione el préstamo --</option>
                {prestamos
                  .filter((p) => p.estado === "Activo")
                  .map((p) => {
                    const res = reservas.find((r) => r.id_reserva === p.reserva_id);
                    return (
                      <option key={p.id_prestamo} value={p.id_prestamo}>
                        {p.id_prestamo.substring(0, 8)} - {res ? getEquipoName(res.equipo_id) : ""} ({res ? getUsuarioName(res.usuario_id).split(" ")[0] : ""})
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Accept criteria checkbox switches */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
                <input
                  id="return-is-tardio"
                  type="checkbox"
                  checked={isTardio}
                  onChange={(e) => setIsTardio(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span>¿Es una devolución tardía?</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
                <input
                  id="return-report-damage"
                  type="checkbox"
                  checked={reportDamage}
                  onChange={(e) => setReportDamage(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500"
                />
                <span className="text-rose-600">¿Reportar daños en el equipo?</span>
              </label>
            </div>

            {reportDamage && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-700 flex items-start gap-1.5 leading-relaxed">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>
                  <strong>Nota del Sistema:</strong> Al reportar daños, el sistema cambiará automáticamente el estado del activo a <strong>Mantenimiento</strong> para evitar reservas futuras.
                </span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones</label>
              <textarea
                id="return-observations"
                placeholder="Detalle el estado del equipo al retornar (cable HDMI, cargador, rayaduras, etc.)..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <button
              id="btn-submit-return"
              type="submit"
              disabled={!selectedPrestamoId}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 disabled:shadow-none"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Procesar Devolución
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
