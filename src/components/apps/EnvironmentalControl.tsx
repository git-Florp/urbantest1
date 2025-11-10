import { useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, Gauge, Power, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface EnvironmentalData {
  zone: string;
  temperature: number;
  targetTemp: number;
  pressure: number;
  targetPressure: number;
  humidity: number;
  oxygen: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  controlsEnabled: boolean;
}

export const EnvironmentalControl = () => {
  const [zones, setZones] = useState<EnvironmentalData[]>(() =>
    loadState('environmental_zones', [
      { zone: "Control Room", temperature: 4.2, targetTemp: 4.0, pressure: 8245, targetPressure: 8247, humidity: 45, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Research Lab A", temperature: 4.0, targetTemp: 4.0, pressure: 8251, targetPressure: 8247, humidity: 42, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Research Lab B", temperature: 4.1, targetTemp: 4.0, pressure: 8248, targetPressure: 8247, humidity: 43, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Server Bay", temperature: 4.5, targetTemp: 4.5, pressure: 8240, targetPressure: 8247, humidity: 40, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Containment Area - Zone 4", temperature: 3.1, targetTemp: 4.0, pressure: 8612, targetPressure: 8247, humidity: 89, oxygen: 18, status: "CRITICAL", controlsEnabled: false },
      { zone: "Engineering", temperature: 4.4, targetTemp: 4.0, pressure: 8247, targetPressure: 8247, humidity: 46, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Medical Bay", temperature: 4.0, targetTemp: 4.0, pressure: 8252, targetPressure: 8247, humidity: 44, oxygen: 21, status: "NORMAL", controlsEnabled: true },
      { zone: "Storage", temperature: 4.1, targetTemp: 4.0, pressure: 8243, targetPressure: 8247, humidity: 41, oxygen: 21, status: "NORMAL", controlsEnabled: true },
    ])
  );
  const [selected, setSelected] = useState<EnvironmentalData | null>(null);
  const [adjusting, setAdjusting] = useState(false);

  // Save state when zones change
  useEffect(() => {
    saveState('environmental_zones', zones);
  }, [zones]);

  // Simulate environmental fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        if (zone.status === "CRITICAL") return zone;
        
        const tempDrift = (Math.random() - 0.5) * 0.1;
        const pressureDrift = (Math.random() - 0.5) * 2;
        const newTemp = zone.temperature + tempDrift;
        const newPressure = zone.pressure + pressureDrift;

        const tempDiff = Math.abs(newTemp - zone.targetTemp);
        const pressureDiff = Math.abs(newPressure - zone.targetPressure);

        const newStatus = 
          tempDiff > 0.5 || pressureDiff > 50 ? "WARNING" :
          tempDiff > 0.3 || pressureDiff > 30 ? "WARNING" : "NORMAL";

        return {
          ...zone,
          temperature: Math.max(3, Math.min(6, newTemp)),
          pressure: Math.max(8200, Math.min(8300, newPressure)),
          status: newStatus
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const adjustTemperature = (zone: EnvironmentalData, delta: number) => {
    if (!zone.controlsEnabled || adjusting) return;

    setAdjusting(true);
    toast.info(`Adjusting temperature for ${zone.zone}...`);

    setTimeout(() => {
      setZones(prev => prev.map(z =>
        z.zone === zone.zone
          ? { ...z, targetTemp: Math.max(2, Math.min(6, z.targetTemp + delta)) }
          : z
      ));
      setAdjusting(false);
      toast.success(`Temperature setpoint updated`);
    }, 1500);
  };

  const normalizeEnvironment = (zone: EnvironmentalData) => {
    if (!zone.controlsEnabled || adjusting) return;

    setAdjusting(true);
    toast.info(`Normalizing environment for ${zone.zone}...`);

    setTimeout(() => {
      setZones(prev => prev.map(z =>
        z.zone === zone.zone
          ? {
              ...z,
              temperature: z.targetTemp,
              pressure: z.targetPressure,
              humidity: 45,
              oxygen: 21,
              status: "NORMAL"
            }
          : z
      ));
      setAdjusting(false);
      toast.success(`Environment normalized`);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL": return "text-primary";
      case "WARNING": return "text-yellow-500";
      case "CRITICAL": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 border-r border-white/5 overflow-auto">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Environmental Control</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Monitoring {zones.length} zones • {zones.filter(z => z.status !== "NORMAL").length} alerts
          </div>
        </div>

        <div className="p-2">
          {zones.map((zone, idx) => (
            <div
              key={idx}
              onClick={() => setSelected(zone)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                selected?.zone === zone.zone ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">{zone.zone}</div>
                <div className={`text-xs font-bold ${getStatusColor(zone.status)}`}>
                  ● {zone.status}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-muted-foreground">
                  Temp: <span className="text-primary font-mono">{zone.temperature.toFixed(1)}°C</span>
                </div>
                <div className="text-muted-foreground">
                  Press: <span className="text-primary font-mono">{zone.pressure} PSI</span>
                </div>
                <div className="text-muted-foreground">
                  O₂: <span className="text-primary font-mono">{zone.oxygen}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[500px] p-6 bg-black/10 overflow-auto">
        {selected ? (
          <>
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-1">{selected.zone}</h3>
              <div className={`text-sm font-bold ${getStatusColor(selected.status)}`}>
                ● {selected.status}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg glass-panel">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-primary" />
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                  {selected.controlsEnabled && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => adjustTemperature(selected, -0.5)}
                        disabled={adjusting}
                        className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs disabled:opacity-50"
                      >
                        -0.5°C
                      </button>
                      <button
                        onClick={() => adjustTemperature(selected, 0.5)}
                        disabled={adjusting}
                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs disabled:opacity-50"
                      >
                        +0.5°C
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {selected.temperature.toFixed(1)}°C
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Target: {selected.targetTemp.toFixed(1)}°C
                </div>
              </div>

              <div className="p-4 rounded-lg glass-panel">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-5 h-5 text-primary" />
                  <div className="text-xs text-muted-foreground">Pressure</div>
                </div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {selected.pressure}
                </div>
                <div className="text-xs text-muted-foreground">PSI</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Target: {selected.targetPressure} PSI
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg glass-panel">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-5 h-5 text-primary" />
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {selected.humidity}%
                  </div>
                </div>

                <div className="p-4 rounded-lg glass-panel">
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <div className="text-xs text-muted-foreground">Oxygen</div>
                  </div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {selected.oxygen}%
                  </div>
                </div>
              </div>

              {selected.controlsEnabled && (
                <div className="space-y-2">
                  <button
                    onClick={() => normalizeEnvironment(selected)}
                    disabled={adjusting || selected.status === "NORMAL"}
                    className="w-full px-4 py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adjusting ? "ADJUSTING..." : "NORMALIZE ENVIRONMENT"}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        toast.info(`Emergency venting ${selected.zone}...`);
                        setTimeout(() => {
                          setZones(prev => prev.map(z =>
                            z.zone === selected.zone
                              ? { ...z, pressure: z.targetPressure, humidity: 40 }
                              : z
                          ));
                          toast.success("Emergency vent complete");
                        }, 2000);
                      }}
                      disabled={adjusting}
                      className="px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 font-bold text-xs hover:bg-yellow-500/30 disabled:opacity-50"
                    >
                      EMERGENCY VENT
                    </button>

                    <button
                      onClick={() => {
                        toast.info("Equalizing pressure...");
                        setTimeout(() => {
                          setZones(prev => prev.map(z => ({ ...z, pressure: 8247 })));
                          toast.success("Pressure equalized");
                        }, 3000);
                      }}
                      disabled={adjusting}
                      className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs hover:bg-blue-500/30 disabled:opacity-50"
                    >
                      EQUALIZE ALL
                    </button>
                  </div>
                </div>
              )}

              {selected.status === "WARNING" && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="text-xs text-yellow-500 font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    WARNING
                  </div>
                  <div className="text-xs text-yellow-400">
                    Environmental parameters outside normal range. Automated compensation active.
                  </div>
                </div>
              )}
              
              {selected.status === "CRITICAL" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-pulse">
                  <div className="text-xs text-destructive font-bold mb-1 flex items-center gap-1">
                    <Power className="w-4 h-4" />
                    CRITICAL - CONTROLS DISABLED
                  </div>
                  <div className="text-xs text-destructive/80">
                    Zone 4 environmental systems compromised. Manual control disabled for safety. Engineering intervention required.
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a zone to view details and controls
          </div>
        )}
      </div>
    </div>
  );
};
