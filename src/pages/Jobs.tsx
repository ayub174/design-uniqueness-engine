import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Building2, SlidersHorizontal, ArrowUpDown, Bell,
  Heart, Clock, Share2, Mail, Calendar, Briefcase, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  date: string;
  deadline: string;
  type: string;
  schedule: string;
  extent: string;
  duration: string;
  description: string;
}

const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Lokalvård",
    company: "Aurora tjänst & service AB",
    companyInitials: "AT",
    location: "Forsbacka",
    date: "Idag",
    deadline: "1 månad kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Aurora tjänst & service Ab är ett professionellt serviceföretag inom lokalvård och facility management. Vi levererar kvalitetssäkrade städtjänster till företag, offentliga verksamheter och privata kunder. Vårt arbete präglas av struktur, dokumentation, digital uppföljning och kontinuerlig kvalitetsutveckling.\n\nArbetsbeskrivning\n\nVi söker nu en utbildad och erfaren lokalvårdare med PRYL 2.0-certifiering som även har förmåga att arbeta med administrativa uppgifter och digital uppföljning.",
  },
  {
    id: "2",
    title: "Eventsäljare till köpcentrum",
    company: "Medla Sverige AB",
    companyInitials: "MS",
    location: "Göteborg",
    date: "Idag",
    deadline: "15 dagar kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Medla Sverige AB söker energiska eventsäljare som vill arbeta i en spännande och dynamisk miljö. Du kommer att representera våra kunder på köpcentrum och events runt om i Göteborg.",
  },
  {
    id: "3",
    title: "Eventsäljare till köpcentrum",
    company: "Medla Sverige AB",
    companyInitials: "MS",
    location: "Malmö",
    date: "Idag",
    deadline: "15 dagar kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Medla Sverige AB söker energiska eventsäljare som vill arbeta i en spännande och dynamisk miljö. Du kommer att representera våra kunder på köpcentrum och events runt om i Malmö.",
  },
  {
    id: "4",
    title: "Eventsäljare till köpcentrum",
    company: "Medla Sverige AB",
    companyInitials: "MS",
    location: "Stockholm",
    date: "Idag",
    deadline: "15 dagar kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Medla Sverige AB söker energiska eventsäljare som vill arbeta i en spännande och dynamisk miljö. Du kommer att representera våra kunder på köpcentrum och events runt om i Stockholm.",
  },
  {
    id: "5",
    title: "Frontend-utvecklare",
    company: "Techbolaget AB",
    companyInitials: "TB",
    location: "Stockholm",
    date: "Igår",
    deadline: "3 veckor kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Vi söker en driven frontend-utvecklare med erfarenhet av React och TypeScript. Du kommer att arbeta i ett agilt team och bygga moderna webbapplikationer.",
  },
  {
    id: "6",
    title: "Projektledare bygg",
    company: "Byggarna i Norr AB",
    companyInitials: "BN",
    location: "Umeå",
    date: "Idag",
    deadline: "2 veckor kvar",
    type: "Vanlig anställning",
    schedule: "Heltid",
    extent: "100%",
    duration: "Tills vidare",
    description:
      "Byggarna i Norr söker en erfaren projektledare för att leda byggprojekt i Umeå-regionen. Du har god erfarenhet av att planera, koordinera och följa upp byggprojekt.",
  },
];

const filters = [
  { icon: MapPin, label: "Ort" },
  { icon: Building2, label: "Yrke" },
  { icon: SlidersHorizontal, label: "Filter" },
  { icon: ArrowUpDown, label: "Nyast först" },
  { icon: Bell, label: "Bevaka" },
];

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState<Job>(sampleJobs[0]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [showDetail, setShowDetail] = useState(false);

  const toggleSave = (jobId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                Chappie<span className="text-primary">.</span>
              </Link>
              <span className="text-xl font-serif font-medium text-foreground">Jobb</span>
              <Badge className="bg-primary text-primary-foreground border-0 text-xs font-semibold px-3 py-1">
                82 543 tjänster
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="h-4 w-4" />
                Sparade
              </button>
              <button className="flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Bell className="h-4 w-4" />
                Bevakningar
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  1
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök jobb, företag, ort..."
                className="pl-11 h-12 text-sm bg-card border-border rounded-xl"
              />
            </div>
            <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium">
              <Search className="h-4 w-4" />
              Sök
            </Button>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.label}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content — split view */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left — Job List */}
          <div className="w-full lg:w-[420px] shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 scrollbar-thin">
            {sampleJobs.map((job) => (
              <motion.button
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  setShowDetail(true);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
                className={`w-full text-left rounded-xl border p-5 transition-all duration-200 ${
                  selectedJob.id === job.id
                    ? "border-primary bg-primary/[0.04] shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Company avatar */}
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {job.companyInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-foreground leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                      </div>
                      <button
                        onClick={(e) => toggleSave(job.id, e)}
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-0.5"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            savedJobs.has(job.id) ? "fill-primary text-primary" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                        <Calendar className="h-3 w-3" />
                        {job.date}
                      </span>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                      <Clock className="h-3 w-3" />
                      Ansökan: {job.deadline}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right — Job Detail */}
          <div className="hidden lg:block flex-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary shrink-0">
                    {selectedJob.companyInitials}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                      {selectedJob.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">{selectedJob.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {selectedJob.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {selectedJob.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleSave(selectedJob.id)}
                      className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedJobs.has(selectedJob.id) ? "fill-primary text-primary" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5">
                    {selectedJob.type}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.schedule}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.extent}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.duration}
                  </span>
                </div>

                {/* Deadline card */}
                <div className="bg-muted rounded-xl p-4 mb-6 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Ansökan: {selectedJob.deadline}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mb-8">
                  <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium">
                    <Mail className="h-4 w-4" />
                    Ansök via e-post
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 px-6 gap-2 font-medium"
                    onClick={() => toggleSave(selectedJob.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        savedJobs.has(selectedJob.id) ? "fill-primary text-primary" : ""
                      }`}
                    />
                    Spara
                  </Button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Om tjänsten
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile detail overlay */}
        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => setShowDetail(false)}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-serif font-semibold text-foreground truncate">
                  {selectedJob.title}
                </span>
              </div>
              <div className="p-4">
                {/* Reuse detail content */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary shrink-0">
                    {selectedJob.companyInitials}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      {selectedJob.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-0.5">{selectedJob.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedJob.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedJob.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5">
                    {selectedJob.type}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.schedule}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.extent}
                  </span>
                  <span className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1.5">
                    {selectedJob.duration}
                  </span>
                </div>

                <div className="bg-muted rounded-xl p-4 mb-5 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Ansökan: {selectedJob.deadline}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium flex-1">
                    <Mail className="h-4 w-4" />
                    Ansök via e-post
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 px-6 gap-2 font-medium"
                    onClick={() => toggleSave(selectedJob.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        savedJobs.has(selectedJob.id) ? "fill-primary text-primary" : ""
                      }`}
                    />
                    Spara
                  </Button>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  Om tjänsten
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Jobs;
