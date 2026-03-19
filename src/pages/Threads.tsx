import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Eye, Search, ArrowLeft, Bookmark, Reply, Share2,
  Send, Shield, Zap, Crown, ThumbsUp, Plus, TrendingUp,
  Users, Clock, Award, Briefcase, GraduationCap, Building2,
  DollarSign, Lightbulb, Heart, ChevronRight, X, Handshake,
  Scale, Globe, Code, Stethoscope, Palette, BarChart3, Rocket,
  BookOpen, UserCheck, Pin, ChevronDown,
  Menu, MessageCircleQuestion, EyeIcon, Quote, CornerDownRight,
  Feather, Hash, ArrowRight, Flame, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import UserHoverCard from "@/components/UserHoverCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  color: string;
}

const categories: Record<string, CategoryDef> = {
  karriar_utbildning: { label: "Karriär & Utbildning", description: "Karriärväxling, utbildning och mentorskap", icon: Rocket, color: "bg-primary/10 text-primary" },
  cv_jobbsokning: { label: "CV & Jobbsökning", description: "CV, intervjuer och nätverk", icon: GraduationCap, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  lon_forhandling: { label: "Lön & Förhandling", description: "Lön, förmåner och förhandling", icon: DollarSign, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
  arbetsliv: { label: "Arbetsliv", description: "Arbetsmiljö, ledarskap, remote & hybrid", icon: Building2, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  bransch_erfarenheter: { label: "Bransch & Erfarenheter", description: "Tech, vård, kreativt, ekonomi", icon: Globe, color: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" },
  allmant: { label: "Allmänt", description: "Allt annat", icon: MessageSquare, color: "bg-muted text-muted-foreground" },
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
    category: "karriar_utbildning",
    content: "Efter 8 år som mellanstadielärare kände jag att jag behövde en förändring. Började med onlinekurser på kvällar och helger, byggde en portfolio parallellt med jobbet och fick till slut min första UX-roll. AMA!",
    likes: 234,
    replies: 67,
    views: 2841,
    timeAgo: "3h",
    isPinned: true,
    tags: ["karriärväxling", "UX"],
    industry: "Tech",
    experienceLevel: "Mid-level",
    replyData: [
      {
        id: "k1", author: "JohanL", authorInitials: "JL", authorBadge: "verified",
        content: "Otroligt inspirerande! Hur lång tid tog det från första kursen till att du fick jobbet?",
        likes: 45, timeAgo: "2h",
        children: [
          { id: "k1-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Ungefär 14 månader totalt. De första 6 månaderna var mest teori, sen började jag bygga projekt på riktigt.", likes: 32, timeAgo: "1h 50min", parentId: "k1" },
          { id: "k1-2", author: "SaraB", authorInitials: "SB", content: "14 månader är faktiskt imponerande snabbt! Jobbade du heltid som lärare samtidigt?", likes: 18, timeAgo: "1h 40min", parentId: "k1-1", quotedReply: { author: "EmmaK", content: "Ungefär 14 månader totalt." } },
          { id: "k1-3", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Ja, heltid som lärare dagtid. Pluggade kvällar och helger. Var brutalt, men loven var guld värda.", likes: 28, timeAgo: "1h 30min", parentId: "k1-2" },
        ],
      },
      {
        id: "k2", author: "MarcusW", authorInitials: "MW",
        content: "Funderar på samma resa men från ekonom. Vilka kurser rekommenderar du? Google UX Certificate eller Interaction Design Foundation?",
        likes: 38, timeAgo: "2h",
        children: [
          { id: "k2-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Google UX Certificate var min startpunkt — bra grundförståelse. Sen gick jag vidare med Designlab som har mentorer. IDF är bra för teori men saknar praktiska projekt.", likes: 41, timeAgo: "1h 45min", parentId: "k2" },
          { id: "k2-2", author: "UXDesignerLisa", authorInitials: "UL", authorBadge: "verified", content: "Håller med om Google-certifikatet som start. Men viktigaste är att bygga en bra portfolio — det trumfar alla certifikat.", likes: 55, timeAgo: "1h 30min", parentId: "k2-1" },
        ],
      },
      { id: "k3", author: "AnnaS", authorInitials: "AS", content: "Var det en stor löneskillnad? Lärarlöner är ju inte fantastiska men UX-designer kan väl variera mycket?", likes: 29, timeAgo: "2h 10min" },
      {
        id: "k4", author: "KristofferN", authorInitials: "KN", authorBadge: "top",
        content: "Som rekryterare inom tech kan jag säga att karriärväxlare ofta har ett unikt perspektiv. Lärare specifikt är bra på att förklara komplexa saker — superviktigt i UX.",
        likes: 67, timeAgo: "2h 15min",
        children: [
          { id: "k4-1", author: "DevPontus", authorInitials: "DP", content: "100% detta. Vår bästa UX:are var fd sjuksköterska. Empati och kommunikation slår allt.", likes: 34, timeAgo: "2h", parentId: "k4" },
        ],
      },
      {
        id: "k5", author: "NathalieR", authorInitials: "NR",
        content: "Jag är lärare nu och har tänkt samma sak i typ 2 år men vågar inte ta steget. Hur hanterade du rädslan?",
        likes: 52, timeAgo: "2h 20min",
        children: [
          { id: "k5-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Jag började smått — en kurs i taget. Sa inte upp mig förrän jag hade fått ett jobberbjudande. Att ha en plan B gjorde det lättare.", likes: 44, timeAgo: "2h 5min", parentId: "k5" },
          { id: "k5-2", author: "NathalieR", authorInitials: "NR", content: "Det låter klokt. Tror jag bygger upp det till något större i huvudet än vad det behöver vara.", likes: 19, timeAgo: "1h 55min", parentId: "k5-1" },
        ],
      },
      { id: "k6", author: "FredrikÖ", authorInitials: "FÖ", content: "Grymt jobbat! Hur reagerade kollegor/chefer när du sa upp dig? Lärarbrist brukar ge skuldkänslor.", likes: 23, timeAgo: "2h 30min" },
      {
        id: "k7", author: "CarolineH", authorInitials: "CH", authorBadge: "verified",
        content: "Bytte själv från jurist till produktdesigner för 3 år sedan. Bästa beslutet jag tagit. Saknar inget från advokatbyrån!",
        likes: 71, timeAgo: "2h 35min",
        children: [
          { id: "k7-1", author: "JuristJohan", authorInitials: "JJ", content: "Wow, det är ett ännu större hopp! Hur lång tid tog din övergång?", likes: 15, timeAgo: "2h 20min", parentId: "k7" },
          { id: "k7-2", author: "CarolineH", authorInitials: "CH", authorBadge: "verified", content: "Ca 18 månader. Gick ett bootcamp på Hyper Island parallellt med jobbet.", likes: 33, timeAgo: "2h 10min", parentId: "k7-1" },
        ],
      },
      { id: "k8", author: "AlexD", authorInitials: "AD", content: "Vilka verktyg lärde du dig först? Figma antar jag?", likes: 14, timeAgo: "2h 40min" },
      {
        id: "k9", author: "OliviaE", authorInitials: "OE",
        content: "Jag är förskollärare och drömmer om tjänstedesign. Tror du mina erfarenheter kan vara relevanta?",
        likes: 31, timeAgo: "2h 45min",
        children: [
          { id: "k9-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Absolut! Förskollärare har fantastisk empati och observation — grundläggande i design thinking. Kör på!", likes: 38, timeAgo: "2h 30min", parentId: "k9" },
        ],
      },
      {
        id: "k10", author: "DanielG", authorInitials: "DG",
        content: "Fick du imposter syndrome i början? Hur hanterade du det bland folk med designutbildning?",
        likes: 47, timeAgo: "3h",
        children: [
          { id: "k10-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Massor! Första månaden var jag övertygad om att de gjort ett misstag. Men min chef sa att de anställde mig för mitt perspektiv, inte för att jag var en kopia av alla andra.", likes: 62, timeAgo: "2h 45min", parentId: "k10" },
        ],
      },
      { id: "k11", author: "ViktorA", authorInitials: "VA", content: "Hur ser en typisk dag ut som UX-designer på Spotify? Nyfiken!", likes: 21, timeAgo: "3h 10min" },
      { id: "k12", author: "ElinF", authorInitials: "EF", content: "Sparar denna tråd! Har funderat på att byta från marknadsföring till UX research.", likes: 16, timeAgo: "3h 15min" },
      {
        id: "k13", author: "TobiasK", authorInitials: "TK", authorBadge: "top",
        content: "Tips till alla som vill byta: börja med att ta på er UX-uppgifter på nuvarande jobb. Frivillig redesign av interna verktyg t.ex. Bygger erfarenhet utan risk.",
        likes: 83, timeAgo: "3h 20min",
        children: [
          { id: "k13-1", author: "RebeckaL", authorInitials: "RL", content: "Smart! Jag föreslog att redesigna vårt intranät och chefen sa ja direkt. Perfekt portfolio-projekt.", likes: 27, timeAgo: "3h 5min", parentId: "k13" },
        ],
      },
      { id: "k14", author: "IbrahimM", authorInitials: "IM", content: "Hur viktigt var nätverkande i din jobbsökning? Kontakter eller ren ansökan?", likes: 19, timeAgo: "3h 30min" },
      { id: "k15", author: "MalinP", authorInitials: "MP", content: "Fantastisk story! Hade du någon mentor under resan?", likes: 13, timeAgo: "3h 35min" },
      {
        id: "k16", author: "PatrikS", authorInitials: "PS",
        content: "Jag gjorde liknande resa — från polis till frontend-utvecklare. Det går om man verkligen vill. Modet är det svåraste.",
        likes: 56, timeAgo: "3h 40min",
        children: [
          { id: "k16-1", author: "SofiaJ", authorInitials: "SJ", content: "Från polis!? Det vill jag höra mer om! Starta en egen tråd?", likes: 22, timeAgo: "3h 25min", parentId: "k16" },
          { id: "k16-2", author: "PatrikS", authorInitials: "PS", content: "Haha kanske! Kortversionen: tröttnade på skiftjobb, lärde mig koda via freeCodeCamp, fick internship efter 10 månader.", likes: 31, timeAgo: "3h 15min", parentId: "k16-1" },
        ],
      },
      { id: "k17", author: "AmandaW", authorInitials: "AW", content: "Var det svårt att bygga portfolio utan riktig arbetslivserfarenhet inom UX?", likes: 24, timeAgo: "4h" },
      { id: "k18", author: "OskarH", authorInitials: "OH", content: "Hur många jobb sökte du innan du fick napp?", likes: 17, timeAgo: "4h 10min" },
      {
        id: "k19", author: "JennyT", authorInitials: "JT", authorBadge: "verified",
        content: "Som UX-lead vill jag säga: vi ÄLSKAR karriärväxlare. Ni tar med er perspektiv vi inte kan få från designskolor. Fortsätt söka — rätt företag ser värdet.",
        likes: 91, timeAgo: "4h 15min",
      },
      { id: "k20", author: "SimonR", authorInitials: "SR", content: "Vilken lön landade du på som junior UX-designer? Om du vill dela såklart.", likes: 33, timeAgo: "4h 20min" },
      { id: "k21", author: "HannaK", authorInitials: "HK", content: "Använder du dina pedagogiska skills i UX-arbetet? T.ex. user onboarding?", likes: 15, timeAgo: "4h 30min" },
      {
        id: "k22", author: "RasmusB", authorInitials: "RB",
        content: "Det behöver inte vara allt eller inget. Jag jobbar 80% som lärare och frilansdesignar 20%. Bästa av två världar.",
        likes: 42, timeAgo: "4h 35min",
        children: [
          { id: "k22-1", author: "EmmaK", authorInitials: "EK", isOP: true, content: "Det är ett jättebra alternativ! Önskar att jag hade vetat om det som en möjlighet tidigare.", likes: 19, timeAgo: "4h 20min", parentId: "k22" },
        ],
      },
      { id: "k23", author: "ÅsaL", authorInitials: "ÅL", content: "Hur ser arbetsmarknaden ut just nu för junior UX-designers? Hör blandade signaler.", likes: 26, timeAgo: "4h 40min" },
      { id: "k24", author: "ErikV", authorInitials: "EV", content: "Snyggt jobbat! Hur var intervjuprocessen? Vad frågade de om?", likes: 11, timeAgo: "4h 45min" },
      { id: "k25", author: "KlaraM", authorInitials: "KM", content: "Jag går en bootcamp nu — detta ger mig hopp! Tack för att du delar din resa.", likes: 20, timeAgo: "5h" },
      {
        id: "k26", author: "MagnusF", authorInitials: "MF", authorBadge: "top",
        content: "Viktigt att nämna: UX är brett. Research, interaction design, service design, content design... Hitta er nisch tidigt.",
        likes: 58, timeAgo: "5h 10min",
      },
      { id: "k27", author: "LinnéaS", authorInitials: "LS", content: "Hade du portfolio-review med någon innan du sökte? Eller körde du solo?", likes: 9, timeAgo: "5h 15min" },
      { id: "k28", author: "AntonJ", authorInitials: "AJ", content: "Hur var onboardingen på Spotify? Kände du dig förberedd?", likes: 14, timeAgo: "5h 20min" },
      { id: "k29", author: "IdaG", authorInitials: "IG", content: "Tråden jag behövde idag. Tack alla som delar! ❤️", likes: 37, timeAgo: "5h 30min" },
      {
        id: "k30", author: "NiklasE", authorInitials: "NE",
        content: "Obs att Stockholm vs resten av Sverige är helt olika marknader. I Stockholm finns fler möjligheter men också mycket mer konkurrens.",
        likes: 44, timeAgo: "5h 35min",
        children: [
          { id: "k30-1", author: "LenaW", authorInitials: "LW", content: "Sant! Jag bor i Umeå och det finns typ 3 UX-jobb per år här. Remote är räddningen.", likes: 21, timeAgo: "5h 20min", parentId: "k30" },
        ],
      },
      { id: "k31", author: "FilipA", authorInitials: "FA", content: "Vad tycker du om AI:s påverkan på UX-yrket? Orolig att det automatiseras.", likes: 28, timeAgo: "5h 40min" },
      { id: "k32", author: "EllaT", authorInitials: "ET", content: "Gick du på några meetups eller konferenser? UX-communityt i Stockholm verkar aktivt.", likes: 12, timeAgo: "5h 45min" },
      { id: "k33", author: "GustavL", authorInitials: "GL", content: "Jag byter från säljare till UX just nu. Tack för inspirationen!", likes: 18, timeAgo: "6h" },
      { id: "k34", author: "MiaR", authorInitials: "MR", content: "Hur satte du upp din portfolio? Egen hemsida eller Behance/Dribbble?", likes: 22, timeAgo: "6h 10min" },
      { id: "k35", author: "JoelK", authorInitials: "JK", content: "Fint att se att det går! Har du kontakt med andra fd lärare som bytt bana?", likes: 8, timeAgo: "6h 20min" },
      {
        id: "k36", author: "SandraP", authorInitials: "SP", authorBadge: "verified",
        content: "Pro-tip: gå med i ADPList för gratis mentorship. Finns otroligt generösa designers som hjälper karriärväxlare.",
        likes: 63, timeAgo: "6h 30min",
      },
      { id: "k37", author: "LudvigM", authorInitials: "LM2", content: "Läste du nåt om tillgänglighet (a11y)? Känslan är att det blir allt viktigare.", likes: 16, timeAgo: "6h 35min" },
      { id: "k38", author: "WilmaÖ", authorInitials: "WÖ", content: "Saknar du läraryrket ibland? Eller var det en ren lättnad?", likes: 25, timeAgo: "7h" },
      { id: "k39", author: "MaxN", authorInitials: "MN", content: "Hur många timmar i veckan la du på studier utanför jobbet?", likes: 19, timeAgo: "7h 10min" },
      { id: "k40", author: "FridaC", authorInitials: "FC", content: "Tråden blev ju en hel masterclass! Borde pinnas. 📌", likes: 41, timeAgo: "7h 20min" },
    ],
  },
  {
    id: "2",
    title: "Vad är rimlig ingångslön som nyexaminerad civilingenjör 2025?",
    author: "TechAnton",
    authorInitials: "TA",
    authorRole: "Student — KTH",
    category: "lon_forhandling",
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
    category: "cv_jobbsokning",
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
    category: "cv_jobbsokning",
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
    category: "arbetsliv",
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
        id: "r1", author: "PsykologPer", authorInitials: "PP", authorBadge: "verified",
        content: "Som psykolog ser jag det här mönstret ofta. Söndagsångest, passiv-aggressiv kommunikation, övervakning — klassiska tecken på en toxisk miljö.\n\nMin tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka.",
        likes: 234, timeAgo: "45 min",
        children: [
          { id: "r1-1", author: "AnonymAnvändare", authorInitials: "AA", content: "Tack för det professionella perspektivet! Söndagsångesten är verklig — har du tips på hur man hanterar den kortsiktigt medan man söker nytt?", likes: 45, timeAgo: "30 min", isOP: true, parentId: "r1", quotedReply: { author: "PsykologPer", content: "Min tumregel: om du mår fysiskt dåligt av tanken på jobbet, är det dags att börja söka." } },
          { id: "r1-2", author: "PsykologPer", authorInitials: "PP", authorBadge: "verified", content: "Absolut! Tre saker som hjälper direkt:\n1. Sätt gränser — sluta kolla jobbmail efter kl 17\n2. Fysisk aktivitet söndag eftermiddag\n3. Skriv ner vad du oroar dig för — det brukar vara mindre skrämmande på papper", likes: 89, timeAgo: "20 min", parentId: "r1-1", quotedReply: { author: "AnonymAnvändare", content: "har du tips på hur man hanterar den kortsiktigt medan man söker nytt?" } },
        ],
      },
      {
        id: "r2", author: "VarDärSjälv", authorInitials: "VS",
        content: "Jag var i exakt samma sits för 2 år sedan. Stannade alldeles för länge pga lönen. Till slut blev jag sjukskriven i 3 månader.\n\nBytte jobb, gick ner 3k i lön men det var ABSOLUT värt det.",
        likes: 189, timeAgo: "2h",
        children: [
          { id: "r2-1", author: "KarriärCoachMia", authorInitials: "KC", authorBadge: "verified", content: "Det här är tyvärr väldigt vanligt. Lönen blir en \"golden cage\". Bra att du tog steget! Hur lång tid tog det innan du kände skillnaden?", likes: 34, timeAgo: "1h 30min", parentId: "r2", quotedReply: { author: "VarDärSjälv", content: "Bytte jobb, gick ner 3k i lön men det var ABSOLUT värt det." } },
        ],
      },
      { id: "r3", author: "AnonymAnvändare", authorInitials: "AA", content: "Tack för alla svar! Det bekräftar vad jag redan kände innerst inne. Ska börja söka direkt. Hur hanterade ni uppsägningen?", likes: 67, timeAgo: "1h", isOP: true },
      { id: "r4", author: "HRSara", authorInitials: "HS", authorBadge: "verified", content: "HR-perspektiv: Var diplomatisk. 'Jag har fått ett erbjudande jag inte kan tacka nej till' räcker gott. Dokumentera allt som händer ifall du behöver det senare.", likes: 145, timeAgo: "50 min", quotedReply: { author: "AnonymAnvändare", content: "Hur hanterade ni uppsägningen?" } },
      { id: "r5", author: "DevJohan", authorInitials: "DJ", content: "Hot take: ibland är det bättre att prata med chefen först. Jag hade en toxic chef men det visade sig att hen inte ens var medveten om sitt beteende. Men om det inte funkar — spring. 🏃‍♂️", likes: 56, timeAgo: "30 min" },
    ],
  },
  {
    id: "6",
    title: "Remote vs kontor — vad föredrar ni och varför?",
    author: "FreelanceFreda",
    authorInitials: "FF",
    authorRole: "Frilansare",
    authorBadge: "top",
    category: "arbetsliv",
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
    category: "lon_forhandling",
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
    category: "karriar_utbildning",
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
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
      <Shield className="w-3 h-3" /> Verifierad
    </span>
  );
  if (type === "mod") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
      <Crown className="w-3 h-3" /> Mod
    </span>
  );
  if (type === "top") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded-full">
      <Zap className="w-3 h-3" /> Top
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
  { id: "views", label: "Mest lästa", icon: EyeIcon },
] as const;

/* ═══════════════════════════════════════════════
   CATEGORY OVERVIEW
   ═══════════════════════════════════════════════ */
const CategoryOverview = ({
  onSelectCategory, searchQuery, setSearchQuery, allThreads,
}: {
  onSelectCategory: (id: string) => void; searchQuery: string;
  setSearchQuery: (q: string) => void; allThreads: Thread[];
}) => {
  const allCats = Object.entries(categories);
  const filteredCats = searchQuery
    ? allCats.filter(([, cat]) =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCats;

  const totalThreads = allThreads.length;
  const totalReplies = allThreads.reduce((s, t) => s + t.replies, 0);

  // Get trending threads
  const trendingThreads = [...allThreads]
    .sort((a, b) => (b.likes + b.replies * 3) - (a.likes + a.replies * 3))
    .slice(0, 3);

  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Sveriges professionella community
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3">
          Diskutera, lär dig,<br />
          <span className="text-primary italic">väx.</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Karriärråd, branschinsikter och professionella samtal — allt samlat på ett ställe.
        </p>
      </div>


      {/* Search */}
      <div className="relative mb-10 max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Sök trådar, ämnen eller kategorier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-12 bg-card border-border text-sm rounded-xl shadow-sm"
        />
      </div>


      {/* Trending threads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-base text-foreground">Populärt just nu</h2>
          </div>
          <span className="text-xs text-muted-foreground">Topp {trendingThreads.length}</span>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Rubrik</span>
          <span>Kategori</span>
          <span>Senaste svar</span>
          <span className="text-right">Visningar</span>
          <span className="text-right">Svar</span>
        </div>

        <div className="divide-y divide-border">
          {trendingThreads.map((thread, i) => {
            const cat = categories[thread.category];
            const lastReply = thread.replyData?.[thread.replyData.length - 1];
            return (
              <motion.button
                key={thread.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => onSelectCategory(thread.category)}
                className="w-full text-left group hover:bg-muted/30 transition-colors"
              >
                {/* Mobile */}
                <div className="sm:hidden p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-serif font-bold text-primary/30 select-none mt-0.5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-2 leading-snug">
                        {thread.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        av <UserHoverCard username={thread.author} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">{thread.author}</UserHoverCard> · {cat?.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.replies}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 items-center px-4 py-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <span className="text-base font-serif font-bold text-primary/25 select-none w-5 text-center shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-1 leading-snug">
                        {thread.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">av <UserHoverCard username={thread.author} className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors">{thread.author}</UserHoverCard></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{cat?.label}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {lastReply ? (
                      <div className="flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 shrink-0 text-muted-foreground/50" />
                        <div className="min-w-0">
                          <span className="block truncate"><UserHoverCard username={lastReply.author} className="text-xs text-muted-foreground hover:text-primary transition-colors">{lastReply.author}</UserHoverCard></span>
                          <span className="text-[10px] text-muted-foreground/60">{lastReply.timeAgo} sedan</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="w-3 h-3" />
                    {thread.replies}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── All Threads — Structured list ─── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-base text-foreground">Senaste trådar</h2>
          </div>
          <span className="text-xs text-muted-foreground">{allThreads.length} trådar</span>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Rubrik</span>
          <span>Kategori</span>
          <span>Senaste svar</span>
          <span className="text-right">Visningar</span>
          <span className="text-right">Svar</span>
        </div>

        {/* Thread rows */}
        <div className="divide-y divide-border">
          {[...allThreads]
            .sort((a, b) => {
              const timeA = timeToMinutes(a.timeAgo);
              const timeB = timeToMinutes(b.timeAgo);
              return timeA - timeB;
            })
            .map((thread, i) => {
              const cat = categories[thread.category];
              const lastReply = thread.replyData?.[thread.replyData.length - 1];
              return (
                <motion.button
                  key={thread.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelectCategory(thread.category)}
                  className="w-full text-left group hover:bg-muted/30 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-2 leading-snug">
                          {thread.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          av <UserHoverCard username={thread.author} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">{thread.author}</UserHoverCard> · {cat?.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.replies}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 items-center px-4 py-3">
                    {/* Title + author */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-1 leading-snug">
                        {thread.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        av <UserHoverCard username={thread.author} className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors">{thread.author}</UserHoverCard>
                      </p>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{cat?.label}</span>
                    </div>

                    {/* Last reply */}
                    <div className="text-xs text-muted-foreground">
                      {lastReply ? (
                        <div className="flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3 shrink-0 text-muted-foreground/50" />
                          <div className="min-w-0">
                            <span className="block truncate"><UserHoverCard username={lastReply.author} className="text-xs text-muted-foreground hover:text-primary transition-colors">{lastReply.author}</UserHoverCard></span>
                            <span className="text-[10px] text-muted-foreground/60">{lastReply.timeAgo} sedan</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </div>

                    {/* Views */}
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}
                    </div>

                    {/* Replies */}
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="w-3 h-3" />
                      {thread.replies}
                    </div>
                  </div>
                </motion.button>
              );
            })}
        </div>
      </div>

      {filteredCats.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Inga kategorier matchade din sökning</p>
        </div>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   THREAD CARD
   ═══════════════════════════════════════════════ */
const ThreadCard = ({
  thread, index, likedThreads, savedThreads, toggleLike, toggleSave, onClick,
}: {
  thread: Thread; index: number; likedThreads: Set<string>; savedThreads: Set<string>;
  toggleLike: (id: string) => void; toggleSave: (id: string) => void; onClick: () => void;
}) => {
  const isLiked = likedThreads.has(thread.id);
  const likeCount = thread.likes + (isLiked ? 1 : 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="group p-4 rounded-xl border border-border bg-card hover:shadow-sm hover:border-primary/20 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3">
        {/* Vote */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(thread.id); }}
            className={`p-1.5 rounded-lg transition-colors ${
              isLiked ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`} />
          </button>
          <span className={`text-xs font-semibold tabular-nums ${isLiked ? "text-primary" : "text-muted-foreground/60"}`}>
            {likeCount}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {thread.isPinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" /> Fäst
              </span>
            )}
            {thread.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
            {thread.title}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Avatar className="w-4 h-4">
                <AvatarFallback className="text-[7px] font-semibold bg-primary/10 text-primary">
                  {thread.authorInitials}
                </AvatarFallback>
              </Avatar>
              <UserHoverCard username={thread.author} className="font-medium text-[11px] text-foreground/70 hover:text-primary transition-colors">{thread.author}</UserHoverCard>
            </div>
            <AuthorBadge type={thread.authorBadge} />
            <span className="text-muted-foreground/40">·</span>
            <span>{thread.timeAgo} sedan</span>
          </div>

          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> {thread.replies}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {thread.views.toLocaleString("sv-SE")}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSave(thread.id); }}
              className={`ml-auto p-1 rounded-lg transition-colors ${
                savedThreads.has(thread.id) ? "text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedThreads.has(thread.id) ? "fill-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Pagination ─── */
const PaginationNav = ({
  currentPage, totalPages, onPageChange,
}: {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6 pt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-xs h-9"
      >
        ← Föregående
      </Button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-xs text-muted-foreground/40">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 text-xs font-medium rounded-lg transition-colors ${
              p === currentPage
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        )
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-xs h-9"
      >
        Nästa →
      </Button>
    </div>
  );
};

/* ─── Reply Item — Reddit/Discourse hybrid ─── */
const ReplyItem = ({
  reply, depth, replyLikes, toggleReplyLike, onQuoteReply,
}: {
  reply: ReplyData; depth: number; replyLikes: Set<string>;
  toggleReplyLike: (id: string) => void; onQuoteReply: (reply: ReplyData) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isReplyLiked = replyLikes.has(reply.id);
  const replyLikeCount = reply.likes + (isReplyLiked ? 1 : 0);
  const maxDepth = 5;
  const effectiveDepth = Math.min(depth, maxDepth);

  // Thread line colors per depth for visual distinction
  const threadColors = [
    "border-primary/25",
    "border-blue-400/25",
    "border-amber-400/25",
    "border-violet-400/25",
    "border-rose-400/25",
    "border-emerald-400/25",
  ];
  const threadColor = threadColors[effectiveDepth % threadColors.length];

  if (collapsed) {
    return (
      <div className={`${effectiveDepth > 0 ? "ml-4 sm:ml-5" : ""}`}>
        <div className={`${effectiveDepth > 0 ? `border-l-2 ${threadColor} pl-3 sm:pl-4` : ""}`}>
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[8px] font-semibold bg-muted text-muted-foreground">
                {reply.authorInitials}
              </AvatarFallback>
            </Avatar>
            <UserHoverCard username={reply.author} className="font-medium text-xs text-muted-foreground hover:text-primary transition-colors">{reply.author}</UserHoverCard>
            <span className="text-muted-foreground/50">·</span>
            <span>{replyLikeCount} poäng</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{reply.timeAgo}</span>
            {reply.children && reply.children.length > 0 && (
              <span className="text-primary/70">({reply.children.length} svar till)</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${effectiveDepth > 0 ? "ml-4 sm:ml-5" : ""}`}>
      <div className={`relative ${effectiveDepth > 0 ? `border-l-2 ${threadColor} pl-3 sm:pl-4` : ""}`}>
        {/* Clickable thread line area for collapsing */}
        {effectiveDepth > 0 && (
          <button
            onClick={() => setCollapsed(true)}
            className="absolute left-[-1px] top-0 bottom-0 w-3 cursor-pointer group z-10"
            title="Fäll ihop tråd"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 group-hover:bg-primary/50 transition-colors rounded-full" />
          </button>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="pt-3 pb-1"
        >
          {/* Header row — avatar + meta */}
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarFallback className={`text-[10px] font-bold ${
                reply.isOP
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}>
                {reply.authorInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <UserHoverCard username={reply.author} className={`text-[13px] font-semibold ${reply.isOP ? "text-primary" : "text-foreground"} hover:underline transition-colors`}>
                {reply.author}
              </UserHoverCard>
              <AuthorBadge type={reply.authorBadge} />
              {reply.isOP && (
                <span className="text-[9px] font-bold text-primary-foreground bg-primary px-1.5 py-px rounded text-center leading-tight">
                  OP
                </span>
              )}
              <span className="text-[11px] text-muted-foreground/50">·</span>
              <span className="text-[11px] text-muted-foreground">{reply.timeAgo} sedan</span>
            </div>

            {/* Collapse button for depth 0 */}
            {effectiveDepth === 0 && reply.children && reply.children.length > 0 && (
              <button
                onClick={() => setCollapsed(true)}
                className="ml-auto text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted"
                title="Fäll ihop"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quoted — Discourse-style expandable quote */}
          {reply.quotedReply && (
            <div className="mb-2 ml-9 rounded-md bg-muted/40 border border-border/50 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border-b border-border/50">
                <CornerDownRight className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {reply.quotedReply.author} skrev:
                </span>
              </div>
              <p className="px-3 py-2 text-xs text-muted-foreground/70 leading-relaxed line-clamp-3 italic">
                {reply.quotedReply.content}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="ml-9">
            <p className="text-[13.5px] text-foreground/90 leading-[1.65] whitespace-pre-line">
              {reply.content}
            </p>

            {/* Action bar — Reddit-style inline */}
            <div className="flex items-center gap-0.5 mt-1.5 -ml-1.5">
              <button
                onClick={() => toggleReplyLike(reply.id)}
                className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-md transition-colors ${
                  isReplyLiked
                    ? "text-primary"
                    : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isReplyLiked ? "fill-primary" : ""}`} />
                <span className="tabular-nums">{replyLikeCount}</span>
              </button>
              <button
                onClick={() => onQuoteReply(reply)}
                className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 px-2 py-1 rounded-md transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                Svara
              </button>
              <button
                onClick={() => onQuoteReply(reply)}
                className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 px-2 py-1 rounded-md transition-colors"
              >
                <Quote className="w-3.5 h-3.5" />
                Citera
              </button>
              <button className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 px-2 py-1 rounded-md transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Dela
              </button>
            </div>
          </div>
        </motion.div>

        {/* Child replies */}
        {reply.children && reply.children.length > 0 && (
          <div>
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

/* ─── Detail View — Reddit post + Discourse reply layout ─── */
const ThreadDetail = ({
  thread, onBack, likedThreads, toggleLike, onAddReply,
}: {
  thread: Thread; onBack: () => void; likedThreads: Set<string>;
  toggleLike: (id: string) => void;
  onAddReply: (threadId: string, content: string, quoted?: { author: string; content: string }) => void;
}) => {
  const [replyLikes, setReplyLikes] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [quotedReply, setQuotedReply] = useState<{ author: string; content: string } | null>(null);
  const [sortReplies, setSortReplies] = useState<"top" | "new" | "old">("top");
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
    const snippet = reply.content.length > 150 ? reply.content.substring(0, 150) + "..." : reply.content;
    setQuotedReply({ author: reply.author, content: snippet });
    replyRef.current?.focus();
    replyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const clearQuote = () => setQuotedReply(null);

  const countAllReplies = (replies: ReplyData[]): number =>
    replies.reduce((sum, r) => sum + 1 + (r.children ? countAllReplies(r.children) : 0), 0);
  const totalReplyCount = thread.replyData ? countAllReplies(thread.replyData) : thread.replies;

  // Sort top-level replies
  const sortedReplies = useMemo(() => {
    if (!thread.replyData) return [];
    const sorted = [...thread.replyData];
    switch (sortReplies) {
      case "top": return sorted.sort((a, b) => b.likes - a.likes);
      case "new": return sorted.sort((a, b) => timeToMinutes(a.timeAgo) - timeToMinutes(b.timeAgo));
      case "old": return sorted.sort((a, b) => timeToMinutes(b.timeAgo) - timeToMinutes(a.timeAgo));
      default: return sorted;
    }
  }, [thread.replyData, sortReplies]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka
      </button>

      {/* ─── Original Post Card — Reddit-style with vote sidebar ─── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
        {/* Category bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${cat?.color || "bg-muted text-muted-foreground"}`}>
            <CatIcon className="w-3 h-3" /> {cat?.label}
          </span>
          {thread.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
              {tag}
            </span>
          ))}
          <span className="text-[11px] text-muted-foreground ml-auto">{thread.timeAgo} sedan</span>
        </div>

        <div className="flex">
          {/* Vote sidebar — Reddit-style */}
          <div className="hidden sm:flex flex-col items-center gap-1 py-4 px-3 bg-muted/20 border-r border-border">
            <button
              onClick={() => toggleLike(thread.id)}
              className={`p-1.5 rounded-md transition-all ${
                isLiked
                  ? "text-primary bg-primary/10 scale-110"
                  : "text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-primary" : ""}`} />
            </button>
            <span className={`text-sm font-bold tabular-nums ${isLiked ? "text-primary" : "text-muted-foreground"}`}>
              {likeCount}
            </span>
          </div>

          {/* Post content */}
          <div className="flex-1 p-5">
            {/* Title */}
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-snug mb-3">
              {thread.title}
            </h1>

            {/* Author row */}
            <div className="flex items-center gap-2.5 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs font-bold bg-primary/15 text-primary ring-1 ring-primary/20">
                  {thread.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 flex-wrap">
                <UserHoverCard username={thread.author} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">{thread.author}</UserHoverCard>
                <AuthorBadge type={thread.authorBadge} />
                <span className="text-xs text-muted-foreground">· {thread.authorRole}</span>
              </div>
            </div>

            {/* Body */}
            <div className="text-[14.5px] text-foreground/90 leading-[1.75] whitespace-pre-line">
              {thread.content}
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-0.5 mt-5 pt-3 border-t border-border -mx-1">
              {/* Mobile vote (hidden on sm+) */}
              <button
                onClick={() => toggleLike(thread.id)}
                className={`sm:hidden flex items-center gap-1.5 text-[13px] font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                  isLiked ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:bg-muted"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`} />
                {likeCount}
              </button>
              <button
                onClick={() => replyRef.current?.focus()}
                className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {totalReplyCount} svar
              </button>
              <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground/40 px-2.5 py-1.5">
                <Eye className="w-4 h-4" />
                {thread.views.toLocaleString("sv-SE")}
              </span>
              <div className="ml-auto flex items-center gap-0.5">
                <button className="p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/60 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/60 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Reply composer ─── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[9px] font-semibold bg-muted text-muted-foreground">G</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground">
            {quotedReply ? `Svarar på ${quotedReply.author}s inlägg` : "Skriv ett svar"}
          </span>
        </div>

        <div className="p-4">
          <AnimatePresence>
            {quotedReply && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="rounded-md bg-muted/40 border border-border/50 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-muted/60 border-b border-border/50">
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="w-3 h-3 text-muted-foreground/50" />
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {quotedReply.author} skrev:
                      </span>
                    </div>
                    <button onClick={clearQuote} className="p-0.5 text-muted-foreground/50 hover:text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="px-3 py-2 text-xs text-muted-foreground/70 italic line-clamp-2">
                    {quotedReply.content}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Textarea
            ref={replyRef}
            placeholder="Vad tycker du? Dela dina tankar..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px] bg-background border-border resize-none text-sm rounded-lg leading-relaxed focus:min-h-[120px] transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-muted-foreground/40">Markdown stöds</p>
            <Button
              size="sm"
              className="gap-2 px-5 h-9"
              disabled={!replyText.trim()}
              onClick={() => {
                if (!replyText.trim()) return;
                onAddReply(thread.id, replyText.trim(), quotedReply || undefined);
                setReplyText("");
                setQuotedReply(null);
              }}
            >
              <Send className="w-3.5 h-3.5" /> Publicera
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Reply section header with sort ─── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          {totalReplyCount} svar
        </h2>
        <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
          {([ 
            { id: "top" as const, label: "Bäst", icon: Award },
            { id: "new" as const, label: "Nyast", icon: Clock },
            { id: "old" as const, label: "Äldst", icon: Clock },
          ]).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortReplies(s.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                sortReplies === s.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Replies tree ─── */}
      <div>
        {sortedReplies.map((reply) => (
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

      {totalReplyCount === 0 && (
        <div className="text-center py-12 rounded-xl border border-border bg-card">
          <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Inga svar ännu — bli den första!</p>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Sidebar Content ─── */
const SidebarContentBlock = ({
  selectedCategory, onSelectCategory, onBackToOverview, view, onClose, allThreads, onNewThread,
}: {
  selectedCategory: string | null; onSelectCategory: (id: string) => void;
  onBackToOverview: () => void; view: string; onClose?: () => void;
  allThreads: Thread[]; onNewThread?: () => void;
}) => {
  const handleSelectCategory = (catId: string) => { onSelectCategory(catId); onClose?.(); };
  const handleBackToOverview = () => { onBackToOverview(); onClose?.(); };

  return (
    <div className="h-full flex flex-col">
      {/* Stats */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-primary" /> 12 400</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> 347 online</span>
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto py-2">
        <button
          onClick={handleBackToOverview}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all rounded-lg mx-1 ${
            view === "overview"
              ? "text-primary font-semibold bg-primary/5"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          style={{ width: "calc(100% - 8px)" }}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="text-xs font-medium">Alla kategorier</span>
        </button>

        <div className="h-px bg-border mx-4 my-2" />

        {Object.entries(categories).map(([catId, cat]) => {
          const CatIcon = cat.icon;
          const isActive = selectedCategory === catId && view !== "overview";
          const stats = getCategoryStats(catId, allThreads);
          return (
            <button
              key={catId}
              onClick={() => handleSelectCategory(catId)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all rounded-lg mx-1 group ${
                isActive
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={{ width: "calc(100% - 8px)" }}
            >
              <CatIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
              <span className="flex-1 text-left truncate text-xs font-medium">{cat.label}</span>
              <span className="text-[10px] text-muted-foreground/40 tabular-nums">{stats.threadCount}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          size="sm"
          className="w-full gap-2 h-9"
          onClick={() => { onNewThread?.(); onClose?.(); }}
        >
          <Plus className="w-4 h-4" /> Ny tråd
        </Button>
      </div>
    </div>
  );
};

/* ─── Desktop Sidebar ─── */
const CategorySidebar = ({
  collapsed, onToggle, selectedCategory, onSelectCategory, onBackToOverview, view, allThreads, onNewThread,
}: {
  collapsed: boolean; onToggle: () => void; selectedCategory: string | null;
  onSelectCategory: (id: string) => void; onBackToOverview: () => void;
  view: string; allThreads: Thread[]; onNewThread: () => void;
}) => (
  <div className="relative shrink-0 hidden md:flex">
    <motion.aside
      animate={{ width: collapsed ? 0 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden border-r border-border bg-card/50"
    >
      <div style={{ width: "260px" }} className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Kategorier</h2>
          <button onClick={onToggle} className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Fäll in menyn">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
        </div>
        <SidebarContentBlock
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onBackToOverview={onBackToOverview}
          view={view}
          allThreads={allThreads}
          onNewThread={onNewThread}
        />
      </div>
    </motion.aside>
    <AnimatePresence>
      {collapsed && (
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          onClick={onToggle}
          className="absolute top-3 left-2 z-10 p-1.5 rounded-lg bg-card border border-border shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Visa menyn"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Create Thread View ─── */
const CreateThreadView = ({
  onSubmit, onCancel, defaultCategory,
}: {
  onSubmit: (thread: { title: string; content: string; category: string; tags: string[] }) => void;
  onCancel: () => void; defaultCategory: string | null;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const canSubmit = title.trim().length >= 5 && content.trim().length >= 10 && !!category;

  const handleAddTag = () => {
    const tag = tagsInput.trim().toLowerCase();
    if (tag && tags.length < 5 && !tags.includes(tag)) { setTags([...tags, tag]); setTagsInput(""); }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAddTag(); }
    if (e.key === "Backspace" && !tagsInput && tags.length > 0) setTags(tags.slice(0, -1));
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!category) toast.error("Välj en kategori");
      else if (title.trim().length < 5) toast.error("Rubriken måste vara minst 5 tecken");
      else if (content.trim().length < 10) toast.error("Brödtexten måste vara minst 10 tecken");
      return;
    }
    onSubmit({ title: title.trim(), content: content.trim(), category, tags });
    toast.success("Din tråd har publicerats!");
  };

  React.useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory]);

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Starta en ny tråd</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Dela en fråga, erfarenhet eller insikt</p>
        </div>
      </div>

      {/* Category selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-foreground block mb-2">Välj kategori</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([catId, cat]) => {
            const CatIcon = cat.icon;
            const isSelected = category === catId;
            return (
              <button
                key={catId}
                onClick={() => setCategory(catId)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all rounded-lg border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Rubrik *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
          className="w-full bg-transparent font-serif text-xl sm:text-2xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none border-b border-border pb-3 focus:border-primary transition-colors"
        />
        <div className="flex items-center justify-between mt-1.5">
          {title.length > 0 && title.length < 5 && (
            <p className="text-[11px] text-destructive">Minst 5 tecken</p>
          )}
          <p className="text-[11px] text-muted-foreground ml-auto">{title.length}/300</p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-medium rounded-full">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-destructive ml-0.5"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              type="text"
              placeholder={tags.length === 0 ? "Lägg till taggar..." : "Fler taggar..."}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value.replace(",", ""))}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              maxLength={30}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none py-1 w-36"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <Textarea
          placeholder="Beskriv din fråga, erfarenhet eller tanke..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          className="w-full min-h-[220px] bg-background text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/30 border-border resize-none rounded-lg"
        />
        <div className="flex items-center justify-between mt-1.5">
          {content.length > 0 && content.length < 10 && (
            <p className="text-[11px] text-destructive">Minst 10 tecken</p>
          )}
          <p className="text-[11px] text-muted-foreground ml-auto">{content.length}/5000</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-5 border-t border-border">
        <p className="text-[10px] text-muted-foreground/50 max-w-xs">
          Genom att publicera godkänner du Chappies communityregler.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="h-9 px-5 text-xs" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            size="sm"
            className="h-9 px-6 gap-2"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <Send className="w-3.5 h-3.5" /> Publicera
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const Threads = () => {
  const isMobile = useIsMobile();
  const [allThreads, setAllThreads] = useState<Thread[]>(initialThreads);
  const [view, setView] = useState<"overview" | "category" | "detail" | "create">("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedThreads, setLikedThreads] = useState<Set<string>>(new Set());
  const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLike = (id: string) => {
    setLikedThreads((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };
  const toggleSave = (id: string) => {
    setSavedThreads((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleSelectCategory = (catId: string) => { setSelectedCategory(catId); setView("category"); setSearchQuery(""); setCurrentPage(1); };
  const handleOpenThread = (threadId: string) => { setActiveThread(threadId); setView("detail"); };
  const handleBackToOverview = () => { setView("overview"); setSelectedCategory(null); setSearchQuery(""); setCurrentPage(1); };
  const handleBackToCategory = () => { setView("category"); setActiveThread(null); };

  const handleCreateThread = useCallback((data: { title: string; content: string; category: string; tags: string[] }) => {
    const newThread: Thread = {
      id: `user-${Date.now()}`, title: data.title, author: "Gäst", authorInitials: "G",
      authorRole: "Användare", category: data.category, content: data.content,
      likes: 0, replies: 0, views: 1, timeAgo: "just nu", tags: data.tags, replyData: [],
    };
    setAllThreads(prev => [newThread, ...prev]);
    setSelectedCategory(data.category); setView("detail"); setActiveThread(newThread.id);
  }, []);

  const handleAddReply = useCallback((threadId: string, content: string, quoted?: { author: string; content: string }) => {
    const newReply: ReplyData = {
      id: `reply-${Date.now()}`, author: "Gäst", authorInitials: "G",
      content, likes: 0, timeAgo: "just nu", quotedReply: quoted || undefined,
    };
    setAllThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, replies: t.replies + 1, replyData: [...(t.replyData || []), newReply] };
    }));
    toast.success("Ditt svar har publicerats!");
  }, []);

  const categoryThreads = selectedCategory ? allThreads.filter((t) => t.category === selectedCategory) : [];

  const sortedCategoryThreads = useMemo(() => {
    const sorted = [...categoryThreads].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      switch (sortBy) {
        case "popular": return (b.likes + b.replies * 2) - (a.likes + a.replies * 2);
        case "new": return timeToMinutes(a.timeAgo) - timeToMinutes(b.timeAgo);
        case "top": return b.likes - a.likes;
        case "unanswered": return a.replies - b.replies;
        case "views": return b.views - a.views;
        default: return 0;
      }
    });
    return sorted;
  }, [categoryThreads, sortBy]);

  const totalPages = Math.ceil(sortedCategoryThreads.length / THREADS_PER_PAGE);
  const paginatedThreads = sortedCategoryThreads.slice((currentPage - 1) * THREADS_PER_PAGE, currentPage * THREADS_PER_PAGE);
  const activeThreadData = activeThread ? allThreads.find((t) => t.id === activeThread) : null;
  const selectedCatData = selectedCategory ? categories[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors md:hidden">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-sm text-foreground">Kategorier</h2>
                  </div>
                  <SidebarContentBlock
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    onBackToOverview={handleBackToOverview}
                    view={view}
                    onClose={() => setMobileMenuOpen(false)}
                    allThreads={allThreads}
                    onNewThread={() => { setMobileMenuOpen(false); setView("create"); }}
                  />
                </SheetContent>
              </Sheet>
            )}

            <Link to="/" className="font-serif text-xl font-bold text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 ml-2">
              {[
                { label: "Forum", onClick: handleBackToOverview, active: view === "overview" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    item.active ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {view !== "overview" && view !== "create" && selectedCatData && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
                  <button
                    onClick={() => { setView("category"); setActiveThread(null); }}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {selectedCatData.label}
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm h-9 px-3">
              Logga in
            </Button>
            <Button size="sm" className="text-sm h-9 px-4">
              Kom igång
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Layout ─── */}
      <div className="pt-14 flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Sidebar */}
        {!isMobile && view !== "detail" && (
          <CategorySidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onBackToOverview={handleBackToOverview}
            view={view}
            allThreads={allThreads}
            onNewThread={() => setView("create")}
          />
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              {view === "create" ? (
                <CreateThreadView
                  key="create"
                  onSubmit={handleCreateThread}
                  onCancel={() => selectedCategory ? setView("category") : setView("overview")}
                  defaultCategory={selectedCategory}
                />
              ) : view === "detail" && activeThreadData ? (
                <ThreadDetail
                  key="detail"
                  thread={activeThreadData}
                  onBack={handleBackToCategory}
                  likedThreads={likedThreads}
                  toggleLike={toggleLike}
                  onAddReply={handleAddReply}
                />
              ) : view === "category" && selectedCatData ? (
                <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Category header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${selectedCatData.color}`}>
                        {React.createElement(selectedCatData.icon, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                          {selectedCatData.label}
                        </h1>
                        <p className="text-sm text-muted-foreground">{selectedCatData.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{categoryThreads.length} trådar</span>
                      <span className="text-border">·</span>
                      <span>{categoryThreads.reduce((s, t) => s + t.replies, 0)} svar</span>
                    </div>
                  </div>

                  {/* Sort + new thread */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
                      {sortOptions.map((s) => {
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.id}
                            onClick={() => { setSortBy(s.id); setCurrentPage(1); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              sortBy === s.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      size="sm"
                      className="ml-auto gap-2 h-9"
                      onClick={() => setView("create")}
                    >
                      <Plus className="w-4 h-4" /> Ny tråd
                    </Button>
                  </div>

                  {/* Thread list — structured table */}
                  <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <span>Rubrik</span>
                    <span>Kategori</span>
                    <span>Senaste svar</span>
                    <span className="text-right">Visningar</span>
                    <span className="text-right">Svar</span>
                  </div>

                  <div className="divide-y divide-border">
                    {paginatedThreads.map((thread, i) => {
                      const cat = categories[thread.category];
                      const lastReply = thread.replyData?.[thread.replyData.length - 1];
                      return (
                        <motion.button
                          key={thread.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleOpenThread(thread.id)}
                          className="w-full text-left group hover:bg-muted/30 transition-colors"
                        >
                          {/* Mobile */}
                          <div className="sm:hidden p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-2 leading-snug">
                                  {thread.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  av {thread.author} · {thread.timeAgo} sedan
                                </p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.replies}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop */}
                          <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px_60px] gap-2 items-center px-4 py-3">
                            <div className="min-w-0">
                              <h3 className="text-sm font-medium text-primary group-hover:underline line-clamp-1 leading-snug">
                                {thread.title}
                              </h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5">av {thread.author}</p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">{cat?.label}</span>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {lastReply ? (
                                <div className="flex items-center gap-1">
                                  <CornerDownRight className="w-3 h-3 shrink-0 text-muted-foreground/50" />
                                  <div className="min-w-0">
                                    <span className="block truncate">{lastReply.author}</span>
                                    <span className="text-[10px] text-muted-foreground/60">{lastReply.timeAgo} sedan</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              {thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}
                            </div>

                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="w-3 h-3" />
                              {thread.replies}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <PaginationNav currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                  {sortedCategoryThreads.length === 0 && (
                    <div className="text-center py-16 rounded-xl border border-border bg-card">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">Inga trådar i denna kategori ännu</p>
                      <Button
                        size="sm"
                        className="mt-4 gap-2"
                        onClick={() => setView("create")}
                      >
                        <Plus className="w-4 h-4" /> Skriv den första
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
                  allThreads={allThreads}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Threads;
