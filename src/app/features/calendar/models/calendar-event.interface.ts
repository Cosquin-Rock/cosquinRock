/**
 * Interfaz para representar un evento del calendario en la base de datos
 * Esta es la estructura que se guarda y se lee del backend
 */
export interface CalendarEventDB {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO 8601 format: 2024-02-03T10:30:00Z
  endDate: string;   // ISO 8601 format: 2024-02-03T11:30:00Z
  color?: string;    // Color en formato hex: #FF5733
  allDay?: boolean;
  location?: string;
  attendees?: string[]; // Array de emails o IDs de asistentes
  status?: 'confirmed' | 'tentative' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interfaz para el formato que espera Full Calendar
 * Se convierte desde CalendarEventDB
 */
export interface FullCalendarEvent {
  id: string;
  title: string;
  start: Date | string; // Full Calendar acepta ambos formatos
  end: Date | string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allDay?: boolean;
  extendedProps?: {
    description?: string;
    location?: string;
    attendees?: string[];
    status?: string;
    color?: string;
  };
}

/**
 * Request para crear o actualizar un evento
 */
export interface CreateUpdateEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  color?: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

/**
 * Respuesta del backend al obtener eventos
 */
export interface GetEventsResponse {
  success: boolean;
  data: CalendarEventDB[];
  message?: string;
  timestamp?: string;
}

/**
 * Respuesta del backend al crear/actualizar un evento
 */
export interface EventOperationResponse {
  success: boolean;
  data: CalendarEventDB;
  message?: string;
  timestamp?: string;
}

/**
 * Respuesta del backend al eliminar un evento
 */
export interface DeleteEventResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}
