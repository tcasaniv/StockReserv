/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Usuario, Equipo, Reserva, Prestamo, Mantenimiento, LogisticTask, UserRole } from "./types";

export const initialUsuarios: Usuario[] = [
  {
    id_usuario: "usr-1",
    nombres: "Terry Joel",
    apellidos: "Casani Valencia",
    correo: "tcasani@unsa.edu.pe", // Matching the logged-in user!
    contrasena: "123456",
    rol: UserRole.ADMIN,
    estado: "Activo"
  },
  {
    id_usuario: "usr-2",
    nombres: "José Carlos",
    apellidos: "Anci Pinto",
    correo: "janci@unsa.edu.pe",
    contrasena: "123456",
    rol: UserRole.DOCENTE,
    estado: "Activo"
  },
  {
    id_usuario: "usr-3",
    nombres: "Javier Ignacio",
    apellidos: "Machaca Casani",
    correo: "jmachaca@unsa.edu.pe",
    contrasena: "123456",
    rol: UserRole.ENCARGADO,
    estado: "Activo"
  },
  {
    id_usuario: "usr-4",
    nombres: "Jaime Nicanor",
    apellidos: "Laime Quispe",
    correo: "jlaime@unsa.edu.pe",
    contrasena: "123456",
    rol: UserRole.ESTUDIANTE,
    estado: "Activo"
  },
  {
    id_usuario: "usr-5",
    nombres: "Delia Cristina",
    apellidos: "Valencia Vargas",
    correo: "dvalencia@unsa.edu.pe",
    contrasena: "123456",
    rol: UserRole.DOCENTE,
    estado: "Activo"
  }
];

export const initialEquipos: Equipo[] = [
  {
    id_equipo: "eq-1",
    codigo: "LAP-001",
    nombre: "Laptop Dell Vostro 3400",
    tipo: "Laptop",
    marca: "Dell",
    modelo: "Vostro 3400",
    serie: "MX12345678",
    estado: "Disponible",
    ubicacion: "Laboratorio de Cómputo A"
  },
  {
    id_equipo: "eq-2",
    codigo: "LAP-002",
    nombre: "Laptop Lenovo ThinkPad L14",
    tipo: "Laptop",
    marca: "Lenovo",
    modelo: "ThinkPad L14",
    serie: "LNV87654321",
    estado: "Reservado",
    ubicacion: "Laboratorio de Cómputo B"
  },
  {
    id_equipo: "eq-3",
    codigo: "PROY-001",
    nombre: "Proyector Epson PowerLite X49",
    tipo: "Proyector",
    marca: "Epson",
    modelo: "PowerLite X49",
    serie: "EPS998877",
    estado: "Prestado",
    ubicacion: "Almacén de Medios"
  },
  {
    id_equipo: "eq-4",
    codigo: "PROY-002",
    nombre: "Proyector Epson PowerLite X49",
    tipo: "Proyector",
    marca: "Epson",
    modelo: "PowerLite X49",
    serie: "EPS112233",
    estado: "Mantenimiento",
    ubicacion: "Laboratorio de Soporte"
  },
  {
    id_equipo: "eq-5",
    codigo: "CAM-001",
    nombre: "Cámara Sony Alpha A6400",
    tipo: "Cámara",
    marca: "Sony",
    modelo: "Alpha A6400",
    serie: "SNY554433",
    estado: "Disponible",
    ubicacion: "Almacén de Medios"
  },
  {
    id_equipo: "eq-6",
    codigo: "TAB-001",
    nombre: "iPad Air 5ta Generación",
    tipo: "Tablet",
    marca: "Apple",
    modelo: "Air 10.9\"",
    serie: "APL776655",
    estado: "Disponible",
    ubicacion: "Biblioteca Central"
  },
  {
    id_equipo: "eq-7",
    codigo: "TAB-002",
    nombre: "iPad Air 5ta Generación",
    tipo: "Tablet",
    marca: "Apple",
    modelo: "Air 10.9\"",
    serie: "APL776699",
    estado: "Prestado",
    ubicacion: "Biblioteca Central"
  },
  {
    id_equipo: "eq-8",
    codigo: "LAB-M01",
    nombre: "Maletín Tecnológico de Tablets (x10)",
    tipo: "Laboratorio Móvil",
    marca: "Multi-brand",
    modelo: "MT-10X",
    serie: "MOB881122",
    estado: "Disponible",
    ubicacion: "Almacén de Cómputo"
  }
];

// Current date in environment: 2026-06-29
export const initialReservas: Reserva[] = [
  {
    id_reserva: "res-1",
    usuario_id: "usr-2", // José Carlos
    equipo_id: "eq-2", // Laptop Lenovo ThinkPad L14
    fecha: "2026-06-30",
    hora_inicio: "08:00",
    hora_fin: "10:30",
    estado: "Aprobada"
  },
  {
    id_reserva: "res-2",
    usuario_id: "usr-5", // Delia Cristina
    equipo_id: "eq-3", // Proyector Epson
    fecha: "2026-06-29",
    hora_inicio: "10:00",
    hora_fin: "12:00",
    estado: "Aprobada"
  },
  {
    id_reserva: "res-3",
    usuario_id: "usr-4", // Sussy Mendivil
    equipo_id: "eq-1", // Laptop Dell
    fecha: "2026-07-01",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    estado: "Pendiente"
  },
  {
    id_reserva: "res-4",
    usuario_id: "usr-2", // José Carlos
    equipo_id: "eq-5", // Sony Cam
    fecha: "2026-06-29",
    hora_inicio: "15:00",
    hora_fin: "17:30",
    estado: "Pendiente"
  },
  {
    id_reserva: "res-5",
    usuario_id: "usr-5", // Delia Cristina
    equipo_id: "eq-7", // iPad Air 2
    fecha: "2026-06-29",
    hora_inicio: "09:00",
    hora_fin: "11:00",
    estado: "Aprobada"
  }
];

export const initialPrestamos: Prestamo[] = [
  {
    id_prestamo: "lp-1",
    reserva_id: "res-2", // Proyector Epson
    fecha_prestamo: "2026-06-29 10:05",
    estado: "Activo"
  },
  {
    id_prestamo: "lp-2",
    reserva_id: "res-5", // iPad Air 2
    fecha_prestamo: "2026-06-29 09:12",
    estado: "Activo"
  }
];

export const initialMantenimientos: Mantenimiento[] = [
  {
    id_mantenimiento: "maint-1",
    equipo_id: "eq-4", // Proyector
    fecha: "2026-06-28",
    descripcion: "Filtro obstruido y lámpara con bajo brillo. Requiere cambio de repuesto.",
    tecnico: "Jaime Nicanor Laime",
    estado: "En Proceso"
  }
];

// Detalles del Equipo de Soporte y Logística IT
export const logisticTeam = {
  coordinador: "Anci Pinto, José Carlos",
  supervisor: "Casani Valencia, Terry Joel",
  team: [
    "Laime Quispe, Jaime Nicanor",
    "Machaca Casani, Javier Ignacio",
    "Valencia Vargas, Delia Cristina",
    "Mendivil Chavez, Sussy",
    "Rosello Sanchez, Hilaria Veronica"
  ],
  ciclo: "Ciclo Activo: Gestión y Mantenimiento de Equipos",
  duration: "23 de Junio - 7 de Julio, 2026",
  goal: "Asegurar la disponibilidad del 100% de proyectores para las clases de examen, completar el mantenimiento correctivo de las laptops Dell y optimizar el despacho de tablets."
};

export const initialLogisticTasks: LogisticTask[] = [
  {
    id: "task-1",
    title: "Revisión preventiva de Proyectores",
    description: "Limpieza de filtros y comprobación de horas de lámpara en proyectores Epson de los almacenes.",
    status: "done",
    assignee: "Laime Quispe, Jaime Nicanor",
    points: 3
  },
  {
    id: "task-2",
    title: "Actualización de Laptops para Docentes",
    description: "Instalar sistema operativo y herramientas UNSA de ingeniería en las laptops Dell Vostro.",
    status: "done",
    assignee: "Rosello Sanchez, Hilaria Veronica",
    points: 5
  },
  {
    id: "task-3",
    title: "Etiquetado físico de nuevos iPads",
    description: "Generar y pegar etiquetas con código de activo en los maletines de tablets recién adquiridos.",
    status: "done",
    assignee: "Machaca Casani, Javier Ignacio",
    points: 8
  },
  {
    id: "task-4",
    title: "Mantenimiento correctivo de Proyector EPS998877",
    description: "Reemplazar filtro obstruido y calibrar brillo de lámpara en el laboratorio de soporte.",
    status: "in_progress",
    assignee: "Casani Valencia, Terry Joel",
    points: 8
  },
  {
    id: "task-5",
    title: "Auditoría física de iPads en Biblioteca",
    description: "Confirmar que los iPads registrados en Biblioteca Central se encuentren físicamente en los estantes.",
    status: "in_progress",
    assignee: "Valencia Vargas, Delia Cristina",
    points: 5
  },
  {
    id: "task-6",
    title: "Capacitación a encargados del laboratorio",
    description: "Explicar el nuevo flujo de despacho y retorno de reservas al personal auxiliar de soporte.",
    status: "todo",
    assignee: "Mendivil Chavez, Sussy",
    points: 5
  }
];
