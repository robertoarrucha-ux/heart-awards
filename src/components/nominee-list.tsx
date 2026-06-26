'use client';

import { useState, useEffect, useMemo } from 'react';
import NomineeCard from '@/components/nominee-card';
import { castVoteAction } from '@/app/actions';
import { type Nominee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ShieldCheck } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import VoteModal from '@/components/vote-modal';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface NomineeListProps {
  categories: readonly string[];
  yearLabel: string;
  allowVoting?: boolean;
  initialNominees?: Nominee[];
  edition?: string;
}

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

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  // UX de votación (solo cliente, por edición 2026)
  const [hasVotedThisSession, setHasVotedThisSession] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('heartLedAwards_voted_2026') === 'true';
  });
  const [votedNomineeId, setVotedNomineeId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('heartLedAwards_voted_2026_nominee') || null;
  });

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const nomineesRef = collection(db, 'nominees');
    let q = query(nomineesRef);

    if (edition) {
      // En Firestore edition está guardado como string, ej. "2026"
      q = query(q, where('edition', '==', edition));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNominees = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            votes: typeof data.votes === 'number' ? data.votes : 0,
            name: data.name || '',
            organizationName: data.organizationName || '',
            country: data.country || '',
            category: data.category || '',
            ...data,
          } as Nominee & { organizationName?: string; country?: string };
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
            Array.from(new Set(fetchedNominees.map((n) => n.category))),
          );
        }

        const countries = Array.from(
          new Set(filteredByCategory.map((c) => c.country || '')),
        )
          .filter(Boolean)
          .sort();
        setUniqueCountries(countries);
        setIsLoading(false);
      },
      (error: any) => {
        console.error('Error listening to nominees:', error);
        toast({
          variant: 'destructive',
          title: 'Connection error',
          description: 'Could not load nominees in real time.',
        });
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [categories, edition, toast]);

  const filteredNominees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allNominees.filter((c: any) => {
      const name = (c.name || '').toLowerCase();
      const org = (c.organizationName || '').toLowerCase();
      const category = c.category || '';
      const country = c.country || '';

      const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
      const matchesCountry = countryFilter === 'all' || country === countryFilter;
      const matchesSearch = !q || name.includes(q) || org.includes(q);

      return matchesCategory && matchesCountry && matchesSearch;
    });
  }, [allNominees, categoryFilter, countryFilter, searchQuery]);

  const visibleNominees = useMemo(
    () => filteredNominees.slice(0, visibleCount),
    [filteredNominees, visibleCount],
  );

  const highestVoteCount = useMemo(() => {
    if (allNominees.length === 0) return 1;
    return Math.max(...allNominees.map((c: any) => c.votes || 0));
  }, [allNominees]);

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
    if (!allowVoting || hasVotedThisSession) return;
    setSelectedNominee(nominee);
    setIsVoteModalOpen(true);
  };

  const handleConfirmVote = async (nomineeId: string) => {
    const previousNominees = [...allNominees];
    setAllNominees((prev) =>
      prev.map((n: any) =>
        n.id === nomineeId ? { ...n, votes: (n.votes || 0) + 1 } : n,
      ),
    );

    setIsVoting(nomineeId);
    try {
      const result = await castVoteAction(nomineeId);
      if (result.success) {
        setHasVotedThisSession(true);
        setVotedNomineeId(nomineeId);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('heartLedAwards_voted_2026', 'true');
          window.localStorage.setItem('heartLedAwards_voted_2026_nominee', nomineeId);
        }

        toast({
          title: 'Your vote has been registered!',
          description: 'Thank you for recognizing heart-led leadership in the 2026 edition.',
        });
        setIsVoteModalOpen(false);
      } else {
        if (
          result.message &&
          result.message.toLowerCase().includes('ya ha emitido un voto')
        ) {
          setHasVotedThisSession(true);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('heartLedAwards_voted_2026', 'true');
          }
          toast({
            variant: 'destructive',
            title: 'You already voted',
            description: 'Only one vote per person / IP is allowed in this edition.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'We could not register your vote',
            description: result.message || 'Please try again in a few minutes.',
          });
        }
        setAllNominees(previousNominees);
      }
    } catch (error) {
      console.error('Error in handleConfirmVote:', error);
      setAllNominees(previousNominees);
      toast({
        variant: 'destructive',
        title: 'We could not register your vote',
        description: 'Please try again in a few minutes or check your connection.',
      });
    } finally {
      setIsVoting(null);
    }
  };

  const handleShare = (nomineeId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?nomineeId=${nomineeId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'The direct link to this nominee has been copied so you can share it.',
    });
    router.push(url, { scroll: false });
  };

  const displayedCategories = useMemo(() => categories, [categories]);

  return (
    <div className="space-y-8">
      {/* Mensaje de estado de votación */}
      {allowVoting && (
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs md:text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            {hasVotedThisSession ? (
              <>
                <p className="font-semibold text-white">
                  Your vote for this edition has already been registered.
                </p>
                <p className="text-muted-foreground">
                  To ensure process integrity, only one vote per person / IP is allowed.
                  You can still follow the real-time ranking.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">
                  You can cast one vote in this edition.
                </p>
                <p className="text-muted-foreground">
                  Your vote is securely registered and reflected in the real-time ranking.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="bg-background/50 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {displayedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {filteredNominees.length} nominees found
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="animate-pulse text-muted-foreground">
            Loading nominees for {yearLabel}...
          </p>
        </div>
      ) : filteredNominees.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-20 text-center">
          <p className="mb-4 text-xl text-muted-foreground">
            No nominees found with the selected filters.
          </p>

          {allNominees.length > 0 && (
            <div className="mx-auto mb-6 max-w-md rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200/80">
              <p className="mb-1 font-bold">Heads up!</p>
              <p>
                There are {allNominees.length} nominees in this edition, but none match the
                categories on this page.
              </p>
              <p className="mt-2 text-xs opacity-70">
                Required categories: {categories.slice(0, 3).join(', ')}...
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter('all');
              setCountryFilter('all');
              setSearchQuery('');
            }}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleNominees.map((nominee: any) => (
              <div key={nominee.id} id={`nominee-${nominee.id}`}>
                <NomineeCard
                  nominee={nominee}
                  onVoteClick={
                    allowVoting && !hasVotedThisSession
                      ? () => handleVoteClick(nominee)
                      : undefined
                  }
                  isVoteLoading={isVoting === nominee.id}
                  rank={allNominees.findIndex((c: any) => c.id === nominee.id) + 1}
                  highestVoteCount={highestVoteCount}
                  isUserChoice={votedNomineeId === nominee.id}
                  onShare={() => handleShare(nominee.id)}
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
                className="border-primary/20 px-12 py-6 text-lg hover:bg-primary/10"
              >
                Load more nominees
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
