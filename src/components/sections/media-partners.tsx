
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';
import { getAssetUrl } from '@/lib/assets';

export default function MediaPartners() {
  const { t } = useLanguage();

  const mediaPartners = [
    { name: "El Universal", logo: getAssetUrl("el-universal.svg"), url: "https://www.eluniversal.com.mx/estados/premian-politicas-publicas-estatales" },
    { name: "El Tiempo", logo: getAssetUrl("el-tiempo.png"), url: "https://www.eltiempo.com/vida/mujeres/premio-cafam-a-la-mujer-recibe-reconocimiento-por-su-liderazgo-714929" },
    { name: "Excélsior", logo: getAssetUrl("Excelsior.webp"), url: "https://www.excelsior.com.mx/nacional/reconocen-a-mauricio-vila-con-el-premio-latin-american-leaders-awards/1558040" },
    { name: "El Heraldo", logo: getAssetUrl("el-heraldo.svg"), url: "https://heraldodemexico.com.mx/nacional/2022/12/11/yucatan-es-reconocido-con-el-premio-latin-american-leaders-awards-465252.html" },
    { name: "Radio Fórmula", logo: getAssetUrl("Radio-Formula.webp"), url: "https://www.radioformula.com.mx/nacional/2022/12/11/reconocen-yucatan-con-el-premio-latin-american-leaders-awards-742946.html" },
    { name: "La Razón", logo: getAssetUrl("La-Razon.webp"), url: "https://www.razon.com.mx/estados/gobierno-yucatan-reconocido-premio-latin-american-leaders-awards-509592" },
    { name: "Universidad Anáhuac", logo: getAssetUrl("Anahuac-Mexico.webp"), url: "https://www.anahuac.mx/mexico/noticias/Arturo-y-Jorge-Arditti-Doctorado-Honoris-Causa-por-The-Global-School-for-Social-Leaders" },
    { name: "Tigres UANL", logo: getAssetUrl("Tigres.webp"), url: "https://www.tigres.com.mx/es/fundacion-tigres-recibe-el-reconocimiento-latin-american-social-leader-award-2022fundacion-tigres-recibe-el-reconocimiento-latin-american-social-leader-award-2022/" },
    { name: "Gobierno de Yucatán", logo: getAssetUrl("Gobierno-de-Yucatan.png"), url: "https://www.yucatan.gob.mx/docs/transparencia/finanzas_publicas/2018_2024/2024/Trimestre_1/16_IGD_IT_24.pdf" },
    { name: "Ámbito Jurídico", logo: getAssetUrl("Ambito-Juridico.svg"), url: "https://www.ambitojuridico.com/noticias/sociales/educacion-y-cultura/academia-de-la-gestion-publica-logra-reconocimiento" },
    { name: "Diario Sustentable", logo: getAssetUrl("Diario-Sustentable.jpg"), url: "https://www.diariosustentable.com/2022/11/gonzalo-munoz-recibe-reconocimiento-de-latin-american-leaders-awards-2022/" },
    { name: "Marketing Insider Review", logo: getAssetUrl("Marketing-Insider-Review.png"), url: "https://marketinginsiderreview.com/latin-american-leaders-awards-2022/" },
    { name: "Ópera Latinoamérica", logo: getAssetUrl("Opera-Latinoamericana.png"), url: "https://www.operala.org/alejandra-marti-es-nominada-a-los-latin-american-leaders-awards-2024-otorgados-por-ong-europea/" },
    { name: "Amigos del Viento", logo: getAssetUrl("Amigos-Del-Viento.png"), url: "https://www.amigosdelviento.org/single-post/premiados-latin-american-leaders-awards-2022" },
    { name: "Tequila Inteligente", logo: getAssetUrl("Tequila-Inteligente.png"), url: "https://tequilainteligente.com/entrevista-federico-de-arteaga-latin-american-leaders-awards-2022/" },
    { name: "GentemotivandoGente", logo: getAssetUrl("gente-motivando-gente.png"), url: "https://mail.gentemotivandogente.com/index.php/en/rse-blog?start=500" },
    { name: "Amigos de Bellas Artes", logo: getAssetUrl("amigos-del-bellas-artes.svg"), url: "https://amigosdelbellasartes.org.ar/los-museos-en-el-medio/" },
    { name: "Sambito", logo: getAssetUrl("Sambito.png"), url: "https://sambito.com.ec/" }
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
