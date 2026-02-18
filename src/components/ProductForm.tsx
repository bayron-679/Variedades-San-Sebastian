"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, X } from 'lucide-react';

export default function ProductForm({ onClose, onProductAdded, productToEdit }: any) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('General'); // <--- Nuevo campo
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setNombre(productToEdit.nombre);
      setPrecio(productToEdit.precio);
      setDescripcion(productToEdit.descripcion || '');
      setCategoria(productToEdit.categoria || 'General'); // Cargar categoría existente
      setPreview(productToEdit.imagen_url);
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = productToEdit?.imagen_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('fotos-productos')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = await supabase.storage
          .from('fotos-productos')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }

      const productData = {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        categoria: categoria.trim(), // Guardamos la categoría
        imagen_url: imageUrl,
      };

      if (productToEdit) {
        const { error } = await supabase.from('productos').update(productData).eq('id', productToEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('productos').insert([productData]);
        if (error) throw error;
      }

      onProductAdded();
      onClose();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 relative">
            <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
              }} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Vista previa" className="mx-auto h-32 object-cover rounded" />
            ) : (
              <div className="text-gray-500"><Upload className="mx-auto mb-2" /><p className="text-sm">Subir foto</p></div>
            )}
          </div>

          <input type="text" placeholder="Nombre" className="w-full border p-2 rounded text-black" value={nombre} onChange={e => setNombre(e.target.value)} required />
          
          <div className="flex gap-2">
            <input type="number" placeholder="Precio" className="w-full border p-2 rounded text-black" value={precio} onChange={e => setPrecio(e.target.value)} required />
            {/* Input de Categoría */}
            <input type="text" placeholder="Categoría (ej: Rosas)" className="w-full border p-2 rounded text-black" value={categoria} onChange={e => setCategoria(e.target.value)} list="categorias-sugeridas"/>
            <datalist id="categorias-sugeridas">
              <option value="Rosas" />
              <option value="Ramos" />
              <option value="Cajas" />
            </datalist>
          </div>

          <textarea placeholder="Descripción" rows={3} className="w-full border p-2 rounded text-black" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}