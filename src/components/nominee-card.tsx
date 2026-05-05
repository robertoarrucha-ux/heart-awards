
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Bot, Vote, BarChart, Medal, Loader2, Link as LinkIcon, Linkedin, Instagram, MapPin, ChevronDown, ChevronUp, BookOpen, Sparkles, Briefcase, Building, Share2, ExternalLink } from 'lucide-react';
import type { Nominee } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NomineeCardProps = {
  nominee: Nominee;
  rank: number;
  highestVoteCount: number;
  onVoteClick?: (nominee: Nominee) => void;
  isVoteLoading?: boolean;
  priority?: boolean;
};

const rankColorClasses: { [key: number]: string } = {
  1: 'bg-primary text-primary-foreground border-primary',
  2: 'bg-slate-400 text-primary-foreground border-slate-400',
  3: 'bg-yellow-700 text-primary-foreground border-yellow-700',
};

const ExpandableText = ({ text, maxLength = 300 }: { text: string, maxLength?: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) {
        return null;
    }

    const isLongText = text.length > maxLength;
    const displayText = isLongText && !isExpanded ? `${text.substring(0, maxLength)}...` : text;

    return (
        <div>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {displayText}
            </p>
            {isLongText && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary font-semibold text-sm mt-2 flex items-center gap-1 hover:underline">
                    {isExpanded ? 'Leer menos' : 'Leer más'}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            )}
        </div>
    );
};

export default function NomineeCard({
  nominee,
  rank,
  highestVoteCount,
  onVoteClick,
  isVoteLoading,
  priority = false,
}: NomineeCardProps) {
  const { toast } = useToast();
  const rankClass = rankColorClasses[rank] || 'bg-muted text-muted-foreground border-muted';
  const progressValue = highestVoteCount > 0 ? (nominee.votes / highestVoteCount) * 100 : 0;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/nominados/${nominee.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "¡Enlace Copiado!",
      description: "El enlace al perfil de este nominado ha sido copiado a tu portapapeles.",
    });
  };

  return (
    <TooltipProvider>
    <Card id={`nominee-${nominee.id}`} className="flex flex-col overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 ease-in-out shadow-lg hover:shadow-primary/20 border-transparent hover:border-primary/50 bg-card">
      <CardHeader className="flex flex-row items-start gap-4 p-6">
        <Link href={`/nominados/${nominee.id}`} className="shrink-0 group relative">
          <Image
            src={nominee.imageUrl}
            alt={`Retrato de ${nominee.name}, nominado a los Premios Líderes Latinoamericanos`}
            width={100}
            height={100}
            className="rounded-full border-4 border-primary/50 object-cover group-hover:border-primary transition-colors"
            data-ai-hint="portrait person"
            priority={priority}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="text-white w-6 h-6" />
          </div>
        </Link>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1">
                <Link href={`/nominados/${nominee.id}`} className="hover:text-primary transition-colors">
                  <CardTitle className="text-2xl font-bold text-foreground">{nominee.name}</CardTitle>
                </Link>
                <Badge variant={nominee.nomineeType === 'persona' ? 'outline' : 'default'} className="w-fit text-[10px] uppercase tracking-wider h-5">
                    {nominee.nomineeType === 'persona' ? 'Persona Física' : 'Entidad / Proyecto'}
                </Badge>
             </div>
             <Badge variant="outline" className={`text-lg font-bold px-3 py-1 ${rankClass}`}>
                <Medal className="w-5 h-5 mr-2" />#{rank}
            </Badge>
          </div>
          
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            {nominee.positionAndProject && (
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-primary" />
                <span className="font-medium text-foreground/90">{nominee.positionAndProject}</span>
              </div>
            )}
            {nominee.organizationName && (
              <div className="flex items-center gap-2">
                <Building size={14} className="text-primary" />
                <span>{nominee.organizationName}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <Badge variant="secondary">{nominee.category}</Badge>
             <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{nominee.country}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4 space-y-4">
        <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><BookOpen size={16} className="text-primary" /> Reseña</h3>
            <ExpandableText text={nominee.bio} />
        </div>
        
        {nominee.leadershipLesson && (
            <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Lección de Liderazgo</h3>
                <ExpandableText text={nominee.leadershipLesson} />
            </div>
        )}

        <div className="pt-4">
          <div className="flex items-center gap-4">
              <BarChart className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">{nominee.votes.toLocaleString()} Votos</span>
          </div>
          <Progress value={progressValue} className="mt-2 h-2 [&>div]:bg-primary" />
        </div>
      </CardContent>
      <CardFooter className="bg-card/50 p-4 flex flex-col sm:flex-row gap-2 justify-between">
         <div className="flex gap-1">
            {nominee.instagramUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={nominee.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" aria-label="Visitar Instagram del nominado">
                      <Instagram className="w-5 h-5 text-primary hover:text-primary/80" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent><p>Visitar Instagram</p></TooltipContent>
              </Tooltip>
            )}
            {nominee.facebookUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={nominee.facebookUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" aria-label="Visitar Facebook del nominado">
                      <Facebook className="w-5 h-5 text-primary hover:text-primary/80" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent><p>Visitar Facebook</p></TooltipContent>
              </Tooltip>
            )}
            {nominee.linkedinUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={nominee.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" aria-label="Visitar LinkedIn del nominado">
                      <Linkedin className="w-5 h-5 text-primary hover:text-primary/80" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent><p>Visitar LinkedIn</p></TooltipContent>
              </Tooltip>
            )}
             {nominee.websiteUrl && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={nominee.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" aria-label="Visitar sitio web">
                                <LinkIcon className="w-5 h-5 text-primary hover:text-primary/80" />
                            </Button>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Visitar sitio web</p></TooltipContent>
                </Tooltip>
             )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Compartir perfil del nominado">
                  <Share2 className="w-5 h-5 text-primary hover:text-primary/80" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Compartir Perfil</p></TooltipContent>
            </Tooltip>
        </div>
        {onVoteClick && (
            <Button onClick={() => onVoteClick(nominee)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-lg transition-shadow" disabled={isVoteLoading}>
                {isVoteLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                ) : (
                    <Vote className="w-5 h-5 mr-2"/>
                )}
                {isVoteLoading ? 'Votando...' : 'Votar Ahora'}
            </Button>
        )}
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
}
