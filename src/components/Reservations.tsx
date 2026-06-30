/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Reserva, Equipo, Usuario, UserRole, Prestamo } from "../types";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, AlertCircle, Sparkles, Filter, Info } from "lucide-react";

interface ReservationsProps {
  reservas: Reserva[];
  equipos: Equipo[];
  usuarios: Usuario[];
  prestamos: Prestamo[];
  currentUser: Usuario | null;
  onUpdateReservas: (reservas: Reserva[]) => void;
  onUpdateEquipos: (equipos: Equipo[]) => void;
}

export default function Reservations({
  reservas,
  equipos,
  usuarios,
  prestamos,
  currentUser,
  onUpdateReservas,
  onUpdateEquipos
}: ReservationsProps) {
  // Booking Form State
  const [selectedEquipoId, setSelectedEquipoId] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-06-30");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selected Day for Visual Calendar Grid (June 29 to July 3, 2026 - Semana activa)
  const [calendarDate, setCalendarDate] = useState("2026-06-30");

  const datesOfWeek = [
    { label: "Lun 29 Jun", value: "2026-06-29" },
    { label: "Mar 30 Jun", value: "2026-06-30" },
    { label: "Mié 01 Jul", value: "2026-07-01" },
    { label: "Jue 02 Jul", value: "2026-07-02" },
    { label: "Vie 03 Jul", value: "2026-07-03" }
  ];

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Helper to check overlap
  const isOverlapping = (eqId: string, date: string, start: string, end: string, excludeResId?: string) => {
    const startNum = parseInt(start.replace(":", ""), 10);
    const endNum = parseInt(end.replace(":", ""), 10);

    return reservas.some((res) => {
      if (res.id_reserva === excludeResId) return false;
      if (res.equipo_id !== eqId || res.fecha !== date) return false;
      if (res.estado === "Rechazada" || res.estado === "Cancelada") return false;

      const resStartNum = parseInt(res.hora_inicio.replace(":", ""), 10);
      const resEndNum = parseInt(res.hora_fin.replace(":", ""), 10);

      // Overlap condition: start < resEnd && end > resStart
      return startNum < resEndNum && endNum > resStartNum;
    });
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentUser) {
      setErrorMsg("Debes estar autenticado para realizar reservas.");
      return;
    }

    if (!selectedEquipoId) {
      setErrorMsg("Por favor, selecciona un equipo informático.");
      return;
    }

    const eq = equipos.find((e) => e.id_equipo === selectedEquipoId);
    if (!eq) {
      setErrorMsg("El equipo seleccionado no existe.");
      return;
    }

    // Regla 4: Los equipos en mantenimiento no podrán reservarse
    if (eq.estado === "Mantenimiento") {
      setErrorMsg("CRITERIO DE ACEPTACIÓN: Los equipos en mantenimiento no pueden reservarse.");
      return;
    }

    // Regla 6: Un usuario con equipos pendientes no podrá realizar nuevas reservas
    // Check if user has active/tardio loans that haven't been returned
    const userReservations = reservas.filter((r) => r.usuario_id === currentUser.id_usuario);
    const hasUnreturnedLoans = userReservations.some((res) => {
      const activeLoanForRes = prestamos.find((p) => p.reserva_id === res.id_reserva && p.estado !== "Devuelto");
      return !!activeLoanForRes;
    });

    if (hasUnreturnedLoans) {
      setErrorMsg("CRITERIO DE ACEPTACIÓN: Tienes préstamos pendientes activos. Devuelve tus equipos antes de realizar una nueva reserva.");
      return;
    }

    const startNum = parseInt(startTime.replace(":", ""), 10);
    const endNum = parseInt(endTime.replace(":", ""), 10);

    if (startNum >= endNum) {
      setErrorMsg("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    // Regla 1: Un equipo no puede reservarse dos veces en el mismo horario
    if (isOverlapping(selectedEquipoId, selectedDate, startTime, endTime)) {
      setErrorMsg("CRITERIO DE ACEPTACIÓN: El equipo seleccionado ya cuenta con una reserva aprobada o pendiente en ese horario.");
      return;
    }

    // Success - Create reservation
    const newRes: Reserva = {
      id_reserva: `res-${Date.now()}`,
      usuario_id: currentUser.id_usuario,
      equipo_id: selectedEquipoId,
      fecha: selectedDate,
      hora_inicio: startTime,
      hora_fin: endTime,
      estado: currentUser.rol === UserRole.ADMIN ? "Aprobada" : "Pendiente"
    };

    // Update equipment state if approved immediately
    if (newRes.estado === "Aprobada") {
      const updatedEquipos = equipos.map((e) =>
        e.id_equipo === selectedEquipoId ? { ...e, estado: "Reservado" as const } : e
      );
      onUpdateEquipos(updatedEquipos);
    }

    onUpdateReservas([newRes, ...reservas]);
    setSuccessMsg(
      currentUser.rol === UserRole.ADMIN
        ? "Reserva aprobada y registrada automáticamente por ser Administrador."
        : "Solicitud de reserva registrada con éxito. Pendiente de aprobación por el Administrador."
    );

    // Reset Form
    setSelectedEquipoId("");
  };

  const handleStatusChange = (resId: string, newStatus: Reserva["estado"]) => {
    const res = reservas.find((r) => r.id_reserva === resId);
    if (!res) return;

    const updated = reservas.map((r) => (r.id_reserva === resId ? { ...r, estado: newStatus } : r));

    // Update corresponding equipment state accordingly
    const updatedEquipos = equipos.map((eq) => {
      if (eq.id_equipo === res.equipo_id) {
        if (newStatus === "Aprobada") {
          return { ...eq, estado: "Reservado" as const };
        } else if (newStatus === "Cancelada" || newStatus === "Rechazada") {
          // Only restore to Disponible if it isn't currently lent out or in maintenance
          if (eq.estado === "Reservado") {
            return { ...eq, estado: "Disponible" as const };
          }
        }
      }
      return eq;
    });

    onUpdateReservas(updated);
    onUpdateEquipos(updatedEquipos);
  };

  const getUsuarioName = (usrId: string) => {
    const usr = usuarios.find((u) => u.id_usuario === usrId);
    return usr ? `${usr.nombres} ${usr.apellidos}` : "Usuario Desconocido";
  };

  const getEquipoName = (eqId: string) => {
    const eq = equipos.find((e) => e.id_equipo === eqId);
    return eq ? `${eq.nombre} (${eq.codigo})` : "Equipo Desconocido";
  };

  // Filtered reservations
  const filteredReservas = reservas.filter((res) => {
    // If regular user, only show theirs or show all depends on policy.
    // Docentes & Estudiantes can see all to consult availability, but let's allow them to filter their own.
    const matchesUser =
      currentUser?.rol === UserRole.ADMIN ||
      currentUser?.rol === UserRole.ENCARGADO ||
      res.usuario_id === currentUser?.id_usuario;

    const matchesStatus = statusFilter === "All" || res.estado === statusFilter;

    return matchesUser && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="reservations-section">
      {/* Booking Form + Visual Calendar (Left) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Booking Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="booking-form-card">
          <h3 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            Solicitar Nueva Reserva
          </h3>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-r-xl flex items-start gap-2" id="booking-error">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs rounded-r-xl flex items-start gap-2" id="booking-success">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4" id="booking-form">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Equipo Tecnológico</label>
              <select
                id="booking-equipment"
                value={selectedEquipoId}
                onChange={(e) => setSelectedEquipoId(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              >
                <option value="">-- Seleccione un equipo disponible o reservable --</option>
                {equipos.map((eq) => (
                  <option
                    key={eq.id_equipo}
                    value={eq.id_equipo}
                    disabled={eq.estado === "Mantenimiento"}
                  >
                    {eq.nombre} - {eq.codigo} ({eq.estado}) {eq.estado === "Mantenimiento" ? " - EN MANTENIMIENTO" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha</label>
              <input
                id="booking-date"
                type="date"
                min="2026-06-29"
                max="2026-07-10"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hora Inicio</label>
                <select
                  id="booking-start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hora Fin</label>
                <select
                  id="booking-end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                id="btn-submit-booking"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-100"
              >
                <Calendar className="w-4 h-4" /> Registrar Reserva
              </button>
            </div>
          </form>
        </div>

        {/* Visual Availability Calendar Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-fade-in" id="availability-calendar-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Planificador Visual de Disponibilidad
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Calendario de ocupación en tiempo real para la semana activa</p>
            </div>

            {/* Quick date chips */}
            <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150">
              {datesOfWeek.map((day) => (
                <button
                  key={day.value}
                  id={`cal-chip-${day.value}`}
                  onClick={() => setCalendarDate(day.value)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    calendarDate === day.value
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-100 font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of Equipment vs Hours */}
          <div className="overflow-x-auto" id="visual-grid-container">
            <table className="w-full text-[11px] border-collapse" id="visual-grid-table">
              <thead>
                <tr>
                  <th className="p-3 border-b border-slate-100 text-left bg-slate-50 text-slate-400 font-bold uppercase tracking-wider w-36 rounded-l-xl">
                    Equipos
                  </th>
                  {timeSlots.slice(0, 7).map((time, idx) => (
                    <th key={time} className={`p-3 border-b border-slate-100 text-center bg-slate-50 text-slate-400 font-bold font-mono ${idx === 6 ? "rounded-r-xl" : ""}`}>
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipos.slice(0, 6).map((eq) => (
                  <tr key={eq.id_equipo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 truncate max-w-[140px]" title={eq.nombre}>
                      {eq.codigo} <span className="font-medium text-slate-400 block text-[10px] truncate mt-0.5">{eq.nombre}</span>
                    </td>

                    {timeSlots.slice(0, 7).map((time) => {
                      // Check if there is an approved reservation for this equipment at this hour on calendarDate
                      const hourVal = parseInt(time.replace(":", ""), 10);

                      const activeRes = reservas.find((res) => {
                        if (res.equipo_id !== eq.id_equipo || res.fecha !== calendarDate) return false;
                        if (res.estado === "Rechazada" || res.estado === "Cancelada") return false;

                        const rStart = parseInt(res.hora_inicio.replace(":", ""), 10);
                        const rEnd = parseInt(res.hora_fin.replace(":", ""), 10);

                        return hourVal >= rStart && hourVal < rEnd;
                      });

                      if (eq.estado === "Mantenimiento") {
                        return (
                          <td key={time} className="p-1.5 text-center">
                            <span className="block bg-rose-50 text-rose-700 text-[9px] font-bold py-1.5 rounded-lg border border-rose-100" title="Fuera de servicio">
                              MANT
                            </span>
                          </td>
                        );
                      }

                      if (activeRes) {
                        const userName = getUsuarioName(activeRes.usuario_id).split(" ")[0];
                        const isApproved = activeRes.estado === "Aprobada";
                        return (
                          <td key={time} className="p-1.5 text-center">
                            <span
                              className={`block text-[9px] font-bold py-1.5 rounded-lg border ${
                                isApproved
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}
                              title={`${isApproved ? "Aprobado" : "Pendiente"}: Reservado por ${getUsuarioName(activeRes.usuario_id)}`}
                            >
                              {userName}
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={time} className="p-1.5 text-center">
                          <span className="block bg-emerald-50/40 text-emerald-600 text-[9px] font-bold py-1.5 rounded-lg border border-emerald-100/50">
                            Libre
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100 inline-block" /> Libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-50 border border-amber-100 inline-block" /> Pendiente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-50 border border-indigo-100 inline-block" /> Reservado (Aprobado)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-50 border border-rose-100 inline-block" /> Mantenimiento
            </span>
          </div>
        </div>
      </div>

      {/* Reservations List & Approvals Panel (Right) */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="reservations-list-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950">
                {currentUser?.rol === UserRole.ADMIN || currentUser?.rol === UserRole.ENCARGADO
                  ? "Gestión de Solicitudes"
                  : "Mis Reservas Realizadas"}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Historial filtrado por estado</p>
            </div>

            {/* Filter status */}
            <select
              id="res-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none cursor-pointer"
            >
              <option value="All">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="space-y-3" id="reservations-list-container">
            {filteredReservas.map((res) => {
              const eq = equipos.find((e) => e.id_equipo === res.equipo_id);
              const isPending = res.estado === "Pendiente";
              const isApproved = res.estado === "Aprobada";
              const isStaff = currentUser?.rol === UserRole.ADMIN || currentUser?.rol === UserRole.ENCARGADO;

              return (
                <div
                  key={res.id_reserva}
                  id={`res-card-${res.id_reserva}`}
                  className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 hover:border-slate-300 transition-all hover:bg-white hover:shadow-xs group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-600 uppercase font-mono tracking-wider">
                        {res.id_reserva.substring(0, 8)}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5 group-hover:text-indigo-600 transition-colors">{getEquipoName(res.equipo_id)}</h4>
                    </div>

                    {/* Badge */}
                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : isPending
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {res.estado}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-semibold space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fecha: <strong className="text-slate-700">{res.fecha}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Rango: <strong className="text-slate-700">{res.hora_inicio} a {res.hora_fin}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center gap-1 font-normal">
                      <span>👤 Solicitado por:</span> <strong className="font-semibold text-slate-700">{getUsuarioName(res.usuario_id)}</strong>
                    </div>
                  </div>

                  {/* Approve/Reject CTA for Admin/Staff */}
                  {isStaff && isPending && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        id={`btn-reject-res-${res.id_reserva}`}
                        onClick={() => handleStatusChange(res.id_reserva, "Rechazada")}
                        className="py-2 px-2.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center gap-1 cursor-pointer border border-rose-100 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rechazar
                      </button>
                      <button
                        id={`btn-approve-res-${res.id_reserva}`}
                        onClick={() => handleStatusChange(res.id_reserva, "Aprobada")}
                        className="py-2 px-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center justify-center gap-1 cursor-pointer border border-emerald-100 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                      </button>
                    </div>
                  )}

                  {/* Cancel option for the owning teacher/student */}
                  {res.usuario_id === currentUser?.id_usuario && isPending && (
                    <button
                      id={`btn-cancel-res-${res.id_reserva}`}
                      onClick={() => handleStatusChange(res.id_reserva, "Cancelada")}
                      className="w-full mt-2 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              );
            })}

            {filteredReservas.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs" id="no-reservations-results">
                <Info className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                No hay solicitudes de reserva registradas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
