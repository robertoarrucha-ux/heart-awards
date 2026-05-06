'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import NomineeList from '@/components/nominee-list';

type Category = {
  id: string;
  name: string;
  slug?: string;
};

interface Nominee {
  id: string;
  name: string;
  category: string;
  photoUrl?: string;
  country?: string;
  organization?: string;
  bio?: string;
  edition?: string;
  votesCount?: number;
  [key: string]: any;
}

interface VotePageClientProps {
  categories: Category[];
  edition: string;
}

export default function VotePageClient({ categories, edition }: VotePageClientProps) {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nomineesRef = collection(db, 'nominees');
    const q = query(
      nomineesRef,
      where('edition', '==', edition),
      orderBy('votesCount', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Nominee[] = snapshot.docs.map((doc) => {
          const raw = doc.data() as DocumentData;
          return {
            id: doc.id,
            ...raw,
            votesCount: raw.votesCount ?? 0,
          };
        });
        setNominees(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading nominees in VotePageClient:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [edition]);

  const nomineesWithPosition = useMemo(() => {
    return nominees.map((n, index) => ({
      ...n,
      position: index + 1,
    }));
  }, [nominees]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando sistema de votación...</p>
      </div>
    );
  }

  if (!nominees.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground text-center max-w-md">
          Aún no hay nominados publicados para la edición {edition}. Vuelve pronto o revisa las ediciones anteriores.
        </p>
      </div>
    );
  }

  return (
    <NomineeList
      categories={[...categories]}
      yearLabel={edition}
      allowVoting={true}
      initialNominees={nomineesWithPosition}
      edition={edition}
    />
  );
}
