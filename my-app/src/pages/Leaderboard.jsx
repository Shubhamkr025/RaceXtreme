import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { Crown, Gauge, Zap, Wind, DollarSign, TrendingUp, Medal } from 'lucide-react';
import './Leaderboard.css';

const metrics = [
    { key: 'speed', label: 'Top Speed', unit: 'MPH', icon: <Gauge size={14} />, higherBetter: true },
    { key: 'power', label: 'Power', unit: 'HP', icon: <Zap size={14} />, higherBetter: true },
    { key: 'acceleration', label: 'Acceleration', unit: 's', icon: <Wind size={14} />, higherBetter: false },
    { key: 'price', label: 'Price', unit: '$', icon: <DollarSign size={14} />, higherBetter: true },
    { key: 'performance', label: 'Performance', unit: '%', icon: <TrendingUp size={14} />, higherBetter: true },
];

const Leaderboard = () => {
    const [cars, setCars] = useState([]);
    const [activeMetric, setActiveMetric] = useState('speed');

    useEffect(() => {
        fetch('http://localhost:5000/api/cars')
            .then(res => res.json())
            .then(data => setCars(data))
            .catch(err => console.error(err));
    }, []);

    const metric = metrics.find(m => m.key === activeMetric);

    const sorted = [...cars].sort((a, b) => {
        const valA = activeMetric === 'acceleration' ? parseFloat(a[activeMetric]) : a[activeMetric];
        const valB = activeMetric === 'acceleration' ? parseFloat(b[activeMetric]) : b[activeMetric];
        return metric.higherBetter ? valB - valA : valA - valB;
    });

    const getMaxVal = () => {
        if (sorted.length === 0) return 1;
        const val = activeMetric === 'acceleration' ? parseFloat(sorted[0][activeMetric]) : sorted[0][activeMetric];
        return val || 1;
    };

    const getRankClass = (index) => {
        if (index === 0) return 'gold';
        if (index === 1) return 'silver';
        if (index === 2) return 'bronze';
        return 'normal';
    };

    const formatValue = (car) => {
        const val = activeMetric === 'acceleration' ? parseFloat(car[activeMetric]) : car[activeMetric];
        if (activeMetric === 'price') return `$${val.toLocaleString()}`;
        return `${val}${metric.unit}`;
    };

    const getBarPct = (car) => {
        const val = activeMetric === 'acceleration' ? parseFloat(car[activeMetric]) : car[activeMetric];
        const maxVal = getMaxVal();
        if (metric.higherBetter) {
            return (val / maxVal) * 100;
        }
        // For acceleration (lower is better), invert
        return (maxVal / val) * 100;
    };

    // Summary stats
    const fastest = cars.length > 0 ? [...cars].sort((a, b) => b.speed - a.speed)[0] : null;
    const powerful = cars.length > 0 ? [...cars].sort((a, b) => b.power - a.power)[0] : null;
    const quickest = cars.length > 0 ? [...cars].sort((a, b) => parseFloat(a.acceleration) - parseFloat(b.acceleration))[0] : null;

    return (
        <div className="elite-page leaderboard-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h1 className="text-huge">LEADER<br /><span className="text-accent">BOARD.</span></h1>
                        <p className="text-dim">The definitive ranking of every machine in the RaceXtreme fleet.</p>
                    </motion.div>

                    {/* Summary Cards */}
                    <div className="leaderboard-summary">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="summary-card">
                            <div className="summary-card-value" style={{ color: '#EFCA29' }}>{fastest?.speed || 0}<span style={{ fontSize: '1rem' }}> MPH</span></div>
                            <div className="summary-card-label">FASTEST — {fastest?.brand}</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="summary-card">
                            <div className="summary-card-value" style={{ color: '#3b82f6' }}>{powerful?.power || 0}<span style={{ fontSize: '1rem' }}> HP</span></div>
                            <div className="summary-card-label">MOST POWERFUL — {powerful?.brand}</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="summary-card">
                            <div className="summary-card-value" style={{ color: '#22c55e' }}>{quickest?.acceleration || 0}<span style={{ fontSize: '1rem' }}>s</span></div>
                            <div className="summary-card-label">QUICKEST 0-100 — {quickest?.brand}</div>
                        </motion.div>
                    </div>

                    {/* Metric Toggle */}
                    <div className="metric-toggle">
                        {metrics.map(m => (
                            <button
                                key={m.key}
                                className={`metric-toggle-btn ${activeMetric === m.key ? 'active' : ''}`}
                                onClick={() => setActiveMetric(m.key)}
                            >
                                {m.icon} {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Rank Cards */}
                    <div className="rank-cards" style={{ marginBottom: '3rem' }}>
                        {sorted.map((car, i) => {
                            const rankClass = getRankClass(i);
                            const barPct = getBarPct(car);
                            const barColor = i === 0 ? '#EFCA29' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : car.colorCode;

                            return (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={`rank-card ${rankClass}`}
                                    layout
                                >
                                    {/* Position */}
                                    <div className={`rank-position ${rankClass}`}>
                                        {i === 0 ? (
                                            <div className="crown-icon">
                                                <div className="crown-glow" />
                                                <Crown size={20} />
                                            </div>
                                        ) : (
                                            i === 1 || i === 2 ? <Medal size={18} /> : `#${i + 1}`
                                        )}
                                    </div>

                                    {/* Thumbnail */}
                                    <img src={car.thumbnail} alt={car.brand} className="rank-car-thumb" />

                                    {/* Info */}
                                    <div className="rank-car-info">
                                        <h3 style={{ color: car.colorCode }}>{car.brand}</h3>
                                        <p>{car.title}</p>
                                    </div>

                                    {/* Value + Bar */}
                                    <div className="rank-value-section">
                                        <div className="rank-value" style={{ color: barColor }}>
                                            {formatValue(car)}
                                        </div>
                                        <div className="rank-bar-bg">
                                            <motion.div
                                                className="rank-bar-fill"
                                                style={{ background: `linear-gradient(90deg, ${barColor}33, ${barColor})` }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${barPct}%` }}
                                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};

export default Leaderboard;
