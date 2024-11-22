import React, { useState } from 'react';
import { Mail, Phone, Loader2 } from 'lucide-react';
import InputMask from 'react-input-mask';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MunicipalitySelect } from './MunicipalitySelect';

const subscriptionSchema = z.object({
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(15, 'Número de WhatsApp inválido'),
  municipalities: z.array(z.string()).min(1, 'Selecione pelo menos um município'),
});

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { email, whatsapp, municipalities };
      subscriptionSchema.parse(data);

      await addDoc(collection(db, 'subscriptions'), {
        ...data,
        createdAt: serverTimestamp()
      });

      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
      setWhatsapp('');
      setMunicipalities([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Erro ao realizar inscrição. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Receba atualizações
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Inscreva-se para receber notificações sobre novas portarias por email e WhatsApp.
      </p>

      <div>
        <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <div className="mt-1 relative">
          <InputMask
            mask="(99) 99999-9999"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            id="whatsapp"
            type="tel"
            placeholder="(00) 00000-0000"
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="municipalities" className="block text-sm font-medium text-gray-700">
          Municípios de interesse
        </label>
        <div className="mt-1">
          <MunicipalitySelect
            value={municipalities}
            onChange={setMunicipalities}
            className="min-h-[100px]"
          />
          <p className="mt-1 text-sm text-gray-500">
            Segure Ctrl (Windows) ou Command (Mac) para selecionar múltiplos municípios
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Inscrever-se'
        )}
      </button>
    </form>
  );
}