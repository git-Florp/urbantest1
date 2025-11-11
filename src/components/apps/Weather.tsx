import { Cloud, Droplets, Wind, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Weather = () => {
  return (
    <div className="p-6 space-y-6 bg-background h-full overflow-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Facility Exterior</h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Cloud className="w-16 h-16" />
          <div className="text-6xl font-bold">-2°C</div>
        </div>
        <p className="text-muted-foreground">Overcast, High Pressure</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wind className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="text-2xl font-bold">15 km/h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="text-2xl font-bold">8 km</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="text-2xl font-bold">1013 hPa</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-semibold mb-3">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
            <div key={day} className="text-center p-2 border border-border rounded">
              <p className="text-sm font-medium mb-2">{day}</p>
              <Cloud className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">-{i + 1}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
