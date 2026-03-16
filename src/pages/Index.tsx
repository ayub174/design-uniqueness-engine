import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Search, ArrowRight, Briefcase, MapPin, Zap, Users, TrendingUp, Star, Sparkles, GraduationCap, FileText, Handshake, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const platformFeatures = [
  { icon: Search, label: "Hitta rätt jobb", desc: "Sök bland tusentals tjänster från Sveriges bästa företag — filtrera på plats, bransch och lön.", step: "01" },
  { icon: GraduationCap, label: "Utveckla din kompetens", desc: "Hitta kurser och utbildningar som stärker din profil och öppnar nya dörrar.", step: "02" },
  { icon: FileText, label: "Bygg din ansökan", desc: "Skapa CV och personligt brev med AI-drivna verktyg som lyfter din ansökan.", step: "03" },
  { icon: Handshake, label: "Matcha med arbetsgivare", desc: "Bli hittad — vår smarta matchning kopplar ihop dig med rätt företag.", step: "04" },
  { icon: ClipboardList, label: "Följ din resa", desc: "Spåra alla ansökningar, deadlines och nästa steg på ett och samma ställe.", step: "05" },
];

const categories = [
  { label: "Tech & Engineering", count: 2340, icon: Zap },
  { label: "Design & Creative", count: 891, icon: Star },
  { label: "Marketing & Growth", count: 1205, icon: TrendingUp },
  { label: "Sales & Business", count: 967, icon: Users },
];

const featuredJobs = [
  { title: "Senior Product Designer", company: "Figma", location: "Stockholm", type: "Hybrid", salary: "65–85k SEK" },
  { title: "Full-Stack Engineer", company: "Klarna", location: "Göteborg", type: "Remote", salary: "70–95k SEK" },
  { title: "Growth Marketing Lead", company: "Spotify", location: "Stockholm", type: "On-site", salary: "60–80k SEK" },
  { title: "Data Scientist", company: "Volvo Cars", location: "Göteborg", type: "Hybrid", salary: "55–75k SEK" },
];

const naturalSearchExamples = [
  "Jag vill jobba med UX-design på ett startup i Stockholm",
  "Remote-jobb inom data science med bra work-life balance",
  "Marknadsföring på ett techbolag i Göteborg, gärna hybrid",
  "Juniorroll inom fullstack-utveckling med mentorskap",
  "Projektledare inom hållbarhet med möjlighet att resa",
];

const Index = () => {
  const [searchMode, setSearchMode] = useState<"standard" | "natural">("standard");
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [naturalInputValue, setNaturalInputValue] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % platformFeatures.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for natural search
  useEffect(() => {
    if (searchMode !== "natural" || isUserTyping) {
      setTypedText("");
      return;
    }

    let exampleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = naturalSearchExamples[exampleIndex];

      if (!isDeleting) {
        charIndex++;
        setTypedText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          timeout = setTimeout(() => { isDeleting = true; tick(); }, 2000);
          return;
        }
        timeout = setTimeout(tick, 45 + Math.random() * 35);
      } else {
        charIndex--;
        setTypedText(current.slice(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          exampleIndex = (exampleIndex + 1) % naturalSearchExamples.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 25);
      }
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, [searchMode, isUserTyping]);

  return (
    <div className="min-h-screen bg-background relative grain-overlay overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Chappie<span className="text-primary">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Jobb</a>
            <a href="#" className="hover:text-foreground transition-colors">Företag</a>
            <a href="#" className="hover:text-foreground transition-colors">Karriärguide</a>
            <a href="#" className="hover:text-foreground transition-colors">Om oss</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm font-medium hidden sm:inline-flex">Logga in</Button>
            <Button className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              Kom igång
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            {/* Left — main headline */}
            <motion.div
              className="md:col-span-7 lg:col-span-6"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-sm font-medium tracking-widest uppercase text-primary mb-6"
              >
                Sveriges smartaste karriärplattform
              </motion.p>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-foreground"
              >
                Hitta jobbet som
                <br />
                <span className="italic text-primary">förändrar</span>
                <br />
                allt.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-8 text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
              >
                Vi kopplar ihop ambitiösa talanger med företag som bygger framtiden.
                Inga floskler — bara rätt matchning.
              </motion.p>

              {/* Search mode toggle */}
              <motion.div variants={fadeUp} custom={3} className="mt-10">
                <div className="flex items-center gap-1 mb-3 bg-card border border-border p-1 rounded-full w-fit">
                  <button
                    onClick={() => setSearchMode("standard")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      searchMode === "standard"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Search className="h-3.5 w-3.5" />
                    Vanlig sök
                  </button>
                  <button
                    onClick={() => setSearchMode("natural")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      searchMode === "natural"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Naturlig sök
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {searchMode === "standard" ? (
                    <>
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Titel, kompetens eller företag..."
                          className="pl-11 h-14 text-base bg-card border-border"
                        />
                      </div>
                      <div className="relative flex-1 sm:max-w-[200px]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Stad..."
                          className="pl-11 h-14 text-base bg-card border-border"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="relative flex-1">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Beskriv ditt drömjobb med egna ord..."
                        className="pl-11 h-14 text-base bg-card border-border"
                      />
                    </div>
                  )}
                  <Button className="h-14 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    {searchMode === "standard" ? "Sök jobb" : "Hitta matchningar"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-6 flex items-center gap-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  4 200+ aktiva jobb
                </span>
                <span>320+ företag</span>
              </motion.div>
            </motion.div>

            {/* Right — auto-rotating feature cards */}
            <motion.div
              className="md:col-span-5 lg:col-span-6 hidden md:flex flex-col items-end justify-end"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-md">
                {/* Active feature card */}
                <div className="relative min-h-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.04] rounded-bl-[4rem]" />
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
                          {(() => { const Icon = platformFeatures[activeFeature].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">{platformFeatures[activeFeature].step} / 05</span>
                      </div>
                      <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                        {platformFeatures[activeFeature].label}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {platformFeatures[activeFeature].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Minimal dot indicators + progress */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex gap-2">
                    {platformFeatures.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveFeature(i)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          i === activeFeature ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground/40 ml-auto font-mono">
                    {platformFeatures[activeFeature].step}/{String(platformFeatures.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      {/* Categories */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-12 gap-12 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="md:col-span-4">
              <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Utforska</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight text-foreground">
                Branscher som
                <br />
                <span className="italic">söker dig</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-sm">
                Oavsett om du kodar, designar eller driver tillväxt — vi har rätt möjligheter redo.
              </p>
            </motion.div>

            <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  variants={fadeUp}
                  custom={i + 1}
                  className="group relative bg-card border border-border p-8 hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.04] group-hover:bg-primary/[0.08] transition-colors duration-500" />
                  <cat.icon className="h-5 w-5 text-primary mb-4" />
                  <h3 className="font-serif text-xl font-medium text-foreground mb-1">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count.toLocaleString()} öppna tjänster</p>
                  <ArrowRight className="absolute bottom-8 right-8 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Handplockade</p>
                <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
                  Utvalda <span className="italic">möjligheter</span>
                </h2>
              </div>
              <Button variant="ghost" className="mt-6 md:mt-0 text-primary hover:text-primary/80 gap-2 self-start">
                Visa alla jobb <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <div className="space-y-px">
              {featuredJobs.map((job, i) => (
                <motion.div
                  key={job.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="group grid md:grid-cols-12 gap-4 items-center border-t border-secondary-foreground/10 py-8 cursor-pointer hover:bg-secondary-foreground/[0.03] transition-colors duration-300 px-2 -mx-2"
                >
                  <div className="md:col-span-5">
                    <h3 className="font-serif text-xl font-medium group-hover:text-primary transition-colors duration-300">
                      {job.title}
                    </h3>
                    <p className="text-sm text-secondary-foreground/60 mt-1">{job.company}</p>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2 text-sm text-secondary-foreground/60">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                    <span className="ml-2 px-2 py-0.5 text-xs border border-secondary-foreground/20">
                      {job.type}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-sm font-medium text-secondary-foreground/80">
                    {job.salary}
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-px bg-border"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { number: "4 200+", label: "Aktiva jobbannonser" },
              { number: "89%", label: "Matchningsgrad" },
              { number: "12 dagar", label: "Genomsnittlig tid till anställning" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="bg-background p-12 text-center"
              >
                <span className="font-serif text-5xl md:text-6xl font-medium text-foreground">{stat.number}</span>
                <p className="mt-4 text-sm text-muted-foreground tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="relative bg-secondary text-secondary-foreground p-12 md:p-20 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <span className="font-serif text-[10rem] md:text-[16rem] font-bold leading-none text-secondary-foreground/[0.03] select-none absolute -top-10 -right-10">
              →
            </span>
            <div className="relative z-10 max-w-xl">
              <motion.p variants={fadeUp} custom={0} className="text-xs font-medium tracking-widest uppercase text-primary mb-6">
                Redo?
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
                Ditt nästa kapitel
                <br />
                <span className="italic">börjar här</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-secondary-foreground/70 text-lg mb-10 leading-relaxed">
                Skapa en profil på under 2 minuter. Våra algoritmer sköter resten.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 px-10 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  Skapa profil
                </Button>
                <Button variant="outline" className="h-14 px-10 text-base font-medium border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                  Jag rekryterar
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                Chappie<span className="text-primary">.</span>
              </span>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Sveriges mest ambitiösa karriärplattform. Byggd för talanger som vill framåt.
              </p>
            </div>
            {[
              { title: "Plattform", links: ["Sök jobb", "Företag", "Karriärguide", "Priser"] },
              { title: "Företag", links: ["Om oss", "Blogg", "Karriär hos oss", "Press"] },
              { title: "Support", links: ["Hjälpcenter", "Kontakta oss", "Integritetspolicy", "Villkor"] },
            ].map((col) => (
              <div key={col.title} className="md:col-span-2">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Chappie. Alla rättigheter förbehållna.</p>
            <p className="text-xs text-muted-foreground">Designad i Stockholm 🇸🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
