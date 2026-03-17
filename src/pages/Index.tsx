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
                Hela din karriär,
                <br />
                <span className="italic text-primary">ett</span> ställe.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-8 text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
              >
                Jobb, utbildning, CV och matchning — allt du behöver för nästa steg, samlat i en plattform.
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
                        className="pl-11 h-14 text-base bg-card border-border"
                      />
                    </div>
                  )}
                  <Button className="h-14 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    {searchMode === "standard" ? "Sök jobb" : "Hitta matchningar"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {/* Filter bar */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {[
                    { icon: MapPin, label: "Ort" },
                    { icon: Building2, label: "Yrke" },
                    { icon: SlidersHorizontal, label: "Filter" },
                    { icon: ArrowUpDown, label: "Nyast först" },
                    { icon: Bell, label: "Bevaka" },
                  ].map((filter) => (
                    <button
                      key={filter.label}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-border bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                    >
                      <filter.icon className="h-3.5 w-3.5" />
                      {filter.label}
                    </button>
                  ))}
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

            {/* Right — abstract art */}
            <motion.div
              className="md:col-span-5 lg:col-span-6 hidden md:flex items-center justify-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full h-[500px]">
                {/* Large primary glow */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/[0.07] blur-3xl"
                />

                {/* Rotating ring system */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72"
                >
                  <div className="w-full h-full rounded-full border border-primary/10" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-primary/25" />
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
                >
                  <div className="w-full h-full rounded-full border border-dashed border-primary/[0.06]" />
                </motion.div>

                {/* SVG decorative arcs */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="180" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="8 12" />
                  <circle cx="250" cy="250" r="120" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" strokeDasharray="4 10" />
                </svg>

                {/* Floating career cards */}
                {/* CV card */}
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[12%] right-[8%] bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 shadow-lg shadow-primary/[0.04] w-48"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">CV uppdaterat</p>
                      <p className="text-[10px] text-muted-foreground">Just nu</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-primary/20 w-full" />
                    <div className="h-1.5 rounded-full bg-primary/12 w-3/4" />
                    <div className="h-1.5 rounded-full bg-primary/8 w-1/2" />
                  </div>
                </motion.div>

                {/* Match notification */}
                <motion.div
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute top-[45%] left-[5%] bg-card/80 backdrop-blur-md border border-primary/20 rounded-2xl p-3.5 shadow-lg shadow-primary/[0.06] w-52"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">3 nya matchningar!</p>
                      <p className="text-[10px] text-muted-foreground">Baserat på din profil</p>
                    </div>
                  </div>
                </motion.div>

                {/* Salary insight card */}
                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                  className="absolute bottom-[18%] right-[5%] bg-card/80 backdrop-blur-md border border-border rounded-2xl p-3.5 shadow-lg shadow-primary/[0.04] w-44"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <p className="text-[11px] font-semibold text-foreground">Löneutveckling</p>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                    {[35, 45, 40, 55, 50, 65, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                        className="flex-1 rounded-sm bg-primary/25"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Interview badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute top-[22%] left-[25%] bg-card/80 backdrop-blur-md border border-border rounded-full px-3.5 py-2 shadow-md flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground">Intervju imorgon 09:00</span>
                </motion.div>

                {/* Small floating skill tags */}
                <motion.div
                  animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-[35%] left-[20%] bg-primary/10 text-primary text-[10px] font-semibold px-3 py-1.5 rounded-full border border-primary/15"
                >
                  React
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute top-[60%] right-[22%] bg-primary/10 text-primary text-[10px] font-semibold px-3 py-1.5 rounded-full border border-primary/15"
                >
                  Projektledning
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                  className="absolute bottom-[12%] left-[35%] bg-primary/10 text-primary text-[10px] font-semibold px-3 py-1.5 rounded-full border border-primary/15"
                >
                  UX Design
                </motion.div>

                {/* Floating particles */}
                {[
                  { top: "8%", left: "50%", size: "w-1.5 h-1.5", delay: 0, dur: 6 },
                  { top: "75%", left: "55%", size: "w-1 h-1", delay: 2, dur: 8 },
                  { top: "40%", left: "85%", size: "w-1.5 h-1.5", delay: 4, dur: 5 },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0], opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
                    className={`absolute ${p.size} rounded-full bg-primary/30`}
                    style={{ top: p.top, left: p.left }}
                  />
                ))}
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
