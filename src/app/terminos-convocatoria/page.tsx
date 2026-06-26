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
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Official Documentation</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Nomination Rules & Terms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gold italic text-xl font-serif"
          >
            Heart-Led Summit & Awards
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
            {/* GENERAL TERMS */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">General Terms & Rules</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">1.</span>
                  The Heart-Led Summit & Awards recognizes leaders from the Private and Public sectors who contribute to Economic, Sustainable, and Social Development globally — with a special focus on the connection between Latin America and Europe.
                </p>

                <div className="pl-4 border-l border-primary/20 space-y-4">
                  <p>
                    <span className="text-foreground font-bold mr-2">2.</span>
                    Development is understood as accessible, affordable, and adaptable solutions aligned with at least one of the following UN Agenda 2030 goals:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm italic">
                    <li>i: End poverty in all its forms.</li>
                    <li>ii: End hunger and ensure food security.</li>
                    <li>iii: Ensure healthy lives and promote well-being.</li>
                    <li>iv: Inclusive and quality education.</li>
                    <li>v: Achieve gender equality.</li>
                    <li>vi: Sustainable water management.</li>
                    <li>vii: Affordable and clean energy.</li>
                    <li>viii: Decent work and economic growth.</li>
                    <li>ix: Resilient infrastructure and innovation.</li>
                    <li>x: Reduce inequality.</li>
                    <li>xi: Sustainable cities and communities.</li>
                    <li>xii: Responsible consumption and production.</li>
                    <li>xiii: Climate action.</li>
                    <li>xiv: Life below water.</li>
                    <li>xv: Life on land.</li>
                    <li>xvi: Peace, justice and strong institutions.</li>
                    <li>xvii: Partnerships for the goals.</li>
                  </ul>
                </div>

                <p>
                  <span className="text-foreground font-bold mr-2">3.</span>
                  Eligible nominees include: Natural persons aged 18 or over, Public Policies through governments at all levels, companies of all sizes, and Civil Society Organizations.
                </p>

                <p>
                  <span className="text-foreground font-bold mr-2">4.</span>
                  Key dates will be published on the official event pages, including nomination deadlines, finalist announcements, voting periods, and the awards ceremony.
                </p>
              </div>
            </motion.div>

            {/* SELECTION CRITERIA */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Criteria & Committees</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-foreground font-bold mb-4">5. Criteria for finalist nominees:</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Leadership:</strong> Ability to inspire and mobilize others.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Track Record:</strong> Verifiable history of work and impact.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Innovation:</strong> Effective and creative solutions.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong className="text-foreground">Integrity:</strong> Reputation and credentials aligned with heart-led values.</span></li>
                  </ul>
                </div>

                <p>
                  <span className="text-foreground font-bold mr-2">6.</span>
                  The selection committee that chooses Finalist Nominees is composed of the Organizing Team and Partners.
                </p>

                <p>
                  <span className="text-foreground font-bold mr-2">7.</span>
                  Three (3) selection committees choose the Award Winners: one open public vote, and two closed votes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.1 Community Committee</p>
                    <p className="text-xs">Selects 15 winners through public voting at heart.awards-global.org/vota.</p>
                  </div>
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.2 Attendees Committee</p>
                    <p className="text-xs">Selects 5 winners through votes from event attendees (General and VIP).</p>
                  </div>
                  <div className="glass p-4 rounded-xl border-white/5">
                    <p className="text-primary font-bold text-sm mb-2">7.3 Organizers & Sponsors Committee</p>
                    <p className="text-xs">Selects 5 winners through preferential votes from Organizing Companies and Sponsors.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TRANSPARENCY */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Transparency & Ethics</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">8.</span>
                  Transparency and the reputation of the awards are our highest priority. Vote verification (IP auditing, email, etc.) and transparent counting (votes are always made public) are enforced.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">9.</span>
                  Objections & Reviews: Any objection will receive a justified response. The committee may extend announcements or award additional finalists in the event of an error.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">10.</span>
                  All nominees accept that the process has been fair, transparent, and inclusive, and commit to acting respectfully.
                </p>
              </div>
            </motion.div>

            {/* NOMINEES AND WINNERS */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Terms for Nominees & Winners</h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-bold mr-2">11–12.</span>
                  Participants accept the terms and grant permission to use their name, image, and logos for the successful promotion of present and future awards.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">13–14.</span>
                  Winners will receive an official digital and physical recognition. Monetary or in-kind incentives depend on available resources. Attendance costs must be covered by the participant.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">15.</span>
                  If unable to attend in person, nominees commit to participating remotely (official acceptance and video presentation).
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">16.</span>
                  The winner title may be revoked if verifiable evidence proves a breach of the leadership, track record, innovation, or integrity criteria.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">17.</span>
                  <strong className="text-foreground">Data Protection & Privacy:</strong> All matters related to personal data and privacy are governed by <strong className="text-foreground">GDPR</strong> (General Data Protection Regulation). Full details of these policies can be found at: <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">https://pro-latam.org/privacy-use-impressum/</a>.
                </p>
                <p>
                  <span className="text-foreground font-bold mr-2">18.</span>
                  The organizing committee reserves the right to adopt any terms and policies necessary to guarantee the primary mission of the Heart-Led Summit & Awards.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-primary hover:underline font-bold">
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 glass">
        <div className="container mx-auto px-4 text-center">
            <div className="space-y-4 mb-8">
                <p className="text-muted-foreground text-sm">© 2026 The Mompreneurs Society & Pro Latam. All rights reserved.</p>
                <p className="text-muted-foreground text-sm">© 2026 The New Global School. Lindengasse 56, 1070 Vienna, Austria.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-6 text-xs uppercase tracking-widest font-bold text-foreground/40">
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</a>
                    <span>|</span>
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Terms</a>
                    <span>|</span>
                    <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Impressum</a>
                    <span>|</span>
                    <Link href="/terminos-convocatoria" className="hover:text-primary transition-colors">Rules</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
