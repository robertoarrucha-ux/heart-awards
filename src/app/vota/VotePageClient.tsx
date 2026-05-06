'use client';

import NomineeList from '@/components/nominee-list';

type Category = {
  id: string;
  name: string;
  slug?: string;
};

interface VotePageClientProps {
  categories: Category[];
  edition: string;
}

export default function VotePageClient({ categories, edition }: VotePageClientProps) {
  // NomineeList ya se encarga de:
  // - Suscribirse a Firestore (colección 'nominees')
  // - Filtrar por edition
  // - Ordenar por votos y aplicar filtros
  // Así que aquí solo pasamos los parámetros necesarios.
  const categoryNames = categories.map((c) => c.name ?? (c as any));

  return (
    <NomineeList
      categories={categoryNames}
      yearLabel={edition}
      allowVoting={true}
      edition={edition}
    />
  );
}
