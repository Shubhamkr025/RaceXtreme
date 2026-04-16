import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { Zap, Gauge, Wind, Save, Share2, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ToastSystem';

const Modification = () => {
    const { addToast } = useToast();
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saved, setSaved] = useState(false);
    const [modLevels, setModLevels] = useState({
        engine: 0,
        aero: 0,
        suspension: 0,
        nitro: 0,
        weight: 0,
        grip: 0
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/cars')
            .then(res => {
                if (!res.ok) throw new Error('Database connection failed');
                return res.json();
            })
            .then(data => {
                setCars(data);
                if (data.length > 0) {
                    setSelectedCar(data[0]);
                    // Load saved build
                    loadBuild(data[0]._id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching cars:", err);
                setLoading(false);
            });
    }, []);

    const loadBuild = (carId) => {
        try {
            const builds = JSON.parse(localStorage.getItem('racextreme_builds') || '{}');
            if (builds[carId]) {
                setModLevels(builds[carId]);
                setSaved(true);
            } else {
                setModLevels({ engine: 0, aero: 0, suspension: 0, nitro: 0, weight: 0, grip: 0 });
                setSaved(false);
            }
        } catch {
            setModLevels({ engine: 0, aero: 0, suspension: 0, nitro: 0, weight: 0, grip: 0 });
            setSaved(false);
        }
    };

    const calculateNewStat = (base, level, multiplier) => {
        return Math.floor(base * (1 + (level * multiplier)));
    };

    const getBuildCost = () => {
        const totalStages = Object.values(modLevels).reduce((a, b) => a + b, 0);
        return totalStages * 15000;
    };

    const getTotalUpgradeLevel = () => {
        const total = Object.values(modLevels).reduce((a, b) => a + b, 0);
        const max = Object.keys(modLevels).length * 3; // 6 mods * 3 max
        return Math.round((total / max) * 100);
    };

    const saveBuild = () => {
        if (!selectedCar) return;
        try {
            const builds = JSON.parse(localStorage.getItem('racextreme_builds') || '{}');
            builds[selectedCar._id] = modLevels;
            localStorage.setItem('racextreme_builds', JSON.stringify(builds));
            setSaved(true);
            addToast('Build Saved! 🔧', `${selectedCar.brand} modifications have been saved.`, 'success');
        } catch (err) {
            addToast('Save Failed', 'Could not save build data.', 'error');
        }
    };

    const shareBuild = () => {
        if (!selectedCar) return;
        const shareText = `🔧 RaceXtreme Build — ${selectedCar.brand} ${selectedCar.title}\n\n` +
            Object.entries(modLevels).map(([k, v]) => `• ${k.charAt(0).toUpperCase() + k.slice(1)}: Stage ${v}`).join('\n') +
            `\n\n💰 Build Cost: $${getBuildCost().toLocaleString()}` +
            `\n⚡ Upgrade Level: ${getTotalUpgradeLevel()}%`;
        navigator.clipboard.writeText(shareText);
        addToast('Build Copied! 📋', 'Modification build config copied to clipboard.', 'success');
    };

    // Dyno chart: generate power curve points
    const getDynoCurve = () => {
        if (!selectedCar) return [];
        const basePower = selectedCar.power;
        const modBoost = (modLevels.engine * 0.08) + (modLevels.nitro * 0.05) + (modLevels.aero * 0.03);
        const points = [];
        for (let rpm = 0; rpm <= 100; rpm += 5) {
            // Simulated power curve: rises, peaks near 75-85%, then trails off
            const rpmFraction = rpm / 100;
            const baseCurve = Math.sin(rpmFraction * Math.PI * 0.85) * basePower;
            const modCurve = baseCurve * (1 + modBoost);
            points.push({ rpm, power: Math.max(0, baseCurve), modPower: Math.max(0, modCurve) });
        }
        return points;
    };

    const dynoPoints = getDynoCurve();
    const maxDynoPower = Math.max(...dynoPoints.map(p => p.modPower), 1);

    if (loading) return <div className="elite-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <div className="grid-auto grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
                        
                        {/* Car Selector Column */}
                        <div className="elite-card">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>SELECT VEHICLE</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cars.map((car) => (
                                    <button 
                                        key={car._id}
                                        onClick={() => {
                                            setSelectedCar(car);
                                            loadBuild(car._id);
                                        }}
                                        style={{ 
                                            display: 'flex', 
                                            padding: '1rem', 
                                            borderRadius: '1rem', 
                                            background: selectedCar?._id === car._id ? 'rgba(239, 202, 41, 0.1)' : 'rgba(255,255,255,0.02)',
                                            border: `1px solid ${selectedCar?._id === car._id ? '#EFCA29' : 'rgba(255,255,255,0.05)'}`,
                                            textAlign: 'left',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <img src={car.thumbnail} alt="" style={{ width: '50px', height: '30px', objectFit: 'contain', marginRight: '1rem' }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{car.brand}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{car.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mod Controls Column */}
                        <div className="elite-card" style={{ gridColumn: 'span 2' }}>
                            {selectedCar && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: selectedCar.colorCode }}>{selectedCar.brand.toUpperCase()} TUNING</h1>
                                            <p className="text-dim">Professional-grade performance laboratory for the {selectedCar.title}.</p>
                                        </div>
                                        {/* Upgrade Level Ring */}
                                        <div style={{ position: 'relative', width: 80, height: 80 }}>
                                            <svg viewBox="0 0 80 80" width="80" height="80">
                                                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                                <motion.circle
                                                    cx="40" cy="40" r="34"
                                                    fill="none"
                                                    stroke={selectedCar.colorCode}
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 34}`}
                                                    strokeDashoffset={2 * Math.PI * 34 * (1 - getTotalUpgradeLevel() / 100)}
                                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', filter: `drop-shadow(0 0 6px ${selectedCar.colorCode}44)` }}
                                                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                                    animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - getTotalUpgradeLevel() / 100) }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <text x="40" y="38" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">{getTotalUpgradeLevel()}</text>
                                                <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="700">%LVL</text>
                                            </svg>
                                        </div>
                                        <img src={selectedCar.thumbnail} alt="" style={{ width: '250px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
                                    </div>

                                    <div className="grid-auto grid-cols-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                                        <div className="space-y-6">
                                            <ModSlider icon={<Zap size={20}/>} label="Engine Mapping" level={modLevels.engine} setLevel={(l) => { setModLevels({...modLevels, engine: l}); setSaved(false); }} color={selectedCar.colorCode} />
                                            <ModSlider icon={<Wind size={20}/>} label="Aero Package" level={modLevels.aero} setLevel={(l) => { setModLevels({...modLevels, aero: l}); setSaved(false); }} color={selectedCar.colorCode} />
                                            <ModSlider icon={<Gauge size={20}/>} label="Suspension Geometry" level={modLevels.suspension} setLevel={(l) => { setModLevels({...modLevels, suspension: l}); setSaved(false); }} color={selectedCar.colorCode} />
                                        </div>
                                        <div className="space-y-6">
                                            <ModSlider icon={<Zap size={20} className="text-blue-400" />} label="Nitro Mapping" level={modLevels.nitro} setLevel={(l) => { setModLevels({...modLevels, nitro: l}); setSaved(false); }} color="#60a5fa" />
                                            <ModSlider icon={<Wind size={20} className="text-gray-400" />} label="Carbon Bodywork" level={modLevels.weight} setLevel={(l) => { setModLevels({...modLevels, weight: l}); setSaved(false); }} color="#94a3b8" />
                                            <ModSlider icon={<Gauge size={20} className="text-green-400" />} label="Racing Slicks" level={modLevels.grip} setLevel={(l) => { setModLevels({...modLevels, grip: l}); setSaved(false); }} color="#4ade80" />
                                        </div>
                                    </div>

                                    {/* Performance Stats */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#EFCA29', letterSpacing: '0.1em' }}>ESTIMATED PERFORMANCE</h3>
                                            <div className="text-right">
                                                <div className="text-[10px] text-dim font-bold">TOTAL BUILD COST</div>
                                                <div className="text-xl font-black text-white">${getBuildCost().toLocaleString()}</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '3rem' }}>
                                            <StatDisplay label="TOP SPEED" oldValue={selectedCar.speed} newValue={calculateNewStat(selectedCar.speed, modLevels.engine + (modLevels.nitro * 0.5), 0.05)} unit="MPH" />
                                            <StatDisplay label="ACCEL" oldValue={selectedCar.acceleration} newValue={(selectedCar.acceleration * (1 - (modLevels.engine * 0.08) - (modLevels.weight * 0.04))).toFixed(2)} unit="s" inverse />
                                            <StatDisplay label="PERFORMANCE" oldValue={selectedCar.performance} newValue={Math.min(100, calculateNewStat(selectedCar.performance, modLevels.engine + modLevels.aero + modLevels.suspension + modLevels.nitro + modLevels.grip, 0.02))} unit="%" />
                                        </div>
                                    </div>

                                    {/* Dyno Chart */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#EFCA29', letterSpacing: '0.1em' }}>DYNO POWER CURVE</h3>
                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.65rem', fontWeight: 600 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <div style={{ width: 10, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} /> Stock
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <div style={{ width: 10, height: 3, borderRadius: 2, background: selectedCar.colorCode }} /> Modified
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ position: 'relative', height: '160px' }}>
                                            <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
                                                {/* Grid lines */}
                                                {[0, 40, 80, 120, 160].map((y, i) => (
                                                    <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                                ))}
                                                
                                                {/* Stock power curve */}
                                                <motion.polyline
                                                    points={dynoPoints.map((p, i) => `${(i / (dynoPoints.length - 1)) * 500},${160 - (p.power / maxDynoPower) * 150}`).join(' ')}
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.15)"
                                                    strokeWidth="2"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.8 }}
                                                />

                                                {/* Modified power curve */}
                                                <motion.polyline
                                                    points={dynoPoints.map((p, i) => `${(i / (dynoPoints.length - 1)) * 500},${160 - (p.modPower / maxDynoPower) * 150}`).join(' ')}
                                                    fill="none"
                                                    stroke={selectedCar.colorCode}
                                                    strokeWidth="2.5"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 1 }}
                                                    style={{ filter: `drop-shadow(0 0 6px ${selectedCar.colorCode}44)` }}
                                                />

                                                {/* Area fill under modified curve */}
                                                <motion.polygon
                                                    points={
                                                        `0,160 ` +
                                                        dynoPoints.map((p, i) => `${(i / (dynoPoints.length - 1)) * 500},${160 - (p.modPower / maxDynoPower) * 150}`).join(' ') +
                                                        ` 500,160`
                                                    }
                                                    fill={`${selectedCar.colorCode}08`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                />
                                            </svg>
                                            {/* Y-axis labels */}
                                            <div style={{ position: 'absolute', top: 0, left: -5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                                                <span>{Math.round(maxDynoPower)}</span>
                                                <span>{Math.round(maxDynoPower / 2)}</span>
                                                <span>0 HP</span>
                                            </div>
                                            {/* X-axis label */}
                                            <div style={{ textAlign: 'center', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600, marginTop: '0.25rem' }}>
                                                RPM →
                                            </div>
                                        </div>
                                    </div>

                                    {/* Build Sheet Summary */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>BUILD SHEET</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                            {Object.entries(modLevels).map(([key, value]) => (
                                                <div key={key} style={{
                                                    padding: '0.75rem', borderRadius: '0.75rem',
                                                    background: value > 0 ? 'rgba(239, 202, 41, 0.05)' : 'rgba(255,255,255,0.02)',
                                                    border: `1px solid ${value > 0 ? 'rgba(239, 202, 41, 0.15)' : 'rgba(255,255,255,0.05)'}`,
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: value > 0 ? '#EFCA29' : 'rgba(255,255,255,0.2)' }}>
                                                        {value > 0 ? `Stage ${value}` : '—'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={saveBuild}
                                            style={{ 
                                                flex: 2, padding: '1.25rem', borderRadius: '1rem', fontWeight: 'bold', 
                                                background: selectedCar.colorCode, color: 'black', border: 'none',
                                                fontSize: '1rem', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                                            }}
                                        >
                                            {saved ? <><CheckCircle size={18} /> BUILD SAVED</> : <><Save size={18} /> SAVE BUILD</>}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={shareBuild}
                                            style={{
                                                flex: 1, padding: '1.25rem', borderRadius: '1rem', fontWeight: 'bold',
                                                background: 'rgba(255,255,255,0.05)', color: 'white',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                fontSize: '0.9rem', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                            }}
                                        >
                                            <Share2 size={16} /> SHARE
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};

const ModSlider = ({ icon, label, level, setLevel, color }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>
            {icon}
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[0, 1, 2, 3].map((l) => (
                <button 
                    key={l}
                    onClick={() => setLevel(l)}
                    style={{ 
                        flex: 1, height: '8px', borderRadius: '4px',
                        background: level >= l ? color : 'rgba(255,255,255,0.1)',
                        border: 'none', transition: 'all 0.3s',
                        cursor: 'pointer'
                    }}
                />
            ))}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: color }}>STAGE {level}</div>
    </div>
);

const StatDisplay = ({ label, oldValue, newValue, unit, inverse }) => {
    const isImproved = inverse ? (parseFloat(newValue) < parseFloat(oldValue)) : (parseFloat(newValue) > parseFloat(oldValue));
    
    return (
        <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{newValue}{unit}</span>
                {isImproved && (
                    <motion.span 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' }}
                    >
                        {inverse ? '↓' : '↑'} {inverse ? (oldValue - newValue).toFixed(2) : (newValue - oldValue)}{unit}
                    </motion.span>
                )}
            </div>
        </div>
    );
};

export default Modification;
