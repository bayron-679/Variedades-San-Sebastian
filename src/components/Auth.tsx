"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Solo intentamos Iniciar Sesión (SignIn)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error: Credenciales incorrectas o acceso denegado.');
    } else {
      router.push('/dashboard'); // Redirigir al inventario
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-pink-600" size={30} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Acceso Administrativo</h2>
        <p className="text-gray-500 text-sm mt-2">Solo personal autorizado</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors flex justify-center items-center shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Entrar al Inventario'}
        </button>
      </form>
    </div>
  );
}