import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, ChevronUp, ChevronDown, Search,
  ArrowLeft, Pin, Bookmark, Reply, Share2, MoreHorizontal,
  Send, Shield, Zap, Crown, Flame, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  votes: number;
  replies: number;
  views: number;
  timeAgo: string;
  isPinned?: boolean;
  isHot?: boolean;
  tags: string[];
  replyData?: Reply[];
}

const categories: Record<string, { label: string; color: string }> = {
  career: { label: "Karriär", color: "border-l-primary" },
  salary: { label: "Lön", color: "border-l-accent" },
  interview: { label: "Intervju", color: "border-l-primary" },
  cv: { label: "CV", color: "border-l-accent" },
  workplace: { label: "Jobb", color: "border-l-primary" },
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
    content: "Efter 8 år som mellanstadielärare kände jag att jag behövde en förändring. Började med onlinekurser på kvällar och helger, byggde en portfolio parallellt med jobbet och fick till slut min första UX-roll. AMA!",
    votes: 234,
    replies: 67,
    views: 2841,
    timeAgo: "3h",
    isPinned: true,
    isHot: true,
    tags: ["karriärväxling", "UX"],
  },
  {
    id: "2",
    title: "Vad är rimlig ingångslön som nyexaminerad civilingenjör 2025?",
    author: "TechAnton",
    authorInitials: "TA",
    authorRole: "Student",
    category: "salary",
    content: "Pluggar sista terminen på civilingenjör datateknik på KTH. Har börjat söka jobb och undrar vad som är rimligt att förvänta sig lönemässigt.",
    votes: 189,
    replies: 93,
    views: 4210,
    timeAgo: "5h",
    isHot: true,
    tags: ["lön", "civilingenjör"],
  },
  {
    id: "3",
    title: "Fick drömjobbet efter tredje intervjun — mina bästa tips",
    author: "LinaM",
    authorInitials: "LM",
    authorRole: "Projektledare",
    authorBadge: "top",
    category: "interview",
    content: "Jag har äntligen fått jobbet jag drömt om! Ville dela med mig av mina bästa intervjutips som verkligen gjorde skillnad.",
    votes: 312,
    replies: 45,
    views: 3150,
    timeAgo: "8h",
    isPinned: true,
    tags: ["intervju", "tips"],
  },
  {
    id: "4",
    title: "Är det värt att lägga till hobbyer i CV:t?",
    author: "OskarP",
    authorInitials: "OP",
    authorRole: "Student",
    category: "cv",
    content: "Jag har hört blandade åsikter. Vissa säger att det visar personlighet, andra säger att det tar plats från viktigare saker.",
    votes: 78,
    replies: 56,
    views: 1920,
    timeAgo: "12h",
    tags: ["CV", "diskussion"],
  },
  {
    id: "5",
    title: "Toxic arbetsplats — när är det dags att dra?",
    author: "AnonymAnvändare",
    authorInitials: "AA",
    authorRole: "Anonym",
    category: "workplace",
    content: "Har jobbat på samma ställe i 3 år. Chefen micromanagar, kollegor baktalas och det är noll uppskattning. Men lönen är bra och jag gillar mina arbetsuppgifter. Hur vet man när det är dags?\n\nJag tjänar bra — runt 45k — och arbetsuppgifterna i sig är roliga. Men stämningen är helt åt helvete. Chefen kollar exakt när vi kommer och går, skickar passiv-aggressiva mail cc:ade till hela teamet.\n\nHar någon annan varit i en liknande sits?",
    votes: 456,
    replies: 128,
    views: 6730,
    timeAgo: "1d",
    isHot: true,
    tags: ["arbetsmiljö", "karriärval"],
    replyData: [
      {
        id: "r1",
        author: "PsykologPer",
        authorInitials: "PP",
        authorBadge: "verified",
        content: "Som psykolog ser jag det här mönstret ofta. Söndagsångest, passiv-aggressiv kommunikation, övervakning — klassiska tecken på en toxisk miljö.\n\nMin tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka.",
        votes: 234,
        timeAgo: "45 min",
      },
      {
        id: "r2",
        author: "VarDärSjälv",
        authorInitials: "VS",
        content: "Jag var i exakt samma sits för 2 år sedan. Stannade alldeles för länge pga lönen. Till slut blev jag sjukskriven i 3 månader.\n\nBytte jobb, gick ner 3k i lön men det var ABSOLUT värt det.",
        votes: 189,
        timeAgo: "2h",
      },
      {
        id: "r3",
        author: "AnonymAnvändare",
        authorInitials: "AA",
        content: "Tack för alla svar! Det bekräftar vad jag redan kände innerst inne. Ska börja söka direkt. Hur hanterade ni uppsägningen?",
        votes: 67,
        timeAgo: "1h",
        isOP: true,
      },
      {
        id: "r4",
        author: "HRSara",
        authorInitials: "HS",
        authorBadge: "verified",
        content: "HR-perspektiv: Var diplomatisk. 'Jag har fått ett erbjudande jag inte kan tacka nej till' räcker gott. Dokumentera allt som händer ifall du behöver det senare.",
        votes: 145,
        timeAgo: "50 min",
      },
      {
        id: "r5",
        author: "DevJohan",
        authorInitials: "DJ",
        content: "Hot take: ibland är det bättre att prata med chefen först. Jag hade en toxic chef men det visade sig att hen inte ens var medveten om sitt beteende. Men om det inte funkar — spring. 🏃‍♂️",
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
    content: "Har jobbat remote i 2 år nu och funderar på att gå tillbaka till kontor. Saknar den sociala biten men älskar friheten.",
    votes: 145,
    replies: 82,
    views: 2480,
    timeAgo: "1d",
    tags: ["remote", "kontor"],
  },
  {
    id: "7",
    title: "Löneförhandling: begärde 8k mer och fick det",
    author: "NegotiatorNiklas",
    authorInitials: "NN",
    authorRole: "Systemutvecklare",
    authorBadge: "verified",
    category: "salary",
    content: "Många är rädda för att förhandla lön. Jag delar min exakta strategi som gav mig 8000kr mer i månadslön.",
    votes: 521,
    replies: 74,
    views: 5890,
    timeAgo: "2d",
    isHot: true,
    tags: ["lön", "förhandling"],
  },
  {
    id: "8",
    title: "Bästa bootcamps för programmering 2025?",
    author: "KodKarin",
    authorInitials: "KK",
    authorRole: "Karriärväxlare",
    category: "career",
    content: "Vill sadla om till webbutveckling. Någon som gått en bootcamp och kan rekommendera? Tittar på Salt, Technigo och School of Applied Technology.",
    votes: 97,
    replies: 43,
    views: 1650,
    timeAgo: "2d",
    tags: ["bootcamp", "programmering"],
  },
];

const AuthorBadge = ({ type }: { type?: string }) => {
  if (!type) return null;
  const cls = "w-3 h-3 text-primary";
  if (type === "verified") return <Shield className={cls} />;
  if (type === "mod") return <Crown className={cls} />;
  if (type === "top") return <Zap className={cls} />;
  return null;
};

const VoteBlock = ({
  count,
  voted,
  onUp,
  onDown,
  compact,
}: {
  count: number;
  voted: "up" | "down" | null;
  onUp: (e: React.MouseEvent) => void;
  onDown: (e: React.MouseEvent) => void;
  compact?: boolean;
}) => (
  <div className={`flex ${compact ? "flex-row items-center gap-0.5" : "flex-col items-center gap-0"}`}>
    <button
      onClick={onUp}
      className={`p-0.5 rounded transition-colors ${voted === "up" ? "text-primary" : "text-muted-foreground/40 hover:text-primary"}`}
    >
      <ChevronUp className={compact ? "w-4 h-4" : "w-5 h-5"} />
    </button>
    <span className={`text-xs font-bold tabular-nums min-w-[2ch] text-center ${
      voted === "up" ? "text-primary" : voted === "down" ? "text-destructive" : "text-foreground"
    }`}>
      {count}
    </span>
    <button
      onClick={onDown}
      className={`p-0.5 rounded transition-colors ${voted === "down" ? "text-destructive" : "text-muted-foreground/40 hover:text-destructive"}`}
    >
      <ChevronDown className={compact ? "w-4 h-4" : "w-5 h-5"} />
    </button>
  </div>
);

/* ─── Detail View ─── */
const ThreadDetail = ({
  thread,
  onBack,
  votedThreads,
  handleVote,
  getVoteCount,
}: {
  thread: Thread;
  onBack: () => void;
  votedThreads: Record<string, "up" | "down" | null>;
  handleVote: (id: string, dir: "up" | "down") => void;
  getVoteCount: (t: Thread) => number;
}) => {
  const [replyVotes, setReplyVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [replyText, setReplyText] = useState("");

  const handleReplyVote = (replyId: string, dir: "up" | "down") => {
    setReplyVotes((prev) => ({ ...prev, [replyId]: prev[replyId] === dir ? null : dir }));
  };

  const getReplyVoteCount = (reply: Reply) => {
    const v = replyVotes[reply.id];
    return reply.votes + (v === "up" ? 1 : v === "down" ? -1 : 0);
  };

  const cat = categories[thread.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka
      </button>

      {/* Main post */}
      <article className={`border-l-2 ${cat?.color || "border-l-primary"} bg-card border border-border rounded-r-xl pl-5 pr-6 py-6`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="font-medium text-primary">{cat?.label}</span>
          <span>·</span>
          <span>{thread.timeAgo} sedan</span>
          {thread.isHot && (
            <span className="flex items-center gap-1 text-primary font-medium">
              <Flame className="w-3 h-3" /> het
            </span>
          )}
        </div>

        <h1 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight mb-4">
          {thread.title}
        </h1>

        <div className="flex items-center gap-2.5 mb-5">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
              {thread.authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">{thread.author}</span>
          <AuthorBadge type={thread.authorBadge} />
          <span className="text-xs text-muted-foreground">· {thread.authorRole}</span>
        </div>

        <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-5">
          {thread.content}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {thread.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
          <VoteBlock
            count={getVoteCount(thread)}
            voted={votedThreads[thread.id] || null}
            onUp={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
            onDown={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
            compact
          />
          <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" />{thread.replies}</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{thread.views.toLocaleString("sv-SE")}</span>
          <button className="ml-auto flex items-center gap-1.5 hover:text-foreground transition-colors"><Share2 className="w-4 h-4" />Dela</button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><Bookmark className="w-4 h-4" />Spara</button>
        </div>
      </article>

      {/* Replies */}
      <div className="mt-8 space-y-3">
        <p className="text-sm font-medium text-muted-foreground mb-4">{thread.replies} svar</p>

        {thread.replyData?.map((reply, i) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className={`flex gap-3 p-4 rounded-xl ${
              reply.isOP
                ? "bg-primary/[0.04] border border-primary/15"
                : "bg-card border border-border"
            }`}
          >
            <VoteBlock
              count={getReplyVoteCount(reply)}
              voted={replyVotes[reply.id] || null}
              onUp={() => handleReplyVote(reply.id, "up")}
              onDown={() => handleReplyVote(reply.id, "down")}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{reply.author}</span>
                <AuthorBadge type={reply.authorBadge} />
                {reply.isOP && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">OP</span>
                )}
                <span className="text-xs text-muted-foreground">· {reply.timeAgo}</span>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-2">{reply.content}</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Reply className="w-3.5 h-3.5" /> Svara
              </button>
            </div>
          </motion.div>
        ))}

        {/* Composer */}
        <div className="mt-6 p-4 bg-card border border-border rounded-xl">
          <Textarea
            placeholder="Skriv ett svar..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px] bg-background border-border resize-none mb-3 text-sm"
          />
          <div className="flex justify-end">
            <Button size="sm" className="gap-2">
              <Send className="w-3.5 h-3.5" /> Svara
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ─── */
const Threads = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down" | null>>({});
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());
  const [activeThread, setActiveThread] = useState<string | null>(null);

  const filteredThreads = threads.filter((t) => {
    const matchCat = selectedCategory === "all" || t.category === selectedCategory;
    const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === "hot") return (b.votes + b.replies * 2) - (a.votes + a.replies * 2);
    if (sortBy === "top") return b.votes - a.votes;
    return 0;
  });

  const handleVote = (id: string, dir: "up" | "down") => {
    setVotedThreads((prev) => ({ ...prev, [id]: prev[id] === dir ? null : dir }));
  };

  const toggleSave = (id: string) => {
    setSavedThreads((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getVoteCount = (t: Thread) => {
    const v = votedThreads[t.id];
    return t.votes + (v === "up" ? 1 : v === "down" ? -1 : 0);
  };

  const activeThreadData = activeThread ? threads.find((t) => t.id === activeThread) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl font-semibold text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-medium text-foreground">Trådar</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/jobb" className="hover:text-foreground transition-colors">Jobb</Link>
            <Link to="/tradar" className="text-foreground">Trådar</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm hidden sm:inline-flex">Logga in</Button>
            <Button size="sm" className="text-sm px-4">Kom igång</Button>
          </div>
        </div>
      </nav>

      <div className="pt-14 max-w-5xl mx-auto px-6">
        {/* Top bar */}
        {!activeThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border"
          >
            <div>
              <h1 className="font-serif text-2xl font-medium text-foreground">Trådar</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />347 online</span>
                <span className="mx-2">·</span>12 438 medlemmar
              </p>
            </div>
            <Button size="sm" className="gap-2 self-start">
              <Plus className="w-4 h-4" /> Ny tråd
            </Button>
          </motion.div>
        )}

        {/* Controls + Content */}
        <div className="py-6">
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
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Filter row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Sök..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 bg-card border-border text-sm"
                    />
                  </div>

                  {/* Category pills */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === "all"
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Alla
                    </button>
                    {Object.entries(categories).map(([id, cat]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedCategory(id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === id
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-1 sm:ml-auto text-xs">
                    {[
                      { id: "hot", label: "Hett" },
                      { id: "new", label: "Nytt" },
                      { id: "top", label: "Topp" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSortBy(s.id)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          sortBy === s.id
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thread list */}
                <div className="space-y-px">
                  {sortedThreads.map((thread, i) => {
                    const cat = categories[thread.category];
                    return (
                      <motion.article
                        key={thread.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => thread.replyData ? setActiveThread(thread.id) : null}
                        className={`group flex items-start gap-3 border-l-2 ${cat?.color || "border-l-primary"} pl-4 pr-4 py-3.5 transition-colors ${
                          thread.replyData ? "cursor-pointer" : ""
                        } hover:bg-card/80 rounded-r-lg ${
                          thread.isPinned ? "bg-card/50" : ""
                        }`}
                      >
                        {/* Votes */}
                        <div className="hidden sm:flex flex-col items-center shrink-0 w-10 pt-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
                            className={`p-0 transition-colors ${
                              votedThreads[thread.id] === "up" ? "text-primary" : "text-muted-foreground/30 hover:text-primary"
                            }`}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className={`text-[11px] font-bold tabular-nums ${
                            votedThreads[thread.id] === "up" ? "text-primary" :
                            votedThreads[thread.id] === "down" ? "text-destructive" : "text-muted-foreground"
                          }`}>
                            {getVoteCount(thread)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
                            className={`p-0 transition-colors ${
                              votedThreads[thread.id] === "down" ? "text-destructive" : "text-muted-foreground/30 hover:text-destructive"
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-0.5">
                            <span className="font-medium">{cat?.label}</span>
                            <span>·</span>
                            <span>{thread.author}</span>
                            <AuthorBadge type={thread.authorBadge} />
                            <span>·</span>
                            <span>{thread.timeAgo}</span>
                            {thread.isPinned && <Pin className="w-3 h-3 text-primary" />}
                            {thread.isHot && <Flame className="w-3 h-3 text-primary" />}
                          </div>

                          <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                            {thread.title}
                          </h3>

                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.replies}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views.toLocaleString("sv-SE")}</span>
                            {thread.tags.map((tag) => (
                              <span key={tag} className="hidden md:inline text-muted-foreground/60">#{tag}</span>
                            ))}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
                              className={`ml-auto p-0.5 transition-colors ${
                                savedThreads.has(thread.id) ? "text-primary" : "opacity-0 group-hover:opacity-100 hover:text-primary"
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline" size="sm" className="text-muted-foreground">
                    Visa fler trådar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Threads;
