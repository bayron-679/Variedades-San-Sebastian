"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Package, Trash2, Pencil } from 'lucide-react'; // <--- Agregamos Pencil
import ProductForm from '@/components/ProductForm'; 

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null); // <--- Nuevo estado

  const fetchProducts = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (data) setProductos(data);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/');
      else { setUser(session.user); fetchProducts(); }
    };
    checkUser();
  }, [router]);

  // Función para abrir el modo edición
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Función para cerrar y limpiar
  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Seguro que quieres borrar este producto?')) {
      await supabase.from('productos').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (!user) return <div className="p-10 text-black">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-blue-600" /> Inventario San Sebastian
        </h1>
        <button onClick={() => { supabase.auth.signOut(); router.push('/'); }} className="text-red-500 text-sm">Cerrar Sesión</button>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mis Productos ({productos.length})</h2>
          <button 
            onClick={() => { setEditingProduct(null); setShowForm(true); }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gray-200 relative group">
                {prod.imagen_url ? (
                  <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Sin foto</div>
                )}
                {/* Botón de Editar flotante sobre la imagen */}
                <button 
                  onClick={() => handleEdit(prod)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                >
                  <Pencil size={16} className="text-blue-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{prod.nombre}</h3>
                <p className="text-gray-500 text-sm h-10 overflow-hidden">{prod.descripcion}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold text-lg">${prod.precio}</span>
                  <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <ProductForm 
            onClose={closeForm} 
            onProductAdded={fetchProducts}
            productToEdit={editingProduct} // <--- Pasamos el producto a editar
          />
        )}
      </main>
    </div>
  );
}