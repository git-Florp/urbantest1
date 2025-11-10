import { useState, useEffect, useRef } from "react";
import { App } from "./Desktop";
import { LogOut, Activity, RotateCcw } from "lucide-react";

interface StartMenuProps {
  open: boolean;
  apps: App[];
  onClose: () => void;
  onOpenApp: (app: App) => void;
  onReboot: () => void;
  onLogout: () => void;
}

export const StartMenu = ({ open, apps, onClose, onOpenApp, onReboot, onLogout }: StartMenuProps) => {
  const [search, setSearch] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startBtn = document.querySelector('[data-start-button]');
        if (startBtn && !startBtn.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={menuRef}
      className="fixed left-3 bottom-[78px] w-[980px] h-[640px] rounded-2xl p-5 glass-panel z-[900] shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-21 h-21 rounded-xl bg-gradient-to-b from-primary to-primary/20 flex items-center justify-center text-black font-black text-3xl">
          U
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="text-muted-foreground mt-2 font-bold text-sm">Signed in: User</div>
        </div>
        <div className="text-right text-muted-foreground">
          <div className="font-bold">Urbanshade</div>
          <div className="text-xs">Node v3.7</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-[calc(100%-120px)] mt-3 gap-5">
        {/* App Grid */}
        <div className="flex-1 flex items-end justify-center pb-5">
          <div className="grid grid-cols-6 gap-3 w-[90%]">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  onOpenApp(app);
                  onClose();
                }}
                className="w-30 h-30 rounded-xl glass-panel flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 transition-all border border-white/5"
              >
                <div className="text-primary">{app.icon}</div>
                <div className="text-xs text-muted-foreground text-center">{app.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-64 pl-5 border-l border-white/10 flex flex-col gap-3 justify-center">
          <button 
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full px-4 py-3 rounded-xl glass-panel text-accent border border-primary/10 font-bold flex items-center justify-between hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </span>
            <span className="text-muted-foreground">→</span>
          </button>

          <button 
            onClick={() => {
              const taskManagerApp = apps.find(a => a.id === "task-manager");
              if (taskManagerApp) {
                onOpenApp(taskManagerApp);
              }
              onClose();
            }}
            className="w-full px-4 py-3 rounded-xl glass-panel text-accent border border-primary/10 font-bold flex items-center justify-between hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Task Manager
            </span>
            <span className="text-muted-foreground">→</span>
          </button>

          <button 
            onClick={() => {
              onReboot();
              onClose();
            }}
            className="w-full px-4 py-3 rounded-xl glass-panel text-accent border border-primary/10 font-bold flex items-center justify-between hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reboot
            </span>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
