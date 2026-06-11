import './globals.css'

export const metadata = {
  title: "VetCRM",
  description: "Sistema de gestión veterinaria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
