"use client";

import { useState, useEffect } from "react";
import { getClinic, updateClinic, type VetClinic } from "@/lib/store";
import { Building2, Save } from "lucide-react";

export default function ConfiguracionPage() {
  const [clinic, setClinic] = useState<VetClinic>({
    name: "Mi Veterinaria",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setClinic(getClinic());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinic(clinic);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Datos de la clínica</h2>
              <p className="text-sm text-gray-600">Esta información aparecerá en tus recibos y reportes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la clínica</label>
              <input
                value={clinic.name}
                onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={clinic.email}
                  onChange={(e) => setClinic({ ...clinic, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  value={clinic.phone}
                  onChange={(e) => setClinic({ ...clinic, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                value={clinic.address}
                onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                value={clinic.city}
                onChange={(e) => setClinic({ ...clinic, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {saved ? "¡Guardado!" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2">🚀 Próximamente</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Sincronización en la nube (Supabase)</li>
            <li>• Suscripciones y pagos (Stripe)</li>
            <li>• Multi-sucursal y equipo</li>
            <li>• Recordatorios por WhatsApp/SMS</li>
            <li>• Reportes e historial médico detallado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
