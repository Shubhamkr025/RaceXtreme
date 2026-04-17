import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        isCallbackRequested: false
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to send message');

            setStatus({ type: 'success', message: 'Elite Support has received your inquiry. We will contact you shortly.' });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '', isCallbackRequested: false });

        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <div className="grid-auto grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
                        
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-huge"
                            >
                                GET IN<br /><span className="text-accent">TOUCH.</span>
                            </motion.h1>
                            <p className="text-dim mb-12">Experience prioritized support for all your high-performance automotive needs.</p>

                            <div className="space-y-8">
                                <ContactInfo icon={<Mail className="text-accent" />} label="EMAIL" value="elite@racextreme.club" />
                                <ContactInfo icon={<Phone className="text-accent" />} label="PHONE" value="+1 (234) 567-890" />
                                <ContactInfo icon={<MapPin className="text-accent" />} label="HEADQUARTERS" value="Level 99, Speed Tower, Abu Dhabi" />
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="elite-card"
                            style={{ padding: '2.5rem' }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="grid-auto grid-cols-2 mb-6">
                                    <EliteField label="FULL NAME" name="name" value={formData.name} onChange={handleChange} placeholder="Elite Member" required />
                                    <EliteField label="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="member@elite.com" required />
                                </div>
                                <div className="grid-auto grid-cols-2 mb-6">
                                    <EliteField label="PHONE (OPTIONAL)" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1..." />
                                    <EliteField label="SUBJECT" name="subject" value={formData.subject} onChange={handleChange} placeholder="Service Inquiry" required />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-dim mb-2 block tracking-widest uppercase">MESSAGE</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="input-elite"
                                        rows="4"
                                        placeholder="Tell us about your requirements..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 mb-8">
                                    <input 
                                        type="checkbox" 
                                        name="isCallbackRequested"
                                        id="callback"
                                        checked={formData.isCallbackRequested}
                                        onChange={handleChange}
                                        className="accent-yellow-400 w-4 h-4"
                                    />
                                    <label htmlFor="callback" className="text-sm font-semibold cursor-pointer">Request an immediate call back</label>
                                </div>

                                <AnimatePresence>
                                    {status.type && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 44, 44, 0.1)', color: status.type === 'success' ? '#22c55e' : '#ef2c2c', border: `1px solid ${status.type === 'success' ? '#22c55e33' : '#ef2c2c33'}` }}
                                        >
                                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                            <span className="text-sm font-bold">{status.message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button 
                                    className="glass-morphism" 
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ 
                                        width: '100%', padding: '1.25rem', borderRadius: '1rem', fontWeight: 'bold', 
                                        background: '#EFCA29', color: 'black', border: 'none',
                                        fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                                    }}
                                >
                                    {isSubmitting ? 'TRANSMITTING...' : <><Send size={18}/> SEND INQUIRY</>}
                                </button>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};

const ContactInfo = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="bg-white/5 p-3 rounded-lg">{icon}</div>
        <div>
            <div className="text-[10px] font-black text-white/30 tracking-widest">{label}</div>
            <div className="font-bold">{value}</div>
        </div>
    </div>
);

const EliteField = ({ label, ...props }) => (
    <div>
        <label className="text-[10px] font-black text-dim mb-2 block tracking-widest uppercase">{label}</label>
        <input 
            {...props}
            className="input-elite"
        />
    </div>
);

export default Contact;
