/**
 * EJEMPLOS DE ENDPOINTS BACKEND PARA CALENDAR
 * 
 * Este archivo muestra ejemplos de cómo implementar los endpoints
 * en tu backend (Node.js/Express, .NET, Python, etc.)
 * 
 * El servicio angular espera estos endpoints con estas respuestas exactas
 */

// ============================================
// EJEMPLO CON EXPRESS.JS (Node.js)
// ============================================

/*

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// GET /api/events - Obtener todos los eventos
router.get('/', async (req: Request, res: Response) => {
  try {
    // Aquí irá tu lógica para obtener de la BD
    const events = await EventModel.find();
    
    res.json({
      success: true,
      data: events,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos'
    });
  }
});

// POST /api/events - Crear un nuevo evento
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, color, allDay, location, attendees, status } = req.body;
    
    // Validar datos
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Datos requeridos: title, startDate, endDate'
      });
    }

    const newEvent = {
      id: generateUUID(),
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color,
      allDay: allDay || false,
      location,
      attendees: attendees || [],
      status: status || 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Guardar en BD
    const savedEvent = await EventModel.create(newEvent);

    res.status(201).json({
      success: true,
      data: savedEvent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear evento'
    });
  }
});

// PUT /api/events/:id - Actualizar evento
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Actualizar en BD
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: updatedEvent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evento'
    });
  }
});

// DELETE /api/events/:id - Eliminar evento
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Eliminar de BD
    const result = await EventModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento'
    });
  }
});

export default router;

*/

// ============================================
// EJEMPLO CON .NET (C#)
// ============================================

/*

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly ICalendarEventService _eventService;

    public EventsController(ICalendarEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        try
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(new
            {
                success = true,
                data = events,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error al obtener eventos"
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newEvent = new CalendarEvent
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Description = request.Description,
                StartDate = DateTime.Parse(request.StartDate),
                EndDate = DateTime.Parse(request.EndDate),
                Color = request.Color,
                AllDay = request.AllDay ?? false,
                Location = request.Location,
                Attendees = request.Attendees,
                Status = request.Status ?? "confirmed",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var savedEvent = await _eventService.CreateEventAsync(newEvent);

            return Created($"api/events/{savedEvent.Id}", new
            {
                success = true,
                data = savedEvent,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error al crear evento"
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(string id, [FromBody] CreateEventRequest request)
    {
        try
        {
            var updatedEvent = await _eventService.UpdateEventAsync(id, request);
            if (updatedEvent == null)
                return NotFound();

            return Ok(new
            {
                success = true,
                data = updatedEvent,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error al actualizar evento"
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(string id)
    {
        try
        {
            var success = await _eventService.DeleteEventAsync(id);
            if (!success)
                return NotFound();

            return Ok(new
            {
                success = true,
                message = "Evento eliminado correctamente",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error al eliminar evento"
            });
        }
    }
}

*/

// ============================================
// EJEMPLO CON PYTHON (Flask)
// ============================================

/*

from flask import Blueprint, request, jsonify
from datetime import datetime
from uuid import uuid4

events_bp = Blueprint('events', __name__, url_prefix='/api/events')

# Simulando BD (usar SQLAlchemy en producción)
events_db = []

@events_bp.route('', methods=['GET'])
def get_events():
    try:
        return jsonify({
            'success': True,
            'data': events_db,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al obtener eventos'
        }), 500

@events_bp.route('', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        
        # Validar requeridos
        if not all(k in data for k in ['title', 'startDate', 'endDate']):
            return jsonify({
                'success': False,
                'message': 'Datos requeridos: title, startDate, endDate'
            }), 400

        new_event = {
            'id': str(uuid4()),
            'title': data.get('title'),
            'description': data.get('description'),
            'startDate': data.get('startDate'),
            'endDate': data.get('endDate'),
            'color': data.get('color'),
            'allDay': data.get('allDay', False),
            'location': data.get('location'),
            'attendees': data.get('attendees', []),
            'status': data.get('status', 'confirmed'),
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat()
        }

        events_db.append(new_event)

        return jsonify({
            'success': True,
            'data': new_event,
            'timestamp': datetime.utcnow().isoformat()
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al crear evento'
        }), 500

@events_bp.route('<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        data = request.get_json()
        
        event = next((e for e in events_db if e['id'] == event_id), None)
        if not event:
            return jsonify({
                'success': False,
                'message': 'Evento no encontrado'
            }), 404

        # Actualizar campos
        for key in data:
            if key not in ['id', 'createdAt']:
                event[key] = data[key]
        
        event['updatedAt'] = datetime.utcnow().isoformat()

        return jsonify({
            'success': True,
            'data': event,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al actualizar evento'
        }), 500

@events_bp.route('<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        global events_db
        events_db = [e for e in events_db if e['id'] != event_id]

        return jsonify({
            'success': True,
            'message': 'Evento eliminado correctamente',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al eliminar evento'
        }), 500

*/

// ============================================
// ESTRUCTURA DE DATOS
// ============================================

/*

CalendarEvent (en BD):
{
  id: string (UUID)
  title: string (requerido)
  description: string (opcional)
  startDate: DateTime ISO 8601 (requerido) - Ej: 2024-02-03T10:00:00Z
  endDate: DateTime ISO 8601 (requerido)   - Ej: 2024-02-03T11:00:00Z
  color: string hex (opcional) - Ej: #FF5733
  allDay: boolean (opcional, default: false)
  location: string (opcional)
  attendees: string[] (opcional) - Ej: ["user1@example.com"]
  status: 'confirmed' | 'tentative' | 'cancelled' (default: 'confirmed')
  createdAt: DateTime ISO 8601
  updatedAt: DateTime ISO 8601
}

*/

// ============================================
// CONSIDERACIONES IMPORTANTES
// ============================================

/*

1. FORMATOS DE FECHA:
   - Siempre usar ISO 8601 con UTC (Z)
   - Ej: 2024-02-03T10:00:00Z
   - El cliente convertirá a zona horaria local automáticamente

2. TIMESTAMPS:
   - Usar DateTime UTC en base de datos
   - Retornar con Z al final en JSON

3. VALIDACIÓN:
   - Validar título, startDate, endDate como requeridos
   - Validar que endDate > startDate
   - Validar formato de email en attendees

4. SEGURIDAD:
   - Implementar autenticación/autorización
   - Validar que el usuario pueda ver/editar eventos
   - Filtrar eventos por usuario/rol si es necesario

5. MANEJO DE ERRORES:
   - Retornar siempre con estructura: { success, data/message, timestamp }
   - Usar códigos HTTP correctos (200, 201, 400, 404, 500)

6. PERFORMANCE:
   - Paginar si hay muchos eventos (parámetros limit/offset)
   - Indexar por startDate/endDate para búsquedas rápidas
   - Considerar caché si hay lecturas frecuentes

*/

export {};
