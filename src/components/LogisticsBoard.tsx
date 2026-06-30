/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogisticTask } from "../types";
import { logisticTeam } from "../data";
import { Users, Target, BookOpen, Clock, Play, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface LogisticsBoardProps {
  logisticTasks: LogisticTask[];
  onUpdateTasks: (tasks: LogisticTask[]) => void;
}

export default function LogisticsBoard({ logisticTasks, onUpdateTasks }: LogisticsBoardProps) {
  const [activeTab, setActiveTab] = useState<"board" | "team">("board");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPoints, setNewTaskPoints] = useState(3);
  const [newTaskAssignee, setNewTaskAssignee] = useState(logisticTeam.team[0]);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const moveTask = (taskId: string, currentStatus: string) => {
    const statuses: Array<LogisticTask["status"]> = ["todo", "in_progress", "qa", "done"];
    const currentIndex = statuses.indexOf(currentStatus as LogisticTask["status"]);
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      const updated = logisticTasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t));
      onUpdateTasks(updated);
    }
  };

  const resetTask = (taskId: string) => {
    const updated = logisticTasks.map((t) => (t.id === taskId ? { ...t, status: "todo" as const } : t));
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: LogisticTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: "todo",
      assignee: newTaskAssignee,
      points: newTaskPoints,
    };

    onUpdateTasks([...logisticTasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAddingTask(false);
  };

  const totalPoints = logisticTasks.reduce((sum, t) => sum + t.points, 0);
  const completedPoints = logisticTasks.filter((t) => t.status === "done").reduce((sum, t) => sum + t.points, 0);
  const progressPercent = Math.round((completedPoints / (totalPoints || 1)) * 100);

  return (
    <div className="space-y-6" id="logistics-section">
      {/* Support Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-800 relative overflow-hidden" id="support-info-banner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {logisticTeam.ciclo}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold font-sans tracking-tight text-white mt-1">
              Flujo de Operación y Soporte IT
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              <strong>Objetivos de Soporte:</strong> {logisticTeam.goal}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 min-w-[220px] shrink-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-extrabold text-lg border border-indigo-500/30 shadow-inner">
              {progressPercent}%
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Progreso de Tareas</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {completedPoints} de {totalPoints} Horas Est.
              </div>
            </div>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mt-5 overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-500 rounded-full shadow-inner"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-1 gap-3">
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            id="btn-logistics-tab-board"
            onClick={() => setActiveTab("board")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "board"
                ? "border-indigo-600 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Tablero de Logística e Incidencias
          </button>
          <button
            id="btn-logistics-tab-team"
            onClick={() => setActiveTab("team")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "team"
                ? "border-indigo-600 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Auxiliares y Coordinadores IT
          </button>
        </div>

        {activeTab === "board" && (
          <button
            id="btn-logistics-add-task"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-100 w-full sm:w-auto mb-2 sm:mb-0"
          >
            + Nueva Tarea de Soporte
          </button>
        )}
      </div>

      {activeTab === "board" && (
        <div className="space-y-6" id="logistics-board-view">
          {/* Add story drawer/form */}
          {isAddingTask && (
            <form onSubmit={handleAddTask} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fade-in" id="add-task-form">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Crear nueva tarea de soporte o revisión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    id="task-title"
                    type="text"
                    placeholder="Título de la tarea (ej: Revisar Proyector Epson L2)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-250 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    id="task-assignee"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="text-xs p-3 border border-slate-250 rounded-xl bg-white flex-1 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  >
                    {logisticTeam.team.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    id="task-points"
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="text-xs p-3 border border-slate-250 rounded-xl bg-white w-24 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  >
                    {[1, 2, 3, 5, 8, 13].map((p) => (
                      <option key={p} value={p}>{p} Horas</option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                id="task-desc"
                placeholder="Descripción del mantenimiento preventivo, correctivo o despacho..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full text-xs p-3 border border-slate-250 rounded-xl bg-white h-20 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  id="btn-cancel-task"
                  onClick={() => setIsAddingTask(false)}
                  className="text-xs px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-task"
                  className="text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer transition-all font-bold shadow-md shadow-indigo-100"
                >
                  Agregar a la Lista
                </button>
              </div>
            </form>
          )}

          {/* Kanban board structure */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="kanban-grid">
            {/* TO DO column */}
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/50" id="col-todo">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Pendiente
                </span>
                <span className="text-xs bg-slate-200/60 px-2.5 py-0.5 rounded-full font-extrabold text-slate-600">
                  {logisticTasks.filter((t) => t.status === "todo").length}
                </span>
              </div>
              <div className="space-y-3">
                {logisticTasks.filter((t) => t.status === "todo").map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-indigo-200 hover:shadow-xs transition-all group" id={`task-${task.id}`}>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{task.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                      <span className="text-slate-400 truncate max-w-[120px]" title={task.assignee}>
                        👤 {task.assignee.split(",")[0]}
                      </span>
                      <span className="font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                        {task.points} hrs
                      </span>
                    </div>
                    <button
                      id={`btn-move-task-${task.id}`}
                      onClick={() => moveTask(task.id, "todo")}
                      className="w-full mt-2 py-1.5 text-[10px] text-indigo-600 hover:bg-indigo-50 font-bold border border-indigo-100 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      Empezar <Play className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* IN PROGRESS column */}
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/50" id="col-in-progress">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  En Proceso
                </span>
                <span className="text-xs bg-amber-100 px-2.5 py-0.5 rounded-full font-extrabold text-amber-700">
                  {logisticTasks.filter((t) => t.status === "in_progress").length}
                </span>
              </div>
              <div className="space-y-3">
                {logisticTasks.filter((t) => t.status === "in_progress").map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-amber-200 hover:shadow-xs transition-all group" id={`task-${task.id}`}>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{task.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                      <span className="text-slate-400 truncate max-w-[120px]" title={task.assignee}>
                        👤 {task.assignee.split(",")[0]}
                      </span>
                      <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-mono">
                        {task.points} hrs
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        id={`btn-reset-task-${task.id}`}
                        onClick={() => resetTask(task.id)}
                        className="py-1.5 text-[10px] text-slate-500 hover:bg-slate-100 font-bold border border-slate-200 rounded-xl cursor-pointer transition-colors"
                      >
                        Reiniciar
                      </button>
                      <button
                        id={`btn-move-task-${task.id}`}
                        onClick={() => moveTask(task.id, "in_progress")}
                        className="py-1.5 text-[10px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-100 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        Revisar <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QA column */}
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/50" id="col-qa">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Inspección/Control
                </span>
                <span className="text-xs bg-indigo-100 px-2.5 py-0.5 rounded-full font-extrabold text-indigo-700">
                  {logisticTasks.filter((t) => t.status === "qa").length}
                </span>
              </div>
              <div className="space-y-3">
                {logisticTasks.filter((t) => t.status === "qa").map((task) => (
                  <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-indigo-200 hover:shadow-xs transition-all group" id={`task-${task.id}`}>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{task.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                      <span className="text-slate-400 truncate max-w-[120px]" title={task.assignee}>
                        👤 {task.assignee.split(",")[0]}
                      </span>
                      <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                        {task.points} hrs
                      </span>
                    </div>
                    <button
                      id={`btn-move-task-${task.id}`}
                      onClick={() => moveTask(task.id, "qa")}
                      className="w-full mt-2 py-1.5 text-[10px] text-emerald-600 hover:bg-emerald-50 font-bold border border-emerald-100 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      Aprobar <CheckCircle2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DONE column */}
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/50" id="col-done">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Completado
                </span>
                <span className="text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full font-extrabold text-emerald-700">
                  {logisticTasks.filter((t) => t.status === "done").length}
                </span>
              </div>
              <div className="space-y-3">
                {logisticTasks.filter((t) => t.status === "done").map((task) => (
                  <div key={task.id} className="p-4 bg-slate-100/70 border border-dashed border-emerald-200 rounded-2xl space-y-2.5" id={`task-${task.id}`}>
                    <h4 className="text-xs font-bold text-slate-500 line-through leading-tight">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{task.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] font-semibold text-slate-600">
                      <span className="text-slate-400 truncate max-w-[120px]" title={task.assignee}>
                        👤 {task.assignee.split(",")[0]}
                      </span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                        {task.points} hrs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 space-y-6 shadow-sm" id="logistics-team-view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <Users className="w-5 h-5 text-indigo-500" />
                Miembros Clave de Logística y Soporte IT
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                  <div>
                    <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Coordinador General</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{logisticTeam.coordinador}</div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-md">CG</span>
                </div>

                <div className="flex items-start justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <div>
                    <div className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider">Supervisor de Laboratorio</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{logisticTeam.supervisor}</div>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-900 font-extrabold px-2.5 py-0.5 rounded-md">SL</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 mb-1">Técnicos de Soporte Auxiliar</div>
                  {logisticTeam.team.map((m) => (
                    <div key={m} className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <Target className="w-5 h-5 text-indigo-500" />
                Lineamientos de Calidad y Mantenimiento
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl space-y-4 text-xs leading-relaxed text-slate-600 border border-slate-150">
                <div className="flex gap-3">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Revisiones Periódicas de Hardware</strong>
                    Ciclos de auditoría física de stock en el almacén de ingeniería para actualizar el inventario web en tiempo real.
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Tiempos de Respuesta Rápidos</strong>
                    Las solicitudes aprobadas de docentes y estudiantes deben ser despachadas en menos de 15 minutos en ventanilla de soporte.
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Control de Calidad de Devolución (QC)</strong>
                    Todo equipo tecnológico retornado debe pasar por revisión de integridad antes de marcarse nuevamente como Disponible en el inventario.
                  </div>
                </div>
              </div>

              {/* Progress summary card */}
              <div className="border border-slate-200 rounded-3xl p-5 bg-gradient-to-br from-indigo-50/50 to-slate-50/50">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Métricas Operativas del Ciclo</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <div className="text-2xl font-bold font-mono text-slate-900">{logisticTasks.length}</div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Tareas Registradas</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <div className="text-2xl font-bold font-mono text-indigo-600">
                      {logisticTasks.filter((t) => t.status === "done").length}
                    </div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Tareas Solucionadas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
