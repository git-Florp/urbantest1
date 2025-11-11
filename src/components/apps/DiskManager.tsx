import { useState, useEffect } from "react";
import { HardDrive, Trash2, Plus, Check, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Disk {
  id: string;
  name: string;
  letter: string;
  size: number;
  used: number;
  type: "ssd" | "hdd" | "nvme";
  status: "healthy" | "warning" | "critical";
  system?: boolean;
}

const INITIAL_DISKS: Disk[] = [
  { id: "disk0", name: "System Drive", letter: "C:", size: 512, used: 287, type: "nvme", status: "healthy", system: true },
  { id: "disk1", name: "Data Storage", letter: "D:", size: 2048, used: 1456, type: "ssd", status: "healthy" },
  { id: "disk2", name: "Archive", letter: "E:", size: 4096, used: 3892, type: "hdd", status: "warning" },
  { id: "disk3", name: "Backup", letter: "F:", size: 1024, used: 124, type: "ssd", status: "healthy" },
];

export const DiskManager = () => {
  const [disks, setDisks] = useState<Disk[]>(() => {
    const saved = localStorage.getItem('system_disks');
    return saved ? JSON.parse(saved) : INITIAL_DISKS;
  });
  const [selectedDisk, setSelectedDisk] = useState<Disk | null>(null);
  const [formatting, setFormatting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    localStorage.setItem('system_disks', JSON.stringify(disks));
  }, [disks]);

  const getUsagePercent = (disk: Disk) => (disk.used / disk.size) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-primary";
      case "warning": return "text-yellow-500";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const formatBytes = (gb: number) => `${gb.toFixed(2)} GB`;

  const handleFormat = async () => {
    if (!selectedDisk) return;
    if (selectedDisk.system) {
      toast.error("Cannot format system drive!");
      return;
    }
    
    if (!window.confirm(`WARNING: This will erase all data on ${selectedDisk.name} (${selectedDisk.letter}). Continue?`)) return;
    
    setFormatting(true);
    toast.loading("Formatting drive...");
    
    setTimeout(() => {
      setDisks(prev => prev.map(d => 
        d.id === selectedDisk.id ? { ...d, used: 0, status: "healthy" as const } : d
      ));
      setFormatting(false);
      toast.dismiss();
      toast.success("Drive formatted successfully!");
    }, 3000);
  };

  const handleOptimize = async () => {
    if (!selectedDisk) return;
    
    setOptimizing(true);
    toast.loading("Optimizing drive...");
    
    setTimeout(() => {
      setDisks(prev => prev.map(d => 
        d.id === selectedDisk.id 
          ? { ...d, used: Math.max(0, d.used - Math.random() * 10), status: "healthy" as const }
          : d
      ));
      setOptimizing(false);
      toast.dismiss();
      toast.success("Drive optimized successfully!");
    }, 2500);
  };

  const handleCleanup = () => {
    if (!selectedDisk) return;
    
    const savedSpace = Math.random() * 20 + 10;
    setDisks(prev => prev.map(d => 
      d.id === selectedDisk.id 
        ? { ...d, used: Math.max(0, d.used - savedSpace) }
        : d
    ));
    toast.success(`Cleaned ${savedSpace.toFixed(2)} GB of temporary files!`);
  };

  const handleCheckHealth = () => {
    if (!selectedDisk) return;
    
    toast.loading("Running disk health check...");
    setTimeout(() => {
      toast.dismiss();
      const isHealthy = Math.random() > 0.3;
      if (isHealthy) {
        toast.success("Disk health check passed!");
        setDisks(prev => prev.map(d => 
          d.id === selectedDisk.id ? { ...d, status: "healthy" as const } : d
        ));
      } else {
        toast.error("Warning: Disk showing signs of wear!");
        setDisks(prev => prev.map(d => 
          d.id === selectedDisk.id ? { ...d, status: "warning" as const } : d
        ));
      }
    }, 2000);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Disk List */}
      <div className="w-96 border-r border-border">
        <div className="p-4 border-b border-border bg-black/20">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Disk Management</h2>
          </div>
        </div>
        
        <div className="p-3 space-y-2">
          {disks.map(disk => {
            const usage = getUsagePercent(disk);
            return (
              <div
                key={disk.id}
                onClick={() => setSelectedDisk(disk)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedDisk?.id === disk.id 
                    ? 'bg-primary/20 border-primary/30' 
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span className="font-bold">{disk.letter}</span>
                    <span className="text-sm">{disk.name}</span>
                  </div>
                  {disk.status !== "healthy" && (
                    <AlertTriangle className={`w-4 h-4 ${getStatusColor(disk.status)}`} />
                  )}
                </div>
                
                <Progress value={usage} className="h-2 mb-1" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatBytes(disk.used)} / {formatBytes(disk.size)}</span>
                  <span>{usage.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground">
                    {disk.type.toUpperCase()}
                  </span>
                  <span className={getStatusColor(disk.status)}>
                    {disk.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disk Details */}
      <div className="flex-1 p-6">
        {selectedDisk ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">{selectedDisk.letter} {selectedDisk.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDisk.type.toUpperCase()} Drive • {selectedDisk.status.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {selectedDisk.system && (
                <div className="p-2 rounded bg-primary/10 border border-primary/20 text-primary text-xs flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  System Drive - Contains operating system
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-lg glass-panel">
                <div className="text-sm text-muted-foreground mb-2">Storage Usage</div>
                <Progress value={getUsagePercent(selectedDisk)} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span>{formatBytes(selectedDisk.used)} used</span>
                  <span>{formatBytes(selectedDisk.size - selectedDisk.used)} free</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Total Capacity</div>
                  <div className="text-lg font-bold">{formatBytes(selectedDisk.size)}</div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Used Space</div>
                  <div className="text-lg font-bold">{formatBytes(selectedDisk.used)}</div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Free Space</div>
                  <div className="text-lg font-bold">{formatBytes(selectedDisk.size - selectedDisk.used)}</div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Usage</div>
                  <div className="text-lg font-bold">{getUsagePercent(selectedDisk).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCleanup} 
                className="w-full"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clean Temporary Files
              </Button>
              
              <Button 
                onClick={handleOptimize} 
                disabled={optimizing}
                className="w-full"
                variant="outline"
              >
                <Zap className="w-4 h-4 mr-2" />
                {optimizing ? "Optimizing..." : "Optimize Drive"}
              </Button>
              
              <Button 
                onClick={handleCheckHealth}
                className="w-full"
                variant="outline"
              >
                <Check className="w-4 h-4 mr-2" />
                Check Disk Health
              </Button>
              
              <Button 
                onClick={handleFormat}
                disabled={selectedDisk.system || formatting}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {formatting ? "Formatting..." : "Format Drive"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a disk to manage
          </div>
        )}
      </div>
    </div>
  );
};
