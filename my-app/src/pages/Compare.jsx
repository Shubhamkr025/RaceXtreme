import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { Trophy, DollarSign, Gauge, Zap, Wind, TrendingUp } from 'lucide-react';
import './Compare.css';

const Compare = () => {
    const [cars, setCars] = useState([]);
    const [carA, setCarA] = useState(null);
    const [carB, setCarB] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/cars`)
            .then(res => res.json())
            .then(data => {
                setCars(data);
                if (data.length >= 2) {
                    setCarA(data[0]);
                    setCarB(data[1]);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const stats = carA && carB ? [
        { label: 'TOP SPEED', key: 'speed', unit: 'MPH', icon: <Gauge size={14} />, valA: carA.speed, valB: carB.speed, higherBetter: true },
        { label: 'POWER', key: 'power', unit: 'HP', icon: <Zap size={14} />, valA: carA.power, valB: carB.power, higherBetter: true },
        { label: 'ACCELERATION', key: 'acceleration', unit: 's', icon: <Wind size={14} />, valA: parseFloat(carA.acceleration), valB: parseFloat(carB.acceleration), higherBetter: false },
        { label: 'PERFORMANCE', key: 'performance', unit: '%', icon: <TrendingUp size={14} />, valA: carA.performance, valB: carB.performance, higherBetter: true },
        { label: 'PRICE', key: 'price', unit: '$', icon: <DollarSign size={14} />, valA: carA.price, valB: carB.price, higherBetter: true },
    ] : [];

    const getWinner = (valA, valB, higherBetter) => {
        if (valA === valB) return 'tie';
        if (higherBetter) return valA > valB ? 'a' : 'b';
        return valA < valB ? 'a' : 'b';
    };

    const winsA = stats.filter(s => getWinner(s.valA, s.valB, s.higherBetter) === 'a').length;
    const winsB = stats.filter(s => getWinner(s.valA, s.valB, s.higherBetter) === 'b').length;

    // Radar chart data
    const radarMetrics = carA && carB ? [
        { label: 'Speed', valA: carA.speed / 350, valB: carB.speed / 350 },
        { label: 'Power', valA: carA.power / 2000, valB: carB.power / 2000 },
        { label: 'Accel', valA: 1 - (parseFloat(carA.acceleration) / 20), valB: 1 - (parseFloat(carB.acceleration) / 20) },
        { label: 'Perf', valA: carA.performance / 100, valB: carB.performance / 100 },
        { label: 'Value', valA: Math.min(1, carA.price / 4000000), valB: Math.min(1, carB.price / 4000000) },
    ] : [];

    const getRadarPoints = (values, radius = 130) => {
        const center = 160;
        const angleStep = (2 * Math.PI) / values.length;
        return values.map((v, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = v * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
    };

    const getLabelPos = (index, total, radius = 150) => {
        const center = 160;
        const angle = (2 * Math.PI / total) * index - Math.PI / 2;
        return {
            left: center + radius * Math.cos(angle),
            top: center + radius * Math.sin(angle),
        };
    };

    return (
        <div className="elite-page compare-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h1 className="text-huge">COMPARE<br /><span className="text-accent">ARENA.</span></h1>
                        <p className="text-dim">Pit two machines against each other in a stat-by-stat showdown.</p>
                    </motion.div>

                    {/* Car Selection */}
                    <div className="compare-grid">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="compare-car-card"
                        >
                            <div className="compare-car-select">
                                {cars.map(car => (
                                    <button
                                        key={`a-${car._id}`}
                                        className={`compare-car-btn ${carA?._id === car._id ? 'active' : ''}`}
                                        onClick={() => setCarA(car)}
                                    >
                                        {car.brand}
                                    </button>
                                ))}
                            </div>
                            {carA && (
                                <>
                                    <img src={carA.thumbnail} alt={carA.brand} className="compare-car-image" />
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: carA.colorCode }}>{carA.brand}</h2>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{carA.title}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <span className="stat-winner-badge" style={{ opacity: winsA > winsB ? 1 : 0.3 }}>
                                            <Trophy size={10} /> {winsA} WINS
                                        </span>
                                    </div>
                                </>
                            )}
                        </motion.div>

                        <div className="compare-vs">
                            <div className="vs-text">VS</div>
                            <div className="vs-line" />
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="compare-car-card"
                        >
                            <div className="compare-car-select">
                                {cars.map(car => (
                                    <button
                                        key={`b-${car._id}`}
                                        className={`compare-car-btn ${carB?._id === car._id ? 'active' : ''}`}
                                        onClick={() => setCarB(car)}
                                    >
                                        {car.brand}
                                    </button>
                                ))}
                            </div>
                            {carB && (
                                <>
                                    <img src={carB.thumbnail} alt={carB.brand} className="compare-car-image" />
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: carB.colorCode }}>{carB.brand}</h2>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{carB.title}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <span className="stat-winner-badge" style={{ opacity: winsB > winsA ? 1 : 0.3 }}>
                                            <Trophy size={10} /> {winsB} WINS
                                        </span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Stat Comparison Bars */}
                    {carA && carB && (
                        <div className="compare-stats-container">
                            <h3 style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: '#EFCA29', marginBottom: '2rem' }}>
                                PERFORMANCE BREAKDOWN
                            </h3>
                            {stats.map((stat, i) => {
                                const winner = getWinner(stat.valA, stat.valB, stat.higherBetter);
                                const maxVal = Math.max(stat.valA, stat.valB);
                                const pctA = maxVal > 0 ? (stat.valA / maxVal) * 100 : 0;
                                const pctB = maxVal > 0 ? (stat.valB / maxVal) * 100 : 0;

                                return (
                                    <motion.div
                                        key={stat.key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="compare-stat-row"
                                    >
                                        <div className="compare-bar-wrapper left">
                                            <motion.div
                                                className={`compare-bar ${winner === 'a' ? 'winner' : ''}`}
                                                style={{
                                                    width: `${pctA}%`,
                                                    background: winner === 'a'
                                                        ? `linear-gradient(90deg, ${carA.colorCode}33, ${carA.colorCode})`
                                                        : 'rgba(255,255,255,0.08)',
                                                    justifyContent: 'flex-end'
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pctA}%` }}
                                                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                            >
                                                <span className="compare-bar-value">
                                                    {stat.key === 'price' ? `$${stat.valA.toLocaleString()}` : `${stat.valA}${stat.unit}`}
                                                </span>
                                            </motion.div>
                                        </div>

                                        <div className="compare-stat-label">
                                            {stat.icon}
                                            <div style={{ marginTop: '0.25rem' }}>{stat.label}</div>
                                        </div>

                                        <div className="compare-bar-wrapper">
                                            <motion.div
                                                className={`compare-bar ${winner === 'b' ? 'winner' : ''}`}
                                                style={{
                                                    width: `${pctB}%`,
                                                    background: winner === 'b'
                                                        ? `linear-gradient(90deg, ${carB.colorCode}, ${carB.colorCode}33)`
                                                        : 'rgba(255,255,255,0.08)',
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pctB}%` }}
                                                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                            >
                                                <span className="compare-bar-value" style={{ right: 'auto', left: '1rem' }}>
                                                    {stat.key === 'price' ? `$${stat.valB.toLocaleString()}` : `${stat.valB}${stat.unit}`}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Radar Chart */}
                    {carA && carB && radarMetrics.length > 0 && (
                        <div className="radar-chart-container">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="radar-chart"
                            >
                                <svg width="320" height="320" viewBox="0 0 320 320">
                                    {/* Grid rings */}
                                    {[0.25, 0.5, 0.75, 1].map((r, i) => (
                                        <polygon
                                            key={i}
                                            points={getRadarPoints(radarMetrics.map(() => r))}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="1"
                                        />
                                    ))}

                                    {/* Axes */}
                                    {radarMetrics.map((_, i) => {
                                        const pos = getLabelPos(i, radarMetrics.length, 130);
                                        return (
                                            <line key={i}
                                                x1="160" y1="160"
                                                x2={pos.left} y2={pos.top}
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="1"
                                            />
                                        );
                                    })}

                                    {/* Car A polygon */}
                                    <motion.polygon
                                        points={getRadarPoints(radarMetrics.map(m => m.valA))}
                                        fill={`${carA.colorCode}15`}
                                        stroke={carA.colorCode}
                                        strokeWidth="2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    />

                                    {/* Car B polygon */}
                                    <motion.polygon
                                        points={getRadarPoints(radarMetrics.map(m => m.valB))}
                                        fill={`${carB.colorCode}15`}
                                        stroke={carB.colorCode}
                                        strokeWidth="2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                    />

                                    {/* Data points */}
                                    {radarMetrics.map((m, i) => {
                                        const posA = getLabelPos(i, radarMetrics.length, m.valA * 130);
                                        const posB = getLabelPos(i, radarMetrics.length, m.valB * 130);
                                        return (
                                            <g key={i}>
                                                <circle cx={posA.left} cy={posA.top} r="3" fill={carA.colorCode} />
                                                <circle cx={posB.left} cy={posB.top} r="3" fill={carB.colorCode} />
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Labels */}
                                {radarMetrics.map((m, i) => {
                                    const pos = getLabelPos(i, radarMetrics.length, 155);
                                    return (
                                        <div key={i} className="radar-label" style={{
                                            left: `${pos.left}px`,
                                            top: `${pos.top}px`,
                                            transform: 'translate(-50%, -50%)'
                                        }}>
                                            {m.label}
                                        </div>
                                    );
                                })}

                                {/* Legend */}
                                <div style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: 3, background: carA.colorCode }} />
                                        {carA.brand}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: 3, background: carB.colorCode }} />
                                        {carB.brand}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Price Comparison */}
                    {carA && carB && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="price-compare-card"
                            style={{ marginBottom: '3rem' }}
                        >
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#EFCA29', marginBottom: '0.5rem' }}>
                                PRICE DIFFERENCE
                            </div>
                            <div className="price-diff-amount" style={{ color: 'white' }}>
                                ${Math.abs(carA.price - carB.price).toLocaleString()}
                            </div>
                            <div className="price-diff-label">
                                {carA.price > carB.price
                                    ? `${carA.brand} costs $${(carA.price - carB.price).toLocaleString()} more`
                                    : `${carB.brand} costs $${(carB.price - carA.price).toLocaleString()} more`
                                }
                            </div>
                        </motion.div>
                    )}
                </div>
            </AnimatedPage>
        </div>
    );
};

export default Compare;
