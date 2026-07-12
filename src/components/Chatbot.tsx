import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([
    { sender: "bot", text: "Namaste! 🧁 I am your Mithaas sweets assistant. Tell me about your occasion (birthday, wedding, festival) and I will suggest the perfect traditional treat!" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatLog, isOpen]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: queryText };
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText })
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      const botReply = data.reply;
      const botMessage: Message = { sender: "bot", text: botReply || "Something went wrong. I suggest Kaju Katli!" };
      setChatLog(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      toast.error("Sweet AI connection issues. Falling back offline.");
      
      // Standalone simple rule fallback
      const lower = queryText.toLowerCase();
      let reply = "I love celebrations! 🍬 For birthdays, Kaju Katli and Premium Hampers are perfect. For festivals, classic Ladoos, Pedas, or Rasgullas work wonders!";
      if (lower.includes("birthday")) {
        reply = "Happy birthday! 🧁 I highly suggest our Premium Assorted Platters or Kaju Katli to make your special day memorable.";
      } else if (lower.includes("festival") || lower.includes("party")) {
        reply = "Let the festivities begin! 🪔 I suggest our Motichoor Laddus or Kesar Pedas for sharing the joy.";
      }
      
      setChatLog(prev => [...prev, { sender: "bot", text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentMsg = message;
    setMessage("");
    sendQuery(currentMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-2xl hover:bg-[color:var(--maroon-hover)] hover:scale-105 active:scale-95 transition-all duration-300 border border-primary/20"
        >
          <Sparkles size={16} className="animate-pulse" />
          <span>Ask Sweet AI</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="flex h-[460px] w-[340px] flex-col rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-2xl overflow-hidden transition-all duration-300 md:w-[380px]">
          {/* Header */}
          <header className="flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧁</span>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide">Mithaas Sweet AI</h3>
                <p className="text-[10px] text-primary-foreground/75 uppercase tracking-wider">Confectionery Expert</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/10 text-primary-foreground transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[color:var(--cream)]/30">
            {chatLog.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white border border-border text-foreground rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-white border border-border text-muted-foreground rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm">
                  <Loader2 size={12} className="animate-spin text-primary" />
                  <span>Sweets Connoisseur is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="px-4 py-2 border-t border-border bg-white/50">
            <button
              type="button"
              onClick={() => sendQuery("It's my birthday, what sweet is good?")}
              className="rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition px-3 py-1.5 text-[11px] font-semibold text-primary text-left"
            >
              🎁 It's my birthday, what sweet is good?
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="flex border-t border-border p-2 bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about a birthday, festival, party..."
              className="flex-1 bg-transparent px-3 text-xs outline-none focus:ring-0 placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="rounded-xl bg-primary p-2 text-primary-foreground hover:bg-[color:var(--maroon-hover)] disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
