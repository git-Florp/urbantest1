import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen = ({ onComplete }: ShutdownScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  const shutdownMessages = [
    "[  OK  ] Stopping Security Cameras",
    "[  OK  ] Stopping Containment Monitor",
    "[  OK  ] Stopping Network Scanner",
    "[  OK  ] Stopping System Monitor",
    "[  OK  ] Unmounting /data/research",
    "[  OK  ] Unmounting /data/specimens",
    "[  OK  ] Unmounting /data/logs",
    "[  OK  ] Stopped Database Manager",
    "[  OK  ] Stopped Authentication Service",
    "[  OK  ] Reached target Shutdown",
    "[  OK  ] Stopping Facility Monitor",
    "[  OK  ] Powering down...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < shutdownMessages.length) {
        setMessages(prev => [...prev, shutdownMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white font-mono">
      <div className="w-full max-w-3xl px-8">
        <div className="space-y-1 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm text-red-400 animate-fade-in">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
