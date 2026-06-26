'use client';

import { useState, useEffect } from 'react';
import type { Nominee } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Instagram,
  Linkedin,
  Loader2,
  X as TwitterIcon,
  Youtube,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
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
  youtube: 'https://www.youtube.com/channel/UCf_DVuoY_x8qJQjZnBvVGKQ?sub_confirmation=1',
};

const initialFollowedState: Record<Socials, boolean> = {
  twitter: false,
  instagram: false,
  whatsapp: false,
  youtube: false,
};

export default function VoteModal({
  isOpen,
  onClose,
  nominee,
  onConfirmVote,
  isVoting,
}: VoteModalProps) {
  const [followed, setFollowed] = useState<Record<Socials, boolean>>(initialFollowedState);

  useEffect(() => {
    // Reset state al abrir el modal
    if (isOpen) {
      setFollowed(initialFollowedState);
    }
  }, [isOpen]);

  const allConditionsMet = Object.values(followed).every(Boolean);

  const handleFollowClick = (social: Socials) => {
    if (typeof window !== 'undefined') {
      window.open(socialLinks[social], '_blank', 'noopener,noreferrer');
    }
    setFollowed((prev) => ({ ...prev, [social]: true }));
  };

  const handleConfirmVoteClick = () => {
    if (allConditionsMet && nominee) {
      onConfirmVote(nominee.id);
    }
  };

  const handleDialogClose = () => {
    if (isVoting) return;
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        }
      }}
    >
      <DialogContent className="w-[95%] rounded-lg border-primary/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Confirm your vote for {nominee?.name}
          </DialogTitle>
          <DialogDescription className="space-y-1 text-sm">
            <p>
              You are about to cast your vote for this leader at the Heart-Led Summit & Awards.
            </p>
            <p>
              Before confirming, we invite you to visit our official channels. This helps us
              amplify recognition for heart-led leadership worldwide.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click each button to visit our official pages and enable your vote confirmation:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={followed.twitter ? 'default' : 'outline'}
                className={cn(
                  'w-full transition-colors',
                  followed.twitter && 'bg-emerald-600 hover:bg-emerald-700',
                )}
                onClick={() => handleFollowClick('twitter')}
              >
                {followed.twitter ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <TwitterIcon className="mr-2 h-4 w-4" />
                )}
                {followed.twitter ? 'Visited' : 'Visit X'}
              </Button>

              <Button
                type="button"
                variant={followed.instagram ? 'default' : 'outline'}
                className={cn(
                  'w-full transition-colors',
                  followed.instagram && 'bg-emerald-600 hover:bg-emerald-700',
                )}
                onClick={() => handleFollowClick('instagram')}
              >
                {followed.instagram ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <Instagram className="mr-2 h-4 w-4" />
                )}
                {followed.instagram ? 'Visited' : 'Visit Instagram'}
              </Button>

              <Button
                type="button"
                variant={followed.whatsapp ? 'default' : 'outline'}
                className={cn(
                  'w-full transition-colors',
                  followed.whatsapp && 'bg-emerald-600 hover:bg-emerald-700',
                )}
                onClick={() => handleFollowClick('whatsapp')}
              >
                {followed.whatsapp ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                {followed.whatsapp ? 'Joined' : 'Join WhatsApp'}
              </Button>

              <Button
                type="button"
                variant={followed.youtube ? 'default' : 'outline'}
                className={cn(
                  'w-full transition-colors',
                  followed.youtube && 'bg-emerald-600 hover:bg-emerald-700',
                )}
                onClick={() => handleFollowClick('youtube')}
              >
                {followed.youtube ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <Youtube className="mr-2 h-4 w-4" />
                )}
                {followed.youtube ? 'Visited' : 'Visit YouTube'}
              </Button>
            </div>
          </div>

          <div className="space-y-1 pt-2 text-center text-xs text-muted-foreground">
            <p>Each person may vote only once per edition.</p>
            <p>
              By voting, you accept the{' '}
              <a
                href="https://es.theglobal.school/politicas/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                usage, privacy, and participation policies
              </a>
              .
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            disabled={isVoting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmVoteClick}
            disabled={!allConditionsMet || isVoting}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isVoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVoting ? 'Registering vote...' : 'Confirm my vote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
