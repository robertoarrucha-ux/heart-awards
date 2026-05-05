
'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, ExternalLink, MapPin, Briefcase, GraduationCap, Star, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const winners2024 = [
  {
    category: "Líderes en América Latina",
    winners: [
      {
        name: "Global Force – Swiss Tech Capital",
        location: "México / Suiza",
        description: "Firma de inversión y consultoría tecnológica que facilita la expansión de startups y empresas entre Europa y América Latina.",
      },
      {
        name: "Piscilago",
        location: "Colombia",
        description: "El parque acuático y de conservación más grande de Colombia, reconocido por su compromiso con la biodiversidad y el turismo sostenible.",
      },
      {
        name: "Gummitiles",
        location: "México",
        description: "Empresa innovadora dedicada al reciclaje de neumáticos para la creación de pisos y superficies amortiguantes sustentables.",
      },
      {
        name: "Madera Plástica Mendoza",
        location: "Argentina",
        description: "Emprendimiento de triple impacto que transforma residuos plásticos en postes y tablas para viñedos y construcción.",
      },
      {
        name: "Javier Martinez (Proyecto Atlas)",
        location: "Venezuela",
        description: "Líder de la Asociación Internacional de Startups, impulsando el ecosistema emprendedor venezolano a través del Proyecto Atlas.",
      },
      {
        name: "Eduardo Verano de la Rosa",
        location: "Colombia",
        description: "Gobernador del Atlántico, destacado por su gestión pública enfocada en la descentralización y el desarrollo regional.",
      },
      {
        name: "Fermín Mario Montemayor Santos",
        location: "México",
        description: "Director y Fundador de Plus Investments, experto en gestión de inversiones y desarrollo inmobiliario estratégico.",
      },
      {
        name: "Karin Cristela Rodriguez",
        location: "Argentina",
        description: "CFO de Signo Plast S.A., líder en la industria de manufactura plástica con enfoque en eficiencia financiera y crecimiento.",
      },
      {
        name: "Rui Jorge Batista Machalele",
        location: "México",
        description: "Empresario y conferencista internacional, reconocido por su liderazgo en el desarrollo de negocios globales.",
      },
    ]
  },
  {
    category: "Empresas y Org. Invirtiendo en América Latina",
    winners: [
      {
        name: "Bendicht F. Hügli",
        location: "Suiza / México",
        description: "Inversionista de impacto enfocado en proyectos de sostenibilidad, agua y desarrollo económico en la región latinoamericana.",
      }
    ]
  },
  {
    category: "Diáspora Latinoamericana",
    winners: [
      {
        name: "Fabiola Luque Morales",
        location: "Perú / Francia",
        description: "Fundadora de 'Economía sin Filtro', plataforma dedicada a la educación financiera y análisis económico accesible.",
      },
      {
        name: "Larisa Lara Guerrero",
        location: "México / Suiza",
        description: "Especialista en la OIM, trabajando en el empoderamiento de comunidades transnacionales y comunicaciones digitales.",
      },
      {
        name: "Daniel Pineda",
        location: "Austria",
        description: "Especialista en Compliance en VAMED Engineering, asegurando estándares éticos en proyectos de infraestructura hospitalaria.",
      }
    ]
  },
  {
    category: "Jóvenes Promesas",
    winners: [
      {
        name: "David Brian Méndez Hernández",
        location: "Venezuela",
        description: "Fundador de DavlabC&T, joven innovador dedicado al desarrollo de soluciones tecnológicas y científicas.",
      }
    ]
  },
  {
    category: "Menciones Especiales",
    winners: [
      {
        name: "Rafael Puig",
        location: "Argentina / Austria",
        description: "Fundador de Floating Ground, impulsando la innovación en diseño y tecnología entre ambos continentes.",
      },
      {
        name: "Thor Robledo",
        location: "México",
        description: "Promotor de inversión internacional, facilitando el flujo de capital estratégico hacia proyectos de alto impacto.",
      },
      {
        name: "Cristina Campabadal",
        location: "España",
        description: "Fundadora de CC Global Advisory, experta en asesoría patrimonial y financiera para familias y empresas globales.",
      },
      {
        name: "Dr. Pablo Necoechea",
        location: "México",
        description: "Director Regional de EGADE Business School, líder académico en sostenibilidad corporativa y estrategia de negocios.",
      },
      {
        name: "Eurolat",
        location: "Eurocámara",
        description: "Asamblea Parlamentaria Euro-Latinoamericana, reconocida por fortalecer el diálogo político entre Europa y América Latina.",
      }
    ]
  }
];

export default function Winners2024() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <section id="ganadores-2024" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Hall of Fame</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isEs ? 'Ganadores Edición 2024' : '2024 Edition Winners'}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-light">
            {isEs 
              ? 'Reconocemos a los líderes y organizaciones que marcaron la pauta en la edición anterior de los Latin American Leaders Awards.' 
              : 'We recognize the leaders and organizations that set the standard in the previous edition of the Latin American Leaders Awards.'}
          </p>
        </motion.div>

        <div className="space-y-16">
          {winners2024.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-2xl font-bold mb-8 text-primary/80 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30"></span>
                {section.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.winners.map((winner, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="glass border-white/5 h-full hover:border-primary/20 transition-all group">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {section.category === "Jóvenes Promesas" ? <GraduationCap className="w-5 h-5 text-primary" /> :
                             section.category === "Diáspora Latinoamericana" ? <MapPin className="w-5 h-5 text-primary" /> :
                             section.category === "Menciones Especiales" ? <Star className="w-5 h-5 text-primary" /> :
                             section.category.includes("Invirtiendo") ? <Briefcase className="w-5 h-5 text-primary" /> :
                             <Users className="w-5 h-5 text-primary" />}
                          </div>
                        </div>
                        <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{winner.name}</h4>
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
          ))}
        </div>
      </div>
    </section>
  );
}
