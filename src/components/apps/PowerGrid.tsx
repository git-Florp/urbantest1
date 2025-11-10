import { useState, useEffect } from "react";
import { Zap, Power, AlertTriangle, Battery, BatteryCharging } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface PowerZone {
  id: string;
  name: string;
  power: number;
  maxCapacity: number;
  status: "ONLINE" | "WARNING" | "OFFLINE";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  enabled: boolean;
}

export const PowerGrid = () => {
  const [zones, setZones] = useState<PowerZone[]>(() =>
    loadState('power_zones', [
      { id: "1", name: "Life Support Systems", power: 245, maxCapacity: 250, status: "ONLINE", priority: "CRITICAL", enabled: true },
      { id: "2", name: "Containment Fields", power: 180, maxCapacity: 200, status: "ONLINE", priority: "CRITICAL", enabled: true },
      { id: "3", name: "Research Labs", power: 125, maxCapacity: 150, status: "ONLINE", priority: "HIGH", enabled: true },
      { id: "4", name: "Security Systems", power: 95, maxCapacity: 120, status: "ONLINE", priority: "HIGH", enabled: true },
      { id: "5", name: "Environmental Control", power: 110, maxCapacity: 140, status: "ONLINE", priority: "HIGH", enabled: true },
      { id: "6", name: "Server Infrastructure", power: 85, maxCapacity: 100, status: "ONLINE", priority: "MEDIUM", enabled: true },
      { id: "7", name: "Lighting Systems", power: 45, maxCapacity: 80, status: "ONLINE", priority: "LOW", enabled: true },
      { id: "8", name: "Recreation Areas", power: 30, maxCapacity: 60, status: "ONLINE", priority: "LOW", enabled: true },
    ])
  );
  
  const [emergencyPower, setEmergencyPower] = useState<boolean>(() => loadState('emergency_power', false));
  const [batteryLevel, setBatteryLevel] = useState<number>(() => loadState('battery_level', 100));

  useEffect(() => {
    saveState('power_zones', zones);
  }, [zones]);

  useEffect(() => {
    saveState('emergency_power', emergencyPower);
  }, [emergencyPower]);

  useEffect(() => {
    saveState('battery_level', batteryLevel);
  }, [batteryLevel]);

  // Simulate power fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        if (!zone.enabled) return zone;
        
        const fluctuation = (Math.random() - 0.5) * 10;
        const newPower = Math.max(0, Math.min(zone.maxCapacity, zone.power + fluctuation));
        const usage = (newPower / zone.maxCapacity) * 100;
        
        const newStatus = 
          usage > 95 ? "WARNING" :
          usage > 85 ? "WARNING" : "ONLINE";
        
        return { ...zone, power: Math.round(newPower), status: newStatus };
      }));

      // Drain battery when emergency power is active
      if (emergencyPower) {
        setBatteryLevel(prev => Math.max(0, prev - 0.5));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [emergencyPower]);

  const toggleZone = (zone: PowerZone) => {
    if (zone.priority === "CRITICAL" && zone.enabled) {
      toast.error("Cannot disable critical systems");
      return;
    }
    
    const newEnabled = !zone.enabled;
    setZones(prev => prev.map(z => z.id === zone.id ? { 
      ...z, 
      enabled: newEnabled,
      power: newEnabled ? z.power : 0,
      status: newEnabled ? z.status : "OFFLINE"
    } : z));
    
    toast.success(`${zone.name} ${newEnabled ? 'enabled' : 'disabled'}`);
  };

  const toggleEmergencyPower = () => {
    if (!emergencyPower && batteryLevel < 10) {
      toast.error("Battery level too low for emergency power");
      return;
    }
    
    setEmergencyPower(!emergencyPower);
    toast.info(`Emergency power ${!emergencyPower ? 'activated' : 'deactivated'}`);
  };

  const balanceLoad = () => {
    toast.info("Balancing power load...");
    
    setTimeout(() => {
      setZones(prev => prev.map(zone => {
        if (!zone.enabled) return zone;
        
        const targetLoad = zone.maxCapacity * 0.7;
        return {
          ...zone,
          power: Math.round(targetLoad),
          status: "ONLINE"
        };
      }));
      toast.success("Power load balanced");
    }, 2000);
  };

  const totalPower = zones.reduce((sum, z) => sum + (z.enabled ? z.power : 0), 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.maxCapacity, 0);
  const gridUsage = Math.round((totalPower / totalCapacity) * 100);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Power Distribution Grid</h2>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Total Load: </span>
            <span className={`font-mono font-bold ${gridUsage > 85 ? 'text-yellow-500' : 'text-primary'}`}>
              {totalPower} / {totalCapacity} kW ({gridUsage}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg glass-panel">
            <div className="flex items-center gap-2 mb-1">
              {emergencyPower ? <BatteryCharging className="w-4 h-4 text-yellow-500" /> : <Battery className="w-4 h-4 text-primary" />}
              <div className="text-xs text-muted-foreground">Emergency Power</div>
            </div>
            <div className={`text-lg font-bold font-mono ${emergencyPower ? 'text-yellow-500' : 'text-muted-foreground'}`}>
              {emergencyPower ? 'ACTIVE' : 'STANDBY'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Battery: {batteryLevel.toFixed(0)}%</div>
          </div>

          <button
            onClick={toggleEmergencyPower}
            className={`p-3 rounded-lg font-bold text-xs ${
              emergencyPower 
                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-500' 
                : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20'
            }`}
          >
            {emergencyPower ? 'DEACTIVATE' : 'ACTIVATE'} BACKUP
          </button>

          <button
            onClick={balanceLoad}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs hover:bg-primary/20"
          >
            BALANCE LOAD
          </button>
        </div>

        {gridUsage > 85 && (
          <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warning: High power consumption detected
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {zones.map((zone) => {
          const usage = zone.enabled ? Math.round((zone.power / zone.maxCapacity) * 100) : 0;
          return (
            <div key={zone.id} className={`p-4 rounded-lg transition-all ${zone.enabled ? "glass-panel" : "bg-black/20 opacity-60"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-sm">{zone.name}</div>
                <div className={`text-xs px-2 py-0.5 rounded ${
                  zone.priority === "CRITICAL" ? "bg-destructive/20 text-destructive" :
                  zone.priority === "HIGH" ? "bg-yellow-500/20 text-yellow-500" :
                  zone.priority === "MEDIUM" ? "bg-blue-500/20 text-blue-400" :
                  "bg-muted/20 text-muted-foreground"
                }`}>
                  {zone.priority}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl font-bold font-mono ${
                    zone.status === "WARNING" ? "text-yellow-500" : 
                    zone.enabled ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {zone.power}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {zone.maxCapacity} kW</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      usage > 95 ? 'bg-destructive' :
                      usage > 85 ? 'bg-yellow-500' : 'bg-primary'
                    }`}
                    style={{ width: `${usage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{usage}% capacity</div>
              </div>
              
              <button
                onClick={() => toggleZone(zone)}
                disabled={zone.priority === "CRITICAL" && zone.enabled}
                className={`w-full px-3 py-2 rounded text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  zone.enabled 
                    ? "bg-destructive/20 border border-destructive/30 text-destructive hover:bg-destructive/30" 
                    : "bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
                }`}
              >
                <Power className="w-3 h-3 inline mr-1" />
                {zone.enabled ? "DISABLE" : "ENABLE"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
