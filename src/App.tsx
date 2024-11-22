import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { OrdinanceTable } from './components/OrdinanceTable';
import { NewsletterForm } from './components/NewsletterForm';
import { MunicipalityForm } from './components/MunicipalityForm';
import { FileText, Building2 } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Portal de Portarias
                </span>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/municipalities"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Municípios
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Bem-vindo ao Portal de Portarias
                    </h2>
                    <AuthForm isLogin={true} />
                    <p className="mt-4 text-center text-sm text-gray-600">
                      Não tem uma conta?{' '}
                      <Link to="/register" className="text-blue-600 hover:text-blue-800">
                        Registre-se
                      </Link>
                    </p>
                  </div>
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Criar nova conta
                    </h2>
                    <AuthForm isLogin={false} />
                    <p className="mt-4 text-center text-sm text-gray-600">
                      Já tem uma conta?{' '}
                      <Link to="/" className="text-blue-600 hover:text-blue-800">
                        Faça login
                      </Link>
                    </p>
                  </div>
                </div>
              }
            />
            <Route
              path="/dashboard"
              element={
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                      Portarias do Ministério da Saúde
                    </h1>
                    <OrdinanceTable />
                  </div>
                  <NewsletterForm />
                </div>
              }
            />
            <Route
              path="/municipalities"
              element={
                <div className="max-w-2xl mx-auto">
                  <MunicipalityForm />
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;