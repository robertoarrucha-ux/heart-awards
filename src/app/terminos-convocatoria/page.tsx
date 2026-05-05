'use client';

import Header from '@/components/header';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Gavel, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function TerminosConvocatoria() {
  return (
    <div className="flex flex-col min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
          >
            <Gavel className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Documentación Oficial</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Términos y Bases de la Convocatoria
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gold italic text-xl font-serif"
          >
            Latin American Leaders Awards
          </motion.p>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="glass p-8 md:p-12 rounded-3xl border-white/5 space-y-12"
          >
            {/* TÉRMINOS Y BASES GENERALES */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Términos y Bases Generales</h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">1.</span>
                  Los Leaders Awards, en sus capítulos nacionales y/o regionales, son los premios para Líderes del Sector Privado y/o Público que trabajen en Desarrollo Económico, Sostenible y Social en beneficio de América Latina.
                </p>

                <div className="pl-4 border-l border-primary/20 space-y-4">
                  <p>
                    <span className="text-foreground font-bold mr-2">2.</span>
                    Se entiende por Desarrollo, aquellas soluciones accesibles, asequibles y adaptables que trabajen en al menos uno de los siguientes objetivos enmarcados en la Agenda 2030 de la ONU:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm italic">
                    <li>i: Poner fin a la pobreza en todas sus formas.</li>
                    <li>ii: Poner fin al hambre y seguridad alimentaria.</li>
                    <li>iii: Garantizar una vida sana y bienestar.</li>
                    <li>iv: Educación inclusiva y de calidad.</li>
                    <li>v: Lograr la igualdad entre los géneros.</li>
                    <li>vi: Gestión sostenible del agua.</li>
                    <li>vii: Energía asequible y moderna.</li>
                    <li>viii: Crecimiento económico y trabajo decente.</li>
                    <li>ix: Infraestructuras resilientes e innovación.</li>
                    <li>x: Reducir la desigualdad.</li>
                    <li>xi: Ciudades y asentamientos sostenibles.</li>
                    <li>xii: Consumo y producción sostenibles.</li>
                    <li>xiii: Combatir el cambio climático.</li>
                    <li>xiv: Conservar océanos y mares.</li>
                    <li>xv: Proteger ecosistemas terrestres.</li>
                    <li>xvi: Sociedades pacíficas e instituciones eficaces.</li>
                    <li>xvii: Alianza Mundial para el Desarrollo.</li>
                  </ul>
                </div>

                <p>
                  <span className="text-foreground font-bold mr-2">3.</span>
                  Pueden nominarse y/o auto-nominarse: Persona Física mayor de 18 años, Políticas Públicas a través de Gobiernos en todos los niveles, Empresas de todos los tamaños y Organizaciones de la Sociedad Civil.
                </p>

                <p>
                  <span className="text-foreground font-bold mr-2">4.</span>
                  Las fechas serán publicadas en las respectivas páginas dedicadas a la convocatoria, incluyendo recepción de nominaciones, fecha final, publicación de finalistas, votaciones y ceremonia de premiación.
                </p>
              </div>
            </motion.div>

            {/* CRITERIOS DE SELECCIÓN */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Criterios y Comités</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-foreground font-bold mb-4">5. Criterios para nominados finalistas:</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Liderazgo:</strong> Capacidad para inspirar y movilizar.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Trayectoria:</strong> Registro comprobable de su trabajo e impacto.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Innovación:</strong> Soluciones eficaces y creativas.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Integridad:</strong> Reputación y credenciales alineadas a los valores.</span></li>
                  </ul>
                </div>

                <p>
                  <span className="text-foreground font-bold mr-2">6.</span>
                  El comité de selección que elige a los Nominados Finalistas está conformado por el equipo Organizador y Aliados.
                </p>

                <p>
                  <span className="text-foreground font-bold mr-2">7.</span>
                  Son 3 (tres) comités de selección los que eligen a los Premiados: uno de votación abierta al público, y dos de votación cerrada.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.1 Comité Abierto</p>
                    <p className="text-xs">Elige a 15 premiados mediante votación pública en awards.pro-latam.org.</p>
                  </div>
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.2 Comité Cerrado</p>
                    <p className="text-xs">Elige a 5 premiados mediante el voto de los asistentes al evento (Agenda General y VIP).</p>
                  </div>
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.3 Comité Cerrado</p>
                    <p className="text-xs">Elige a 5 premiados mediante el voto preferencial de Empresas Aliadas y Patrocinadores.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TRANSPARENCIA */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Transparencia y Ética</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">8.</span>
                  La transparencia y reputación de los premios es nuestra máxima prioridad. Se establece la verificación de votos (auditoría de IP, correo, etc.) y el conteo transparente (los votos siempre se harán públicos).
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">9.</span>
                  Objeciones y Revisiones: Cualquier objeción recibirá una respuesta justificada. El comité podrá extender anuncios o premiar nuevos finalistas en caso de error.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">10.</span>
                  Todos los nominados aceptan que el proceso ha sido justo, transparente e inclusivo, comprometiéndose a actuar de forma cordial.
                </p>
              </div>
            </motion.div>

            {/* NOMINADOS Y PREMIADOS */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Términos para Nominados y Premiados</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">11-12.</span>
                  Los participantes aceptan los términos y otorgan el uso de su nombre, imagen y logos para la realización exitosa de los premios presentes y futuros.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">13-14.</span>
                  Los premiados recibirán un reconocimiento oficial digital y físico. Los incentivos monetarios o en especie dependen de los recursos disponibles. Los gastos de asistencia deben ser cubiertos por el participante.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">15.</span>
                  En caso de no asistir presencialmente, los nominados se comprometen a participar de forma remota (aceptación oficial y video-presentación).
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">16.</span>
                  El título de premiado puede ser removido si se comprueba, mediante pruebas fidedignas, que se han incumplido los criterios de liderazgo, trayectoria, innovación o integridad.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">17.</span>
                  <strong className="text-foreground">Protección de Datos y Privacidad:</strong> Todo lo referente al uso de datos personales y privacidad está resguardado bajo la protección legal del <strong className="text-foreground">GDPR</strong> (Reglamento General de Protección de Datos). Los detalles completos de estas políticas pueden consultarse en: <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">https://pro-latam.org/privacy-use-impressum/</a>.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">18.</span>
                  El comité organizador se reserva el hecho de tomar los términos y políticas necesarias para garantizar la misión principal de los Latin American Leaders Awards.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-primary hover:underline font-bold">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 glass">
        <div className="container mx-auto px-4 text-center">
            <div className="space-y-4 mb-8">
                <p className="text-muted-foreground text-sm">© 2026 Pro Latam. All rights reserved.</p>
                <p className="text-muted-foreground text-sm">© 2026 The New Global School. Lindengasse 56, 1070 Vienna, Austria.</p>
                <p className="text-muted-foreground text-sm">C. del Capitan Blanco Argibay, 69, Tetuan, 28029 Madrid, Spain.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-6 text-xs uppercase tracking-widest font-bold text-foreground/40">
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacidad</a>
                    <span>|</span>
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Términos</a>
                    <span>|</span>
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Impressum</a>
                    <span>|</span>
                    <Link href="/terminos-convocatoria" className="hover:text-primary transition-colors">Bases Convocatoria</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
