/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  initialUsuarios,
  initialEquipos,
  initialReservas,
  initialPrestamos,
  initialMantenimientos,
  initialLogisticTasks
} from "./data";
import { Usuario, Equipo, Reserva, Prestamo, Mantenimiento, LogisticTask, UserRole } from "./types";
import Auth from "./components/Auth";
import LogisticsBoard from "./components/LogisticsBoard";
import Inventory from "./components/Inventory";
import Reservations from "./components/Reservations";
import Loans from "./components/Loans";
import Reports from "./components/Reports";

import {
  LayoutDashboard,
  Laptop,
  CalendarRange,
  ClipboardList,
  BarChart3,
  LogOut,
  User,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";

export default function App() {
  // Load State from localStorage or fallback to initial data
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem("unsa_usuarios");
    return saved ? JSON.parse(saved) : initialUsuarios;
  });

  const [equipos, setEquipos] = useState<Equipo[]>(() => {
    const saved = localStorage.getItem("unsa_equipos");
    return saved ? JSON.parse(saved) : initialEquipos;
  });

  const [reservas, setReservas] = useState<Reserva[]>(() => {
    const saved = localStorage.getItem("unsa_reservas");
    return saved ? JSON.parse(saved) : initialReservas;
  });

  const [prestamos, setPrestamos] = useState<Prestamo[]>(() => {
    const saved = localStorage.getItem("unsa_prestamos");
    return saved ? JSON.parse(saved) : initialPrestamos;
  });

  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>(() => {
    const saved = localStorage.getItem("unsa_mantenimientos");
    return saved ? JSON.parse(saved) : initialMantenimientos;
  });

  const [logisticTasks, setLogisticTasks] = useState<LogisticTask[]>(() => {
    const saved = localStorage.getItem("unsa_logistic_tasks");
    return saved ? JSON.parse(saved) : initialLogisticTasks;
  });

  // Current User Session (Starts at login screen unless session exists)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem("unsa_session");
    if (saved) return JSON.parse(saved);
    // Start on the login screen by default
    return null;
  });

  // Active Menu Navigation Tab
  const [activeTab, setActiveTab] = useState<"operations" | "inventory" | "reservations" | "loans" | "reports">("operations");

  // User Dropdown Switcher state for Demo and Profile actions
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Save changes to localStorage on any state update
  useEffect(() => {
    localStorage.setItem("unsa_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem("unsa_equipos", JSON.stringify(equipos));
  }, [equipos]);

  useEffect(() => {
    localStorage.setItem("unsa_reservas", JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    localStorage.setItem("unsa_prestamos", JSON.stringify(prestamos));
  }, [prestamos]);

  useEffect(() => {
    localStorage.setItem("unsa_mantenimientos", JSON.stringify(mantenimientos));
  }, [mantenimientos]);

  useEffect(() => {
    localStorage.setItem("unsa_logistic_tasks", JSON.stringify(logisticTasks));
  }, [logisticTasks]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("unsa_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("unsa_session");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.rol === UserRole.ESTUDIANTE || currentUser.rol === UserRole.DOCENTE) {
        if (activeTab === "operations" || activeTab === "loans" || activeTab === "reports") {
          setActiveTab("inventory");
        }
      }
    }
  }, [currentUser, activeTab]);

  const handleRegisterUser = (newUser: Usuario) => {
    setUsuarios((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white" id="main-layout-root">
      {currentUser ? (
        <div className="flex min-h-screen" id="app-wrapper">
          {/* Sidebar Navigation - Desktop */}
          <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 left-0 z-30" id="sidebar-nav">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-100">
                  U
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">StockReserv</h1>
                  <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">UNSA INGENIERÍA</span>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                <button
                  id="sidebar-btn-operations"
                  onClick={() => setActiveTab("operations")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                    activeTab === "operations"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  Tareas de Soporte
                </button>
              )}

              <button
                id="sidebar-btn-inventory"
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeTab === "inventory"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Laptop className="w-4 h-4 shrink-0" />
                Inventario Real-Time
              </button>

              <button
                id="sidebar-btn-reservations"
                onClick={() => setActiveTab("reservations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeTab === "reservations"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <CalendarRange className="w-4 h-4 shrink-0" />
                Reservas y Calendario
              </button>

              {/* Only Admin or Laboratory Assistant can access this menu tab */}
              {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                <button
                  id="sidebar-btn-loans"
                  onClick={() => setActiveTab("loans")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                    activeTab === "loans"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  Préstamos y Devoluciones
                </button>
              )}

              {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                <button
                  id="sidebar-btn-reports"
                  onClick={() => setActiveTab("reports")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                    activeTab === "reports"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  Reportes UNSA
                </button>
              )}
            </nav>

            {/* Sidebar Bottom Promo Card */}
            <div className="p-4 mt-auto">
              <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase">Siguiente Entrega</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                  <p className="text-sm font-bold truncate">MacBook Pro #421</p>
                  <p className="text-[10px] opacity-60 mt-0.5">Hoy - 16:30 PM</p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-600 rounded-full opacity-10"></div>
              </div>
            </div>
          </aside>

          {/* Main Content Pane - Shifted on desktop to give room to the sidebar */}
          <div className="flex-1 flex flex-col lg:pl-64 min-h-screen w-full max-w-full overflow-x-hidden" id="main-content-pane">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20" id="top-header">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl flex items-center gap-1.5 select-none shrink-0">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  Sistema de reservas
                </span>
              </div>

              {/* User Profiling Widget with Dropdown */}
              <div className="flex items-center gap-2 shrink-0 relative">
                {isUserMenuOpen && (
                  <div
                    id="user-menu-backdrop"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                )}

                <div className="relative z-40">
                  <button
                    id="btn-user-profile-menu"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none hover:opacity-80 transition-all select-none"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.nombres} {currentUser.apellidos}</p>
                      <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider">{currentUser.rol.split(" ")[0]}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-indigo-700 font-extrabold text-xs sm:text-sm uppercase shrink-0">
                      {currentUser.nombres[0] || "U"}{currentUser.apellidos ? currentUser.apellidos[0] : ""}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        id="user-profile-dropdown"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-4 text-left z-50 origin-top-right"
                      >
                        {/* Current User Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-indigo-700 font-extrabold text-sm uppercase shrink-0">
                            {currentUser.nombres[0] || "U"}{currentUser.apellidos ? currentUser.apellidos[0] : ""}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {currentUser.nombres} {currentUser.apellidos}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {currentUser.correo}
                            </p>
                            <span className="inline-block mt-1 text-[9px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-md">
                              {currentUser.rol}
                            </span>
                          </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Demo/Role Swapper within dropdown */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Alternar Cuenta (Demo)
                          </p>
                          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-0.5 scrollbar-thin">
                            {usuarios.slice(0, 4).map((u) => {
                              const isActive = currentUser.id_usuario === u.id_usuario;
                              return (
                                <button
                                  key={u.id_usuario}
                                  id={`demo-switch-dropdown-${u.id_usuario}`}
                                  onClick={() => {
                                    setCurrentUser(u);
                                    setIsUserMenuOpen(false);
                                    // Fallback redirect if tab is forbidden for the new user role
                                    if (u.rol === UserRole.ESTUDIANTE || u.rol === UserRole.DOCENTE) {
                                      if (activeTab === "loans" || activeTab === "operations" || activeTab === "reports") {
                                        setActiveTab("inventory");
                                      }
                                    }
                                  }}
                                  className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col ${
                                    isActive
                                      ? "bg-indigo-50/75 border-indigo-200 text-indigo-900"
                                      : "bg-white border-slate-150 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-xs font-bold truncate">
                                      {u.nombres} {u.apellidos}
                                    </span>
                                    {isActive && (
                                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0"></span>
                                    )}
                                  </div>
                                  <span className="text-[9px] opacity-70 mt-0.5 font-medium">
                                    {u.rol}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Logout CTA */}
                        <button
                          id="btn-logout-dropdown"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Cerrar Sesión / Cambiar Cuenta
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* Mobile Navigation bar */}
            <div className="block lg:hidden bg-white border-b border-slate-200 p-2.5 overflow-x-auto scrollbar-none sticky top-20 z-10" id="mobile-nav-bar">
              <div className="flex items-center gap-1.5 min-w-max">
                {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                  <button
                    id="mobile-nav-btn-operations"
                    onClick={() => setActiveTab("operations")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "operations"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Soporte
                  </button>
                )}

                <button
                  id="mobile-nav-btn-inventory"
                  onClick={() => setActiveTab("inventory")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "inventory"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Inventario
                </button>

                <button
                  id="mobile-nav-btn-reservations"
                  onClick={() => setActiveTab("reservations")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "reservations"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" /> Reservas
                </button>

                {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                  <button
                    id="mobile-nav-btn-loans"
                    onClick={() => setActiveTab("loans")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "loans"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" /> Préstamos
                  </button>
                )}

                {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                  <button
                    id="mobile-nav-btn-reports"
                    onClick={() => setActiveTab("reports")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "reports"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Reportes
                  </button>
                )}
              </div>
            </div>

            {/* Inner Dashboard View Grid Layout */}
            <div className="p-4 sm:p-6 md:p-8 flex-1 space-y-6" id="dashboard-workspace-body">
              {/* Dynamic content rendering with slide effects */}
              <div className="min-h-[500px]" id="tab-content-area">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "operations" && (
                      <LogisticsBoard
                        logisticTasks={logisticTasks}
                        onUpdateTasks={setLogisticTasks}
                      />
                    )}

                    {activeTab === "inventory" && (
                      <Inventory
                        equipos={equipos}
                        onUpdateEquipos={setEquipos}
                        currentUser={currentUser}
                      />
                    )}

                    {activeTab === "reservations" && (
                      <Reservations
                        reservas={reservas}
                        equipos={equipos}
                        usuarios={usuarios}
                        prestamos={prestamos}
                        currentUser={currentUser}
                        onUpdateReservas={setReservas}
                        onUpdateEquipos={setEquipos}
                      />
                    )}

                    {activeTab === "loans" && (
                      <Loans
                        prestamos={prestamos}
                        reservas={reservas}
                        equipos={equipos}
                        usuarios={usuarios}
                        currentUser={currentUser}
                        onUpdatePrestamos={setPrestamos}
                        onUpdateEquipos={setEquipos}
                        onUpdateReservas={setReservas}
                      />
                    )}

                    {activeTab === "reports" && (
                      <Reports
                        equipos={equipos}
                        reservas={reservas}
                        prestamos={prestamos}
                        usuarios={usuarios}
                        mantenimientos={mantenimientos}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <footer className="pt-10 pb-6 text-center text-slate-400 text-xs border-t border-slate-150" id="app-footer">
                <p>© 2026 Universidad Nacional de San Agustín de Arequipa (UNSA).</p>
                <p className="mt-1 font-mono text-[10px]">Maestría en Ciencias: Informática • Gestión y Educación • UNSA Ingeniería</p>
              </footer>
            </div>
          </div>
        </div>
      ) : (
        /* Auth Screen centered with custom theme background */
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50" id="login-container">
          <Auth
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            usuarios={usuarios}
            onRegister={handleRegisterUser}
          />
        </div>
      )}
    </div>
  );
}
