import { useState } from "react";
import { Settings, Globe, Clock, Monitor, Check } from "lucide-react";
import { toast } from "sonner";

interface OOBEScreenProps {
  onComplete: () => void;
}

export const OOBEScreen = ({ onComplete }: OOBEScreenProps) => {
  const [step, setStep] = useState<"welcome" | "region" | "time" | "display" | "finish">("welcome");
  const [region, setRegion] = useState("North America");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [animations, setAnimations] = useState(true);

  const handleNext = () => {
    if (step === "welcome") setStep("region");
    else if (step === "region") setStep("time");
    else if (step === "time") setStep("display");
    else if (step === "display") setStep("finish");
  };

  const handleComplete = () => {
    localStorage.setItem("urbanshade_oobe_complete", "true");
    localStorage.setItem("urbanshade_settings", JSON.stringify({
      region,
      timezone,
      theme,
      animations
    }));
    toast.success("Setup complete!");
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {step === "welcome" && (
          <div className="text-center space-y-8 animate-fade-in">
            <Settings className="w-24 h-24 mx-auto text-primary animate-pulse" />
            <div>
              <h1 className="text-5xl font-bold mb-4">Welcome to UrbanShade OS</h1>
              <p className="text-xl text-muted-foreground">Let's set up your system in just a few steps</p>
            </div>
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-lg bg-primary hover:bg-primary/80 transition-colors text-lg font-bold"
            >
              Get Started
            </button>
          </div>
        )}

        {step === "region" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Choose Your Region</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {["North America", "Europe", "Asia Pacific", "South America", "Africa", "Middle East"].map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    region === r 
                      ? "bg-primary/20 border-primary" 
                      : "bg-black/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="text-lg font-bold">{r}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Set Time Zone</h2>
            </div>
            
            <div className="space-y-4">
              {[
                "UTC-8 (PST)",
                "UTC-5 (EST)",
                "UTC+0 (GMT)",
                "UTC+1 (CET)",
                "UTC+8 (CST)",
                "UTC+9 (JST)"
              ].map(tz => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    timezone === tz 
                      ? "bg-primary/20 border-primary" 
                      : "bg-black/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="font-bold">{tz}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("region")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "display" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Monitor className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Display Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-lg font-bold mb-4 block">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === "dark" 
                        ? "bg-primary/20 border-primary" 
                        : "bg-black/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold">Dark Mode</div>
                    <div className="text-sm text-muted-foreground mt-2">Recommended for facility operations</div>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === "light" 
                        ? "bg-primary/20 border-primary" 
                        : "bg-black/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold">Light Mode</div>
                    <div className="text-sm text-muted-foreground mt-2">Better visibility in bright areas</div>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Enable Animations</div>
                  <div className="text-sm text-muted-foreground">Smooth transitions and effects</div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("time")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "finish" && (
          <div className="text-center space-y-8 animate-fade-in">
            <Check className="w-24 h-24 mx-auto text-green-500 animate-pulse" />
            <div>
              <h1 className="text-5xl font-bold mb-4">All Set!</h1>
              <p className="text-xl text-muted-foreground mb-6">Your UrbanShade OS is ready to use</p>
              <div className="glass-panel p-6 text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-bold">{region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Zone:</span>
                  <span className="font-bold">{timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-bold capitalize">{theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animations:</span>
                  <span className="font-bold">{animations ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="px-8 py-4 rounded-lg bg-primary hover:bg-primary/80 transition-colors text-lg font-bold"
            >
              Start Using UrbanShade OS
            </button>
          </div>
        )}

        {step !== "welcome" && step !== "finish" && (
          <div className="flex gap-2 justify-center mt-8">
            {["region", "time", "display"].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-all ${
                  ["region", "time", "display"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
