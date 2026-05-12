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

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_PHOTO_SIZE_LABEL = '2MB';
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const formSchema = z.object({
nomineeType: z.enum(['persona', 'entidad'], { required_error: "Debes seleccionar el tipo de nominado." }),
nomineeName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
category: z.enum(categories, { required_error: "Debes seleccionar una categoría." }),
nomineeEmail: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
nomineeCountry: z.string({required_error: "Debes seleccionar un país."}),
positionAndProject: z.string().min(2, "Este campo debe tener al menos 2 caracteres."),
organizationName: z.string().min(2, "Este campo debe tener al menos 2 caracteres."),
nomineeBio: z.string().min(20, "La reseña debe tener al menos 20 caracteres."),
leadershipLesson: z.string().min(20, "La lección de liderazgo debe tener al menos 20 caracteres."),
profilePhoto: z
.custom<FileList>()
.refine((files) => files === undefined || files.length === 0 || files.length === 1, 'Puedes subir un solo archivo.')
.refine((files) => files === undefined || files.length === 0 || files?.[0]?.size <= MAX_PHOTO_SIZE, `La imagen no debe superar ${MAX_PHOTO_SIZE_LABEL}. Por favor selecciona una imagen más pequeña.`)
.refine(
(files) => files === undefined || files.length === 0 || ACCEPTED_PHOTO_TYPES.includes(files?.[0]?.type),
'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.'
).optional(),
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
}

async function onSubmit(values: z.infer<typeof formSchema>) {
setIsSubmitting(true);

try {
let photoDataUri = `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media`;
if (values.profilePhoto && values.profilePhoto.length > 0) {
let photoFile = values.profilePhoto[0];

// Image Optimization: Compress and resize before converting to Data URI
try {
const options = {
maxSizeMB: 0.2, // Aim for 200KB
maxWidthOrHeight: 800, // Max 800px width/height
useWebWorker: true,
fileType: 'image/webp' as string, // Convert to webp for better compression
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
<p>Puedes unirte a nuestro grupo de WhatsApp para seguir todas las noticias.
<a href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn" target="_blank" rel="noopener noreferrer" className="underline font-bold text-primary">
Click aqui
</a>
</p>
</div>
),
duration: 10000,
});
form.reset();
} else {
toast({
variant: "destructive",
title: "Error al Enviar",
description: (
<div className="space-y-2">
<p>{result.message}</p>
<p className="text-sm font-medium">
Si tienes problemas nominándote, hazlo vía Whatsapp en este enlace,{" "}
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
Si tienes problemas nominándote, hazlo vía Whatsapp en este enlace,{" "}
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
<SelectTrigger>
<SelectValue placeholder="Selecciona el tipo" />
</SelectTrigger>
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
<SelectTrigger>
<SelectValue placeholder="Selecciona una categoría" />
</SelectTrigger>
</FormControl>
<SelectContent>
<SelectGroup>
<SelectLabel className="text-primary">Viena: Liderazgo social e innovación pública</SelectLabel>
{viennaCategories2026.map((category) => (
<SelectItem key={category} value={category}>
{category}
</SelectItem>
))}
</SelectGroup>
<SelectGroup>
<SelectLabel className="text-primary">Madrid: Negocios, inversión y desarrollo económico</SelectLabel>
{madridCategories2026.map((category) => (
<SelectItem key={category} value={category}>
{category}
</SelectItem>
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
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="nomineeCountry"
render={({ field }) => (
<FormItem>
<FormLabel>5. País de Residencia / Operación</FormLabel>
<Select onValueChange={field.onChange} defaultValue={field.value}>
<FormControl>
<SelectTrigger>
<SelectValue placeholder="Selecciona un país" />
</SelectTrigger>
</FormControl>
<SelectContent>
{countries.map((country) => (
<SelectItem key={country} value={country}>
{country}
</SelectItem>
))}
</SelectContent>
</Select>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="positionAndProject"
render={({ field }) => (
<FormItem>
<FormLabel>6. {nomineeType === 'persona' ? 'Cargo o Puesto' : 'Área de Impacto / Proyecto'}</FormLabel>
<FormControl>
<Input placeholder={nomineeType === 'persona' ? 'Ej. CEO, Director, Fundador' : 'Ej. Sostenibilidad, Innovación'} {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="organizationName"
render={({ field }) => (
<FormItem>
<FormLabel>7. {nomineeType === 'persona' ? 'Empresa u Organización' : 'Institución u Organización Matriz'}</FormLabel>
<FormControl>
<Input placeholder="Ej. Innovate Inc." {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="nomineeBio"
render={({ field }) => (
<FormItem className="md:col-span-2">
<FormLabel>8. Breve Reseña {nomineeType === 'persona' ? 'del Nominado' : 'de la Entidad'}</FormLabel>
<FormDescription>¿Quién {nomineeType === 'persona' ? 'eres' : 'es'}? ¿Qué {nomineeType === 'persona' ? 'haces' : 'hace'}? ¿Por qué lo {nomineeType === 'persona' ? 'haces' : 'hace'}? ¿Hacia dónde {nomineeType === 'persona' ? 'vas' : 'va'}?</FormDescription>
<FormControl>
<Textarea placeholder="Describe la trayectoria y logros..." {...field} rows={4} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="leadershipLesson"
render={({ field }) => (
<FormItem className="md:col-span-2">
<FormLabel>9. ¿Cuál es la lección de liderazgo más importante que {nomineeType === 'persona' ? 'puedes' : 'pueden'} compartir?</FormLabel>
<FormDescription>Basado en {nomineeType === 'persona' ? 'tu' : 'su'} vida, proyectos, negocios, etc.</FormDescription>
<FormControl>
<Textarea placeholder="Comparte la lección de liderazgo..." {...field} rows={4} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="profilePhoto"
render={() => (
<FormItem className="md:col-span-2">
<FormLabel>10. Foto de Perfil / Logo (Opcional)</FormLabel>
<FormControl>
<div className="relative">
<Input type="file" accept="image/*" {...photoRef} className="pl-10" />
<Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
</div>
</FormControl>
<FormDescription>
Sube una foto o logo. Máximo 1MB. Se optimizará automáticamente para la web.
</FormDescription>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="websiteUrl"
render={({ field }) => (
<FormItem>
<FormLabel>11. Sitio Web</FormLabel>
<FormControl>
<Input placeholder="https://ejemplo.com" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="instagramUrl"
render={({ field }) => (
<FormItem>
<FormLabel>12. Instagram</FormLabel>
<FormControl>
<Input placeholder="https://instagram.com/usuario" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="linkedinUrl"
render={({ field }) => (
<FormItem>
<FormLabel>13. LinkedIn</FormLabel>
<FormControl>
<Input placeholder="https://linkedin.com/in/usuario" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="facebookUrl"
render={({ field }) => (
<FormItem>
<FormLabel>14. Facebook</FormLabel>
<FormControl>
<Input placeholder="https://facebook.com/usuario" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="youtubeVideoUrl"
render={({ field }) => (
<FormItem className="md:col-span-2">
<FormLabel>15. Video de YouTube (Opcional)</FormLabel>
<FormDescription>Pega el enlace de un video de YouTube que quieras mostrar en tu perfil.</FormDescription>
<FormControl>
<Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="relevantLinks"
render={({ field }) => (
<FormItem className="md:col-span-2">
<FormLabel>16. Enlaces de interés</FormLabel>
<FormControl>
<Textarea placeholder="Pega aquí enlaces a noticias, artículos, etc." {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<div className="md:col-span-2 mt-4 pt-4 border-t border-primary/10">
<h3 className="text-lg font-bold text-primary">Información de quien Nomina</h3>
<p className="text-sm text-muted-foreground">Esta sección es para quienes nominan a un tercero. Si te auto-nominas, puedes ignorar estos campos.</p>
</div>

<FormField
control={form.control}
name="nominatorName"
render={({ field }) => (
<FormItem>
<FormLabel>17. Tu Nombre</FormLabel>
<FormControl>
<Input placeholder="Tu Nombre Completo" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="nominatorCountry"
render={({ field }) => (
<FormItem>
<FormLabel>18. Tu País</FormLabel>
<Select onValueChange={field.onChange} defaultValue={field.value}>
<FormControl>
<SelectTrigger>
<SelectValue placeholder="Selecciona tu país" />
</SelectTrigger>
</FormControl>
<SelectContent>
{countries.map((country) => (
<SelectItem key={country} value={country}>
{country}
</SelectItem>
))}
</SelectContent>
</Select>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="nominatorEmail"
render={({ field }) => (
<FormItem className="md:col-span-2">
<FormLabel>19. Tu Correo Electrónico</FormLabel>
<FormDescription>Para contactarte sobre esta nominación.</FormDescription>
<FormControl>
<Input type="email" placeholder="tu@email.com" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="agreedToTerms"
render={({ field }) => (
<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
<FormControl>
<Checkbox
checked={field.value}
onCheckedChange={field.onChange}
/>
</FormControl>
<div className="space-y-1 leading-none">
<FormLabel>
Estoy de acuerdo con las <a href="https://awards.pro-latam.org/terminos-convocatoria" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">políticas y términos</a>.
</FormLabel>
<FormMessage />
</div>
</FormItem>
)}
/>

<Button type="submit" className="w-full md:col-span-2" disabled={isSubmitting}>
{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
{isSubmitting ? 'Enviando Nominación...' : 'Enviar Nominación'}
</Button>
</form>
</Form>
</CardContent>
</Card>
);
}
