"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getClients,
  getPetsByClient,
  addClient,
  updateClient,
  deleteClient,
  type Client,
} from "@/lib/store";
import { Plus, Search, Phone, Mail, MapPin, Pencil, Trash2, PawPrint } from "lucide-react";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    setClients(getClients());
  }, []);

  const refresh = () => setClients(getClients());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateClient(editing.id, form);
    } else {
      addClient(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", notes: "" });
    refresh();
  };

  const handleEdit = (client: Client) => {
    setEditing(client);
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      notes: client.notes,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este cliente y sus mascotas?")) return;
    deleteClient(id);
    refresh();
  };

  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", notes: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Nuevo cliente
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? "Editar cliente" : "Nuevo cliente"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? "Guardar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{search ? "No se encontraron clientes" : "No hay clientes"}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Cliente</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Contacto</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Mascotas</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.firstName} {c.lastName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.city || "Sin ciudad"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</div>
                    {c.email && <div className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <PawPrint className="w-3 h-3" /> {getPetsByClient(c.id).length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/mascotas?client=${c.id}`} className="text-blue-600 hover:text-blue-800 text-sm">Ver mascotas</Link>
                      <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
