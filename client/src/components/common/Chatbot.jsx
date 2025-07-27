import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import apiClient from '../../api';
import { useAuth } from '../../hooks/useAuth';

const Chatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'ai', text: 'Hello! How can I help you with your inventory today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || loading) return;

        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await apiClient.post('/ai/chatbot', { message: input });
            const aiMessage = { from: 'ai', text: response.data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { from: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'Admin') {
        return null;
    }

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-50 bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                aria-label="Open Chatbot"
            >
                <Bot size={32} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-4 z-50 w-96 h-[60vh] bg-primary border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <header className="p-4 bg-secondary flex justify-between items-center border-b border-border">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-accent" />
                                <h3 className="font-bold text-text-primary">InvTrack AI Assistant</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.from === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-secondary text-text-primary rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-xs px-4 py-2 rounded-2xl bg-secondary text-text-primary rounded-bl-none flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="p-4 bg-secondary border-t border-border">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about your inventory..."
                                    className="flex-1 bg-background border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                    disabled={loading}
                                />
                                <button onClick={handleSend} disabled={loading} className="bg-accent text-white p-2 rounded-full disabled:opacity-50">
                                    <Send size={20} />
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
