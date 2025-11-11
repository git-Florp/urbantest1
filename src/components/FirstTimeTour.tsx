import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Zap, BookOpen } from "lucide-react";

interface FirstTimeTourProps {
  onComplete: () => void;
}

export const FirstTimeTour = ({ onComplete }: FirstTimeTourProps) => {
  const [tourType, setTourType] = useState<"short" | "long" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const shortSteps = [
    {
      title: "Welcome to Urbanshade OS",
      description: "Your facility management operating system.",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-lg">Deep-sea facility management at your fingertips.</p>
          <p className="text-sm text-muted-foreground">Let's cover the essentials quickly.</p>
        </div>
      )
    },
    {
      title: "Key Applications",
      description: "Your essential tools for facility management.",
      content: (
        <div className="space-y-3">
          <p className="text-sm font-bold">Main Apps:</p>
          <ul className="space-y-2 text-sm">
            <li>📁 <strong>File Explorer</strong> - Access facility files</li>
            <li>📊 <strong>System Monitor</strong> - Check system health</li>
            <li>💬 <strong>Messages</strong> - Staff communications</li>
            <li>🎛️ <strong>Terminal</strong> - Run system commands</li>
            <li>🗺️ <strong>Facility Map</strong> - Monitor all zones</li>
          </ul>
        </div>
      )
    },
    {
      title: "Start Menu & Navigation",
      description: "Access everything from the Start Menu (bottom-left button).",
      content: (
        <div className="space-y-3">
          <p className="text-sm">The Start Menu provides quick access to:</p>
          <ul className="space-y-2 text-sm">
            <li>• All installed applications</li>
            <li>• System options (Reboot, Logout)</li>
            <li>• Task Manager for process control</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">F8</kbd> during boot for Safe Mode.
          </p>
        </div>
      )
    },
    {
      title: "You're Ready!",
      description: "That's all you need to get started.",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg">Quick Tour Complete!</p>
          <p className="text-sm text-muted-foreground">
            For detailed documentation, open the Browser app and navigate to the docs.
          </p>
          <div className="glass-panel p-4 mt-6 text-left">
            <p className="text-xs font-bold text-primary mb-2">Remember:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Check messages regularly</li>
              <li>• Monitor system status</li>
              <li>• Follow safety protocols</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const longSteps = [
    {
      title: "Welcome to Urbanshade OS",
      description: "This is your comprehensive facility management operating system.",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-lg">You're now running the most advanced deep-sea facility management system.</p>
          <p className="text-sm text-muted-foreground">This detailed tour will cover everything you need to know.</p>
        </div>
      )
    },
    {
      title: "Desktop & Applications",
      description: "Your desktop shows all available applications organized as icons.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Click any icon to open an application. You can also:</p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Hold and drag</strong> icons to rearrange them on a grid</li>
            <li>• <strong>Multiple windows</strong> can be open simultaneously</li>
            <li>• <strong>Click the taskbar</strong> to switch between open apps</li>
          </ul>
        </div>
      )
    },
    {
      title: "File Explorer",
      description: "Browse and manage facility files, documents, and data.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">The File Explorer lets you:</p>
          <ul className="space-y-2 text-sm">
            <li>📂 Navigate folder structures</li>
            <li>📄 View text files and documents</li>
            <li>🔍 Search for specific files</li>
            <li>⚠️ Discover hidden or corrupted data</li>
          </ul>
          <p className="text-xs text-yellow-500 mt-3">Warning: Some files may trigger security alerts</p>
        </div>
      )
    },
    {
      title: "System Monitor",
      description: "Real-time monitoring of facility systems and health.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Monitor critical metrics:</p>
          <ul className="space-y-2 text-sm">
            <li>💾 Memory & CPU usage</li>
            <li>🌡️ Temperature readings</li>
            <li>⚡ Power consumption</li>
            <li>🔋 Battery backup status</li>
            <li>📊 System performance graphs</li>
          </ul>
        </div>
      )
    },
    {
      title: "Personnel Directory",
      description: "Access staff information and clearance levels.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Personnel database includes:</p>
          <ul className="space-y-2 text-sm">
            <li>👤 Employee profiles and photos</li>
            <li>🔐 Security clearance levels (1-5)</li>
            <li>📞 Contact information</li>
            <li>📅 Work schedules and assignments</li>
            <li>⚠️ Status updates (active/missing)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Terminal & Commands",
      description: "Advanced system control through command-line interface.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Essential commands:</p>
          <div className="glass-panel p-3 font-mono text-xs space-y-1">
            <div><span className="text-primary">help</span> - List all commands</div>
            <div><span className="text-primary">status</span> - System status report</div>
            <div><span className="text-primary">scan</span> - Run diagnostics</div>
            <div><span className="text-primary">list</span> - List directory contents</div>
            <div><span className="text-primary">clear</span> - Clear terminal</div>
            <div><span className="text-primary">admin</span> - Admin panel (secret)</div>
          </div>
          <p className="text-xs text-yellow-500 mt-3">⚠ Some commands require Level 4+ clearance</p>
        </div>
      )
    },
    {
      title: "Messages System",
      description: "Internal communication system for staff coordination.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Messages appear randomly and include:</p>
          <ul className="space-y-2 text-sm">
            <li>💬 Staff communications</li>
            <li>📢 System announcements</li>
            <li>⚠️ Emergency alerts</li>
            <li>📝 Task assignments</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Check messages frequently - critical alerts may appear at any time.
          </p>
        </div>
      )
    },
    {
      title: "Security Cameras",
      description: "Monitor facility zones through the security camera network.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Camera features:</p>
          <ul className="space-y-2 text-sm">
            <li>📹 Live feeds from all zones</li>
            <li>🗺️ <strong>List View</strong> - Browse all cameras</li>
            <li>🗺️ <strong>Map View</strong> - Select by facility area</li>
            <li>⚠️ Automatic alerts for unusual activity</li>
          </ul>
          <div className="glass-panel p-2 mt-3 text-xs">
            <p className="text-muted-foreground">Status indicators:</p>
            <p className="text-primary">🟢 Online | 🟡 Warning | 🔴 Offline</p>
          </div>
        </div>
      )
    },
    {
      title: "Emergency Protocols",
      description: "Critical emergency procedures for containment breaches.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Emergency codes:</p>
          <ul className="space-y-2 text-sm">
            <li>🔴 <strong>CODE-BLACK</strong> - Total facility lockdown</li>
            <li>🟠 <strong>CODE-RED</strong> - Containment breach protocol</li>
            <li>🟡 <strong>CODE-YELLOW</strong> - Security alert</li>
          </ul>
          <p className="text-xs text-destructive mt-4">
            ⚠ CRITICAL: Only activate in genuine emergencies. Requires Level 4+ clearance. False activation may result in disciplinary action.
          </p>
        </div>
      )
    },
    {
      title: "Facility Map",
      description: "Interactive map showing all facility zones and their status.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Map features:</p>
          <ul className="space-y-2 text-sm">
            <li>🏢 All facility rooms and corridors</li>
            <li>🔗 Connections between zones</li>
            <li>📊 Real-time status for each room</li>
            <li>🎨 Color-coded severity levels</li>
          </ul>
          <div className="glass-panel p-2 mt-3 text-xs">
            <p className="text-primary">🟢 Operational</p>
            <p className="text-yellow-500">🟡 Warning</p>
            <p className="text-destructive">🔴 Critical</p>
            <p className="text-muted-foreground">⚫ Offline</p>
          </div>
        </div>
      )
    },
    {
      title: "Facility Planner",
      description: "Design and plan facility layouts with advanced tools.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Planner capabilities:</p>
          <ul className="space-y-2 text-sm">
            <li>🏗️ Create custom room layouts</li>
            <li>🔗 Connect rooms with hallways</li>
            <li>⚙️ <strong>Auto-hallway generation</strong> option</li>
            <li>💾 Save and load multiple designs</li>
            <li>📐 Precise sizing and positioning</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Toggle hallway settings to automatically generate corridors between connected rooms.
          </p>
        </div>
      )
    },
    {
      title: "Task Manager",
      description: "Monitor and control running processes.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Process management:</p>
          <ul className="space-y-2 text-sm">
            <li>📋 View all open applications</li>
            <li>💾 Monitor memory usage</li>
            <li>⚡ CPU consumption per process</li>
            <li>❌ Force-close unresponsive apps</li>
            <li>⚠️ Critical process warnings</li>
          </ul>
          <p className="text-xs text-yellow-500 mt-3">
            Warning: Killing system processes may cause instability
          </p>
        </div>
      )
    },
    {
      title: "Network Scanner",
      description: "Scan and monitor network devices and connections.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Network tools:</p>
          <ul className="space-y-2 text-sm">
            <li>🌐 Discover connected devices</li>
            <li>📡 Monitor network traffic</li>
            <li>🔒 Security status checks</li>
            <li>⚠️ Detect unauthorized access</li>
          </ul>
        </div>
      )
    },
    {
      title: "Incident Reports",
      description: "Document and review facility incidents and anomalies.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Incident tracking:</p>
          <ul className="space-y-2 text-sm">
            <li>📝 Detailed incident reports</li>
            <li>📅 Chronological timeline</li>
            <li>🔍 Severity classifications</li>
            <li>👥 Personnel involved</li>
            <li>✅ Resolution status</li>
          </ul>
        </div>
      )
    },
    {
      title: "Additional Applications",
      description: "More specialized tools for facility management.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Other available apps:</p>
          <ul className="space-y-2 text-sm">
            <li>🧬 <strong>Specimen Database</strong> - Research data</li>
            <li>🎵 <strong>Audio Logs</strong> - Voice recordings</li>
            <li>📖 <strong>Research Notes</strong> - Scientific documentation</li>
            <li>⚡ <strong>Power Grid</strong> - Electrical systems</li>
            <li>🌡️ <strong>Environment Control</strong> - Climate management</li>
            <li>🔒 <strong>Containment Monitor</strong> - Security systems</li>
          </ul>
        </div>
      )
    },
    {
      title: "System Recovery",
      description: "What to do when things go wrong.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Recovery options:</p>
          <ul className="space-y-2 text-sm">
            <li>🔧 <strong>Safe Mode</strong> - Press F8 during boot</li>
            <li>🛠️ <strong>Recovery Mode</strong> - System repair tools</li>
            <li>💾 <strong>System Restore</strong> - Rollback changes</li>
            <li>🔄 <strong>Reboot</strong> - Restart the system</li>
          </ul>
          <p className="text-xs text-yellow-500 mt-3">
            Some system crashes require recovery mode repairs before normal boot
          </p>
        </div>
      )
    },
    {
      title: "Installation Types",
      description: "Different installations provide different app sets.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Installation options:</p>
          <ul className="space-y-2 text-sm">
            <li>📦 <strong>Minimal</strong> - Core apps only (File Explorer, Terminal, etc.)</li>
            <li>📦 <strong>Standard</strong> - Most common apps included</li>
            <li>📦 <strong>Full</strong> - All applications available</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Your current installation determines which apps appear on your desktop.
          </p>
        </div>
      )
    },
    {
      title: "Admin Panel (Secret)",
      description: "Hidden advanced features for experienced users.",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Access the admin panel:</p>
          <div className="glass-panel p-3 font-mono text-xs mb-3">
            <p>1. Open Terminal</p>
            <p>2. Type: <span className="text-primary">admin</span></p>
            <p>3. Enter password when prompted</p>
          </div>
          <p className="text-sm">Admin features include:</p>
          <ul className="space-y-2 text-sm">
            <li>🎨 Visual effects control</li>
            <li>💥 Crash simulation</li>
            <li>🔧 System modifications</li>
            <li>⚙️ Advanced settings</li>
          </ul>
          <p className="text-xs text-destructive mt-3">
            ⚠ Use responsibly - some features may destabilize the system
          </p>
        </div>
      )
    },
    {
      title: "Tips & Best Practices",
      description: "Pro tips for effective facility management.",
      content: (
        <div className="space-y-3">
          <p className="text-sm font-bold text-primary mb-2">Recommended practices:</p>
          <ul className="space-y-2 text-sm">
            <li>✓ Check messages regularly for updates</li>
            <li>✓ Monitor system health proactively</li>
            <li>✓ Review security cameras periodically</li>
            <li>✓ Keep emergency protocols accessible</li>
            <li>✓ Document all incidents promptly</li>
            <li>✓ Maintain awareness of personnel status</li>
          </ul>
          <div className="glass-panel p-3 mt-4 text-xs text-muted-foreground">
            Remember: This facility operates in a high-risk environment. Stay alert and follow all safety protocols.
          </div>
        </div>
      )
    },
    {
      title: "You're Ready!",
      description: "You now have comprehensive knowledge of Urbanshade OS.",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg">Complete Tour Finished!</p>
          <p className="text-sm text-muted-foreground">
            You're now fully prepared to manage this facility. Stay safe down there.
          </p>
          <div className="glass-panel p-4 mt-6 text-left space-y-3">
            <p className="text-xs font-bold text-primary mb-2">Quick Reference:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong>Start Menu</strong> - Bottom-left button</li>
              <li>• <strong>Safe Mode</strong> - F8 during boot</li>
              <li>• <strong>Admin Panel</strong> - Terminal → "admin"</li>
              <li>• <strong>Emergency</strong> - Emergency Protocols app</li>
            </ul>
            <div className="pt-2 border-t border-white/10 text-xs">
              <p className="text-primary font-bold mb-1">Documentation:</p>
              <p className="text-muted-foreground">Open Browser app → Navigate to docs for detailed information</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const steps = tourType === "short" ? shortSteps : longSteps;
  const currentStepData = tourType && steps && steps[currentStep] ? steps[currentStep] : null;
  const isLastStep = currentStepData && currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem("urbanshade_tour_completed", "true");
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("urbanshade_tour_completed", "true");
    onComplete();
  };

  const handleSelectTour = (type: "short" | "long") => {
    setTourType(type);
    setCurrentStep(0);
  };

  // Tour selection screen
  if (!tourType) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl glass-panel p-8 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🏢</div>
            <h2 className="text-3xl font-bold text-primary mb-3">Welcome to Urbanshade OS</h2>
            <p className="text-muted-foreground">Choose your onboarding experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectTour("short")}
              className="group glass-panel p-6 hover:bg-primary/10 transition-all border-2 border-transparent hover:border-primary"
            >
              <Zap className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Quick Tour</h3>
              <p className="text-sm text-muted-foreground mb-3">4 steps · ~2 minutes</p>
              <p className="text-xs text-muted-foreground">
                Get up and running fast with just the essentials. Perfect if you're familiar with similar systems.
              </p>
            </button>

            <button
              onClick={() => handleSelectTour("long")}
              className="group glass-panel p-6 hover:bg-primary/10 transition-all border-2 border-transparent hover:border-primary"
            >
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Complete Tour</h3>
              <p className="text-sm text-muted-foreground mb-3">19 steps · ~10 minutes</p>
              <p className="text-xs text-muted-foreground">
                Comprehensive walkthrough of all features and capabilities. Recommended for first-time users.
              </p>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Skip tour and explore on your own
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tour steps
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel p-8 relative">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded-full transition-colors ${
                idx <= currentStep ? "bg-primary" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        {currentStepData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">{currentStepData.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{currentStepData.description}</p>
            <div>{currentStepData.content}</div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="px-4 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 border border-border"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length} · {tourType === "short" ? "Quick" : "Complete"} Tour
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground font-bold transition-colors flex items-center gap-2"
          >
            {isLastStep ? "Finish Tour" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
