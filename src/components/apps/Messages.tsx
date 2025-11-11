import { useState, useEffect } from "react";
import { Mail, Star, Trash2, AlertTriangle, Send, X, Users } from "lucide-react";
import { saveState, loadState } from "@/lib/persistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message {
  id: number;
  from: string;
  to?: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
  priority: "normal" | "high" | "urgent";
  body: string;
}

interface Personnel {
  name: string;
  email: string;
}

export const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(() => 
    loadState('messages_inbox', [])
  );

  const [selected, setSelected] = useState<Message | null>(null);
  const [composing, setComposing] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "", priority: "normal" as Message["priority"] });
  const [showPersonnel, setShowPersonnel] = useState(false);

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

  // Get current user
  const getCurrentUser = () => {
    const adminData = localStorage.getItem("urbanshade_admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      return { name: admin.name, email: admin.email };
    }
    return { name: "Administrator", email: "admin@urbanshade.corp" };
  };

  const getPersonnel = (): Personnel[] => {
    const adminData = localStorage.getItem("urbanshade_admin");
    const admin = adminData ? JSON.parse(adminData) : { name: "Administrator", email: "admin@urbanshade.corp" };
    
    return [
      admin,
      { name: "Dr. Sarah Chen", email: "s.chen@urbanshade.corp" },
      { name: "Marcus Webb", email: "m.webb@urbanshade.corp" },
      { name: "Dr. James Liu", email: "j.liu@urbanshade.corp" },
      { name: "Elena Rodriguez", email: "e.rodriguez@urbanshade.corp" },
      { name: "Dr. Yuki Tanaka", email: "y.tanaka@urbanshade.corp" },
      { name: "Robert Hayes", email: "r.hayes@urbanshade.corp" },
      { name: "Dr. Amanda Foster", email: "a.foster@urbanshade.corp" },
      { name: "Thomas Park", email: "t.park@urbanshade.corp" },
      { name: "Lisa Morrison", email: "l.morrison@urbanshade.corp" },
    ];
  };

  const handleSendMessage = () => {
    if (!compose.to || !compose.subject || !compose.body) {
      toast.error("Please fill in all fields!");
      return;
    }

    const currentUser = getCurrentUser();
    const recipient = getPersonnel().find(p => p.email === compose.to);
    
    if (!recipient) {
      toast.error("Invalid recipient!");
      return;
    }

    // Create sent message
    const sentMessage: Message = {
      id: Date.now(),
      from: currentUser.name,
      to: compose.to,
      subject: compose.subject,
      preview: compose.body.substring(0, 100),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      starred: false,
      priority: compose.priority,
      body: compose.body
    };

    // If sending to self, duplicate the message
    if (compose.to === currentUser.email) {
      const receivedCopy: Message = {
        ...sentMessage,
        id: Date.now() + 1,
        from: currentUser.name,
        read: false
      };
      setMessages(prev => {
        const updated = [receivedCopy, sentMessage, ...prev];
        saveState('messages_inbox', updated);
        return updated;
      });
      toast.success("Message sent! (You sent a message to yourself, so you received a copy)");
    } else {
      setMessages(prev => {
        const updated = [sentMessage, ...prev];
        saveState('messages_inbox', updated);
        return updated;
      });
      toast.success(`Message sent to ${recipient.name}!`);
    }

    setCompose({ to: "", subject: "", body: "", priority: "normal" });
    setComposing(false);
  };

  const selectRecipient = (email: string) => {
    setCompose(prev => ({ ...prev, to: email }));
    setShowPersonnel(false);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex h-full">
      {/* Message List */}
      <div className="w-96 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between mb-3">
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
          <Button onClick={() => { setComposing(true); setSelected(null); }} className="w-full" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Compose
          </Button>
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
        {composing ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Compose Message</h3>
              <Button variant="ghost" size="sm" onClick={() => setComposing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To</label>
                <div className="flex gap-2">
                  <Input
                    value={compose.to}
                    onChange={(e) => setCompose(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="recipient@urbanshade.corp"
                    className="flex-1"
                  />
                  <Button onClick={() => setShowPersonnel(!showPersonnel)} variant="outline">
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
                
                {showPersonnel && (
                  <div className="mt-2 p-2 rounded-lg border border-border bg-background max-h-48 overflow-y-auto">
                    {getPersonnel().map(person => (
                      <div
                        key={person.email}
                        onClick={() => selectRecipient(person.email)}
                        className="p-2 hover:bg-accent rounded cursor-pointer text-sm"
                      >
                        <div className="font-bold">{person.name}</div>
                        <div className="text-xs text-muted-foreground">{person.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
                <select
                  value={compose.priority}
                  onChange={(e) => setCompose(prev => ({ ...prev, priority: e.target.value as Message["priority"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                <Input
                  value={compose.subject}
                  onChange={(e) => setCompose(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea
                  value={compose.body}
                  onChange={(e) => setCompose(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Type your message..."
                  rows={12}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleSendMessage} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        ) : selected ? (
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
                    From: <span className="text-foreground">{selected.from}</span>
                    {selected.to && <> • To: <span className="text-foreground">{selected.to}</span></>}
                    {" • "}{selected.time}
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
            Select a message to read or click Compose to send a new message
          </div>
        )}
      </div>
    </div>
  );
};
