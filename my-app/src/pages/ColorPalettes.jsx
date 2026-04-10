import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, Info } from 'lucide-react';

const colors = [
    { name: 'Velocity Yellow', hex: '#EFCA29', type: 'Vibrant', code: 'V-29' },
    { name: 'Carbon Black', hex: '#0a0a0b', type: 'Matte', code: 'C-01' },
    { name: 'Electric Blue', hex: '#3498DB', type: 'Metallic', code: 'E-34' },
    { name: 'Inferno Red', hex: '#E74C3C', type: 'Pearl', code: 'I-87' },
    { name: 'Hyper Green', hex: '#2ECC71', type: 'Neon', code: 'H-22' },
    { name: 'Titanium Gray', hex: '#95A5A6', type: 'Brushed', code: 'T-95' },
    { name: 'Royal Purple', hex: '#8E44AD', type: 'Gloss', code: 'R-44' },
    { name: 'Desert Gold', hex: '#F1C40F', type: 'Satin', code: 'D-11' },
    { name: 'Midnight Navy', hex: '#2C3E50', type: 'Deep', code: 'M-21' },
    { name: 'Arctic White', hex: '#ECF0F1', type: 'Frozen', code: 'A-00' },
    { name: 'Nardo Shadow', hex: '#BDC3C7', type: 'Flat', code: 'N-45' },
    { name: 'Copper Rush', hex: '#D35400', type: 'Reflective', code: 'CR-00' },
];

const ColorPalettes = () => {
    const [copied, setCopied] = useState(null);
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopied(hex);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <div className="grid-auto grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
                        
                        <div>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ 
                                    background: `linear-gradient(135deg, ${selectedColor.hex}, #111)`,
                                    height: '350px',
                                    borderRadius: '2.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    boxShadow: `0 30px 60px -12px ${selectedColor.hex}33`,
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Palette size={80} style={{ color: 'white', marginBottom: '1.5rem', opacity: 0.8 }} />
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>{selectedColor.name}</h2>
                                    <p style={{ color: 'white', opacity: 0.6, letterSpacing: '0.2em', fontWeight: 'bold' }}>{selectedColor.code}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '2rem', right: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1.5rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>{selectedColor.hex}</span>
                                    <button 
                                        onClick={() => copyToClipboard(selectedColor.hex)}
                                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                                    >
                                        {copied === selectedColor.hex ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </motion.div>
                            
                            <div className="elite-card" style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Info size={20} className="text-accent" />
                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>This premium pigment is curated for hypercar finishes. Features high-reflectivity and UV resistance.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-huge" style={{ marginBottom: '1rem' }}>ELITE<br />PALETTES.</h1>
                            <p className="text-dim" style={{ marginBottom: '2.5rem' }}>Select a signature finish for your custom build.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                {colors.map((color) => (
                                    <motion.button
                                        key={color.hex}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ 
                                            padding: '1.5rem',
                                            borderRadius: '1.25rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: `2px solid ${selectedColor.hex === color.hex ? color.hex : 'transparent'}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            transition: 'border-color 0.3s'
                                        }}
                                    >
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: color.hex, boxShadow: `0 10px 20px -5px ${color.hex}` }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{color.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};

export default ColorPalettes;
