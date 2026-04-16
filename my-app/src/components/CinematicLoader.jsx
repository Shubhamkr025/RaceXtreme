import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import './CinematicLoader.css';

const CinematicLoader = ({ onComplete }) => {
    const [systemText, setSystemText] = useState('INITIALIZING SYSTEMS...');
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const texts = [
            'INITIALIZING SYSTEMS...',
            'LOADING VEHICLE DATABASE...',
            'CALIBRATING PERFORMANCE METRICS...',
            'CONNECTING TO ELITE NETWORK...',
            'SYSTEMS ONLINE'
        ];

        let i = 0;
        const textInterval = setInterval(() => {
            i++;
            if (i < texts.length) {
                setSystemText(texts[i]);
            } else {
                clearInterval(textInterval);
            }
        }, 600);

        // Start fade out
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 3200);

        // Complete
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 4000);

        return () => {
            clearInterval(textInterval);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`cinematic-loader ${fadeOut ? 'fade-out' : ''}`}>
            {/* Background particles */}
            <div className="loader-particles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="loader-particle" />
                ))}
            </div>

            {/* Corner accents */}
            <div className="loader-corner tl" />
            <div className="loader-corner tr" />
            <div className="loader-corner bl" />
            <div className="loader-corner br" />

            {/* Tachometer */}
            <svg className="loader-tacho" viewBox="0 0 120 120">
                {/* Outer ring */}
                <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* Tick marks */}
                {[...Array(12)].map((_, i) => {
                    const angle = -120 + (i * 240 / 11);
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 60 + 42 * Math.cos(rad);
                    const y1 = 60 + 42 * Math.sin(rad);
                    const x2 = 60 + 48 * Math.cos(rad);
                    const y2 = 60 + 48 * Math.sin(rad);
                    return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={i > 8 ? '#ef4444' : 'rgba(255,255,255,0.3)'}
                            strokeWidth={i % 3 === 0 ? 2 : 1}
                        />
                    );
                })}

                {/* Needle */}
                <g className="tacho-needle">
                    <line x1="60" y1="60" x2="60" y2="18" stroke="#EFCA29" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="60" cy="60" r="4" fill="#EFCA29" />
                </g>

                {/* Center text */}
                <text x="60" y="80" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold">RPM x1000</text>
            </svg>

            {/* Logo */}
            <div className="loader-logo">
                <div className="loader-logo-icon">
                    <Zap size={28} fill="currentColor" />
                </div>
                <div className="loader-logo-text">
                    RACE<span>XTREME</span>
                </div>
            </div>

            {/* Racing stripe progress */}
            <div className="racing-stripe-container">
                <div className="racing-stripe" />
            </div>

            {/* System text */}
            <div className={`system-text ${systemText === 'SYSTEMS ONLINE' ? 'active' : ''}`}>
                {systemText}
            </div>
        </div>
    );
};

export default CinematicLoader;
