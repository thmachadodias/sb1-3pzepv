import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Municipality } from '../lib/firebase';

interface MunicipalitySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MunicipalitySelect({ value, onChange, className = '' }: MunicipalitySelectProps) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'municipalities'), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Municipality[];
      setMunicipalities(data);
    });
  }, []);

  return (
    <select
      multiple
      value={value}
      onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {municipalities.map((municipality) => (
        <option key={municipality.id} value={municipality.id}>
          {municipality.name} - {municipality.state}
        </option>
      ))}
    </select>
  );
}