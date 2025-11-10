import { useState, useEffect } from "react";
import { Mail, Star, Trash2, AlertTriangle } from "lucide-react";
import { saveState, loadState } from "@/lib/persistence";

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
  priority: "normal" | "high" | "urgent";
  body: string;
}

export const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(() => 
    loadState('messages_inbox', [])
  );

  const [selected, setSelected] = useState<Message | null>(null);

  // Generate random messages over time
  useEffect(() => {
    const generateRandomMessage = () => {
      const possibleMessages: Omit<Message, 'id'>[] = [
        {
          from: "Engineering Team",
          subject: "Routine Maintenance Complete",
          preview: "Zone 3 power systems have been serviced and tested...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Zone 3 power systems have been serviced and tested.\n\nAll systems functioning within normal parameters.\n\n- Engineering"
        },
        {
          from: "Security Operations",
          subject: "Shift Change Notification",
          preview: "Security shift rotation in progress...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Security shift rotation in progress.\n\nAll zones secured. No incidents reported.\n\n- Security Ops"
        },
        {
          from: "Medical Bay",
          subject: "Crew Health Update",
          preview: "Weekly health assessment complete for all personnel...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Weekly health assessment complete.\n\nAll personnel in good health. No medical issues reported.\n\n- Dr. Martinez"
        },
        {
          from: "Dr. Chen",
          subject: "Specimen Observation Notes",
          preview: "Daily observation log for active specimens...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Daily observation log:\n\nAll specimens stable. No unusual behavior detected today.\n\nZ-13 remains under enhanced monitoring.\n\n- Dr. Chen"
        },
        {
          from: "System Administrator",
          subject: "Backup Completed",
          preview: "Automated backup completed successfully...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Automated system backup completed successfully.\n\nAll data secured. Next backup in 24 hours.\n\n- SysAdmin"
        },
        {
          from: "Facility Operations",
          subject: "Pressure Reading",
          preview: "External pressure readings within normal range...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "External pressure monitoring:\n\nAll readings within normal operational parameters.\n\nDepth: 8,247m\nPressure: Stable\n\n- Operations"
        },
        {
          from: "Research Division",
          subject: "Data Analysis Complete",
          preview: "Analysis of recent specimen behavior patterns complete...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          starred: false,
          priority: "normal",
          body: "Behavior pattern analysis complete.\n\nNo significant anomalies detected. Continuing standard monitoring protocols.\n\n- Research Team"
        }
      ];

      const randomMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
      const newMessage: Message = {
        ...randomMessage,
        id: Date.now()
      };

      setMessages(prev => {
        const updated = [newMessage, ...prev];
        saveState('messages_inbox', updated);
        return updated;
      });
    };

    // Random interval between 2-5 minutes
    const randomInterval = () => 120000 + Math.random() * 180000;
    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        generateRandomMessage();
        scheduleNext();
      }, randomInterval());
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    saveState('messages_inbox', messages);
  }, [messages]);

  const toggleStar = (id: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const deleteMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const markAsRead = (msg: Message) => {
    if (!msg.read) {
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, read: true } : m
      ));
    }
    setSelected(msg);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-destructive";
      case "high": return "text-yellow-500";
      default: return "text-primary";
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex h-full">
      {/* Message List */}
      <div className="w-96 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Messages</h2>
            </div>
            {unreadCount > 0 && (
              <div className="px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                {unreadCount}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => markAsRead(msg)}
              className={`p-3 border-b border-white/5 cursor-pointer transition-colors ${
                selected?.id === msg.id ? "bg-primary/20" : "hover:bg-white/5"
              } ${!msg.read ? "bg-primary/5" : ""}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {msg.priority !== "normal" && (
                    <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${getPriorityColor(msg.priority)}`} />
                  )}
                  <span className={`font-bold text-sm truncate ${!msg.read ? "text-primary" : ""}`}>
                    {msg.from}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(msg.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        msg.starred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              </div>
              <div className={`text-sm mb-1 ${!msg.read ? "font-bold" : ""}`}>
                {msg.subject}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {msg.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-4 border-b border-white/5 bg-black/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {selected.priority !== "normal" && (
                      <AlertTriangle className={`w-4 h-4 ${getPriorityColor(selected.priority)}`} />
                    )}
                    <h3 className="font-bold text-lg">{selected.subject}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    From: <span className="text-foreground">{selected.from}</span> • {selected.time}
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(selected.id)}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {selected.priority === "urgent" && (
                <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                  ⚠ URGENT MESSAGE
                </div>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {selected.body}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
};
