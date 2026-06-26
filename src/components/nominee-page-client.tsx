
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Facebook, Instagram, Linkedin, MapPin, Briefcase, Building, 
  BookOpen, Sparkles, BarChart, Vote as VoteIcon, Share2, 
  ArrowLeft, Link as LinkIcon, Medal, Loader2, Bot
} from 'lucide-react';
import type { Nominee } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import VoteModal from '@/components/vote-modal';
import { castVoteAction } from '@/app/actions';

type NomineePageClientProps = {
  nominee: Nominee;
  rank: number;
  highestVoteCount: number;
};

export default function NomineePageClient({ nominee, rank, highestVoteCount }: NomineePageClientProps) {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(nominee.votes ?? 0);
  const { toast } = useToast();

  const progressValue = highestVoteCount > 0 ? (currentVotes / highestVoteCount) * 100 : 0;

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "The link to this nominee's profile has been copied to your clipboard.",
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(nominee.youtubeVideoUrl || '');

  const handleConfirmVote = async (nomineeId: string) => {
    setIsVoting(true);
    try {
      const result = await castVoteAction(nomineeId);
      if (result.success) {
        toast({
          title: "Vote Registered!",
          description: result.message,
        });
        setCurrentVotes(prev => prev + 1);
      } else {
        toast({
          variant: "destructive",
          title: "Voting Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while processing your vote.",
      });
    } finally {
      setIsVoting(false);
      setIsVoteModalOpen(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/vota" className="inline-flex items-center text-primary hover:underline mb-8 gap-2 font-medium">
            <ArrowLeft size={20} />
            Back to voting list
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-primary/10"
        >
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-background border-b border-primary/10">
             <div className="absolute -bottom-16 left-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Image
                    src={nominee.imageUrl}
                    alt={nominee.name}
                    width={160}
                    height={160}
                    className="rounded-full border-8 border-card shadow-xl object-cover bg-card"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
             </div>
             <div className="absolute top-4 right-4 flex gap-2">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Badge variant="outline" className="bg-primary text-primary-foreground border-primary text-lg font-bold px-4 py-1">
                      <Medal className="w-5 h-5 mr-2" />#{rank}
                  </Badge>
                </motion.div>
             </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-grow">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{nominee.name}</h1>
                  <Badge variant={nominee.nomineeType === 'persona' ? 'outline' : 'default'} className="mt-2 uppercase tracking-widest text-[10px]">
                    {nominee.nomineeType === 'persona' ? 'Individual' : 'Entity / Project'}
                  </Badge>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 text-muted-foreground"
                >
                  {nominee.positionAndProject && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-primary" />
                      <span className="font-medium text-foreground/90">{nominee.positionAndProject}</span>
                    </div>
                  )}
                  {nominee.organizationName && (
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-primary" />
                      <span>{nominee.organizationName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    <span>{nominee.country}</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-2"
                >
                  <Badge variant="secondary" className="text-sm py-1 px-3">{nominee.category}</Badge>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-3 w-full md:w-auto"
              >
                <Button 
                  onClick={() => setIsVoteModalOpen(true)} 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg"
                  disabled={isVoting}
                >
                  {isVoting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <VoteIcon className="mr-2 h-5 w-5" />}
                  Vote for {nominee.name.split(' ')[0]}
                </Button>
                <Button variant="outline" onClick={handleShare} className="w-full">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Profile
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
              <div className="md:col-span-2 space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-4">
                    <BookOpen size={24} className="text-primary" />
                    Biographical Profile
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                    {nominee.bio}
                  </p>
                </motion.section>

                {nominee.leadershipLesson && (
                  <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="bg-primary/5 p-6 rounded-xl border border-primary/10 italic"
                  >
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-4 not-italic">
                      <Sparkles size={24} className="text-primary" />
                      Leadership Lesson
                    </h2>
                    <p className="text-foreground/90 leading-relaxed text-lg">
                      "{nominee.leadershipLesson}"
                    </p>
                  </motion.section>
                )}

                {youtubeEmbedUrl && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <Bot size={24} className="text-primary" />
                      Presentation Video
                    </h2>
                    <div className="aspect-video rounded-xl overflow-hidden border border-primary/10 shadow-lg">
                      <iframe
                        src={youtubeEmbedUrl}
                        title={`Video — ${nominee.name}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </motion.section>
                )}
              </div>

              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BarChart size={20} className="text-primary" />
                    Voting Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black text-primary">{currentVotes.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground font-medium">Total votes</span>
                    </div>
                    <Progress value={progressValue} className="h-3 [&>div]:bg-primary" />
                    <p className="text-xs text-muted-foreground text-center">
                      This nominee currently holds position #{rank} in the global ranking.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4">Social & Contact</h3>
                  <div className="flex flex-col gap-2">
                    {nominee.instagramUrl && (
                      <a href={nominee.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group">
                        <Instagram className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {nominee.facebookUrl && (
                      <a href={nominee.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group">
                        <Facebook className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}
                    {nominee.linkedinUrl && (
                      <a href={nominee.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group">
                        <Linkedin className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    )}
                    {nominee.websiteUrl && (
                      <a href={nominee.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group">
                        <LinkIcon className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Official Website</span>
                      </a>
                    )}
                    {!nominee.instagramUrl && !nominee.facebookUrl && !nominee.linkedinUrl && !nominee.websiteUrl && (
                      <p className="text-sm text-muted-foreground italic">No social links available.</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <VoteModal 
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onConfirmVote={handleConfirmVote}
        nominee={nominee}
        isVoting={isVoting}
      />
    </TooltipProvider>
  );
}
