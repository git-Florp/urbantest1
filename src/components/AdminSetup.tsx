import { useState } from "react";
import { Shield, User, Lock, AlertTriangle } from "lucide-react";

interface AdminSetupProps {
  onComplete: () => void;
}

export const AdminSetup = ({ onComplete }: AdminSetupProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Store admin credentials in localStorage
    const adminData = {
      username: username.trim(),
      password: password,
      id: "P000",
      name: `Administrator (${username.trim()})`,
      role: "System Administrator",
      clearance: 5,
      department: "Administration",
      location: "Control Room",
      status: "active",
      phone: "x1000",
      email: "admin@urbanshade.corp",
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("urbanshade_admin", JSON.stringify(adminData));
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(14,165,233,0.1),transparent_50%)] animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel p-8 border-2 border-primary/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-primary">FIRST TIME SETUP</h1>
            <p className="text-sm text-muted-foreground">Create Administrator Account</p>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-500/90">
                This account will have full system access. Store credentials securely.
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                <User className="w-3 h-3 inline mr-1" />
                Administrator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Enter username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                <Lock className="w-3 h-3 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                <Lock className="w-3 h-3 inline mr-1" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Confirm password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              CREATE ADMINISTRATOR ACCOUNT
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-muted-foreground">
            URBANSHADE SECURITY PROTOCOL v3.7.1
          </div>
        </div>
      </div>
    </div>
  );
};
