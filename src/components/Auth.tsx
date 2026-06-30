/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Usuario, UserRole } from "../types";
import { Shield, Mail, Lock, User, Plus, Check, RefreshCw } from "lucide-react";

interface AuthProps {
  currentUser: Usuario | null;
  setCurrentUser: (user: Usuario | null) => void;
  usuarios: Usuario[];
  onRegister: (newUser: Usuario) => void;
}

export default function Auth({ currentUser, setCurrentUser, usuarios, onRegister }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [rol, setRol] = useState<UserRole>(UserRole.DOCENTE);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = usuarios.find((u) => u.correo === correo && u.contrasena === contrasena);
    if (user) {
      if (user.estado === "Inactivo") {
        setError("Esta cuenta se encuentra inactiva. Contacte al administrador.");
        return;
      }
      setCurrentUser(user);
    } else {
      setError("Credenciales incorrectas. Intente de nuevo.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombres || !apellidos || !correo || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (usuarios.some((u) => u.correo === correo)) {
      setError("El correo ya se encuentra registrado.");
      return;
    }

    const newUser: Usuario = {
      id_usuario: `usr-${Date.now()}`,
      nombres,
      apellidos,
      correo,
      contrasena,
      rol,
      estado: "Activo"
    };

    onRegister(newUser);
    setSuccess("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
    setIsLogin(true);
    setCorreo(newUser.correo);
    setContrasena(newUser.contrasena);
  };

  // Quick helper to fill credentials for testing
  const quickLogin = (user: Usuario) => {
    setCorreo(user.correo);
    setContrasena(user.contrasena);
    setCurrentUser(user);
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4" id="auth-container">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden" id="auth-card">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800 opacity-90"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white mb-3 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight text-white">StockReserv</h2>
            <p className="text-xs text-indigo-100 mt-1">Gestión de recursos informáticos en tiempo real</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-r-xl" id="auth-error">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs rounded-r-xl" id="auth-success">
              {success}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4" id="login-form">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Institucional
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@unsa.edu.pe"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Iniciar Sesión
              </button>

              <div className="text-center mt-4">
                <button
                  id="btn-toggle-register"
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  ¿No tienes una cuenta? Regístrate aquí
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4" id="register-form">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nombres
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="register-nombres"
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      placeholder="Juan"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Apellidos
                  </label>
                  <input
                    id="register-apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Pérez"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Institucional
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@unsa.edu.pe"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Rol Solicitado
                </label>
                <select
                  id="register-rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value={UserRole.DOCENTE}>{UserRole.DOCENTE}</option>
                  <option value={UserRole.ENCARGADO}>{UserRole.ENCARGADO}</option>
                  <option value={UserRole.ESTUDIANTE}>{UserRole.ESTUDIANTE}</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Nota: El rol de Administrador solo se asigna internamente.
                </p>
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Registrar Cuenta
              </button>

              <div className="text-center mt-4">
                <button
                  id="btn-toggle-login"
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  ¿Ya tienes una cuenta? Inicia sesión
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick-test panel */}
        <div className="bg-slate-50/60 p-6 border-t border-slate-200" id="quick-login-section">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-3">
            <RefreshCw className="w-3 h-3 text-indigo-500 shrink-0" />
            Acceso Rápido para Demostración
          </div>
          <div className="grid grid-cols-2 gap-2">
            {usuarios.slice(0, 4).map((u) => (
              <button
                key={u.id_usuario}
                id={`quick-login-${u.id_usuario}`}
                onClick={() => quickLogin(u)}
                className="p-2.5 text-left bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-50/50 transition-all group cursor-pointer text-xs min-w-0"
              >
                <div className="font-bold text-slate-800 truncate group-hover:text-indigo-600" title={`${u.nombres} ${u.apellidos}`}>
                  {u.nombres}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate" title={u.rol}>
                  {u.rol}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
            Presiona cualquier usuario para iniciar sesión directamente con su rol correspondiente y probar la interfaz adaptable.
          </p>
        </div>
      </div>
    </div>
  );
}
