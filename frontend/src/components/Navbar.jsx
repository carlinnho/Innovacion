import { useState, useEffect, useRef } from "react";
import {
  User,
  ChevronDown,
  UserCircle,
  Package,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  ChevronUp,
  Home,
  Phone,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";
import categoriaService from "../services/categoriaService";
import productoService from "../services/productoService";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategoryMobile, setExpandedCategoryMobile] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  const menuRef = useRef(null);
  const catRef = useRef(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const u = authService.getCurrentUser();
    setUsuario(u);
    cargarCategorias();
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAbierto(false);
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCategories(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      const [categoriasData, subcategoriasData] = await Promise.all([
        categoriaService.obtenerCategorias(),
        categoriaService.obtenerSubcategorias(),
      ]);
      setCategorias(categoriasData);
      setSubcategorias(subcategoriasData);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("Error al cargar categorías");
    } finally {
      setCargandoCategorias(false);
    }
  };

  const obtenerSubcategoriasPorCategoria = (categoriaId) => {
    return subcategorias.filter((sub) => sub.categoriaId === categoriaId);
  };

  const handleCerrarSesion = () => {
    authService.logout();
    setUsuario(null);
    setMenuAbierto(false);
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleNavigate = (path) => {
    setMenuAbierto(false);
    setMobileOpen(false);
    setShowCategories(false);
    navigate(path);
  };

  const handleCategoriaClick = (categoriaNombre) => {
    handleNavigate(
      `/catalogo?categoria=${encodeURIComponent(categoriaNombre)}`
    );
  };

  const handleSubcategoriaClick = (categoriaNombre, subcategoriaNombre) => {
    handleNavigate(
      `/catalogo?categoria=${encodeURIComponent(
        categoriaNombre
      )}&subcategoria=${encodeURIComponent(subcategoriaNombre)}`
    );
  };

  const toggleMobileCategory = (catId) => {
    if (expandedCategoryMobile === catId) {
      setExpandedCategoryMobile(null);
    } else {
      setExpandedCategoryMobile(catId);
    }
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-200 relative z-40">
        <script
          src="//code.tidio.co/mbxpg2jgj7sxno5t5iijfxojgwmjrozs.js"
          async
        ></script>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* ============================================== */}
            {/* 1. CAMBIO: Botón Hamburguesa AHORA A LA IZQUIERDA */}
            {/* ============================================== */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-orange-700 transition"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => handleNavigate("/")}
                className="text-2xl font-extrabold text-orange-600 hover:opacity-90"
              >
                Faraón
              </button>
            </div>

            {/* SearchBar (Centro) */}
            <div className="flex-1 mx-2 sm:mx-6">
              <div className="hidden md:block">
                <SearchBar
                  productoService={productoService}
                  onNavigate={handleNavigate}
                />
              </div>
              <div className="md:hidden">
                <SearchBar
                  productoService={productoService}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>

            {/* Utilities (Derecha: Carrito y Usuario Desktop) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate("/carrito")}
                className="relative p-2 text-gray-700 hover:text-orange-700 transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Menú Usuario SOLO DESKTOP */}
              {usuario ? (
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    onClick={() => setMenuAbierto((s) => !s)}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">
                      {usuario.nombre}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`${
                        menuAbierto ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  </button>

                  {menuAbierto && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-xs text-gray-500">{usuario.email}</p>
                      </div>
                      <button
                        onClick={() => handleNavigate("/miperfil")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50"
                      >
                        <UserCircle size={16} /> <span>Mi Perfil</span>
                      </button>
                      <button
                        onClick={() => handleNavigate("/mispedidos")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50"
                      >
                        <Package size={16} /> <span>Mis Pedidos</span>
                      </button>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleCerrarSesion}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} /> <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={onLoginClick}
                    className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="px-3 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV: Categorías + Links (SOLO DESKTOP) */}
        <div className="border-t border-gray-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                {/* Botón de Categorías Desktop */}
                <div className="relative" ref={catRef}>
                  <button
                    onClick={() => setShowCategories((s) => !s)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
                  >
                    Categorías
                    <ChevronRight
                      size={16}
                      className={`${
                        showCategories ? "rotate-90" : ""
                      } transition-transform`}
                    />
                  </button>

                  {/* Dropdown Categorías Desktop */}
                  {showCategories && (
                    <div className="absolute left-0 mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50 max-h-[500px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-6 px-4">
                        {categorias.map((categoria) => (
                          <div
                            key={categoria.id}
                            className="flex flex-col gap-2"
                          >
                            <button
                              onClick={() =>
                                handleCategoriaClick(categoria.nombre)
                              }
                              className="font-semibold text-gray-800 hover:text-orange-600 text-left"
                            >
                              {categoria.nombre}
                            </button>
                            <ul className="text-sm text-gray-600">
                              {obtenerSubcategoriasPorCategoria(
                                categoria.id
                              ).map((sub) => (
                                <li key={sub.id}>
                                  <button
                                    onClick={() =>
                                      handleSubcategoriaClick(
                                        categoria.nombre,
                                        sub.nombre
                                      )
                                    }
                                    className="hover:text-orange-600 text-left"
                                  >
                                    {sub.nombre}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Links Desktop */}
                <nav className="flex items-center gap-2 text-gray-700 font-medium ml-2">
                  <button
                    onClick={() => handleNavigate("/")}
                    className="px-3 py-2 hover:text-orange-600"
                  >
                    Inicio
                  </button>
                  <button
                    onClick={() => handleNavigate("/catalogo")}
                    className="px-3 py-2 hover:text-orange-600"
                  >
                    Productos
                  </button>
                  <button
                    onClick={() => handleNavigate("/ofertas")}
                    className="px-3 py-2 hover:text-orange-600"
                  >
                    Ofertas
                  </button>
                  <button
                    onClick={() => handleNavigate("/contacto")}
                    className="px-3 py-2 hover:text-orange-600"
                  >
                    Contacto
                  </button>
                  <button
                    onClick={() => handleNavigate("/solicitar-proveedor")}
                    className="px-3 py-2 hover:text-orange-600"
                  >
                    Sé Socio
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. CAMBIO: MOBILE DRAWER CON ANIMACIÓN (SLIDE-IN-LEFT)    */}
      <div
        className={`fixed inset-0 z-50 flex justify-start md:hidden transition-visibility duration-300 ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop (Fondo Oscuro) con Fade In/Out */}
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* El Sidebar con Slide In/Out desde la IZQUIERDA */}
        <div
          className={`relative w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* CABECERA USUARIO */}
          <div className="bg-gray-100 p-4 border-b border-gray-200 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-lg font-bold text-gray-800">
                Hola, {usuario ? usuario.nombre : "Invitado"}
              </p>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {usuario ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
                  {usuario.rol.toUpperCase()}
                </span>
              </div>
            ) : (
              <div className="flex gap-2 mt-1">
                <button
                  onClick={onLoginClick}
                  className="text-sm font-semibold text-orange-600 border-b border-orange-600 pb-0.5"
                >
                  Iniciar sesión
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={onRegisterClick}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                >
                  Regístrate
                </button>
              </div>
            )}
          </div>

          {/* CUERPO DEL MENÚ */}
          <div className="flex-1 py-2">
            {/* Navegación Principal */}
            <div className="border-b border-gray-100 pb-2 mb-2">
              <button
                onClick={() => handleNavigate("/")}
                className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 text-left"
              >
                <Home size={20} className="text-gray-400" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => handleNavigate("/catalogo")}
                className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 text-left"
              >
                <Package size={20} className="text-gray-400" />
                <span>Productos</span>
              </button>
              <button
                onClick={() => handleNavigate("/ofertas")}
                className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 text-left"
              >
                <Tag size={20} className="text-gray-400" />
                <span>Ofertas y Promociones</span>
              </button>
              <button
                onClick={() => handleNavigate("/contacto")}
                className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 text-left"
              >
                <Phone size={20} className="text-gray-400" />
                <span>Centro de ayuda</span>
              </button>
            </div>

            {/* Categorías (Acordeón) */}
            <div className="py-2">
              <p className="px-5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Nuestras Categorías
              </p>

              {cargandoCategorias ? (
                <div className="px-5 py-2 text-sm text-gray-500">
                  Cargando...
                </div>
              ) : (
                categorias.map((categoria) => {
                  const subs = obtenerSubcategoriasPorCategoria(categoria.id);
                  const isOpen = expandedCategoryMobile === categoria.id;

                  return (
                    <div
                      key={categoria.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <div
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleMobileCategory(categoria.id)}
                      >
                        <span
                          className={`font-medium ${
                            isOpen ? "text-orange-600" : "text-gray-800"
                          }`}
                        >
                          {categoria.nombre}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-orange-600" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </div>

                      {/* Submenú Animado */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-gray-50 px-5 py-2 space-y-2 pb-4">
                          <button
                            onClick={() =>
                              handleCategoriaClick(categoria.nombre)
                            }
                            className="block w-full text-left text-sm font-semibold text-gray-800 py-1"
                          >
                            Ver todo en {categoria.nombre}
                          </button>

                          {subs.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleSubcategoriaClick(
                                  categoria.nombre,
                                  sub.nombre
                                )
                              }
                              className="block w-full text-left text-sm text-gray-600 hover:text-orange-600 py-1 pl-2 border-l-2 border-transparent hover:border-orange-300 transition-colors"
                            >
                              {sub.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* FOOTER DEL MENÚ */}
          {usuario && (
            <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-3">
              <button
                onClick={() => handleNavigate("/miperfil")}
                className="flex items-center gap-3 text-sm font-medium text-gray-700 w-full"
              >
                <UserCircle size={18} /> Mi Perfil
              </button>
              <button
                onClick={() => handleNavigate("/mispedidos")}
                className="flex items-center gap-3 text-sm font-medium text-gray-700 w-full"
              >
                <Package size={18} /> Mis Pedidos
              </button>
              <button
                onClick={() => handleNavigate("/solicitar-proveedor")}
                className="flex items-center gap-3 text-sm font-medium text-gray-700 w-full"
              >
                <Package size={18} /> Sé Socio
              </button>
              <button
                onClick={handleCerrarSesion}
                className="flex items-center gap-3 text-sm font-medium text-red-600 w-full pt-2 mt-2 border-t border-gray-200"
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
