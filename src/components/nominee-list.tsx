'use client';

import { useState, useEffect, useMemo } from 'react';
import NomineeCard from '@/components/nominee-card';
import { castVoteAction } from '@/app/actions';
import { type Nominee, viennaCategories2026, madridCategories2026 } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, MapPin, Vote as VoteIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import VoteModal from '@/components/vote-modal';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface NomineeListProps {
  categories: string[];
  yearLabel: string;
  allowVoting?: boolean;
  initialNominees?: Nominee[];
  edition?: string;
}

type LocationFilter = 'all' | 'viena' | 'madrid';

export default function NomineeList({
  categories,
  yearLabel,
  allowVoting = false,
  initialNominees = [],
  edition,
}: NomineeListProps) {
  const [allNominees, setAllNominees] = useState<Nominee[]>(initialNominees);
  const [isLoading, setIsLoading] = useState(initialNominees.length === 0);
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);

  const [visibleCount, setVisibleCount] = useState(12);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const is2026 = edition === '2026';

  useEffect(() => {
    const nomineesRef = collection(db, 'nominees');
    let q = query(nomineesRef);

    if (edition) {
      // En Firestore el campo edition está guardado como string, por ejemplo "2026"
      q = query(q, where('edition', '==', edition));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNominees = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Nominee[];

        // Normalizamos votes a número
        fetchedNominees.forEach((n) => {
          // @ts-ignore
          n.votes = typeof n.votes === 'number' ? n.votes : 0;
        });

        // Ordenar por votos desc en cliente
        fetchedNominees.sort((a, b) => (b.votes || 0) - (a.votes || 0));

        const filteredByCategory =
          categories.length > 0
            ? fetchedNominees.filter((n) => categories.includes(n.category))
            : fetchedNominees;

        setAllNominees(filteredByCategory);

        if (fetchedNominees.length > 0 && filteredByCategory.length === 0) {
          console.warn(
            'Possible category mismatch. Categories expected:',
            categories,
            'Categories found in DB:',
            Array.from(new Set(fetchedNominees.map((n) => n.category)))
          );
        }

        const countries = Array.from(new Set(filteredByCategory.map((c) => c.country))).sort();
        setUniqueCountries(countries);
        setIsLoading(false);
      },
      (error: any) => {
        console.error('Error listening to nominees:', error);
        toast({
          variant: 'destructive',
          title: 'Error de conexión',
          description: 'No se pudieron cargar los nominados en tiempo real.',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categories, edition, toast]);

  const filteredNominees = useMemo(() => {
    return allNominees.filter((c) => {
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesCountry = countryFilter === 'all' || c.country === countryFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.organizationName.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesLocation = true;
      if (is2026 && locationFilter !== 'all') {
        const vienaCats = viennaCategories2026 as unknown as string[];
        const madridCats = madridCategories2026 as unknown as string[];

        if (locationFilter === 'viena') {
          matchesLocation = vienaCats.includes(c.category);
        } else if (locationFilter === 'madrid') {
          matchesLocation = madridCats.includes(c.category);
        }
      }

      return matchesCategory && matchesCountry && matchesSearch && matchesLocation;
    });
  }, [allNominees, categoryFilter, countryFilter, searchQuery, locationFilter, is2026]);

  const visibleNominees = useMemo(
    () => filteredNominees.slice(0, visibleCount),
    [filteredNominees, visibleCount]
  );

  const highestVoteCount = useMemo(() => {
    if (allNominees.length === 0) return 1;
    return Math.max(...allNominees.map((c) => c.votes || 0));
  }, [allNominees]);

  const handleLocationChange = (loc: LocationFilter) => {
    setLocationFilter(loc);
    setCategoryFilter('all');
    setVisibleCount(12);
  };

  useEffect(() => {
    const nomineeId = searchParams.get('nomineeId');
    if (nomineeId && allNominees.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`nominee-${nomineeId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams, allNominees]);

  const handleVoteClick = (nominee: Nominee) => {
    if (!allowVoting) return;
    setSelectedNominee(nominee);
    setIsVoteModalOpen(true);
  };

  const handleConfirmVote = async (nomineeId: string) => {
    const previousNominees = [...allNominees];
    setAllNominees((prev) =>
      prev.map((n) =>
        n.id === nomineeId ? { ...n, votes: (n.votes || 0) + 1 } : n
      )
    );

    setIsVoting(nomineeId);
    try {
      const result = await castVoteAction(nomineeId);
      if (result.success) {
        toast({
          title: '¡Voto registrado!',
          description: result.message,
        });
        setIsVoteModalOpen(false);
      } else {
        setAllNominees(previousNominees);
        toast({
          variant: 'destructive',
          title: 'Error al votar',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error in handleConfirmVote:', error);
      setAllNominees(previousNominees);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsVoting(null);
    }
  };

  const handleShare = (nomineeId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?nomineeId=${nomineeId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Enlace copiado',
      description: 'El enlace directo al nominado ha sido copiado al portapapeles.',
    });
    router.push(url, { scroll: false });
  };

  const displayedCategories = useMemo(() => {
    if (!is2026 || locationFilter === 'all') return categories;
    const vienaCats = viennaCategories2026 as unknown as string[];
    const madridCats = madridCategories2026 as unknown as string[];
    return locationFilter === 'viena' ? vienaCats : madridCats;
  }, [is2026, locationFilter, categories]);

  return (
    <div className="space-y-8">
      {/* Location Tabs (Only for 2026) */}
      {is2026 && (
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
            {[
              { id: 'all', label: 'Todos', icon: VoteIcon },
              { id: 'madrid', label: 'Madrid', icon: MapPin },
              { id: 'viena', label: 'Viena', icon: MapPin },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleLocationChange(loc.id as LocationFilter)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                  locationFilter === loc.id
                    ? 'text-white bg-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <loc.icon
                    className={`w-4 h-4 ${
                      locationFilter === loc.id ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                  {loc.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {locationFilter === 'all' && 'Todos los Líderes Nominados'}
              {locationFilter === 'madrid' &&
                'Edición Madrid: Premios a la Excelencia Empresarial'}
              {locationFilter === 'viena' &&
                'Edición Viena: Premios al Impacto Social'}
            </h3>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-10 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {displayedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los países</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {filteredNominees.length} nominados encontrados
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            Cargando nominados de {yearLabel}...
          </p>
        </div>
      ) : filteredNominees.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border白/10 rounded-2xl bg-white/5">
          <p className="text-xl text-muted-foreground mb-4">
            No se encontraron nominados con los filtros seleccionados.
          </p>

          {allNominees.length > 0 && (
            <div className="mb-6 max-w-md mx-auto p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200/80">
              <p className="font-bold mb-1">¡Atención!</p>
              <p>
                Hay {allNominees.length} nominados en esta edición, pero ninguno coincide con las
                categorías de esta página.
              </p>
              <p className="mt-2 text-xs opacity-70">
                Categorías requeridas: {categories.slice(0, 3).join(', ')}...
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter('all');
              setCountryFilter('all');
              setSearchQuery('');
              setLocationFilter('all');
            }}
            className="mt-2"
          >
            Limpiar todos los filtros
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleNominees.map((nominee) => (
              <div key={nominee.id} id={`nominee-${nominee.id}`}>
                <NomineeCard
                  nominee={nominee}
                  onVoteClick={allowVoting ? () => handleVoteClick(nominee) : undefined}
                  isVoteLoading={isVoting === nominee.id}
                  rank={allNominees.findIndex((c) => c.id === nominee.id) + 1}
                  highestVoteCount={highestVoteCount}
                />
              </div>
            ))}
          </div>

          {visibleCount < filteredNominees.length && (
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-12 py-6 text-lg border-primary/20 hover:bg-primary/10"
              >
                Cargar más nominados
              </Button>
            </div>
          )}
        </div>
      )}

      {allowVoting && (
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          nominee={selectedNominee}
          onConfirmVote={handleConfirmVote}
          isVoting={!!isVoting}
        />
      )}
    </div>
  );
}
