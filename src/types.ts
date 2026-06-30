/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = "Administrador",
  DOCENTE = "Docente",
  ENCARGADO = "Encargado del Laboratorio",
  ESTUDIANTE = "Estudiante"
}

export interface Usuario {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string; // Encriptada simulada o simple
  rol: UserRole;
  estado: "Activo" | "Inactivo";
}

export interface Equipo {
  id_equipo: string;
  codigo: string;
  nombre: string;
  tipo: string; // Laptop, Proyector, Cámara, Tablet, etc.
  marca: string;
  modelo: string;
  serie: string;
  estado: "Disponible" | "Prestado" | "Reservado" | "Mantenimiento";
  ubicacion: string;
}

export interface Reserva {
  id_reserva: string;
  usuario_id: string;
  equipo_id: string;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:MM
  hora_fin: string; // HH:MM
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "Cancelada";
}

export interface Prestamo {
  id_prestamo: string;
  reserva_id: string;
  fecha_prestamo: string; // YYYY-MM-DD HH:MM
  fecha_devolucion?: string; // YYYY-MM-DD HH:MM (cuando se devuelve)
  observaciones?: string;
  estado: "Activo" | "Devuelto" | "Tardio";
}

export interface Mantenimiento {
  id_mantenimiento: string;
  equipo_id: string;
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  tecnico: string;
  estado: "En Proceso" | "Completado";
}

// Logistic Task Types
export interface LogisticTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "qa" | "done";
  assignee: string;
  points: number; // Horas estimadas o dificultad
}
