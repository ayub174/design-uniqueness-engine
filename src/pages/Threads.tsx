import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, ThumbsUp, Eye, Clock, TrendingUp, Filter,
  ChevronUp, ChevronDown, Search, Flame, Sparkles, ArrowLeft,
  User, Pin, Award, Share2, Bookmark, MoreHorizontal, Hash,
  MessageCircle, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Thread {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  authorRole: string;
  category: string;
  content: string;
  votes: number;
  replies: number;
  views: number;
  timeAgo: string;
  isPinned?: boolean;
  isHot?: boolean;
  tags: string[];
  lastReplyBy?: string;
  lastReplyTime?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const categories: Category[] = [
  { id: "all", label: "Alla trådar", icon: <MessageSquare className="w-4 h-4" />, count: 247, color: "bg-primary/10 text-primary" },
  { id: "career", label: "Karriärväxling", icon: <TrendingUp className="w-4 h-4" />, count: 63, color: "bg-amber-500/10 text-amber-600" },
  { id: "salary", label: "Lön & Förhandling", icon: <Award className="w-4 h-4" />, count: 41, color: "bg-emerald-500/10 text-emerald-600" },
  { id: "interview", label: "Intervjutips", icon: <Users className="w-4 h-4" />, count: 58, color: "bg-blue-500/10 text-blue-600" },
  { id: "cv", label: "CV & Personligt brev", icon: <Hash className="w-4 h-4" />, count: 35, color: "bg-violet-500/10 text-violet-600" },
  { id: "workplace", label: "Arbetsliv", icon: <MessageCircle className="w-4 h-4" />, count: 50, color: "bg-rose-500/10 text-rose-600" },
];

const threads: Thread[] = [
  {
    id: "1",
    title: "Bytte från lärare till UX-designer — så här gick jag tillväga",
    author: "EmmaK",
    authorInitials: "EK",
    authorRole: "UX Designer",
    category: "career",
    content: "Efter 8 år som mellanstadielärare kände jag att jag behövde en förändring. Började med onlinekurser på kvällar och helger, byggde en portfolio parallellt med jobbet och fick till slut min första UX-roll. AMA!",
    votes: 234,
    replies: 67,
    views: 2841,
    timeAgo: "3 timmar sedan",
    isPinned: true,
    isHot: true,
    tags: ["karriärväxling", "UX", "erfarenhet"],
    lastReplyBy: "DesignDaniel",
    lastReplyTime: "12 min sedan",
  },
  {
    id: "2",
    title: "Vad är rimlig ingångslön som nyexaminerad civilingenjör 2025?",
    author: "TechAnton",
    authorInitials: "TA",
    authorRole: "Civilingenjörsstudent",
    category: "salary",
    content: "Pluggar sista terminen på civilingenjör datateknik på KTH. Har börjat söka jobb och undrar vad som är rimligt att förvänta sig lönemässigt. Hört allt från 35k till 45k — vad stämmer?",
    votes: 189,
    replies: 93,
    views: 4210,
    timeAgo: "5 timmar sedan",
    isHot: true,
    tags: ["lön", "civilingenjör", "nyexaminerad"],
    lastReplyBy: "HRSara",
    lastReplyTime: "28 min sedan",
  },
  {
    id: "3",
    title: "Fick drömjobbet efter tredje intervjun — mina bästa tips",
    author: "LinaM",
    authorInitials: "LM",
    authorRole: "Projektledare",
    category: "interview",
    content: "Jag har äntligen fått jobbet jag drömt om! Ville dela med mig av mina bästa intervjutips som verkligen gjorde skillnad. Det handlar mycket om förberedelse och att våga vara personlig.",
    votes: 312,
    replies: 45,
    views: 3150,
    timeAgo: "8 timmar sedan",
    isPinned: true,
    tags: ["intervju", "tips", "framgång"],
    lastReplyBy: "KarrärCoach",
    lastReplyTime: "1 timme sedan",
  },
  {
    id: "4",
    title: "Är det värt att lägga till hobbyer i CV:t?",
    author: "OskarP",
    authorInitials: "OP",
    authorRole: "Ekonomistudent",
    category: "cv",
    content: "Jag har hört blandade åsikter. Vissa säger att det visar personlighet, andra säger att det tar plats från viktigare saker. Vad tycker ni — bör hobbyer inkluderas eller skipas?",
    votes: 78,
    replies: 56,
    views: 1920,
    timeAgo: "12 timmar sedan",
    tags: ["CV", "tips", "diskussion"],
    lastReplyBy: "CVExperten",
    lastReplyTime: "2 timmar sedan",
  },
  {
    id: "5",
    title: "Toxic arbetsplats — när är det dags att dra?",
    author: "AnonymAnvändare",
    authorInitials: "AA",
    authorRole: "Anonym",
    category: "workplace",
    content: "Har jobbat på samma ställe i 3 år. Chefen micromanagar, kollegor baktalas och det är noll uppskattning. Men lönen är bra och jag gillar mina arbetsuppgifter. Hur vet man när det är dags?",
    votes: 456,
    replies: 128,
    views: 6730,
    timeAgo: "1 dag sedan",
    isHot: true,
    tags: ["arbetsmiljö", "råd", "karriärval"],
    lastReplyBy: "PsykologPer",
    lastReplyTime: "45 min sedan",
  },
  {
    id: "6",
    title: "Remote vs kontor — vad föredrar ni och varför?",
    author: "FreelanceFreda",
    authorInitials: "FF",
    authorRole: "Frilansare",
    category: "workplace",
    content: "Har jobbat remote i 2 år nu och funderar på att gå tillbaka till kontor. Saknar den sociala biten men älskar friheten. Nyfiken på vad andra tycker — hybrid kanske är svaret?",
    votes: 145,
    replies: 82,
    views: 2480,
    timeAgo: "1 dag sedan",
    tags: ["remote", "kontor", "arbetsliv"],
    lastReplyBy: "HybridHenrik",
    lastReplyTime: "3 timmar sedan",
  },
  {
    id: "7",
    title: "Löneförhandling: begärde 8k mer och fick det — min strategi",
    author: "NegotiatorNiklas",
    authorInitials: "NN",
    authorRole: "Systemutvecklare",
    category: "salary",
    content: "Många är rädda för att förhandla lön, men det behöver inte vara svårt. Jag delar min exakta strategi som gav mig 8000kr mer i månadslön vid senaste utvecklingssamtalet.",
    votes: 521,
    replies: 74,
    views: 5890,
    timeAgo: "2 dagar sedan",
    isHot: true,
    tags: ["lön", "förhandling", "strategi"],
    lastReplyBy: "LöneRådgivaren",
    lastReplyTime: "5 timmar sedan",
  },
  {
    id: "8",
    title: "Bästa bootcamps för att lära sig programmering 2025?",
    author: "KodKarin",
    authorInitials: "KK",
    authorRole: "Karriärväxlare",
    category: "career",
    content: "Vill sadla om till webbutveckling. Finns det någon som gått en bootcamp och kan rekommendera? Tittar på Salt, Technigo och School of Applied Technology. Budget ca 50-80k.",
    votes: 97,
    replies: 43,
    views: 1650,
    timeAgo: "2 dagar sedan",
    tags: ["bootcamp", "programmering", "utbildning"],
    lastReplyBy: "DevDavid",
    lastReplyTime: "8 timmar sedan",
  },
];

const sortOptions = [
  { id: "hot", label: "Populärt", icon: <Flame className="w-3.5 h-3.5" /> },
  { id: "new", label: "Nyast", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "top", label: "Topplista", icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Threads = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down" | null>>({});
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());

  const filteredThreads = threads.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === "hot") return b.votes + b.replies * 2 - (a.votes + a.replies * 2);
    if (sortBy === "new") return 0;
    if (sortBy === "top") return b.votes - a.votes;
    return 0;
  });

  const handleVote = (threadId: string, direction: "up" | "down") => {
    setVotedThreads((prev) => ({
      ...prev,
      [threadId]: prev[threadId] === direction ? null : direction,
    }));
  };

  const toggleSave = (threadId: string) => {
    setSavedThreads((prev) => {
      const next = new Set(prev);
      next.has(threadId) ? next.delete(threadId) : next.add(threadId);
      return next;
    });
  };

  const getVoteCount = (thread: Thread) => {
    const vote = votedThreads[thread.id];
    if (vote === "up") return thread.votes + 1;
    if (vote === "down") return thread.votes - 1;
    return thread.votes;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
            <span className="hidden sm:block text-border">|</span>
            <span className="hidden sm:block text-sm font-medium text-muted-foreground">Trådar</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/jobb" className="hover:text-foreground transition-colors">Jobb</Link>
            <Link to="/tradar" className="text-foreground transition-colors">Trådar</Link>
            <a href="#" className="hover:text-foreground transition-colors">Karriärguide</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm font-medium hidden sm:inline-flex">Logga in</Button>
            <Button className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              Kom igång
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden border-b border-border"
        >
          {/* Subtle decorative bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.06]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border">
                    {threads.length} aktiva trådar
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground"
                >
                  Karriärtrådar
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-2 text-muted-foreground max-w-lg"
                >
                  Diskutera karriärfrågor, dela erfarenheter och få råd från andra yrkesverksamma.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Skapa ny tråd
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:w-64 shrink-0"
            >
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Sök i trådar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border"
                />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
                  Kategorier
                </p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                      selectedCategory === cat.id
                        ? "bg-primary/10 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color} transition-colors`}>
                        {cat.icon}
                      </span>
                      {cat.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Sidebar stats */}
              <div className="mt-8 p-4 rounded-2xl bg-card border border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Community
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Medlemmar</span>
                    <span className="font-semibold text-foreground">12 438</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Online nu</span>
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      347
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trådar idag</span>
                    <span className="font-semibold text-foreground">23</span>
                  </div>
                </div>
              </div>

              {/* Rules card */}
              <div className="mt-4 p-4 rounded-2xl bg-card border border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Forumregler
                </p>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Var respektfull mot andra</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Håll dig till ämnet</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Ingen spam eller reklam</li>
                  <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Dela gärna erfarenheter</li>
                </ol>
              </div>
            </motion.aside>

            {/* Thread list */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                        sortBy === opt.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {sortedThreads.length} trådar
                </span>
              </motion.div>

              {/* Threads */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {sortedThreads.map((thread, i) => (
                    <motion.article
                      key={thread.id}
                      layout
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      custom={i}
                      className={`group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer ${
                        thread.isPinned ? "ring-1 ring-primary/20" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Vote column */}
                        <div className="hidden sm:flex flex-col items-center gap-0.5 pt-1">
                          <button
                            onClick={() => handleVote(thread.id, "up")}
                            className={`p-1 rounded-lg transition-colors ${
                              votedThreads[thread.id] === "up"
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                            }`}
                          >
                            <ChevronUp className="w-5 h-5" />
                          </button>
                          <span className={`text-sm font-bold tabular-nums ${
                            votedThreads[thread.id] === "up" ? "text-primary" :
                            votedThreads[thread.id] === "down" ? "text-destructive" : "text-foreground"
                          }`}>
                            {getVoteCount(thread)}
                          </span>
                          <button
                            onClick={() => handleVote(thread.id, "down")}
                            className={`p-1 rounded-lg transition-colors ${
                              votedThreads[thread.id] === "down"
                                ? "text-destructive bg-destructive/10"
                                : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {thread.isPinned && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                <Pin className="w-3 h-3" /> Fäst
                              </span>
                            )}
                            {thread.isHot && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                <Flame className="w-3 h-3" /> Populär
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {categories.find((c) => c.id === thread.category)?.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors mb-2">
                            {thread.title}
                          </h3>

                          {/* Preview text */}
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                            {thread.content}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {thread.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                    {thread.authorInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-foreground">{thread.author}</span>
                                <span className="text-xs text-muted-foreground">·</span>
                                <span className="text-xs text-muted-foreground">{thread.timeAgo}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {thread.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {thread.views.toLocaleString("sv-SE")}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
                                className={`p-1 rounded-lg transition-colors ${
                                  savedThreads.has(thread.id) ? "text-primary" : "hover:text-primary"
                                }`}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
                              </button>
                            </div>
                          </div>

                          {/* Last reply indicator */}
                          {thread.lastReplyBy && (
                            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                              <MessageCircle className="w-3 h-3" />
                              <span>
                                Senaste svar av <span className="font-medium text-foreground">{thread.lastReplyBy}</span> · {thread.lastReplyTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load more */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <Button variant="outline" className="px-8 border-border text-muted-foreground hover:text-foreground">
                  Ladda fler trådar
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Threads;
