
'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, MapPin, Globe, Leaf, ShieldCheck, Users, GraduationCap, Building2, HeartPulse, Recycle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const winners2023 = [
  {
    name: "Ivonne Elizabeth Ventura Rosales",
    location: "México / Austria",
    category: "Ciencia y Tecnología",
    description: "Física teórica especializada en materia blanda y computacional. Representante de científicas mexicanas en foros internacionales de ciencia.",
    icon: GraduationCap
  },
  {
    name: "Dra. Alejandra Navarro de Chalupa (ANC Legal)",
    location: "Argentina / Austria",
    category: "Legal y Negocios",
    description: "Directora de ANC Legal, asesora a empresas latinoamericanas en su expansión y radicación legal en Austria y Europa.",
    icon: ShieldCheck
  },
  {
    name: "GreenCloud.io",
    location: "Costa Rica",
    category: "Sostenibilidad",
    description: "Plataforma SaaS para medir y compensar la huella de carbono, impulsando la acción climática en más de 25 países.",
    icon: Leaf
  },
  {
    name: "Boosteriit",
    location: "México",
    category: "Innovación",
    description: "Red tecnológica que conecta startups latinoamericanas con capital, mentores y mercados estratégicos en Europa.",
    icon: Globe
  },
  {
    name: "Ana María Baiardi Quesnel",
    location: "Paraguay",
    category: "Políticas Públicas",
    description: "Ex-ministra de la Mujer y diplomática, líder en políticas de igualdad de género y cooperación regional en América Latina.",
    icon: Users
  },
  {
    name: "ORBITA",
    location: "Bolivia",
    category: "Turismo Sostenible",
    description: "Observatorio que utiliza inteligencia de datos para fortalecer la industria turística sostenible y la economía creativa en Bolivia.",
    icon: Building2
  },
  {
    name: "Center for Advocacy and Global Growth (CAGG)",
    location: "Suiza / Latam",
    category: "Gobernanza",
    description: "Plataforma con sede en Ginebra que promueve agendas de investigación y políticas públicas latinoamericanas en foros europeos.",
    icon: Globe
  },
  {
    name: "Academia de la Gestión Pública",
    location: "Colombia",
    category: "Educación Pública",
    description: "Centro de formación que desarrolla capacidades técnicas en gestores públicos para fortalecer las instituciones en la región.",
    icon: GraduationCap
  },
  {
    name: "Soluciones Ecológicas",
    location: "Paraguay",
    category: "Economía Circular",
    description: "Empresa social que integra a recicladores en un modelo de triple impacto para la gestión sustentable de residuos sólidos.",
    icon: Recycle
  },
  {
    name: "EMPACAR",
    location: "Bolivia",
    category: "Industria Sostenible",
    description: "Líder en fabricación de envases con un sistema avanzado de reciclaje de PET, procesando miles de toneladas para economía circular.",
    icon: Recycle
  },
  {
    name: "CELAPPA",
    location: "Latam",
    category: "Bienestar y Salud",
    description: "Red internacional de psicología positiva aplicada y mindfulness, enfocada en el bienestar basado en evidencia científica.",
    icon: HeartPulse
  },
  {
    name: "Sambito",
    location: "Ecuador",
    category: "Consultoría Ambiental",
    description: "Ecosistema de soluciones ambientales y sostenibilidad, impulsor de iniciativas regionales para la protección del planeta.",
    icon: Leaf
  },
  {
    name: "Premios Verdes",
    location: "Ecuador / Latam",
    category: "Reconocimiento",
    description: "Plataforma que conecta y premia a los 500 mejores proyectos sociales y ambientales de Iberoamérica cada año.",
    icon: Award
  },
  {
    name: "Darío Ibargüengoitia",
    location: "México",
    category: "Edificación Sustentable",
    description: "Experto en consultoría de edificación regenerativa y calidad ambiental, referente en climatización eficiente en México.",
    icon: Building2
  },
  {
    name: "RESAMA",
    location: "Latam",
    category: "Migración Ambiental",
    description: "Red que protege a comunidades desplazadas por el cambio climático a través de investigación e incidencia política regional.",
    icon: Users
  },
  {
    name: "Fruto Bendito",
    location: "Colombia",
    category: "Impacto Social",
    description: "Fundación que protege la primera infancia en situación de vulnerabilidad mediante el programa de cunas y apoyo integral.",
    icon: HeartPulse
  },
  {
    name: "Aquí Nadie se Rinde I.A.P. (ANSeR)",
    location: "México",
    category: "Salud Infantil",
    description: "Organización dedicada al apoyo integral de niños con cáncer y sus familias, facilitando el acceso a tratamientos críticos.",
    icon: HeartPulse
  },
  {
    name: "Earth & Life University",
    location: "México",
    category: "Educación Ambiental",
    description: "Institución académica que lidera foros sobre economía circular y gestión de residuos electrónicos en América Latina.",
    icon: GraduationCap
  },
  {
    name: "Tequila Inteligente",
    location: "México",
    category: "Smart Cities",
    description: "Proyecto pionero de ciudad inteligente que integra transformación digital e infraestructura para el desarrollo económico local.",
    icon: Globe
  }
];

export default function Winners2023() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <section id="ganadores-2023" className="py-24 bg-white/[0.01] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Legacy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isEs ? 'Ganadores Edición 2023' : '2023 Edition Winners'}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-light">
            {isEs 
              ? 'Celebrando a los pioneros que abrieron caminos de colaboración entre América Latina y Europa en nuestra edición 2023.' 
              : 'Celebrating the pioneers who opened paths of collaboration between Latin America and Europe in our 2023 edition.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners2023.map((winner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className="glass border-white/5 h-full hover:border-primary/20 transition-all group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <winner.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50 bg-white/5 px-2 py-1 rounded">
                      {winner.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-tight">{winner.name}</h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {winner.location}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {winner.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
