import React, { useState } from "react";
import { Wrench } from "lucide-react";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // formulario sin funcionamiento real: solo mostrar confirmación visual
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4500);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Hero / Info */}
        <section className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Contáctanos</h1>
          <p className="text-gray-600 text-lg">
            ¿Tienes dudas, comentarios o necesitas ayuda con un pedido? Nuestro equipo está listo para asistirte.
            Completa el formulario o utiliza la información de contacto para comunicarte directamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800">Soporte</h3>
              <p className="text-sm text-gray-600 mt-1">soporte@faraon.com</p>
              <p className="text-sm text-gray-500 mt-2">Horario: Lun-Vie 9:00 - 18:00</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800">Ventas</h3>
              <p className="text-sm text-gray-600 mt-1">ventas@faraon.com</p>
              <p className="text-sm text-gray-500 mt-2">Tel: +51 960 142 988</p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-2">¿Prefieres escribir?</h4>
              <p className="text-sm text-gray-600">Usa el formulario y te responderemos lo antes posible.</p>
            </div>
            <div className="w-full h-48 bg-gray-100 overflow-hidden">
              <iframe
                title="Ubicación Faraón"
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2758.88743436715!2d-77.033918049993!3d-12.067171369579789!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2spe!4v1763481287060!5m2!1ses!2spe"
                className="w-full h-full border-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Form */}
        <section>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Envíanos tu consulta</h2>
            <p className="text-sm text-gray-600 mb-4">Rellena el formulario y te responderemos a la brevedad.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Asunto</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Escoge el problema...</option>
                  <option value="consulta">Consulta general</option>
                  <option value="pedido">Problema con pedido</option>
                  <option value="tecnico">Soporte técnico</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Mensaje</label>
                <textarea
                  name="mensaje"
                  rows="6"
                  placeholder="Cuéntanos con detalle tu consulta..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  Enviar consulta
                </button>
                <button
                  type="button"
                  onClick={() => document.querySelector('form')?.reset()}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Limpiar
                </button>
              </div>

              {enviado && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-100">
                  Gracias — tu mensaje quedó registrado (demo).
                </div>
              )}
            </form>

            <p className="mt-6 text-xs text-gray-500">
              Nota: este formulario es solo de demostración y no envía datos a un servidor.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
