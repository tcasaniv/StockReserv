/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Equipo, Reserva, Prestamo, Usuario, Mantenimiento, UserRole } from "../types";
import { TrendingUp, BarChart2, PieChart, Users, Calendar, AlertTriangle, FileText, CheckCircle, Clock } from "lucide-react";

interface ReportsProps {
  equipos: Equipo[];
  reservas: Reserva[];
  prestamos: Prestamo[];
  usuarios: Usuario[];
  mantenimientos: Mantenimiento[];
}

export default function Reports({
  equipos,
  reservas,
  prestamos,
  usuarios,
  mantenimientos
}: ReportsProps) {
  const [activeReport, setActiveReport] = useState<"general" | "utilization" | "maintenance" | "history" | "teachers">("general");

  const getUsuarioName = (usrId: string) => {
    const usr = usuarios.find((u) => u.id_usuario === usrId);
    return usr ? `${usr.nombres} ${usr.apellidos}` : "Usuario Desconocido";
  };

  const getEquipoName = (eqId: string) => {
    const eq = equipos.find((e) => e.id_equipo === eqId);
    return eq ? `${eq.nombre} (${eq.codigo})` : "Equipo Desconocido";
  };

  // Calculating statistics for Equipos más utilizados
  const usageCounts: { [key: string]: { eq: Equipo; count: number } } = {};
  equipos.forEach((eq) => {
    usageCounts[eq.id_equipo] = { eq, count: 0 };
  });

  reservas.forEach((res) => {
    if (usageCounts[res.equipo_id] && res.estado !== "Cancelada") {
      usageCounts[res.equipo_id].count += 1;
    }
  });

  const sortedUsage = Object.values(usageCounts).sort((a, b) => b.count - a.count);

  // Status breakdown
  const statusCounts = {
    Disponible: equipos.filter((e) => e.estado === "Disponible").length,
    Reservado: equipos.filter((e) => e.estado === "Reservado").length,
    Prestado: equipos.filter((e) => e.estado === "Prestado").length,
    Mantenimiento: equipos.filter((e) => e.estado === "Mantenimiento").length
  };

  // Reservations per Teacher (Docente)
  const teacherStats: { [key: string]: { user: Usuario; count: number } } = {};
  usuarios.forEach((usr) => {
    if (usr.rol === UserRole.DOCENTE) {
      teacherStats[usr.id_usuario] = { user: usr, count: 0 };
    }
  });

  reservas.forEach((res) => {
    if (teacherStats[res.usuario_id]) {
      teacherStats[res.usuario_id].count += 1;
    }
  });

  const sortedTeacherStats = Object.values(teacherStats).sort((a, b) => b.count - a.count);

  // Group reservations by date
  const reservationsByDate: { [key: string]: number } = {};
  reservas.forEach((res) => {
    reservationsByDate[res.fecha] = (reservationsByDate[res.fecha] || 0) + 1;
  });

  const sortedDates = Object.entries(reservationsByDate).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  return (
    <div className="space-y-6" id="reports-section">
      {/* Report Menu Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4" id="reports-tabs">
        <button
          id="btn-report-general"
          onClick={() => setActiveReport("general")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeReport === "general"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PieChart className="w-4 h-4" /> Resumen General
        </button>

        <button
          id="btn-report-utilization"
          onClick={() => setActiveReport("utilization")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeReport === "utilization"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Equipos más Utilizados
        </button>

        <button
          id="btn-report-maintenance"
          onClick={() => setActiveReport("maintenance")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeReport === "maintenance"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Mantenimiento ({statusCounts.Mantenimiento})
        </button>

        <button
          id="btn-report-history"
          onClick={() => setActiveReport("history")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeReport === "history"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" /> Historial de Préstamos
        </button>

        <button
          id="btn-report-teachers"
          onClick={() => setActiveReport("teachers")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeReport === "teachers"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" /> Reservas por Docente
        </button>
      </div>

      {/* GENERAL Tab */}
      {activeReport === "general" && (
        <div className="space-y-6" id="report-general-view">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                {statusCounts.Disponible}
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Equipos Libres</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Disponibles Ahora</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                {statusCounts.Prestado}
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Préstamos Activos</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">En Uso Externo</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                {statusCounts.Reservado}
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Reservas Totales</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Aprobadas / Agendadas</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                {statusCounts.Mantenimiento}
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Taller de Soporte</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Bajo Reparación</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Representation */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-950 mb-4">Estado General del Inventario</h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                {/* Visual SVG Donut chart */}
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />

                    {/* Disponible segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#10b981" // emerald-500
                      strokeWidth="3.5"
                      strokeDasharray={`${(statusCounts.Disponible / (equipos.length || 1)) * 100} ${
                        100 - (statusCounts.Disponible / (equipos.length || 1)) * 100
                      }`}
                      strokeDashoffset="0"
                    />

                    {/* Prestado segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#3b82f6" // blue-500
                      strokeWidth="3.5"
                      strokeDasharray={`${(statusCounts.Prestado / (equipos.length || 1)) * 100} ${
                        100 - (statusCounts.Prestado / (equipos.length || 1)) * 100
                      }`}
                      strokeDashoffset={`-${(statusCounts.Disponible / (equipos.length || 1)) * 100}`}
                    />

                    {/* Reservado segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#f59e0b" // amber-500
                      strokeWidth="3.5"
                      strokeDasharray={`${(statusCounts.Reservado / (equipos.length || 1)) * 100} ${
                        100 - (statusCounts.Reservado / (equipos.length || 1)) * 100
                      }`}
                      strokeDashoffset={`-${
                        ((statusCounts.Disponible + statusCounts.Prestado) / (equipos.length || 1)) * 100
                      }`}
                    />

                    {/* Mantenimiento segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#f43f5e" // rose-500
                      strokeWidth="3.5"
                      strokeDasharray={`${(statusCounts.Mantenimiento / (equipos.length || 1)) * 100} ${
                        100 - (statusCounts.Mantenimiento / (equipos.length || 1)) * 100
                      }`}
                      strokeDashoffset={`-${
                        ((statusCounts.Disponible + statusCounts.Prestado + statusCounts.Reservado) /
                          (equipos.length || 1)) *
                        100
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-slate-900">{equipos.length}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Activos</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-600">Disponibles:</span>
                    <span className="text-slate-900 font-bold">{statusCounts.Disponible} ({equipos.length ? Math.round(statusCounts.Disponible/equipos.length*100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                    <span className="text-slate-600">Prestados:</span>
                    <span className="text-slate-900 font-bold">{statusCounts.Prestado} ({equipos.length ? Math.round(statusCounts.Prestado/equipos.length*100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="text-slate-600">Reservados:</span>
                    <span className="text-slate-900 font-bold">{statusCounts.Reservado} ({equipos.length ? Math.round(statusCounts.Reservado/equipos.length*100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="text-slate-600">Soporte técnico:</span>
                    <span className="text-slate-900 font-bold">{statusCounts.Mantenimiento} ({equipos.length ? Math.round(statusCounts.Mantenimiento/equipos.length*100) : 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservations by Date chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-950 mb-4">Reservas Totales por Fecha</h3>
              <div className="space-y-4 py-2">
                {sortedDates.map(([date, count]) => (
                  <div key={date} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {date}
                      </span>
                      <span className="font-mono font-bold text-slate-900">{count} reserva(s)</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}

                {sortedDates.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No hay registros de fecha para graficar.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UTILIZATION Tab */}
      {activeReport === "utilization" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="report-utilization-view">
          <h3 className="text-sm font-bold text-slate-950 mb-1">Equipos Informáticos más Utilizados</h3>
          <p className="text-xs text-slate-400 mb-6">Basado en la cantidad total de reservas agendadas y préstamos consolidados</p>

          <div className="space-y-5">
            {sortedUsage.slice(0, 5).map((item, index) => {
              const barPercent = Math.max(5, Math.min(100, (item.count / (sortedUsage[0]?.count || 1)) * 100));

              return (
                <div key={item.eq.id_equipo} className="flex items-center gap-4" id={`usage-row-${item.eq.id_equipo}`}>
                  {/* Position number */}
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-md shadow-indigo-100">
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {item.eq.nombre} <span className="text-slate-400 font-mono">({item.eq.codigo})</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">{item.count} Préstamos / Reservas</span>
                    </div>

                    {/* Beautiful colorized proportional horizontal bar */}
                    <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAINTENANCE Tab */}
      {activeReport === "maintenance" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="report-maintenance-view">
          <h3 className="text-sm font-bold text-slate-950 mb-1">Registro de Soporte y Mantenimiento</h3>
          <p className="text-xs text-slate-400 mb-6">Equipos bajo diagnóstico técnico o reparación de hardware</p>

          <div className="space-y-4">
            {mantenimientos.map((m) => {
              const eq = equipos.find((e) => e.id_equipo === m.equipo_id);

              return (
                <div key={m.id_mantenimiento} className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded uppercase font-mono">
                        {m.id_mantenimiento.substring(0, 8)}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {eq ? `${eq.nombre} (${eq.codigo})` : "Equipo Desconocido"}
                      </h4>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-extrabold bg-rose-100 px-3 py-0.5 rounded-full">
                      🛠️ {m.estado}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p><strong>Descripción de Falla:</strong> {m.descripcion}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold uppercase pt-2.5 border-t border-rose-100/50">
                      <div>Técnico asignado: <span className="text-slate-700 block mt-0.5 font-bold">{m.tecnico}</span></div>
                      <div>Fecha de Ingreso: <span className="text-slate-700 block mt-0.5 font-bold">{m.fecha}</span></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {mantenimientos.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs font-bold">
                No hay equipos bajo servicio técnico en este momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY Tab */}
      {activeReport === "history" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="report-history-view">
          <h3 className="text-sm font-bold text-slate-950 mb-1">Historial Consolidado de Préstamos</h3>
          <p className="text-xs text-slate-400 mb-6">Bitácora histórica de entregas, devoluciones tardías y observaciones de daño</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase bg-slate-50">
                  <th className="p-3 rounded-l-xl">ID Préstamo</th>
                  <th className="p-3">Equipo</th>
                  <th className="p-3">Docente/Estudiante</th>
                  <th className="p-3">Fecha Salida</th>
                  <th className="p-3">Fecha Retorno</th>
                  <th className="p-3 rounded-r-xl">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prestamos.map((p) => {
                  const res = reservas.find((r) => r.id_reserva === p.reserva_id);
                  if (!res) return null;

                  return (
                    <tr key={p.id_prestamo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-semibold">{p.id_prestamo.substring(0, 8)}</td>
                      <td className="p-3 font-bold text-slate-800">{getEquipoName(res.equipo_id)}</td>
                      <td className="p-3 font-semibold text-slate-600">{getUsuarioName(res.usuario_id)}</td>
                      <td className="p-3 font-mono text-slate-400 font-medium">{p.fecha_prestamo}</td>
                      <td className="p-3 font-mono text-slate-400 font-medium">{p.fecha_devolucion || "Pendiente"}</td>
                      <td className="p-3">
                        <span className="text-[11px] text-slate-500 italic">
                          {p.observaciones || "Sin observaciones registradas."}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEACHERS Tab */}
      {activeReport === "teachers" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm" id="report-teachers-view">
          <h3 className="text-sm font-bold text-slate-950 mb-1">Reservas por Docentes UNSA</h3>
          <p className="text-xs text-slate-400 mb-6">Cantidad de solicitudes totales cursadas por personal académico</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTeacherStats.map((item) => (
              <div key={item.user.id_usuario} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3 hover:shadow-xs hover:border-slate-350 transition-all hover:bg-white group">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-md shadow-indigo-100">
                  {item.user.nombres[0]}{item.user.apellidos[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-950">{item.user.nombres} {item.user.apellidos}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.user.correo}</p>
                </div>
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50/50 py-1.5 px-3 rounded-xl inline-block border border-indigo-100">
                  {item.count} Reservas Solicitadas
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
