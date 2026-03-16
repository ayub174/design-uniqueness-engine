import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Send, MessageSquare, Award, CheckCircle,
  GripVertical, ArrowLeft, MoreHorizontal, Plus, Archive, Download,
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
}

type ColumnId = "saved" | "applied" | "interview" | "offer" | "closed";

interface Column {
  id: ColumnId;
  label: string;
  icon: React.ElementType;
  color: string;
  headerBg: string;
  badgeBg: string;
}

const columns: Column[] = [
  { id: "saved", label: "Sparade jobb", icon: Briefcase, color: "text-primary-foreground", headerBg: "bg-secondary", badgeBg: "bg-secondary/70" },
  { id: "applied", label: "Ansökt", icon: Send, color: "text-primary-foreground", headerBg: "bg-primary", badgeBg: "bg-primary/70" },
  { id: "interview", label: "Intervju", icon: MessageSquare, color: "text-primary-foreground", headerBg: "bg-amber-500", badgeBg: "bg-amber-400" },
  { id: "offer", label: "Erbjudande", icon: Award, color: "text-primary-foreground", headerBg: "bg-emerald-600", badgeBg: "bg-emerald-500" },
  { id: "closed", label: "Avslutad", icon: CheckCircle, color: "text-primary-foreground", headerBg: "bg-destructive", badgeBg: "bg-destructive/70" },
];

const sampleJobs: Record<ColumnId, Job[]> = {
  saved: [
    { id: "1", title: "Senior Product Designer", company: "Figma", location: "Stockholm", date: "2026-03-14" },
    { id: "2", title: "UX Researcher", company: "Spotify", location: "Stockholm", date: "2026-03-12" },
  ],
  applied: [
    { id: "3", title: "Full-Stack Engineer", company: "Klarna", location: "Göteborg", date: "2026-03-10" },
  ],
  interview: [],
  offer: [],
  closed: [],
};

type Tab = "active" | "followups" | "archive" | "export";

const tabs: { id: Tab; label: string }[] = [
  { id: "active", label: "Aktiv" },
  { id: "followups", label: "Uppföljningar" },
  { id: "archive", label: "Arkiv" },
  { id: "export", label: "Exportera ansökningar" },
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
                className="flex flex-col rounded-xl border border-border bg-card/40 overflow-hidden min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`${col.headerBg} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <col.icon className={`w-4 h-4 ${col.color}`} />
                    <span className={`font-sans font-semibold text-sm ${col.color}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className={`${col.badgeBg} ${col.color} text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}>
                    {jobs[col.id].length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      <AnimatePresence>
                        {jobs[col.id].length === 0 && !snapshot.isDraggingOver && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                          >
                            <col.icon className="w-8 h-8 mb-2 opacity-30" />
                            <span className="text-xs font-sans">
                              {col.id === "saved" ? "Spara jobb genom att klicka på hjärtat" : "Dra jobb hit"}
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
                              className={`mb-2 p-3 rounded-lg border border-border bg-background shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-sans font-semibold text-sm text-foreground truncate">
                                    {job.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {job.company}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {job.location}
                                  </p>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground p-0.5">
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-sans">
                                  {job.date}
                                </span>
                                <GripVertical className="w-3 h-3 text-muted-foreground/40" />
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
