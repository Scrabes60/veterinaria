"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getClients,
  getPets,
  getPetsByClient,
  addPet,
  deletePet,
  type Client,
  type Pet,
} from "@/lib/store";
import { Plus, Search, PawPrint, Weight, Calendar } from "lucide-react";

function MascotasContent() {
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get("client");

  const [pets, setPets] = useState<Pet[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    clientId: clientFilter || "",
    name: "",
    species: "perro",
    breed: "",
    birthDate: "",
    gender: "",
    weight: "",
    allergies: "",
    medicalNotes: "",
  });

  useEffect(() => {
    setPets(getPets());
    setClients(getClients());
  }, []);

  const refresh = () => setPets(getPets());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPet(form);
    setShowForm(false);
    setForm({ clientId: "", name: "", species: "perro", breed: "", birthDate: "", gender: "", weight: "", allergies: "", medicalNotes: "" });
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar esta mascota?")) return;
    deletePet(id);
    refresh();
  };

  const getClientName = (id: string) => {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "Desconocido";
  };

  const filteredPets = clientFilter
    ? pets.filter((p) => p.clientId === clientFilter)
    : pets.filter((p) =>
        `${p.name} ${p.breed} ${getClientName(p.clientId)}`.toLowerCase().includes(search.toLowerCase())
      );

  const speciesColors: Record<string, string> = {
    perro: "bg-amber-100 text-amber-800",
    gato: "bg-pink-100 text-pink-800",
    ave: "bg-sky-100 text-sky-800",
    conejo: "bg-green-100 text-green-800",
    reptil: "bg-emerald-100 text-emerald-800",
    otro: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {clientFilter ? `Mascotas de ${getClientName(clientFilter)}` : "Mascotas"}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Nueva mascota
        </button>
      </div>

      {!clientFilter && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, raza o dueño..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nueva mascota</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dueño *</label>
                <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Seleccionar dueño</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                  <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="ave">Ave</option>
                    <option value="conejo">Conejo</option>
                    <option value="reptil">Reptil</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                  <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Labrador, Siamés..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nacimiento</label>
                  <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Seleccionar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
                <input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas médicas</label>
                <textarea value={form.medicalNotes} onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar mascota</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredPets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? "No se encontraron mascotas" : "No hay mascotas registradas"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <PawPrint className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${speciesColors[pet.species] || speciesColors.otro}`}>
                      {pet.species}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(pet.id)} className="text-red-400 hover:text-red-600 text-sm">Eliminar</button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Dueño:</span>
                  <span className="font-medium">{getClientName(pet.clientId)}</span>
                </div>
                {pet.breed && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Raza:</span>
                    <span>{pet.breed}</span>
                  </div>
                )}
                {pet.weight && (
                  <div className="flex items-center gap-2">
                    <Weight className="w-3 h-3 text-gray-400" />
                    <span>{pet.weight} kg</span>
                  </div>
                )}
                {pet.birthDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{new Date(pet.birthDate).toLocaleDateString("es-MX")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MascotasPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
      <MascotasContent />
    </Suspense>
  );
}
