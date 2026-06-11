"use client";

import { useState, useEffect } from "react";
import {
  getClients,
  getPets,
  getPetsByClient,
  getAppointmentsByDate,
  addAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  type Client,
  type Pet,
  type Appointment,
} from "@/lib/store";
import { Plus, CalendarDays } from "lucide-react";

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    clientId: "",
    petId: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    type: "consulta",
    status: "pendiente",
    reason: "",
    price: "",
    duration: "30",
  });

  useEffect(() => {
    setClients(getClients());
    setPets(getPets());
    loadAppointments();
  }, [filterDate]);

  const loadAppointments = () => {
    setAppointments(getAppointmentsByDate(filterDate));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment(form);
    setShowForm(false);
    setForm({ clientId: "", petId: "", date: new Date().toISOString().split("T")[0], time: "09:00", type: "consulta", status: "pendiente", reason: "", price: "", duration: "30" });
    loadAppointments();
  };

  const handleStatusChange = (id: string, status: string) => {
    updateAppointmentStatus(id, status);
    loadAppointments();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    deleteAppointment(id);
    loadAppointments();
  };

  const getClientName = (id: string) => {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "Desconocido";
  };

  const getPetName = (id: string) => {
    const p = pets.find((x) => x.id === id);
    return p?.name || "Desconocido";
  };

  const filteredPets = pets.filter((p) => p.clientId === form.clientId);

  const statusColors: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    confirmada: "bg-blue-100 text-blue-800",
    completada: "bg-green-100 text-green-800",
    cancelada: "bg-red-100 text-red-800",
  };

  const typeLabels: Record<string, string> = {
    consulta: "Consulta",
    vacunacion: "Vacunación",
    cirugia: "Cirugía",
    emergencia: "Emergencia",
    bano: "Baño",
    peluqueria: "Peluquería",
    otro: "Otro",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Nueva cita
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="outline-none"
          />
        </div>
        <span className="text-gray-500">
          {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nueva cita</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value, petId: "" })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Seleccionar cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mascota *</label>
                <select required value={form.petId} onChange={(e) => setForm({ ...form, petId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" disabled={!form.clientId}>
                  <option value="">Seleccionar mascota</option>
                  {filteredPets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                  <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="consulta">Consulta</option>
                    <option value="vacunacion">Vacunación</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="emergencia">Emergencia</option>
                    <option value="bano">Baño</option>
                    <option value="peluqueria">Peluquería</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                  <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 hora</option>
                    <option value="90">1.5 horas</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio estimado</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar cita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay citas para este día.{" "}
            <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline">Crear cita</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg font-bold text-gray-900">{apt.time}</div>
                    <div className="text-xs text-gray-500">{apt.duration} min</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getClientName(apt.clientId)}</div>
                    <div className="text-sm text-gray-600">{getPetName(apt.petId)} — {typeLabels[apt.type]}</div>
                    {apt.reason && <div className="text-xs text-gray-500 mt-1">{apt.reason}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status] || "bg-gray-100"}`}>
                    {apt.status}
                  </span>
                  {apt.status === "pendiente" && (
                    <>
                      <button onClick={() => handleStatusChange(apt.id, "confirmada")} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Confirmar</button>
                      <button onClick={() => handleStatusChange(apt.id, "cancelada")} className="text-xs text-red-600 hover:text-red-800">Cancelar</button>
                    </>
                  )}
                  {apt.status === "confirmada" && (
                    <button onClick={() => handleStatusChange(apt.id, "completada")} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Completar</button>
                  )}
                  <button onClick={() => handleDelete(apt.id)} className="text-xs text-gray-400 hover:text-red-600">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
