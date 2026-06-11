"use client";

import { v4 as uuidv4 } from "uuid";

// Tipos
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  gender: string;
  weight: string;
  allergies: string;
  medicalNotes: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason: string;
  price: string;
  duration: string;
  createdAt: string;
}

export interface VetClinic {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

// Helper para localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Clientes
export function getClients(): Client[] {
  return getItem<Client[]>("vetcrm_clients", []);
}

export function addClient(client: Omit<Client, "id" | "createdAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  setItem("vetcrm_clients", [...clients, newClient]);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): void {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates };
    setItem("vetcrm_clients", clients);
  }
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  setItem("vetcrm_clients", clients);
  // También eliminar mascotas asociadas
  const pets = getPets().filter((p) => p.clientId !== id);
  setItem("vetcrm_pets", pets);
}

// Mascotas
export function getPets(): Pet[] {
  return getItem<Pet[]>("vetcrm_pets", []);
}

export function getPetsByClient(clientId: string): Pet[] {
  return getPets().filter((p) => p.clientId === clientId);
}

export function addPet(pet: Omit<Pet, "id" | "createdAt">): Pet {
  const pets = getPets();
  const newPet: Pet = {
    ...pet,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  setItem("vetcrm_pets", [...pets, newPet]);
  return newPet;
}

export function deletePet(id: string): void {
  const pets = getPets().filter((p) => p.id !== id);
  setItem("vetcrm_pets", pets);
}

// Citas
export function getAppointments(): Appointment[] {
  return getItem<Appointment[]>("vetcrm_appointments", []);
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return getAppointments()
    .filter((a) => a.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function addAppointment(apt: Omit<Appointment, "id" | "createdAt">): Appointment {
  const appointments = getAppointments();
  const newApt: Appointment = {
    ...apt,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  setItem("vetcrm_appointments", [...appointments, newApt]);
  return newApt;
}

export function updateAppointmentStatus(id: string, status: string): void {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index].status = status;
    setItem("vetcrm_appointments", appointments);
  }
}

export function deleteAppointment(id: string): void {
  const appointments = getAppointments().filter((a) => a.id !== id);
  setItem("vetcrm_appointments", appointments);
}

// Clinica
export function getClinic(): VetClinic {
  return getItem<VetClinic>("vetcrm_clinic", {
    name: "Mi Veterinaria",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
}

export function updateClinic(clinic: VetClinic): void {
  setItem("vetcrm_clinic", clinic);
}

// Stats
export function getStats() {
  return {
    totalClients: getClients().length,
    totalPets: getPets().length,
    todayAppointments: getAppointmentsByDate(new Date().toISOString().split("T")[0]).length,
  };
}

// Seed data inicial
export function seedData() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("vetcrm_seeded")) return;

  // Clientes de ejemplo
  const client1 = addClient({
    firstName: "María",
    lastName: "González",
    email: "maria@email.com",
    phone: "555-1234",
    address: "Calle Principal 123",
    city: "Ciudad de México",
    notes: "Cliente frecuente",
  });

  const client2 = addClient({
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos@email.com",
    phone: "555-5678",
    address: "Av. Reforma 456",
    city: "Guadalajara",
    notes: "",
  });

  // Mascotas de ejemplo
  addPet({
    clientId: client1.id,
    name: "Luna",
    species: "perro",
    breed: "Labrador",
    birthDate: "2020-05-15",
    gender: "hembra",
    weight: "25",
    allergies: "Ninguna",
    medicalNotes: "Vacunación al día",
  });

  addPet({
    clientId: client1.id,
    name: "Michi",
    species: "gato",
    breed: "Siamés",
    birthDate: "2021-03-10",
    gender: "macho",
    weight: "4.5",
    allergies: "Polen",
    medicalNotes: "",
  });

  addPet({
    clientId: client2.id,
    name: "Rocky",
    species: "perro",
    breed: "Bulldog",
    birthDate: "2019-08-22",
    gender: "macho",
    weight: "18",
    allergies: "",
    medicalNotes: "Problemas de piel",
  });

  // Cita de ejemplo para hoy
  const today = new Date().toISOString().split("T")[0];
  addAppointment({
    clientId: client1.id,
    petId: getPetsByClient(client1.id)[0]?.id || "",
    date: today,
    time: "10:00",
    type: "consulta",
    status: "confirmada",
    reason: "Revisión anual",
    price: "350",
    duration: "30",
  });

  addAppointment({
    clientId: client2.id,
    petId: getPetsByClient(client2.id)[0]?.id || "",
    date: today,
    time: "14:30",
    type: "vacunacion",
    status: "pendiente",
    reason: "Vacuna anual",
    price: "200",
    duration: "15",
  });

  localStorage.setItem("vetcrm_seeded", "true");
}
