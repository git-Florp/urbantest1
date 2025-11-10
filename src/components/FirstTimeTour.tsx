import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface FirstTimeTourProps {
  onComplete: () => void;
}

export const FirstTimeTour = ({ onComplete }: FirstTimeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Urbanshade OS",
      description: "This is your facility management operating system. Let's take a quick tour of the key features.",
      highlight: "center",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-lg">You're now running the most advanced deep-sea facility management system.</p>
          <p className="text-sm text-muted-foreground">This tour will help you understand the basics in just a few steps.</p>
        </div>
      )
    },
    {
      title: "Desktop & Applications",
      description: "Your desktop shows all available applications. Click any icon to open an app.",
      highlight: "desktop",
      content: (
        <div className="space-y-3">
          <p><strong>Key Apps:</strong></p>
          <ul className="space-y-2 text-sm">
            <li>📁 <strong>File Explorer</strong> - Browse facility files and documents</li>
            <li>📊 <strong>System Monitor</strong> - Check facility health and status</li>
            <li>👥 <strong>Personnel</strong> - View staff directory and clearances</li>
            <li>📝 <strong>Action Logger</strong> - Track all system activities</li>
            <li>💬 <strong>Messages</strong> - Communicate with facility staff</li>
          </ul>
        </div>
      )
    },
    {
      title: "Start Menu",
      description: "Click the Urbanshade button in the bottom-left to access the Start Menu.",
      highlight: "start",
      content: (
        <div className="space-y-3">
          <p className="text-sm">The Start Menu provides:</p>
          <ul className="space-y-2 text-sm">
            <li>🔍 Quick app search</li>
            <li>📱 All installed applications</li>
            <li>⚙️ System options (Reboot, Logout)</li>
            <li>🔧 Task Manager access</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">You can also press <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> to trigger a reboot into recovery mode.</p>
        </div>
      )
    },
    {
      title: "Terminal & Commands",
      description: "The Terminal app lets you run system commands for advanced operations.",
      highlight: "terminal",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Try these commands:</p>
          <div className="glass-panel p-3 font-mono text-xs space-y-1">
            <div><span className="text-primary">help</span> - Show available commands</div>
            <div><span className="text-primary">status</span> - System status</div>
            <div><span className="text-primary">scan</span> - Run diagnostics</div>
            <div><span className="text-primary">list</span> - List files</div>
          </div>
          <p className="text-xs text-yellow-500 mt-3">⚠ Some commands require Level 4+ clearance</p>
        </div>
      )
    },
    {
      title: "Emergency Protocols",
      description: "Access emergency procedures through the Emergency Protocols app.",
      highlight: "emergency",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Critical protocols include:</p>
          <ul className="space-y-2 text-sm">
            <li>🔴 <strong>CODE-BLACK</strong> - Total facility lockdown</li>
            <li>🟠 <strong>CODE-RED</strong> - Containment breach protocol</li>
          </ul>
          <p className="text-xs text-destructive mt-4">⚠ Only activate in genuine emergencies. Requires Level 4+ clearance.</p>
        </div>
      )
    },
    {
      title: "Facility Map",
      description: "Monitor all facility zones and their status in real-time.",
      highlight: "map",
      content: (
        <div className="space-y-3">
          <p className="text-sm">The Facility Map shows:</p>
          <ul className="space-y-2 text-sm">
            <li>🟢 <span className="text-primary">Green</span> - Operational</li>
            <li>🟡 <span className="text-yellow-500">Yellow</span> - Warning</li>
            <li>🔴 <span className="text-destructive">Red</span> - Critical</li>
            <li>⚫ <span className="text-muted-foreground">Gray</span> - Offline</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">Click any room to view details and connected areas.</p>
        </div>
      )
    },
    {
      title: "Admin Panel (Secret)",
      description: "Advanced users can access the hidden admin panel.",
      highlight: "secret",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Open your browser console and type:</p>
          <div className="glass-panel p-3 font-mono text-xs">
            <span className="text-primary">adminPanel()</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This unlocks visual effects, crash testing, and other advanced features. Check the HTML source for the password hint.
          </p>
          <p className="text-xs text-yellow-500 mt-2">⚠ Use responsibly - some features may destabilize the system</p>
        </div>
      )
    },
    {
      title: "You're Ready!",
      description: "You now know the basics of Urbanshade OS. Stay safe down there.",
      highlight: "complete",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg">Tour Complete!</p>
          <p className="text-sm text-muted-foreground">
            Remember: Monitor your systems, check messages regularly, and always follow safety protocols.
          </p>
          <div className="glass-panel p-4 mt-6 text-left">
            <p className="text-xs font-bold text-primary mb-2">Quick Tips:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Messages appear randomly - check often</li>
              <li>• Hold Space for recovery mode</li>
              <li>• Use Facility Planner to design layouts</li>
              <li>• Monitor containment zones carefully</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">{currentStepData.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{currentStepData.description}</p>
          <div>{currentStepData.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-colors flex items-center gap-2"
          >
            {isLastStep ? "Finish Tour" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
