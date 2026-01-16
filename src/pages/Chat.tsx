// FRONTEND FROZEN — BACKEND IS SOURCE OF TRUTH
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Sparkles } from 'lucide-react';
import AIAvatar from '@/components/AIAvatar';
import ChatMessage from '@/components/ChatMessage';
import LoadingDots from '@/components/LoadingDots';
import sampleMessagesData from '@/data/sampleMessages.json';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sampleResponses] = useState<any[]>(sampleMessagesData);
  const [auraState, setAuraState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting from Aura
    setTimeout(() => {
      setAuraState('speaking');
      setMessages([{
        id: 1,
        content: sampleResponses[0]?.text || "Hello! I'm Aura, your AI matching assistant. How can I help you today?",
        isUser: false,
      }]);
      setTimeout(() => setAuraState('idle'), 3000);
    }, 500);
  }, [sampleResponses]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setAuraState('thinking');

    setTimeout(() => {
      setAuraState('speaking');
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];

      const auraMessage: Message = {
        id: Date.now() + 1,
        content: randomResponse?.text || "I'm here to help you find the perfect match!",
        isUser: false,
      };

      setMessages((prev) => [...prev, auraMessage]);
      setIsTyping(false);
      setTimeout(() => setAuraState('idle'), 3000);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionChips = ['Find me internships', 'What skills are in demand?', 'Show my match score', 'Interview tips'];

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header className="glass-strong border-b border-border sticky top-0 z-40" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-3 flex-1">
            <AIAvatar state={auraState} size="sm" />
            <div>
              <h1 className="font-semibold">Chat with Aura</h1>
              <p className="text-sm text-muted-foreground">{isTyping ? 'Typing...' : 'Online'}</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary-foreground" /></div>
          </Link>
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          <AnimatePresence>
            {messages.map((message) => (<ChatMessage key={message.id} content={message.content} isUser={message.isUser} />))}
          </AnimatePresence>
          <AnimatePresence>
            {isTyping && (
              <motion.div className="flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AIAvatar state="thinking" size="sm" />
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3"><LoadingDots /></div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {messages.length <= 1 && (
        <motion.div className="px-4 pb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <div className="container mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestionChips.map((chip) => (
                <motion.button key={chip} className="px-4 py-2 rounded-full glass text-sm hover:bg-primary/10 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setInputValue(chip)}>{chip}</motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <motion.footer className="glass-strong border-t border-border p-4" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <input type="text" placeholder="Ask Aura anything..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
            <motion.button className="w-12 h-12 rounded-xl gradient-bg text-primary-foreground flex items-center justify-center disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}><Send className="w-5 h-5" /></motion.button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Chat;
