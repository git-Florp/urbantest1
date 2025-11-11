import { useEffect, useState } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeZones = [
    { name: "Facility Local", offset: 0 },
    { name: "New York", offset: -5 },
    { name: "London", offset: 0 },
    { name: "Tokyo", offset: 9 },
    { name: "Sydney", offset: 11 },
  ];

  return (
    <div className="p-6 space-y-6 bg-background h-full overflow-auto">
      <div className="text-center">
        <ClockIcon className="w-16 h-16 mx-auto mb-4" />
        <div className="text-6xl font-bold font-mono mb-2">
          {time.toLocaleTimeString()}
        </div>
        <p className="text-muted-foreground">{time.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">World Clocks</h3>
        {timeZones.map(zone => {
          const zoneTime = new Date(time.getTime() + zone.offset * 3600000);
          return (
            <Card key={zone.name} className="p-4 flex items-center justify-between">
              <span className="font-medium">{zone.name}</span>
              <span className="font-mono text-lg">{zoneTime.toLocaleTimeString()}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
