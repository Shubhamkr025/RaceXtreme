import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Send, X, MoreHorizontal } from 'lucide-react';
import './AIAgent.css';

const AIAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hello Elite Member. I am your RaceXtreme Concierge. How may I assist you with our hypercar collection today?', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiResponse = getAIResponse(inputValue);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: aiResponse, timestamp: new Date() }]);
            setIsTyping(false);
        }, 1500);
    };

    const getAIResponse = (text) => {
        const query = text.toLowerCase();
        if (query.includes('show') || query.includes('car')) return "Our showroom currently features the $3.3M Bugatti Chiron and the Aventador SVJ. Would you like to view them?";
        if (query.includes('mod') || query.includes('tune')) return "You can access the Modification Center from the menu to upgrade your engine, aerodynamics, or suspension.";
        if (query.includes('speed') || query.includes('fast')) return "The Bugatti Chiron Super Sport in our collection clocks in at 304 MPH. It's the pinnacle of our fleet.";
        if (query.includes('hello') || query.includes('hi')) return "Greetings! Ready to customize your next hypercar experience?";
        return "I'm looking into that for you. As an Elite member, you have access to our most exclusive performance data.";
    };

    return (
        <div className="ai-agent-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="chat-window"
                    >
                        <div className="chat-header">
                            <div className="ai-avatar">
                                <Bot size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Elite Concierge</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 'bold' }}>AI ONLINE</div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="chat-body" ref={scrollRef}>
                            {messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`message ${msg.type}`}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="message ai" style={{ display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                                    <MoreHorizontal size={18} />
                                </div>
                            )}
                        </div>

                        <div className="chat-footer">
                            <input 
                                type="text"
                                className="chat-input"
                                placeholder="Ask Elite AI..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="send-btn" onClick={handleSend}>
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                className="ai-fab"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default AIAgent;
