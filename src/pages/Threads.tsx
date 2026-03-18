import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, Search, ArrowLeft, Bookmark, Reply, Share2,
  Send, Shield, Zap, Crown, ThumbsUp, Plus, TrendingUp,
  Users, Clock, Award, Briefcase, GraduationCap, Building2,
  DollarSign, Lightbulb, Heart, ChevronRight, X, Handshake,
  Scale, Globe, Code, Stethoscope, Palette, BarChart3, Rocket,
  BookOpen, UserCheck, Pin, PanelLeftClose, PanelLeftOpen, ChevronDown,
  Menu, MessageCircleQuestion, EyeIcon, Quote, CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface ReplyData {
  id: string;
  author: string;
  authorInitials: string;
  authorBadge?: string;
  content: string;
  likes: number;
  timeAgo: string;
  isOP?: boolean;
  parentId?: string;
  quotedReply?: { author: string; content: string };
  children?: ReplyData[];
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
const initialThreads: Thread[] = [
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
        children: [
          {
            id: "r1-1",
            author: "AnonymAnvändare",
            authorInitials: "AA",
            content: "Tack för det professionella perspektivet! Söndagsångesten är verklig — har du tips på hur man hanterar den kortsiktigt medan man söker nytt?",
            likes: 45,
            timeAgo: "30 min",
            isOP: true,
            parentId: "r1",
            quotedReply: { author: "PsykologPer", content: "Min tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka." },
          },
          {
            id: "r1-2",
            author: "PsykologPer",
            authorInitials: "PP",
            authorBadge: "verified",
            content: "Absolut! Tre saker som hjälper direkt:\n1. Sätt gränser — sluta kolla jobbmail efter kl 17\n2. Fysisk aktivitet söndag eftermiddag\n3. Skriv ner vad du oroar dig för — det brukar vara mindre skrämmande på papper",
            likes: 89,
            timeAgo: "20 min",
            parentId: "r1-1",
            quotedReply: { author: "AnonymAnvändare", content: "har du tips på hur man hanterar den kortsiktigt medan man söker nytt?" },
          },
        ],
      },
      {
        id: "r2",
        author: "VarDärSjälv",
        authorInitials: "VS",
        content: "Jag var i exakt samma sits för 2 år sedan. Stannade alldeles för länge pga lönen. Till slut blev jag sjukskriven i 3 månader.\n\nBytte jobb, gick ner 3k i lön men det var ABSOLUT värt det.",
        likes: 189,
        timeAgo: "2h",
        children: [
          {
            id: "r2-1",
            author: "KarriärCoachMia",
            authorInitials: "KC",
            authorBadge: "verified",
            content: "Det här är tyvärr väldigt vanligt. Lönen blir en \"golden cage\". Bra att du tog steget! Hur lång tid tog det innan du kände skillnaden?",
            likes: 34,
            timeAgo: "1h 30min",
            parentId: "r2",
            quotedReply: { author: "VarDärSjälv", content: "Bytte jobb, gick ner 3k i lön men det var ABSOLUT värt det." },
          },
        ],
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
        quotedReply: { author: "AnonymAnvändare", content: "Hur hanterade ni uppsägningen?" },
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
const THREADS_PER_PAGE = 15;

const timeToMinutes = (t: string) => {
  if (t.includes("min")) return parseInt(t);
  if (t.includes("h")) return parseInt(t) * 60;
  if (t.includes("d")) return parseInt(t) * 1440;
  return 9999;
};

const getCategoryStats = (catId: string, threadList: Thread[]) => {
  const catThreads = threadList.filter((t) => t.category === catId);
  const totalReplies = catThreads.reduce((sum, t) => sum + t.replies, 0);
  const latestThread = [...catThreads].sort((a, b) => timeToMinutes(a.timeAgo) - timeToMinutes(b.timeAgo))[0];
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

/* ─── Sort options ─── */
const sortOptions = [
  { id: "popular", label: "Populärt", icon: TrendingUp },
  { id: "new", label: "Senaste", icon: Clock },
  { id: "top", label: "Topp", icon: Award },
  { id: "unanswered", label: "Obesvarade", icon: MessageCircleQuestion },
  { id: "views", label: "Mest visade", icon: EyeIcon },
] as const;

/* ═══════════════════════════════════════════════
   CATEGORY OVERVIEW
   ═══════════════════════════════════════════════ */
const CategoryOverview = ({
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  allThreads,
}: {
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  allThreads: Thread[];
}) => {
  const grouped = Object.entries(categoryGroups).map(([groupId, group]) => ({
    ...group,
    groupId,
    items: Object.entries(categories).filter(([, cat]) => cat.group === groupId),
  }));

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

  const totalThreads = allThreads.length;
  const totalReplies = allThreads.reduce((s, t) => s + t.replies, 0);

  return (
    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Sök kategorier och diskussioner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-card border-border text-sm rounded-xl"
        />
      </div>

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
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                  <GroupIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <h2 className="font-serif text-base font-semibold text-foreground">{group.label}</h2>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {group.items.map(([catId, cat]) => {
                  const stats = getCategoryStats(catId, allThreads);
                  const CatIcon = cat.icon;
                  const latest = stats.latestThread;

                  return (
                    <button
                      key={catId}
                      onClick={() => onSelectCategory(catId)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left group"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0 group-hover:bg-primary/10 transition-colors">
                        <CatIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
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
   COMPACT THREAD CARD — high-density, Flashback/Reddit-inspired
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
  const isLiked = likedThreads.has(thread.id);
  const likeCount = thread.likes + (isLiked ? 1 : 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className={`group bg-card border border-border rounded-lg transition-all hover:border-primary/20 hover:shadow-[0_1px_8px_-3px_hsl(var(--primary)/0.08)] ${
        thread.replyData ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-start gap-3">
        {/* Vote/like column */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(thread.id); }}
            className={`p-1 rounded transition-colors ${
              isLiked ? "text-primary" : "text-muted-foreground/50 hover:text-primary"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-primary" : ""}`} />
          </button>
          <span className={`text-xs font-semibold tabular-nums ${isLiked ? "text-primary" : "text-muted-foreground"}`}>
            {likeCount}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            {thread.isPinned && (
              <Pin className="w-3 h-3 text-primary shrink-0" />
            )}
            <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {thread.title}
            </h3>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground/70">{thread.author}</span>
            <AuthorBadge type={thread.authorBadge} />
            <span className="text-muted-foreground/30">·</span>
            <span>{thread.timeAgo} sedan</span>
            {thread.industry && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-muted-foreground/60">{thread.industry}</span>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {thread.replies}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {thread.views.toLocaleString("sv-SE")}
            </span>
            {thread.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-muted-foreground/50 bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">
                #{tag}
              </span>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
              className={`ml-auto p-1 rounded transition-colors ${
                savedThreads.has(thread.id)
                  ? "text-primary"
                  : "text-muted-foreground/30 hover:text-muted-foreground"
              }`}
            >
              <Bookmark className={`w-3 h-3 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Pagination ─── */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Föregående
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground/50">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
              p === currentPage
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Nästa
      </button>
    </div>
  );
};

/* ─── Single Reply Component (recursive for nesting) ─── */
const ReplyItem = ({
  reply,
  depth,
  replyLikes,
  toggleReplyLike,
  onQuoteReply,
}: {
  reply: ReplyData;
  depth: number;
  replyLikes: Set<string>;
  toggleReplyLike: (id: string) => void;
  onQuoteReply: (reply: ReplyData) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isReplyLiked = replyLikes.has(reply.id);
  const replyLikeCount = reply.likes + (isReplyLiked ? 1 : 0);
  const maxDepth = 4;
  const effectiveDepth = Math.min(depth, maxDepth);

  return (
    <div className={`${effectiveDepth > 0 ? "pl-4 sm:pl-6" : ""}`}>
      {/* Thread line for nested replies */}
      <div className={`relative ${effectiveDepth > 0 ? "border-l-2 border-border/40 pl-4" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`bg-card border rounded-xl p-4 ${
            reply.isOP ? "border-primary/20 bg-primary/[0.02]" : "border-border"
          }`}
        >
          {/* Author header */}
          <div className="flex items-start gap-3 mb-2">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {reply.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground">{reply.author}</span>
              <AuthorBadge type={reply.authorBadge} />
              {reply.isOP && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">OP</span>
              )}
              {depth > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <CornerDownRight className="w-2.5 h-2.5" /> svar
                </span>
              )}
              <span className="text-xs text-muted-foreground">{reply.timeAgo} sedan</span>
              {reply.children && reply.children.length > 0 && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {collapsed ? `+ ${reply.children.length} svar` : "Dölj svar"}
                </button>
              )}
            </div>
          </div>

          {/* Quoted content */}
          {reply.quotedReply && (
            <div className="ml-10 mb-3 border-l-3 border-primary/30 bg-muted/40 rounded-r-lg px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Quote className="w-3 h-3 text-primary/50" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {reply.quotedReply.author} skrev:
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 italic leading-relaxed line-clamp-3">
                {reply.quotedReply.content}
              </p>
            </div>
          )}

          {/* Reply content */}
          <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-3 pl-10">
            {reply.content}
          </p>

          {/* Actions */}
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
            <button
              onClick={() => onQuoteReply(reply)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Reply className="w-3 h-3" /> Svara
            </button>
            <button
              onClick={() => onQuoteReply(reply)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Quote className="w-3 h-3" /> Citera
            </button>
          </div>
        </motion.div>

        {/* Nested children */}
        {!collapsed && reply.children && reply.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {reply.children.map((child) => (
              <ReplyItem
                key={child.id}
                reply={child}
                depth={depth + 1}
                replyLikes={replyLikes}
                toggleReplyLike={toggleReplyLike}
                onQuoteReply={onQuoteReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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
  const [quotedReply, setQuotedReply] = useState<{ author: string; content: string } | null>(null);
  const replyRef = React.useRef<HTMLTextAreaElement>(null);
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

  const handleQuoteReply = (reply: ReplyData) => {
    const snippet = reply.content.length > 150
      ? reply.content.substring(0, 150) + "..."
      : reply.content;
    setQuotedReply({ author: reply.author, content: snippet });
    replyRef.current?.focus();
    replyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const clearQuote = () => setQuotedReply(null);

  // Count all replies including nested
  const countAllReplies = (replies: ReplyData[]): number => {
    return replies.reduce((sum, r) => sum + 1 + (r.children ? countAllReplies(r.children) : 0), 0);
  };
  const totalReplyCount = thread.replyData ? countAllReplies(thread.replyData) : thread.replies;

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
            <MessageSquare className="w-4 h-4" /> {totalReplyCount} svar
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

      {/* Reply input */}
      <div className="mt-4 bg-card border border-border rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">G</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">Svara som <span className="font-medium text-foreground">Gäst</span></span>
        </div>

        {/* Quote preview */}
        <AnimatePresence>
          {quotedReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="border-l-3 border-primary/40 bg-muted/50 rounded-r-lg px-3 py-2.5 flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                    Citerar {quotedReply.author}:
                  </span>
                  <p className="text-xs text-muted-foreground/80 italic line-clamp-2">
                    {quotedReply.content}
                  </p>
                </div>
                <button
                  onClick={clearQuote}
                  className="p-0.5 rounded hover:bg-muted-foreground/10 text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Textarea
          ref={replyRef}
          placeholder={quotedReply ? `Svara på ${quotedReply.author}s inlägg...` : "Dela din erfarenhet eller ge råd..."}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="min-h-[80px] bg-background border-border resize-none mb-3 text-sm rounded-lg"
        />
        <div className="flex justify-end">
          <Button size="sm" className="gap-2 px-5">
            <Send className="w-3.5 h-3.5" /> {quotedReply ? "Svara med citat" : "Svara"}
          </Button>
        </div>
      </div>

      {/* Replies — nested */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-foreground">{totalReplyCount} svar</p>
        {thread.replyData?.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            depth={0}
            replyLikes={replyLikes}
            toggleReplyLike={toggleReplyLike}
            onQuoteReply={handleQuoteReply}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Sidebar Content (reusable for desktop and mobile Sheet) ─── */
const SidebarContent = ({
  selectedCategory,
  onSelectCategory,
  onBackToOverview,
  view,
  onClose,
  allThreads,
  onNewThread,
}: {
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
  onBackToOverview: () => void;
  view: string;
  onClose?: () => void;
  allThreads: Thread[];
  onNewThread?: () => void;
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(Object.keys(categoryGroups))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  };

  const grouped = Object.entries(categoryGroups).map(([groupId, group]) => ({
    ...group,
    groupId,
    items: Object.entries(categories).filter(([, cat]) => cat.group === groupId),
  }));

  const handleSelectCategory = (catId: string) => {
    onSelectCategory(catId);
    onClose?.();
  };

  const handleBackToOverview = () => {
    onBackToOverview();
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stats bar */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-primary" /> 12,4k
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> 347 online
          </span>
        </div>
      </div>

      {/* Scrollable category list */}
      <div className="flex-1 overflow-y-auto py-2">
        <button
          onClick={handleBackToOverview}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
            view === "overview"
              ? "text-primary bg-primary/8 font-medium border-r-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>Alla kategorier</span>
        </button>

        <div className="my-1.5 mx-4 h-px bg-border/60" />

        {grouped.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups.has(group.groupId);
          return (
            <div key={group.groupId}>
              <button
                onClick={() => toggleGroup(group.groupId)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider hover:text-muted-foreground transition-colors"
              >
                <GroupIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {group.items.map(([catId, cat]) => {
                      const CatIcon = cat.icon;
                      const isActive = selectedCategory === catId && view !== "overview";
                      const stats = getCategoryStats(catId, allThreads);
                      return (
                        <button
                          key={catId}
                          onClick={() => handleSelectCategory(catId)}
                          className={`w-full flex items-center gap-2.5 pl-8 pr-4 py-2 text-sm transition-all group ${
                            isActive
                              ? "text-primary bg-primary/8 font-medium border-r-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
                          <span className="flex-1 text-left truncate">{cat.label}</span>
                          <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                            {stats.threadCount}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-border">
        <Button size="sm" className="w-full gap-2 text-xs" onClick={() => { onNewThread?.(); onClose?.(); }}>
          <Plus className="w-3.5 h-3.5" /> Starta diskussion
        </Button>
      </div>
    </div>
  );
};

/* ─── Desktop Sidebar wrapper ─── */
const CategorySidebar = ({
  collapsed,
  onToggle,
  selectedCategory,
  onSelectCategory,
  onBackToOverview,
  view,
  allThreads,
  onNewThread,
}: {
  collapsed: boolean;
  onToggle: () => void;
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
  onBackToOverview: () => void;
  view: string;
  allThreads: Thread[];
  onNewThread: () => void;
}) => (
  <motion.aside
    animate={{ width: collapsed ? 0 : "30%" }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="shrink-0 overflow-hidden border-r border-border bg-card/50 hidden md:block"
    style={{ minWidth: collapsed ? 0 : "240px", maxWidth: collapsed ? 0 : "360px" }}
  >
    <div style={{ minWidth: "240px" }} className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="font-serif text-sm font-semibold text-foreground">Forum</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Fäll ihop menyn"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <SidebarContent
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onBackToOverview={onBackToOverview}
        view={view}
        allThreads={allThreads}
        onNewThread={onNewThread}
      />
    </div>
  </motion.aside>
);

/* ─── Info Panel ─── */
const InfoPanel = () => (
  <div className="space-y-4">
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

/* ─── New Thread Dialog ─── */
const NewThreadDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultCategory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (thread: { title: string; content: string; category: string; tags: string[] }) => void;
  defaultCategory: string | null;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Fyll i alla obligatoriska fält");
      return;
    }
    if (title.trim().length < 5) {
      toast.error("Titeln måste vara minst 5 tecken");
      return;
    }
    if (content.trim().length < 10) {
      toast.error("Innehållet måste vara minst 10 tecken");
      return;
    }
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5);
    onSubmit({ title: title.trim(), content: content.trim(), category, tags });
    setTitle("");
    setContent("");
    setTagsInput("");
    onOpenChange(false);
    toast.success("Tråden har skapats!");
  };

  // Reset category when dialog opens with a new default
  React.useEffect(() => {
    if (open && defaultCategory) setCategory(defaultCategory);
  }, [open, defaultCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">Starta ny diskussion</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Kategori *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Välj kategori..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([catId, cat]) => (
                  <SelectItem key={catId} value={catId}>
                    {cat.label} — {cat.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Titel *</label>
            <Input
              placeholder="En tydlig och beskrivande titel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="text-sm"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{title.length}/200</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Innehåll *</label>
            <Textarea
              placeholder="Beskriv din fråga, erfarenhet eller tanke i detalj..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              className="min-h-[140px] text-sm resize-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{content.length}/5000</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Taggar (valfritt)</label>
            <Input
              placeholder="karriär, tips, diskussion (kommaseparerade)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              maxLength={100}
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Avbryt</Button>
            <Button size="sm" className="gap-2" onClick={handleSubmit}>
              <Send className="w-3.5 h-3.5" /> Publicera
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const Threads = () => {
  const isMobile = useIsMobile();
  const [allThreads, setAllThreads] = useState<Thread[]>(initialThreads);
  const [view, setView] = useState<"overview" | "category" | "detail">("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedThreads, setLikedThreads] = useState<Set<string>>(new Set());
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newThreadOpen, setNewThreadOpen] = useState(false);

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
    setCurrentPage(1);
  };

  const handleOpenThread = (threadId: string) => {
    setActiveThread(threadId);
    setView("detail");
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedCategory(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBackToCategory = () => {
    setView("category");
    setActiveThread(null);
  };

  // Create new thread
  const handleCreateThread = useCallback((data: { title: string; content: string; category: string; tags: string[] }) => {
    const newThread: Thread = {
      id: `user-${Date.now()}`,
      title: data.title,
      author: "Gäst",
      authorInitials: "G",
      authorRole: "Användare",
      category: data.category,
      content: data.content,
      likes: 0,
      replies: 0,
      views: 1,
      timeAgo: "just nu",
      tags: data.tags,
      replyData: [],
    };
    setAllThreads(prev => [newThread, ...prev]);
    setSelectedCategory(data.category);
    setView("detail");
    setActiveThread(newThread.id);
  }, []);

  // Add reply to thread
  const handleAddReply = useCallback((threadId: string, content: string, quoted?: { author: string; content: string }) => {
    const newReply: ReplyData = {
      id: `reply-${Date.now()}`,
      author: "Gäst",
      authorInitials: "G",
      content,
      likes: 0,
      timeAgo: "just nu",
      quotedReply: quoted || undefined,
    };
    setAllThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        replies: t.replies + 1,
        replyData: [...(t.replyData || []), newReply],
      };
    }));
    toast.success("Ditt svar har publicerats!");
  }, []);

  // Filtered & sorted threads
  const categoryThreads = selectedCategory
    ? allThreads.filter((t) => t.category === selectedCategory)
    : [];

  const sortedCategoryThreads = useMemo(() => {
    const sorted = [...categoryThreads].sort((a, b) => {
      // Pinned always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case "popular":
          return (b.likes + b.replies * 2) - (a.likes + a.replies * 2);
        case "new":
          return timeToMinutes(a.timeAgo) - timeToMinutes(b.timeAgo);
        case "top":
          return b.likes - a.likes;
        case "unanswered":
          return a.replies - b.replies;
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });
    return sorted;
  }, [categoryThreads, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedCategoryThreads.length / THREADS_PER_PAGE);
  const paginatedThreads = sortedCategoryThreads.slice(
    (currentPage - 1) * THREADS_PER_PAGE,
    currentPage * THREADS_PER_PAGE
  );

  const activeThreadData = activeThread ? allThreads.find((t) => t.id === activeThread) : null;
  const selectedCatData = selectedCategory ? categories[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors md:hidden">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  <div className="flex items-center gap-2 p-4 border-b border-border">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h2 className="font-serif text-sm font-semibold text-foreground">Forum</h2>
                  </div>
                  <SidebarContent
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    onBackToOverview={handleBackToOverview}
                    view={view}
                    onClose={() => setMobileMenuOpen(false)}
                    allThreads={allThreads}
                    onNewThread={() => setNewThreadOpen(true)}
                  />
                </SheetContent>
              </Sheet>
            )}

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

      {/* Two-column layout */}
      <div className="pt-14 flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Left sidebar — desktop only */}
        {!isMobile && (
          <CategorySidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onBackToOverview={handleBackToOverview}
            view={view}
            allThreads={allThreads}
            onNewThread={() => setNewThreadOpen(true)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Collapsed sidebar toggle — desktop only */}
          {!isMobile && sidebarCollapsed && (
            <div className="border-b border-border px-4 py-2">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex items-center gap-2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
                title="Visa menyn"
              >
                <PanelLeftOpen className="w-4 h-4" />
                <span className="text-xs font-medium">Visa meny</span>
              </button>
            </div>
          )}

          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6">
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

                      {/* Sort controls — 5 options */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-0.5 flex-wrap">
                          {sortOptions.map((s) => {
                            const Icon = s.icon;
                            return (
                              <button
                                key={s.id}
                                onClick={() => { setSortBy(s.id); setCurrentPage(1); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  sortBy === s.id
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{s.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <Button size="sm" className="ml-auto gap-2 text-xs h-8 px-4">
                          <Plus className="w-3.5 h-3.5" /> Ny tråd
                        </Button>
                      </div>

                      {/* Thread list — compact */}
                      <div className="space-y-1.5">
                        {paginatedThreads.map((thread, i) => (
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

                      {/* Pagination */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />

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

              {view !== "detail" && (
                <div className="hidden xl:block w-64 shrink-0">
                  <InfoPanel />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Threads;
