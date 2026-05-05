
'use client';

import { useState, useEffect } from 'react';
import type { Nominee } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Instagram, Linkedin, Loader2, X as TwitterIcon, Youtube, CheckCircle2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type VoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nominee: Nominee | null;
  onConfirmVote: (nomineeId: string) => void;
  isVoting: boolean;
};

type Socials = 'twitter' | 'instagram' | 'whatsapp' | 'youtube';

const socialLinks: Record<Socials, string> = {
  twitter: 'https://x.com/prolatamglobal',
  instagram: 'https://www.instagram.com/prolatamglobal',
  whatsapp: 'https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn',
  youtube: 'https://www.youtube.com/channel/UCf_DVuoY_x8qJQjZnBvVGKQ?sub_confirmation=1'
};

const initialFollowedState: Record<Socials, boolean> = {
    twitter: false,
    instagram: false,
    whatsapp: false,
    youtube: false,
};

export default function VoteModal({ isOpen, onClose, nominee, onConfirmVote, isVoting }: VoteModalProps) {
  const [followed, setFollowed] = useState<Record<Socials, boolean>>(initialFollowedState);

  useEffect(() => {
    // Reset state only when the modal opens for a new session
    if (isOpen) {
      setFollowed(initialFollowedState);
    }
  }, [isOpen]);

  const allConditionsMet = Object.values(followed).every(Boolean);

  const handleFollowClick = (social: Socials) => {
    window.open(socialLinks[social], '_blank');
    setFollowed(prev => ({ ...prev, [social]: true }));
  };

  const handleConfirmVoteClick = () => {
    if (allConditionsMet && nominee) {
      onConfirmVote(nominee.id);
    }
  }
  
  const handleDialogClose = () => {
    if (isVoting) return;
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        }
    }}>
      <DialogContent className="sm:max-w-md w-[95%] bg-card border-primary/50 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Votar por {nominee?.name}</DialogTitle>
          <DialogDescription>
             Para validar tu voto, síguenos en nuestras redes sociales. Esto nos ayuda a asegurar una votación justa y transparente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Haz clic para visitar y seguirnos en nuestras páginas para habilitar la votación:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                    type="button" 
                    variant={followed.twitter ? 'default' : 'outline'}
                    className={cn("w-full transition-colors", followed.twitter && "bg-green-600 hover:bg-green-700")}
                    onClick={() => handleFollowClick('twitter')}>
                    {followed.twitter ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <TwitterIcon className="h-4 w-4 mr-2" />} 
                    {followed.twitter ? 'Seguido' : 'Seguir en X'}
                </Button>
                <Button 
                    type="button" 
                    variant={followed.instagram ? 'default' : 'outline'} 
                    className={cn("w-full transition-colors", followed.instagram && "bg-green-600 hover:bg-green-700")}
                    onClick={() => handleFollowClick('instagram')}>
                     {followed.instagram ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2" />}
                    {followed.instagram ? 'Seguido' : 'Seguir en Instagram'}
                </Button>
                <Button 
                    type="button" 
                    variant={followed.whatsapp ? 'default' : 'outline'} 
                    className={cn("w-full transition-colors", followed.whatsapp && "bg-green-600 hover:bg-green-700")}
                    onClick={() => handleFollowClick('whatsapp')}>
                    {followed.whatsapp ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                    {followed.whatsapp ? 'Unido' : 'Unirse a WhatsApp'}
                </Button>
                <Button 
                    type="button" 
                    variant={followed.youtube ? 'default' : 'outline'} 
                    className={cn("w-full transition-colors", followed.youtube && "bg-green-600 hover:bg-green-700")}
                    onClick={() => handleFollowClick('youtube')}>
                    {followed.youtube ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Youtube className="h-4 w-4 mr-2" />}
                    {followed.youtube ? 'Suscrito' : 'Suscribirse en YouTube'}
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center pt-2 space-y-1">
              <p>Solo podrás votar 1 vez.</p>
              <p>Al votar, aceptas las <a href="https://es.theglobal.school/politicas/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">políticas de uso, privacidad y participación</a>.</p>
            </div>
             </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isVoting} className="w-full sm:w-auto">Cancelar</Button>
              <Button type="button" onClick={handleConfirmVoteClick} disabled={!allConditionsMet || isVoting} className="w-full sm:w-auto">
                {isVoting && <Loader2 className="animate-spin mr-2" />}
                Confirmar Voto
              </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
