import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GenericAppProps {
  title: string;
  description: string;
  features?: string[];
}

export const GenericApp = ({ title, description, features = [] }: GenericAppProps) => {
  return (
    <div className="p-6 space-y-6 bg-background h-full overflow-auto">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <Badge variant="secondary">Version 1.0.0</Badge>
          </div>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {features && features.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Features
          </h3>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4 border-amber-500/50 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-500 mb-1">Application Status</h4>
            <p className="text-sm text-muted-foreground">
              This application is running in demonstration mode. Full functionality requires proper system configuration and permissions.
            </p>
          </div>
        </div>
      </Card>

      <div className="border-t border-border pt-4">
        <h3 className="font-semibold mb-3">System Information</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-500">OPERATIONAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Process ID:</span>
            <span>{Math.floor(Math.random() * 9000 + 1000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Memory Usage:</span>
            <span>{Math.floor(Math.random() * 50 + 10)} MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uptime:</span>
            <span>{Math.floor(Math.random() * 60)} seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
