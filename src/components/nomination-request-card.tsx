'use client';

import Image from 'next/image';
import { Facebook, Check, Loader2, Link as LinkIcon, Linkedin, Instagram, X, User, Flag, Mail, Briefcase, Building, BookOpen, Sparkles, MessageSquare, ExternalLink, Shield, CalendarClock, Bot, Edit2, Save } from 'lucide-react';
import type { NominationRequest } from '@/lib/data';
import { heartLedCategories2026 } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from 'react';
import { updateNominationRequestCategoryAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type NominationRequestCardProps = {
  request: NominationRequest;
  onApprove: (request: NominationRequest) => void;
  onReject: (request: NominationRequest, reason?: string) => void;
  onMoveToPending?: (request: NominationRequest) => void;
  isApproving: boolean;
  isRejecting: boolean;
  isMovingToPending?: boolean;
  isRejected?: boolean;
  isApproved?: boolean;
};


export default function NominationRequestCard({
  request,
  onApprove,
  onReject,
  onMoveToPending,
  isApproving,
  isRejecting,
  isMovingToPending = false,
  isRejected = false,
  isApproved = false,
}: NominationRequestCardProps) {
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [tempCategory, setTempCategory] = useState(request.category);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  const isProcessing = isApproving || isRejecting || isMovingToPending || isUpdatingCategory;

  const handleUpdateCategory = async () => {
    if (tempCategory === request.category) {
        setIsEditingCategory(false);
        return;
    }

    setIsUpdatingCategory(true);
    try {
        const result = await updateNominationRequestCategoryAction(request.id, tempCategory);
        if (result.success) {
            toast({
                title: "Éxito",
                description: "Categoría actualizada correctamente.",
            });
            setIsEditingCategory(false);
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
            description: "Ocurrió un error al actualizar la categoría.",
        });
    } finally {
        setIsUpdatingCategory(false);
    }
  };

  const getAvailableCategories = () => {
    return Array.from(heartLedCategories2026);
  };

  // Normalización defensiva para renderizado seguro
  const nomineeName = request.nomineeName || (request as any).name || (request as any).fullName || "Sin nombre";
  const nomineeEmail = request.nomineeEmail || (request as any).email || "Sin email";
  const nomineeType = request.nomineeType || (request as any).type || 'persona';
  const nomineeCountry = request.nomineeCountry || (request as any).country || "No especificado";
  const nomineeBio = request.nomineeBio || (request as any).bio || "Sin biografía disponible";
  const leadershipLesson = request.leadershipLesson || (request as any).lesson || "No especificada";
  const category = request.category || "General";
  const positionAndProject = request.positionAndProject || (request as any).position || (request as any).project || "No especificado";
  const organizationName = request.organizationName || (request as any).organization || (request as any).company || "No especificado";

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "No disponible";
    try {
      // Handles both Firestore server Timestamps (object with seconds) and client Timestamps (object with toDate)
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : (typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp));
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      // Using Intl.DateTimeFormat for locale-specific formatting.
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (e) {
      console.error("Error formatting timestamp", e);
      return "Fecha inválida";
    }
  };


  return (
    <TooltipProvider>
      <Card className={`flex flex-col overflow-hidden shadow-lg bg-card ${isRejected ? 'border-red-500/30' : 'border-primary/20'}`}>
        <CardHeader className="p-4">
            <div className="flex gap-4 items-start mb-2">
                <div className="shrink-0">
                  <Image
                    src={request.profilePhotoUrl || (request as any).imageUrl || 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media'}
                    alt={nomineeName}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-primary/20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                          {nomineeName}
                      </CardTitle>
                      <div className="flex flex-col items-end gap-1">
                          <Badge variant={nomineeType === 'persona' ? 'outline' : 'default'} className="text-[10px] uppercase tracking-wider">
                              {nomineeType === 'persona' ? 'Persona Física' : 'Entidad / Proyecto'}
                          </Badge>
                          {request.edition && (
                              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                  Edición {request.edition}
                              </Badge>
                          )}
                      </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                      {isEditingCategory ? (
                          <div className="flex items-center gap-2 w-full max-w-sm">
                              <Select value={tempCategory} onValueChange={setTempCategory}>
                                  <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Selecciona categoría" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {getAvailableCategories().map(cat => (
                                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-500" 
                                onClick={handleUpdateCategory}
                                disabled={isUpdatingCategory}
                              >
                                  {isUpdatingCategory ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500" 
                                onClick={() => setIsEditingCategory(false)}
                                disabled={isUpdatingCategory}
                              >
                                  <X className="h-4 w-4"/>
                              </Button>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2">
                              <Badge variant="secondary">{category}</Badge>
                              {!isApproved && !isRejected && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-50 hover:opacity-100" 
                                    onClick={() => setIsEditingCategory(true)}
                                >
                                    <Edit2 className="h-3 w-3"/>
                                </Button>
                              )}
                          </div>
                      )}
                      
                      {request.createdAt && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarClock size={14} />
                              <span>{formatTimestamp(request.createdAt)}</span>
                          </div>
                      )}
                  </div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow px-4 pb-4 space-y-4">
           <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Mail size={16}/> {nomineeType === 'persona' ? 'Correo Electrónico' : 'Correo de Contacto'}</h4>
                <p className="text-sm text-foreground">{nomineeEmail}</p>
           </div>
           <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Flag size={16}/> {nomineeType === 'persona' ? 'País de Residencia' : 'País de Operación'}</h4>
                <p className="text-sm text-foreground">{nomineeCountry}</p>
           </div>
           <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Briefcase size={16}/> {nomineeType === 'persona' ? 'Cargo o Puesto' : 'Área de Impacto'}</h4>
                <p className="text-sm text-foreground">{positionAndProject}</p>
           </div>
           <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Building size={16}/> {nomineeType === 'persona' ? 'Empresa / Organización' : 'Institución Matriz'}</h4>
                <p className="text-sm text-foreground">{organizationName}</p>
           </div>
           <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><BookOpen size={16}/> Breve Reseña</h4>
                <CardDescription>{nomineeBio}</CardDescription>
            </div>
             <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Sparkles size={16}/> Lección de Liderazgo</h4>
                <CardDescription>{leadershipLesson}</CardDescription>
            </div>

             <div className="flex flex-wrap gap-1 items-center">
                 <h4 className="text-sm font-semibold text-muted-foreground mr-2">Redes:</h4>
                {request.websiteUrl && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a href={request.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Visitar sitio web del postulante">
                                    <LinkIcon className="w-4 h-4 text-primary/80 hover:text-primary" />
                                </Button>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent><p>Visitar sitio web</p></TooltipContent>
                    </Tooltip>
                )}
                {request.instagramUrl && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <a href={request.instagramUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Visitar Instagram del postulante">
                        <Instagram className="w-4 h-4 text-primary/80 hover:text-primary" />
                        </Button>
                    </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Visitar Instagram</p></TooltipContent>
                </Tooltip>
                )}
                {request.facebookUrl && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <a href={request.facebookUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Visitar Facebook del postulante">
                        <Facebook className="w-4 h-4 text-primary/80 hover:text-primary" />
                        </Button>
                    </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Visitar Facebook</p></TooltipContent>
                </Tooltip>
                )}
                {request.linkedinUrl && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <a href={request.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Visitar LinkedIn del postulante">
                        <Linkedin className="w-4 h-4 text-primary/80 hover:text-primary" />
                        </Button>
                    </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Visitar LinkedIn</p></TooltipContent>
                </Tooltip>
                )}
                {request.youtubeVideoUrl && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <a href={request.youtubeVideoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver video de YouTube del postulante">
                        <Bot className="w-4 h-4 text-primary/80 hover:text-primary" />
                        </Button>
                    </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Ver Video de YouTube</p></TooltipContent>
                </Tooltip>
                )}
            </div>
            {request.relevantLinks && (
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><ExternalLink size={16}/> Enlaces Relevantes</h4>
                    <p className="text-sm text-foreground break-all">{request.relevantLinks}</p>
                </div>
            )}
             {(request.nominatorName || request.nominatorCountry || request.nominatorEmail) && (
                <div className="space-y-1 bg-muted/50 p-2 rounded-md">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><MessageSquare size={16}/> Información del Nominador</h4>
                    {request.nominatorName && <p className="text-sm text-foreground"><span className="font-medium">Nombre:</span> {request.nominatorName}</p>}
                    {request.nominatorCountry && <p className="text-sm text-foreground"><span className="font-medium">País:</span> {request.nominatorCountry}</p>}
                    {request.nominatorEmail && <p className="text-sm text-foreground"><span className="font-medium">Email:</span> {request.nominatorEmail}</p>}
                </div>
            )}
            {request.agreedToTerms && (
                 <div className="flex items-center gap-2 text-sm text-green-400">
                    <Shield size={16}/> Aceptó los términos y políticas.
                 </div>
            )}


        </CardContent>
        {!isRejected && !isApproved && (
          <CardFooter className="bg-card/50 p-2 flex gap-2 justify-end">
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full" disabled={isProcessing}>
                  {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <X className="w-4 h-4 mr-2"/>}
                  {isRejecting ? 'Rechazando...' : 'Rechazar'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Rechazar Nominación</DialogTitle>
                  <DialogDescription>
                    Puedes incluir una nota que se enviará en el correo de notificación al postulado.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea 
                    placeholder="Escribe aquí el motivo o una breve explicación (opcional)..." 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter className="flex sm:justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsRejectDialogOpen(false)} disabled={isRejecting}>
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                        onReject(request, rejectionReason);
                        setIsRejectDialogOpen(false);
                    }}
                    disabled={isRejecting}
                  >
                    Confirmar Rechazo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => onApprove(request)} disabled={isProcessing}>
              {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Check className="w-4 h-4 mr-2"/>}
              {isApproving ? 'Aprobando...' : 'Aprobar'}
            </Button>
          </CardFooter>
        )}
        {(isRejected || isApproved) && onMoveToPending && (
            <CardFooter className="bg-card/50 p-2 flex gap-2 justify-end">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => onMoveToPending(request)} 
                    disabled={isProcessing}
                >
                    {isMovingToPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <CalendarClock className="w-4 h-4 mr-2"/>}
                    {isMovingToPending ? 'Moviendo...' : 'Mover a Pendiente'}
                </Button>
            </CardFooter>
        )}
      </Card>
    </TooltipProvider>
  );
}
