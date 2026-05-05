
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
import { Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const countries = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", 
  "Ecuador", "El Salvador", "España", "Guatemala", "Honduras", "México", 
  "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", 
  "Uruguay", "Venezuela", "Austria", "Alemania", "Suiza", "Otro"
];

const participationStatuses = [
  "Empresas e Inversionistas Europeos",
  "Premiadas",
  "Nominados",
  "Medios",
  "Aliados",
  "Red Profesional"
];

export function FreeRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      comments: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await addFreeRegistrationAction(data);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "¡Registro enviado!",
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
        description: "Ocurrió un error inesperado.",
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
        <h3 className="text-2xl font-bold mb-4">¡Registro Recibido!</h3>
        <p className="text-gray-400 mb-8">
          Tu solicitud está en espera de confirmación. Te notificaremos vía email una vez sea revisada.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
          <p className="text-sm font-medium mb-4">Te invitamos a unirte a nuestro grupo de WhatsApp para avisos importantes:</p>
          <a 
            href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> Unirme al Grupo de WhatsApp
          </a>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)}>Enviar otro registro</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input 
            id="firstName" 
            placeholder="Tu nombre" 
            {...register('firstName', { required: "El nombre es obligatorio" })}
            className="bg-white/5 border-white/10"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input 
            id="lastName" 
            placeholder="Tu apellido" 
            {...register('lastName', { required: "El apellido es obligatorio" })}
            className="bg-white/5 border-white/10"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="tu@email.com" 
          {...register('email', { 
            required: "El email es obligatorio",
            pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
          })}
          className="bg-white/5 border-white/10"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select onValueChange={(val) => setValue('country', val)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="hidden" {...register('country', { required: "El país es obligatorio" })} />
          {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="participationStatus">Estatus de Participación</Label>
          <Select onValueChange={(val) => setValue('participationStatus', val)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Selecciona tu estatus" />
            </SelectTrigger>
            <SelectContent>
              {participationStatuses.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="hidden" {...register('participationStatus', { required: "El estatus es obligatorio" })} />
          {errors.participationStatus && <p className="text-xs text-red-500">{errors.participationStatus.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="websiteOrLinkedin">Web / LinkedIn</Label>
          <Input 
            id="websiteOrLinkedin" 
            placeholder="https://..." 
            {...register('websiteOrLinkedin', { required: "El enlace es obligatorio" })}
            className="bg-white/5 border-white/10"
          />
          {errors.websiteOrLinkedin && <p className="text-xs text-red-500">{errors.websiteOrLinkedin.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input 
            id="whatsapp" 
            placeholder="+1234567890" 
            {...register('whatsapp', { required: "El WhatsApp es obligatorio" })}
            className="bg-white/5 border-white/10"
          />
          {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Preguntas y/o Comentarios</Label>
        <Textarea 
          id="comments" 
          placeholder="Algo que quieras añadir..." 
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
            Enviando...
          </>
        ) : "Enviar Registro Gratuito"}
      </Button>
      
      <p className="text-[10px] text-gray-500 text-center">
        Al enviar este formulario, aceptas que podamos contactarte para informarte sobre el estado de tu registro.
      </p>
    </form>
  );
}
