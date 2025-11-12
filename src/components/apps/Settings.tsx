import { useState } from "react";
import { Settings as SettingsIcon, Monitor, Wifi, Volume2, HardDrive, Users, Clock, Shield, Palette, Accessibility, Bell, Power, Globe, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveState, loadState } from "@/lib/persistence";

export const Settings = () => {
  const [selectedCategory, setSelectedCategory] = useState("system");
  const [searchQuery, setSearchQuery] = useState("");
  
  // System settings
  const [deviceName, setDeviceName] = useState(loadState("settings_device_name", "URBANSHADE-TERMINAL"));
  const [autoUpdates, setAutoUpdates] = useState(loadState("settings_auto_updates", true));
  
  // Display settings
  const [brightness, setBrightness] = useState(loadState("settings_brightness", [80]));
  const [resolution, setResolution] = useState(loadState("settings_resolution", "1920x1080"));
  const [nightLight, setNightLight] = useState(loadState("settings_night_light", false));
  
  // Network settings
  const [wifiEnabled, setWifiEnabled] = useState(loadState("settings_wifi", true));
  const [vpnEnabled, setVpnEnabled] = useState(loadState("settings_vpn", false));
  
  // Sound settings
  const [volume, setVolume] = useState(loadState("settings_volume", [70]));
  const [muteEnabled, setMuteEnabled] = useState(loadState("settings_mute", false));
  
  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(loadState("settings_notifications", true));
  const [doNotDisturb, setDoNotDisturb] = useState(loadState("settings_dnd", false));

  const handleSave = (key: string, value: any) => {
    saveState(key, value);
  };

  const categories = [
    { id: "system", name: "System", icon: <Monitor className="w-5 h-5" /> },
    { id: "display", name: "Display", icon: <Palette className="w-5 h-5" /> },
    { id: "network", name: "Network & Internet", icon: <Wifi className="w-5 h-5" /> },
    { id: "sound", name: "Sound", icon: <Volume2 className="w-5 h-5" /> },
    { id: "storage", name: "Storage", icon: <HardDrive className="w-5 h-5" /> },
    { id: "accounts", name: "Accounts", icon: <Users className="w-5 h-5" /> },
    { id: "time", name: "Time & Language", icon: <Clock className="w-5 h-5" /> },
    { id: "privacy", name: "Privacy & Security", icon: <Shield className="w-5 h-5" /> },
    { id: "accessibility", name: "Accessibility", icon: <Accessibility className="w-5 h-5" /> },
    { id: "notifications", name: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "power", name: "Power & Battery", icon: <Power className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (selectedCategory) {
      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">System</h2>
              <p className="text-muted-foreground mb-6">Manage system settings and information</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device name:</span>
                  <Input 
                    value={deviceName} 
                    onChange={(e) => { setDeviceName(e.target.value); handleSave("settings_device_name", e.target.value); }}
                    className="w-48 h-8"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS Version:</span>
                  <span className="font-mono">Urbanshade OS v3.7.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Type:</span>
                  <span>64-bit Operating System</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processor:</span>
                  <span>Quantum Core X9 @ 4.2GHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Installed RAM:</span>
                  <span>64 GB</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Windows Update</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Automatic updates</div>
                    <div className="text-sm text-muted-foreground">Keep your system up to date</div>
                  </div>
                  <Switch checked={autoUpdates} onCheckedChange={(checked) => { setAutoUpdates(checked); handleSave("settings_auto_updates", checked); }} />
                </div>
                <Button className="w-full">Check for updates</Button>
                <div className="text-sm text-muted-foreground">
                  Last checked: Today at 3:47 PM
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Advanced system settings</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">System protection</Button>
                <Button variant="outline" className="w-full justify-start">Remote settings</Button>
                <Button variant="outline" className="w-full justify-start">Environment variables</Button>
              </div>
            </Card>
          </div>
        );

      case "display":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Display</h2>
              <p className="text-muted-foreground mb-6">Adjust screen brightness, resolution, and color</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Brightness</h3>
              <div className="space-y-4">
                <Slider 
                  value={brightness} 
                  onValueChange={(value) => { setBrightness(value); handleSave("settings_brightness", value); }}
                  max={100} 
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-right">{brightness[0]}%</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Scale and layout</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Display resolution</label>
                  <Select value={resolution} onValueChange={(value) => { setResolution(value); handleSave("settings_resolution", value); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920 x 1080 (Recommended)</SelectItem>
                      <SelectItem value="2560x1440">2560 x 1440</SelectItem>
                      <SelectItem value="3840x2160">3840 x 2160 (4K)</SelectItem>
                      <SelectItem value="1280x720">1280 x 720</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Color</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Night light</div>
                    <div className="text-sm text-muted-foreground">Reduce blue light at night</div>
                  </div>
                  <Switch checked={nightLight} onCheckedChange={(checked) => { setNightLight(checked); handleSave("settings_night_light", checked); }} />
                </div>
              </div>
            </Card>
          </div>
        );

      case "network":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Network & Internet</h2>
              <p className="text-muted-foreground mb-6">Manage Wi-Fi, VPN, and network settings</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Wi-Fi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Wi-Fi enabled</div>
                    <div className="text-sm text-muted-foreground">Connected to: URBANSHADE-SECURE</div>
                  </div>
                  <Switch checked={wifiEnabled} onCheckedChange={(checked) => { setWifiEnabled(checked); handleSave("settings_wifi", checked); }} />
                </div>
                <Button variant="outline" className="w-full">Manage known networks</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">VPN</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">VPN connection</div>
                    <div className="text-sm text-muted-foreground">Secure your connection</div>
                  </div>
                  <Switch checked={vpnEnabled} onCheckedChange={(checked) => { setVpnEnabled(checked); handleSave("settings_vpn", checked); }} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Network Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-500">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="font-mono">10.23.45.67</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal Strength:</span>
                  <span>Excellent</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "sound":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Sound</h2>
              <p className="text-muted-foreground mb-6">Manage audio devices and volume</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Volume</h3>
              <div className="space-y-4">
                <Slider 
                  value={volume} 
                  onValueChange={(value) => { setVolume(value); handleSave("settings_volume", value); }}
                  max={100} 
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-right">{volume[0]}%</div>
                <div className="flex items-center justify-between pt-2">
                  <div className="font-medium">Mute</div>
                  <Switch checked={muteEnabled} onCheckedChange={(checked) => { setMuteEnabled(checked); handleSave("settings_mute", checked); }} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Output Device</h3>
              <Select defaultValue="speakers">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speakers">Speakers (High Definition Audio)</SelectItem>
                  <SelectItem value="headphones">Headphones</SelectItem>
                  <SelectItem value="hdmi">HDMI Audio</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Input Device</h3>
              <Select defaultValue="microphone">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microphone">Microphone (Built-in)</SelectItem>
                  <SelectItem value="external">External Microphone</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>
        );

      case "storage":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Storage</h2>
              <p className="text-muted-foreground mb-6">Manage disk space and storage devices</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Local Disk (C:)</h3>
              <div className="space-y-4">
                <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "68%" }} />
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used:</span>
                    <span className="font-mono">680 GB of 1 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free:</span>
                    <span className="font-mono">320 GB</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Clean up disk</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Storage Categories</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System files:</span>
                  <span className="font-mono">45 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications:</span>
                  <span className="font-mono">320 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-mono">150 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temporary files:</span>
                  <span className="font-mono">15 GB</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-muted-foreground mb-6">Manage system and app notifications</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notifications from apps and senders</div>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={(checked) => { setNotificationsEnabled(checked); handleSave("settings_notifications", checked); }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Do not disturb</div>
                    <div className="text-sm text-muted-foreground">Hide notifications and sounds</div>
                  </div>
                  <Switch checked={doNotDisturb} onCheckedChange={(checked) => { setDoNotDisturb(checked); handleSave("settings_dnd", checked); }} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Notification sounds</Button>
                <Button variant="outline" className="w-full justify-start">Focus assist</Button>
                <Button variant="outline" className="w-full justify-start">Notification history</Button>
              </div>
            </Card>
          </div>
        );

      case "accounts":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Accounts</h2>
              <p className="text-muted-foreground mb-6">Manage user accounts and sign-in options</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Your account</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Administrator</div>
                  <div className="text-sm text-muted-foreground">Local Account</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Change account settings</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sign-in options</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Password</Button>
                <Button variant="outline" className="w-full justify-start">PIN</Button>
                <Button variant="outline" className="w-full justify-start">Biometric</Button>
              </div>
            </Card>
          </div>
        );

      case "time":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Time & Language</h2>
              <p className="text-muted-foreground mb-6">Manage date, time, and regional settings</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Date & Time</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Set time automatically</div>
                    <div className="text-sm text-muted-foreground">Sync with internet time</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current time:</span>
                    <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Language</h3>
              <Select defaultValue="en-us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-us">English (United States)</SelectItem>
                  <SelectItem value="en-gb">English (United Kingdom)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Region</h3>
              <Select defaultValue="us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Privacy & Security</h2>
              <p className="text-muted-foreground mb-6">Manage privacy settings and security features</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Security Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Firewall is on</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Virus protection is up to date</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Account protection needs attention</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Privacy Options</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">App permissions</Button>
                <Button variant="outline" className="w-full justify-start">Location</Button>
                <Button variant="outline" className="w-full justify-start">Camera</Button>
                <Button variant="outline" className="w-full justify-start">Microphone</Button>
              </div>
            </Card>
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
              <p className="text-muted-foreground mb-6">Make your device easier to use</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Vision</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Display</Button>
                <Button variant="outline" className="w-full justify-start">Text size</Button>
                <Button variant="outline" className="w-full justify-start">Magnifier</Button>
                <Button variant="outline" className="w-full justify-start">Color filters</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Hearing</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Audio</Button>
                <Button variant="outline" className="w-full justify-start">Captions</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Interaction</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Speech</Button>
                <Button variant="outline" className="w-full justify-start">Keyboard</Button>
                <Button variant="outline" className="w-full justify-start">Mouse</Button>
              </div>
            </Card>
          </div>
        );

      case "power":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Power & Battery</h2>
              <p className="text-muted-foreground mb-6">Manage power settings and battery usage</p>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Power Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power mode:</span>
                  <span>Best performance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screen timeout:</span>
                  <span>15 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sleep mode:</span>
                  <span>30 minutes</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Power Plan</h3>
              <Select defaultValue="balanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power-saver">Power saver</SelectItem>
                  <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                  <SelectItem value="high-performance">High performance</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Advanced Power Settings</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Display and sleep</Button>
                <Button variant="outline" className="w-full justify-start">Lid and power button</Button>
              </div>
            </Card>
          </div>
        );

      default:
        return <div>Select a category</div>;
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30 p-4 overflow-auto">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Find a setting" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          {categories
            .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                selectedCategory === category.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
