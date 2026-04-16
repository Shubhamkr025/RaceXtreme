import React from 'react';
import { motion } from 'framer-motion';

const Speedometer = ({ value = 0, max = 300, label = 'MPH', size = 180, color = '#EFCA29' }) => {
    const radius = size / 2;
    const center = radius;
    const arcStart = -210;
    const arcEnd = 30;
    const totalArc = arcEnd - arcStart; // 240 degrees
    const needleAngle = arcStart + (value / max) * totalArc;

    // Generate tick marks
    const ticks = [];
    const numTicks = 12;
    for (let i = 0; i <= numTicks; i++) {
        const angle = arcStart + (i / numTicks) * totalArc;
        const rad = (angle * Math.PI) / 180;
        const innerR = radius * 0.72;
        const outerR = radius * 0.82;
        const textR = radius * 0.62;
        const isMajor = i % 3 === 0;

        ticks.push({
            x1: center + innerR * Math.cos(rad),
            y1: center + innerR * Math.sin(rad),
            x2: center + outerR * Math.cos(rad),
            y2: center + outerR * Math.sin(rad),
            tx: center + textR * Math.cos(rad),
            ty: center + textR * Math.sin(rad),
            value: Math.round((i / numTicks) * max),
            isMajor,
            isRed: i >= 10
        });
    }

    // Arc path
    const arcRadius = radius * 0.85;
    const createArc = (startAngle, endAngle) => {
        const start = ((startAngle) * Math.PI) / 180;
        const end = ((endAngle) * Math.PI) / 180;
        const x1 = center + arcRadius * Math.cos(start);
        const y1 = center + arcRadius * Math.sin(start);
        const x2 = center + arcRadius * Math.cos(end);
        const y2 = center + arcRadius * Math.sin(end);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    const needleLength = radius * 0.65;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
            {/* Background */}
            <circle cx={center} cy={center} r={radius - 2} fill="rgba(10,10,11,0.9)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Track arc background */}
            <path d={createArc(arcStart, arcEnd)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />

            {/* Active arc */}
            <motion.path
                d={createArc(arcStart, needleAngle)}
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
            />

            {/* Red zone */}
            <path d={createArc(arcStart + totalArc * 0.83, arcEnd)} fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="6" strokeLinecap="round" />

            {/* Ticks */}
            {ticks.map((tick, i) => (
                <g key={i}>
                    <line
                        x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
                        stroke={tick.isRed ? '#ef4444' : 'rgba(255,255,255,0.25)'}
                        strokeWidth={tick.isMajor ? 2 : 1}
                    />
                    {tick.isMajor && (
                        <text x={tick.tx} y={tick.ty} textAnchor="middle" dominantBaseline="middle"
                            fill="rgba(255,255,255,0.4)" fontSize={size * 0.055} fontWeight="600">
                            {tick.value}
                        </text>
                    )}
                </g>
            ))}

            {/* Needle */}
            <motion.g
                animate={{ rotate: needleAngle + 90 }}
                transition={{ type: 'spring', damping: 15, stiffness: 60 }}
                style={{ transformOrigin: `${center}px ${center}px` }}
            >
                <line x1={center} y1={center} x2={center} y2={center - needleLength}
                    stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                <line x1={center} y1={center} x2={center} y2={center + needleLength * 0.15}
                    stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
            </motion.g>

            {/* Center hub */}
            <circle cx={center} cy={center} r={size * 0.06} fill="#1a1a1a" stroke={color} strokeWidth="2" />
            <circle cx={center} cy={center} r={size * 0.025} fill={color} />

            {/* Digital readout */}
            <text x={center} y={center + radius * 0.32} textAnchor="middle" fill="white" fontSize={size * 0.15} fontWeight="900" fontStyle="italic">
                {Math.round(value)}
            </text>
            <text x={center} y={center + radius * 0.48} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size * 0.065} fontWeight="700" letterSpacing="0.1em">
                {label}
            </text>
        </svg>
    );
};

export default Speedometer;
