import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Send, MessageSquare, Award, CheckCircle,
  GripVertical, ArrowLeft, MoreHorizontal, Plus, MapPin, Building2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  type?: string;
}

type ColumnId = "saved" | "applied" | "interview" | "offer" | "closed";

interface Column {
  id: ColumnId;
  label: string;
  icon: React.ElementType;
  shade: string;       // header bg using CSS vars
  shadeFg: string;     // header text
  dotColor: string;    // status dot on cards
  emptyText: string;
}

const columns: Column[] = [
  {
    id: "saved", label: "Sparade jobb", icon: Heart,
    shade: "bg-[hsl(168,45%,92%)]", shadeFg: "text-[hsl(168,70%,22%)]",
    dotColor: "bg-[hsl(168,40%,80%)]",
    emptyText: "Spara jobb genom att klicka på hjärtat",
  },
  {
    id: "applied", label: "Ansökt", icon: Send,
    shade: "bg-[hsl(168,40%,80%)]", shadeFg: "text-[hsl(168,70%,22%)]",
    dotColor: "bg-[hsl(168,50%,55%)]",
    emptyText: "Dra jobb hit när du har ansökt",
  },
  {
    id: "interview", label: "Intervju", icon: MessageSquare,
    shade: "bg-[hsl(168,50%,55%)]", shadeFg: "text-[hsl(168,70%,22%)]",
    dotColor: "bg-[hsl(168,65%,42%)]",
    emptyText: "Fått intervju? Dra kortet hit",
  },
  {
    id: "offer", label: "Erbjudande", icon: Award,
    shade: "bg-primary", shadeFg: "text-primary-foreground",
    dotColor: "bg-[hsl(168,65%,32%)]",
    emptyText: "Grattis! Dra erbjudanden hit",
  },
  {
    id: "closed", label: "Avslutad", icon: CheckCircle,
    shade: "bg-[hsl(168,70%,22%)]", shadeFg: "text-[hsl(168,45%,92%)]",
    dotColor: "bg-[hsl(168,70%,22%)]",
    emptyText: "Avslutade processer hamnar här",
  },
];

const sampleJobs: Record<ColumnId, Job[]> = {
  saved: [
    { id: "1", title: "Senior Product Designer", company: "Figma", location: "Stockholm", date: "14 mar", type: "Hybrid" },
    { id: "2", title: "UX Researcher", company: "Spotify", location: "Stockholm", date: "12 mar", type: "Remote" },
  ],
  applied: [
    { id: "3", title: "Full-Stack Engineer", company: "Klarna", location: "Göteborg", date: "10 mar", type: "On-site" },
  ],
  interview: [],
  offer: [],
  closed: [],
};

type Tab = "active" | "followups" | "archive" | "export";

const tabs: { id: Tab; label: string; icon?: React.ElementType }[] = [
  { id: "active", label: "Aktiv" },
  { id: "followups", label: "Uppföljningar" },
  { id: "archive", label: "Arkiv" },
  { id: "export", label: "Exportera" },
];

const MyJobs = () => {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [jobs, setJobs] = useState(sampleJobs);

  const totalActive = Object.values(jobs).reduce((s, arr) => s + arr.length, 0);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = source.droppableId as ColumnId;
    const destCol = destination.droppableId as ColumnId;
    const srcItems = [...jobs[srcCol]];
    const destItems = srcCol === destCol ? srcItems : [...jobs[destCol]];

    const [moved] = srcItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    setJobs({
      ...jobs,
      [srcCol]: srcItems,
      ...(srcCol !== destCol ? { [destCol]: destItems } : {}),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-sans">Tillbaka</span>
          </Link>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Lägg till jobb
          </Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            Mina jobb
          </h1>
          <p className="text-muted-foreground mt-1 font-sans text-sm">
            {totalActive} aktiva jobb · 0 arkiverade · Dra kort mellan kolumner för att uppdatera status
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-1 mt-6 mb-8 border-b border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-sans font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {columns.map((col, colIndex) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + colIndex * 0.08, duration: 0.5 }}
                className="flex flex-col rounded-xl border border-border bg-card/30 overflow-hidden min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`${col.shade} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2.5">
                    <col.icon className={`w-4 h-4 ${col.shadeFg}`} />
                    <span className={`font-sans font-semibold text-sm ${col.shadeFg}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className={`${col.shadeFg} opacity-70 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center`}>
                    {jobs[col.id].length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2.5 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      <AnimatePresence>
                        {jobs[col.id].length === 0 && !snapshot.isDraggingOver && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                              <col.icon className="w-6 h-6 opacity-40" />
                            </div>
                            <span className="text-xs font-sans text-center px-4 leading-relaxed">
                              {col.emptyText}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {jobs[col.id].map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2.5 p-3.5 rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
                                snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 scale-[1.02]" : ""
                              }`}
                            >
                              {/* Status dot + title row */}
                              <div className="flex items-start gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor} mt-1.5 shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <h3 className="font-sans font-semibold text-sm text-foreground leading-snug">
                                      {job.title}
                                    </h3>
                                    <button className="text-muted-foreground hover:text-foreground p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Company */}
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center shrink-0">
                                      <Building2 className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-sans">
                                      {job.company}
                                    </span>
                                  </div>

                                  {/* Location + type */}
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-muted-foreground/60" />
                                      <span className="text-[11px] text-muted-foreground">
                                        {job.location}
                                      </span>
                                    </div>
                                    {job.type && (
                                      <span className="text-[10px] font-sans font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        {job.type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-sans">
                                  {job.date}
                                </span>
                                <GripVertical className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
};

export default MyJobs;
