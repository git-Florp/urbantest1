import { useState, useEffect } from "react";
import { Activity, Cpu, HardDrive, Waves, Zap, Thermometer } from "lucide-react";

export const SystemMonitor = () => {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [power, setPower] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(25 + Math.random() * 40));
      setMemory(Math.floor(60 + Math.random() * 20));
      setPressure(Math.floor(850 + Math.random() * 50));
      setTemperature(Math.floor(18 + Math.random() * 4));
      setPower(Math.floor(85 + Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, threshold: number) => {
    if (value > threshold) return "text-destructive";
    if (value > threshold * 0.8) return "text-yellow-500";
    return "text-primary";
  };

  const GaugeBar = ({ label, value, max, unit, icon: Icon, threshold }: any) => (
    <div className="p-4 rounded-lg glass-panel">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Current</span>
          <span className={`font-mono font-bold ${getStatusColor(value, threshold)}`}>
            {value}{unit}
          </span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              value > threshold ? "bg-destructive" : value > threshold * 0.8 ? "bg-yellow-500" : "bg-primary"
            }`}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-muted-foreground">Max: {max}{unit}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">System Monitor</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GaugeBar
          label="CPU Usage"
          value={cpu}
          max={100}
          unit="%"
          icon={Cpu}
          threshold={80}
        />
        <GaugeBar
          label="Memory Usage"
          value={memory}
          max={100}
          unit="%"
          icon={HardDrive}
          threshold={85}
        />
        <GaugeBar
          label="Pressure"
          value={pressure}
          max={1000}
          unit=" ATM"
          icon={Waves}
          threshold={950}
        />
        <GaugeBar
          label="Temperature"
          value={temperature}
          max={30}
          unit="°C"
          icon={Thermometer}
          threshold={25}
        />
        <GaugeBar
          label="Power Output"
          value={power}
          max={100}
          unit="%"
          icon={Zap}
          threshold={95}
        />
      </div>

      {/* Status Messages */}
      <div className="p-4 rounded-lg bg-black/40 border border-white/5">
        <div className="font-bold text-sm mb-2 text-primary">System Status</div>
        <div className="space-y-1 text-xs font-mono text-muted-foreground">
          <div>[OK] All core systems operational</div>
          <div>[OK] Facility integrity: Stable</div>
          <div>[OK] Network connection: Active</div>
          <div className="text-blue-400">[INFO] Specimen containment units monitored</div>
          {pressure > 900 && (
            <div className="text-yellow-500">[WARNING] Pressure levels elevated - Check hull seals</div>
          )}
          {temperature > 22 && (
            <div className="text-yellow-500">[WARNING] Temperature rising - HVAC working overtime</div>
          )}
          {cpu > 80 && (
            <div className="text-destructive">[ALERT] High CPU usage - Non-critical processes throttled</div>
          )}
          {cpu < 40 && memory < 70 && (
            <div className="text-primary">[OK] System resources optimal</div>
          )}
        </div>
      </div>

      {/* Uptime */}
      <div className="p-4 rounded-lg glass-panel">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">System Uptime</span>
          <span className="font-mono font-bold text-primary">14:23:45</span>
        </div>
      </div>
    </div>
  );
};
