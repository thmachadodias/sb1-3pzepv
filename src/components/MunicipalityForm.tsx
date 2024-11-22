import React, { useState } from 'react';
import { MapPin, Building2, Globe } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const municipalitySchema = z.object({
  ibgeCode: z.string().length(7, 'Código IBGE deve ter 7 dígitos'),
  name: z.string().min(3, 'Nome do município deve ter no mínimo 3 caracteres'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
});

export function MunicipalityForm() {
  const [ibgeCode, setIbgeCode] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { ibgeCode, name, state: state.toUpperCase() };
      municipalitySchema.parse(data);

      await addDoc(collection(db, 'municipalities'), {
        ...data,
        createdAt: serverTimestamp()
      });

      toast.success('Município cadastrado com sucesso!');
      setIbgeCode('');
      setName('');
      setState('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Erro ao cadastrar município. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Cadastrar Município
      </h2>

      <div>
        <label htmlFor="ibge-code" className="block text-sm font-medium text-gray-700">
          Código IBGE
        </label>
        <div className="mt-1 relative">
          <input
            id="ibge-code"
            type="text"
            maxLength={7}
            value={ibgeCode}
            onChange={(e) => setIbgeCode(e.target.value.replace(/\D/g, ''))}
            placeholder="0000000"
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
          Município
        </label>
        <div className="mt-1 relative">
          <input
            id="municipality"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do município"
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          UF
        </label>
        <div className="mt-1 relative">
          <input
            id="state"
            type="text"
            maxLength={2}
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            placeholder="UF"
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        ) : (
          'Cadastrar'
        )}
      </button>
    </form>
  );
}