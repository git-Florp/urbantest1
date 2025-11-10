import { useState, useEffect } from "react";
import { Cpu, X } from "lucide-react";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
  status: "running" | "sleeping" | "critical";
  priority: "high" | "normal" | "low";
  isApp?: boolean;
  appId?: string;
}

interface TaskManagerProps {
  windows: Array<{ id: string; app: { id: string; name: string } }>;
  onCloseWindow: (id: string) => void;
  onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void;
}

export const TaskManager = ({ windows, onCloseWindow, onCriticalKill }: TaskManagerProps) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // Only critical system processes
    const systemProcesses: Process[] = [
      { pid: 1, name: "urbcore.dll", cpu: 12, memory: "2.4 GB", status: "critical", priority: "high" },
      { pid: 2, name: "security.sys", cpu: 8, memory: "1.2 GB", status: "critical", priority: "high" },
      { pid: 3, name: "pressure_monitor", cpu: 15, memory: "890 MB", status: "critical", priority: "high" },
    ];

    // Convert open windows to processes
    const appProcesses: Process[] = windows.map((window, index) => ({
      pid: 1000 + index,
      name: window.app.name,
      cpu: Math.random() * 15 + 5,
      memory: `${Math.floor(Math.random() * 300 + 100)} MB`,
      status: "running" as const,
      priority: "normal" as const,
      isApp: true,
      appId: window.id
    }));

    setProcesses([...systemProcesses, ...appProcesses]);

    // Simulate CPU fluctuations
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(proc => ({
        ...proc,
        cpu: Math.max(1, proc.cpu + (Math.random() - 0.5) * 4)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [windows]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-destructive";
      case "running": return "text-primary";
      case "sleeping": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "normal": return "text-primary";
      case "low": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  const totalCpu = processes.reduce((sum, proc) => sum + proc.cpu, 0).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Task Manager</h2>
          </div>
          <div className="text-xs text-muted-foreground">
            {processes.length} processes • CPU: {totalCpu}%
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-black/40 border-b border-white/5">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-bold">PID</th>
              <th className="px-4 py-2 font-bold">NAME</th>
              <th className="px-4 py-2 font-bold">CPU</th>
              <th className="px-4 py-2 font-bold">MEMORY</th>
              <th className="px-4 py-2 font-bold">STATUS</th>
              <th className="px-4 py-2 font-bold">PRIORITY</th>
              <th className="px-4 py-2 font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc) => (
              <tr
                key={proc.pid}
                onClick={() => setSelected(proc.pid)}
                className={`border-b border-white/5 cursor-pointer transition-colors ${
                  selected === proc.pid ? "bg-primary/20" : "hover:bg-white/5"
                }`}
              >
                <td className="px-4 py-3 font-mono text-primary">{proc.pid}</td>
                <td className="px-4 py-3 font-medium">{proc.name}</td>
                <td className="px-4 py-3 font-mono">
                  <span className={proc.cpu > 10 ? "text-yellow-500" : ""}>
                    {proc.cpu.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{proc.memory}</td>
                <td className={`px-4 py-3 font-bold text-xs uppercase ${getStatusColor(proc.status)}`}>
                  {proc.status}
                </td>
                <td className={`px-4 py-3 font-bold text-xs uppercase ${getPriorityColor(proc.priority)}`}>
                  {proc.priority}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (proc.status === "critical") {
                        // Different crash types for different critical processes
                        const crashTypes: Array<"kernel" | "memory" | "overload"> = ["kernel", "memory", "overload"];
                        const randomType = crashTypes[Math.floor(Math.random() * crashTypes.length)];
                        onCriticalKill(proc.name, randomType);
                      } else if (proc.isApp && proc.appId) {
                        onCloseWindow(proc.appId);
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
          <span className="font-bold text-destructive">⚠ DANGER:</span>
          <span className="text-destructive/80 ml-2">Terminating critical processes will crash the system.</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Total CPU:</span>
            <span className="ml-2 font-mono font-bold text-primary">{totalCpu}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Processes:</span>
            <span className="ml-2 font-mono font-bold text-primary">{processes.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Critical:</span>
            <span className="ml-2 font-mono font-bold text-destructive">
              {processes.filter(p => p.status === "critical").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
