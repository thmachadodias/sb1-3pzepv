import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const ordinances2024 = [
  {
    number: "GM/MS nº 3.025",
    date: "2024-02-29",
    summary: "Estabelece recursos do Bloco de Manutenção das Ações e Serviços Públicos de Saúde a serem incorporados ao limite financeiro de Média e Alta Complexidade - MAC do Estado do Rio Grande do Sul e Municípios.",
    link: "https://www.in.gov.br/web/dou/-/portaria-gm/ms-n-3.025-de-29-de-fevereiro-de-2024-530088345"
  },
  {
    number: "GM/MS nº 3.024",
    date: "2024-02-29",
    summary: "Estabelece recurso do Bloco de Manutenção das Ações e Serviços Públicos de Saúde a ser incorporado ao limite financeiro de Média e Alta Complexidade - MAC do Estado de São Paulo e Municípios.",
    link: "https://www.in.gov.br/web/dou/-/portaria-gm/ms-n-3.024-de-29-de-fevereiro-de-2024-530088327"
  },
  {
    number: "GM/MS nº 3.023",
    date: "2024-02-29",
    summary: "Estabelece recurso do Bloco de Manutenção das Ações e Serviços Públicos de Saúde a ser incorporado ao limite financeiro de Média e Alta Complexidade - MAC do Estado do Rio Grande do Sul e Município.",
    link: "https://www.in.gov.br/web/dou/-/portaria-gm/ms-n-3.023-de-29-de-fevereiro-de-2024-530088300"
  },
  {
    number: "SAES/MS nº 144",
    date: "2024-02-29",
    summary: "Defere a Renovação do Certificado de Entidade Beneficente (CEBAS) da Sociedade Hospitalar Angelina Caron, com sede em Campina Grande do Sul (PR).",
    link: "https://www.in.gov.br/web/dou/-/portaria-saes/ms-n-144-de-29-de-fevereiro-de-2024-530088282"
  },
  {
    number: "GM/MS nº 3.022",
    date: "2024-02-28",
    summary: "Habilita o Estado, Município ou Distrito Federal a receber recursos destinados à aquisição de equipamentos e materiais permanentes para estabelecimentos de saúde.",
    link: "https://www.in.gov.br/web/dou/-/portaria-gm/ms-n-3.022-de-28-de-fevereiro-de-2024-529911476"
  }
];

export async function seedOrdinances2024() {
  try {
    // Check if ordinances already exist
    const q = query(
      collection(db, 'ordinances'),
      where('date', '>=', '2024-01-01'),
      where('date', '<=', '2024-12-31')
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      console.log('Ordinances for 2024 already exist');
      return;
    }

    // Add ordinances
    const promises = ordinances2024.map(ordinance => 
      addDoc(collection(db, 'ordinances'), {
        ...ordinance,
        createdAt: serverTimestamp()
      })
    );

    await Promise.all(promises);
    console.log('Successfully seeded 2024 ordinances');
  } catch (error) {
    console.error('Error seeding ordinances:', error);
    throw error;
  }
}