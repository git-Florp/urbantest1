import { useState } from "react";
import { Lock, AlertTriangle, Shield } from "lucide-react";

interface LockdownScreenProps {
  onAuthorized: () => void;
  protocolName: string;
}

export const LockdownScreen = ({ onAuthorized, protocolName }: LockdownScreenProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password) {
      setError("Authorization code required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const adminData = localStorage.getItem("urbanshade_admin");
      
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (password === admin.password) {
          onAuthorized();
        } else {
          setError("INVALID AUTHORIZATION CODE");
          setLoading(false);
        }
      } else {
        setError("SYSTEM ERROR: No administrator credentials found");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center">
      {/* Red alert overlay */}
      <div className="absolute inset-0 bg-destructive/10 animate-pulse pointer-events-none" />
      
      {/* Scan lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px)`
        }}
      />

      <div className="relative z-10 w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-24 h-24 text-destructive animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-destructive tracking-wider">
            FACILITY LOCKDOWN
          </h1>
          <div className="text-xl text-destructive font-mono mb-2">
            ⚠ EMERGENCY PROTOCOL ACTIVATED ⚠
          </div>
          <div className="text-sm text-muted-foreground font-mono mt-4">
            Protocol: {protocolName}
          </div>
        </div>

        {/* Warning Messages */}
        <div className="glass-panel p-6 mb-6 border-destructive/30">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div className="text-sm font-mono space-y-2">
              <div className="text-destructive font-bold">LOCKDOWN STATUS:</div>
              <div className="text-muted-foreground">• All facility access points sealed</div>
              <div className="text-muted-foreground">• Emergency containment active</div>
              <div className="text-muted-foreground">• All non-essential systems offline</div>
              <div className="text-muted-foreground">• Personnel movement restricted</div>
            </div>
          </div>
        </div>

        {/* Authorization Form */}
        <form onSubmit={handleSubmit}>
          <div className="glass-panel p-6 space-y-4 border-primary/30">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Lock className="w-5 h-5" />
              <span className="font-bold text-sm">LEVEL 5 AUTHORIZATION REQUIRED</span>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2 font-mono">
                ADMINISTRATOR AUTHORIZATION CODE
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-primary/30 rounded-lg text-foreground font-mono focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="Enter admin password"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-xs font-mono animate-pulse">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFYING AUTHORIZATION..." : "DEACTIVATE LOCKDOWN"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-destructive font-mono space-y-1 animate-pulse">
          <div>⚠ UNAUTHORIZED OVERRIDE ATTEMPTS WILL BE LOGGED ⚠</div>
          <div>SECURITY PERSONNEL HAVE BEEN NOTIFIED</div>
        </div>
      </div>
    </div>
  );
};
