import { useState, useEffect } from "react";
import { Desktop } from "@/components/Desktop";
import { UserSelectionScreen } from "@/components/UserSelectionScreen";
import { BootScreen } from "@/components/BootScreen";
import { ShutdownScreen } from "@/components/ShutdownScreen";
import { RebootScreen } from "@/components/RebootScreen";
import { CrashScreen } from "@/components/CrashScreen";
import { InstallationScreen } from "@/components/InstallationScreen";
import { AdminPanel } from "@/components/AdminPanel";
import { MaintenanceMode } from "@/components/MaintenanceMode";
import { LockdownScreen } from "@/components/LockdownScreen";
import { FirstTimeTour } from "@/components/FirstTimeTour";
import { RecoveryMode } from "@/components/RecoveryMode";

const Index = () => {
  const [adminSetupComplete, setAdminSetupComplete] = useState(false);
  const [booted, setBooted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [rebooting, setRebooting] = useState(false);
  const [blackScreen, setBlackScreen] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [killedProcess, setKilledProcess] = useState<string>("");
  const [crashType, setCrashType] = useState<"kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload">("kernel");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [customCrashData, setCustomCrashData] = useState<{ title: string; message: string } | null>(null);
  const [lockdownMode, setLockdownMode] = useState(false);
  const [lockdownProtocol, setLockdownProtocol] = useState<string>("");
  const [showTour, setShowTour] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [needsRecovery, setNeedsRecovery] = useState(false);
  const [inRecoveryMode, setInRecoveryMode] = useState(false);

  // Check if admin setup is complete and setup key listeners
  useEffect(() => {
    const adminData = localStorage.getItem("urbanshade_admin");
    setAdminSetupComplete(!!adminData);

    // Space key for recovery mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && loggedIn && !lockdownMode && !crashed && !shuttingDown && !rebooting) {
        e.preventDefault();
        setRebooting(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Expose console commands to window object
    (window as any).adminPanel = (password?: string) => {
      if (password === "HereIsThePassword" || !password) {
        setShowAdminPanel(true);
        console.log("%c[SYSTEM] Admin Panel Activated", "color: #00ff00; font-weight: bold");
      } else {
        console.log("%c[ERROR] Invalid password", "color: #ff0000; font-weight: bold");
      }
    };

    (window as any).maintenanceMode = () => {
      setMaintenanceMode(true);
      console.log("%c[SYSTEM] Entering Maintenance Mode...", "color: #ffff00; font-weight: bold");
    };

    (window as any).normalMode = () => {
      setMaintenanceMode(false);
      setShowAdminPanel(false);
      console.log("%c[SYSTEM] Returning to Normal Mode...", "color: #00ff00; font-weight: bold");
    };

    // Show available commands in console
    console.log(
      "%c[URBANSHADE OS] Console Commands Available",
      "color: #00ffff; font-weight: bold; font-size: 14px"
    );
    console.log(
      "%cadminPanel() - Access admin panel (password required)",
      "color: #888888"
    );
    console.log(
      "%cmaintenanceMode() - Enter maintenance mode",
      "color: #888888"
    );
    console.log(
      "%cnormalMode() - Return to normal mode",
      "color: #888888"
    );
    console.log(
      "%c\nHint: Check the HTML source for hidden secrets...",
      "color: #ffaa00; font-style: italic"
    );

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loggedIn, lockdownMode, crashed, shuttingDown, rebooting]);

  // Check for first time tour
  useEffect(() => {
    if (loggedIn && !crashed && !lockdownMode) {
      const tourCompleted = localStorage.getItem("urbanshade_tour_completed");
      if (!tourCompleted) {
        setTimeout(() => setShowTour(true), 2000);
      }
    }
  }, [loggedIn, crashed, lockdownMode]);

  const handleReboot = () => {
    setLoggedIn(false);
    setRebooting(true);
  };

  const handleRebootComplete = () => {
    setRebooting(false);
    setLoggedIn(false);
    setBlackScreen(true);
    // Black screen for 3 seconds
    setTimeout(() => {
      setBlackScreen(false);
      setBooted(false);
    }, 3000);
  };

  const handleInstallationComplete = (adminData: { username: string; password: string }) => {
    const fullAdminData = {
      username: adminData.username,
      password: adminData.password,
      id: "P000",
      name: `Administrator (${adminData.username})`,
      role: "System Administrator",
      clearance: 5,
      department: "Administration",
      location: "Control Room",
      status: "active",
      phone: "x1000",
      email: "admin@urbanshade.corp",
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("urbanshade_admin", JSON.stringify(fullAdminData));
    setAdminSetupComplete(true);
  };

  const handleShutdownComplete = () => {
    setShuttingDown(false);
    // Wait 3 seconds before showing nothing
    setTimeout(() => {
      setBooted(false);
    }, 3000);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleCriticalKill = (processName: string, type: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload" = "kernel") => {
    setKilledProcess(processName);
    setCrashType(type);
    setCustomCrashData(null);
    setCrashed(true);
    
    // Some crash types require recovery mode
    if (type === "corruption" || type === "virus" || Math.random() < 0.3) {
      setNeedsRecovery(true);
    }
  };

  const handleCustomCrash = (title: string, message: string, type: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => {
    setCustomCrashData({ title, message });
    setKilledProcess("admin.custom");
    setCrashType(type);
    setCrashed(true);
  };

  const handleAdminCrash = (type: string) => {
    const crashTypes: any = {
      kernel: "kernel",
      bluescreen: "bluescreen",
      memory: "memory",
      corruption: "corruption",
      overload: "overload",
      virus: "virus"
    };
    handleCriticalKill("admin.panel", crashTypes[type] || "kernel");
  };

  const handleCrashReboot = () => {
    if (needsRecovery) {
      setInRecoveryMode(true);
      setCrashed(false);
    } else {
      setCrashed(false);
      setLoggedIn(false);
      setBooted(false);
      setKilledProcess("");
      setCrashType("kernel");
      setCustomCrashData(null);
    }
  };

  const handleLockdown = (protocolName: string) => {
    setLockdownMode(true);
    setLockdownProtocol(protocolName);
  };

  const handleLockdownAuthorized = () => {
    setLockdownMode(false);
    setLockdownProtocol("");
  };

  if (!adminSetupComplete) {
    return <InstallationScreen onComplete={handleInstallationComplete} />;
  }

  if (lockdownMode) {
    return <LockdownScreen onAuthorized={handleLockdownAuthorized} protocolName={lockdownProtocol} />;
  }

  if (crashed) {
    return <CrashScreen onReboot={handleCrashReboot} killedProcess={killedProcess} crashType={crashType} customData={customCrashData} />;
  }

  if (shuttingDown) {
    return <ShutdownScreen onComplete={handleShutdownComplete} />;
  }

  if (rebooting) {
    return <RebootScreen onComplete={handleRebootComplete} />;
  }

  if (blackScreen) {
    return <div className="fixed inset-0 bg-black" />;
  }

  if (inRecoveryMode) {
    return <RecoveryMode onExit={() => {
      setInRecoveryMode(false);
      setNeedsRecovery(false);
      setBooted(false);
      setLoggedIn(false);
      setKilledProcess("");
      setCrashType("kernel");
      setCustomCrashData(null);
    }} />;
  }

  if (!booted) {
    return <BootScreen 
      onComplete={() => setBooted(true)} 
      onSafeMode={() => {
        setSafeMode(true);
        setBooted(true);
      }}
    />;
  }

  if (!loggedIn) {
    return <UserSelectionScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <Desktop 
        onLogout={handleLogout} 
        onReboot={handleReboot} 
        onCriticalKill={handleCriticalKill}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onLockdown={handleLockdown}
      />
      {showAdminPanel && <AdminPanel onExit={() => setShowAdminPanel(false)} onCrash={handleAdminCrash} onCustomCrash={handleCustomCrash} />}
      {maintenanceMode && <MaintenanceMode onExit={() => setMaintenanceMode(false)} />}
      {showTour && <FirstTimeTour onComplete={() => setShowTour(false)} />}
    </>
  );
};

export default Index;
