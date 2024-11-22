import React, { useEffect, useState } from 'react';
import { Search, FileText, Download, ArrowUpDown } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Ordinance } from '../lib/firebase';
import { seedOrdinances2024 } from '../data/ordinances2024';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '../lib/utils';

const columnHelper = createColumnHelper<Ordinance>();

const columns = [
  columnHelper.accessor('number', {
    header: 'Número',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting()}
          className={cn(
            'flex items-center gap-1',
            column.getIsSorted() && 'text-blue-600'
          )}
        >
          Data
          <ArrowUpDown className="h-4 w-4" />
        </button>
      );
    },
    cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR'),
  }),
  columnHelper.accessor('summary', {
    header: 'Ementa',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('link', {
    header: 'Ações',
    cell: info => (
      <div className="flex space-x-4">
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          Visualizar
        </a>
        <a
          href={info.getValue()}
          download
          className="text-green-600 hover:text-green-800 flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Baixar
        </a>
      </div>
    ),
  }),
];

export function OrdinanceTable() {
  const [search, setSearch] = useState('');
  const [ordinances, setOrdinances] = useState<Ordinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ]);

  useEffect(() => {
    seedOrdinances2024().catch(console.error);

    const q = query(collection(db, 'ordinances'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordinanceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ordinance[];
      setOrdinances(ordinanceData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar portarias:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrdinances = ordinances.filter((ordinance) =>
    Object.values(ordinance).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const table = useReactTable({
    data: filteredOrdinances,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar portarias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Nenhuma portaria encontrada
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}