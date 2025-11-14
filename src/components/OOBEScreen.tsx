import { useState } from "react";
import { Settings, Globe, Clock, Monitor, Check, Shield, Info } from "lucide-react";
import { toast } from "sonner";

interface OOBEScreenProps {
  onComplete: () => void;
}

export const OOBEScreen = ({ onComplete }: OOBEScreenProps) => {
  const [step, setStep] = useState<"welcome" | "language" | "region" | "time" | "keyboard" | "display" | "network" | "sound" | "power" | "security" | "privacy" | "accessibility" | "personalization" | "survey" | "finish">("welcome");
  
  // Settings
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("North America");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");
  const [keyboardLayout, setKeyboardLayout] = useState("US - QWERTY");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [animations, setAnimations] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [powerMode, setPowerMode] = useState("balanced");
  const [screenTimeout, setScreenTimeout] = useState("15min");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  
  // Privacy settings
  const [analytics, setAnalytics] = useState(false);
  const [crashReports, setCrashReports] = useState(true);
  const [diagnostics, setDiagnostics] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  
  // Personalization
  const [accentColor, setAccentColor] = useState("cyan");
  const [wallpaper, setWallpaper] = useState("default");
  const [taskbarPosition, setTaskbarPosition] = useState("bottom");
  
  // Survey
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleNext = () => {
    if (step === "welcome") setStep("language");
    else if (step === "language") setStep("region");
    else if (step === "region") setStep("time");
    else if (step === "time") setStep("keyboard");
    else if (step === "keyboard") setStep("display");
    else if (step === "display") setStep("network");
    else if (step === "network") setStep("sound");
    else if (step === "sound") setStep("power");
    else if (step === "power") setStep("security");
    else if (step === "security") setStep("privacy");
    else if (step === "privacy") setStep("accessibility");
    else if (step === "accessibility") setStep("personalization");
    else if (step === "personalization") setStep("survey");
    else if (step === "survey") setStep("finish");
  };

  const handleComplete = () => {
    localStorage.setItem("urbanshade_oobe_complete", "true");
    localStorage.setItem("urbanshade_settings", JSON.stringify({
      language,
      region,
      timezone,
      keyboardLayout,
      theme,
      animations,
      brightness,
      wifiEnabled,
      soundEnabled,
      volume,
      powerMode,
      screenTimeout,
      twoFactorAuth,
      biometricAuth,
      analytics,
      crashReports,
      diagnostics,
      locationServices,
      highContrast,
      largeText,
      screenReader,
      accentColor,
      wallpaper,
      taskbarPosition,
      role,
      experience,
      purpose
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
              <p className="text-xl text-muted-foreground">Let's personalize your system</p>
            </div>
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-lg bg-primary hover:bg-primary/80 transition-colors text-lg font-bold"
            >
              Get Started
            </button>
          </div>
        )}

        {step === "language" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Select Language</h2>
            </div>
            
            <div className="space-y-4">
              {["English", "Spanish", "French", "German", "Japanese", "Chinese", "Russian", "Portuguese"].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    language === lang 
                      ? "bg-primary/20 border-primary" 
                      : "bg-black/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="font-bold">{lang}</div>
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
              <button onClick={() => setStep("language")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
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

        {step === "privacy" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Configure data collection preferences. All data is stored locally.
              </p>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Usage Analytics</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Track feature usage to optimize performance
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={crashReports}
                  onChange={(e) => setCrashReports(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Crash Reports</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Help diagnose system crashes
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={diagnostics}
                  onChange={(e) => setDiagnostics(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">System Diagnostics</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Collect performance metrics for troubleshooting
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={locationServices}
                  onChange={(e) => setLocationServices(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Location Services</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Allow system to access facility location data
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("security")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "accessibility" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Settings className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Accessibility</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">High Contrast Mode</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Increase contrast for better visibility
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Large Text</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Increase system font size
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={screenReader}
                  onChange={(e) => setScreenReader(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Screen Reader Support</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Enable text-to-speech for navigation
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("personalization")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "personalization" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Settings className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Personalization</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-lg font-bold mb-3 block">Accent Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {["cyan", "blue", "purple", "pink", "red", "orange", "yellow", "green"].map(color => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        accentColor === color 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-${color}-500 mx-auto`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Wallpaper</label>
                <div className="grid grid-cols-3 gap-3">
                  {["default", "geometric", "abstract", "minimal", "gradient", "dark"].map(wall => (
                    <button
                      key={wall}
                      onClick={() => setWallpaper(wall)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        wallpaper === wall 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-sm capitalize">{wall}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Taskbar Position</label>
                <div className="grid grid-cols-3 gap-3">
                  {["bottom", "top", "left"].map(pos => (
                    <button
                      key={pos}
                      onClick={() => setTaskbarPosition(pos)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        taskbarPosition === pos 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold capitalize">{pos}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("accessibility")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "survey" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Info className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Quick Survey</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-muted-foreground mb-6">
                Help us understand how you'll use UrbanShade OS (optional)
              </p>

              <div>
                <label className="text-lg font-bold mb-3 block">What's your role?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Facility Administrator", "Research Personnel", "Security Officer", "Engineer", "Medical Staff", "Just Exploring"].map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        role === r 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-sm">{r}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Experience level?</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map(exp => (
                    <button
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        experience === exp 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-center">{exp}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Primary purpose?</label>
                <div className="space-y-2">
                  {[
                    "Facility planning & design",
                    "Security & monitoring",
                    "Research & experimentation",
                    "Entertainment & exploration",
                    "Learning & education"
                  ].map(p => (
                    <button
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        purpose === p 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold">{p}</div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                All responses are optional and stored locally only
              </p>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={() => setStep("privacy")} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
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
            {["language", "region", "time", "keyboard", "display", "network", "sound", "power", "security", "privacy", "accessibility", "personalization", "survey"].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-all ${
                  ["language", "region", "time", "keyboard", "display", "network", "sound", "power", "security", "privacy", "accessibility", "personalization", "survey"].indexOf(step) >= i
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
