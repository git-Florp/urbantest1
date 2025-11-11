import { Skull } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CrashApp = ({ onCrash }: { onCrash?: () => void }) => {
  const handleCrash = () => {
    if (window.confirm("WARNING: This will immediately crash the system. Continue?")) {
      onCrash?.();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Skull className="w-24 h-24 text-destructive mb-6 animate-pulse" />
      <h2 className="text-2xl font-bold mb-4 text-destructive">SYSTEM CRASH UTILITY</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        This application will force an immediate system crash. Use only for testing crash recovery and blue screen handlers.
      </p>
      <Button onClick={handleCrash} variant="destructive" size="lg" className="animate-pulse">
        <Skull className="w-5 h-5 mr-2" />
        CRASH SYSTEM NOW
      </Button>
      <p className="text-xs text-destructive/60 mt-6">
        WARNING: All unsaved work will be lost
      </p>
    </div>
  );
};
