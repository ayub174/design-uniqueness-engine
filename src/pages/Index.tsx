import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Search, ArrowRight, Briefcase, MapPin, Zap, Users, TrendingUp, Star, Sparkles, GraduationCap, FileText, Handshake, ClipboardList, CheckCircle2, BookOpen, Filter, Award, Building2, SlidersHorizontal, ArrowUpDown, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import cvBuilderImg from "@/assets/cv-builder-mockup.png";
import coverLetterImg from "@/assets/cover-letter-mockup.png";
import educationImg from "@/assets/education-search-mockup.png";

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
  "Visa mig remote-jobb inom tech",
  "Hitta marknadsförare i Stockholm",
  "Sök deltidsjobb inom vården",
  "Jag vill jobba med design i Göteborg",
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
            <a href="/tradar" className="hover:text-foreground transition-colors">Trådar</a>
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
        className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12"
      >
        {/* Soft background wash */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-highlight/[0.10] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — headline + CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-foreground/80">Sveriges smartaste karriärplattform</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight text-foreground"
              >
                Öka chanserna <br className="hidden sm:block" />
                till din nästa{" "}
                <span className="relative inline-flex items-center gap-3 align-middle">
                  <span className="relative inline-block px-3 py-1 rounded-lg bg-primary text-primary-foreground -rotate-1 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.55)]">
                    intervju
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl leading-none" aria-hidden>🚀</span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-8 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              >
                Jobb, utbildning, CV och matchning — allt du behöver för nästa steg, samlat i en plattform.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center gap-4">
                <Button className="h-13 px-7 text-base font-semibold bg-highlight text-highlight-foreground hover:bg-highlight/90 hover:shadow-[0_10px_30px_-8px_hsl(var(--highlight)/0.6)] active:scale-[0.98] gap-2 rounded-full transition-all duration-200">
                  Kom igång gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <a href="#" className="text-sm font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline transition-colors">
                  Se hur det funkar →
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  4 200+ aktiva jobb
                </span>
                <span className="h-4 w-px bg-border" />
                <span>320+ företag</span>
              </motion.div>
            </motion.div>

            {/* Right — search card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Decorative floating accents */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 backdrop-blur-sm hidden lg:flex items-center justify-center rotate-[-8deg] shadow-lg"
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-5 -right-4 w-12 h-12 rounded-2xl bg-highlight/25 border border-highlight/40 backdrop-blur-sm hidden lg:flex items-center justify-center rotate-[6deg] shadow-lg"
              >
                <Briefcase className="h-5 w-5 text-highlight-foreground" />
              </motion.div>

              <div className="relative bg-card/90 backdrop-blur-md border border-border rounded-3xl p-5 md:p-6 shadow-[0_20px_60px_-20px_hsl(var(--foreground)/0.18)]">
                {/* Mode toggle */}
                <div className="flex items-center gap-1 mb-5 bg-muted/60 p-1 rounded-full w-fit">
                  <button
                    onClick={() => setSearchMode("standard")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      searchMode === "standard"
                        ? "bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.4)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Vanlig sök
                  </button>
                  <button
                    onClick={() => setSearchMode("natural")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      searchMode === "natural"
                        ? "bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.4)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Naturlig sök
                  </button>
                </div>

                {/* Search inputs */}
                <div className="flex flex-col sm:flex-row gap-2 p-2 bg-background/70 border border-border rounded-2xl">
                  {searchMode === "standard" ? (
                    <>
                      <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                        <Input
                          placeholder="Yrke, företag eller titel..."
                          className="pl-11 h-12 text-base bg-transparent border-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl"
                        />
                      </div>
                      <div className="hidden sm:block w-px bg-border self-stretch my-2" />
                      <div className="relative flex-1 sm:max-w-[180px] group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                        <Input
                          placeholder="Stad eller postnummer"
                          className="pl-11 h-12 text-base bg-transparent border-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="relative flex-1 group">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                      <Input
                        value={isUserTyping ? naturalInputValue : typedText}
                        onChange={(e) => {
                          setIsUserTyping(true);
                          setNaturalInputValue(e.target.value);
                        }}
                        onFocus={() => {
                          setIsUserTyping(true);
                          setNaturalInputValue("");
                        }}
                        onBlur={() => {
                          if (!naturalInputValue) setIsUserTyping(false);
                        }}
                        placeholder=""
                        className="pl-11 h-12 text-base bg-transparent border-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl"
                      />
                    </div>
                  )}
                  <Button className="h-12 px-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.4)] active:scale-[0.98] gap-2 rounded-xl transition-all duration-200">
                    {searchMode === "standard" ? "Sök jobb" : "Hitta matchningar"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick filters */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {[
                    { icon: MapPin, label: "Ort" },
                    { icon: Building2, label: "Yrke" },
                    { icon: Filter, label: "Filter" },
                    { icon: ArrowUpDown, label: "Nyast först" },
                    { icon: Bell, label: "Bevaka" },
                  ].map((filter) => (
                    <button
                      key={filter.label}
                      className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full border border-border bg-background/60 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-[0.97] transition-all duration-200"
                    >
                      <filter.icon className="h-3 w-3" />
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Trending searches */}
                <div className="mt-5 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Populärt:</span>
                  {["UX Designer", "Data Scientist", "Remote", "Stockholm"].map((tag) => (
                    <button
                      key={tag}
                      className="text-xs font-medium text-foreground/70 hover:text-primary transition-colors"
                    >
                      #{tag.toLowerCase().replace(" ", "")}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      {/* CV & Cover Letter Builder */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
              <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Bygg din ansökan</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight text-foreground">
                CV + Personligt Brev = <span className="italic">Chappie</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Våra AI-drivna verktyg hjälper dig att skapa professionella ansökningshandlingar som sticker ut. Fyll i dina uppgifter, välj en mall och låt oss göra resten.
              </p>
            </motion.div>

            {/* CV Builder */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-20 md:mb-28"
            >
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium tracking-widest uppercase text-primary">CV-byggaren</span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                  Skapa ett CV som <span className="italic">öppnar dörrar</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Fyll i dina erfarenheter och utbildningar — välj bland professionella mallar och se resultatet i realtid. Exportera som PDF, redo att skicka.
                </p>
                <ul className="space-y-4">
                  {["Välj bland snygga, ATS-vänliga mallar", "AI-förslag som förbättrar dina formuleringar", "Realtidsförhandsgranskning bredvid formuläret", "Exportera som PDF med ett klick"].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 h-12 px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Bygg ditt CV <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
                  <img src={cvBuilderImg} alt="CV-byggaren visar formulär och förhandsgranskning sida vid sida" className="w-full h-auto" />
                </div>
              </div>
            </motion.div>

            {/* Cover Letter Builder */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
                  <img src={coverLetterImg} alt="Personligt brev-byggaren med AI-förslag markerade i texten" className="w-full h-auto" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium tracking-widest uppercase text-primary">Personligt brev</span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                  AI-driven hjälp för <span className="italic">rätt ton</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Klistra in jobbannonsens länk — vår AI anpassar ditt personliga brev till tjänsten. Du behåller kontrollen, vi ger dig skjutsen.
                </p>
                <ul className="space-y-4">
                  {["Anpassar automatiskt till jobbannonsen", "Föreslår tonläge och nyckelord", "Matchningsscore — se hur bra ditt brev passar", "Redigera fritt med AI-stöd i realtid"].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 h-12 px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Skriv personligt brev <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education / Utbildningar */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Utbildningar</p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight text-foreground">
                Hitta kurser som <span className="italic">tar dig vidare</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Sök bland tusentals utbildningar — från korta onlinekurser till längre program. Oavsett om du vill byta karriär, specialisera dig eller bara lära dig något nytt.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: "Onlinekurser", desc: "Lär dig i din egen takt" },
                  { icon: GraduationCap, label: "YH & Högskola", desc: "Meriterade program" },
                  { icon: Award, label: "Certifieringar", desc: "Stärk din profil" },
                  { icon: Filter, label: "Smarta filter", desc: "Hitta rätt på sekunder" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-10 h-12 px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Utforska utbildningar <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg bg-background">
                <img src={educationImg} alt="Utbildningsplattformen med kurskort och filter" className="w-full h-auto" />
              </div>
            </motion.div>
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
