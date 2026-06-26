import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([
    { text: "Hi there! 👋 How can we help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Thanks for reaching out! A member of our team will get back to you shortly.", sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '400px' }}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-xs opacity-90">We typically reply in a few minutes.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background border border-border text-foreground rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-primary text-primary-foreground p-2 rounded-full disabled:opacity-50 transition-opacity"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
