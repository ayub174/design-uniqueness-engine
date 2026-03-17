import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, ChevronUp, ChevronDown, Search,
  ArrowLeft, Pin, Bookmark, Reply, Share2,
  Send, Shield, Zap, Crown, Flame, Plus, TrendingUp,
  Users, Clock, Award, Filter,
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

const categories: Record<string, { label: string; icon: string }> = {
  career: { label: "Karriär", icon: "💼" },
  salary: { label: "Lön", icon: "💰" },
  interview: { label: "Intervju", icon: "🎯" },
  cv: { label: "CV", icon: "📄" },
  workplace: { label: "Jobb", icon: "🏢" },
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
  if (type === "verified") return <Shield className="w-3.5 h-3.5 text-primary" />;
  if (type === "mod") return <Crown className="w-3.5 h-3.5 text-primary" />;
  if (type === "top") return <Zap className="w-3.5 h-3.5 text-primary" />;
  return null;
};

/* ─── Vote Column ─── */
const VoteColumn = ({
  count,
  voted,
  onUp,
  onDown,
  horizontal,
}: {
  count: number;
  voted: "up" | "down" | null;
  onUp: (e: React.MouseEvent) => void;
  onDown: (e: React.MouseEvent) => void;
  horizontal?: boolean;
}) => (
  <div className={`flex ${horizontal ? "flex-row items-center gap-1" : "flex-col items-center"} select-none`}>
    <button
      onClick={onUp}
      className={`p-1 rounded-md transition-all ${
        voted === "up"
          ? "text-primary bg-primary/10"
          : "text-muted-foreground/50 hover:text-primary hover:bg-primary/5"
      }`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
    <span className={`text-xs font-bold tabular-nums min-w-[2.5ch] text-center ${
      voted === "up" ? "text-primary" : voted === "down" ? "text-destructive" : "text-foreground"
    }`}>
      {count}
    </span>
    <button
      onClick={onDown}
      className={`p-1 rounded-md transition-all ${
        voted === "down"
          ? "text-destructive bg-destructive/10"
          : "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5"
      }`}
    >
      <ChevronDown className="w-5 h-5" />
    </button>
  </div>
);

/* ─── Thread Card ─── */
const ThreadCard = ({
  thread,
  index,
  votedThreads,
  savedThreads,
  handleVote,
  toggleSave,
  getVoteCount,
  onClick,
}: {
  thread: Thread;
  index: number;
  votedThreads: Record<string, "up" | "down" | null>;
  savedThreads: Set<string>;
  handleVote: (id: string, dir: "up" | "down") => void;
  toggleSave: (id: string) => void;
  getVoteCount: (t: Thread) => number;
  onClick: () => void;
}) => {
  const cat = categories[thread.category];
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`group bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30 hover:shadow-sm ${
        thread.replyData ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex">
        {/* Vote sidebar */}
        <div className="hidden sm:flex flex-col items-center py-3 px-2 bg-muted/30">
          <VoteColumn
            count={getVoteCount(thread)}
            voted={votedThreads[thread.id] || null}
            onUp={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
            onDown={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4">
          {/* Meta line */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 flex-wrap">
            <span className="text-sm">{cat?.icon}</span>
            <span className="font-medium text-foreground/70">{cat?.label}</span>
            <span className="text-muted-foreground/40">•</span>
            <span>av <span className="font-medium text-foreground/80 hover:underline">{thread.author}</span></span>
            <AuthorBadge type={thread.authorBadge} />
            <span className="text-muted-foreground/40">•</span>
            <span>{thread.timeAgo} sedan</span>
            {thread.isPinned && (
              <span className="flex items-center gap-0.5 text-primary font-medium ml-1">
                <Pin className="w-3 h-3" /> Fäst
              </span>
            )}
            {thread.isHot && (
              <span className="flex items-center gap-0.5 text-destructive font-medium ml-1">
                <Flame className="w-3 h-3" /> Hett
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors mb-1.5">
            {thread.title}
          </h3>

          {/* Preview text */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {thread.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {thread.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full hover:bg-muted/80 transition-colors">
                #{tag}
              </span>
            ))}
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {/* Mobile votes */}
            <div className="sm:hidden mr-2">
              <VoteColumn
                count={getVoteCount(thread)}
                voted={votedThreads[thread.id] || null}
                onUp={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
                onDown={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
                horizontal
              />
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-medium">{thread.replies} svar</span>
            </button>
            <span className="flex items-center gap-1.5 px-2.5 py-1.5">
              <Eye className="w-3.5 h-3.5" />
              {thread.views.toLocaleString("sv-SE")}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-muted transition-colors ml-auto ${
                savedThreads.has(thread.id) ? "text-primary" : ""
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
              <span className="hidden sm:inline font-medium">Spara</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Dela</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

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
  const cat = categories[thread.category];

  const handleReplyVote = (replyId: string, dir: "up" | "down") => {
    setReplyVotes((prev) => ({ ...prev, [replyId]: prev[replyId] === dir ? null : dir }));
  };
  const getReplyVoteCount = (reply: Reply) => {
    const v = replyVotes[reply.id];
    return reply.votes + (v === "up" ? 1 : v === "down" ? -1 : 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka till trådar
      </button>

      {/* Main post card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex">
          <div className="hidden sm:flex flex-col items-center py-4 px-3 bg-muted/30">
            <VoteColumn
              count={getVoteCount(thread)}
              voted={votedThreads[thread.id] || null}
              onUp={(e) => { e.stopPropagation(); handleVote(thread.id, "up"); }}
              onDown={(e) => { e.stopPropagation(); handleVote(thread.id, "down"); }}
            />
          </div>

          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
              <span className="text-sm">{cat?.icon}</span>
              <span className="font-medium text-foreground/70">{cat?.label}</span>
              <span className="text-muted-foreground/40">•</span>
              <span>av</span>
              <Avatar className="w-5 h-5 inline-flex">
                <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">{thread.authorInitials}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground/80">{thread.author}</span>
              <AuthorBadge type={thread.authorBadge} />
              <span className="text-muted-foreground/40">•</span>
              <span>{thread.timeAgo} sedan</span>
              {thread.isHot && (
                <span className="flex items-center gap-0.5 text-destructive font-medium">
                  <Flame className="w-3 h-3" /> Hett
                </span>
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
                <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 pt-4 border-t border-border text-xs text-muted-foreground">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors font-medium">
                <MessageSquare className="w-4 h-4" /> {thread.replies} svar
              </button>
              <span className="flex items-center gap-1.5 px-3 py-1.5">
                <Eye className="w-4 h-4" /> {thread.views.toLocaleString("sv-SE")}
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors ml-auto font-medium">
                <Share2 className="w-4 h-4" /> Dela
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors font-medium">
                <Bookmark className="w-4 h-4" /> Spara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply composer */}
      <div className="mt-4 bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Svara som <span className="text-foreground">Gäst</span></p>
        <Textarea
          placeholder="Vad tänker du?"
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
      <div className="mt-6">
        <p className="text-sm font-medium text-foreground mb-4">{thread.replies} svar</p>

        <div className="space-y-2">
          {thread.replyData?.map((reply, i) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`bg-card border rounded-xl overflow-hidden ${
                reply.isOP ? "border-primary/20" : "border-border"
              }`}
            >
              <div className="flex">
                <div className="hidden sm:flex flex-col items-center py-3 px-2 bg-muted/30">
                  <VoteColumn
                    count={getReplyVoteCount(reply)}
                    voted={replyVotes[reply.id] || null}
                    onUp={() => handleReplyVote(reply.id, "up")}
                    onDown={() => handleReplyVote(reply.id, "down")}
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">{reply.authorInitials}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground text-sm">{reply.author}</span>
                    <AuthorBadge type={reply.authorBadge} />
                    {reply.isOP && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">OP</span>
                    )}
                    <span className="text-muted-foreground">• {reply.timeAgo}</span>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line mb-2">{reply.content}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="sm:hidden mr-1">
                      <VoteColumn
                        count={getReplyVoteCount(reply)}
                        voted={replyVotes[reply.id] || null}
                        onUp={() => handleReplyVote(reply.id, "up")}
                        onDown={() => handleReplyVote(reply.id, "down")}
                        horizontal
                      />
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-muted transition-colors font-medium">
                      <Reply className="w-3.5 h-3.5" /> Svara
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Sidebar ─── */
const CommunitySidebar = () => (
  <div className="hidden lg:block w-72 shrink-0 space-y-4">
    {/* Community card */}
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/5" />
      <div className="p-4 -mt-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">c/karriär</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Sveriges största community för karriärfrågor. Dela erfarenheter, ställ frågor och hjälp varandra framåt.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 12,4k</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> 347 online
          </span>
        </div>
        <Button size="sm" className="w-full mt-3 gap-2">
          <Plus className="w-3.5 h-3.5" /> Ny tråd
        </Button>
      </div>
    </div>

    {/* Trending */}
    <div className="bg-card border border-border rounded-xl p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <TrendingUp className="w-4 h-4 text-primary" /> Trendar just nu
      </h4>
      <div className="space-y-2.5">
        {[
          { tag: "löneförhandling", count: "2.1k" },
          { tag: "karriärväxling", count: "1.8k" },
          { tag: "remote", count: "1.2k" },
          { tag: "intervjutips", count: "980" },
          { tag: "bootcamp", count: "640" },
        ].map((t) => (
          <div key={t.tag} className="flex items-center justify-between text-xs group cursor-pointer">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">#{t.tag}</span>
            <span className="text-muted-foreground/60">{t.count} inlägg</span>
          </div>
        ))}
      </div>
    </div>

    {/* Rules */}
    <div className="bg-card border border-border rounded-xl p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <Award className="w-4 h-4 text-primary" /> Regler
      </h4>
      <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside">
        <li>Var respektfull mot alla</li>
        <li>Inga personangrepp</li>
        <li>Håll diskussionen on-topic</li>
        <li>Ingen spam eller reklam</li>
      </ol>
    </div>
  </div>
);

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-serif text-lg font-semibold text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
            <div className="hidden sm:flex h-5 w-px bg-border" />
            <span className="hidden sm:block text-sm text-muted-foreground">Trådar</span>
          </div>
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Sök trådar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border-transparent text-sm rounded-full focus-visible:border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-8">Logga in</Button>
            <Button size="sm" className="text-xs h-8 px-4">Kom igång</Button>
          </div>
        </div>
      </nav>

      <div className="pt-12 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-6 py-5">
          {/* Main feed */}
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
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Sort tabs + filter */}
                  <div className="bg-card border border-border rounded-xl p-2 mb-3 flex items-center gap-1 flex-wrap">
                    {[
                      { id: "hot", label: "Hett", icon: Flame },
                      { id: "new", label: "Nytt", icon: Clock },
                      { id: "top", label: "Topp", icon: TrendingUp },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSortBy(s.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            sortBy === s.id
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {s.label}
                        </button>
                      );
                    })}

                    <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

                    {/* Category filter */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === "all"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Alla
                      </button>
                      {Object.entries(categories).map(([id, cat]) => (
                        <button
                          key={id}
                          onClick={() => setSelectedCategory(id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedCategory === id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="text-sm">{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Mobile search */}
                    <div className="relative md:hidden ml-auto">
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Thread list */}
                  <div className="space-y-2">
                    {sortedThreads.map((thread, i) => (
                      <ThreadCard
                        key={thread.id}
                        thread={thread}
                        index={i}
                        votedThreads={votedThreads}
                        savedThreads={savedThreads}
                        handleVote={handleVote}
                        toggleSave={toggleSave}
                        getVoteCount={getVoteCount}
                        onClick={() => thread.replyData ? setActiveThread(thread.id) : undefined}
                      />
                    ))}
                  </div>

                  <div className="mt-6 text-center pb-8">
                    <Button variant="outline" size="sm" className="text-muted-foreground text-xs">
                      Visa fler trådar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          {!activeThread && <CommunitySidebar />}
        </div>
      </div>
    </div>
  );
};

export default Threads;
