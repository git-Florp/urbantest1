import { useEffect, useState } from "react";

interface RebootScreenProps {
  onComplete: () => void;
}

export const RebootScreen = ({ onComplete }: RebootScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  const rebootMessages = [
    "[  OK  ] Stopping all processes",
    "[  OK  ] Unmounting file systems",
    "[  OK  ] Stopping containment systems",
    "[  OK  ] Stopping security services",
    "[  OK  ] Stopping network services",
    "[  OK  ] Flushing system cache",
    "[  OK  ] Reached target Reboot",
    "",
    "[ INFO ] System restart initiated",
    "[ INFO ] Preparing for reboot...",
    "",
    "Reboot in progress...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < rebootMessages.length) {
        setMessages(prev => [...prev, rebootMessages[index]]);
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
            <div key={i} className="text-sm text-yellow-400 animate-fade-in">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
