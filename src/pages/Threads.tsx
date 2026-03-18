import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, Search, ArrowLeft, Bookmark, Reply, Share2,
  Send, Shield, Zap, Crown, ThumbsUp, Plus, TrendingUp,
  Users, Clock, Award, Briefcase, GraduationCap, Building2,
  DollarSign, Lightbulb, Heart, ChevronRight, X, Handshake,
  Scale, Globe, Code, Stethoscope, Palette, BarChart3, Rocket,
  BookOpen, UserCheck, Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

interface ReplyData {
  id: string;
  author: string;
  authorInitials: string;
  authorBadge?: string;
  content: string;
  likes: number;
  timeAgo: string;
  isOP?: boolean;
}

interface Thread {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  authorRole: string;
  authorBadge?: "mod" | "verified" | "top";
  category: string;
  content: string;
  likes: number;
  replies: number;
  views: number;
  timeAgo: string;
  isPinned?: boolean;
  tags: string[];
  industry?: string;
  experienceLevel?: string;
  replyData?: ReplyData[];
}

/* ─── Category system ─── */
interface CategoryDef {
  label: string;
  description: string;
  icon: typeof Briefcase;
  group: string;
}

const categoryGroups: Record<string, { label: string; icon: typeof Briefcase }> = {
  karriar: { label: "Karriär & Utveckling", icon: Rocket },
  lon: { label: "Lön & Förmåner", icon: DollarSign },
  jobbsok: { label: "Jobbsökning", icon: Search },
  arbetsliv: { label: "Arbetsliv", icon: Building2 },
  bransch: { label: "Bransch", icon: Globe },
};

const categories: Record<string, CategoryDef> = {
  career: { label: "Karriär", description: "Karriärvägar, befordringar och professionell utveckling", icon: Briefcase, group: "karriar" },
  career_switch: { label: "Karriärväxling", description: "Byta bransch, omskolning och nya vägar", icon: Rocket, group: "karriar" },
  education: { label: "Utbildning", description: "Kurser, certifikat och vidareutbildning", icon: BookOpen, group: "karriar" },
  mentorship: { label: "Mentorskap", description: "Hitta mentorer och dela kunskap", icon: UserCheck, group: "karriar" },
  salary: { label: "Lön", description: "Lönestatistik, jämförelser och förväntningar", icon: DollarSign, group: "lon" },
  benefits: { label: "Förmåner", description: "Personalförmåner, pension och försäkringar", icon: Handshake, group: "lon" },
  negotiation: { label: "Förhandling", description: "Löneförhandling och strategier", icon: Scale, group: "lon" },
  interview: { label: "Intervju", description: "Intervjutips, förberedelser och erfarenheter", icon: Lightbulb, group: "jobbsok" },
  cv: { label: "CV & Profil", description: "CV-granskning, LinkedIn och personligt varumärke", icon: GraduationCap, group: "jobbsok" },
  networking: { label: "Nätverk", description: "Professionellt nätverkande och kontakter", icon: Users, group: "jobbsok" },
  workplace: { label: "Arbetsmiljö", description: "Arbetsplatskultur, konflikter och trivsel", icon: Building2, group: "arbetsliv" },
  leadership: { label: "Ledarskap", description: "Chefsskap, teamledning och management", icon: Crown, group: "arbetsliv" },
  remote: { label: "Remote & Hybrid", description: "Distansarbete, hybridlösningar och hemmakontor", icon: Globe, group: "arbetsliv" },
  tech: { label: "Tech & IT", description: "Teknikbranschen, programmering och digitalisering", icon: Code, group: "bransch" },
  healthcare: { label: "Vård & Hälsa", description: "Sjukvård, omsorg och hälsobranschen", icon: Stethoscope, group: "bransch" },
  creative: { label: "Kreativt", description: "Design, media, kommunikation och kultur", icon: Palette, group: "bransch" },
  finance: { label: "Ekonomi", description: "Bank, finans, revision och ekonomijobb", icon: BarChart3, group: "bransch" },
};

/* ─── Thread data ─── */
const threads: Thread[] = [
  {
    id: "1",
    title: "Bytte från lärare till UX-designer — så här gick jag tillväga",
    author: "EmmaK",
    authorInitials: "EK",
    authorRole: "UX Designer @ Spotify",
    authorBadge: "verified",
    category: "career",
    content: "Efter 8 år som mellanstadielärare kände jag att jag behövde en förändring. Började med onlinekurser på kvällar och helger, byggde en portfolio parallellt med jobbet och fick till slut min första UX-roll. AMA!",
    likes: 234,
    replies: 67,
    views: 2841,
    timeAgo: "3h",
    isPinned: true,
    tags: ["karriärväxling", "UX"],
    industry: "Tech",
    experienceLevel: "Mid-level",
  },
  {
    id: "2",
    title: "Vad är rimlig ingångslön som nyexaminerad civilingenjör 2025?",
    author: "TechAnton",
    authorInitials: "TA",
    authorRole: "Student — KTH",
    category: "salary",
    content: "Pluggar sista terminen på civilingenjör datateknik på KTH. Har börjat söka jobb och undrar vad som är rimligt att förvänta sig lönemässigt.",
    likes: 189,
    replies: 93,
    views: 4210,
    timeAgo: "5h",
    tags: ["lön", "civilingenjör"],
    industry: "Tech",
    experienceLevel: "Junior",
  },
  {
    id: "3",
    title: "Fick drömjobbet efter tredje intervjun — mina bästa tips",
    author: "LinaM",
    authorInitials: "LM",
    authorRole: "Projektledare @ Volvo",
    authorBadge: "top",
    category: "interview",
    content: "Jag har äntligen fått jobbet jag drömt om! Ville dela med mig av mina bästa intervjutips som verkligen gjorde skillnad.",
    likes: 312,
    replies: 45,
    views: 3150,
    timeAgo: "8h",
    isPinned: true,
    tags: ["intervju", "tips"],
    industry: "Fordon",
    experienceLevel: "Senior",
  },
  {
    id: "4",
    title: "Är det värt att lägga till hobbyer i CV:t?",
    author: "OskarP",
    authorInitials: "OP",
    authorRole: "Student",
    category: "cv",
    content: "Jag har hört blandade åsikter. Vissa säger att det visar personlighet, andra säger att det tar plats från viktigare saker.",
    likes: 78,
    replies: 56,
    views: 1920,
    timeAgo: "12h",
    tags: ["CV", "diskussion"],
    experienceLevel: "Junior",
  },
  {
    id: "5",
    title: "Toxic arbetsplats — när är det dags att dra?",
    author: "AnonymAnvändare",
    authorInitials: "AA",
    authorRole: "Anonym",
    category: "workplace",
    content: "Har jobbat på samma ställe i 3 år. Chefen micromanagar, kollegor baktalas och det är noll uppskattning. Men lönen är bra och jag gillar mina arbetsuppgifter. Hur vet man när det är dags?\n\nJag tjänar bra — runt 45k — och arbetsuppgifterna i sig är roliga. Men stämningen är helt åt helvete. Chefen kollar exakt när vi kommer och går, skickar passiv-aggressiva mail cc:ade till hela teamet.\n\nHar någon annan varit i en liknande sits?",
    likes: 456,
    replies: 128,
    views: 6730,
    timeAgo: "1d",
    tags: ["arbetsmiljö", "karriärval"],
    industry: "Konsult",
    experienceLevel: "Mid-level",
    replyData: [
      {
        id: "r1",
        author: "PsykologPer",
        authorInitials: "PP",
        authorBadge: "verified",
        content: "Som psykolog ser jag det här mönstret ofta. Söndagsångest, passiv-aggressiv kommunikation, övervakning — klassiska tecken på en toxisk miljö.\n\nMin tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka.",
        likes: 234,
        timeAgo: "45 min",
      },
      {
        id: "r2",
        author: "VarDärSjälv",
        authorInitials: "VS",
        content: "Jag var i exakt samma sits för 2 år sedan. Stannade alldeles för länge pga lönen. Till slut blev jag sjukskriven i 3 månader.\n\nBytte jobb, gick ner 3k i lön men det var ABSOLUT värt det.",
        likes: 189,
        timeAgo: "2h",
      },
      {
        id: "r3",
        author: "AnonymAnvändare",
        authorInitials: "AA",
        content: "Tack för alla svar! Det bekräftar vad jag redan kände innerst inne. Ska börja söka direkt. Hur hanterade ni uppsägningen?",
        likes: 67,
        timeAgo: "1h",
        isOP: true,
      },
      {
        id: "r4",
        author: "HRSara",
        authorInitials: "HS",
        authorBadge: "verified",
        content: "HR-perspektiv: Var diplomatisk. 'Jag har fått ett erbjudande jag inte kan tacka nej till' räcker gott. Dokumentera allt som händer ifall du behöver det senare.",
        likes: 145,
        timeAgo: "50 min",
      },
      {
        id: "r5",
        author: "DevJohan",
        authorInitials: "DJ",
        content: "Hot take: ibland är det bättre att prata med chefen först. Jag hade en toxic chef men det visade sig att hen inte ens var medveten om sitt beteende. Men om det inte funkar — spring. 🏃‍♂️",
        likes: 56,
        timeAgo: "30 min",
      },
    ],
  },
  {
    id: "6",
    title: "Remote vs kontor — vad föredrar ni och varför?",
    author: "FreelanceFreda",
    authorInitials: "FF",
    authorRole: "Frilansare",
    authorBadge: "top",
    category: "workplace",
    content: "Har jobbat remote i 2 år nu och funderar på att gå tillbaka till kontor. Saknar den sociala biten men älskar friheten.",
    likes: 145,
    replies: 82,
    views: 2480,
    timeAgo: "1d",
    tags: ["remote", "kontor"],
    industry: "Tech",
    experienceLevel: "Senior",
  },
  {
    id: "7",
    title: "Löneförhandling: begärde 8k mer och fick det",
    author: "NegotiatorNiklas",
    authorInitials: "NN",
    authorRole: "Systemutvecklare @ H&M",
    authorBadge: "verified",
    category: "salary",
    content: "Många är rädda för att förhandla lön. Jag delar min exakta strategi som gav mig 8000kr mer i månadslön.",
    likes: 521,
    replies: 74,
    views: 5890,
    timeAgo: "2d",
    tags: ["lön", "förhandling"],
    industry: "Retail Tech",
    experienceLevel: "Senior",
  },
  {
    id: "8",
    title: "Bästa bootcamps för programmering 2025?",
    author: "KodKarin",
    authorInitials: "KK",
    authorRole: "Karriärväxlare",
    category: "career",
    content: "Vill sadla om till webbutveckling. Någon som gått en bootcamp och kan rekommendera? Tittar på Salt, Technigo och School of Applied Technology.",
    likes: 97,
    replies: 43,
    views: 1650,
    timeAgo: "2d",
    tags: ["bootcamp", "programmering"],
    experienceLevel: "Junior",
  },
];

/* ─── Helpers ─── */
const getCategoryStats = (catId: string) => {
  const catThreads = threads.filter((t) => t.category === catId);
  const totalReplies = catThreads.reduce((sum, t) => sum + t.replies, 0);
  const latestThread = catThreads.sort((a, b) => {
    // Simple sort by timeAgo (approximate)
    const timeVal = (t: string) => {
      if (t.includes("min")) return parseInt(t);
      if (t.includes("h")) return parseInt(t) * 60;
      if (t.includes("d")) return parseInt(t) * 1440;
      return 9999;
    };
    return timeVal(a.timeAgo) - timeVal(b.timeAgo);
  })[0];
  return { threadCount: catThreads.length, replyCount: totalReplies, latestThread };
};

/* ─── Badge ─── */
const AuthorBadge = ({ type }: { type?: string }) => {
  if (!type) return null;
  if (type === "verified") return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
      <Shield className="w-2.5 h-2.5" /> Verifierad
    </span>
  );
  if (type === "mod") return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
      <Crown className="w-2.5 h-2.5" /> Mod
    </span>
  );
  if (type === "top") return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
      <Zap className="w-2.5 h-2.5" /> Top Contributor
    </span>
  );
  return null;
};

/* ═══════════════════════════════════════════════
   CATEGORY OVERVIEW — Flashback-style landing
   ═══════════════════════════════════════════════ */
const CategoryOverview = ({
  onSelectCategory,
  searchQuery,
  setSearchQuery,
}: {
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => {
  const grouped = Object.entries(categoryGroups).map(([groupId, group]) => ({
    ...group,
    groupId,
    items: Object.entries(categories).filter(([, cat]) => cat.group === groupId),
  }));

  // Filter categories by search
  const filteredGrouped = searchQuery
    ? grouped.map((g) => ({
        ...g,
        items: g.items.filter(
          ([, cat]) =>
            cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((g) => g.items.length > 0)
    : grouped;

  // Overall stats
  const totalThreads = threads.length;
  const totalReplies = threads.reduce((s, t) => s + t.replies, 0);

  return (
    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Forum</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Utforska kategorier, hitta rätt diskussion och delta i samtalen
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            {totalThreads} trådar
          </span>
          <span className="flex items-center gap-1.5">
            <Reply className="w-3.5 h-3.5 text-primary" />
            {totalReplies} svar
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            12,4k medlemmar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            347 online
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Sök kategorier och diskussioner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-card border-border text-sm rounded-xl"
        />
      </div>

      {/* Category groups */}
      <div className="space-y-6">
        {filteredGrouped.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.groupId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05, duration: 0.25 }}
            >
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                  <GroupIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <h2 className="font-serif text-base font-semibold text-foreground">{group.label}</h2>
              </div>

              {/* Category rows */}
              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {group.items.map(([catId, cat]) => {
                  const stats = getCategoryStats(catId);
                  const CatIcon = cat.icon;
                  const latest = stats.latestThread;

                  return (
                    <button
                      key={catId}
                      onClick={() => onSelectCategory(catId)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left group"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0 group-hover:bg-primary/10 transition-colors">
                        <CatIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground/60">
                            {stats.threadCount} trådar · {stats.replyCount} svar
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>

                      {/* Latest thread preview */}
                      {latest && (
                        <div className="hidden sm:flex items-center gap-3 shrink-0 max-w-[280px]">
                          <div className="text-right min-w-0">
                            <p className="text-xs text-foreground font-medium line-clamp-1">
                              {latest.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              av {latest.author} · {latest.timeAgo} sedan
                            </p>
                          </div>
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                              {latest.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-primary/60 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredGrouped.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Inga kategorier matchade din sökning</p>
        </div>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   CATEGORY THREAD LIST — threads within a category
   ═══════════════════════════════════════════════ */
const ThreadCard = ({
  thread,
  index,
  likedThreads,
  savedThreads,
  toggleLike,
  toggleSave,
  onClick,
}: {
  thread: Thread;
  index: number;
  likedThreads: Set<string>;
  savedThreads: Set<string>;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  onClick: () => void;
}) => {
  const cat = categories[thread.category];
  const isLiked = likedThreads.has(thread.id);
  const likeCount = thread.likes + (isLiked ? 1 : 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className={`group bg-card rounded-xl border border-border transition-all hover:border-primary/20 hover:shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.08)] ${
        thread.replyData ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="p-4 sm:p-5">
        {/* Author row */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-9 h-9 ring-2 ring-background shadow-sm shrink-0">
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {thread.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{thread.author}</span>
              <AuthorBadge type={thread.authorBadge} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <span>{thread.authorRole}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{thread.timeAgo} sedan</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              savedThreads.has(thread.id)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {thread.industry && (
            <span className="text-[11px] text-muted-foreground/70 bg-muted/60 px-2 py-0.5 rounded-md">
              {thread.industry}
            </span>
          )}
          {thread.experienceLevel && (
            <span className="text-[11px] text-muted-foreground/70 bg-muted/60 px-2 py-0.5 rounded-md">
              {thread.experienceLevel}
            </span>
          )}
          {thread.isPinned && (
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Pin className="w-2.5 h-2.5" /> Fäst
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-1.5">
          {thread.title}
        </h3>

        {/* Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {thread.content}
        </p>

        {/* Engagement bar */}
        <div className="flex items-center gap-0.5 text-xs text-muted-foreground pt-3 border-t border-border/60">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(thread.id); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              isLiked
                ? "text-primary bg-primary/10"
                : "hover:bg-muted hover:text-foreground"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-primary" : ""}`} />
            {likeCount}
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {thread.replies} svar
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground/60">
            <Eye className="w-3.5 h-3.5" />
            {thread.views.toLocaleString("sv-SE")}
          </span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors font-medium ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dela</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Detail View ─── */
const ThreadDetail = ({
  thread,
  onBack,
  likedThreads,
  toggleLike,
}: {
  thread: Thread;
  onBack: () => void;
  likedThreads: Set<string>;
  toggleLike: (id: string) => void;
}) => {
  const [replyLikes, setReplyLikes] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const cat = categories[thread.category];
  const CatIcon = cat?.icon || Briefcase;
  const isLiked = likedThreads.has(thread.id);
  const likeCount = thread.likes + (isLiked ? 1 : 0);

  const toggleReplyLike = (id: string) => {
    setReplyLikes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka till {cat?.label || "trådar"}
      </button>

      {/* Main post */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
              {thread.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{thread.author}</span>
              <AuthorBadge type={thread.authorBadge} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <span>{thread.authorRole}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{thread.timeAgo} sedan</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            <CatIcon className="w-3 h-3" /> {cat?.label}
          </span>
          {thread.industry && (
            <span className="text-[11px] text-muted-foreground/70 bg-muted/60 px-2 py-0.5 rounded-md">{thread.industry}</span>
          )}
          {thread.experienceLevel && (
            <span className="text-[11px] text-muted-foreground/70 bg-muted/60 px-2 py-0.5 rounded-md">{thread.experienceLevel}</span>
          )}
        </div>

        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-foreground leading-tight mb-4">
          {thread.title}
        </h1>

        <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-5">
          {thread.content}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {thread.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-0.5 pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <button
            onClick={() => toggleLike(thread.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              isLiked ? "text-primary bg-primary/10" : "hover:bg-muted hover:text-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`} />
            {likeCount}
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 font-medium">
            <MessageSquare className="w-4 h-4" /> {thread.replies} svar
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground/60">
            <Eye className="w-4 h-4" /> {thread.views.toLocaleString("sv-SE")}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors ml-auto font-medium">
            <Share2 className="w-4 h-4" /> Dela
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors font-medium">
            <Bookmark className="w-4 h-4" /> Spara
          </button>
        </div>
      </div>

      {/* Reply composer */}
      <div className="mt-4 bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">G</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">Svara som <span className="font-medium text-foreground">Gäst</span></span>
        </div>
        <Textarea
          placeholder="Dela din erfarenhet eller ge råd..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="min-h-[80px] bg-background border-border resize-none mb-3 text-sm rounded-lg"
        />
        <div className="flex justify-end">
          <Button size="sm" className="gap-2 px-5">
            <Send className="w-3.5 h-3.5" /> Svara
          </Button>
        </div>
      </div>

      {/* Replies */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-foreground">{thread.replies} svar</p>

        {thread.replyData?.map((reply, i) => {
          const isReplyLiked = replyLikes.has(reply.id);
          const replyLikeCount = reply.likes + (isReplyLiked ? 1 : 0);

          return (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className={`bg-card border rounded-xl p-4 ${
                reply.isOP ? "border-primary/20 bg-primary/[0.02]" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                    {reply.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">{reply.author}</span>
                  <AuthorBadge type={reply.authorBadge} />
                  {reply.isOP && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">OP</span>
                  )}
                  <span className="text-xs text-muted-foreground">{reply.timeAgo} sedan</span>
                </div>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-3 pl-10">
                {reply.content}
              </p>
              <div className="flex items-center gap-0.5 text-xs text-muted-foreground pl-10">
                <button
                  onClick={() => toggleReplyLike(reply.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
                    isReplyLiked ? "text-primary bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isReplyLiked ? "fill-primary" : ""}`} />
                  {replyLikeCount}
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-muted transition-colors font-medium">
                  <Reply className="w-3 h-3" /> Svara
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ─── Sidebar ─── */
const CommunitySidebar = () => (
  <div className="hidden lg:block w-72 shrink-0 space-y-4">
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="h-2 bg-primary" />
      <div className="p-5">
        <h3 className="font-serif text-base font-semibold text-foreground">Karriär-communityn</h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Diskutera karriärfrågor, dela erfarenheter och få råd av verifierade yrkespersoner.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 12,4k medlemmar</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> 347 online
          </span>
        </div>
        <Button size="sm" className="w-full mt-4 gap-2">
          <Plus className="w-3.5 h-3.5" /> Starta diskussion
        </Button>
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
        Populära ämnen
      </h4>
      <div className="space-y-2">
        {[
          { tag: "löneförhandling", count: "2,1k inlägg" },
          { tag: "karriärväxling", count: "1,8k inlägg" },
          { tag: "remote", count: "1,2k inlägg" },
          { tag: "intervjutips", count: "980 inlägg" },
          { tag: "bootcamp", count: "640 inlägg" },
        ].map((t) => (
          <button key={t.tag} className="w-full flex items-center justify-between text-xs py-1.5 group">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              #{t.tag}
            </span>
            <span className="text-muted-foreground/50">{t.count}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
        Community-riktlinjer
      </h4>
      <ol className="space-y-2 text-xs text-muted-foreground">
        <li className="flex gap-2"><span className="text-primary font-bold">1.</span>Var professionell och respektfull</li>
        <li className="flex gap-2"><span className="text-primary font-bold">2.</span>Dela konkreta erfarenheter</li>
        <li className="flex gap-2"><span className="text-primary font-bold">3.</span>Respektera andras anonymitet</li>
        <li className="flex gap-2"><span className="text-primary font-bold">4.</span>Ingen spam eller rekrytering</li>
      </ol>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE — three-level navigation:
   1. Category overview (landing)
   2. Category thread list
   3. Thread detail
   ═══════════════════════════════════════════════ */
const Threads = () => {
  const [view, setView] = useState<"overview" | "category" | "detail">("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedThreads, setLikedThreads] = useState<Set<string>>(new Set());
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedThreads((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSave = (id: string) => {
    setSavedThreads((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setView("category");
    setSearchQuery("");
  };

  const handleOpenThread = (threadId: string) => {
    setActiveThread(threadId);
    setView("detail");
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleBackToCategory = () => {
    setView("category");
    setActiveThread(null);
  };

  // Filtered threads for current category
  const categoryThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : [];

  const sortedCategoryThreads = [...categoryThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === "popular") return (b.likes + b.replies * 2) - (a.likes + a.replies * 2);
    if (sortBy === "top") return b.likes - a.likes;
    return 0;
  });

  const activeThreadData = activeThread ? threads.find((t) => t.id === activeThread) : null;
  const selectedCatData = selectedCategory ? categories[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-lg font-semibold text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
            <div className="hidden sm:flex h-5 w-px bg-border" />
            <button
              onClick={handleBackToOverview}
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Forum
            </button>
            {view !== "overview" && selectedCatData && (
              <>
                <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-muted-foreground/40" />
                <button
                  onClick={() => { setView("category"); setActiveThread(null); }}
                  className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectedCatData.label}
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-9">Logga in</Button>
            <Button size="sm" className="text-xs h-9 px-5">Kom igång</Button>
          </div>
        </div>
      </nav>

      <div className="pt-14 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex gap-6 py-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {view === "detail" && activeThreadData ? (
                <ThreadDetail
                  key="detail"
                  thread={activeThreadData}
                  onBack={handleBackToCategory}
                  likedThreads={likedThreads}
                  toggleLike={toggleLike}
                />
              ) : view === "category" && selectedCatData ? (
                <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Category header */}
                  <button
                    onClick={handleBackToOverview}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Alla kategorier
                  </button>

                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      {React.createElement(selectedCatData.icon, { className: "w-5 h-5 text-primary" })}
                    </div>
                    <div>
                      <h1 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                        {selectedCatData.label}
                      </h1>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedCatData.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 mb-5 text-xs text-muted-foreground">
                    <span>{categoryThreads.length} trådar</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span>{categoryThreads.reduce((s, t) => s + t.replies, 0)} svar</span>
                  </div>

                  {/* Sort controls */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-0.5">
                      {[
                        { id: "popular", label: "Populärt", icon: TrendingUp },
                        { id: "new", label: "Nytt", icon: Clock },
                        { id: "top", label: "Topp", icon: Award },
                      ].map((s) => {
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setSortBy(s.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              sortBy === s.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                    <Button size="sm" className="ml-auto gap-2 text-xs h-8 px-4">
                      <Plus className="w-3.5 h-3.5" /> Ny tråd
                    </Button>
                  </div>

                  {/* Thread list */}
                  <div className="space-y-3">
                    {sortedCategoryThreads.map((thread, i) => (
                      <ThreadCard
                        key={thread.id}
                        thread={thread}
                        index={i}
                        likedThreads={likedThreads}
                        savedThreads={savedThreads}
                        toggleLike={toggleLike}
                        toggleSave={toggleSave}
                        onClick={() => handleOpenThread(thread.id)}
                      />
                    ))}
                  </div>

                  {sortedCategoryThreads.length === 0 && (
                    <div className="text-center py-16 bg-card border border-border rounded-xl">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">Inga trådar i denna kategori ännu</p>
                      <Button size="sm" className="mt-4 gap-2 text-xs">
                        <Plus className="w-3.5 h-3.5" /> Starta den första diskussionen
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <CategoryOverview
                  key="overview"
                  onSelectCategory={handleSelectCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar — show on overview and category views */}
          {view !== "detail" && <CommunitySidebar />}
        </div>
      </div>
    </div>
  );
};

export default Threads;
