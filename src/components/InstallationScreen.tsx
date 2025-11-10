import { useState, useEffect } from "react";
import { Shield, HardDrive, Settings, User, Check, Loader2 } from "lucide-react";

interface InstallationScreenProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

export const InstallationScreen = ({ onComplete }: InstallationScreenProps) => {
  const [stage, setStage] = useState<"welcome" | "options" | "installing" | "settings" | "user-setup" | "rebooting">("welcome");
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installationType, setInstallationType] = useState<"standard" | "minimal" | "full">("standard");
  
  // Settings
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [keyboardLayout, setKeyboardLayout] = useState("US");
  
  // User setup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const getInstallSteps = () => {
    const baseSteps = [
      { text: "Preparing installation environment...", duration: 2000 },
      { text: "Creating system partitions...", duration: 3000 },
      { text: "Installing bootloader (GRUB)...", duration: 1500 },
      { text: "Copying system files...", duration: 4000 },
      { text: "Installing kernel modules...", duration: 2500 }
    ];

    if (installationType === "minimal") {
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 1000 },
        { text: "Setting up network stack...", duration: 1500 },
        { text: "Finalizing installation...", duration: 1000 },
        { text: "Installation complete!", duration: 500 }
      ];
    } else if (installationType === "standard") {
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 2000 },
        { text: "Setting up network stack...", duration: 2500 },
        { text: "Installing security modules...", duration: 3000 },
        { text: "Configuring containment systems...", duration: 2000 },
        { text: "Setting up monitoring tools...", duration: 1500 },
        { text: "Installing database drivers...", duration: 2500 },
        { text: "Configuring authentication system...", duration: 1800 },
        { text: "Finalizing installation...", duration: 1500 },
        { text: "Running system diagnostics...", duration: 2000 },
        { text: "Installation complete!", duration: 500 }
      ];
    } else { // full
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 3000 },
        { text: "Setting up network stack...", duration: 3500 },
        { text: "Installing security modules...", duration: 4000 },
        { text: "Configuring containment systems...", duration: 3000 },
        { text: "Setting up monitoring tools...", duration: 2500 },
        { text: "Installing database drivers...", duration: 3500 },
        { text: "Configuring authentication system...", duration: 2800 },
        { text: "Setting up specimen tracking...", duration: 3200 },
        { text: "Installing emergency protocols...", duration: 2500 },
        { text: "Configuring pressure monitoring...", duration: 2000 },
        { text: "Setting up communication systems...", duration: 3000 },
        { text: "Installing power grid controls...", duration: 2800 },
        { text: "Installing all applications...", duration: 5000 },
        { text: "Finalizing installation...", duration: 2000 },
        { text: "Running system diagnostics...", duration: 3000 },
        { text: "Installation complete!", duration: 500 }
      ];
    }
  };

  useEffect(() => {
    if (stage === "installing") {
      const steps = getInstallSteps();
      let currentStep = 0;
      const totalSteps = steps.length;
      
      const runStep = () => {
        if (currentStep < totalSteps) {
          setInstallLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep].text}`]);
          setInstallProgress(((currentStep + 1) / totalSteps) * 100);
          const duration = steps[currentStep].duration;
          currentStep++;
          setTimeout(runStep, duration);
        } else {
          setTimeout(() => setStage("settings"), 1000);
        }
      };

      runStep();
    }
  }, [stage, installationType]);

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

    // Save installation type
    localStorage.setItem("urbanshade_install_type", installationType);
    
    // Trigger reboot sequence
    setStage("rebooting");
    setTimeout(() => {
      onComplete({ username: username.trim(), password });
    }, 5000); // 5 seconds of reboot
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
              CONTINUE
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

  if (stage === "settings") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Settings className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">SYSTEM SETTINGS</h2>
            <p className="text-sm text-muted-foreground">Configure your installation</p>
          </div>

          <div className="glass-panel p-6 space-y-6">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Installation completed successfully!</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Automatic Updates
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setAutoUpdates(true)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left text-sm ${
                    autoUpdates ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold">Enable automatic updates</div>
                  <div className="text-xs text-muted-foreground">Recommended for security patches</div>
                </button>
                <button
                  onClick={() => setAutoUpdates(false)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left text-sm ${
                    !autoUpdates ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold">Manual updates only</div>
                  <div className="text-xs text-muted-foreground">You control when to update</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Keyboard Layout
              </label>
              <select
                value={keyboardLayout}
                onChange={(e) => setKeyboardLayout(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
              >
                <option value="US">US (QWERTY)</option>
                <option value="UK">UK (QWERTY)</option>
                <option value="DE">German (QWERTZ)</option>
                <option value="FR">French (AZERTY)</option>
                <option value="ES">Spanish</option>
                <option value="JP">Japanese</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">* Layout selection is cosmetic only</p>
            </div>

            <button
              onClick={() => setStage("user-setup")}
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              CONTINUE TO USER SETUP
            </button>
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
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs flex items-start gap-2">
              <User className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Settings saved. Create your administrator account.</span>
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
