'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addFreeRegistrationAction } from '@/app/actions';
import { Loader2, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const countries = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", 
  "Ecuador", "El Salvador", "España", "Guatemala", "Honduras", "México", 
  "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", 
  "Uruguay", "Venezuela", "Austria", "Alemania", "Suiza", "Otro"
];

const participationStatuses = [
  { value: "European Companies & Investors", days: "Day 2" },
  { value: "Award Winners",                  days: "Day 3" },
  { value: "Nominees",                       days: "Day 3" },
  { value: "Media",                          days: "Day 3" },
  { value: "Partners",                       days: "Days 1, 2 & 3" },
  { value: "Professional Network",           days: "Day 3" },
];

export function FreeRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [venues, setVenues] = useState<{ madrid: boolean; viena: boolean }>({ madrid: false, viena: true });
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      websiteOrLinkedin: '',
      participationStatus: '',
      whatsapp: '',
      comments: '',
      venues: ''
    }
  });

  const handleVenueChange = (venue: 'madrid' | 'viena') => {
    const updated = { ...venues, [venue]: !venues[venue] };
    setVenues(updated);
    const selected = [];
    if (updated.madrid) selected.push('Madrid (19-21 Nov)');
    if (updated.viena) selected.push('Viena (3-5 Dic)');
    setValue('venues', selected.join(', '));
  };

  const onSubmit = async (data: any) => {
    if (!venues.madrid && !venues.viena) {
      toast({
        variant: "destructive",
        title: "Select a venue",
        description: "Please indicate which venue you wish to attend.",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await addFreeRegistrationAction(data);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Registration submitted!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-green-500/10 border border-green-500/20 rounded-3xl"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">Registration Received!</h3>
        <p className="text-gray-400 mb-8">
          Your request is pending confirmation. We will notify you by email once it has been reviewed.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
          <p className="text-sm font-medium mb-4">We invite you to join our WhatsApp group for important updates:</p>
          <a
            href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> Join the WhatsApp Group
          </a>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)}>Submit another registration</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Your first name"
            {...register('firstName', { required: "First name is required" })}
            className="bg-white/5 border-white/10"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Your last name"
            {...register('lastName', { required: "Last name is required" })}
            className="bg-white/5 border-white/10"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@email.com"
          {...register('email', {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
          })}
          className="bg-white/5 border-white/10"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select onValueChange={(val) => setValue('country', val)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="hidden" {...register('country', { required: "Country is required" })} />
          {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="participationStatus">Participation Status</Label>
          <Select onValueChange={(val) => setValue('participationStatus', val)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              {participationStatuses.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.value} <span className="text-muted-foreground text-xs ml-1">— {s.days}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="hidden" {...register('participationStatus', { required: "Status is required" })} />
          {errors.participationStatus && <p className="text-xs text-red-500">{errors.participationStatus.message}</p>}
        </div>
      </div>

      {/* Venue Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Which venue are you attending? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => handleVenueChange('viena')}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
              venues.viena
                ? 'bg-primary/10 border-primary/40 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              venues.viena ? 'bg-primary border-primary' : 'border-white/30'
            }`}>
              {venues.viena && (
                <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-white">🇦🇹 Vienna, Austria</p>
              <p className="text-xs opacity-70">December 3, 4 & 5, 2026</p>
              <p className="text-xs opacity-50 mt-0.5">Heart-Led Summit & Awards</p>
            </div>
          </button>
        </div>
        <Input type="hidden" {...register('venues')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="websiteOrLinkedin">Website / LinkedIn</Label>
          <Input
            id="websiteOrLinkedin"
            placeholder="https://..."
            {...register('websiteOrLinkedin', { required: "Website or LinkedIn is required" })}
            className="bg-white/5 border-white/10"
          />
          {errors.websiteOrLinkedin && <p className="text-xs text-red-500">{errors.websiteOrLinkedin.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="+1234567890"
            {...register('whatsapp', { required: "WhatsApp is required" })}
            className="bg-white/5 border-white/10"
          />
          {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Questions and/or Comments</Label>
        <Textarea
          id="comments"
          placeholder="Anything you'd like to add..."
          {...register('comments')}
          className="bg-white/5 border-white/10 min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : "Submit Free Registration"}
      </Button>

      <p className="text-[10px] text-gray-500 text-center">
        By submitting this form, you agree that we may contact you to inform you about the status of your registration.
      </p>
    </form>
  );
}
