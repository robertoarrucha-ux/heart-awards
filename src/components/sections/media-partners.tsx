'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';
import { getLogoUrl } from '@/lib/assets';

export default function MediaPartners() {
  const { t } = useLanguage();

  const mediaPartners = [
    { name: "El Universal", logo: getLogoUrl("el-universal.webp"), url: "https://www.eluniversal.com.mx/estados/premian-politicas-publicas-estatales" },
    { name: "El Heraldo", logo: getLogoUrl("el-heraldo.webp"), url: "https://heraldodemexico.com.mx/nacional/2022/12/11/yucatan-es-reconocido-con-el-premio-latin-american-leaders-awards-465252.html" },
    { name: "El Tiempo", logo: getLogoUrl("el-tiempo.webp"), url: "https://www.eltiempo.com/vida/mujeres/premio-cafam-a-la-mujer-recibe-reconocimiento-por-su-liderazgo-714929" },
    { name: "Excélsior", logo: getLogoUrl("Excelsior.webp"), url: "https://www.excelsior.com.mx/nacional/reconocen-a-mauricio-vila-con-el-premio-latin-american-leaders-awards/1558040" },
    { name: "Radio Fórmula", logo: getLogoUrl("Radio-Formula.webp"), url: "https://www.radioformula.com.mx/nacional/2022/12/11/reconocen-yucatan-con-el-premio-latin-american-leaders-awards-742946.html" },
    { name: "La Razón", logo: getLogoUrl("La-Razon.webp"), url: "https://www.razon.com.mx/estados/gobierno-yucatan-reconocido-premio-latin-american-leaders-awards-509592" },
    { name: "Universidad Anáhuac", logo: getLogoUrl("Anahuac-Mexico.webp"), url: "https://www.anahuac.mx/mexico/noticias/Arturo-y-Jorge-Arditti-Doctorado-Honoris-Causa-por-The-Global-School-for-Social-Leaders" },
    { name: "Tigres UANL", logo: getLogoUrl("Tigres.webp"), url: "https://www.tigres.com.mx/es/fundacion-tigres-recibe-el-reconocimiento-latin-american-social-leader-award-2022fundacion-tigres-recibe-el-reconocimiento-latin-american-social-leader-award-2022/" },
    { name: "Gobierno de Yucatán", logo: getLogoUrl("Gobierno-de-Yucatan.webp"), url: "https://www.yucatan.gob.mx/docs/transparencia/finanzas_publicas/2018_2024/2024/Trimestre_1/16_IGD_IT_24.pdf" },
    { name: "Diario Sustentable", logo: getLogoUrl("Diario-Sustentable.webp"), url: "https://www.diariosustentable.com/2022/11/gonzalo-munoz-recibe-reconocimiento-de-latin-american-leaders-awards-2022/" },
    { name: "Marketing Insider Review", logo: getLogoUrl("Marketing-Insider-Review.webp"), url: "https://marketinginsiderreview.com/latin-american-leaders-awards-2022/" },
    { name: "Ópera Latinoamérica", logo: getLogoUrl("Opera-Latinoamericana.webp"), url: "https://www.operala.org/alejandra-marti-es-nominada-a-los-latin-american-leaders-awards-2024-otorgados-por-ong-europea/" },
    { name: "Amigos del Viento", logo: getLogoUrl("Amigos-Del-Viento.webp"), url: "https://www.amigosdelviento.org/single-post/premiados-latin-american-leaders-awards-2022" },
    { name: "Tequila Inteligente", logo: getLogoUrl("Tequila-Inteligente.webp"), url: "https://tequilainteligente.com/entrevista-federico-de-arteaga-latin-american-leaders-awards-2022/" },
    { name: "Gente Motivando Gente", logo: getLogoUrl("gente-motivando-gente.webp"), url: "https://mail.gentemotivandogente.com/index.php/en/rse-blog?start=500" },
    { name: "Sambito", logo: getLogoUrl("Sambito.webp"), url: "https://sambito.com.ec/" },
    { name: "ISCAN", logo: getLogoUrl("ISCAN-logo.webp"), url: "https://iscan.org" },
    { name: "Civic Tech Center", logo: getLogoUrl("Civic-Tech-Center-Logo.webp"), url: "https://civictechcenter.org" },
    { name: "Pro-Latam", logo: getLogoUrl("pro-latam logo transparent.webp"), url: "https://pro-latam.org" },
    { name: "The New Global School", logo: getLogoUrl("logo the new global school.webp"), url: "https://theglobal.school" },
    { name: "Eurolat", logo: getLogoUrl("Eurolat Logo.webp"), url: "https://eurolat.org" },
    { name: "Red Global MX", logo: getLogoUrl("Logo-Red-Global-MXSolo-1024x273.webp"), url: "https://redglobalmx.org" },
    { name: "Punto Latino", logo: getLogoUrl("Punto Latino logo.webp"), url: "https://puntolatino.org" },
    { name: "RAUN", logo: getLogoUrl("RAUN logo.webp"), url: "https://raun.org" },
    { name: "Logo SDGs", logo: getLogoUrl("Logo SDGs.webp"), url: "https://sdgs.un.org" },
    { name: "CAGG", logo: getLogoUrl("Logo-CAGG.webp"), url: "https://cagg.org" },
    { name: "Viena City", logo: getLogoUrl("Viena City.webp"), url: "https://wien.gv.at" },
    { name: "Vienna School", logo: getLogoUrl("Vienna School Logo Dark.webp"), url: "https://viennaschool.at" },
    { name: "BOOSTERIIT", logo: getLogoUrl("LOGO-BOOSTERIIT-OFICIAL.webp"), url: "https://boosteriit.com" },
    { name: "Emprende Austria", logo: getLogoUrl("logo-emprende-austria-e1666889487679.webp"), url: "https://emprendeaustria.com" },
    { name: "Global School Institute", logo: getLogoUrl("Logos Global School Institute copy.webp"), url: "https://theglobal.school" },
  ];

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.media_section.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.media_section.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {mediaPartners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center p-4 group"
            >
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-32 h-16 flex items-center justify-center bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                title={`Ver nota en ${partner.name}`}
              >
                <Image
                  src={partner.logo}
                  alt={`Logo de ${partner.name} - Latin American Leaders Awards Media Partner`}
                  fill
                  className="object-contain transition-all grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
