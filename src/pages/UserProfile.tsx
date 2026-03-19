import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser } from "@/data/users";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, CalendarDays, MessageSquare, Heart, MapPin,
  Shield, Zap, Crown, ExternalLink,
} from "lucide-react";

const BadgeDisplay = ({ type }: { type?: string }) => {
  if (!type) return null;
  if (type === "verified") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
      <Shield className="w-3.5 h-3.5" /> Verifierad
    </span>
  );
  if (type === "mod") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
      <Crown className="w-3.5 h-3.5" /> Moderator
    </span>
  );
  if (type === "top") return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full">
      <Zap className="w-3.5 h-3.5" /> Toppbidragare
    </span>
  );
  return null;
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const user = getUser(username || "");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
  };

  const memberSince = () => {
    const join = new Date(user.joinDate);
    const now = new Date();
    const months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    if (months < 1) return "Ny medlem";
    if (months < 12) return `${months} månader`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years} år, ${rem} mån` : `${years} år`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl font-bold text-foreground">
              Chappie<span className="text-primary">.</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm h-9 px-3">Logga in</Button>
            <Button size="sm" className="text-sm h-9 px-4">Kom igång</Button>
          </div>
        </div>
      </nav>

      <div className="pt-14 max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/tradar"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Tillbaka till forumet
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Banner */}
            <div className="h-24 sm:h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" />

            {/* Avatar + info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                <Avatar className="w-20 h-20 border-4 border-card shadow-lg">
                  <AvatarFallback className="text-2xl font-bold bg-primary/15 text-primary">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 sm:pb-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-serif text-2xl font-bold text-foreground">{user.username}</h1>
                    {user.isOnline && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    )}
                    <BadgeDisplay type={user.badge} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{user.role}</p>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-foreground/80 leading-relaxed mt-4 max-w-xl">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{user.posts}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Inlägg
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{user.likesReceived.toLocaleString("sv-SE")}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3" /> Gillningar
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{memberSince()}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Medlem
                  </p>
                </div>
                {user.location && (
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{user.location}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" /> Plats
                    </p>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Gick med {formatDate(user.joinDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Activity placeholder */}
          <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Senaste aktivitet kommer snart</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
