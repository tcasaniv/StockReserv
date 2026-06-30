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
  ChevronRight,
  Menu,
  X
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

  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

  // Desktop sidebar collapse/expand state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <aside className={`w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`} id="sidebar-nav">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-100">
                  S
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">StockReserv</h1>
                  <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">Reserva equipos</span>
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

            {/* Desktop Sidebar User Profile & Account Switcher */}
            <div className="p-4 border-t border-slate-150 bg-slate-50 mt-auto" id="sidebar-user-footer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-indigo-700 font-extrabold text-xs uppercase shrink-0">
                  {currentUser.nombres[0] || "U"}{currentUser.apellidos ? currentUser.apellidos[0] : ""}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.nombres} {currentUser.apellidos}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider">
                    {currentUser.rol.split(" ")[0]}
                  </p>
                </div>
              </div>

              {/* Account Switcher and Logout buttons */}
              <div className="space-y-1.5">
                <div className="relative">
                  <button
                    id="btn-sidebar-switch-accounts-toggle"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Cambiar de cuenta
                    </span>
                    <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-90" : ""}`} />
                  </button>

                  {/* Dropdown switch options directly in-sidebar */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 space-y-1 bg-white border border-slate-150 rounded-xl p-1.5 max-h-40 overflow-y-auto shadow-inner"
                      >
                        {usuarios.slice(0, 4).map((u) => {
                          const isActive = currentUser.id_usuario === u.id_usuario;
                          return (
                            <button
                              key={u.id_usuario}
                              id={`sidebar-switch-user-${u.id_usuario}`}
                              onClick={() => {
                                setCurrentUser(u);
                                setIsUserMenuOpen(false);
                                if (u.rol === UserRole.ESTUDIANTE || u.rol === UserRole.DOCENTE) {
                                  if (activeTab === "loans" || activeTab === "operations" || activeTab === "reports") {
                                    setActiveTab("inventory");
                                  }
                                }
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-between ${
                                isActive
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                              }`}
                            >
                              <span className="truncate">{u.nombres} ({u.rol.split(" ")[0]})</span>
                              {isActive && <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  id="btn-sidebar-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Navigation Drawer - Slider */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="mobile-drawer-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-slate-950 z-45 lg:hidden"
                />
                {/* Drawer panel */}
                <motion.aside
                  key="mobile-drawer-panel"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
                  id="mobile-drawer-aside"
                >
                  {/* Header of Drawer */}
                  <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-md shadow-md shadow-indigo-100">
                        S
                      </div>
                      <div>
                        <h1 className="font-bold text-sm tracking-tight text-slate-900 leading-none">StockReserv</h1>
                        <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">Reserva equipos</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
                      id="mobile-drawer-close-btn"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation Options in Drawer */}
                  <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                      <button
                        id="drawer-btn-operations"
                        onClick={() => {
                          setActiveTab("operations");
                          setIsMobileMenuOpen(false);
                        }}
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
                      id="drawer-btn-inventory"
                      onClick={() => {
                        setActiveTab("inventory");
                        setIsMobileMenuOpen(false);
                      }}
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
                      id="drawer-btn-reservations"
                      onClick={() => {
                        setActiveTab("reservations");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeTab === "reservations"
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <CalendarRange className="w-4 h-4 shrink-0" />
                      Reservas y Calendario
                    </button>

                    {(currentUser.rol === UserRole.ADMIN || currentUser.rol === UserRole.ENCARGADO) && (
                      <button
                        id="drawer-btn-loans"
                        onClick={() => {
                          setActiveTab("loans");
                          setIsMobileMenuOpen(false);
                        }}
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
                        id="drawer-btn-reports"
                        onClick={() => {
                          setActiveTab("reports");
                          setIsMobileMenuOpen(false);
                        }}
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

                  {/* User info at bottom of Drawer for premium native app touch */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-indigo-700 font-extrabold text-xs uppercase shrink-0">
                        {currentUser.nombres[0] || "U"}{currentUser.apellidos ? currentUser.apellidos[0] : ""}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.nombres} {currentUser.apellidos}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {currentUser.correo}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Switcher & Actions */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <button
                          id="btn-mobile-switch-accounts-toggle"
                          onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Cambiar de cuenta
                          </span>
                          <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isMobileUserMenuOpen ? "rotate-90" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isMobileUserMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-1.5 space-y-1 bg-white border border-slate-150 rounded-xl p-1.5 max-h-40 overflow-y-auto shadow-inner text-left"
                            >
                              {usuarios.slice(0, 4).map((u) => {
                                const isActive = currentUser.id_usuario === u.id_usuario;
                                return (
                                  <button
                                    key={u.id_usuario}
                                    id={`mobile-switch-user-${u.id_usuario}`}
                                    onClick={() => {
                                      setCurrentUser(u);
                                      setIsMobileUserMenuOpen(false);
                                      setIsMobileMenuOpen(false);
                                      if (u.rol === UserRole.ESTUDIANTE || u.rol === UserRole.DOCENTE) {
                                        if (activeTab === "loans" || activeTab === "operations" || activeTab === "reports") {
                                          setActiveTab("inventory");
                                        }
                                      }
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-between ${
                                      isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                    }`}
                                  >
                                    <span className="truncate">{u.nombres} ({u.rol.split(" ")[0]})</span>
                                    {isActive && <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        id="drawer-logout-btn"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content Pane - Shifted on desktop to give room to the sidebar */}
          <div className={`flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-0"}`} id="main-content-pane">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20" id="top-header">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  id="btn-hamburger"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsMobileMenuOpen(true);
                    } else {
                      setIsSidebarOpen(!isSidebarOpen);
                    }
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

            </header>

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
