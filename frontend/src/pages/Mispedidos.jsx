import React, { useState, useEffect } from "react";
import { Package, Calendar, MapPin, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import authService from "../services/authService";
import { Link } from "react-router-dom";

export default function Mispedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para expandir/colapsar detalles
  const [expandedPedido, setExpandedPedido] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/pedidos/mis-pedidos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el historial");
      }

      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetalle = (pedidoId) => {
    setExpandedPedido(expandedPedido === pedidoId ? null : pedidoId);
  };

  const getEstadoColor = (estado) => {
    // Ajusta los strings según si usaste minúsculas o mayúsculas en el Enum
    const estadoStr = String(estado).toLowerCase();
    switch (estadoStr) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "confirmado": return "bg-blue-100 text-blue-800";
      case "enviado": return "bg-purple-100 text-purple-800";
      case "entregado": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-orange-600" size={32} />
          Mis Pedidos
        </h1>

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes pedidos aún</h3>
            <p className="text-gray-500 mb-6">Parece que no has realizado ninguna compra.</p>
            <Link to="/catalogo" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Cabecera del Pedido */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  onClick={() => toggleDetalle(pedido.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">#{pedido.numeroPedido}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(pedido.fechaPedido).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(pedido.fechaPedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-gray-900">S/ {pedido.total.toFixed(2)}</p>
                    </div>
                    {expandedPedido === pedido.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </div>
                </div>

                {/* Detalles Expandibles */}
                {expandedPedido === pedido.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={16} /> Dirección de Entrega
                        </h4>
                        <p className="text-gray-600 text-sm ml-6">{pedido.direccionEntrega}</p>
                        <p className="text-gray-600 text-sm ml-6">Tel: {pedido.telefonoContacto}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Método de Pago</h4>
                        <p className="text-gray-600 text-sm">{pedido.metodoPago}</p>
                      </div>
                    </div>
                    
                    {/* Nota: Para ver los productos aquí, el backend debe devolver la lista de 'detallePedido' dentro del objeto 'pedido'. 
                        Si tienes configurado @JsonManagedReference o fetch EAGER, aparecerán aquí. 
                        Si no, solo mostramos el resumen por ahora. */}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}