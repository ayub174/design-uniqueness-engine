import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, ChevronUp, ChevronDown, Search, Flame, Sparkles,
  ArrowLeft, Pin, Bookmark, MessageCircle, Zap, Crown, Shield,
  TrendingUp, ThumbsUp, Reply, Share2, MoreHorizontal, AlertCircle,
  Lightbulb, Heart, Star, Coffee, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

interface Reply {
  id: string;
  author: string;
  authorInitials: string;
  authorBadge?: string;
  content: string;
  votes: number;
  timeAgo: string;
  isOP?: boolean;
  replies?: Reply[];
}

interface Thread {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  authorRole: string;
  authorBadge?: "mod" | "verified" | "top";
  category: string;
  categoryEmoji: string;
  content: string;
  votes: number;
  replies: number;
  views: number;
  timeAgo: string;
  isPinned?: boolean;
  isHot?: boolean;
  heatLevel?: number; // 1-5 heat bars
  tags: string[];
  lastReplyBy?: string;
  lastReplyTime?: string;
  replyData?: Reply[];
}

const categoryConfig: Record<string, { emoji: string; label: string; gradient: string }> = {
  career: { emoji: "🔄", label: "Karriärväxling", gradient: "from-primary/20 to-primary/5" },
  salary: { emoji: "💰", label: "Lön & Förhandling", gradient: "from-primary/15 to-primary/5" },
  interview: { emoji: "🎯", label: "Intervjutips", gradient: "from-primary/20 to-primary/5" },
  cv: { emoji: "📄", label: "CV & Personligt brev", gradient: "from-primary/15 to-primary/5" },
  workplace: { emoji: "🏢", label: "Arbetsliv", gradient: "from-primary/20 to-primary/5" },
};

const threads: Thread[] = [
  {
    id: "1",
    title: "Bytte från lärare till UX-designer — så här gick jag tillväga",
    author: "EmmaK",
    authorInitials: "EK",
    authorRole: "UX Designer",
    authorBadge: "verified",
    category: "career",
    categoryEmoji: "🔄",
    content: "Efter 8 år som mellanstadielärare kände jag att jag behövde en förändring. Började med onlinekurser på kvällar och helger, byggde en portfolio parallellt med jobbet och fick till slut min första UX-roll. AMA!",
    votes: 234,
    replies: 67,
    views: 2841,
    timeAgo: "3h",
    isPinned: true,
    isHot: true,
    heatLevel: 4,
    tags: ["karriärväxling", "UX", "erfarenhet"],
    lastReplyBy: "DesignDaniel",
    lastReplyTime: "12 min",
  },
  {
    id: "2",
    title: "Vad är rimlig ingångslön som nyexaminerad civilingenjör 2025?",
    author: "TechAnton",
    authorInitials: "TA",
    authorRole: "Civilingenjörsstudent",
    category: "salary",
    categoryEmoji: "💰",
    content: "Pluggar sista terminen på civilingenjör datateknik på KTH. Har börjat söka jobb och undrar vad som är rimligt att förvänta sig lönemässigt. Hört allt från 35k till 45k — vad stämmer?",
    votes: 189,
    replies: 93,
    views: 4210,
    timeAgo: "5h",
    isHot: true,
    heatLevel: 5,
    tags: ["lön", "civilingenjör", "nyexaminerad"],
    lastReplyBy: "HRSara",
    lastReplyTime: "28 min",
  },
  {
    id: "3",
    title: "Fick drömjobbet efter tredje intervjun — mina bästa tips",
    author: "LinaM",
    authorInitials: "LM",
    authorRole: "Projektledare",
    authorBadge: "top",
    category: "interview",
    categoryEmoji: "🎯",
    content: "Jag har äntligen fått jobbet jag drömt om! Ville dela med mig av mina bästa intervjutips som verkligen gjorde skillnad. Det handlar mycket om förberedelse och att våga vara personlig.",
    votes: 312,
    replies: 45,
    views: 3150,
    timeAgo: "8h",
    isPinned: true,
    heatLevel: 3,
    tags: ["intervju", "tips", "framgång"],
    lastReplyBy: "KarrärCoach",
    lastReplyTime: "1h",
  },
  {
    id: "4",
    title: "Är det värt att lägga till hobbyer i CV:t?",
    author: "OskarP",
    authorInitials: "OP",
    authorRole: "Ekonomistudent",
    category: "cv",
    categoryEmoji: "📄",
    content: "Jag har hört blandade åsikter. Vissa säger att det visar personlighet, andra säger att det tar plats från viktigare saker. Vad tycker ni — bör hobbyer inkluderas eller skipas?",
    votes: 78,
    replies: 56,
    views: 1920,
    timeAgo: "12h",
    heatLevel: 2,
    tags: ["CV", "tips", "diskussion"],
    lastReplyBy: "CVExperten",
    lastReplyTime: "2h",
  },
  {
    id: "5",
    title: "Toxic arbetsplats — när är det dags att dra?",
    author: "AnonymAnvändare",
    authorInitials: "AA",
    authorRole: "Anonym",
    category: "workplace",
    categoryEmoji: "🏢",
    content: "Har jobbat på samma ställe i 3 år. Chefen micromanagar, kollegor baktalas och det är noll uppskattning. Men lönen är bra och jag gillar mina arbetsuppgifter. Hur vet man när det är dags?\n\nJag tjänar bra — runt 45k — och arbetsuppgifterna i sig är roliga. Men stämningen är helt åt helvete. Chefen kollar exakt när vi kommer och går, skickar passiv-aggressiva mail cc:ade till hela teamet, och det finns en kultur av att prata skit bakom ryggen på folk.\n\nJag har börjat må dåligt på söndagar bara av tanken att gå till jobbet på måndag. Min sambo säger att jag borde sluta, men jag är rädd att inte hitta något lika bra lönemässigt.\n\nHar någon annan varit i en liknande sits? Hur tänkte ni?",
    votes: 456,
    replies: 128,
    views: 6730,
    timeAgo: "1d",
    isHot: true,
    heatLevel: 5,
    tags: ["arbetsmiljö", "råd", "karriärval"],
    lastReplyBy: "PsykologPer",
    lastReplyTime: "45 min",
    replyData: [
      {
        id: "r1",
        author: "PsykologPer",
        authorInitials: "PP",
        authorBadge: "verified",
        content: "Som psykolog ser jag det här mönstret väldigt ofta. Det du beskriver — söndagsångest, passiv-aggressiv kommunikation, övervakning — är klassiska tecken på en toxisk arbetsmiljö.\n\nMin tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka. Lönen kompenserar inte för din mentala hälsa. Det finns andra jobb med bra lön OCH bra kultur.",
        votes: 234,
        timeAgo: "45 min",
      },
      {
        id: "r2",
        author: "VarDärSjälv",
        authorInitials: "VS",
        content: "Jag var i exakt samma sits för 2 år sedan. Stannade alldeles för länge pga lönen. Till slut blev jag sjukskriven i 3 månader.\n\nBytte jobb, gick ner 3k i lön men det var det ABSOLUT värt. Nu ser jag faktiskt fram emot att jobba igen. Pengar är inte allt, lita på mig.",
        votes: 189,
        timeAgo: "2h",
        isOP: false,
      },
      {
        id: "r3",
        author: "AnonymAnvändare",
        authorInitials: "AA",
        content: "Tack för alla svar! Det bekräftar verkligen vad jag redan kände innerst inne. Ska börja söka direkt. Fråga: hur hanterade ni uppsägningen? Var ni ärliga om anledningen?",
        votes: 67,
        timeAgo: "1h",
        isOP: true,
      },
      {
        id: "r4",
        author: "HRSara",
        authorInitials: "HS",
        authorBadge: "verified",
        content: "HR-perspektiv: Var diplomatisk vid uppsägningen. 'Jag har fått ett erbjudande jag inte kan tacka nej till' räcker gott. Du behöver inte bränna broar, även om det kan kännas frestande.\n\nTips: Dokumentera allt som händer ifall du skulle behöva det senare. Mejl, anteckningar från möten, etc.",
        votes: 145,
        timeAgo: "50 min",
      },
      {
        id: "r5",
        author: "DevJohan",
        authorInitials: "DJ",
        content: "Hot take: ibland är det bättre att prata med chefen först. Jag hade en toxic chef men det visade sig att hen inte ens var medveten om sitt beteende. Efter ett ärligt samtal blev det faktiskt bättre.\n\nMen om det inte funkar — spring. 🏃‍♂️",
        votes: 56,
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
    categoryEmoji: "🏢",
    content: "Har jobbat remote i 2 år nu och funderar på att gå tillbaka till kontor. Saknar den sociala biten men älskar friheten. Nyfiken på vad andra tycker — hybrid kanske är svaret?",
    votes: 145,
    replies: 82,
    views: 2480,
    timeAgo: "1d",
    heatLevel: 3,
    tags: ["remote", "kontor", "arbetsliv"],
    lastReplyBy: "HybridHenrik",
    lastReplyTime: "3h",
  },
  {
    id: "7",
    title: "Löneförhandling: begärde 8k mer och fick det — min strategi",
    author: "NegotiatorNiklas",
    authorInitials: "NN",
    authorRole: "Systemutvecklare",
    authorBadge: "verified",
    category: "salary",
    categoryEmoji: "💰",
    content: "Många är rädda för att förhandla lön, men det behöver inte vara svårt. Jag delar min exakta strategi som gav mig 8000kr mer i månadslön vid senaste utvecklingssamtalet.",
    votes: 521,
    replies: 74,
    views: 5890,
    timeAgo: "2d",
    isHot: true,
    heatLevel: 5,
    tags: ["lön", "förhandling", "strategi"],
    lastReplyBy: "LöneRådgivaren",
    lastReplyTime: "5h",
  },
  {
    id: "8",
    title: "Bästa bootcamps för att lära sig programmering 2025?",
    author: "KodKarin",
    authorInitials: "KK",
    authorRole: "Karriärväxlare",
    category: "career",
    categoryEmoji: "🔄",
    content: "Vill sadla om till webbutveckling. Finns det någon som gått en bootcamp och kan rekommendera? Tittar på Salt, Technigo och School of Applied Technology.",
    votes: 97,
    replies: 43,
    views: 1650,
    timeAgo: "2d",
    heatLevel: 2,
    tags: ["bootcamp", "programmering", "utbildning"],
    lastReplyBy: "DevDavid",
    lastReplyTime: "8h",
  },
];

const sortOptions = [
  { id: "hot", label: "🔥 Hett just nu" },
  { id: "new", label: "✨ Senaste" },
  { id: "top", label: "👑 Topplista" },
];

const HeatBar = ({ level }: { level: number }) => (
  <div className="flex gap-0.5 items-center" title={`Aktivitetsnivå: ${level}/5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-1 rounded-full transition-all ${
          i <= level
            ? `bg-primary ${i <= 2 ? "h-2" : i <= 4 ? "h-3" : "h-4"}`
            : "h-2 bg-muted"
        }`}
      />
    ))}
  </div>
);

const AuthorBadge = ({ type }: { type?: string }) => {
  if (!type) return null;
  if (type === "verified") return <Shield className="w-3 h-3 text-primary" />;
  if (type === "mod") return <Crown className="w-3 h-3 text-primary" />;
  if (type === "top") return <Zap className="w-3 h-3 text-primary" />;
  return null;
};

// Thread detail view for thread #5
const ThreadDetail = ({ thread, onBack, votedThreads, handleVote, getVoteCount }: {
  thread: Thread;
  onBack: () => void;
  votedThreads: Record<string, "up" | "down" | null>;
  handleVote: (id: string, dir: "up" | "down") => void;
  getVoteCount: (t: Thread) => number;
}) => {
  const [replyVotes, setReplyVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [replyText, setReplyText] = useState("");
  const cat = categoryConfig[thread.category];

  const handleReplyVote = (replyId: string, dir: "up" | "down") => {
    setReplyVotes((prev) => ({ ...prev, [replyId]: prev[replyId] === dir ? null : dir }));
  };

  const getReplyVoteCount = (reply: Reply) => {
    const v = replyVotes[reply.id];
    if (v === "up") return reply.votes + 1;
    if (v === "down") return reply.votes - 1;
    return reply.votes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back bar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka till alla trådar
      </button>

      {/* Thread header card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Gradient banner */}
        <div className={`h-2 bg-gradient-to-r ${cat?.gradient || "from-primary/20 to-primary/5"}`} />

        <div className="p-6 md:p-8">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-lg">{thread.categoryEmoji}</span>
            <span className="text-xs font-medium text-muted-foreground">{cat?.label}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{thread.timeAgo} sedan</span>
            {thread.isHot && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" /> Trending
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-tight mb-6">
            {thread.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarFallback className="text-sm font-bold bg-secondary text-secondary-foreground">
                {thread.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">{thread.author}</span>
                <AuthorBadge type={thread.authorBadge} />
              </div>
              <span className="text-xs text-muted-foreground">{thread.authorRole}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line mb-6">
            {thread.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions bar */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote(thread.id, "up")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  votedThreads[thread.id] === "up"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                {getVoteCount(thread)}
              </button>
              <button
                onClick={() => handleVote(thread.id, "down")}
                className={`p-1.5 rounded-full transition-all ${
                  votedThreads[thread.id] === "down"
                    ? "bg-destructive/10 text-destructive"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {thread.replies} svar
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {thread.views.toLocaleString("sv-SE")}
              </span>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
                Dela
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Bookmark className="w-4 h-4" />
                Spara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-medium text-foreground">
            {thread.replies} svar
          </h2>
          <span className="text-xs text-muted-foreground">Sorterat efter bäst</span>
        </div>

        <div className="space-y-4">
          {thread.replyData?.map((reply, i) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`bg-card border rounded-2xl p-5 ${
                reply.isOP ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              {/* Reply header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`text-[11px] font-bold ${
                      reply.isOP ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {reply.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{reply.author}</span>
                    <AuthorBadge type={reply.authorBadge} />
                    {reply.isOP && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        OP
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">· {reply.timeAgo}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Reply content */}
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-3">
                {reply.content}
              </p>

              {/* Reply actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleReplyVote(reply.id, "up")}
                    className={`p-1 rounded-md transition-colors ${
                      replyVotes[reply.id] === "up"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className={`text-xs font-bold tabular-nums min-w-[2ch] text-center ${
                    replyVotes[reply.id] === "up" ? "text-primary" :
                    replyVotes[reply.id] === "down" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {getReplyVoteCount(reply)}
                  </span>
                  <button
                    onClick={() => handleReplyVote(reply.id, "down")}
                    className={`p-1 rounded-md transition-colors ${
                      replyVotes[reply.id] === "down"
                        ? "text-destructive bg-destructive/10"
                        : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Reply className="w-3.5 h-3.5" />
                  Svara
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">Du</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Skriv ett svar</span>
          </div>
          <Textarea
            placeholder="Dela dina tankar..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[100px] bg-background border-border resize-none mb-3"
          />
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Send className="w-4 h-4" />
              Publicera svar
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Threads = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down" | null>>({});
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());
  const [activeThread, setActiveThread] = useState<string | null>(null);

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

  const activeThreadData = activeThread ? threads.find((t) => t.id === activeThread) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
            <span className="hidden sm:block text-border">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MessageSquare className="w-4 h-4 text-primary" />
              Trådar
            </span>
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

      <div className="pt-16">
        {/* Header — only show when no thread is active */}
        {!activeThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden border-b border-border"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground"
                  >
                    Vad snackas det om? 💬
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-2 text-muted-foreground max-w-lg"
                  >
                    Ärliga diskussioner om karriär, lön och arbetsliv. Ingen bullshit.
                  </motion.p>

                  {/* Quick stats inline */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      347 online
                    </span>
                    <span>·</span>
                    <span>12 438 medlemmar</span>
                    <span>·</span>
                    <span>23 nya trådar idag</span>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                    <Sparkles className="w-4 h-4" />
                    Starta en diskussion
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`lg:w-60 shrink-0 ${activeThread ? "hidden lg:block" : ""}`}
            >
              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Sök trådar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border text-sm"
                />
              </div>

              {/* Categories as emoji pills */}
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">
                  Ämnen
                </p>
                <button
                  onClick={() => { setSelectedCategory("all"); setActiveThread(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">🗂️ Allt</span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">247</span>
                </button>
                {Object.entries(categoryConfig).map(([id, cat]) => (
                  <button
                    key={id}
                    onClick={() => { setSelectedCategory(id); setActiveThread(null); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedCategory === id
                        ? "bg-primary/10 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.emoji} {cat.label}
                    </span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {threads.filter((t) => t.category === id).length * 8}
                    </span>
                  </button>
                ))}
              </div>

              {/* Trending tags */}
              <div className="mt-6 p-4 rounded-2xl bg-card border border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  🔥 Trendande ämnen
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["lönelyft", "karriärväxling", "remote", "intervju", "toxic chef", "bootcamp", "KTH"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-muted-foreground bg-muted hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Forum rules - compact */}
              <div className="mt-4 p-4 rounded-2xl bg-card border border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  📋 Regler
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Var schysst, håll dig till ämnet, ingen spam. Dela gärna erfarenheter — det är det forumet är till för.
                </p>
              </div>
            </motion.aside>

            {/* Main area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeThreadData ? (
                  <ThreadDetail
                    key="detail"
                    thread={activeThreadData}
                    onBack={() => setActiveThread(null)}
                    votedThreads={votedThreads}
                    handleVote={handleVote}
                    getVoteCount={getVoteCount}
                  />
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Sort bar */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSortBy(opt.id)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                              sortBy === opt.id
                                ? "bg-secondary text-secondary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {sortedThreads.length} trådar
                      </span>
                    </div>

                    {/* Thread list */}
                    <div className="space-y-2">
                      {sortedThreads.map((thread, i) => {
                        const cat = categoryConfig[thread.category];
                        return (
                          <motion.article
                            key={thread.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                            onClick={() => thread.replyData ? setActiveThread(thread.id) : null}
                            className={`group relative bg-card border rounded-2xl p-4 md:p-5 transition-all ${
                              thread.replyData ? "cursor-pointer" : "cursor-default"
                            } ${
                              thread.isPinned
                                ? "border-primary/25 hover:border-primary/40"
                                : "border-border hover:border-primary/20"
                            } hover:shadow-md`}
                          >
                            <div className="flex gap-3 md:gap-4">
                              {/* Vote column — compact */}
                              <div className="hidden sm:flex flex-col items-center gap-0 shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
                                  className={`p-0.5 rounded transition-colors ${
                                    votedThreads[thread.id] === "up"
                                      ? "text-primary"
                                      : "text-muted-foreground/50 hover:text-primary"
                                  }`}
                                >
                                  <ChevronUp className="w-5 h-5" />
                                </button>
                                <span className={`text-xs font-bold tabular-nums ${
                                  votedThreads[thread.id] === "up" ? "text-primary" :
                                  votedThreads[thread.id] === "down" ? "text-destructive" : "text-foreground"
                                }`}>
                                  {getVoteCount(thread)}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
                                  className={`p-0.5 rounded transition-colors ${
                                    votedThreads[thread.id] === "down"
                                      ? "text-destructive"
                                      : "text-muted-foreground/50 hover:text-destructive"
                                  }`}
                                >
                                  <ChevronDown className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Top meta line */}
                                <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                                  <span>{thread.categoryEmoji}</span>
                                  <span className="text-muted-foreground font-medium">{cat?.label}</span>
                                  <span className="text-muted-foreground/40">·</span>
                                  <div className="flex items-center gap-1">
                                    <Avatar className="w-4 h-4">
                                      <AvatarFallback className="text-[7px] font-bold bg-muted text-muted-foreground">
                                        {thread.authorInitials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-muted-foreground">{thread.author}</span>
                                    <AuthorBadge type={thread.authorBadge} />
                                  </div>
                                  <span className="text-muted-foreground/40">·</span>
                                  <span className="text-muted-foreground">{thread.timeAgo}</span>
                                  {thread.isPinned && (
                                    <Pin className="w-3 h-3 text-primary ml-auto" />
                                  )}
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-base md:text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                                  {thread.title}
                                </h3>

                                {/* Preview — only on larger cards */}
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1 mt-1 mb-3">
                                  {thread.content}
                                </p>

                                {/* Bottom bar */}
                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {thread.replies}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {thread.views.toLocaleString("sv-SE")}
                                  </span>
                                  {thread.heatLevel && <HeatBar level={thread.heatLevel} />}

                                  {/* Tags — inline, compact */}
                                  <div className="hidden md:flex items-center gap-1 ml-auto">
                                    {thread.tags.slice(0, 2).map((tag) => (
                                      <span key={tag} className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
                                    className={`ml-auto md:ml-0 p-1 rounded transition-colors ${
                                      savedThreads.has(thread.id) ? "text-primary" : "hover:text-primary"
                                    }`}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>

                    {/* Load more */}
                    <div className="mt-8 text-center">
                      <Button variant="outline" className="px-8 border-border text-muted-foreground hover:text-foreground">
                        Visa fler trådar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Threads;
