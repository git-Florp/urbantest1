import { useState, useEffect } from "react";
import { Shield, HardDrive, Settings, User, Check, Loader2 } from "lucide-react";

interface InstallationScreenProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

export const InstallationScreen = ({ onComplete }: InstallationScreenProps) => {
  const [stage, setStage] = useState<"welcome" | "options" | "installing" | "user-setup">("welcome");
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installationType, setInstallationType] = useState<"standard" | "minimal" | "full">("standard");
  
  // User setup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const installSteps = [
    "Preparing installation environment...",
    "Creating system partitions...",
    "Installing bootloader (GRUB)...",
    "Copying system files...",
    "Installing kernel modules...",
    "Configuring system services...",
    "Setting up network stack...",
    "Installing security modules...",
    "Configuring containment systems...",
    "Setting up monitoring tools...",
    "Installing database drivers...",
    "Configuring authentication system...",
    "Setting up specimen tracking...",
    "Installing emergency protocols...",
    "Configuring pressure monitoring...",
    "Setting up communication systems...",
    "Installing power grid controls...",
    "Finalizing installation...",
    "Running system diagnostics...",
    "Installation complete!"
  ];

  useEffect(() => {
    if (stage === "installing") {
      let currentStep = 0;
      const totalSteps = installSteps.length;
      
      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          setInstallLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${installSteps[currentStep]}`]);
          setInstallProgress(((currentStep + 1) / totalSteps) * 100);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStage("user-setup"), 1000);
        }
      }, 3000); // 3 seconds per step, ~1 minute total

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleUserSetup = (e: React.FormEvent) => {
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

    onComplete({ username: username.trim(), password });
  };

  if (stage === "welcome") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-primary">URBANSHADE OS</h1>
            <p className="text-lg text-muted-foreground">Installation Wizard v3.7.1</p>
            <div className="mt-6 text-sm text-yellow-500">
              ⚠ CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <div className="space-y-3 text-sm">
              <p className="text-primary font-bold">Welcome to Urbanshade Operating System Setup</p>
              <p className="text-muted-foreground">
                This wizard will guide you through the installation of the Urbanshade facility management system.
              </p>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs">
                <strong>NOTICE:</strong> This system is designed for deep-sea facility operations.
                Ensure all hardware requirements are met before proceeding.
              </div>
            </div>

            <button
              onClick={() => setStage("options")}
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              BEGIN INSTALLATION
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "options") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">INSTALLATION OPTIONS</h2>
            <p className="text-sm text-muted-foreground mt-2">Select installation type</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => setInstallationType("minimal")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "minimal"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <HardDrive className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">MINIMAL INSTALLATION</h3>
                  <p className="text-sm text-muted-foreground">
                    Core system only. Recommended for backup terminals.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~2.4 GB required</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setInstallationType("standard")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "standard"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <Settings className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">STANDARD INSTALLATION (Recommended)</h3>
                  <p className="text-sm text-muted-foreground">
                    All essential features for facility management.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~5.7 GB required</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setInstallationType("full")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "full"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">FULL INSTALLATION</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete system with all features, monitoring, and security modules.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~12.3 GB required</p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStage("welcome")}
              className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
            >
              BACK
            </button>
            <button
              onClick={() => setStage("installing")}
              className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all"
            >
              INSTALL
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "installing") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">INSTALLING URBANSHADE OS</h2>
            <p className="text-sm text-muted-foreground">Installation Type: {installationType.toUpperCase()}</p>
          </div>

          <div className="glass-panel p-6 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-bold">{Math.round(installProgress)}%</span>
              </div>
              <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>

            {/* Installation Logs */}
            <div className="h-96 bg-black/50 rounded-lg p-4 overflow-y-auto border border-white/10 font-mono text-xs space-y-1">
              {installLogs.map((log, i) => (
                <div key={i} className="text-green-400">
                  {log}
                  {i === installLogs.length - 1 && <span className="animate-pulse">_</span>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-yellow-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please do not power off the system...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "user-setup") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">CREATE ADMINISTRATOR</h2>
            <p className="text-sm text-muted-foreground">Setup your admin account</p>
          </div>

          <form onSubmit={handleUserSetup} className="glass-panel p-6 space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Installation completed successfully!</span>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
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
              CREATE ACCOUNT & FINISH
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
