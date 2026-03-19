import React from "react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUser } from "@/data/users";
import { CalendarDays, MessageSquare, Heart, MapPin } from "lucide-react";

interface UserHoverCardProps {
  username: string;
  children?: React.ReactNode;
  className?: string;
}

const UserHoverCard = ({ username, children, className }: UserHoverCardProps) => {
  const user = getUser(username);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("sv-SE", { year: "numeric", month: "short" });
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          to={`/anvandare/${username}`}
          className={className || "font-semibold text-foreground hover:text-primary hover:underline transition-colors cursor-pointer"}
          onClick={(e) => e.stopPropagation()}
        >
          {children || username}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-72" side="top" align="start">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="text-xs font-bold bg-primary/15 text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/anvandare/${username}`}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </Link>
              {user.isOnline && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{user.role}</p>
            {user.bio && (
              <p className="text-xs text-muted-foreground/70 leading-snug line-clamp-2">{user.bio}</p>
            )}
            <div className="flex items-center gap-3 pt-1.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> {user.posts}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {user.likesReceived.toLocaleString("sv-SE")}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {formatDate(user.joinDate)}
              </span>
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {user.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
