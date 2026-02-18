"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, X, ZoomIn, Plus, Trash2, MessageCircle, Filter } from 'lucide-react';

export default function Tienda() {
  const [productos, setProductos] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Productos filtrados
  const [categories, setCategories] = useState<string[]>([]); // Lista de categorías
  const [activeCategory, setActiveCategory] = useState('Todos'); // Categoría seleccionada
  
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- CONFIGURACIÓN ---
  const MI_NUMERO_WHATSAPP = "573155323595"; // Tu número

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProductos(data);
        setFilteredProducts(data);
        
        // Extraer categorías únicas
        const uniqueCats = ['Todos', ...new Set(data.map((p: any) => p.categoria || 'General'))];
        // @ts-ignore
        setCategories(uniqueCats);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Función para filtrar por categoría
  const filterByCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'Todos') {
      setFilteredProducts(productos);
    } else {
      setFilteredProducts(productos.filter(p => (p.categoria || 'General') === cat));
    }
  };

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    if (cart.length === 0) setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + item.precio, 0);

  // --- WHATSAPP CON IMÁGENES ---
  const enviarPedido = () => {
    // Creamos el mensaje con detalles y LINKS a las imágenes
    const detalles = cart.map((item, i) => 
      `*${i+1}. ${item.nombre}*\n   Precio: $${item.precio}\n   Foto: ${item.imagen_url || 'Sin foto'}`
    ).join('\n\n');

    const mensaje = `Hola! Quisiera realizar el siguiente pedido:\n\n${detalles}\n\n*TOTAL A PAGAR: $${total}*\n\n¿Quedo atento a la confirmación!`;
    
    // Codificamos para URL
    const url = `https://wa.me/${MI_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          <span className="text-pink-600">Variedades San Sebastián</span>
        </h1>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <ShoppingCart className="text-gray-700" size={28} />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      {/* --- HERO / PORTADA (Recuperado del primer código) --- */}
      <header className="bg-pink-100 py-12 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Regala un momento eterno
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Descubre nuestra exclusiva tienda, donde encontrarás una variedad de productos únicos para cada ocasión.
        </p>
      </header>

      {/* --- FILTRO DE CATEGORÍAS --- */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => filterByCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                ? 'bg-pink-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- REJILLA DE PRODUCTOS --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
              >
                {/* Imagen */}
                <div className="h-64 bg-gray-100 relative cursor-zoom-in" onClick={() => setSelectedImage(prod.imagen_url)}>
                  {prod.imagen_url ? (
                    <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 font-bold bg-gray-200">SA</div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ZoomIn className="text-white" size={32} />
                  </div>
                  {/* Etiqueta de Categoría */}
                  <span className="absolute top-2 left-2 bg-white/90 text-black text-xs px-2 py-1 rounded font-bold shadow">
                    {prod.categoria || 'General'}
                  </span>
                </div>

                {/* Detalles */}
                <div className="p-5 flex flex-col justify-between h-44">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{prod.nombre}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{prod.descripcion}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-pink-600">${prod.precio}</span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors flex items-center gap-2 text-sm shadow-lg active:scale-95"
                    >
                      <Plus size={16} /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-gray-500 text-lg">No hay productos en esta categoría.</p>
        )}
      </main>

      {/* --- CARRITO (SIDEBAR) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-black"><ShoppingCart /> Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="text-gray-500" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">Tu carrito está vacío</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b pb-4">
                    <img src={item.imagen_url} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-bold text-black">{item.nombre}</h4>
                      <p className="text-pink-600 font-bold">${item.precio}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between text-xl font-bold mb-4 text-black">
                  <span>Total:</span>
                  <span className="text-pink-600">${total}</span>
                </div>
                <button 
                  onClick={enviarPedido}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#20ba5a] transition-colors shadow-lg"
                >
                  <MessageCircle size={24} />
                  Enviar Pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ZOOM MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out" onClick={() => setSelectedImage(null)}>
           <div className="relative">
             <button className="absolute -top-10 right-0 text-white" onClick={() => setSelectedImage(null)}><X size={30}/></button>
             <img src={selectedImage} className="max-w-full max-h-[85vh] rounded shadow-2xl" />
           </div>
        </div>
      )}

      

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12 text-center flex flex-col items-center gap-6">
          <p className="font-bold text-white text-xl">Variedades San Sebastián</p>
          <p className="text-sm"> Contactanos:</p>
          
          {/* El botón de WhatsApp ahora es parte del diseño del pie de página */}
          <a 
            href={`https://wa.me/${MI_NUMERO_WHATSAPP}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
            aria-label="Chat en WhatsApp"
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="white" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          <p className="text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}