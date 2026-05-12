'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, viennaCategories2026, madridCategories2026 } from '@/lib/data';
import { countries } from '@/lib/countries';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Upload } from 'lucide-react';
import { useState } from 'react';
import { addNominationRequestAction } from '@/app/actions';
import imageCompression from 'browser-image-compression';

// Límite de 2MB para la imagen original antes de comprimir
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_PHOTO_SIZE_LABEL = '2MB';
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  nomineeType: z.enum(['persona', 'entidad'], { required_error: "Debes seleccionar el tipo de nominado." }),
  nomineeName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  category: z.enum(categories, { required_error: "Debes seleccionar una categoría." }),
  nomineeEmail: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
  nomineeCountry: z.string({ required_error: "Debes seleccionar un país." }),
  positionAndProject: z.string().min(2, "Este campo debe tener al menos 2 caracteres."),
  organizationName: z.string().min(2, "Este campo debe tener al menos 2 caracteres."),
  nomineeBio: z.string().min(20, "La reseña debe tener al menos 20 caracteres."),
  leadershipLesson: z.string().min(20, "La lección de liderazgo debe tener al menos 20 caracteres."),
  profilePhoto: z
    .custom<FileList>()
    .refine(
      (files) => files === undefined || files.length === 0 || files.length === 1,
      'Puedes subir un solo archivo.'
    )
    .refine(
      (files) => files === undefined || files.length === 0 || files?.[0]?.size <= MAX_PHOTO_SIZE,
      `La imagen no debe superar ${MAX_PHOTO_SIZE_LABEL}. Por favor selecciona una imagen más pequeña.`
    )
    .refine(
      (files) => files === undefined || files.length === 0 || ACCEPTED_PHOTO_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.'
    )
    .optional(),
  websiteUrl: z.string().url("Por favor, introduce una URL válida.").optional().or(z.literal('')),
  instagramUrl: z.string().url("Por favor, introduce una URL de Instagram válida.").optional().or(z.literal('')),
  linkedinUrl: z.string().url("Por favor, introduce una URL de LinkedIn válida.").optional().or(z.literal('')),
  facebookUrl: z.string().url("Por favor, introduce una URL de Facebook válida.").optional().or(z.literal('')),
  youtubeVideoUrl: z.string().url("Por favor, introduce una URL de YouTube válida.").optional().or(z.literal('')),
  relevantLinks: z.string().optional(),
  nominatorName: z.string().optional(),
  nominatorCountry: z.string().optional(),
  nominatorEmail: z.string().email("Por favor, introduce una dirección de correo electrónico válida.").optional().or(z.literal('')),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar las políticas y términos para continuar.",
  }),
});

export default function NominationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoSizeError, setPhotoSizeError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomineeType: "persona",
      nomineeName: "",
      nomineeEmail: "",
      positionAndProject: "",
      organizationName: "",
      nomineeBio: "",
      leadershipLesson: "",
      websiteUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      facebookUrl: "",
      youtubeVideoUrl: "",
      relevantLinks: "",
      nominatorName: "",
      nominatorCountry: "",
      nominatorEmail: "",
      agreedToTerms: false,
    },
  });

  const nomineeType = form.watch("nomineeType");
  const photoRef = form.register("profilePhoto");

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Validación inmediata al seleccionar archivo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoSizeError(null);

    if (file) {
      if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
        setPhotoSizeError('Solo se aceptan formatos .jpg, .jpeg, .png y .webp.');
        e.target.value = '';
        form.setValue('profilePhoto', undefined);
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setPhotoSizeError(
          `La imagen seleccionada pesa ${sizeMB}MB y supera el límite de ${MAX_PHOTO_SIZE_LABEL}. Por favor selecciona una imagen más pequeña o comprímela antes de subirla.`
        );
        e.target.value = '';
        form.setValue('profilePhoto', undefined);
        return;
      }
    }

    photoRef.onChange(e);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (photoSizeError) {
      toast({
        variant: "destructive",
        title: "Error en la imagen",
        description: photoSizeError,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoDataUri = `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media`;

      if (values.profilePhoto && values.profilePhoto.length > 0) {
        const photoFile = values.profilePhoto[0];

        try {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/webp' as string,
          };
          const compressedFile = await imageCompression(photoFile, options);
          photoDataUri = await fileToDataUri(compressedFile);
        } catch (compressionError) {
          console.error("Error compressing image, falling back to original:", compressionError);
          photoDataUri = await fileToDataUri(photoFile);
        }
      }

      const requestData = {
        ...values,
        profilePhotoUrl: photoDataUri,
        edition: '2026',
      };
      // @ts-ignore
      delete requestData.profilePhoto;

      const result = await addNominationRequestAction(requestData);

      if (result.success) {
        toast({
          title: "¡Nominación Recibida!",
          description: (
            <div>
              <p>Gracias por tu nominación, la hemos recibido exitosamente.</p>
              <p>
                Puedes unirte a nuestro grupo de WhatsApp para seguir todas las noticias.{' '}
                <a
                  href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-primary"
                >
                  Click aqui
                </a>
              </p>
            </div>
          ),
          duration: 10000,
        });
        form.reset();
        setPhotoSizeError(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error al Enviar",
          description: (
            <div className="space-y-2">
              <p>{result.message}</p>
              <p className="text-sm font-medium">
                Si tienes problemas nominándote, hazlo vía Whatsapp en este enlace,{' '}
                <a
                  href="https://api.whatsapp.com/send/?phone=4367761735010&text&type=%20Quiero%20Nominarme%20a%20los%20LatamAwards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-white hover:text-white/80"
                >
                  click aqui
                </a>
              </p>
            </div>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      console.error("Error submitting nomination form:", error);
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: (
          <div className="space-y-2">
            <p>Ocurrió un error inesperado al procesar tu solicitud.</p>
            <p className="text-sm font-medium">
              Si tienes problemas nominándote, hazlo vía Whatsapp en este enlace,{' '}
              <a
                href="https://api.whatsapp.com/send/?phone=4367761735010&text&type=%20Quiero%20Nominarme%20a%20los%20LatamAwards"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-white hover:text-white/80"
              >
                click aqui
              </a>
            </p>
          </div>
        ),
        duration: 10000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Formulario de Nominación</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <FormField
              control={form.control}
              name="nomineeType"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>1. Tipo de Nominado</FormLabel>
                  <FormDescription>¿A quién estás nominando?</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="persona">Persona Física (Líder, Emprendedor, etc.)</SelectItem>
                      <SelectItem value="entidad">Empresa, Organización o Proyecto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomineeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. {nomineeType === 'persona' ? 'Nombre Completo' : 'Nombre de la Entidad / Proyecto'}</FormLabel>
                  <FormDescription>
                    {nomineeType === 'persona' ? 'Nombre y apellido del líder.' : 'Nombre oficial de la empresa, ONG o proyecto.'}
                  </FormDescription>
                  <FormControl>
                    <Input placeholder={nomineeType === 'persona' ? 'Ej. Alex Doe' : 'Ej. Innovate Foundation'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3. Categoría</FormLabel>
                  <FormDescription>Elige la sede y categoría que mejor se ajuste al perfil.</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-primary">Viena: Liderazgo social e innovación pública</SelectLabel>
                        {viennaCategories2026.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-primary">Madrid: Negocios, inversión y desarrollo económico</SelectLabel>
                        {madridCategories2026.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomineeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4. Correo Electrónico {nomineeType === 'persona' ? 'del Nominado' : 'de Contacto'}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@email.com" {...field} />
