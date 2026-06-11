"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStats,
  getClients,
  getPets,
  getAppointmentsByDate,
  seedData,
  type Client,
  type Pet,
  type Appointment,
} from "@/lib/store";
import { Users, PawPrint, CalendarDays, DollarSign, Plus } from "lucide-react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ totalClients: 0, totalPets: 0, todayAppointments: 0 });
  const [todayApts, setTodayApts] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    seedData();
    setMounted(true);
    setStats(getStats());
    setTodayApts(getAppointmentsByDate(new Date().toISOString().split("T")[0]));
    setClients(getClients());
    setPets(getPets());
  }, []);

  if (!mounted) return <div className="p-8">Cargando...</div>;

  const statCards = [
    { label: "Clientes", value: stats.totalClients, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Mascotas", value: stats.totalPets, icon: PawPrint, color: "bg-green-100 text-green-600" },
    { label: "Citas hoy", value: stats.todayAppointments, icon: CalendarDays, color: "bg-purple-100 text-purple-600" },
    { label: "Ingresos hoy", value: "$0", icon: DollarSign, color: "bg-amber-100 text-amber-600" },
  ];

  const getClientName = (id: string) => {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "Desconocido";
  };

  const getPetName = (id: string) => {
    const p = pets.find((x) => x.id === id);
    return p?.name || "Desconocido";
  };

  const statusColors: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-700",
    confirmada: "bg-blue-100 text-blue-700",
    completada: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/clientes"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo cliente
        </Link>
        <Link
          href="/citas"
          className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
        >
          <Plus className="w-4 h-4" /> Nueva cita
        </Link>
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Citas de hoy</h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
        {todayApts.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No hay citas para hoy.{" "}
            <Link href="/citas" className="text-blue-600 hover:underline">
              Crear una cita
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {todayApts.map((apt) => (
              <div key={apt.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg font-bold text-gray-900">{apt.time}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getClientName(apt.clientId)}</div>
                    <div className="text-sm text-gray-600">
                      {getPetName(apt.petId)} — {apt.type}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status] || "bg-gray-100"}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
