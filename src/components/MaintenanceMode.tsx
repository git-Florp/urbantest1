import { useState, useEffect } from "react";
import { Wrench, Terminal, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface MaintenanceModeProps {
  onExit: () => void;
}

export const MaintenanceMode = ({ onExit }: MaintenanceModeProps) => {
  const [logs, setLogs] = useState<Array<{ text: string; type: "info" | "warning" | "error" | "success" }>>([
    { text: "ENTERING MAINTENANCE MODE...", type: "info" },
    { text: "Stopping all non-critical processes...", type: "info" },
  ]);

  useEffect(() => {
    const messages = [
      { text: "✓ System Monitor halted", type: "success" as const, delay: 1000 },
      { text: "✓ Network services paused", type: "success" as const, delay: 1500 },
      { text: "⚠ Warning: Zone 4 containment still active", type: "warning" as const, delay: 2000 },
      { text: "✓ Database connections minimized", type: "success" as const, delay: 2500 },
      { text: "✓ User sessions frozen", type: "success" as const, delay: 3000 },
      { text: "⚠ Pressure monitoring active (critical)", type: "warning" as const, delay: 3500 },
      { text: "✓ Security cameras on standby", type: "success" as const, delay: 4000 },
      { text: "✗ Failed to pause backup systems", type: "error" as const, delay: 4500 },
      { text: "✓ Terminal access restricted", type: "success" as const, delay: 5000 },
      { text: "--- MAINTENANCE MODE ACTIVE ---", type: "info" as const, delay: 5500 },
    ];

    messages.forEach(({ text, type, delay }) => {
      setTimeout(() => {
        setLogs(prev => [...prev, { text, type }]);
      }, delay);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
      <div className="bg-background border-2 border-yellow-500 rounded-lg shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-yellow-500/90 text-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 animate-pulse" />
            <div>
              <h1 className="text-xl font-bold">MAINTENANCE MODE</h1>
              <p className="text-xs opacity-80">System Operations Suspended</p>
            </div>
          </div>
        </div>

        {/* Log Content */}
        <div className="p-6 space-y-6">
          <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`mb-2 flex items-start gap-2 ${
                  log.type === "error"
                    ? "text-red-400"
                    : log.type === "warning"
                    ? "text-yellow-400"
                    : log.type === "success"
                    ? "text-green-400"
                    : "text-blue-400"
                }`}
              >
                {log.type === "success" && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {log.type === "error" && <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {log.type === "warning" && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {log.type === "info" && <Terminal className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <span>{log.text}</span>
              </div>
            ))}
            {logs.length >= 12 && (
              <div className="mt-4 text-yellow-400 animate-pulse">
                <p>_ System awaiting administrator input...</p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-500 mb-2">MAINTENANCE MODE INFO</h3>
            <p className="text-xs text-muted-foreground">
              The system is currently in maintenance mode. All non-critical services have been suspended.
              Only authorized personnel can perform system maintenance during this time.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Use console command <span className="text-primary font-mono">normalMode()</span> to exit maintenance mode.
            </p>
          </div>

          {/* Exit Button */}
          <div className="flex justify-center">
            <Button
              onClick={onExit}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            >
              Exit Maintenance Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
